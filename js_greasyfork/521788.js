// ==UserScript==
// @name         Gyazo Gif and Video Direct Link Button
// @namespace    typpi.online
// @version      3.7
// @description  Adds a link button to redirect to the direct video or gif link on Gyazo
// @author       Nick2bad4u
// @license      UnLicense
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @supportURL   https://github.com/Nick2bad4u/UserStyles/issues
// @match        https://gyazo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gyazo.com
// @grant        none
// @tag          gyazo
// @downloadURL https://update.greasyfork.org/scripts/521788/Gyazo%20Gif%20and%20Video%20Direct%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/521788/Gyazo%20Gif%20and%20Video%20Direct%20Link%20Button.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function createButtonElement() {
		console.log('Creating button element');
		const button = document.createElement('button');
		button.id = 'direct-video-link-button';
		button.classList.add('btn', 'explorer-action-btn', 'explorer-action-btn-dark');
		button.setAttribute('data-tooltip-content', 'Direct Link');

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('width', '24');
		svg.setAttribute('height', '24');
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.setAttribute('class', 'icon-link');

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute(
			'd',
			'M3.9 11.1c-.4.4-.4 1 0 1.4l6.6 6.6c.4.4 1 .4 1.4 0l3.6-3.6c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L10 16.6l-5.3-5.3 2.5-2.5c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0l-3.6 3.6zM20.1 3.9c-.4-.4-1-.4-1.4 0l-3.6 3.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l2.5-2.5L14 10l-6.6-6.6c-.4-.4-1-.4-1.4 0l-3.6 3.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0L10 3.4l5.3 5.3-2.5 2.5c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l3.6-3.6c.4-.4.4-1 0-1.4L13.6 2c-.4-.4-1-.4-1.4 0L4.6 9.6c-.4.4-.4 1 0 1.4.4.4 1 .4 1.4 0l5.3-5.3L14 10l6.6-6.6c.4-.4.4-1 0-1.4z',
		);

		svg.appendChild(path);
		button.appendChild(svg);

		console.log('Button element created', button);
		return button;
	}

	function createTooltipElement() {
		console.log('Creating tooltip element');
		const existingTooltip = document.getElementById('tooltip-direct-video-link-button');
		if (existingTooltip) {
			console.log('Existing tooltip found, removing it');
			existingTooltip.remove();
		}
		const tooltip = document.createElement('div');
		tooltip.id = 'tooltip-direct-video-link-button';
		tooltip.setAttribute('role', 'tooltip');
		tooltip.classList.add(
			'react-tooltip',
			'core-styles-module_tooltip__3vRRp',
			'styles-module_tooltip__mnnfp',
			'styles-module_dark__xNqje',
			'react-tooltip__place-bottom',
			'core-styles-module_show__Nt9eE',
			'react-tooltip__show',
		);
		tooltip.style.zIndex = '2147483647';
		tooltip.style.fontSize = '14px';
		tooltip.style.padding = '6px 10px';
		tooltip.style.maxWidth = '250px';
		tooltip.style.display = 'none';
		tooltip.style.position = 'absolute';
		tooltip.innerHTML =
			'Direct Link<div class="react-tooltip-arrow core-styles-module_arrow__cvMwQ styles-module_arrow__K0L3T" style="left: 38px; top: -4px;"></div>';

		document.body.appendChild(tooltip);

		console.log('Tooltip element created', tooltip);
		return tooltip;
	}

	function addTooltipListeners(button, tooltip) {
		console.log('Adding tooltip listeners');
		button.onmouseover = function () {
			console.log('Mouseover event on button');
			const rect = button.getBoundingClientRect();
			tooltip.style.left = rect.left + window.scrollX - 18.9453 + 'px';
			tooltip.style.top = rect.top + window.scrollY + 42 + 'px';
			tooltip.style.display = 'block';
			console.log('Tooltip displayed');
		};

		button.onmouseout = function () {
			console.log('Mouseout event on button');
			tooltip.style.display = 'none';
			console.log('Tooltip hidden');
		};
		console.log('Tooltip listeners added');
	}

	function extractDirectLink() {
		console.log('Extracting direct link');
		let directLink = '';
		const imgElement = document.querySelector('img.image-viewer');
		if (imgElement) {
			directLink = imgElement.src;
			console.log('Direct link extracted from image', directLink);
		} else {
			const sourceElement = document.querySelector('#gyazo-video-player > video > source');
			directLink = sourceElement ? sourceElement.src : '#';
			console.log('Direct link extracted from video source', directLink);
		}
		return directLink;
	}

	function addRedirectButton() {
		// Check if the button already exists
		if (document.getElementById('direct-video-link-button')) {
			console.log('Redirect button already exists, skipping creation');
			return;
		}

		console.log('Adding redirect button');

		let targetElement = null;
		let attempts = 0;
		const maxAttempts = 10;
		const interval = 500;

		const findTargetElement = () => {
			// Check again for existing button before retrying
			if (document.getElementById('direct-video-link-button')) {
				console.log('Redirect button already exists during retry, skipping creation');
				return;
			}

			targetElement = document.querySelector(
				'#react-root > div.header-block.explorer-header-block > div.explorer-action-btn-toolbar > div.explorer-action-btn-group',
			);

			if (targetElement) {
				console.log('Target element found');
				const button = createButtonElement();
				const tooltip = createTooltipElement();

				addTooltipListeners(button, tooltip);

				button.onclick = function () {
					const directLink = extractDirectLink();
					console.log('Button clicked, redirecting to', directLink);
					window.location.href = directLink;
				};

				targetElement.insertAdjacentElement('beforebegin', button);
				console.log('Redirect button added');
			} else if (attempts < maxAttempts) {
				attempts++;
				console.log(`Target element not found, retrying in ${interval}ms (attempt ${attempts}/${maxAttempts})`);
				setTimeout(findTargetElement, interval);
			} else {
				console.log('Target element not found after multiple attempts, exiting');
			}
		};

		findTargetElement();
	}

	// Removes the redirect button and tooltip from the DOM if they exist
	function removeRedirectButton() {
		console.log('Removing redirect button if it exists');
		const existingButton = document.getElementById('direct-video-link-button');
		if (existingButton) {
			console.log('Existing button found, removing it');
			existingButton.remove();
		}
		const existingTooltip = document.getElementById('tooltip-direct-video-link-button');
		if (existingTooltip) {
			console.log('Existing tooltip found, removing it');
			existingTooltip.remove();
		}
		console.log('Redirect button and tooltip removed');
	}

	function handlePageChange() {
		console.log('Handling page change');
		const currentUrl = location.href;
		if (currentUrl.includes('https://gyazo.com/captures')) {
			removeRedirectButton();
			console.log('On captures page, not adding button');
		} else {
			addRedirectButton();
		}
	}

	function initialize() {
		console.log('Initializing script');

		// Remove any existing button and tooltip to prevent duplicates
		removeRedirectButton();

		handlePageChange();

		// Store the observer globally for cleanup
		window.scriptObserver = new MutationObserver(() => {
			const currentUrl = location.href;
			if (currentUrl !== window.scriptObserver.lastUrl) {
				console.log('URL changed from', window.scriptObserver.lastUrl, 'to', currentUrl);
				window.scriptObserver.lastUrl = currentUrl;

				// Remove any existing button and tooltip before handling the page change
				removeRedirectButton();
				handlePageChange();
			}
		});

		window.scriptObserver.lastUrl = location.href;
		window.scriptObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
		console.log('Mutation observer added');
	}

	window.addEventListener('load', initialize);
	window.addEventListener('popstate', () => {
		console.log('A soft navigation has been detected:', location.href);

		// Cleanup existing observers and buttons
		if (window.scriptObserver) {
			console.log('Disconnecting existing mutation observer');
			window.scriptObserver.disconnect();
		}
		removeRedirectButton();

		// Reinitialize the script
		initialize();
	});
})();
