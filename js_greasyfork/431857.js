// ==UserScript==
// @name        Reddit saved autoscroller
// @match       https://www.reddit.com/user/*/saved*
// @grant       none
// @version     1.2.1
// @author      AdrianSkar
// @description Script to scroll automatically to the bottom of Reddit's saved page
// @namespace https://greasyfork.org/users/564765
// @downloadURL https://update.greasyfork.org/scripts/431857/Reddit%20saved%20autoscroller.user.js
// @updateURL https://update.greasyfork.org/scripts/431857/Reddit%20saved%20autoscroller.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function () {
	setTimeout(() => {
		let isScrolling = false;
		let intervalId;
		let time;

		// Scroll fn
		function autoScroll(time) {
			isScrolling = true;
			intervalId = window.setInterval(() => {
				if (
					window.scrollY + window.screen.height >=
					document.body.scrollHeight
				) {
					alert('done scrolling');
					clearInterval(intervalId);
					isScrolling = false;
					toggleButtonText();
					return;
				} else window.scrollTo(0, document.body.scrollHeight);
			}, time);
		}

		// Stop scrolling
		function stopScroll() {
			clearInterval(intervalId);
			isScrolling = false;
			toggleButtonText();
		}

		// Toggle button text between "Start" and "Stop"
		function toggleButtonText() {
			const scrollButton = document.getElementById('scroll-button');
			if (isScrolling) {
				scrollButton.textContent = '⏹';
			} else {
				scrollButton.textContent = '↓';
			}
		}

		// Create and display new button
		const scrollButton = document.createElement('button');
		scrollButton.id = 'scroll-button';
		scrollButton.style = `
			position: fixed;
			background-color: rgba(250, 250, 250, 0.9);
			color: black;
			font-weight: bold;
			font-size: 1rem;
			bottom: 0.6rem;
			right: 6rem;
			padding: 0.4rem;
			border-radius: 11px;
			font-family: Noto Sans, Arial, sans-serif;
			z-index: 9;
		`;
		scrollButton.textContent = '↓';

		// Listen for click and perform autoScroll or stopScroll
		scrollButton.addEventListener('click', ev => {
			ev.preventDefault();
			if (isScrolling) {
				stopScroll();
			} else {
				time = time || prompt("Speed in ms (you'l get an alert when done):");
				autoScroll(time);
				toggleButtonText();
			}
		});

		document.body.appendChild(scrollButton);
	}, 2000);
})();