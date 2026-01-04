// ==UserScript==
// @name        [PS] Ladder List Styler
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.0
// @description Re-styles the Pokémon Showdown ladder format list.
// @match       https://play.pokemonshowdown.com/*
// @exclude     https://play.pokemonshowdown.com/sprites/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/511614/%5BPS%5D%20Ladder%20List%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/511614/%5BPS%5D%20Ladder%20List%20Styler.meta.js
// ==/UserScript==

(() => {
	const styleElement = document.createElement('style');
	document.head.appendChild(styleElement);
	const styleSheet = styleElement.sheet;
	
	const rules = [
		['.ladder.pad', [['padding-bottom', '20px']]],
		['.ladder.pad > ul', [
			['display', 'flex'],
			['flex-direction', 'row'],
			['flex-wrap', 'wrap'],
			['justify-content', 'flex-start'],
		]],
		['.ladder.pad > h3', [
			['border-top', '5px double #8a8a8a'],
			['padding-top', '12px'],
		]],
		['.ladder.pad > ul > li', [['box-shadow', 'rgb(39, 43, 64) 0px 0px 5px 0px']]],
		['.ladder.pad > ul > li > button', [
			['height', 'auto !important'],
			['padding-bottom', '0.26em'],
			['margin', '-2px'],
		]],
		['.ladder.pad > ul > li > button:not(:hover):not(:focus)', [
			['white-space', 'pre'],
			['text-overflow', 'ellipsis'],
			['overflow-x', 'hidden'],
		]],
		['.ladder.pad > :nth-child(2)', [['display', 'none']]],
		['.ladder.pad > ul:empty', [['display', 'none']]],
	];
	
	for (let rule of rules) {
		styleSheet.insertRule(`${rule[0]}{${rule[1].map(([property, value]) => `${property}:${value};`).join('')}}`);
	}
	
	const setBestWidth = (node) => {
		const resize = () => {
			if (node.clientWidth === 0) {
				return;
			}
			
			const gutterWidth = node.offsetWidth - node.clientWidth;
			
			window.app.rooms.ladder.bestWidth = 682 + gutterWidth;
			
			window.app.updateLayout();
		};
		
		(new ResizeObserver(resize)).observe(node);
		
		resize();
	};
	
	(new MutationObserver((mutations) => {
		for (const {addedNodes} of mutations) {
			for (const node of addedNodes) {
				if (node.id === 'room-ladder') {
					setBestWidth(node);
					
					return;
				}
			}
		}
	})).observe(document.body, {childList: true});
	
	if (window.app.rooms.ladder) {
		setBestWidth(window.app.rooms.ladder.el);
	}
})();
