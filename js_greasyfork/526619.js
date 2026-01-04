// ==UserScript==
// @name         GitHub Network Shortcut
// @namespace    https://mkps.app/
// @version      0.1.2
// @description  Adds a shortcut to the network graph on the repository's main page
// @tag          productivity
// @author       MK
// @license      MIT
// @match        *://github.com/*
// @icon         https://github.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/526619/GitHub%20Network%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/526619/GitHub%20Network%20Shortcut.meta.js
// ==/UserScript==

(() => {
	"use strict";

	const ELEMENT_CLASS = "MK_userscript_ghNetworkShortcut_element";
	const CONTAINER_SELECTOR_LG = `#repo-content-turbo-frame .Layout-sidebar .about-margin > div.BorderGrid-row > div.BorderGrid-cell > div.hide-sm.hide-md`;
	const CONTAINER_SELECTOR_SM = `#responsive-meta-container ul[aria-label="Repository details"]`;

	function main() {
		forMatchingElementsForever(CONTAINER_SELECTOR_LG, (element) => {
			if (element.querySelector(`.${ELEMENT_CLASS}`)) {return;}
			for (const child of element.children) {
				if (child.children[0]?.getAttribute("href")?.endsWith("/forks")) {
					child.insertAdjacentElement("afterend", createShortcutLg());
					break;
				}
			}
		});
		forMatchingElementsForever(CONTAINER_SELECTOR_SM, (element) => {
			if (element.querySelector(`.${ELEMENT_CLASS}`)) {return;}
			for (const child of element.children) {
				if (child.getAttribute("href")?.endsWith("/activity")) {
					child.insertAdjacentElement("afterend", createShortcutSm());
					break;
				}
			}
		});
	}

	function getNetworkUrl() {
		const terms = [...location.pathname.split("/").slice(1, 3), "network"];
		return `/${terms.join("/")}`;
	}

	function createShortcutLg() {
		const div = document.createElement("div");
		div.classList.add(ELEMENT_CLASS);
		div.classList.add("mt-2");
		const a = document.createElement("a");
		a.setAttribute("href", getNetworkUrl());
		a.setAttribute("data-view-component", "true");
		a.classList.add("Link", "Link--muted");
		a.appendChild(createCommitIcon("mr-2"));
		a.appendChild(document.createTextNode(" "));
		const span = document.createElement("span");
		span.classList.add("color-fg-muted");
		span.textContent = "Network";
		a.appendChild(span);
		div.appendChild(a);
		return div;
	}

	function createShortcutSm() {
		const a = document.createElement("a");
		a.classList.add(ELEMENT_CLASS, "Link--secondary", "no-underline", "d-block", "mr-2");
		a.setAttribute("role", "listitem");
		a.setAttribute("href", getNetworkUrl());
		a.appendChild(createCommitIcon("mr-1"));
		a.appendChild(document.createTextNode(" "));
		const span = document.createElement("span");
		span.textContent = "Network";
		a.appendChild(span);
		return a;
	}

	function createCommitIcon(marginClass) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("version", "1.1");
		svg.setAttribute("width", "16");
		svg.setAttribute("height", "16");
		svg.setAttribute("viewBox", "0 0 16 16");
		svg.setAttribute("aria-hidden", "true");
		svg.setAttribute("data-view-component", "true");
		svg.classList.add("octicon", "octicon-commit", marginClass);
		svg.innerHTML = `<path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>`;
		return svg;
	}

	function forMatchingElementsForever(selector, fn) {
		const observer = new MutationObserver((list, observer) => {
			for (const mutation of list) {
				for (const addedNode of mutation.addedNodes) {
					if (addedNode.nodeType !== Node.ELEMENT_NODE) {continue;}
					for (const newNode of addedNode.querySelectorAll(selector)) {
						fn(newNode);
					}
				}
			}
		});
		observer.observe(document.body, {childList: true, subtree: true});

		for (const element of document.querySelectorAll(selector)) {
			fn(element);
		}
	}

	main();
})();
