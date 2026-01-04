// ==UserScript==
// @name         Cohost post scroller
// @namespace    https://yal.cc
// @version      0.11
// @description  Lets you jump between post by pressing Home/End
// @author       YellowAfterlife
// @match        https://cohost.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475775/Cohost%20post%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/475775/Cohost%20post%20scroller.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let within = (value, a, b) => value >= a && value <= b;
	document.addEventListener("keydown", function(e) {
		let finish = () => {
			e.preventDefault();
			return;
		}
		let delta;
		switch (e.key) {
			case "Home": delta = -1; break;
			case "End": delta = 1; break;
			default: return;
		}
		let viewport = window.visualViewport;
		let header = document.querySelector("#app header");
		let headerHeight = (header?.offsetHeight ?? 0);
		let scrollPad = 15;
		let lastScrollPad = 100;
		let viewportHeight = viewport.height - headerHeight;
		let viewportMid = headerHeight + viewportHeight / 2;
		let scrollToPair = (pair) => {
			document.documentElement.scrollTop += pair.rect.top - headerHeight - scrollPad;
		}
		
		let posts = Array.prototype.slice.apply(document.querySelectorAll(`div.renderIfVisible article`));
		if (posts.length == 0) return;
		let pairs = posts.map(post => {
			return { post: post, rect: post.getBoundingClientRect() };
		});
		
		let best = null;
		for (let pair of pairs) {
			let isWithin = within(headerHeight, pair.rect.top, pair.rect.bottom);
			if (isWithin && delta < 0) {
				scrollToPair(pair);
				return finish();
			}
			pair.dist = pair.rect.top - headerHeight;
			if (pair.dist < 0 && !isWithin) continue;
			if (!best || pair.dist < best.dist) best = pair;
		}
		
		if (!best) best = pairs[pairs.length - 1];
		if (!best) return;
		
		if (best == pairs[0] && best.dist > 200 && delta > 0) {
			// scroll first post into view
			scrollToPair(best);
			return finish();
		}
		
		let next = pairs[pairs.indexOf(best) + delta];
		console.log(pairs);
		console.log(best, next);
		if (next) {	
			scrollToPair(next);
		} else {
			if (best.rect.height >= viewportHeight - lastScrollPad && delta > 0) {
				// scroll so that the bottom of the last post (and possibly the "next page" button) is visible
				document.documentElement.scrollTop += best.rect.bottom - headerHeight - viewportHeight + lastScrollPad;
			} else {
				scrollToPair(best);
			}
		}
		e.preventDefault();
	});
})();