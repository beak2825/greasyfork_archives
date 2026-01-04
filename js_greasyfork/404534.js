// ==UserScript==
// @name         Image Drop
// @version      1.2
// @description  Drag and drop images onto the canvas to load them
// @author       Bell
// @namespace    https://greasyfork.org/users/281093
// @match        https://sketchful.io/
// @grant        none
// jshint esversion: 6
// @downloadURL https://update.greasyfork.org/scripts/404534/Image%20Drop.user.js
// @updateURL https://update.greasyfork.org/scripts/404534/Image%20Drop.meta.js
// ==/UserScript==

document.querySelector('#private').style.display = 'inline';
const sketchCanvas = document.querySelector('#canvas');
const sketchCtx = sketchCanvas.getContext('2d');

sketchCanvas.addEventListener('dragenter', highlight, false);
sketchCanvas.addEventListener('dragleave', unhighlight, false);
sketchCanvas.addEventListener('drop', handleDrop, false);
sketchCanvas.addEventListener('dragover', function(event) {
	event.preventDefault();
}, false);

sketchCanvas.save = () => {
	canvas.dispatchEvent(new MouseEvent('pointerup', {
		bubbles: true,
		clientX: 0,
		clientY: 0,
		button: 0
	}));
};

function handleDrop(e) {
	e.preventDefault();
	sketchCanvas.style.filter = '';
	const dt = e.dataTransfer;
	const files = dt.files;

	if (files.length && files !== null) {
		handleFiles(files);
	}
}

function handleFiles(files) {
	([...files]).forEach(previewFile);
}

function previewFile(file) {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = () => {
		const img = document.createElement('img');
		img.src = reader.result;
		img.onload = () => { loadImage(img); };
	};
}

function loadImage(img) {
	if (img.height && img !== null && sketchCanvas.height) {
		const heightRatio = img.height / sketchCanvas.height;

		// Scale the image to fit the canvas
		if (heightRatio && heightRatio != 1) {
			img.height /= heightRatio;
			img.width /= heightRatio;
		}

		// Center the image
		const startX = Math.floor(sketchCanvas.width / 2 - img.width / 2);

		sketchCtx.drawImage(img, startX, 0, img.width, img.height);
		sketchCanvas.save();
	}
}

function highlight(e) {
	e.preventDefault();
	sketchCanvas.style.filter = 'brightness(0.5)';
}

function unhighlight(e) {
	e.preventDefault();
	sketchCanvas.style.filter = '';
}