// ==UserScript==
// @name         SauceNAO Drag and Drop Image Anywhere in Page
// @version      1.0
// @description  Better drag-and-drop for SauceNAO with visual feedback
// @match        https://saucenao.com/
// @license      public domain
// @namespace    https://greasyfork.org/users/1468364
// @downloadURL https://update.greasyfork.org/scripts/544011/SauceNAO%20Drag%20and%20Drop%20Image%20Anywhere%20in%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/544011/SauceNAO%20Drag%20and%20Drop%20Image%20Anywhere%20in%20Page.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Create style element for borders
	const style = document.createElement('style');
	style.textContent = `
		.drag-border-side {
			position: fixed;
			top: 0;
			bottom: 0;
			border-left: 0.5em dashed #ccc;
			border-right: 0.5em dashed #ccc;
			pointer-events: none;
			z-index: 9999;
			opacity: 0;
			transition: opacity 0.1s;
		}
		.drag-border-side.left {
			left: 0;
		}
		.drag-border-side.right {
			right: 0;
		}
		.drag-border-side.active {
			opacity: 1;
		}
	`;
	document.head.appendChild(style);

	// Create border elements
	const leftBorder = document.createElement('div');
	leftBorder.className = 'drag-border-side left';

	const rightBorder = document.createElement('div');
	rightBorder.className = 'drag-border-side right';

	document.body.appendChild(leftBorder);
	document.body.appendChild(rightBorder);

	// Track drag state
	let isDragging = false;

	// Show borders when dragging starts
	document.addEventListener('dragenter', function(e) {
		if (!isDragging) {
			isDragging = true;
			leftBorder.classList.add('active');
			rightBorder.classList.add('active');
		}
	});

	// Hide borders when dropped
	document.addEventListener('drop', function(e) {
		if (isDragging) {
			isDragging = false;
			leftBorder.classList.remove('active');
			rightBorder.classList.remove('active');
		}
	});

	// Hide borders if user cancels drag
	document.addEventListener('dragleave', function(e) {
		if (!e.relatedTarget || e.relatedTarget === document) {
			isDragging = false;
			leftBorder.classList.remove('active');
			rightBorder.classList.remove('active');
		}
	});

	// Handle the drop
	document.ondrop = function(event) {
		event.preventDefault();

		const fileInput = document.getElementById("fileInput");
		if (event.dataTransfer.files.length > 0) {
			fileInput.files = event.dataTransfer.files;
			checkImageFile(fileInput);
		} else {
			const urlInput = document.getElementById("urlInput");
			urlInput.value = event.dataTransfer.getData("text/uri-list");
			getURLInput(urlInput);
		}
	};

	// Prevent default behavior
	document.ondragover = function(event) {
		event.preventDefault();
	};
})();