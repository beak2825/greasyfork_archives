// ==UserScript==
// @name        Animation
// @description Animation tools for Sketchful.io
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     0.8
// @author      Bell
// @license     MIT
// @copyright   2020, Bell (https://openuserjs.org/users/Bell)
// @require     https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.3.2/gifshot.min.js
// @require		https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// @require     https://cdn.jsdelivr.net/npm/libgif@0.0.3/libgif.min.js
// @downloadURL https://update.greasyfork.org/scripts/408196/Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/408196/Animation.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const css = `
	#layerContainer::-webkit-scrollbar {
		width: 5px;
		height: 5px;
		overflow: hidden
	}

	#layerContainer::-webkit-scrollbar-track {
		background: none
	}

	#layerContainer::-webkit-scrollbar-thumb {
		background: #F5BC09;
		border-radius: 5px
	}

	#layerContainer {
		white-space: nowrap;
		overflow: auto;
		justify-content: center;
		margin-top: 10px;
		max-width: 70%;
		height: 124px;
		background: rgb(0 0 0 / 30%);
		padding: 12px;
		overflow-y: hidden;
		border-radius: 10px;
		margin-bottom: 5px;
		width: 100%;
		user-select: none;
		scrollbar-width: thin;
		scrollbar-color: #F5BC09 transparent;
	}

	.layer {
		width: 100%;
		position: absolute;
		pointer-events: none;
		image-rendering: pixelated;
	}

	#layerContainer img {
		width: 133px;
		cursor: pointer;
		margin-right: 5px
	}

	#buttonContainer {
		max-width: 260px;
		min-width: 260px;
	}

	#buttonContainer div {
		height: fit-content;
		margin-top: 10px;
		margin-left: 10px;
	}

	#buttonContainer {
		width: 15%;
		padding-top: 5px
	}

	#gifPreview {
		position: absolute;
		z-index: 1;
		width: 100%;
		image-rendering: pixelated;
	}

	.hidden {
		display: none
	}

	#activeLayer {
		margin-top: -1px;
		border: 3px solid red
	}

	#buttonContainer input {
		width: 50px;
		border: none;
		height: 30px;
		text-align: center;
		border-radius: 5px
	}

	#buttonContainer input::-webkit-input-placeholder {
		text-align: center;
	}
