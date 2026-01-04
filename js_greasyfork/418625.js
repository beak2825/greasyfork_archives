// ==UserScript==
// @name         Sort channels by viewcount
// @namespace    https://github.com/tomasz13nocon
// @version      1.3
// @description  Reorders the followed channels list in the sidebar based on viewcount.
// @author       Tomasz Nocoń
// @match        https://www.twitch.tv/*
// @grant        none
// @homepageURL  https://github.com/tomasz13nocon/twitch-sort-by-viewcount
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418625/Sort%20channels%20by%20viewcount.user.js
// @updateURL https://update.greasyfork.org/scripts/418625/Sort%20channels%20by%20viewcount.meta.js
// ==/UserScript==

(async function() {
	'use strict';

	// Returns the react element from a dom node
	function findReact(dom) {
		return dom[Object.keys(dom).find(a=>a.startsWith("__reactInternalInstance$"))].return.stateNode;
	}

	// Returns viewcount of a given element, or undefined if offline.
	// element has to be the grandparent of a side-nav-card element. That's the react component.
	function viewcount(element) {
		let component = findReact(element);
		// If "stream" property doesn't exist (optional chaining below) then the stream is offline.
		return component
			.props.children
			.props.children
			.props.stream?.content.viewersCount;
	}


	let sidebar;
	// Delay the script until the element loads
	while ((sidebar = document.getElementsByClassName("side-bar-contents")[0]) === undefined) {
		await new Promise(r => setTimeout(r, 500));
	}
	// We're mutating DOM inside a DOM mutation event callback. This flag prevents infinite loop.
	let weMutatedDom = false;

	new MutationObserver((mutations) => {

		if (weMutatedDom) {
			weMutatedDom = false;
			return;
		}

		// We're only interested in "new nodes added" and "text changed" mutations.
		let relevantMutation = false;
		for (let mutation of mutations) {
			if (mutation.addedNodes[0] || mutation.type === "characterData") {
				relevantMutation = true;
				break;
			}
		}
		if (!relevantMutation)
			return;

		let followedSection = sidebar.getElementsByClassName("side-nav-section")[0];
		// Mapping to 2 parents up, as that's the outermost element for a single channel
		let streams = [...followedSection.querySelectorAll("div.side-nav-card")].map(el => el.parentNode.parentNode);

		streams.sort((a, b) => {
			let av = viewcount(a), bv = viewcount(b);
			if (av > bv)
				return -1;
			if (av < bv)
				return 1;
			return 0;
		});

		weMutatedDom = true;
		streams[0].parentNode.append(...streams);

	}).observe(sidebar, { childList: true, subtree: true, characterData: true });

})();