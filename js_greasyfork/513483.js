// ==UserScript==
// @name         Scroll to Bottom, Stay Button, and Auto-Reload with Persistence and Icons for reddit-stream.com
// @namespace    typpi.online
// @version      2.14
// @description  Adds a floating button to scroll to the bottom, checkboxes to stay at the bottom, and to reload the page every 10, 15, 20, or 30 seconds on reddit-stream.com, with persistent settings and icons for clarity.
// @author       Nick2bad4u
// @match        *://*.reddit-stream.com/*
// @connect      reddit-stream.com
// @grant        GM_xmlhttpRequest
// @license      Unlicense
// @resource     https://www.google.com/s2/favicons?sz=64&domain=reddit-stream.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit-stream.com
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=reddit-stream.com
// @tag          reddit
// @downloadURL https://update.greasyfork.org/scripts/513483/Scroll%20to%20Bottom%2C%20Stay%20Button%2C%20and%20Auto-Reload%20with%20Persistence%20and%20Icons%20for%20reddit-streamcom.user.js
// @updateURL https://update.greasyfork.org/scripts/513483/Scroll%20to%20Bottom%2C%20Stay%20Button%2C%20and%20Auto-Reload%20with%20Persistence%20and%20Icons%20for%20reddit-streamcom.meta.js
// ==/UserScript==

