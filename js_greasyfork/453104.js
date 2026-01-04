// ==UserScript==
// @name         Color Hunt background slider
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Change Color Hunt background color to view palettes in different brightness contexts
// @author       BENE László
// @license      GNU GPLv3
// @match        https://colorhunt.co/
// @match        https://colorhunt.co/palette*
// @match        https://colorhunt.co/collection
// @icon         https://colorhunt.co/img/colorhunt-favicon.svg?2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453104/Color%20Hunt%20background%20slider.user.js
// @updateURL https://update.greasyfork.org/scripts/453104/Color%20Hunt%20background%20slider.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// targeted elements
	document.body.classList.add("dynamic-background");
	document.getElementsByClassName('header')[0].classList.add("dynamic-background");

	// creating the slider elements
	const wrapper = document.createElement("div");
	wrapper.id = 'background-slider-wrapper';

	const cursor = document.createElement("div");
	cursor.id = 'background-slider-cursor';
	wrapper.appendChild(cursor);

	const triggers = document.createElement("div");
	triggers.id = 'background-slider-triggers';
	wrapper.appendChild(triggers);

	for (var i=1; i<=5; i++)
	{
		var trigger = document.createElement("div");
		triggers.appendChild(trigger);

		trigger.addEventListener('click', function(event) {
			var targetElement = event.target || event.srcElement;
			var index = Array.prototype.indexOf.call(targetElement.parentNode.children, targetElement);
			setBackground(index);
		});
	}

	document.body.appendChild(wrapper);

	// global variable with the current brightness 0-4
	var background;

	// the function
	function setBackground(background) {
		document.getElementById('background-slider-cursor')
			.style.marginLeft = 'calc(var(--bs-sizes)*'+(background)+')';

		var collection = document.getElementsByClassName('dynamic-background');
		Array.prototype.forEach.call(collection, function(element) {
			element.style.background = 'hsl(0 0% '+(background*25)+'%)';
		});
		console.log(background);
	}

	// adding the css
	var css = `
		:root {
			--bs-sizes: 32px;
			--bs-margins: 16px;
		}

		.dynamic-background {
			transition: background .12s;
		}

		#background-slider-wrapper {
			display: table;
			background: #181818;
			width: calc(var(--bs-sizes)*5);
			height: var(--bs-sizes);
			position: fixed;
			right: calc(var(--bs-margins) + var(--bs-sizes));
			bottom: calc(var(--bs-margins));
		}
		#background-slider-wrapper::before,
		#background-slider-wrapper::after {
			position: fixed;
			bottom: calc(var(--bs-margins));
			width: var(--bs-sizes);
			height: var(--bs-sizes);
			display: inline-flex;
			justify-content: center;
			align-items: center;
			font-size: 23px;
		}
		body[style="background: rgb(0, 0, 0);"] #background-slider-wrapper::before,
		body[style="background: rgb(0, 0, 0);"] #background-slider-wrapper::after {
			color: #808080;
		}
		#background-slider-wrapper::before {
			content: '\☾';
			right: calc(var(--bs-margins) + var(--bs-sizes)*6);
		}
		#background-slider-wrapper::after {
			content: '\☼';
			right: calc(var(--bs-margins));
		}

		#background-slider-cursor, #background-slider-triggers div {
			display: table-cell;
			width: var(--bs-sizes);
			height: var(--bs-sizes);
		}
		#background-slider-triggers div {
			cursor: pointer;
		}
		#background-slider-cursor {
			background: #f4f4f4;
			color: #000;
			border: solid 1px #181818;
			box-sizing: border-box;
			position: absolute;
			cursor: default;
			transition: margin-left .2s;
		}

		#background-slider-cursor {
			margin-left: calc(var(--bs-sizes)*4);
		}

		body[style="background: rgb(0, 0, 0);"] {
			color: #808080;
		}

		.button {
			background: rgba(255, 255, 255, .4);
			border-color: rgba(0, 0, 0, .078);
			color: rgba(0, 0, 0, .9);
		}
	`;
	var styleSheet = document.createElement("style");
	styleSheet.innerText = css;
	document.head.appendChild(styleSheet);

	// one of the logo svg's has an unwanted white fill.
	// replacing it with a proper svg
	document.getElementsByClassName('logo')[0].children[1].src = 'https://svgur.com/i/nPv.svg';
})();