// ==UserScript==
// @name           Twitch [Chatters Count]
// @name:pl        Twitch [Ilość Czatowników]
// @description    Shows the amount of people in the chat
// @description:pl Pokazuje liczbę użytkowników na czacie
// @version        1.2.1
// @author         Pabli
// @namespace      https://github.com/pabli24
// @homepageURL    https://github.com/pabli24/twitch-chatters-count
// @supportURL     https://github.com/pabli24/twitch-chatters-count/issues
// @license        MIT
// @match          https://www.twitch.tv/*
// @match          https://m.twitch.tv/*
// @icon           data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iI2ZmODI4MCIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMTU2LjYgMTk2LjNhOTkuNCA5OS40IDAgMSAxIDEyMy4xIDk2LjUgMzkuNyAzOS43IDAgMCAwIDM1LjkgMjIuN2gxOS45YTU5LjYgNTkuNiAwIDAgMSA1OS42IDU5LjZ2MzkuOGgtMzkuOHYtMzkuOGMwLTExLTguOS0xOS45LTE5LjktMTkuOWgtMTkuOWE3OS40IDc5LjQgMCAwIDEtNTkuNi0yNi45IDc5LjUgNzkuNSAwIDAgMS01OS42IDI2LjloLTE5LjljLTExIDAtMTkuOSA4LjktMTkuOSAxOS45djM5LjhoLTM5Ljh2LTM5LjhhNTkuNiA1OS42IDAgMCAxIDU5LjYtNTkuNmgxOS45YzE1LjQgMCAyOS40LTguOCAzNS45LTIyLjdhOTkuNCA5OS40IDAgMCAxLTc1LjctOTYuNlpNMjU2IDI1NmE1OS42IDU5LjYgMCAxIDEgMC0xMTkuMiA1OS42IDU5LjYgMCAwIDEgMCAxMTkuMloiLz48cGF0aCBmaWxsPSIjZmY4MjgwIiBkPSJNMCA1MTJWMGgxMTYuOHYzNi4xSDQzLjN2NDQxLjNoNzMuNlY1MTJIMFpNNTEyIDB2NTEySDM5NS4ydi0zNi4xaDczLjZWMzQuNmgtNzMuNlYwSDUxMloiLz48L3N2Zz4=
// @run-at         document-end
// @grant          GM_info
// @grant          GM_notification
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/523249/Twitch%20%5BChatters%20Count%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/523249/Twitch%20%5BChatters%20Count%5D.meta.js
// ==/UserScript==

