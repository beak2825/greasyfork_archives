// ==UserScript==
// @name        Color Picker
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/*
// @grant       none
// @version     0.7.5
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @description Color picker for Sketchful
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/406255/Color%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/406255/Color%20Picker.meta.js
// ==/UserScript==
// jshint esversion: 6

const defaultPalettes = [
	[
		'#ffffff', '#d3d1d2', '#f70f0f', '#ff7200', '#fce700', '#02cb00', '#01fe94', '#05b0ff', '#221ecd', '#a300bd', '#cc7fad', '#fdad88', '#9e5425',
		'#514f54', '#a9a7a8', '#ae0b00', '#c84706', '#ec9e06', '#007612', '#049d6f', '#00579d', '#0f0b96', '#6e0083', '#a65673', '#e38a5e', '#5e320d',
		'#000000', '#827c80', '#57060c', '#8b2500', '#9e6600', '#003f00', '#00766a', '#003b75', '#0e0151', '#3c0350', '#73314d', '#d1754e', '#421e06'
	],

	[
		'#3a3a3c', '#8e8e93', '#f8f9fa', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#fdad88', '#9e5425',
		'#2c2c2e', '#636366', '#e0e0e0', '#ff7070', '#f3a220', '#f9e079', '#049d6f', '#92ddea', '#6dafe0', '#ab87ff', '#ff87ab', '#e38a5e', '#5e320d',
		'#1c1c1e', '#48484a', '#c2c2c2', '#f54d4d', '#dc8700', '#f0c808', '#00766a', '#219bc3', '#548bbc', '#715aff', '#ff5d8f', '#d1754e', '#421e06'
	],

	[
		'#081c15', '#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7', '#d8f3dc', '#000000', '#faf9f9', '#ffd6ba', '#fec89a',
		'#774936', '#8a5a44', '#9d6b53', '#b07d62', '#c38e70', '#cd9777', '#d69f7e', '#deab90', '#e6b8a2', '#edc4b3', '#ffb5a7', '#fcd5ce', '#f8edeb',
		'#cb997e', '#eddcd2', '#fff1e6', '#f0efeb', '#ddbea9', '#a5a58d', '#b7b7a4', '#6d6875', '#b5838d', '#e5989b', '#ffb4a2', '#ffcdb2', '#f9dcc4'
	],

	[
		'#10002b', '#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd', '#c77dff', '#e0aaff', '#efcefa', '#d4b2d8', '#a88fac', '#826c7f', '#5d4e60',
		'#7c6f93', '#886f93', '#a967ad', '#ad6789', '#db81ad', '#ff6c91', '#ff736c', '#ff9e46', '#faa275', '#ff8c61', '#ce6a85', '#985277', '#5c374c',
		'#721b65', '#b80d57', '#f8615a', '#ffd868', '#bb596b', '#f96d80', '#ff9a76', '#ffc4a3', '#00e0ff', '#74f9ff', '#a6fff2', '#e8ffe8', '#ffffff'
	],

	[
		'#007f5f', '#2b9348', '#55a630', '#80b918', '#aacc00', '#bfd200', '#d4d700', '#dddf00', '#eeef20', '#ffff3f', '#03045e', '#0077b6', '#00b4d8',
		'#ff4800', '#ff5400', '#ff6000', '#ff6d00', '#ff7900', '#ff8500', '#ff9100', '#ff9e00', '#ffaa00', '#ffb600', '#90e0ef', '#caf0f8', '#000000',
		'#143642', '#263c41', '#38413f', '#4a473e', '#5c4d3c', '#6f523b', '#815839', '#935e38', '#a56336', '#b76935', '#000000', '#ffffff', '#ffffff'
	]
];
const palettes = JSON.parse(localStorage.getItem('palettes')) || defaultPalettes;
let paletteIndex = parseInt(localStorage.getItem('paletteIndex')) || 0;
let lockedPalettes = JSON.parse(localStorage.getItem('lockedPalettes')) || [0];

let activeColor = {
	node: null,
	index: null
};

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const gameTools = document.querySelector('#gameTools');
const chatBox = document.querySelector('#gameChat');
const colorButtons = document.querySelectorAll('.gameToolsColor');
const colorsDiv = document.querySelector('#gameToolsColors');
const colorButton = document.querySelector('#gameToolsColors > div:nth-child(1) > div:nth-child(1)');

const colorPickerWrapper = document.createElement('div');
const colorInput = document.createElement('input');
const colorPicker = document.createElement('input');
const inputStyle = 'margin: 5px 0; height: 20px; width: 35%; text-align: center; border: none;font-weight: 800; border-radius: 5px; background-color: #CBCBCB;';
const wrapperStyle = 'position: absolute; margin: 5px 35%; height: 20px; width: 37px; border-radius: 5px;';

(function init() {
	addPicker();
	updatePageStyle();
	addObservers();
	addListeners();
	changePalette();
})();

function addPicker() {
	colorPicker.type = 'color';
	colorPicker.setAttribute('style', 'opacity: 0; width: 37px; cursor: pointer;');
	colorPicker.oninput = updatePicker;
	colorPicker.setAttribute('data-toggle', 'tooltip');
	colorPicker.setAttribute('data-original-title', 'Color Picker');
	colorPicker.setAttribute('data-placement', 'bottom');
	colorPicker.title = 'Color Picker';

	colorPickerWrapper.setAttribute('style', wrapperStyle);
	colorPickerWrapper.style.backgroundColor = colorPicker.value;
	colorPickerWrapper.appendChild(colorPicker);
	gameTools.appendChild(colorPickerWrapper);

	colorInput.oninput = updateInput;
	colorInput.onclick = selectInputText;
	colorInput.setAttribute('style', inputStyle);
	colorInput.setAttribute('spellcheck', 'false');
	colorInput.setAttribute('maxlength', '7');
	colorInput.value = colorPicker.value;
	gameTools.appendChild(colorInput);
	addButtons();
}

const setColorDebounced = debounce(setColor, 5);

function debounce(func, delay) {
	let inDebounce;
	return function() {
		const context = this;
		const args = arguments;
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(context, args), delay);
	};
}

function addObservers() {
	const heightObserver = new MutationObserver(adjustChatSize);
	const config = {
		attributes: true
	};
	heightObserver.observe(gameTools, config);
	heightObserver.observe(chatBox, config);
}

let pickingColor = false;
function pickerIconOn(e) {
	if (e.code !== 'AltLeft') return;
	canvas.style.cursor = 'crosshair';
	pickingColor = true;
	e.preventDefault();
}

function pickerIconOff(e) {
	if (e.code !== 'AltLeft' || !pickingColor) return;
	pickingColor = false;
	regenerateCursor();
	e.preventDefault();
}

function regenerateCursor() {
	const selectedTool = document.querySelector('.gameToolsSelected');
	selectedTool.id === 'gameToolsDraw' ? selectedTool.nextSibling.click() :
		selectedTool.previousSibling.click();
	selectedTool.click();
}

function addListeners() {
	canvas.addEventListener('pointerdown', pickCanvasColor, false);
	document.addEventListener('keydown', pickerIconOn, true);
	document.addEventListener('keyup', pickerIconOff, true);

	const saveBtn = document.querySelector('#savePalette');
	saveBtn.addEventListener('dragenter', highlight, false);
	saveBtn.addEventListener('dragleave', unhighlight, false);
	saveBtn.addEventListener('drop', handleDrop, false);
	saveBtn.addEventListener('dragover', e => {
		e.preventDefault();
	}, false);

	document.addEventListener('keydown', e => {
		if (e.altKey && e.shiftKey && !isPaletteLocked(paletteIndex)) {
			colorsDiv.style.boxShadow = '0 0 0 2px red';
		}
	}, false);
	document.addEventListener('keyup', e => {
		if (e.altKey || e.shiftKey) {
			colorsDiv.style.boxShadow = '';
		}
	}, false);

	document.addEventListener('paste', e => {
		if (document.activeElement.tagName === 'INPUT') return;
		const paste = (e.clipboardData || window.clipboardData).getData('text');
		const coolorRegex = /coolors\.co\/([a-f0-9-]+)/;
		const match = coolorRegex.exec(paste);
		if (match) {addHexFromString(match[1]);}
	}, false);

	colorsDiv.addEventListener('pointerenter', () => {
		colorsDiv.addEventListener('pointerdown', editColor, true);
	});

	colorsDiv.addEventListener('pointerleave', () => {
		colorsDiv.removeEventListener('pointerdown', editColor, true);
	});

	document.addEventListener('keydown', e=> {
		if (!e.ctrlKey || e.code !== 'KeyZ') return;
		e.preventDefault();
	});
}

function updatePageStyle() {
	document.querySelector('#gameToolsSlider').style.top = '77px';
	gameTools.style.height = '200px';
}

function toggleLock() {
	const lockBtn = document.querySelector('#lockButton');
	if (lockBtn.getAttribute('state') === 'unlocked') {
		lockPalette(lockBtn);
	}
	else {
		unlockPalette(lockBtn);
	}
	updateLock();
}

function lockPalette() {
	lockedPalettes.push(paletteIndex);
	localStorage.setItem('lockedPalettes', JSON.stringify(lockedPalettes));
}

function unlockPalette() {
	const index = lockedPalettes.indexOf(paletteIndex);
	if (index < 0) return;
	lockedPalettes.splice(index, 1);
	localStorage.setItem('lockedPalettes', JSON.stringify(lockedPalettes));
}

function updateLock() {
	const lockBtn = document.querySelector('#lockButton');
	if (isPaletteLocked(paletteIndex)) {
		lockBtn.classList.remove('fa-unlock-alt');
		lockBtn.classList.add('fa-lock');
		lockBtn.setAttribute('state', 'locked');
		colorsDiv.style.boxShadow = '';
	}
	else {
		lockBtn.classList.add('fa-unlock-alt');
		lockBtn.classList.remove('fa-lock');
		lockBtn.setAttribute('state', 'unlocked');
	}
	resetActiveColor();
}

function addButtons() {
	const prevPaletteBtn = document.createElement('button');
	const saveColorBtn = document.createElement('button');
	const nextPaletteBtn = document.createElement('button');
	const lockBtn = document.createElement('button');

	const saveTooltip = 'Save Color<br>Hold <strong>shift</strong> to save the current palette.';
	const lockTooltip = 'Lock Current Palette';

	addButton(prevPaletteBtn, 'arrow-left', '5px 5px 5px 45px;');
	addButton(saveColorBtn, 'save', '5px 5px 5px 75px;', saveTooltip, 'savePalette');
	addButton(nextPaletteBtn, 'arrow-right', '5px 5px 5px 105px;');
	addButton(lockBtn, 'unlock-alt', '5px 5px 5px 135px;', lockTooltip, 'lockButton');
	lockBtn.setAttribute('state', 'unlocked');

	prevPaletteBtn.addEventListener('click', prevPalette, false);
	saveColorBtn.addEventListener('click', saveColor, false);
	nextPaletteBtn.addEventListener('click', nextPalette, false);
	lockBtn.addEventListener('click', toggleLock, false);
}

function nextPalette() {
	paletteIndex = paletteIndex < (palettes.length - 1) ? paletteIndex + 1 : 0;
	localStorage.setItem('paletteIndex', paletteIndex);
	changePalette();
}

function prevPalette() {
	paletteIndex = paletteIndex > 0 ? paletteIndex - 1 : palettes.length - 1;
	localStorage.setItem('paletteIndex', paletteIndex);
	changePalette();
}

function saveColor(e) {
	if (e.shiftKey) {
		downloadPalettes();
		return;
	}
	const currentPalette = palettes[paletteIndex];
	if (activeColor.index) {
		currentPalette[activeColor.index] = colorPicker.value;
	}
	else {
		addColor(colorPicker.value);
	}
	changePalette();
	savePalettes();
}

function addColor(color) {
	if (palettes[paletteIndex].length > 38 || isPaletteLocked(paletteIndex)) {
		palettes.push([]);
		paletteIndex = palettes.length - 1;
	}
	palettes[paletteIndex].push(color);
}

function rgbToHex(rgb) {
	const regEx = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
	const [, r, g, b] = regEx.exec(rgb);

	function hex(x) {
		return ('0' + parseInt(x).toString(16)).slice(-2);
	}

	return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function savePalettes() {
	localStorage.setItem('palettes', JSON.stringify(palettes));
}

function downloadPalettes() {
	const formattedPaletteData = JSON.stringify(palettes[paletteIndex]).replace(/\],/g, '],\n\n');
	download('palette.txt', formattedPaletteData);
}

function download(filename, text) {
	const pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);

	if (document.createEvent) {
		const event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		pom.dispatchEvent(event);
	}
	else {
		pom.click();
	}
}

function isPaletteLocked(index) {
	return lockedPalettes.includes(index);
}

function updateColorInputs(colorValue) {
	colorPickerWrapper.style.backgroundColor = colorValue;
	colorPicker.value = colorValue;
	colorInput.value = colorValue;
}

function editColor(event) {
	if (!event.target.classList.contains('gameToolsColor')) return;
	if (!event.shiftKey) updateColorInputs(rgbToHex(event.target.style.backgroundColor));

	if (isPaletteLocked(paletteIndex)) return;
	const color = {
		node: event.target,
		index: Array.prototype.indexOf.call(colorButtons, event.target)
	};

	if (event.altKey && event.shiftKey) {
		deletePalette(paletteIndex);
	}
	else if (event.altKey && color.index >= 0) {
		const palette = palettes[paletteIndex];
		palette.splice(color.index, 1);
		changePalette();
		if (isPaletteEmpty(palette)) deletePalette(paletteIndex);
		savePalettes();
	}
	else if (event.shiftKey && color.index >= 0) {
		setActiveColor(color);
	}
}

function deletePalette(index) {
	if (palettes.length < 2) return;
	palettes.splice(index, 1);
	lockedPalettes = lockedPalettes.map(lockedIndex => {
		return lockedIndex > index ? lockedIndex - 1 : lockedIndex;
	});
	localStorage.setItem('lockedPalettes', JSON.stringify(lockedPalettes));
	prevPalette();
	savePalettes();
	updateLock();
}

function changePalette() {
	if (paletteIndex < 0 || paletteIndex >= palettes.length) {
		paletteIndex = 0;
		localStorage.setItem('paletteIndex', paletteIndex);
	}
	colorButtons.forEach((button, idx) => {
		button.style.backgroundColor = palettes[paletteIndex][idx] || '#fff';
	});
	updateLock();
}

function isPaletteEmpty(palette) {
	if (!palette) return true;
	let empty = true;
	for (const color of palette) {
		if (color) {
			empty = false;
			break;
		}
	}
	return empty;
}

function setActiveColor(color) {
	resetActiveColor();
	activeColor = color;
	activeColor.node.style.border = 'solid 2px red';
}

function resetActiveColor() {
	if (activeColor.node) {
		activeColor.node.style.border = '';
		activeColor = {
			node: null,
			index: null
		};
	}
}

function addButton(button, icon, pos, tooltip = '', id = '') {
	const buttonStyle = `margin: ${pos}; position: absolute; height: 20px; border: none; background-color: #CBCBCB; border-radius: 5px;`;
	button.setAttribute('style', buttonStyle);
	button.setAttribute('class', `fas fa-${icon}`);
	tooltip && button.setAttribute('data-toggle', 'tooltip');
	tooltip && button.setAttribute('data-original-title', tooltip);
	button.setAttribute('data-placement', 'bottom');
	button.title = tooltip;
	button.id = id;
	gameTools.appendChild(button);
}

function updatePicker(event) {
	const color = event.target.value;
	colorPickerWrapper.style.backgroundColor = color;
	colorInput.value = color;
	setColorDebounced(color);
}

function updateInput(event) {
	const hexFound = /([0-9A-Fa-f]{3}){1,2}/.exec(event.target.value);
	if (!hexFound) return;
	const color = '#' + hexFound[0];
	colorPickerWrapper.style.backgroundColor = color;
	colorPicker.value = color;
	setColorDebounced(color);
}

const pointerdownEvent = new Event('pointerdown');

function setColor(color) {
	const prevColor = colorButton.style.backgroundColor;
	colorButton.style.backgroundColor = color;
	colorButton.dispatchEvent(pointerdownEvent);
	colorButton.style.backgroundColor = prevColor;
}

function selectInputText() {
	colorInput.select();
}

function pickCanvasColor(event) {
	if (!event.altKey) return;
	event.preventDefault();
	event.stopImmediatePropagation();
	const pos = getPos(event);
	const [r, g, b] = ctx.getImageData(pos.x, pos.y, 1, 1).data;
	const color = `rgb(${r}, ${g}, ${b})`;
	updateColorInputs(rgbToHex(color));
	setColorDebounced(color);
}

function getPos(event) {
	const canvasRect = canvas.getBoundingClientRect();
	const canvasScale = canvas.width / canvasRect.width;
	return {
		x: (event.clientX - canvasRect.left) * canvasScale,
		y: (event.clientY - canvasRect.top) * canvasScale
	};
}

function handleDrop(e) {
	e.preventDefault();
	colorsDiv.style.filter = '';
	handleFiles(e.dataTransfer.files);
}

function handleFiles(files) {
	if (!files) return;
	files = [...files];
	files.forEach(file => {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = loadPalette;
	});
}

function addPalette(palette) {
	if (palettes[paletteIndex].length + palette.length < 40 && !isPaletteLocked(paletteIndex)) {
		palettes[paletteIndex] = palettes[paletteIndex].concat(palette);
	}
	else {
		palettes.push(palette);
		paletteIndex = palettes.length - 1;
		localStorage.setItem('paletteIndex', paletteIndex);
	}
	resetPaletteState();
}

function loadPalette(event) {
	const loadedString = event.target.result;
	const coolorRegex = /CSV \*\/\s*(\S+)/;
	const arrayRegex = /\[\[?\s*([^\]]+)/g;
	const hexRegex = /#([0-9A-Fa-f]{3}){1,2}/g;
	const coolorMatch = loadedString.match(coolorRegex);
	const arrayMatch = loadedString.match(arrayRegex);
	if (coolorMatch) {
		const palette = coolorMatch[1].split(',').map(color => `#${color}`);
		addPalette(palette);
		return;
	}
	else if (arrayMatch) {
		const paletteMatch = arrayMatch.map(palette => palette.match(hexRegex));
		paletteMatch.forEach(palette => addPalette(palette));
	}
	else {
		addHexFromString(loadedString);
	}
}

function addHexFromString(string) {
	const hexRegex = /([0-9A-Fa-f]{3}){1,2}/g;
	const hexCodesFound = [...new Set(string.match(hexRegex))];
	console.log('Hex codes found: ', hexCodesFound);
	const codes = hexCodesFound.map(code => '#' + code);
	codes.forEach(code => addColor(code));
	changePalette();
	savePalettes();
}

function resetPaletteState() {
	updateLock();
	changePalette();
	savePalettes();
}

function highlight(e) {
	e.preventDefault();
	colorsDiv.style.filter = 'brightness(0.6)';
}

function unhighlight(e) {
	e.preventDefault();
	colorsDiv.style.filter = '';
}

function isDrawing() {
	return document.querySelector('#gameTools').style.display !== 'none';
}

function adjustChatSize() {
	chatBox.style.height = isDrawing() ? 'calc(100% - 200px)' : 'calc(100% - 180px)';
}