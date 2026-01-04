// ==UserScript==
// @name         Apple Music(embed) - Hide Overlay
// @description  Apple Music(embed) - Hide Overlay.
// @version      0.2
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @match        https://embed.music.apple.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.apple.com
// @downloadURL https://update.greasyfork.org/scripts/458159/Apple%20Music%28embed%29%20-%20Hide%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/458159/Apple%20Music%28embed%29%20-%20Hide%20Overlay.meta.js
// ==/UserScript==

const css = `
	embed-upsell-overlay {
		display: none !important;
	}

	.container-player {
		height: 100vh !important;
	}`;

const root = document.querySelector('embed-root');
const observer = new MutationObserver(() => {
	if (!root.shadowRoot)
		return;

	root.shadowRoot.appendChild(createStyle(css));
	observer.disconnect();
});
observer.observe(root, {
	attributes: true,
});

function createStyle(css) {
	var style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	style.appendChild(document.createTextNode(css));
	return style;
}
