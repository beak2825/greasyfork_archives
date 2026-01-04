// ==UserScript==
// @name           Display Google Search Options
// @description    Display Google Search Options on search results page
// @author         Betty
// @namespace      https://github.com/BettyJJ
// @version        0.1
// @include        http://*.google.*/search*
// @include        https://*.google.*/search*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/524218/Display%20Google%20Search%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/524218/Display%20Google%20Search%20Options.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Create the toolbar container
	const toolbar = document.createElement('div');
	toolbar.style.display = 'flex';
	toolbar.style.flexDirection = 'column';
	toolbar.style.margin = '20px 0px 0px 20px';
	toolbar.style.gap = '10px';
	toolbar.style.fontSize = '14px';

	// Add the toolbar below the search box
	const header = document.querySelector('#before-appbar');
	if (header) {
		header.insertAdjacentElement('afterend', toolbar);
	}

	// Helper to update URL
	function updateURL(newParams) {
		const url = new URL(window.location.href);
		for (const key in newParams) {
			if (newParams[key] === null) {
				url.searchParams.delete(key);
			} else {
				url.searchParams.set(key, newParams[key]);
			}
		}
		window.location.href = url.toString();
	}

	// Highlight active button
	function isActiveButton(param, value) {
		const url = new URL(window.location.href);
		return url.searchParams.get(param) === value;
	}

	// Create buttons
	function createButton(text, param, value) {
		const button = document.createElement('button');
		button.textContent = text;
		button.style.padding = '5px 10px';
		button.style.border = '1px solid #ccc';
		button.style.borderRadius = '4px';
		button.style.backgroundColor = isActiveButton(param, value) ? '#333' : '#f8f9fa';
		button.style.color = isActiveButton(param, value) ? '#fff' : '#000';
		button.style.cursor = 'pointer';
		button.addEventListener('click', () => {
			updateURL({ [param]: value });
		});
		return button;
	}

	// Create two divs to hold the two groups of buttons
	const [lang_buttons, time_buttons] = ['div', 'div'].map(tag => {
		const element = document.createElement(tag);
		element.style.display = 'flex';
		element.style.flexWrap = 'nowrap';
		element.style.gap = '10px';
		element.style.alignItems = 'center';
		return element;
	});
	toolbar.append(lang_buttons, time_buttons);

	// Language buttons
	lang_buttons.appendChild(document.createTextNode('语言：'));
	const languages = {
		'全部': null,
		'简中': 'lang_zh-CN',
		'英语': 'lang_en',
	};
	for (const [text, value] of Object.entries(languages)) {
		lang_buttons.appendChild(
			createButton(text, 'lr', value)
		);
	}

	// Time buttons
	time_buttons.appendChild(document.createTextNode('时间：'));
	const times = {
		'全部': null,
		'一小时': 'qdr:h',
		'24 小时': 'qdr:d',
		'一周': 'qdr:w',
		'一个月': 'qdr:m',
		'三个月': 'qdr:m3',
		'六个月': 'qdr:m6',
		'一年': 'qdr:y',
		'三年': 'qdr:y3',
	};
	for (const [text, value] of Object.entries(times)) {
		time_buttons.appendChild(
			createButton(text, 'tbs', value)
		);
	}
})();
