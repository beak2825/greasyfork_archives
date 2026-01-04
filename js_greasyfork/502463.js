// ==UserScript==
// @name         Select and Copy Gallery URLs
// @namespace    Violentmonkey Scripts
// @version      1.8.1
// @description  Select and copy multiple gallery URLs by clicking on elements
// @author       K0ng2
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @match        https://koharu.to/*
// @match        https://nhentai.net/*
// @grant        GM.setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502463/Select%20and%20Copy%20Gallery%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/502463/Select%20and%20Copy%20Gallery%20URLs.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Default highlight color
	const defaultHighlightColor = 'yellow';

	// Configuration for different websites
	const config = {
		'exhentai.org': {
			gallerySelector: '.gl1t',
			linkSelector: 'a',
		},
		'e-hentai.org': {
			gallerySelector: '.gl1t',
			linkSelector: 'a',
			highlightColor: 'lightcoral',
		},
		'koharu.to': {
			gallerySelector: 'article.border',
			linkSelector: 'a',
			highlightColor: 'lightcoral',
		},
		'nhentai.net': {
			gallerySelector: 'div.gallery',
			linkSelector: 'a',
		},
	};
	// Determine the current host and load the corresponding configuration
	const currentHost = window.location.host;
	const currentConfig = config[currentHost];

	if (!currentConfig) {
		console.warn('No configuration found for this website.');
		return;
	}

	let isSelecting = false;
	let selectedGalleries = new Set();

	// Create the "Select Galleries" button
	const selectButton = document.createElement('button');
	selectButton.innerText = 'Select Galleries';
	selectButton.style.position = 'fixed';
	selectButton.style.top = '10px';
	selectButton.style.left = '10px';
	selectButton.style.zIndex = 1000;
	selectButton.style.padding = '10px';
	selectButton.style.backgroundColor = '#4CAF50';
	selectButton.style.color = 'white';
	selectButton.style.border = 'none';
	selectButton.style.cursor = 'pointer';
	document.body.appendChild(selectButton);

	// Create the "Select All" button
	const selectAllButton = document.createElement('button');
	selectAllButton.innerText = 'Select All';
	selectAllButton.style.position = 'fixed';
	selectAllButton.style.top = '10px';
	selectAllButton.style.left = '130px';
	selectAllButton.style.zIndex = 1000;
	selectAllButton.style.padding = '10px';
	selectAllButton.style.backgroundColor = '#2196F3';
	selectAllButton.style.color = 'white';
	selectAllButton.style.border = 'none';
	selectAllButton.style.cursor = 'pointer';
	selectAllButton.style.display = 'none';
	document.body.appendChild(selectAllButton);

	// Create the "Clear All" button
	const clearAllButton = document.createElement('button');
	clearAllButton.innerText = 'Clear All';
	clearAllButton.style.position = 'fixed';
	clearAllButton.style.top = '10px';
	clearAllButton.style.left = '250px';
	clearAllButton.style.zIndex = 1000;
	clearAllButton.style.padding = '10px';
	clearAllButton.style.backgroundColor = '#FF9800';
	clearAllButton.style.color = 'white';
	clearAllButton.style.border = 'none';
	clearAllButton.style.cursor = 'pointer';
	clearAllButton.style.display = 'none';
	document.body.appendChild(clearAllButton);

	// Create the "Finish" button
	const finishButton = document.createElement('button');
	finishButton.innerText = 'Finish';
	finishButton.style.position = 'fixed';
	finishButton.style.top = '10px';
	finishButton.style.left = '370px';
	finishButton.style.zIndex = 1000;
	finishButton.style.padding = '10px';
	finishButton.style.backgroundColor = '#f44336';
	finishButton.style.color = 'white';
	finishButton.style.border = 'none';
	finishButton.style.cursor = 'pointer';
	finishButton.style.display = 'none';
	document.body.appendChild(finishButton);

	// Function to toggle selection mode
	selectButton.addEventListener('click', () => {
		isSelecting = !isSelecting;
		if (isSelecting) {
			finishButton.style.display = 'block';
			selectAllButton.style.display = 'block';
			clearAllButton.style.display = 'block';
			selectButton.innerText = 'Cancel';
			enableSelection();
		} else {
			finishButton.style.display = 'none';
			selectAllButton.style.display = 'none';
			clearAllButton.style.display = 'none';
			selectButton.innerText = 'Select Galleries';
			disableSelection();
			selectedGalleries.clear();
		}
	});

	// Function to enable selection
	function enableSelection() {
		const gridElements = document.querySelectorAll(currentConfig.gallerySelector);
		gridElements.forEach(element => {
			const linkElement = element.querySelector(currentConfig.linkSelector);
			linkElement.dataset.href = linkElement.href; // Store the href in a data attribute
			linkElement.removeAttribute('href'); // Temporarily remove the href

			element.style.cursor = 'pointer';
			element.addEventListener('click', selectGallery);
		});
	}

	// Function to disable selection
	function disableSelection() {
		const gridElements = document.querySelectorAll(currentConfig.gallerySelector);
		gridElements.forEach(element => {
			const linkElement = element.querySelector(currentConfig.linkSelector);
			if (linkElement.dataset.href) {
				linkElement.href = linkElement.dataset.href; // Restore the href
				delete linkElement.dataset.href; // Clean up the data attribute
			}

			element.style.cursor = 'default';
			element.removeEventListener('click', selectGallery);
			element.style.backgroundColor = ''; // Reset background color
		});
	}

	// Function to handle gallery selection
	function selectGallery(event) {
		if (isSelecting) {
			event.preventDefault(); // Prevent the default anchor click behavior

			const element = event.currentTarget;
			const url = element.querySelector(currentConfig.linkSelector).dataset.href;
			const highlightColor = currentConfig.highlightColor || defaultHighlightColor;

			if (selectedGalleries.has(url)) {
				selectedGalleries.delete(url);
				element.style.backgroundColor = ''; // Reset background color
			} else {
				selectedGalleries.add(url);
				element.style.backgroundColor = highlightColor; // Change background color to indicate selection
			}
		}
	}

	// Function to handle "Select All"
	selectAllButton.addEventListener('click', () => {
		const gridElements = document.querySelectorAll(currentConfig.gallerySelector);
		gridElements.forEach(element => {
			const url = element.querySelector(currentConfig.linkSelector).dataset.href;
			const highlightColor = currentConfig.highlightColor || defaultHighlightColor;

			if (!selectedGalleries.has(url)) {
				selectedGalleries.add(url);
				element.style.backgroundColor = highlightColor; // Set background color
			}
		});
	});

	// Function to handle "Clear All"
	clearAllButton.addEventListener('click', () => {
		const gridElements = document.querySelectorAll(currentConfig.gallerySelector);
		gridElements.forEach(element => {
			const url = element.querySelector(currentConfig.linkSelector).dataset.href;

			if (selectedGalleries.has(url)) {
				selectedGalleries.delete(url);
				element.style.backgroundColor = ''; // Reset background color
			}
		});
	});

	// Function to copy selected URLs
	finishButton.addEventListener('click', async () => {
		const urls = Array.from(selectedGalleries).join('\n');
		try {
			await GM.setClipboard(urls);
			alert('Copied URLs:\n' + urls);
		} catch (error) {
			alert('Failed to copy URLs: ' + error.message);
		}
		finishButton.style.display = 'none';
		selectAllButton.style.display = 'none';
		clearAllButton.style.display = 'none';
		selectButton.innerText = 'Select Galleries';
		disableSelection();
		selectedGalleries.clear();
	});
})();