(async () => {
'use strict';

let settings = {
	previewCards: {
		value: await GM_getValue('previewCards', true),
		label: 'Show for preview cards in the main/directory page',
	},
	underPlayer: {
		value: await GM_getValue('underPlayer', true),
		label: 'Show under the player next to the viewer count',
	},
	theatreMode: {
		value: await GM_getValue('theatreMode', true),
		label: 'Show in the theatre mode when mousing over the player',
	},
	topChat: {
		value: await GM_getValue('topChat', false),
		label: 'Show at the top of the chat',
	},
	numberFormat: {
		value: await GM_getValue('numberFormat', true),
		label: 'Number format based on your language (en-US if disabled)',
	},
};
let menuCommands = {};
async function updateMenu() {
	Object.keys(menuCommands).forEach(key => GM_unregisterMenuCommand(menuCommands[key]));
	Object.entries(settings).forEach(([key, config]) => {
		menuCommands[key] = GM_registerMenuCommand(
			`${config.value ? '☑' : '☐'} ${config.label}`,
			async () => {
				settings[key].value = !settings[key].value;
				await GM_setValue(key, settings[key].value);
				GM_notification(`${config.label} is now ${config.value ? 'enabled' : 'disabled'}`, GM_info.script.name, GM_info.script.icon);
				updateMenu();
			}
		);
	});
}
updateMenu();

let updater = null;
let currentChannel = '';
const isMobile = window.location.host === 'm.twitch.tv' ? true : false;

setInterval(() => {
	const path = window.location.pathname;
	
	if (settings.previewCards.value && (path === '/' || path.startsWith('/directory'))) {
		checkForNewCards(path);
		return;
	}
	
	let channelName = path.split('/')[1];
	if (!channelName || ['videos', 'settings', 'subscriptions', 'inventory', 'wallet', 'privacy', 'turbo', 'downloads', 'p', 'annual-recap'].includes(channelName)) return;
	
	if (channelName === 'popout') {
		channelName = path.split('/')[2];
	}
	
	if (currentChannel !== channelName) {
		currentChannel = channelName;
		if (updater) {
			clearInterval(updater);
			updater = null;
		}
	}
	
	if (settings.underPlayer.value) {
		chattersCount();
		ffzChattersCount();
	} else if (ct) {
		ct.remove();
		ct = null;
		ffzCt.remove();
		ffzCt = null;
	}
	if (settings.theatreMode.value) {
		tmChattersCount();
	} else if (tmCt) {
		tmCt.remove();
		tmCt = null;
	}
	if (settings.topChat.value) {
		chatChattersCount();
	} else if (chatCt) {
		chatCt.remove();
		chatCt = null;
	}
	
	if (!updater) {
		updateCount(channelName);
		updater = setInterval(() => updateCount(channelName), 60000);
	}
}, 1234);

let ct = null;
let tmCt = null;
let chatCt = null;
let ffzCt = null;
let chatters = '⏳';

async function updateCount(channelName) {
	chatters = await getChatters(channelName);
	
	[ct, tmCt, chatCt, ffzCt].forEach(el => { 
		if (el) el.textContent = `[${chatters}]`;
	});
}

function createChattersCounter(id) {
	const counter = document.createElement('span');
	const lang = document.documentElement.getAttribute('lang') || 'en-US';
	
	counter.id = id;
	counter.title = lang === 'pl-PL' ? 'Ilość Czatowników' : 'Chatters Count';
	counter.textContent = `[${chatters}]`;
	counter.style.cssText = `
		color: var(--color-text-live, #ff8280);
		font-size: var(--font-size-base, 1.3rem);
		font-weight: var(--font-weight-semibold, 600);
		font-feature-settings: "tnum";
		line-height: var(--line-height-body, 1.5);
		margin-left: 0.5rem;
		align-content: center;
	`;
	return counter;
}

function chattersCount() {
	ct = document.getElementById('chatters-count');
	if (ct != null) return;
	const viewersCount = !isMobile
		? document.querySelector('main [data-a-target="animated-channel-viewers-count"]')?.parentElement
		: document.querySelector('#channel-player [data-a-target="tw-stat-value"]')?.parentElement;
	if (!viewersCount) return;
	
	ct = createChattersCounter('chatters-count');
	viewersCount.appendChild(ct);
}

function tmChattersCount() {
	tmCt = document.getElementById('tm-chatters-count');
	if (tmCt != null) return;
	const tmInfoCard = document.querySelector('p[data-test-selector="stream-info-card-component__description"]');
	if (!tmInfoCard) return;
	
	tmCt = createChattersCounter('tm-chatters-count');
	tmInfoCard.appendChild(tmCt);
}

function chatChattersCount() {
	chatCt = document.getElementById('chat-chatters-count');
	if (chatCt != null) return;
	const chatHeader = document.querySelector('button[data-test-selector="chat-viewer-list"]')?.parentElement;
	if (!chatHeader) return;
	
	chatCt = createChattersCounter('chat-chatters-count');
	chatHeader.prepend(chatCt);
}

function ffzChattersCount() {
	ffzCt = document.getElementById('ffz-chatters-count');
	if (ffzCt != null) return;
	
	setTimeout(() => {
		const ffzAlternativeViewerCount = document.querySelector('main .ffz--meta-tray [data-key="viewers"]')
		if (!ffzAlternativeViewerCount) return;

		ffzCt = createChattersCounter('ffz-chatters-count');
		ffzCt.style.order = '1';
		ffzAlternativeViewerCount.appendChild(ffzCt);
	}, 500);
}

function checkForNewCards(path) {
	let previewCards = null;
	
	if (!isMobile) {
		previewCards = document.querySelectorAll('a[data-a-target="preview-card-image-link"]');
	} else {
		if (path.startsWith('/directory/following')) {
			previewCards = document.querySelectorAll('main > div > div > h2 + div:first-of-type > div');
		} else {
			previewCards = document.querySelectorAll('main article');
		}
	}
	
	previewCards.forEach(addChattersToCard);
}

async function addChattersToCard(card) {
	const cardStat = card.querySelector('div.tw-media-card-stat');
	if (!cardStat || card.dataset.chattersCount === 'true' || card.dataset.chattersLoading === 'true') return;
	
	card.dataset.chattersCount = 'true';
	
	const channelName = card.getAttribute('href')?.slice(1) || card.querySelector('a.tw-link')?.getAttribute('href')?.slice(1);
	if (!channelName || channelName.startsWith("videos/")) return;
	
	const counter = document.createElement('span');
	counter.className = 'directory-chatters-count';
	counter.style.paddingLeft = '0.4rem';
	
	const count = await getChatters(channelName);
	counter.textContent = `[${count}]`;
	
	cardStat.appendChild(counter);
}

async function getChatters(channel) {
	const lang = settings.numberFormat.value ? document.documentElement.getAttribute('lang') : 'en-US';
	
	const data = await graphqlQuery(query, { name: channel });
	const count = data?.data?.channel?.chatters?.count;
	
	return count != null && !isNaN(count) ? new Intl.NumberFormat(lang || 'en-US').format(count) : 'N/A';
}

const query = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: {
				kind: 'Name',
				value: 'GetChannelChattersCount',
			},
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: {
						kind: 'Variable',
						name: {
							kind: 'Name',
							value: 'name',
						},
					},
					type: {
						kind: 'NonNullType',
						type: {
							kind: 'NamedType',
							name: {
								kind: 'Name',
								value: 'String',
							},
						},
					},
					directives: [],
				},
			],
			directives: [],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: {
							kind: 'Name',
							value: 'channel',
						},
						arguments: [
							{
								kind: 'Argument',
								name: {
									kind: 'Name',
									value: 'name',
								},
								value: {
									kind: 'Variable',
									name: {
										kind: 'Name',
										value: 'name',
									},
								},
							},
						],
						directives: [],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{
									kind: 'Field',
									name: {
										kind: 'Name',
										value: 'chatters',
									},
									arguments: [],
									directives: [],
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: {
													kind: 'Name',
													value: 'count',
												},
												arguments: [],
												directives: [],
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
	loc: {
		start: 0,
		end: 191,
	},
};

