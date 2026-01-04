// ==UserScript==
// @name         Microsoft Teams - Toggle Sidebar + Expand Message Pane
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Add toggle buttons to hide the Chat/Teams sidebar and also expand the message pane
// @author       D365Fixes
// @license      MIT
// @match        https://teams.microsoft.com/v2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teams.microsoft.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/507803/Microsoft%20Teams%20-%20Toggle%20Sidebar%20%2B%20Expand%20Message%20Pane.user.js
// @updateURL https://update.greasyfork.org/scripts/507803/Microsoft%20Teams%20-%20Toggle%20Sidebar%20%2B%20Expand%20Message%20Pane.meta.js
// ==/UserScript==

(function() {
	"use strict";

	const styles = `
		.hide-sub-nav div[data-tid="experience-layout"] {
			--sub-nav-width: 0rem !important;
		}

		.hide-sub-nav div[data-tid="app-layout-area--sub-nav"] {
			opacity: 0;
			visibility: hidden;
		}

		#chat-pane-list, #chat-pane-list, div[data-tid="message-pane-footer"], div[data-tid="simplified-formatting-toolbar"] {
			transition: max-width .25s ease-in-out;
		}

		div[data-tid="simplified-formatting-toolbar"] {
			column-gap: normal;
		}

		@media (min-width: 947px) {
			.expand-msg-pane div[data-tid="message-pane-list-runway"], .expand-msg-pane div[data-tid="message-pane-footer"] {
				max-width: 80vw;
			}
			.expand-msg-pane div[data-tid="simplified-formatting-toolbar"] {
				max-width: none;
			}
		}

		div[data-tid="experience-layout"], div[data-tid^="app-layout-area"], div[data-tid="app-layout-area--sub-nav"] {
			transition: all .25s ease-in-out !important;
			transition-delay: unset !important;
		}

		#toggle-sidebar-btn, #expand-msg-pane-btn {
			background-color: transparent;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 20px;
			line-height: 1;
			width: 36px;
			height: 36px;
			padding: 5px;
			margin-left: 10px;
			border: 0;
			cursor: pointer;
		}

		.fui-light-mode #toggle-sidebar-btn, .fui-light-mode #expand-msg-pane-btn {
			color: rgb(66, 66, 66);
		}
	`;

	function injectStyles() {
		const styleElement = document.createElement("style");
		styleElement.appendChild(document.createTextNode(styles));
		document.head.appendChild(styleElement);
	}

	function observeThemeChanges() {
		const targetNode = document.body;
		const config = { attributes: true, childList: true, subtree: true };

		const callback = function(mutationsList, observer) {
			for(let mutation of mutationsList) {
				if (mutation.type === 'childList') {
					const themeSelector = document.querySelector('button[data-tid="appearance-settings-theme-selector-dropdown"]');
					if (themeSelector) {
						checkTitleBarColor();
						break;
					}
				}
			}
		};

		const observer = new MutationObserver(callback);
		observer.observe(targetNode, config);
	}

	function checkTitleBarColor() {
		const titleBar = document.querySelector('div[data-tid="title-bar"]');

		if (titleBar) {
			const bgColor = window.getComputedStyle(titleBar).backgroundColor;
			const rgb = bgColor.match(/\d+/g).map(Number);
		
			const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
		
			if (luminance > 0.5) {
				document.body.classList.add('fui-light-mode');
			} else {
				document.body.classList.remove('fui-light-mode');
			}
		}
	}

	function createSVGIcon(collapse) {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("xmlns", svgNS);
		svg.setAttribute("width", "24");
		svg.setAttribute("height", "24");
		svg.setAttribute("fill", "currentColor");
		svg.setAttribute("aria-hidden", "true");

		const path = document.createElementNS(svgNS, "path");
		const d = collapse
			? "m13.1 11.3 1.4-1.2c.3-.3.3-.7.1-1s-.7-.3-1-.1l-2.8 2.4c-.3.2-.3.7-.1 1 0 0 0 .1.1.1l2.8 2.4c.3.3.7.2 1-.1.3-.3.2-.7-.1-1l-1.4-1.2h5.1c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-5.1zM2.2 20.2h19.6c.7 0 1.2-.5 1.2-1.2V5c0-.7-.5-1.2-1.2-1.2H2.2C1.5 3.8 1 4.3 1 5v14c0 .7.5 1.2 1.2 1.2zm.2-1.9V5.7c0-.3.3-.6.6-.6h4.9v13.8H3c-.4 0-.6-.3-.6-.6zm6.8.6V5.1H21c.3 0 .6.3.6.6v12.5c0 .3-.3.6-.6.6H9.2z"
			: "M16.4 12.7 15 13.9c-.3.3-.3.7-.1 1 .3.3.7.3 1 .1l2.8-2.4c.3-.2.3-.7.1-1 0 0 0-.1-.1-.1l-2.8-2.4c-.3-.3-.7-.2-1 .1-.3.3-.2.7.1 1l1.4 1.2h-5.1c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h5.1zM2.2 20.2h19.6c.7 0 1.2-.5 1.2-1.2V5c0-.7-.5-1.2-1.2-1.2H2.2C1.5 3.8 1 4.3 1 5v14c0 .7.5 1.2 1.2 1.2zm.2-1.9V5.7c0-.3.3-.6.6-.6h4.9v13.8H3c-.4 0-.6-.3-.6-.6zm6.8.6V5.1H21c.3 0 .6.3.6.6v12.5c0 .3-.3.6-.6.6H9.2z";

		path.setAttribute("d", d);
		path.setAttribute("fill", "currentColor");

		svg.appendChild(path);

		return svg;
	}

	function createMessagePaneSVGIcon(expanded) {
		const svgNS = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgNS, "svg");
		svg.setAttribute("xmlns", svgNS);
		svg.setAttribute("width", "24");
		svg.setAttribute("height", "24");
		svg.setAttribute("fill", "currentColor");
		svg.setAttribute("aria-hidden", "true");

		const path = document.createElementNS(svgNS, "path");
		const d = expanded
			? "m16.4 12.7 1.4 1.2c.3.3.3.7.1 1-.3.3-.7.3-1 .1l-2.8-2.4c-.3-.2-.3-.7-.1-1 0 0 0-.1.1-.1l2.8-2.4c.3-.3.7-.2 1 .1.3.3.2.7-.1 1l-1.4 1.2h5.1c.4 0 .7.3.7.7s-.3.7-.7.7h-5.1v-.1zM7.6 12.7l-1.4 1.2c-.3.3-.3.7-.1 1 .3.3.7.3 1 .1l2.8-2.4c.3-.2.3-.7.1-1 0 0 0-.1-.1-.1L7.1 9.1c-.3-.3-.7-.2-1 .1s-.2.7.1 1l1.4 1.2H2.5c-.4 0-.7.3-.7.7s.3.7.7.7h5.1v-.1zM2 2h20v2H2M2 6h20v2H2M2 16h20v2H2M2 20h20v2H2"
			: "m19.6 12.7-1.4 1.2c-.3.3-.3.7-.1 1 .3.3.7.3 1 .1l2.8-2.4c.3-.2.3-.7.1-1 0 0 0-.1-.1-.1l-2.8-2.4c-.3-.3-.7-.2-1 .1-.3.3-.2.7.1 1l1.4 1.2h-5.1c-.4 0-.7.3-.7.7s.3.7.7.7h5.1v-.1zM4.4 12.7l1.4 1.2c.3.3.3.7.1 1-.3.3-.7.3-1 .1l-2.8-2.4c-.3-.2-.3-.7-.1-1 0 0 0-.1.1-.1l2.8-2.4c.3-.3.7-.2 1 .1s.2.7-.1 1l-1.4 1.2h5.1c.4 0 .7.3.7.7s-.3.7-.7.7H4.4v-.1zM2 2h20v2H2M2 6h20v2H2M2 16h20v2H2M2 20h20v2H2";

		path.setAttribute("d", d);
		path.setAttribute("fill", "currentColor");

		svg.appendChild(path);

		return svg;
	}

	function addToggleButton() {
		const waitForTitlebarStartSlot = window.setInterval(function() {
			const titlebarSlot = document.querySelector('div[data-tid="titlebar-start-slot"]');
			if (titlebarSlot) {
				window.clearInterval(waitForTitlebarStartSlot);

				const toggleButton = document.createElement("button");
				toggleButton.id = "toggle-sidebar-btn";

				let sidebarOpen = true;

				toggleButton.appendChild(createSVGIcon(sidebarOpen));

				toggleButton.addEventListener("click", function() {
					sidebarOpen = !sidebarOpen;

					while (toggleButton.firstChild) {
						toggleButton.removeChild(toggleButton.firstChild);
					}

					toggleButton.appendChild(createSVGIcon(sidebarOpen));

					document.body.classList.toggle("hide-sub-nav");
				});

				titlebarSlot.appendChild(toggleButton);

				const expandButton = document.createElement("button");
				expandButton.id = "expand-msg-pane-btn";

				let messagePaneExpanded = false;

				expandButton.appendChild(createMessagePaneSVGIcon(messagePaneExpanded));

				expandButton.addEventListener("click", function() {
					messagePaneExpanded = !messagePaneExpanded;

					while (expandButton.firstChild) {
						expandButton.removeChild(expandButton.firstChild);
					}

					expandButton.appendChild(createMessagePaneSVGIcon(messagePaneExpanded));

					document.body.classList.toggle("expand-msg-pane");
				});

				titlebarSlot.appendChild(expandButton);

				checkTitleBarColor();
			}
		}, 300);
	}

	document.addEventListener("DOMContentLoaded", function() {
		injectStyles();
		addToggleButton();
		observeThemeChanges();
	});
})();