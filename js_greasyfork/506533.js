// ==UserScript==
// @name        [PS] Homepage Enhancements
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.14
// @description Improves the Pokémon Showdown homepage.
// @match       https://play.pokemonshowdown.com/*
// @exclude     https://play.pokemonshowdown.com/sprites/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/506533/%5BPS%5D%20Homepage%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/506533/%5BPS%5D%20Homepage%20Enhancements.meta.js
// ==/UserScript==

const main = () => {
	// The gap between .leftmenu and its surrounding elements
	const GAP_MAIN = 20;
	// The gap between .pm-window elements
	const GAP_PM = 10;
	// The gap between the edge of .pmbox and .pm-window
	const GAP_PMBOX = 10;
	// The height of #header
	const HEIGHT_HEADER = 50;
	// The height of .maintabbarbottom (height=6px + top or bottom border=1px)
	const HEIGHT_STRIP = 7;
	// The width of .mainmenu
	const WIDTH_BATTLE = 270;
	// The width of .pm-window
	const WIDTH_PM = 270;
	
	const room = window.app.rooms[''];
	
	const addResizeListener = (() => {
		const TIMEOUT_DURATION = 20;
		
		return (listener, target) => {
			let isQueueing = false;
			
			const callback = () => {
				if (isQueueing) {
					return;
				}
				
				isQueueing = true;
				
				window.setTimeout(() => {
					isQueueing = false;
					
					listener();
				}, TIMEOUT_DURATION);
			};
			
			if (target) {
				(new ResizeObserver(callback)).observe(target);
			} else {
				window.addEventListener('resize', callback);
			}
		};
	})();
	
	const styleSheet = (() => {
		const styleElement = document.createElement('style');
		
		document.head.appendChild(styleElement);
		
		return styleElement.sheet;
	})();
	
	// Style changes
	(() => {
		for (const rule of [
			
			// Header
			
			['body > #header', [['z-index', '1']]],
			
			// Content
			
			['#room-.ps-room', [
				['top', `${HEIGHT_HEADER}px`],
				['height', `calc(100% - ${HEIGHT_HEADER + 2}px)`],
				['scrollbar-width', 'none'],
			]],
			['.mainmenuwrapper', [
				['display', 'flex'],
				['align-items', 'center'],
				['width', '100%'],
				['height', '100%'],
			]],
			['.leftmenu', [
				['display', 'flex'],
				['flex-wrap', 'nowrap'],
				['flex-direction', 'row-reverse'],
				['width', '100%'],
				['height', '100%'],
				['box-sizing', 'border-box'],
				['padding', '0px'],
				['padding', `${GAP_MAIN + HEIGHT_STRIP - 1}px 0`],
			]],
			['.activitymenu', [['display', 'contents']]],
			['.pmbox', [
				['flex-grow', '1'],
				['display', 'flex'],
				['flex-direction', 'column'],
				['height', '100%'],
				['flex-wrap', 'wrap'],
				['overflow', 'auto'],
				['background', 'rgba(0, 0, 0, .2)'],
				['border-radius', '20px'],
				['padding', `${GAP_PMBOX}px`],
				['align-content', 'flex-start'],
				['margin-right', `${GAP_MAIN}px`],
				['box-sizing', 'border-box'],
				['align-items', 'center'],
				['scroll-snap-type', 'x mandatory'],
				['scroll-snap-stop', 'always'],
			]],
			['.pmbox:has( .pm-notifying)', [
				['background', 'rgba(37, 125, 123, 0.2)'],
			]],
			['.pmbox > *', [
				['scroll-snap-align', 'start'],
				['scroll-margin', `${GAP_PMBOX * 2}px`],
				['width', `${WIDTH_PM}px`],
				['max-width', `calc(100% - ${GAP_PMBOX * 2}px)`],
				['margin', `${GAP_PM}px`],
				['overflow', 'hidden'],
			]],
			['.pm-log', [
				['max-height', `calc(100% - ${GAP_PMBOX * 2 + 2}px) !important`], // Overwrites an element style. header=22px
				['min-height', '0'],
				['width', '100%'],
				['box-sizing', 'border-box'],
				// Fixes an issue with the element failing to lose its scrollbar when it no longer needs it
				['scrollbar-gutter', 'stable'],
				['overflow-x', 'hidden'],
			]],
			// Handle parent's scrollbar-gutter value
			['.pm-window > .pm-log > *', [ // needs extra specificity to override padding on .pm-log .inner
				['width', 'calc(100% + 30px)'],
				['box-sizing', 'border-box'],
				['padding-right', '35px'],
			]],
			['.pm-log:has(+ .pm-log-add)', [
				['max-height', 'calc(100% - 52px) !important'], // Overwrites an element style. header=22px + .pm-log-add=30px
			]],
			['.mainmenu', [
				['width', `${WIDTH_BATTLE}px`],
				['padding', '0'],
				['margin', `0 ${GAP_MAIN}px`],
				['height', '100%'],
				['display', 'flex'],
				['flex-direction', 'column'],
				['overflow-y', 'auto'],
				['scrollbar-width', 'none'],
				['background', 'rgba(0, 0, 0, .2)'],
				['border-radius', '20px'],
				['justify-content', 'space-evenly'],
				['flex-flow', 'wrap'],
			]],
			['.mainmenu > .menugroup', [
				['background', 'none'],
				['margin', '0'],
				['padding', '0'],
				// Prevent wrapping
				['width', '100%'],
				['max-width', 'unset'],
			]],
			['.mainmenu > .menugroup > p', [['margin-top', '-1px']]],
			['.mainmenu > .menugroup > p > button:hover', [['box-shadow', 'inset rgba(0, 0, 0, 0.09) 0 0 0 12pt']]],
			['.mainmenu > .menugroup > p > button:not(:hover)', [['box-shadow', 'inset rgba(0, 0, 0, 0.14) 0 0 0 12pt']]],
			['.dark > body .mainmenufooter', [['background', 'rgba(0, 0, 0, .3)']]],
			[':not(.dark) > body .mainmenufooter', [
				['background', 'url(../fx/client-topbar-bg.png) repeat-x left top scroll'],
				['text-shadow', 'rgb(255 255 255) 0px 0px 3px, rgb(255 255 255) 0px 0px 3px, rgb(255 255 255) 0px 0px 3px'],
				['color', 'black'],
			]],
			
			// Footer
			
			['.mainmenufooter', [
				['height', `${HEIGHT_HEADER}px`],
				['bottom', `-${HEIGHT_HEADER}px`],
				['width', '100%'],
				['left', '0'],
				['display', 'flex'],
				['flex-direction', 'row-reverse'],
			]],
			['.bgcredit.roomtab.button', [
				['overflow-y', 'hidden'],
				['display', 'flex'],
				['align-items', 'center'],
				['max-width', '150px'],
			]],
			['.bgcredit.roomtab.button *', [
				['border', 'none'],
			]],
			['.bgcredit.roomtab.button a', [
				['padding', '0'],
				['margin', '0'],
			]],
			['.bgcredit.roomtab.button > small', [
				['font-size', '12pt'],
				['width', '100%'],
			]],
			['.bgcredit.roomtab.button small', [
				['display', 'block'],
				['text-overflow', 'ellipsis'],
				['contain', 'content'],
				['white-space', 'pre'],
			]],
			['.bgcredit.roomtab.button:empty', [['display', 'none']]],
			['.mainmenufooter > small', [
				['flex-grow', '1'],
				['display', 'flex'],
				['font-size', '0'],
				['border-top', '1px solid #34373b'],
				['justify-content', 'center'],
				['max-width', '100%'],
				['contain', 'size'],
			]],
			['.dark > body .mainmenufooter a, .dark > body .mainmenufooter a:visited', [['color', '#fff']]],
			['.dark > body .mainmenufooter > small a, .dark > body .mainmenufooter > .bgcredit', [
				['box-shadow', 'inset 0.5px -0.5px 1px 0.5px rgba(255, 255, 255, .5)'],
			]],
			[':not(.dark) > body .mainmenufooter a, :not(.dark) > body .mainmenufooter a:visited', [['color', '#222']]],
			[':not(.dark) > body .mainmenufooter > small a, :not(.dark) > body .mainmenufooter > .bgcredit', [
				['box-shadow', 'inset 0.5px -0.5px 1px 0.5px rgba(255, 255, 255, .5)'],
			]],
			['.mainmenufooter a, .bgcredit.roomtab.button', [
				['font-size', '12pt'],
				['text-align', 'center'],
				['text-decoration', 'none'],
				['border-radius', '0'],
				['margin', '0'],
				['padding', '4px 12px'],
			]],
			['.mainmenufooter > small > a', [
				['height', '28px'],
			]],
			['.mainmenufooter a:hover', [['text-decoration', 'none']]],
			['.mainmenufooter > small a:first-of-type', [['border-bottom-left-radius', '5px']]],
			['.mainmenufooter > small a:last-of-type', [
				['border-bottom-right-radius', '5px'],
				['overflow-x', 'hidden'],
				['white-space', 'pre'],
				['text-overflow', 'ellipsis'],
			]],
			// tiny-layout
			['.tiny-layout .mainmenufooter a', [['font-size', '10px']]],
			['.tiny-layout .bgcredit.roomtab.button', [['display', 'none']]],
			['.ps-room.tiny-layout .pmbox > *', [
				['margin', `${GAP_PM}px`],
			]],
			['.tiny-layout .leftmenu', [
				['width', '100%'],
				['max-width', '100%'],
				['padding', `${GAP_MAIN + HEIGHT_STRIP - 1}px 0`],
			]],
		]) {
			styleSheet.insertRule(`${rule[0]}{${rule[1].map(([property, value]) => `${property}:${value};`).join('')}}`);
		}
		
		for (const button of [...document.querySelectorAll('.mainmenufooter > small > a'), ...document.querySelectorAll('.mainmenufooter > .bgcredit')]) {
			button.classList.add('roomtab', 'button');
		}
	})();
	
	// Pmbox scroll handling
	(() => {
		const pmbox = room.$pmBox[0];
		
		// Stick viewport to the left side when windows are added
		
		let scrollLeft = pmbox.scrollLeft;
		
		pmbox.addEventListener('scroll', () => {
			scrollLeft = pmbox.scrollLeft;
		});
		
		(new MutationObserver(() => {
			if (scrollLeft <= GAP_PMBOX * 2) {
				pmbox.scrollLeft = scrollLeft;
			}
		})).observe(pmbox, {childList: true});
		
		// Include challenge elements in vertical scrolling
		
		for (const challenge of pmbox.querySelectorAll('.challenge')) {
			const log = challenge.nextSibling;
			
			log.insertBefore(challenge, log.firstChild);
		}
		
		const challengeGetter = window.MainMenuRoom.prototype.openChallenge;
		
		window.MainMenuRoom.prototype.openChallenge = function (...args) {
			const challenge = challengeGetter.call(this, ...args);
			const log = challenge[0].nextSibling;
			
			log.insertBefore(challenge[0], log.firstChild);
			
			return challenge;
		};
	})();
	
	// Footer extras
	(() => {
		// Helpers
		
		const getButton = () => {
			const button = document.createElement('img');
			
			button.classList.add('icon', 'button');
			
			button.style.margin = '0 3px';
			button.style.height = '21px';
			button.style.borderRadius = '5px';
			button.style.cursor = 'pointer';
			button.style.padding = '2px';
			button.style.boxShadow = '.5px 1px 2px rgba(255, 255, 255, .45), inset .5px 1px 1px rgba(255, 255, 255, .5)';
			
			return button;
		};
		
		// Setup container
		
		const container = document.createElement('div');
		
		container.style.fontSize = '12pt';
		container.style.flexGrow = '1';
		container.style.margin = `0 ${GAP_MAIN}px`;
		container.style.display = 'flex';
		container.style.alignItems = 'center';
		
		(() => {
			const source = document.querySelector('.leftmenu');
			const width = 870;
			
			let isShown = source.clientWidth >= width;
			
			addResizeListener(() => {
				const doShow = source.clientWidth >= width;
				
				if (doShow !== isShown) {
					isShown = doShow;
					
					container.style.display = doShow ? 'flex' : 'none';
				}
			}, source);
			
			container.style.display = isShown ? 'flex' : 'none';
		})();
		
		// Setup text
		
		const textCredit = document.createElement('span');
		
		textCredit.style.marginLeft = '6px';
		textCredit.style.whiteSpace = 'pre';
		
		textCredit.innerText = 'Script by ';
		
		const textName = document.createElement('span');
		
		textName.style.color = '#258f14';
		textName.style.fontWeight = 'bold';
		
		textName.innerText = 'indigeau';
		
		// Setup pm button
		
		const psButton = getButton();
		
		psButton.src = 'https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com';
		
		psButton.addEventListener('click', () => {
			room.focusPM('indigeau');
		});
		
		// Setup feedback button
		
		const gfButton = getButton();
		
		gfButton.src = 'https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org';
		
		gfButton.addEventListener('click', () => {
			open('https://greasyfork.org/en/scripts/506533-ps-homepage-enhancements/feedback');
		});
		
		// Setup seperator
		
		const tabBar = document.createElement('div');
		
		tabBar.classList.add('maintabbarbottom');
		
		tabBar.style.top = `-${HEIGHT_STRIP - 1}px`;
		
		// Add to DOM
		
		const footer = document.querySelector('.mainmenufooter');
		const parent = footer.lastElementChild;
		
		container.append(psButton, gfButton, textCredit, textName);
		
		parent.insertBefore(container, parent.firstChild);
		
		footer.append(tabBar);
	})();
	
	// Sidebar
	(() => {
		const ID_SIDEBAR = 'home-style-sidebar';
		const CLASS_CONTAINER = 'home-style-container';
		const CLASS_IMAGE = 'home-style-image';
		const CLASS_BORDER_LEFT = 'home-style-border-l';
		const CLASS_BORDER_RIGHT = 'home-style-border-r';
		const CLASS_BACKGROUND = 'home-style-background';
		
		const CLASS_WIDE = 'home-style-wide';
		const CLASS_TALL = 'home-style-tall';
		const CLASS_TINY = 'home-style-tiny';
		
		const CLASS_SPLIT = 'home-style-col';
		
		// The px width of the sidebar in landscape
		const WIDTH_SIDEBAR = 100;
		// The px thickness of image borders
		const SIZE_BORDER = 8;
		// The angle of slant in split view
		const SKEW = 15;
		
		for (let rule of [
			// backgrounds
			[`.${CLASS_BORDER_LEFT}, .${CLASS_BORDER_RIGHT}`, [
				['border-color', 'rgb(0, 0, 0, 0.2)'],
				['border-style', 'solid'],
				['position', 'absolute'],
				['height', '100%'],
				['box-sizing', 'border-box'],
			]],
			[`:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER} > .${CLASS_BORDER_LEFT},
				:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER} > .${CLASS_BORDER_RIGHT}`, [
				['width', '50%'],
			]],
			[`.${CLASS_BORDER_LEFT}, .${CLASS_CONTAINER}:nth-child(2n) > .${CLASS_BACKGROUND}`, [
				['left', '0'],
			]],
			[`.${CLASS_BORDER_RIGHT}, .${CLASS_CONTAINER}:nth-child(2n + 1) > .${CLASS_BACKGROUND}`, [
				['right', '0'],
			]],
			[`.${CLASS_CONTAINER}:first-child > .${CLASS_BORDER_LEFT}`, [
				['border-top-left-radius', '20px'],
			]],
			[`:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER}:first-child > .${CLASS_BORDER_RIGHT},
				.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2) > .${CLASS_BORDER_RIGHT}`, [
				['border-top-right-radius', '20px'],
			]],
			[`:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER}:last-child > .${CLASS_BORDER_LEFT},
				.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(5) > .${CLASS_BORDER_LEFT}`, [
				['border-bottom-left-radius', '20px'],
			]],
			[`.${CLASS_CONTAINER}:last-child > .${CLASS_BORDER_RIGHT}`, [
				['border-bottom-right-radius', '20px'],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n + 1) > .${CLASS_BORDER_LEFT},
				.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n) > .${CLASS_BORDER_RIGHT},
				.${CLASS_SPLIT} > .${CLASS_CONTAINER} > .${CLASS_IMAGE}`, [
				['transform', `skewX(${-SKEW}deg)`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER} > .${CLASS_BORDER_LEFT}`, [
				['border-width', `${SIZE_BORDER}px 0 ${SIZE_BORDER}px ${SIZE_BORDER}px`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER} > .${CLASS_BORDER_RIGHT}`, [
				['border-width', `${SIZE_BORDER}px ${SIZE_BORDER}px ${SIZE_BORDER}px 0`],
			]],
			[`:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER} > .${CLASS_BORDER_LEFT}`, [
				['border-width', `${SIZE_BORDER}px 0 ${SIZE_BORDER}px ${SIZE_BORDER}px`],
			]],
			[`:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER} > .${CLASS_BORDER_RIGHT}`, [
				['border-width', `${SIZE_BORDER}px ${SIZE_BORDER}px ${SIZE_BORDER}px 0`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n + 1) > .${CLASS_BORDER_LEFT}`, [
				['width', `calc(${100 - SKEW}% - ${SIZE_BORDER}px)`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n) > .${CLASS_BORDER_RIGHT}`, [
				['width', `calc(${100 + SKEW}% + ${SIZE_BORDER}px)`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n + 1) > .${CLASS_BORDER_RIGHT},
				.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n) > .${CLASS_BORDER_LEFT}`, [
				['width', '0'],
				['height', `calc(100% - ${SIZE_BORDER * 2 - 0.3}px)`],
				['top', `${SIZE_BORDER}px`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER} > .${CLASS_IMAGE}`, [
				['padding', `${SIZE_BORDER + 4}px`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n + 1) > .${CLASS_IMAGE}`, [
				['padding-right', `calc(${SKEW}% - ${SIZE_BORDER * (100 - SKEW) / 100}px)`],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2n) > .${CLASS_IMAGE}`, [
				['padding-left', `calc(${SKEW}% - ${SIZE_BORDER * (100 - SKEW) / 100}px)`],
			]],
			[`:not(.${CLASS_SPLIT}) > .${CLASS_CONTAINER} > .${CLASS_IMAGE}`, [
				['padding', `${SIZE_BORDER}px`],
			]],
			[`#${ID_SIDEBAR}`, [
				['overflow', 'hidden'],
				['margin-left', `${GAP_MAIN}px`],
				['border-radius', '20px'],
				['display', 'grid'],
			]],
			[`#${ID_SIDEBAR}:not(.${CLASS_SPLIT})`, [
				['grid-auto-rows', `${100 / 6}%`],
				['grid-auto-columns', '100%'],
			]],
			[`#${ID_SIDEBAR}.${CLASS_SPLIT}`, [
				['grid-auto-rows', `${100 / 3}%`],
				['grid-auto-columns', '50%'],
			]],
			[`#${ID_SIDEBAR}.${CLASS_SPLIT} > .${CLASS_CONTAINER}:nth-child(2)`, [
				['grid-column', '2'],
			]],
			[`.${CLASS_CONTAINER}`, [
				['cursor', 'pointer'],
				['color', 'rgb(0, 0, 0, 0.2)'],
				['position', 'relative'],
			]],
			[`.${CLASS_CONTAINER} > :not(.${CLASS_BACKGROUND})`, [
				['pointer-events', 'none'],
			]],
			[`.${CLASS_BACKGROUND}`, [
				['position', 'absolute'],
				['width', `calc(100% + ${Math.tan(Math.PI * SKEW / 180) * 16}vh)`],
				['height', '100%'],
				['background-color', 'currentcolor'],
			]],
			[`.${CLASS_SPLIT} > .${CLASS_CONTAINER}`, [
				['transform', `skewX(${SKEW}deg)`],
			]],
			[`.${CLASS_IMAGE}`, [
				['height', '100%'],
				['width', '100%'],
				['box-sizing', 'border-box'],
				['filter', 'drop-shadow(0 0 1px black)'],
				['object-fit', 'contain'],
				['image-rendering', 'pixelated'],
				['pointer-events', 'none'],
			]],
			[`.${CLASS_CONTAINER}:hover > .${CLASS_BACKGROUND}`, [
				['filter', 'brightness(1.15)'],
			]],
			[`.${CLASS_CONTAINER}:hover > .${CLASS_IMAGE}`, [
				['filter', 'drop-shadow(0px 0px 3px black)'],
			]],
			// landscape
			[`:not(.${CLASS_TALL}) > #${ID_SIDEBAR}`, [
				['position', 'relative'],
				['width', 'calc(50% - 280px)'],
				['max-width', `${WIDTH_BATTLE}px`],
				['min-width', `${WIDTH_SIDEBAR}px`],
			]],
			// portrait wide
			[`.${CLASS_TALL} > #${ID_SIDEBAR}`, [
				['position', 'absolute'],
				['bottom', `${GAP_MAIN + HEIGHT_STRIP - 1}px`],
				['left', '0'],
				['height', `calc(50% - ${GAP_MAIN + HEIGHT_STRIP - 1}px)`],
				['width', `${WIDTH_BATTLE}px`],
			]],
			[`.${CLASS_TALL} > .mainmenu`, [
				['height', `calc(50% - ${GAP_MAIN}px)`],
			]],
			// thin
			[`:not(.${CLASS_WIDE}) > #${ID_SIDEBAR}`, [
				['display', 'none'],
			]],
			[`.${CLASS_TALL}:not(.${CLASS_WIDE}) > .mainmenu, .${CLASS_TINY} > .mainmenu`, [
				['width', `calc(100% - ${GAP_MAIN * 2}px)`],
			]],
			[`.${CLASS_TALL}:not(.${CLASS_WIDE}) > .activitymenu > .pmbox`, [
				['position', 'absolute'],
				['bottom', `${GAP_MAIN}px`],
				['left', `${GAP_MAIN}px`],
				['height', `calc(50% - ${GAP_MAIN}px)`],
				['width', `calc(100% - ${GAP_MAIN * 2}px)`],
			]],
			// tiny
			[`.${CLASS_TINY} > .activitymenu > .pmbox`, [
				['display', 'none'],
			]],
		]) {
			styleSheet.insertRule(`${rule[0]}{${rule[1].map(([property, value]) => `${property}:${value};`).join('')}}`);
		}
		
		// Setup elements
		
		const sidebar = document.createElement('div');
		
		sidebar.id = ID_SIDEBAR;
		
		const canvases = [];
		
		for (let i = 0; i < 6; ++i) {
			const container = document.createElement('div');
			const background = document.createElement('div');
			const backgroundL = document.createElement('div');
			const backgroundR = document.createElement('div');
			const canvas = document.createElement('canvas');
			
			container.classList.add(CLASS_CONTAINER);
			background.classList.add(CLASS_BACKGROUND);
			backgroundL.classList.add(CLASS_BORDER_LEFT);
			backgroundR.classList.add(CLASS_BORDER_RIGHT);
			canvas.classList.add(CLASS_IMAGE);
			
			background.draggable = true;
			
			container.append(background, backgroundL, backgroundR, canvas);
			sidebar.append(container);
			
			canvases.push(canvas);
		}
		
		// Helpers
		
		const updateRatio = (() => {
			let ratio;
			
			return (newRatio) => {
				if (newRatio !== undefined) {
					ratio = newRatio;
				}
				
				const singleRatio = (sidebar.clientWidth - SIZE_BORDER * 2) / ((sidebar.clientHeight - SIZE_BORDER * 12) / 6);
				const doubleRatio = ((sidebar.clientWidth - SIZE_BORDER * 2) / 2) / ((sidebar.clientHeight - SIZE_BORDER * 6) / 2);
				
				sidebar.classList[ratio / doubleRatio < singleRatio / ratio ? 'add' : 'remove'](CLASS_SPLIT);
			};
		})();
		
		const update = (() => {
			const styleSheet = (() => {
				const styleElement = document.createElement('style');
				
				document.head.appendChild(styleElement);
				
				return styleElement.sheet;
			})();
			
			const onClick = (team, teamIndex, {species}, monIndex, {ctrlKey}) => {
				let roomWasClosed = !window.app.rooms['teambuilder'];
				
				if (roomWasClosed) {
					window.app.addRoom('teambuilder');
				} else {
					const {teambuilder} = window.app.rooms;
					
					while (teambuilder.curTeam) {
						teambuilder.back();
					}
				}
				
				const {teambuilder} = window.app.rooms;
				
				teambuilder.edit(teamIndex);
				
				teambuilder.selectPokemon(monIndex);
				
				if (ctrlKey) {
					window.open(teambuilder.smogdexLink(species));
					
					if (roomWasClosed) {
						window.app.removeRoom('teambuilder');
					}
					
					return;
				}
				
				window.app.focusRoom('teambuilder');
				
				teambuilder.stats();
				
				// You need to listen for this assignment because it clears the stats
				if (teambuilder.formatResources[team.format] === true) {
					Object.defineProperty(teambuilder.formatResources, team.format, {
						// Avatar change listener
						set(value) {
							delete teambuilder.formatResources[team.format];
							
							teambuilder.formatResources[team.format] = value;
							
							window.setTimeout(() => {
								teambuilder.updateChart();
							}, 0);
						},
						get() {
							return true;
						},
					});
				}
			};
			
			const getOnDrag = (image, canvas) => {
				const raw = {
					url: image.src,
					image,
				};
				const cropped = {
					url: canvas.toDataURL(),
					image: new Image(),
				};
				
				raw.image.src = raw.url;
				cropped.image.src = cropped.url;
				
				return ({dataTransfer, ctrlKey}) => {
					const {url, image} = ctrlKey ? cropped : raw;
					
					dataTransfer.setData('text/plain', url);
					dataTransfer.setDragImage(image, image.width / 2, image.height / 2);
				};
			};
			
			const fillEmpties = (canvases, empties) => {
				for (const i of empties) {
					const canvas = canvases[i];
					
					canvas.parentElement.style.removeProperty('color');
					canvas.parentElement.onclick = null;
					canvas.parentElement.firstChild.ondragstart = null;
					
					canvas.style.display = 'none';
				}
			};
			
			const setImage = (() => {
				const getLeft = (data, width) => {
					for (let i = 3; i < data.length; i += 4) {
						for (let j = i; j < data.length; j += (width * 4)) {
							if (data[j] > 0) {
								return (i - 3) / 4;
							}
						}
					}
					
					return null;
				};
				
				const getTop = (data, rowLength) => {
					for (let i = 3; i < data.length; i += 4) {
						if (data[i] > 0) {
							return Math.floor(i / rowLength);
						}
					}
					
					return null;
				};
				
				const getRight = (data, rowLength) => {
					for (let i = data.length - 1; i >= 3; i -= 4) {
						for (let j = i; j >= 3; j -= rowLength) {
							if (data[j] > 0) {
								return (rowLength - data.length + i + 1) / 4;
							}
						}
					}
					
					return null;
				};
				
				const getBottom = (data, rowLength) => {
					for (let i = data.length - 1; i >= 3; i -= 4) {
						if (data[i] > 0) {
							return Math.floor(i / rowLength) + 1;
						}
					}
					
					return null;
				};
				
				const getColour = (() => {
					const [getHash, getRGB] = (() => {
						const bits = 3;
						const shifts = 8 - bits;
						const correction = 1 << (bits - 1);
						
						return [
							(r, g, b) => (r >> shifts) + ((g >> shifts) << bits) + ((b >> shifts) << (bits * 2)),
							(hash) => ([
								((hash % (1 << bits)) << shifts) + correction,
								(((hash >> bits) % (1 << bits)) << shifts) + correction,
								(((hash >> (bits * 2)) % (1 << bits)) << shifts) + correction,
							]),
						];
					})();
					
					const getColourCounts = (data) => {
						const counts = new Map();
						
						for (let i = 3; i < data.length; i += 4) {
							if (data[i] === 0) {
								continue;
							}
							
							const hash = getHash(data[i - 3], data[i - 2], data[i - 1]);
							
							counts.set(hash, counts.has(hash) ? counts.get(hash) + 1 : 1);
						}
						
						return counts;
					};
					
					return ({data}) => getRGB(getColourCounts(data).entries().reduce(
						(best, current) => best[1] > current[1] ? best : current,
						[null, -1],
					)[0]);
				})();
				
				const getData = (canvas, ctx, filter = 'saturate(1.5) blur(3px) saturate(1.5) blur(3px) saturate(1.5)', crop = 5, sections = 3, expand = 5) => {
					const canvasMain = new OffscreenCanvas(canvas.width, canvas.height);
					const ctxMain = canvasMain.getContext('2d', {alpha: true});
					
					ctxMain.drawImage(canvas, 0, 0, canvas.width, canvas.height, crop, crop, canvas.width - crop * 2, canvas.height - crop * 2);
					
					ctxMain.globalCompositeOperation = 'source-atop';
					
					ctxMain.drawImage(canvas, 0, 0, canvas.width, canvas.height, -crop, -crop, canvas.width + crop * 2, canvas.height + crop * 2);
					
					ctx.filter = 'brightness(0)';
					ctx.globalCompositeOperation = 'copy';
					
					ctx.drawImage(canvasMain, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
					
					ctx.globalCompositeOperation = 'source-atop';
					ctx.filter = filter;
					
					const sectionHeight = canvas.height / sections;
					const sectionWidth = canvas.width / sections;
					
					for (let i = 0; i < sections; ++i) {
						ctx.drawImage(canvasMain, 0, sectionHeight * i, canvas.width, sectionHeight, 0, sectionHeight * i - expand, canvas.width, sectionHeight + expand * 2);
					}
					
					for (let i = 0; i < sections; ++i) {
						ctx.drawImage(canvasMain, sectionWidth * i, 0, sectionWidth, canvas.height, sectionWidth * i - expand, 0, sectionWidth + expand * 2, canvas.height);
					}
					
					ctx.globalCompositeOperation = 'copy';
					ctx.filter = 'none';
					
					return ctx.getImageData(crop, crop, canvas.width - crop * 2, canvas.height - crop * 2);
				};
				
				return async (canvas, src) => {
					const ctx = canvas.getContext('2d', {willReadFrequently: true, alpha: true});
					const image = new Image();
					
					await new Promise((resolve) => {
						image.onload = resolve;
						
						image.src = src;
					});
					
					canvas.width = image.width;
					canvas.height = image.height;
					
					ctx.drawImage(image, 0, 0);
					
					const {data, height, width} = ctx.getImageData(0, 0, canvas.width, canvas.height);
					
					const rowLength = width * 4;
					
					const left = getLeft(data, rowLength) ?? 0;
					const top = getTop(data, rowLength) ?? 0;
					
					const right = getRight(data, rowLength) ?? width;
					const bottom = getBottom(data, rowLength) ?? height;
					
					canvas.width = right - left;
					canvas.height = bottom - top;
					
					ctx.drawImage(image, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
					
					canvas.parentElement.style.color = `rgb(${getColour(getData(canvas, ctx)).join(', ')})`;
					
					ctx.drawImage(image, left, top, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
					
					canvas.style.removeProperty('display');
					
					return image;
				};
			})();
			
			return (doListen = true) => {
				const button = document.querySelector('.select.teamselect');
				
				if (doListen) {
					const {data} = window.Storage.prefs;
					
					for (const property of ['bwgfx', 'noanim', 'nopastgens']) {
						let value = data[property] ?? false;
						
						Object.defineProperty(data, property, {
							set(_value) {
								value = _value;
								
								update(false);
							},
							get() {
								return value;
							},
						});
					}
					
					(new MutationObserver(() => {
						update(false);
					})).observe(button.parentElement, {
						characterData: true,
						childList: true,
						subtree: true,
					});
				}
				
				const empties = [0, 1, 2, 3, 4, 5];
				const teamIndex = Number.parseInt(button.value);
				const promises = [];
				
				for (let i = styleSheet.cssRules.length - 1; i >= 0; --i) {
					styleSheet.deleteRule(i);
				}
				
				if (Number.isInteger(teamIndex)) {
					const teamName = button.firstChild.innerText;
					const teamText = window.Storage.teams.find(({name}) => name === teamName);
					
					if (teamText) {
						const team = window.Teams.unpack(teamText.team);
						
						for (let i = team.length - 1; i >= 0; --i) {
							const mon = team[i];
							
							if (!mon.species) {
								continue;
							}
							
							empties.splice(i, 1);
							
							const {url} = window.Dex.getSpriteData(mon.species, true, {...mon, ...teamText, noScale: true});
							const canvas = canvases[i];
							
							canvas.style.removeProperty('display');
							
							canvas.parentElement.onclick = onClick.bind(null, team, teamIndex, mon, i);
							
							promises.push(setImage(canvas, url).then((image) => {
								canvas.parentElement.firstChild.ondragstart = getOnDrag(image, canvas);
								
								return canvas.width / canvas.height;
							}));
						}
					}
				}
				
				fillEmpties(canvases, empties);
				
				Promise.all(promises).then((ratios) => {
					updateRatio(ratios.length === 0 ? 1 : (ratios.reduce((total, next) => total + next, 0) / ratios.length));
				});
			};
		})();
		
		// Drag & drop into pmwindows
		
		(() => {
			const pmbox = room.$pmBox[0];
			
			pmbox.addEventListener('drop', (event) => {
				event.stopPropagation();
				
				const isInWindow = (id) => event.target.matches(`.pm-window-${id} *`) || event.target.classList.contains(`.pm-window-${id}`);
				
				if (event.target.matches('textarea')) {
					window.setTimeout(() => {
						event.target.dispatchEvent(new KeyboardEvent('keyup')); // force a resize
					}, 0);
					
					return;
				}
				
				let name;
				
				if (event.target.isSameNode(pmbox) || isInWindow('')) {
					name = '~';
				} else if (isInWindow(window.app.user.get('userid'))) {
					name = window.app.user.get('name');
				} else {
					return;
				}
				
				const message = `/raw <img src="${event.dataTransfer.getData('text/plain')}" class="pixelated" style="vertical-align: middle;" />`;
				
				room.addPM(name, message, name);
				
				room.openPM(name).find('textarea[name=message]').focus(); // remove .pm-notifying
			});
		})();
		
		// Initialise & setup team change listener
		
		update();
		
		// Setup responsive layout
		
		(() => {
			const sizes = {
				portrait: 783,
				portraitSmall: 450,
			};
			sizes.portraitWide = GAP_MAIN * 3 + WIDTH_BATTLE + WIDTH_PM + GAP_PM * 2 + GAP_PMBOX * 2;
			sizes.landscapeWide = sizes.portraitWide + WIDTH_SIDEBAR + GAP_MAIN;
			sizes.landscapeWidest = (WIDTH_BATTLE + 280) / 0.5; // ['width', 'calc(50% - 280px)']
			
			const source = document.querySelector('.leftmenu');
			
			const resizeLeftRight = () => {
				if (source.classList.contains(CLASS_TALL) || window.innerWidth - window.Room.prototype.bestWidth < sizes.landscapeWide) {
					room.bestWidth = sizes.portraitWide;
				} else {
					room.bestWidth = Math.min(sizes.landscapeWidest, window.innerWidth - window.Room.prototype.bestWidth);
				}
				
				// prevents `this.curRoom.show(, leftMin)` from affecting width
				room.tinyWidth = room.bestWidth;
				
				window.app.updateLayout();
			};
			
			addResizeListener(resizeLeftRight);
			
			resizeLeftRight();
			
			addResizeListener(() => {
				if (source.clientHeight < sizes.portraitSmall && source.clientWidth < sizes.portraitWide) {
					// tiny
					source.classList.add(CLASS_TINY);
					
					source.classList.remove(CLASS_TALL);
					source.classList.remove(CLASS_WIDE);
					
					return;
				}
				
				if (source.clientHeight < sizes.portraitSmall || source.clientWidth >= sizes.landscapeWidest || (source.clientHeight < sizes.portrait && source.clientWidth >= sizes.portraitWide)) {
					// landscape
					source.classList.remove(CLASS_TALL);
					source.classList.remove(CLASS_TINY);
					
					source.classList[source.clientWidth >= sizes.landscapeWide ? 'add' : 'remove'](CLASS_WIDE);
					
					updateRatio();
					
					resizeLeftRight();
					
					return;
				}
				
				// portrait
				source.classList.add(CLASS_TALL);
				source.classList.remove(CLASS_TINY);
				
				source.classList[source.clientWidth >= sizes.portraitWide ? 'add' : 'remove'](CLASS_WIDE);
				
				room.bestWidth = sizes.portraitWide;
				room.tinyWidth = sizes.portraitWide;
				window.app.updateLayout();
				
				updateRatio();
			}, source);
		})();
		
		// Add to DOM
		
		const parent = document.querySelector('.leftmenu');
		
		parent.append(sidebar);
	})();
};

// Dealing with firefox being restrictive
(() => {
	const context = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
	
	context._test = {};
	
	const isAccessDenied = (() => {
		try {
			// Firefox throws `Error: Permission denied to access property "_"` which messes with the sidebar code
			// e.g. window.Dex.getSpriteData('', true, {}) throws a permission denied error when showdown reads options
			window.eval('_test._');
		} catch (e) {
			return true;
		}
		
		return false;
	})();
	
	delete context._test;
	
	if (isAccessDenied) {
		window.eval(`(${main.toString()})()`);
	} else {
		main();
	}
})();