(function () {
	'use strict';

	console.log(
		'Script initialized: Adding floating button, checkboxes, and persistence.',
	);

	// Helper function for hover effect
	function handleHover(element) {
		element.addEventListener('mouseover', function () {
			element.style.opacity = '1';
		});
		element.addEventListener('mouseout', function () {
			element.style.opacity = '0.1';
		});
		console.log(`Hover effect applied to element: ${element}`);
	}

	// Function to save checkbox state
	function saveCheckboxState(key, value) {
		localStorage.setItem(key, value);
		console.log(`Saved checkbox state for ${key}: ${value}`);
	}

	// Function to load checkbox state
	function loadCheckboxState(key) {
		const state = localStorage.getItem(key) === 'true';
		console.log(`Loaded checkbox state for ${key}: ${state}`);
		return state;
	}

	// Styling for the checkboxes with hover title support for icons
	function styleCheckboxWrapper(wrapper, iconText, checkboxId, titleText) {
		wrapper.style.display = 'flex';
		wrapper.style.flexDirection = 'column';
		wrapper.style.alignItems = 'center';
		wrapper.style.position = 'fixed';
		wrapper.style.bottom = '20px';
		wrapper.style.zIndex = '1000';
		wrapper.style.cursor = 'pointer';
		wrapper.style.opacity = '0.1';
		wrapper.style.transition = 'opacity 0.3s';

		const label = document.createElement('label');
		label.htmlFor = checkboxId;
		label.style.cursor = 'pointer';

		const icon = document.createElement('div');
		icon.innerHTML = iconText;
		icon.style.fontSize = '12px';
		icon.style.color = 'orange';
		icon.style.marginTop = '5px';
		icon.title = titleText;

		label.appendChild(icon);
		wrapper.appendChild(label);
		handleHover(wrapper);

		console.log(
			`Checkbox wrapper styled with icon: ${iconText} and title: ${titleText}`,
		);
	}

	// Scroll-to-bottom button
	const button = document.createElement('button');
	button.innerHTML = '⬇️';
	button.style.position = 'fixed';
	button.style.bottom = '20px';
	button.style.right = '20px'; // Changed from left to right
	button.style.zIndex = '1000';
	button.style.padding = '10px';
	button.style.borderRadius = '50%';
	button.style.border = 'none';
	button.style.backgroundColor = 'black';
	button.style.color = 'blue';
	button.style.fontSize = '20px';
	button.style.cursor = 'pointer';
	button.style.opacity = '0.5';
	button.style.transition = 'opacity 0.3s';
	button.title = 'Click to scroll to the bottom';
	handleHover(button);

	button.addEventListener('click', function () {
		globalThis.scrollTo({
			top: document.body.scrollHeight,
			behavior: 'smooth',
		});
		console.log('Scroll-to-bottom button clicked, scrolling to the bottom.');
	});

	// Stay-at-bottom checkbox with icon
	const stayAtBottomWrapper = document.createElement('div');
	stayAtBottomWrapper.style.right = '60px'; // Changed from left to right
	const stayAtBottomCheckboxId = 'stayAtBottomCheckbox';
	styleCheckboxWrapper(
		stayAtBottomWrapper,
		'🔽',
		stayAtBottomCheckboxId,
		'Check to stay at the bottom',
	);

	const stayAtBottomCheckbox = document.createElement('input');
	stayAtBottomCheckbox.type = 'checkbox';
	stayAtBottomCheckbox.id = stayAtBottomCheckboxId;
	stayAtBottomCheckbox.checked = loadCheckboxState('stayAtBottom');
	stayAtBottomCheckbox.title = 'Check to stay at the bottom';
	stayAtBottomWrapper.insertBefore(
		stayAtBottomCheckbox,
		stayAtBottomWrapper.firstChild,
	);

	stayAtBottomCheckbox.addEventListener('change', function () {
		saveCheckboxState('stayAtBottom', stayAtBottomCheckbox.checked);
	});

	let scrollTimeout;
	const debounce = (fn, delay) => {
		return function () {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(fn, delay);
		};
	};

	const keepAtBottom = debounce(function () {
		if (stayAtBottomCheckbox.checked) {
			globalThis.scrollTo({
				top: document.body.scrollHeight,
				behavior: 'smooth',
			});
			console.log('Auto-scrolling to the bottom (Stay at Bottom active).');
		} else {
			console.log('Auto-scrolling stopped (Stay at Bottom inactive).');
		}
	}, 200);

	const observer = new MutationObserver(keepAtBottom);
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
	console.log('MutationObserver started for staying at the bottom.');

	// Auto-reload every 10 seconds checkbox with icon
	const autoReload10Wrapper = document.createElement('div');
	autoReload10Wrapper.style.right = '100px'; // Changed from left to right
	const autoReload10CheckboxId = 'autoReload10Checkbox';
	styleCheckboxWrapper(
		autoReload10Wrapper,
		'10s',
		autoReload10CheckboxId,
		'Check to reload every 10 seconds',
	);

	const autoReload10Checkbox = document.createElement('input');
	autoReload10Checkbox.type = 'checkbox';
	autoReload10Checkbox.id = autoReload10CheckboxId;
	autoReload10Checkbox.checked = loadCheckboxState('autoReload10');
	autoReload10Checkbox.title = 'Check to reload every 10 seconds';
	autoReload10Wrapper.insertBefore(
		autoReload10Checkbox,
		autoReload10Wrapper.firstChild,
	);

	let reloadInterval10;

	function startAutoReload10() {
		reloadInterval10 = setInterval(() => {
			globalThis.location.reload();
			console.log('Page reloading every 10 seconds.');
		}, 10000);
	}

	if (autoReload10Checkbox.checked) startAutoReload10();

	autoReload10Checkbox.addEventListener('change', function () {
		saveCheckboxState('autoReload10', autoReload10Checkbox.checked);
		if (autoReload10Checkbox.checked) {
			startAutoReload10();
		} else {
			clearInterval(reloadInterval10);
			console.log('Stopped reloading every 10 seconds.');
		}
	});

	// Auto-reload every 15 seconds checkbox with icon
	const autoReload15Wrapper = document.createElement('div');
	autoReload15Wrapper.style.right = '140px'; // Changed from left to right
	const autoReload15CheckboxId = 'autoReload15Checkbox';
	styleCheckboxWrapper(
		autoReload15Wrapper,
		'15s',
		autoReload15CheckboxId,
		'Check to reload every 15 seconds',
	);

	const autoReload15Checkbox = document.createElement('input');
	autoReload15Checkbox.type = 'checkbox';
	autoReload15Checkbox.id = autoReload15CheckboxId;
	autoReload15Checkbox.checked = loadCheckboxState('autoReload15');
	autoReload15Checkbox.title = 'Check to reload every 15 seconds';
	autoReload15Wrapper.insertBefore(
		autoReload15Checkbox,
		autoReload15Wrapper.firstChild,
	);

	let reloadInterval15;

	function startAutoReload15() {
		reloadInterval15 = setInterval(() => {
			globalThis.location.reload();
			console.log('Page reloading every 15 seconds.');
		}, 15000);
	}

	if (autoReload15Checkbox.checked) startAutoReload15();

	autoReload15Checkbox.addEventListener('change', function () {
		saveCheckboxState('autoReload15', autoReload15Checkbox.checked);
		if (autoReload15Checkbox.checked) {
			startAutoReload15();
		} else {
			clearInterval(reloadInterval15);
			console.log('Stopped reloading every 15 seconds.');
		}
	});

	// Auto-reload every 20 seconds checkbox with icon
	const autoReload20Wrapper = document.createElement('div');
	autoReload20Wrapper.style.right = '180px'; // Changed from left to right
	const autoReload20CheckboxId = 'autoReload20Checkbox';
	styleCheckboxWrapper(
		autoReload20Wrapper,
		'20s',
		autoReload20CheckboxId,
		'Check to reload every 20 seconds',
	);

	const autoReload20Checkbox = document.createElement('input');
	autoReload20Checkbox.type = 'checkbox';
	autoReload20Checkbox.id = autoReload20CheckboxId;
	autoReload20Checkbox.checked = loadCheckboxState('autoReload20');
	autoReload20Checkbox.title = 'Check to reload every 20 seconds';
	autoReload20Wrapper.insertBefore(
		autoReload20Checkbox,
		autoReload20Wrapper.firstChild,
	);

	let reloadInterval20;

	function startAutoReload20() {
		reloadInterval20 = setInterval(() => {
			globalThis.location.reload();
			console.log('Page reloading every 20 seconds.');
		}, 20000);
	}

	if (autoReload20Checkbox.checked) startAutoReload20();

	autoReload20Checkbox.addEventListener('change', function () {
		saveCheckboxState('autoReload20', autoReload20Checkbox.checked);
		if (autoReload20Checkbox.checked) {
			startAutoReload20();
		} else {
			clearInterval(reloadInterval20);
			console.log('Stopped reloading every 20 seconds.');
		}
	});

	// Auto-reload every 30 seconds checkbox with icon
	const autoReload30Wrapper = document.createElement('div');
	autoReload30Wrapper.style.right = '220px'; // Changed from left to right
	const autoReload30CheckboxId = 'autoReload30Checkbox';
	styleCheckboxWrapper(
		autoReload30Wrapper,
		'30s',
		autoReload30CheckboxId,
		'Check to reload every 30 seconds',
	);

	const autoReload30Checkbox = document.createElement('input');
	autoReload30Checkbox.type = 'checkbox';
	autoReload30Checkbox.id = autoReload30CheckboxId;
	autoReload30Checkbox.checked = loadCheckboxState('autoReload30');
	autoReload30Checkbox.title = 'Check to reload every 30 seconds';
	autoReload30Wrapper.insertBefore(
		autoReload30Checkbox,
		autoReload30Wrapper.firstChild,
	);

	let reloadInterval30;

	function startAutoReload30() {
		reloadInterval30 = setInterval(() => {
			globalThis.location.reload();
			console.log('Page reloading every 30 seconds.');
		}, 30000);
	}

	if (autoReload30Checkbox.checked) startAutoReload30();

	autoReload30Checkbox.addEventListener('change', function () {
		saveCheckboxState('autoReload30', autoReload30Checkbox.checked);
		if (autoReload30Checkbox.checked) {
			startAutoReload30();
		} else {
			clearInterval(reloadInterval30);
			console.log('Stopped reloading every 30 seconds.');
		}
	});

	// Append elements to the page
	document.body.appendChild(button);
	document.body.appendChild(stayAtBottomWrapper);
	document.body.appendChild(autoReload10Wrapper);
	document.body.appendChild(autoReload15Wrapper);
	document.body.appendChild(autoReload20Wrapper);
	document.body.appendChild(autoReload30Wrapper);
	console.log('All elements appended with styling and icons.');
})();
