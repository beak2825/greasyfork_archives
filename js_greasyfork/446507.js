// ==UserScript==
// @name        YouTube Sub Feed Filter 2
// @version     1.53
// @description Set up filters for your sub feed
// @author      Callum Latham
// @namespace   https://greasyfork.org/users/696211-ctl2
// @license     MIT
// @match       *://www.youtube.com/*
// @match       *://youtube.com/*
// @exclude     *://www.youtube.com/embed/*
// @exclude     *://youtube.com/embed/*
// @require     https://update.greasyfork.org/scripts/446506/1537901/%24Config.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/446507/YouTube%20Sub%20Feed%20Filter%202.user.js
// @updateURL https://update.greasyfork.org/scripts/446507/YouTube%20Sub%20Feed%20Filter%202.meta.js
// ==/UserScript==

/* global $Config */

(() => {
// Don't run in frames (e.g. stream chat frame)
if (window.parent !== window) {
	// noinspection JSAnnotator
	return;
}

// User config

const LONG_PRESS_TIME = 400;
const REGEXP_FLAGS = 'i';

// Dev config

const VIDEO_TYPE_IDS = {
	GROUPS: {
		ALL: 'All',
		STREAMS: 'Streams',
		PREMIERES: 'Premieres',
		NONE: 'None',
	},
	INDIVIDUALS: {
		STREAMS_SCHEDULED: 'Scheduled Streams',
		STREAMS_LIVE: 'Live Streams',
		STREAMS_FINISHED: 'Finished Streams',
		PREMIERES_SCHEDULED: 'Scheduled Premieres',
		PREMIERES_LIVE: 'Live Premieres',
		SHORTS: 'Shorts',
		FUNDRAISERS: 'Fundraisers',
		NORMAL: 'Basic Videos',
	},
};

const CUTOFF_VALUES = [
	'Minimum',
	'Maximum',
];

const BADGE_VALUES = [
	'Exclude',
	'Include',
	'Require',
];

function getVideoTypes(children) {
	const registry = new Set();
	
	const register = (value) => {
		if (registry.has(value)) {
			throw new Error(`Overlap found at '${value}'.`);
		}
		
		registry.add(value);
	};
	
	for (const {value} of children) {
		switch (value) {
		case VIDEO_TYPE_IDS.GROUPS.ALL:
			Object.values(VIDEO_TYPE_IDS.INDIVIDUALS).forEach(register);
			break;
		
		case VIDEO_TYPE_IDS.GROUPS.STREAMS:
			register(VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_SCHEDULED);
			register(VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_LIVE);
			register(VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_FINISHED);
			break;
		
		case VIDEO_TYPE_IDS.GROUPS.PREMIERES:
			register(VIDEO_TYPE_IDS.INDIVIDUALS.PREMIERES_SCHEDULED);
			register(VIDEO_TYPE_IDS.INDIVIDUALS.PREMIERES_LIVE);
			break;
		
		default:
			register(value);
		}
	}
	
	return registry;
}

const $config = new $Config(
	'YTSFF_TREE',
	(() => {
		const regexPredicate = (value) => {
			try {
				RegExp(value);
			} catch {
				return 'Value must be a valid regular expression.';
			}
			
			return true;
		};
		
		const videoTypeOptions = Object.values({
			...VIDEO_TYPE_IDS.GROUPS,
			...VIDEO_TYPE_IDS.INDIVIDUALS,
		});
		
		return {
			get: (_, configs) => Object.assign(...configs),
			children: [
				{
					label: 'Filters',
					get: (() => {
						const getRegex = ({children}) => children.length === 0 ?
							null :
							new RegExp(children.map(({value}) => `(${value})`).join('|'), REGEXP_FLAGS);
						
						return ({children}) => ({
							filters: children.map(({'children': [channel, video, type]}) => ({
								channels: getRegex(channel),
								videos: getRegex(video),
								types: type.children.length === 0 ? Object.values(VIDEO_TYPE_IDS.INDIVIDUALS) : getVideoTypes(type.children),
							})),
						});
					})(),
					children: [],
					seed: {
						label: 'Filter Name',
						value: '',
						children: [
							{
								label: 'Channel Regex',
								children: [],
								seed: {
									value: '^',
									predicate: regexPredicate,
								},
							},
							{
								label: 'Video Regex',
								children: [],
								seed: {
									value: '^',
									predicate: regexPredicate,
								},
							},
							{
								label: 'Video Types',
								children: [
									{
										value: VIDEO_TYPE_IDS.GROUPS.ALL,
										options: videoTypeOptions,
									},
								],
								seed: {
									value: VIDEO_TYPE_IDS.GROUPS.NONE,
									options: videoTypeOptions,
								},
								childPredicate: (children) => {
									try {
										getVideoTypes(children);
									} catch ({message}) {
										return message;
									}
									
									return true;
								},
							},
						],
					},
				},
				{
					label: 'Cutoffs',
					get: ({children}) => ({
						cutoffs: children.map(({children}) => {
							const boundaries = [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
							
							for (const {'children': [{'value': boundary}, {value}]} of children) {
								boundaries[boundary === CUTOFF_VALUES[0] ? 0 : 1] = value;
							}
							
							return boundaries;
						}),
					}),
					children: [
						{
							label: 'Watched (%)',
							children: [],
							seed: {
								childPredicate: ([{'value': boundary}, {value}]) => {
									if (boundary === CUTOFF_VALUES[0]) {
										return value < 100 ? true : 'Minimum must be less than 100%';
									}
									
									return value > 0 ? true : 'Maximum must be greater than 0%';
								},
								children: [
									{
										value: CUTOFF_VALUES[1],
										options: CUTOFF_VALUES,
									},
									{value: 100},
								],
							},
						},
						{
							label: 'View Count',
							children: [],
							seed: {
								childPredicate: ([{'value': boundary}, {value}]) => {
									if (boundary === CUTOFF_VALUES[1]) {
										return value > 0 ? true : 'Maximum must be greater than 0';
									}
									
									return true;
								},
								children: [
									{
										value: CUTOFF_VALUES[0],
										options: CUTOFF_VALUES,
									},
									{
										value: 0,
										predicate: (value) => Math.floor(value) === value ? true : 'Value must be an integer',
									},
								],
							},
						},
						{
							label: 'Duration (Minutes)',
							children: [],
							seed: {
								childPredicate: ([{'value': boundary}, {value}]) => {
									if (boundary === CUTOFF_VALUES[1]) {
										return value > 0 ? true : 'Maximum must be greater than 0';
									}
									
									return true;
								},
								children: [
									{
										value: CUTOFF_VALUES[0],
										options: CUTOFF_VALUES,
									},
									{value: 0},
								],
							},
						},
					],
				},
				{
					label: 'Badges',
					get: ({children}) => ({badges: children.map(({value}) => BADGE_VALUES.indexOf(value))}),
					children: [
						{
							label: 'Verified',
							value: BADGE_VALUES[1],
							options: BADGE_VALUES,
						},
						{
							label: 'Official Artist',
							value: BADGE_VALUES[1],
							options: BADGE_VALUES,
						},
					],
				},
			],
		};
	})(),
	{
		headBase: '#c80000',
		headButtonExit: '#000000',
		borderHead: '#ffffff',
		borderTooltip: '#c80000',
	},
	{
		zIndex: 10000,
		scrollbarColor: 'initial',
	},
);

const KEY_IS_ACTIVE = 'YTSFF_IS_ACTIVE';

// State

let button;

// Video element helpers

const getAllVideos = () => [...document.getElementById('page-manager').getCurrentPage().contents.ytRendererBehavior.$.primary.firstChild.contentsElement.children]
	.slice(1, -1);

const isShorts = ({data}) => 'shortsLockupViewModel' in data.content;

const isScheduled = (video) => !isShorts(video) && (
	VIDEO_PREDICATES[VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_SCHEDULED](video)
	|| VIDEO_PREDICATES[VIDEO_TYPE_IDS.INDIVIDUALS.PREMIERES_SCHEDULED](video)
);

// Config testers

const getThumbnailBadges = ({data}) => data.content.lockupViewModel?.contentImage.thumbnailViewModel.overlays[0].thumbnailOverlayBadgeViewModel.thumbnailBadges;

const getUploadTime = ({data}) => {
	const metadataParts = data.content.lockupViewModel?.metadata.lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows[1].metadataParts;
	
	return metadataParts && metadataParts[metadataParts.length - 1].text.content;
};

const VIDEO_PREDICATES = {
	[VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_SCHEDULED]: (video) => getUploadTime(video)?.split(' ')[0] === 'Scheduled',
	[VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_LIVE]: (video) => getThumbnailBadges(video)?.[0].thumbnailBadgeViewModel.text === 'LIVE',
	[VIDEO_TYPE_IDS.INDIVIDUALS.STREAMS_FINISHED]: (video) => getUploadTime(video)?.split(' ')[0] === 'Streamed',
	[VIDEO_TYPE_IDS.INDIVIDUALS.PREMIERES_SCHEDULED]: (video) => getUploadTime(video)?.split(' ')[0] === 'Premieres',
	[VIDEO_TYPE_IDS.INDIVIDUALS.PREMIERES_LIVE]: (video) => getThumbnailBadges(video)?.[0].thumbnailBadgeViewModel.text === 'Premiere',
	[VIDEO_TYPE_IDS.INDIVIDUALS.SHORTS]: isShorts,
	[VIDEO_TYPE_IDS.INDIVIDUALS.NORMAL]: (video) => {
		const uploadTime = getUploadTime(video);
		
		return uploadTime?.split(' ')[uploadTime.length - 1] === 'ago';
	},
	// todo
	[VIDEO_TYPE_IDS.INDIVIDUALS.FUNDRAISERS]: (video) => getThumbnailBadges(video)?.[0].thumbnailBadgeViewModel.text === 'Fundraiser',
};

const CUTOFF_GETTERS = [
	// Watched %
	(video) => video.data.content.lockupViewModel?.contentImage.thumbnailViewModel.overlays[0].thumbnailBottomOverlayViewModel?.progressBar?.thumbnailOverlayProgressBarViewModel.startPercent
		?? 0,
	// View count
	(video) => {
		// todo nope
		if (isScheduled(video)) {
			return 0;
		}
		
		const {content} = video.data.content.lockupViewModel?.metadata.lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows[1].metadataParts[0].text
			?? video.data.content.shortsLockupViewModel.overlayMetadata.secondaryText;
		const [valueString] = content.split(' ');
		const lastChar = valueString.slice(-1);
		
		if (/\d/.test(lastChar)) {
			return Number.parseInt(valueString);
		}
		
		const valueNumber = Number.parseFloat(valueString.slice(0, -1));
		
		switch (lastChar) {
		case 'B':
			return valueNumber * 1000000000;
		case 'M':
			return valueNumber * 1000000;
		case 'K':
			return valueNumber * 1000;
		}
		
		return valueNumber;
	},
	// Duration (minutes)
	(video) => {
		const time = getThumbnailBadges(video)?.[0].thumbnailBadgeViewModel.text;
		
		let minutes = 0;
		
		if (time) {
			const timeParts = time.split(':').map((_) => Number.parseInt(_));
			
			let timeValue = 1 / 60;
			
			for (let i = timeParts.length - 1; i >= 0; --i) {
				minutes += timeParts[i] * timeValue;
				
				timeValue *= 60;
			}
		}
		
		return Number.isNaN(minutes) ? 0 : minutes;
	},
];

const hasChannelBadgeName = ({data}, name) => {
	const badges = data.content.lockupViewModel?.metadata.lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows[0].metadataParts[0].text.attachmentRuns;
	
	return Boolean(badges) && badges.some(({element}) => element.type.imageType.image.sources[0].clientResource.imageName === name);
};

const BADGE_PREDICATES = [
	// Verified
	(video) => hasChannelBadgeName(video, 'CHECK_CIRCLE_FILLED'),
	// Official Artist
	(video) => hasChannelBadgeName(video, 'AUDIO_BADGE'),
];

// Hider functions

function shouldHide({filters, cutoffs, badges}, video) {
	try {
		for (let i = 0; i < BADGE_PREDICATES.length; ++i) {
			if (badges[i] !== 1 && Boolean(badges[i]) !== BADGE_PREDICATES[i](video)) {
				return true;
			}
		}
		
		for (let i = 0; i < CUTOFF_GETTERS.length; ++i) {
			const [lowerBound, upperBound] = cutoffs[i];
			const value = CUTOFF_GETTERS[i](video);
			
			if (value < lowerBound || value > upperBound) {
				return true;
			}
		}
		
		const channelName = video.data.content.lockupViewModel?.metadata.lockupMetadataViewModel.metadata.contentMetadataViewModel.metadataRows[0].metadataParts[0].text.content;
		const videoName = video.data.content.lockupViewModel?.metadata.lockupMetadataViewModel.title.content
			?? video.data.content.shortsLockupViewModel.overlayMetadata.primaryText.content;
		
		for (const {'channels': channelRegex, 'videos': videoRegex, types} of filters) {
			if ((!channelRegex || channelName && channelRegex.test(channelName)) && (!videoRegex || videoRegex.test(videoName))) {
				for (const type of types) {
					if (VIDEO_PREDICATES[type](video)) {
						return true;
					}
				}
			}
		}
		
		return false;
	} catch (e) {
		console.error(e);
		debugger;
	}
}

const hideList = (() => {
	const list = [];
	
	let hasReverted = true;
	
	function hide(element, doHide) {
		element.hidden = false;
		
		if (doHide) {
			element.style.display = 'none';
		} else {
			element.style.removeProperty('display');
		}
	}
	
	return {
		'add'(element, doHide = true) {
			if (button.isActive) {
				hasReverted = false;
			}
			
			list.push({element, doHide, wasHidden: element.hidden});
			
			if (button.isActive) {
				hide(element, doHide);
			}
		},
		'revert'(doErase) {
			if (!hasReverted) {
				hasReverted = true;
				
				for (const {element, doHide, wasHidden} of list) {
					hide(element, !doHide);
					
					element.hidden = wasHidden;
				}
			}
			
			if (doErase) {
				list.length = 0;
			}
		},
		'ensure'() {
			if (!hasReverted) {
				return;
			}
			
			hasReverted = false;
			
			for (const {element, doHide} of list) {
				hide(element, doHide);
			}
		},
	};
})();

const showList = (() => {
	const ATTRIBUTE = 'is-in-first-column';
	
	const list = [];
	const observers = [];
	
	let rowLength;
	let rowRemaining = 1;
	let hasReverted = true;
	
	function disconnectObservers() {
		for (const observer of observers) {
			observer.disconnect();
		}
		
		observers.length = 0;
	}
	
	function show(element, isFirst) {
		const act = isFirst ?
			() => element.setAttribute(ATTRIBUTE, true) :
			() => element.removeAttribute(ATTRIBUTE);
		
		act();
		
		const observer = new MutationObserver(() => {
			observer.disconnect();
			
			act();
			
			// Avoids observation cycle that I can't figure out the cause of
			window.setTimeout(() => {
				observer.observe(element, {attributeFilter: [ATTRIBUTE]});
			}, 0);
		});
		
		observer.observe(element, {attributeFilter: [ATTRIBUTE]});
		
		observers.push(observer);
	}
	
	return {
		'add'(element) {
			if (list.length === 0) {
				rowLength = element.itemsPerRow ?? 3;
			}
			
			if (button.isActive) {
				hasReverted = false;
			}
			
			const isFirst = --rowRemaining === 0;
			
			if (isFirst) {
				rowRemaining = rowLength;
			}
			
			list.push({element, isFirst, wasFirst: element.hasAttribute(ATTRIBUTE)});
			
			if (button.isActive) {
				show(element, isFirst);
			}
		},
		'revert'(doErase) {
			if (!hasReverted) {
				hasReverted = true;
				
				disconnectObservers();
				
				for (const {element, wasFirst} of list) {
					show(element, wasFirst);
				}
			}
			
			if (doErase) {
				list.length = 0;
				rowRemaining = 1;
			}
		},
		'ensure'() {
			if (!hasReverted) {
				return;
			}
			
			hasReverted = false;
			
			for (const {element, isFirst} of list) {
				show(element, isFirst);
			}
		},
		'lineFeed'() {
			rowRemaining = 1;
		},
	};
})();

function hideVideo(element, config) {
	// video, else shorts container
	if (element.tagName === 'YTD-RICH-ITEM-RENDERER') {
		if (shouldHide(config, element)) {
			hideList.add(element);
		} else {
			showList.add(element);
		}
		
		return;
	}
	
	let doHide = true;
	
	for (const video of element.querySelectorAll('ytd-rich-item-renderer')) {
		if (shouldHide(config, video)) {
			hideList.add(video);
		} else {
			showList.add(video);
			
			doHide = false;
		}
	}
	
	if (doHide) {
		hideList.add(element);
	} else {
		showList.lineFeed();
	}
}

async function hideVideos(videos = getAllVideos()) {
	const config = $config.get();
	
	for (const video of videos) {
		await Promise.all([
			hideVideo(video, config),
			// Allow the page to update visually before moving on
			new Promise((resolve) => {
				window.setTimeout(resolve, 0);
			}),
		]);
	}
}

// Helpers

function resetConfig(fullReset = true) {
	hideList.revert(fullReset);
	showList.revert(fullReset);
}

function hideFromMutations(mutations) {
	const videos = [];
	
	for (const {addedNodes} of mutations) {
		for (const node of addedNodes) {
			switch (node.tagName) {
			case 'YTD-RICH-ITEM-RENDERER':
			case 'YTD-RICH-SECTION-RENDERER':
				videos.push(node);
			}
		}
	}
	
	hideVideos(videos);
}

function getButtonDock() {
	return document
		.querySelector('ytd-browse[page-subtype="subscriptions"]')
		.querySelector('#contents')
		.querySelector('#title-container')
		.querySelector('#top-level-buttons-computed');
}

// Button

class ClickHandler {
	constructor(button, onShortClick, onLongClick) {
		this.onShortClick = function () {
			onShortClick();
			
			window.clearTimeout(this.longClickTimeout);
			
			window.removeEventListener('mouseup', this.onShortClick);
		}.bind(this);
		
		this.onLongClick = function () {
			window.removeEventListener('mouseup', this.onShortClick);
			
			onLongClick();
		}.bind(this);
		
		this.longClickTimeout = window.setTimeout(this.onLongClick, LONG_PRESS_TIME);
		
		window.addEventListener('mouseup', this.onShortClick);
	}
}

class Button {
	static TEMPLATE = (() => {
		const svgNamespace = 'http://www.w3.org/2000/svg';
		
		const bottom = document.createElementNS(svgNamespace, 'path');
		
		bottom.setAttribute('d', 'M128.25,175.6c1.7,1.8,2.7,4.1,2.7,6.6v139.7l60-51.3v-88.4c0-2.5,1-4.8,2.7-6.6L295.15,65H26.75L128.25,175.6z');
		
		const top = document.createElementNS(svgNamespace, 'rect');
		
		top.setAttribute('x', '13.95');
		top.setAttribute('width', '294');
		top.setAttribute('height', '45');
		
		const g = document.createElementNS(svgNamespace, 'g');
		
		g.appendChild(bottom);
		g.appendChild(top);
		
		const svg = document.createElementNS(svgNamespace, 'svg');
		
		svg.setAttribute('viewBox', '-50 -50 400 400');
		svg.setAttribute('focusable', 'false');
		svg.appendChild(g);
		
		svg.style.width = svg.style.height = '100%';
		svg.style.display = 'inherit';
		
		const wrapper = document.createElement('div');
		
		wrapper.style.width = wrapper.style.height = '100%';
		wrapper.style.display = 'block';
		
		wrapper.appendChild(svg);
		
		return wrapper;
	})();
	
	static CLASS_NAME = 'ytsff-button';
	
	wasActive;
	isActive = false;
	isDormant = false;
	
	constructor() {
		this.element = (() => {
			const {parentElement, 'children': [, openerTemplate]} = getButtonDock();
			const button = openerTemplate.cloneNode(false);
			
			button.classList.add(Button.CLASS_NAME);
			
			if (openerTemplate.innerText) {
				throw new Error('too early');
			}
			
			// 🤷‍♀️
			const policy = trustedTypes?.createPolicy('policy', {createHTML: (string) => string}) ?? {createHTML: (string) => string};
			
			parentElement.appendChild(button);
			
			button.innerHTML = policy.createHTML(openerTemplate.innerHTML);
			
			button.querySelector('yt-button-shape').innerHTML = policy.createHTML(openerTemplate.querySelector('yt-button-shape').innerHTML);
			
			button.querySelector('a').removeAttribute('href');
			
			button.querySelector('.yt-icon-shape').appendChild(Button.TEMPLATE.cloneNode(true));
			
			button.querySelector('tp-yt-paper-tooltip').remove();
			
			return button;
		})();
		
		this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
		
		GM.getValue(KEY_IS_ACTIVE, true).then((isActive) => {
			this.isActive = isActive;
			
			this.update();
			
			const videoObserver = new MutationObserver(hideFromMutations);
			
			videoObserver.observe(
				document.querySelector('ytd-browse[page-subtype="subscriptions"]').querySelector('div#contents'),
				{childList: true},
			);
			
			hideVideos();
		});
		
		let resizeCount = 0;
		
		window.addEventListener('resize', () => {
			const resizeId = ++resizeCount;
			
			this.forceInactive();
			
			const listener = ({detail}) => {
				// column size changed
				if (detail.actionName === 'yt-window-resized') {
					window.setTimeout(() => {
						if (resizeId !== resizeCount) {
							return;
						}
						
						this.forceInactive(false);
						
						// Don't bother re-running filters if the sub page isn't shown
						if (this.isDormant) {
							return;
						}
						
						resetConfig();
						
						hideVideos();
					}, 1000);
					
					document.body.removeEventListener('yt-action', listener);
				}
			};
			
			document.body.addEventListener('yt-action', listener);
		});
	}
	
	forceInactive(doForce = true) {
		if (doForce) {
			// if wasActive isn't undefined, forceInactive was already called
			if (this.wasActive === undefined) {
				// Saves a GM.getValue call later
				this.wasActive = this.isActive;
				this.isActive = false;
			}
		} else {
			this.isActive = this.wasActive;
			this.wasActive = undefined;
		}
	}
	
	update() {
		if (this.isActive) {
			this.setButtonActive();
		}
	}
	
	setButtonActive() {
		if (this.isActive) {
			this.element.querySelector('svg').style.setProperty('fill', 'var(--yt-spec-call-to-action)');
		} else {
			this.element.querySelector('svg').style.setProperty('fill', 'currentcolor');
		}
	}
	
	toggleActive() {
		this.isActive = !this.isActive;
		
		this.setButtonActive();
		
		GM.setValue(KEY_IS_ACTIVE, this.isActive);
		
		if (this.isActive) {
			hideList.ensure();
			showList.ensure();
		} else {
			hideList.revert(false);
			showList.revert(false);
		}
	}
	
	async onLongClick() {
		await $config.edit();
		
		resetConfig();
		
		hideVideos();
	}
	
	onMouseDown(event) {
		if (event.button === 0) {
			new ClickHandler(this.element, this.toggleActive.bind(this), this.onLongClick.bind(this));
		}
	}
}

// Main

(() => {
	const loadButton = async () => {
		if (button) {
			button.isDormant = false;
			
			hideVideos();
			
			return;
		}
		
		try {
			await $config.ready;
		} catch (error) {
			if (!$config.reset) {
				throw error;
			}
			
			if (!window.confirm(`${error.message}\n\nWould you like to erase your data?`)) {
				return;
			}
			
			$config.reset();
		}
		
		let buttonDock;
		
		try {
			buttonDock = getButtonDock();
			
			button = new Button();
		} catch {
			buttonDock?.parentElement.querySelector(`.${Button.CLASS_NAME}`)?.remove();
			
			document.getElementById('page-manager')
				.addEventListener('yt-action', loadButton, {once: true});
		}
	};
	
	const isGridView = () => {
		return Boolean(
			document.querySelector('ytd-browse[page-subtype="subscriptions"]:not([hidden])')
			&& document.querySelector('ytd-browse > ytd-two-column-browse-results-renderer ytd-rich-grid-renderer ytd-rich-item-renderer'),
		);
	};
	
	function onNavigate({detail}) {
		if (detail.endpoint.browseEndpoint) {
			const {params, browseId} = detail.endpoint.browseEndpoint;
			
			// Handle navigation to the sub feed
			if ((params === 'MAE%3D' || !params && (!button || isGridView())) && browseId === 'FEsubscriptions') {
				const emitter = document.querySelector('ytd-app');
				const event = 'yt-action';
				
				if (button || isGridView()) {
					loadButton();
				} else {
					const listener = ({detail}) => {
						if (detail.actionName === 'ytd-update-grid-state-action') {
							if (isGridView()) {
								loadButton();
							}
							
							emitter.removeEventListener(event, listener);
						}
					};
					
					emitter.addEventListener(event, listener);
				}
				
				return;
			}
		}
		
		// Handle navigation away from the sub feed
		if (button) {
			button.isDormant = true;
			
			hideList.revert(true);
			showList.revert(true);
		}
	}
	
	document.body.addEventListener('yt-navigate-finish', onNavigate);
})();
})();
