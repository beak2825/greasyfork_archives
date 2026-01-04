// ==UserScript==
// @name          YTM auto resume
// @author        Grifmin
// @description   Auto resumes youtube music
// @namespace     YTM-Grifmin
// @version       1.0.1
// @run-at        document-start
// @match         *://music.youtube.com/*
// @license       MIT
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/546452/YTM%20auto%20resume.user.js
// @updateURL https://update.greasyfork.org/scripts/546452/YTM%20auto%20resume.meta.js
// ==/UserScript==

(() => {
	const targetText = "Video paused. Continue watching?";
	let /**@type {HTMLVideoElement | undefined}*/ video;
	/**
	 * searches all document elements for the specified textContent
	 * @param {string} text
	 * @returns {Element[]}
	 */
	function findElementWithText(text) {
		const elements = document.querySelectorAll("*");
		return [...elements].filter((element) => element?.textContent == text);
	}
	/**@returns {HTMLVideoElement | undefined}*/
	function getVideoElement() {
		const videoElements = document.querySelectorAll("video");
		if (videoElements.length == 1) return videoElements[0];
	}
	/**
	 * Checks if an element is visible. (hopefully)
	 * @param {Element | HTMLElement} element
	 * @returns {Boolean}
	 */
	function isElementVisible(element) {
		/**
		 * @template {Element} T
		 * @param {T} element
		 * @param {function(HTMLElement): boolean} check
		 * */
		function recursiveParentElementCheck(element, check) {
			if (element instanceof HTMLElement && check(element)) return true;
			const parent = element.parentElement;
			if (parent) return recursiveParentElementCheck(parent, check);
			return false;
		}
		if (recursiveParentElementCheck(element, (el) => el.style.display == "none")) {
			return false;
		}
		const { top, left, bottom, right } = element.getBoundingClientRect();
		const height = window.innerHeight || document.documentElement.clientHeight;
		const width = window.innerWidth || document.documentElement.clientWidth;
		return top >= 0 && left >= 0 && bottom <= height && right <= width;
	}
	/**
	 * Clicks everything recursively
	 * @param {Element} element
	 */
	function clickRecursively(element) {
		element?.click()
		if (element.children) [...element.children].forEach(clickRecursively);
	}
	function HandleVideoPause() {
		console.info(`Video paused`);
		const elements = findElementWithText(targetText);
		if (elements.length != 1) return;
		const parent = elements[0].parentElement;
		if (!parent || parent.children.length != 2) return;
		const [topDiv, buttonDivStuff] = parent.children;
		if (isElementVisible(buttonDivStuff) && video?.paused) {
			window.dispatchEvent(new Event("focus"));
			clickRecursively(buttonDivStuff);
			console.info(`Resuming video`, { video });
			video.play(); // yea, ill just resume this automatically thank you.
		}
	}
	let interval = setInterval(() => {
		let found = getVideoElement();
		if (found && video?.src != found.src) {
			video = found;
			video.addEventListener("pause", HandleVideoPause);
		}
	}, 150);
})();