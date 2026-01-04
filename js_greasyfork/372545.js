// ==UserScript==
// @name        Grey Vision
// @version     1.0.2
// @date        2018-09-24
// @description Removes all views, likes, and subscription numbers from youtube for a cleaner experience without pre-judgements.
// @author      TomLum.com
// @copyright   2018, TomLum.com
// @homepage    TomLum.com/greyvision
// @compatible chrome
// @compatible firefox
// @compatible safari
// @license MIT https://opensource.org/licenses/MIT
// @match          *://*.youtube.com/*
// @namespace https://greasyfork.org/users/215141
// @downloadURL https://update.greasyfork.org/scripts/372545/Grey%20Vision.user.js
// @updateURL https://update.greasyfork.org/scripts/372545/Grey%20Vision.meta.js
// ==/UserScript==

new MutationObserver(function(mutations, observer) {
	document.querySelectorAll(".view-count, .short-view-count, .super-title .yt-simple-endpoint.style-scope.yt-formatted-string, #top-level-buttons yt-formatted-string[id='text'], ytd-sentiment-bar-renderer, ytd-badge-supported-renderer, ytd-subscribe-button-renderer span, ytd-comments-header-renderer, count-text, #vote-count-middle, #metadata-line .style-scope, #subscriber-count, #subscribers").forEach(function(a) {
		a.remove()
	})
}).observe(document, {
	childList: true,
	subtree: true
});