`;

const outerContainer = document.createElement('div');
const onionContainer = document.createElement('div');
const gameDiv = document.querySelector('.game');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const layerContainer = addLayerContainer();
const onionLayers = createOnionLayers();

(function init() {
	addButtons();
	addCSS(css);
	addListeners();
	addObservers();
})();

function addListeners() {
	layerContainer.addEventListener('dragenter', highlight, false);
	layerContainer.addEventListener('dragleave', unhighlight, false);
	layerContainer.addEventListener('drop', handleDrop, false);
	layerContainer.addEventListener('dragover', preventDefault, false);

	document.addEventListener('keydown', documentKeydown);
}

function addObservers() {
	const gameModeObserver = new MutationObserver(checkRoomType);
	const config = { attributes: true };
	gameModeObserver.observe(gameDiv, config);
	gameModeObserver.observe(canvas, config);
}

function addCSS(style) {
	const stylesheet = document.createElement('style');
	stylesheet.type = 'text/css';
	stylesheet.innerText = style;
	document.head.appendChild(stylesheet);
}

let copied = null;
function documentKeydown(e) {
	if (document.activeElement.tagName === 'INPUT') return;

	if (e.code === 'KeyC' && e.ctrlKey) {
		const selectedLayer = document.querySelector('#activeLayer');
		if (!selectedLayer) return;
		copied = selectedLayer.cloneNode();
		e.stopImmediatePropagation();
	}
	else if (e.code === 'KeyV' && copied && e.ctrlKey) {
		pasteLayer();
	}
}

function pasteLayer() {
	const selectedLayer = document.querySelector('#activeLayer');
	const copy = copied.cloneNode();

	if (selectedLayer) {
		insertAfter(copy, selectedLayer);
	}
	else {layerContainer.append(copy);}

	resetActiveLayer();
	setActiveLayer({ target: copy });
	copy.scrollIntoView();
}

function checkRoomType() {
	outerContainer.style.display = isFreeDraw() ? 'flex' : 'none';
	onionContainer.style.display = isFreeDraw() ? '' : 'none';
}

function addLayer() {
	const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	saveLayer(canvas);

	onionLayers.previous.putImageData(imgData, 0, 0);
	makeTransparent(onionLayers.previous, 30, 0);
}

function createOnionLayers() {
	canvas.parentElement.insertBefore(onionContainer, canvas);
	return {
		previous: createLayer().getContext('2d'),
		next: createLayer().getContext('2d'),
		hide: () => {
			onionContainer.classList.add('hidden');
		},
		show: () => {
			onionContainer.classList.remove('hidden');
		}
	};
}

function saveGif() {
	const container = document.querySelector('#layerContainer');
	if (!container.childElementCount) return;

	const layers = Array.from(container.children).map(image => image.src);
	const interval = getInterval();

	gifshot.createGIF({
		gifWidth: canvas.width,
		gifHeight: canvas.height,
		interval: interval / 1000,
		images: layers
	}, downloadGif);
}

function extractFrames(img) {
	const gifLoaderTemp = document.createElement('div');

	gifLoaderTemp.style.display = 'none';
	gifLoaderTemp.append(img);

	document.body.append(gifLoaderTemp);
	img.setAttribute ('rel:auto_play', 0);
	const gif = new SuperGif({ gif: img });

	gif.load(()=> {
		const gifCanvas = gif.get_canvas();

		if (gifCanvas.width !== canvas.width || gifCanvas.height !== canvas.height) {
			alert('Not a sketchful gif');
			return;
		}

		const numFrames = gif.get_length();
		for (let i = 0; i < numFrames; i++) {
			gif.move_to(i);
			saveLayer(gifCanvas);
		}
	});
}

function handleDrop(e) {
	e.preventDefault();
	layerContainer.style.filter = '';
	const dt = e.dataTransfer;
	const files = dt.files;

	if (files.length && files !== null) {
		handleFiles(files);
	}
}

function handleFiles(files) {
	files = [...files];
	files.forEach(previewFile);
}

function previewFile(file) {
	const reader = new FileReader();
	reader.readAsDataURL(file);

	reader.onloadend = function() {
		const gif = document.createElement('img');
		gif.src = reader.result;
		extractFrames(gif);
	};
}

function highlight(e) {
	e.preventDefault();
	layerContainer.style.filter = 'drop-shadow(0px 0px 6px green)';
}

function unhighlight(e) {
	e.preventDefault();
	layerContainer.style.filter = '';
}

function saveLayer(canv) {
	const activeLayer = document.querySelector('#activeLayer');
	const container = document.querySelector('#layerContainer');
	const img = document.createElement('img');
	img.src = canv.toDataURL();

	if (activeLayer) {
		insertAfter(img, activeLayer);
		setActiveLayer({ target: img });
	}
	else {
		container.append(img);
	}
	img.scrollIntoView();
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function setActiveLayer(e) {
	const img = e.target;
	if (img.tagName !== 'IMG') {
		resetActiveLayer();
		return;
	}
	resetActiveLayer();

	img.id = 'activeLayer';
	if (!e.shiftKey) {
		ctx.drawImage(img, 0, 0);
		canvas.save();
	}

	const previousImg = img.previousSibling;
	const nextImg = img.nextSibling;

	if (previousImg) {
		onionLayers.previous.drawImage(previousImg, 0, 0);
		makeTransparent(onionLayers.previous, 30, 0);
	}
	else {
		onionLayers.previous.clearRect(0, 0, canvas.width, canvas.height);
	}

	if (nextImg) {
		onionLayers.next.drawImage(nextImg, 0, 0);
		makeTransparent(onionLayers.next, 0, 30);
	}
	else {
		onionLayers.next.clearRect(0, 0, canvas.width, canvas.height);
	}
}

function resetActiveLayer() {
	const layer = document.querySelector('#activeLayer');
	if (!layer) return;
	layer.id = '';
	layer.style.border = '';
}

function createLayer() {
	const canvasLayer = document.createElement('canvas');
	canvasLayer.classList.add('layer');
	canvasLayer.width = canvas.width;
	canvasLayer.height = canvas.height;
	onionContainer.appendChild(canvasLayer);
	return canvasLayer;
}

function downloadGif(obj) {
	const name = 'sketchful-gif-' + Date.now();
	const a = document.createElement('a');
	a.download = name + '.gif';
	a.href = obj.image;
	a.click();
}

function addButton(text, clickFunction, element, type) {
	const button = document.createElement('div');
	button.setAttribute('class', `btn btn-sm btn-${type}`);
	button.textContent = text;
	button.onpointerup = clickFunction;
	element.append(button);
	return button;
}

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

function getInterval() {
	const input = document.querySelector('#gifIntervalInput');
	let fps = parseInt(input.value);

	if (isNaN(fps)) fps = 10;

	fps = clamp(fps, 1, 50);
	input.value = fps;
	return 1000 / fps;
}

function removeLayer() {
	const activeLayer = document.querySelector('#activeLayer');
	if (!activeLayer) return;
	activeLayer.remove();
}

function overwriteLayer() {
	const activeLayer = document.querySelector('#activeLayer');
	if (!activeLayer) return;
	activeLayer.src = canvas.toDataURL();
}

let ahead = false;
function toggleAhead() {
	ahead = !ahead;
	onionLayers.next.canvas.style.display = ahead ? 'none' : '';
	this.classList.toggle('btn-danger');
	this.classList.toggle('btn-info');
}

function addButtons() {
	const buttonContainer = document.createElement('div');
	buttonContainer.id = 'buttonContainer';

	outerContainer.append(buttonContainer);
	addButton('Play', playAnimation, buttonContainer, 'success');
	const downloadBtn = addButton('Download', saveGif, buttonContainer, 'primary');
	addButton('Save Layer', addLayer, buttonContainer, 'info');
	addButton('Delete', removeLayer, buttonContainer, 'danger');
	addButton('Overwrite', overwriteLayer, buttonContainer, 'warning');
	addButton('Onion', toggleOnion, buttonContainer, 'success');
	addButton('Ahead', toggleAhead, buttonContainer, 'info');

	const textDiv = document.createElement('div');
	const textInput = document.createElement('input');
	textDiv.classList.add('btn');
	textDiv.style.padding = '0px';
	textInput.placeholder = 'FPS';
	textInput.id = 'gifIntervalInput';
	setInputFilter(textInput, v => /^\d*\.?\d*$/.test(v));
	textDiv.append(textInput);

	buttonContainer.insertBefore(textDiv, downloadBtn);
}

function containerScroll(e) {
	e.preventDefault();
	const container = document.querySelector('#layerContainer');
	if (e.deltaY > 0) container.scrollLeft += 100;
	else container.scrollLeft -= 100;
}

function containerClick(e) {
	if (e.button !== 0) {
		resetActiveLayer();
		return;
	}
	setActiveLayer(e);
}

function preventDefault(e) {
	e.preventDefault();
}

function addLayerContainer() {
	const game = document.querySelector('div.gameParent');
	const container = document.createElement('div');

	outerContainer.style.display = 'flex';
	outerContainer.style.flexDirection = 'row';
	outerContainer.style.justifyContent = 'center';

	container.addEventListener('wheel', containerScroll);
	container.addEventListener('pointerdown', containerClick, true);
	container.addEventListener('contextmenu', preventDefault, true);

	container.id = 'layerContainer';

	new Sortable(container, { animation: 150 });
	outerContainer.append(container);

	game.append(outerContainer);
	return container;
}

let onion = true;

function toggleOnion() {
	onion = !onion;
	this.textContent = onion ? 'Onion' : 'Onioff';
	if (onion) {
		onionLayers.show();
	}
	else {
		onionLayers.hide();
	}
	this.classList.toggle('btn-success');
	this.classList.toggle('btn-danger');
}

let animating = false;

function stopAnimation() {
	let preview = document.querySelector('#gifPreview');
	this.classList.toggle('btn-success');
	this.classList.toggle('btn-danger');
	this.textContent = 'Play';
	while (preview) {
		preview.remove();
		preview = document.querySelector('#gifPreview');
	}
	animating = false;
}

function playAnimation() {
	if (animating) {
		stopAnimation.call(this);
		return;
	}

	const canvasCover = document.querySelector('#canvasCover');
	const img = document.createElement('img');
	img.id = 'gifPreview';
	img.draggable = false;
	canvasCover.parentElement.insertBefore(img, canvasCover);

	let frame = layerContainer.firstChild;
	if (!frame) return;
	const interval = getInterval();

	this.classList.toggle('btn-success');
	this.classList.toggle('btn-danger');
	this.textContent = 'Stop';
	animating = true;

	(function playFrame() {
		if (!animating) return;
		img.src = frame.src;
		frame = frame.nextSibling || layerContainer.firstChild;
		setTimeout(playFrame, interval);
	})();
}

function isFreeDraw() {
	return (
		document.querySelector('#canvas').style.display !== 'none' &&
		document.querySelector('#gameClock').style.display === 'none' &&
		document.querySelector('#gameSettings').style.display === 'none'
	);
}

function setInputFilter(textbox, inputFilter) {
	['input', 'keydown', 'keyup', 'mousedown',
		'mouseup', 'select', 'contextmenu', 'drop'].forEach(function(event) {
		textbox.addEventListener(event, function() {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			}
			else if (this.hasOwnProperty('oldValue')) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			}
			else {
				this.value = '';
			}
		});
	});
}

function makeTransparent(context, red, green) {
	const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imgData.data;

	for(let i = 0; i < data.length; i += 4) {
		const [r, g, b] = data.slice(i, i + 3);
		if (r >= 200 && g >= 200 && b >= 200) {
			data[i + 3] = 0;
		}
		else {
			data[i] += (data[i] + red) <= 255 ? red : 0;
			data[i + 1] += (data[i + 1] + green) <= 255 ? green : 0;
			data[i + 3] = 130;
		}
	}

	context.putImageData(imgData, 0, 0);
}

canvas.save = () => {
	canvas.dispatchEvent(new MouseEvent('pointerup', {
		bubbles: true,
		clientX: 0,
		clientY: 0,
		button: 0
	}));
};