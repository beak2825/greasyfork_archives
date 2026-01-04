// ==UserScript==
// @name        YouTube Chat Filter
// @version     1.23
// @description Set up filters for stream chats
// @author      Callum Latham
// @namespace   https://greasyfork.org/users/696211-ctl2
// @license     MIT
// @match       *://www.youtube.com/*
// @match       *://youtube.com/*
// @exclude     *://www.youtube.com/embed/*
// @exclude     *://youtube.com/embed/*
// @require     https://update.greasyfork.org/scripts/446506/1537901/%24Config.js
// @require     https://greasyfork.org/scripts/449472-boolean/code/$Boolean.js?version=1081058
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/430172/YouTube%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/430172/YouTube%20Chat%20Filter.meta.js
// ==/UserScript==

/* global $Config */
/* global $Boolean */

(() => {
// Don't run outside the chat frame
if (!window.frameElement || window.frameElement.id !== 'chatframe') {
	// noinspection JSAnnotator
	return;
}

window.addEventListener('load', async () => {
	// STATIC CONSTS
	
	const LONG_PRESS_TIME = 400;
	const ACTIVE_COLOUR = 'var(--yt-spec-call-to-action)';
	const CHAT_LIST_SELECTOR = '#items.yt-live-chat-item-list-renderer';
	const FILTER_CLASS = 'cf';
	const TAGS_FILTERABLE = [
		'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER',
		'YT-LIVE-CHAT-PAID-MESSAGE-RENDERER',
		'YT-LIVE-CHAT-MEMBERSHIP-ITEM-RENDERER',
		'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-PURCHASE-ANNOUNCEMENT-RENDERER',
		'YTD-SPONSORSHIPS-LIVE-CHAT-GIFT-REDEMPTION-ANNOUNCEMENT-RENDERER',
		'YT-LIVE-CHAT-PAID-STICKER-RENDERER',
	];
	const PRIORITIES = {
		VERIFIED: 'Verification Badge',
		MODERATOR: 'Moderator Badge',
		MEMBER: 'Membership Badge',
		LONG: 'Long',
		RECENT: 'Recent',
		SUPERCHAT: 'Superchat',
		STICKER: 'Sticker',
		MEMBERSHIP_RENEWAL: 'Membership Purchase',
		MEMBERSHIP_GIFT_OUT: 'Membership Gift (Given)',
		MEMBERSHIP_GIFT_IN: 'Membership Gift (Received)',
		EMOJI: 'Emojis',
	};
	
	// ELEMENT CONSTS
	
	const STREAMER = window.parent.document.querySelector('#upload-info > #channel-name').innerText;
	const ROOT_ELEMENT = document.body.querySelector('#chat');
	const [BUTTON, SVG, COUNTER] = await (async () => {
		const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
		
		const [button, svgContainer, svg] = await new Promise((resolve) => {
			const template = document.body.querySelector('#live-chat-header-context-menu');
			const button = template.querySelector('button').cloneNode(true);
			const svgContainer = button.querySelector('yt-icon');
			
			button.style.visibility = 'hidden';
			
			button.querySelector('yt-touch-feedback-shape').remove();
			
			template.parentElement.insertBefore(button, template);
			
			window.setTimeout(() => {
				const path = document.createElementNS(SVG_NAMESPACE, 'path');
				
				path.setAttribute('d', 'M128.25,175.6c1.7,1.8,2.7,4.1,2.7,6.6v139.7l60-51.3v-88.4c0-2.5,1-4.8,2.7-6.6L295.15,65H26.75L128.25,175.6z');
				
				const rectangle = document.createElementNS(SVG_NAMESPACE, 'rect');
				
				rectangle.setAttribute('x', '13.95');
				rectangle.setAttribute('y', '0');
				rectangle.setAttribute('width', '294');
				rectangle.setAttribute('height', '45');
				
				const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
				
				svg.setAttribute('viewBox', '-50 -50 400 400');
				svg.setAttribute('x', '0');
				svg.setAttribute('y', '0');
				svg.setAttribute('focusable', 'false');
				
				svg.append(path, rectangle);
				
				svgContainer.innerHTML = trustedTypes?.emptyHTML ?? '';
				svgContainer.append(svg);
				
				button.style.removeProperty('visibility');
				
				button.style.setProperty('display', 'contents');
				
				resolve([button, svgContainer, svg]);
			}, 0);
		});
		
		const counter = (() => {
			const container = document.createElement('div');
			
			container.style.position = 'absolute';
			container.style.left = '9px';
			container.style.bottom = '9px';
			container.style.fontSize = '1.1em';
			container.style.lineHeight = 'normal';
			container.style.width = '1.6em';
			container.style.display = 'flex';
			container.style.alignItems = 'center';
			
			const svg = (() => {
				const circle = document.createElementNS(SVG_NAMESPACE, 'circle');
				
				circle.setAttribute('r', '50');
				circle.style.color = 'var(--yt-live-chat-header-background-color)';
				circle.style.opacity = '0.65';
				
				const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
				
				svg.setAttribute('viewBox', '-70 -70 140 140');
				
				svg.append(circle);
				
				return svg;
			})();
			
			const text = document.createElement('span');
			
			text.style.position = 'absolute';
			text.style.width = '100%';
			text.innerText = '?';
			
			container.append(text, svg);
			
			svgContainer.append(container);
			
			return text;
		})();
		
		return [button, svg, counter];
	})();
	
	// STATE INTERFACES
	
	const $active = new $Boolean('YTCF_IS_ACTIVE');
	
	const $config = new $Config(
		'YTCF_TREE',
		{
			get: ({children: [{children}, {children: [{value: caseSensitive}]}]}, configs) => {
				const filters = [];
				
				const getRegex = caseSensitive ? ({value}) => new RegExp(value) : ({value}) => new RegExp(value, 'i');
				const matchesStreamer = (node) => getRegex(node).test(STREAMER);
				
				for (const filter of children) {
					const [{'children': streamers}, {'children': authors}, {'children': messages}] = filter.children;
					
					if (streamers.length === 0 || streamers.some(matchesStreamer)) {
						filters.push({
							authors: authors.map(getRegex),
							messages: messages.map(getRegex),
						});
					}
				}
				
				return Object.assign({filters}, ...configs);
			},
			children: [
				{
					label: 'Filters',
					children: [],
					seed: {
						label: 'Description',
						value: '',
						children: ['Streamer', 'Author', 'Message'].map((target) => ({
							label: `${target} Regex`,
							children: [],
							seed: {
								value: '^',
								predicate: (value) => {
									try {
										RegExp(value);
									} catch {
										return 'Value must be a valid regular expression.';
									}
									
									return true;
								},
							},
						})),
					},
				},
				{
					label: 'Options',
					children: [
						{
							label: 'Case-Sensitive Regex?',
							value: false,
						},
						{
							label: 'Pause on Mouse Over?',
							value: false,
							get: ({value: pauseOnHover}) => ({pauseOnHover}),
						},
						{
							label: 'Queue Time (ms)',
							value: 0,
							predicate: (value) => value >= 0 ? true : 'Queue time must be positive',
							get: ({value: queueTime}) => ({queueTime}),
						},
					],
				},
				{
					label: 'Preferences',
					children: (() => {
						const EVALUATORS = (() => {
							const getEvaluator = (evaluator, isDesired) => isDesired ? evaluator : (_) => 1 - evaluator(_);
							
							return {
								// Special tests
								[PRIORITIES.RECENT]: getEvaluator.bind(null, () => 1),
								[PRIORITIES.LONG]: getEvaluator.bind(null, (_) => _.querySelector('#message').textContent.length),
								// Tests for message type
								[PRIORITIES.SUPERCHAT]: getEvaluator.bind(null, (_) => _.matches('yt-live-chat-paid-message-renderer')),
								[PRIORITIES.STICKER]: getEvaluator.bind(null, (_) => _.matches('yt-live-chat-paid-sticker-renderer')),
								[PRIORITIES.MEMBERSHIP_RENEWAL]: getEvaluator.bind(null, (_) => _.matches('yt-live-chat-membership-item-renderer')),
								[PRIORITIES.MEMBERSHIP_GIFT_OUT]: getEvaluator.bind(null, (_) => _.matches('ytd-sponsorships-live-chat-gift-purchase-announcement-renderer')),
								[PRIORITIES.MEMBERSHIP_GIFT_IN]: getEvaluator.bind(null, (_) => _.matches('ytd-sponsorships-live-chat-gift-redemption-announcement-renderer')),
								// Tests for descendant element presence
								[PRIORITIES.EMOJI]: getEvaluator.bind(null, (_) => Boolean(_.querySelector('.emoji'))),
								[PRIORITIES.MEMBER]: getEvaluator.bind(null, (_) => Boolean(_.querySelector('#chat-badges > [type=member]'))),
								[PRIORITIES.MODERATOR]: getEvaluator.bind(null, (_) => Boolean(_.querySelector('#chip-badges > [type=verified]'))),
								[PRIORITIES.VERIFIED]: getEvaluator.bind(null, (_) => Boolean(_.querySelector('#chat-badges > [type=moderator]'))),
							};
						})();
						
						const poolId = 0;
						
						return [
							{
								label: 'Requirements',
								get: (_, configs) => ({requirements: Object.assign(...configs)}),
								children: [
									['OR', 'soft'],
									['AND', 'hard'],
								].map(([label, key]) => ({
									label,
									children: [],
									poolId,
									get: ({children}) => ({[key]: children.map(({label, 'value': isDesired}) => EVALUATORS[label](isDesired))}),
								})),
							},
							{
								label: 'Priorities (High to Low)',
								poolId,
								get: ({children}) => {
									const getComparitor = (getValue, low, high) => {
										low = getValue(low);
										high = getValue(high);
										
										return low < high ? -1 : low === high ? 0 : 1;
									};
									
									return {comparitors: children.map(({label, 'value': isDesired}) => getComparitor.bind(null, EVALUATORS[label](isDesired)))};
								},
								children: Object.values(PRIORITIES).map((label) => ({
									label,
									value: label !== PRIORITIES.EMOJI && label !== PRIORITIES.MEMBERSHIP_GIFT_IN,
								})),
							},
						];
					})(),
				},
			],
		},
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
	
	// CSS
	
	(function style() {
		function addStyle(sheet, selector, rules) {
			const ruleString = rules.map(
				([selector, rule]) => `${selector}:${typeof rule === 'function' ? rule() : rule} !important;`,
			);
			
			sheet.insertRule(`${selector}{${ruleString.join('')}}`);
		}
		
		const styleElement = document.createElement('style');
		const {sheet} = document.head.appendChild(styleElement);
		
		const styles = [
			[`${CHAT_LIST_SELECTOR}`, [['bottom', 'inherit']]],
			[`${CHAT_LIST_SELECTOR} > :not(.${FILTER_CLASS})`, [['display', 'none']]],
		];
		
		for (const style of styles) {
			addStyle(sheet, style[0], style[1]);
		}
	})();
	
	// STATE
	
	let queuedPost;
	
	// FILTERING
	
	function doFilter(isInitial = true) {
		const chatListElement = ROOT_ELEMENT.querySelector(CHAT_LIST_SELECTOR);
		
		let doQueue = false;
		let paused = false;
		
		function showPost(post, queueNext) {
			const config = $config.get();
			
			post.classList.add(FILTER_CLASS);
			
			queuedPost = undefined;
			
			if (queueNext && config && config.queueTime > 0) {
				// Start queueing
				doQueue = true;
				
				window.setTimeout(() => {
					doQueue = false;
					
					// Unqueue
					if (!paused) {
						acceptPost();
					}
				}, config.queueTime);
			}
		}
		
		function acceptPost(post = queuedPost, allowQueue = true) {
			if (!post) {
				return;
			}
			
			if (allowQueue && (doQueue || paused)) {
				queuedPost = post;
			} else {
				showPost(post, allowQueue);
			}
		}
		
		window.document.body.addEventListener('mouseenter', () => {
			const config = $config.get();
			
			if (config && config.pauseOnHover) {
				paused = true;
			}
		});
		
		window.document.body.addEventListener('mouseleave', () => {
			const config = $config.get();
			
			paused = false;
			
			if (config && config.pauseOnHover) {
				acceptPost();
			}
		});
		
		function processPost(post, allowQueue = true) {
			const config = $config.get();
			const isFilterable = config && $active.get() && TAGS_FILTERABLE.includes(post.tagName);
			
			if (isFilterable) {
				if (
					config.filters.some((filter) =>
					// Test author filter
						filter.authors.length > 0 && filter.authors.some((_) => _.test(post.querySelector('#author-name')?.textContent))
						// Test message filter
						|| filter.messages.length > 0 && filter.messages.some((_) => _.test(post.querySelector('#message')?.textContent)),
					)
					// Test requirements
					|| config.requirements.soft.length > 0 && !config.requirements.soft.some((passes) => passes(post))
					|| config.requirements.hard.some((passes) => !passes(post))
				) {
					return;
				}
				
				// Test inferior to queued post
				if (queuedPost) {
					for (const comparitor of config.comparitors) {
						const rating = comparitor(post, queuedPost);
						
						if (rating < 0) {
							return;
						}
						
						if (rating > 0) {
							break;
						}
					}
				}
			}
			
			acceptPost(post, isFilterable && allowQueue);
		}
		
		if (isInitial) {
			// Process initial messages
			for (const post of chatListElement.children) {
				processPost(post, false);
			}
			
			// Re-sizes the chat after removing initial messages
			chatListElement.parentElement.style.height = `${chatListElement.clientHeight}px`;
			
			// Restart if the chat element gets replaced
			// This happens when switching between 'Top Chat Replay' and 'Live Chat Replay'
			new MutationObserver((mutations) => {
				for (const {addedNodes} of mutations) {
					for (const node of addedNodes) {
						if (node.matches('yt-live-chat-item-list-renderer')) {
							doFilter(false);
						}
					}
				}
			}).observe(
				ROOT_ELEMENT.querySelector('#item-list'),
				{childList: true},
			);
		}
		
		// Handle new posts
		new MutationObserver((mutations) => {
			for (const {addedNodes} of mutations) {
				for (const addedNode of addedNodes) {
					processPost(addedNode);
				}
			}
		}).observe(
			chatListElement,
			{childList: true},
		);
	}
	
	// MAIN
	
	(() => {
		let timeout;
		
		const updateSvg = () => {
			SVG.style[`${$active.get() ? 'set' : 'remove'}Property`]('color', ACTIVE_COLOUR);
		};
		
		const updateCounter = () => {
			const config = $config.get();
			const count = config ? config.filters.length : 0;
			
			queuedPost = undefined;
			
			COUNTER.style[`${count > 0 ? 'set' : 'remove'}Property`]('color', ACTIVE_COLOUR);
			
			COUNTER.innerText = `${count}`;
		};
		
		const onShortClick = (event) => {
			if (timeout && event.button === 0) {
				timeout = window.clearTimeout(timeout);
				
				$active.toggle();
				
				updateSvg();
			}
		};
		
		const onLongClick = () => {
			timeout = undefined;
			
			$config.edit()
				.then(updateCounter)
				.catch(({message}) => {
					if (window.confirm(`${message}\n\nWould you like to erase your data?`)) {
						$config.reset();
						
						updateCounter();
					}
				});
		};
		
		Promise.all([
			$active.init()
				.then(updateSvg),
			$config.ready
				.catch(async (e) => {
					const tree = await GM.getValue('YTCF_TREE');
					const {children} = tree.children[2].children[1];
					
					if (children.some(({label}) => label === PRIORITIES.STICKER)) {
						throw e;
					}
					
					// Copy superchat info onto new sticker entry
					const refIndex = children.findIndex(({label}) => label === PRIORITIES.SUPERCHAT);
					
					// Try fixing error by adding the new 'Sticker' entry to the 'priorities' subtree
					children.splice(refIndex, 0, {
						label: PRIORITIES.STICKER,
						value: children[refIndex].value,
					});
					
					await GM.setValue('YTCF_TREE', tree);
					
					await $config.ready;
				})
				.finally(updateCounter),
		])
			.then(() => {
				// Start filtering
				doFilter();
				
				// Add short click listener
				BUTTON.addEventListener('mouseup', onShortClick);
				
				// Add long click listener
				BUTTON.addEventListener('mousedown', (event) => {
					if (event.button === 0) {
						timeout = window.setTimeout(onLongClick, LONG_PRESS_TIME);
					}
				});
			});
	})();
});
})();
