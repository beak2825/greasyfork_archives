/* eslint-disable no-undef */
// ==UserScript==
// @name        Dark Mode+
// @match       https://sketchful.io/
// @grant       none
// @version     1.3.1
// @description Sketchful dark theme improvements
// @author      bebell
// @run-at      body-end
// jshint esversion: 6
// @namespace   https://greasyfork.org/users/281093
// @downloadURL https://update.greasyfork.org/scripts/407802/Dark%20Mode%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/407802/Dark%20Mode%2B.meta.js
// ==/UserScript==

let grayCanvas = localStorage.grayCanvas
	? JSON.parse(localStorage.grayCanvas)
	: true;
const pageHTML = document.querySelector('html');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const themes = document.querySelector('#menuSettingsTheme');
const brightnessLayer = document.createElement('div');
const settingsContainer = document.querySelector(
	'#menuSettings > div.row.justify-content-center > div'
);

wrap(canvas, brightnessLayer);

const styleRules = [
	'.dark .table { color: white !important; }',
	'.table { color: black !important; }',
	'.dark { background-color: #1d1f22 !important; }',
	'.dark .table th, html.dark .table thead, html.dark .table td { border-color: #454d55 !important; }',
	'.table th, .table thead, .table td { border-color: #dee2e6 !important; }',
	'.dark .table.table-striped tbody tr:nth-of-type(odd) { background-color: rgba(255,255,255,.05)!important; }',
	'.table.table-striped tbody tr:nth-of-type(odd) { background-color: rgba(0,0,0,.05)!important; }',
	'.dark #gameChatList li:not(.chatAdmin) b { color: #BBB }',
	'#gameChatList li:not(.chatAdmin) b { color: black }',
	'.dark .gameAvatarRank { color: #148FA2 }',
	'.dark #gameWinners li b { color: white !important }',
	'.dark .gameSticky { color: white !important }',
	'#gameSticky font { color: black!important }',
	'.dark #gameSticky font { color: #eee!important }'
];

const sheet = window.document.styleSheets[window.document.styleSheets.length - 1];
styleRules.forEach((rule) => sheet.insertRule(rule));

let btn;
const stored = localStorage.dark;
let darkMode = stored
	? JSON.parse(stored)
	: JSON.parse(localStorage.getItem('settings')).dark;

if (darkMode) pageHTML.classList.add('dark');
else pageHTML.classList.remove('dark');

brightnessLayer.style.filter = darkMode
	? `brightness(${localStorage.canvasBrightness})` || ''
	: '';

themes.onchange = (e) => {
	if (e.target.value === 'Dark' && !grayCanvas) {
		pageHTML.classList.add('dark');
		e.stopImmediatePropagation();
	}
};

document.querySelector('#menu > div.menuNav > ul > li:nth-child(5) > a').onclick = () => {
	themes.value = darkMode ? 'Dark' : 'Light';
};

function wrap(toWrap, wrapper) {
	toWrap.parentNode.appendChild(wrapper);
	wrapper.appendChild(toWrap);
	return wrapper;
}

function darkClassObserver(mutations) {
	for (const mutation of mutations) {
		if (mutation.attributeName !== 'class') return;
		darkMode = pageHTML.classList.contains('dark');
		localStorage.dark = darkMode;
		brightnessLayer.style.filter = darkMode
			? `brightness(${localStorage.canvasBrightness})` || ''
			: '';
		fixColors();
		grayCanvas && toggleCanvasDarkMode();
	}
}

const gameObserver = new MutationObserver(darkClassObserver);

gameObserver.observe(pageHTML, { attributes: true });

(function addBrightnessSlider() {
	const sliderContainer = document
		.querySelector('#menuSettingsVolumeIcon')
		.parentNode.cloneNode(true);
	sliderContainer.getElementsByTagName('h5')[0].textContent =
        'Canvas Brightness';
	const icon = sliderContainer.firstChild;
	icon.remove();
	const newIcon = document.createElement('img');
	newIcon.setAttribute('style', 'width: 64px; height: 64px');
	newIcon.setAttribute('class', 'mr-3 lazy');
	newIcon.src = 'https://i.imgur.com/GkVJWun.gif';
	const slider = sliderContainer.querySelector('#menuSettingsVolume');
	slider.value = localStorage.canvasBrightness || 1;
	slider.onchange = changeBrightness;
	sliderContainer.insertBefore(newIcon, sliderContainer.firstChild);

	const grayCanvasToggle = document.createElement('div');
	grayCanvasToggle.setAttribute(
		'style',
		'display: flex; justify-content: space-between'
	);
	const label = document.createElement('label');

	label.style.fontSize = '20px';
	label.textContent = 'Gray Canvas';

	const btnSwitch = document.createElement('label');
	const input = document.createElement('input');
	const span = document.createElement('span');
	span.setAttribute('class', 'slider round');
	input.type = 'checkbox';
	input.checked = grayCanvas;
	input.onchange = () => {
		grayCanvas = input.checked;
		localStorage.grayCanvas = grayCanvas;
		if (!grayCanvas && darkMode) {
			themes[0].selected = true;
			themes.dispatchEvent(new Event('change'));
			pageHTML.classList.add('dark');
			themes.value = darkMode ? 'Dark' : 'Light';
		}
	};
	btnSwitch.setAttribute('class', 'switch');
	btnSwitch.append(input, span);
	grayCanvasToggle.append(label, btnSwitch);
	settingsContainer.append(sliderContainer, grayCanvasToggle);
})();

(function toggleButtons() {
	btn = document.querySelector('#saveButton').cloneNode();
	btn.style.right = '100px';
	btn.setAttribute('data-original-title', 'Toggle Theme');
	btn.title = 'Toggle Theme';
	updateToggleStyle();
	btn.onclick = toggleDarkMode;

	document.querySelector('#gameInterface').append(btn);
})();

function changeBrightness() {
	brightnessLayer.style.filter = `brightness(${this.value})`;
	localStorage.canvasBrightness = this.value;
}

function updateToggleStyle() {
	btn.style.backgroundImage = darkMode ? 'url(https://i.imgur.com/imL02Mq.gif)' :
		'url(https://i.imgur.com/2ZdZ9oh.gif)';
}

function toggleDarkMode() {
	if (!grayCanvas) {
		pageHTML.classList.toggle('dark');
	}
	else {
		themes[darkMode ? 0 : 1].selected = true;
		themes.dispatchEvent(new Event('change'));
	}
}

function toggleCanvasDarkMode() {
	const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const data = imgData.data;

	for (let i = 0; i < data.length; i += 4) {
		const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

		if (r === 255 && g === 255 && b === 255 && darkMode) {
			const color = 68;
			data[i] = color;
			data[i + 1] = color;
			data[i + 2] = color;
		}
		else if (r === 68 && g === 68 && b === 68 && !darkMode) {
			const color = 255;
			data[i] = color;
			data[i + 1] = color;
			data[i + 2] = color;
		}
	}

	ctx.putImageData(imgData, 0, 0);
}

function fixColors() {
	let names = document.getElementsByClassName('gameAvatarName');
	updateToggleStyle();
	if (!names.length) {names = document.getElementsByClassName('gameSettingsAvatarName');}
	for (const name of names) {
		if (darkMode && name.style.color === 'black') {
			name.style.color = '#ccc';
		}
		else if (!darkMode && name.style.color === 'rgb(204, 204, 204)') {
			name.style.color = 'black';
		}
	}
}

const colorObserver = new MutationObserver(() => {
	fixColors();
});

colorObserver.observe(document.querySelector('#gamePlayersList'), {
	childList: true
});