// https://github.com/night/betterttv/blob/master/src/utils/twitch.js
function searchReactChildren(node, predicate, maxDepth = 15, depth = 0) {
	try {
		if (predicate(node)) {
			return node;
		}
	} catch (_) {}
	
	if (!node || depth > maxDepth) {
		return null;
	}
	
	const {child, sibling} = node;
	if (child || sibling) {
		return (
			searchReactChildren(child, predicate, maxDepth, depth + 1) ||
			searchReactChildren(sibling, predicate, maxDepth, depth + 1)
		);
	}
	
	return null;
}

function getReactRoot(element) {
	for (const key in element) {
		if (key.startsWith('_reactRootContainer') || key.startsWith('__reactContainer$')) {
			return element[key];
		}
	}
	
	return null;
}

function getApolloClient() {
	let client;
	try {
		const reactRoot = getReactRoot(document.getElementById('root'));
		const node = searchReactChildren(
			reactRoot?._internalRoot?.current ?? reactRoot,
			(n) => n.pendingProps?.value?.client
		);
		client = node.pendingProps.value.client;
	} catch (_) {}
	
	return client;
}

async function graphqlQuery(query, variables, options = {}) {
	const client = getApolloClient();
	if (!client) return;
	
	return client.query({ query, variables, ...options });
}

})();
