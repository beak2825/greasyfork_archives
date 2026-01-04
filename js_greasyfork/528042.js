// ==UserScript==
// @name         FIX Pinterest - Save Original Image
// @namespace    http://tampermonkey.net/
// @version      6.0.0
// @description  Pinterest - Save Original Image frin haofong, but fixed NOW ON CHROME
// @author       creve (and tg:@letsalllovelain78, ty for BIG IMPROVEMENTS ON THIS)
// @include      https://*.pinterest.tld/*
// @grant        GM_download
// @run-at       document-end

// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528042/FIX%20Pinterest%20-%20Save%20Original%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/528042/FIX%20Pinterest%20-%20Save%20Original%20Image.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let currentHoveredElement = null;

	function handleMouseOver(event) {
		currentHoveredElement = event.target;
	}

	function findNearestImage(element) {
		if (element.tagName === 'IMG' && element.width > 50) {
			return element;
		}

		const imgInside = element.querySelector('img[srcset], img[src]');
		if (imgInside && imgInside.width > 50) {
			return imgInside;
		}

		let pinContainer = element;
		for (let i = 0; i < 5 && pinContainer; i++) {
			pinContainer = pinContainer.parentElement;

			if (pinContainer) {
				const pinImage = pinContainer.querySelector('img[srcset], img[src]');
				if (pinImage && pinImage.width > 50) {
					return pinImage;
				}
			}
		}

		return null;
	}

	function getOriginalImageUrl(imgElement) {
		if (!imgElement) return null;

		if (imgElement.srcset) {
			const srcsetParts = imgElement.srcset.split(',');
			let largestImageUrl = '';
			let largestSize = 0;

			for (const part of srcsetParts) {
				const [url, size] = part.trim().split(' ');
				const numericSize = parseInt(size);

				if (numericSize > largestSize) {
					largestSize = numericSize;
					largestImageUrl = url;
				}
			}

			if (largestImageUrl) {
				return largestImageUrl;
			}
		}

		if (imgElement.src) {
			let originalUrl = imgElement.src;

			originalUrl = originalUrl.replace(/\/\d+x\//, '/originals/');

			return originalUrl;
		}

		return null;
	}

	function getPinTitle(imgElement) {
		let container = imgElement;
		for (let i = 0; i < 8 && container; i++) {
			container = container.parentElement;

			if (container) {
				const titleElement = container.querySelector('h1, h2, h3, [data-test-id="pin-title"], div[title]');
				if (titleElement && titleElement.textContent) {
					return titleElement.textContent.trim().replace(/[/\\?%*:|"<>]/g, '-').substring(0, 50);
				}

				if (imgElement.alt && imgElement.alt.length > 3) {
					return imgElement.alt.trim().replace(/[/\\?%*:|"<>]/g, '-').substring(0, 50);
				}
			}
		}

		if (document.querySelector('div[role="dialog"]')) {
			const modalTitle = document.querySelector('div[role="dialog"] h1') ||
							  document.querySelector('div[role="dialog"] [data-test-id="pin-title"]');
			if (modalTitle && modalTitle.textContent) {
				return modalTitle.textContent.trim().replace(/[/\\?%*:|"<>]/g, '-').substring(0, 50);
			}
		}

		const pinId = window.location.pathname.split('/').pop() || '';
		return 'pinterest-pin-' + (pinId || Date.now());
	}

	function downloadPinterestImage() {
		if (!currentHoveredElement) {
			console.log('Couldnt find hovered image');
			showNotification('Hover over an image and press "Z"', 'error');
			return;
		}

		const imgElement = findNearestImage(currentHoveredElement);

		if (!imgElement) {
			console.log('Couldnt find hovered image');
			showNotification('Couldnt find hovered image', 'error');
			return;
		}

		const imageUrl = getOriginalImageUrl(imgElement);

		if (!imageUrl) {
			console.log('Couldnt parse image URL');
			showNotification('Couldnt parse image URL', 'error');
			return;
		}

		const fileName = getPinTitle(imgElement) + '.jpg';

		if (typeof GM_download !== 'undefined') {
			GM_download({
				url: imageUrl,
				name: fileName,
				onload: function() {
					console.log('Image downloaded successfully: ' + fileName);
					showNotification('Image downloaded: ' + fileName, 'success');
				},
				onerror: function(error) {
					console.error('Error while downloading:', error);
					showNotification('Error while downloading image', 'error');
				}
			});
		} else {
			const link = document.createElement('a');
			link.href = imageUrl;
			link.download = fileName;
			link.style.display = 'none';
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			setTimeout(() => {
				document.body.removeChild(link);
				showNotification('Image downloaded: ' + fileName, 'success');
			}, 100);
		}

		console.log('Donwloading iamge:', imageUrl);
	}

	function showNotification(message, type = 'info') {
		const existingNotification = document.getElementById('pinterest-downloader-notification');
		if (existingNotification) {
			document.body.removeChild(existingNotification);
		}

		const notification = document.createElement('div');
		notification.id = 'pinterest-downloader-notification';

		let backgroundColor = 'rgba(0, 0, 0, 0.7)';
		if (type === 'success') backgroundColor = 'rgba(0, 128, 0, 0.8)';
		if (type === 'error') backgroundColor = 'rgba(200, 0, 0, 0.8)';

		notification.style.cssText = `
			position: fixed;
			bottom: 20px;
			right: 20px;
			background-color: ${backgroundColor};
			color: white;
			padding: 12px 18px;
			border-radius: 5px;
			z-index: 999999;
			font-size: 14px;
			font-family: Arial, sans-serif;
			box-shadow: 0 2px 5px rgba(0,0,0,0.3);
			max-width: 300px;
			opacity: 1;
			transition: opacity 0.3s;
		`;
		notification.textContent = message;
		document.body.appendChild(notification);

		setTimeout(() => {
			notification.style.opacity = '0';
			setTimeout(() => {
				if (document.body.contains(notification)) {
					document.body.removeChild(notification);
				}
			}, 300);
		}, 3000);
	}

	function addHoverIndicator() {
		const indicator = document.createElement('div');
		indicator.id = 'pinterest-hover-indicator';
		indicator.style.cssText = `
			position: fixed;
			padding: 5px 10px;
			background-color: rgba(0, 0, 0, 0.7);
			color: white;
			border-radius: 3px;
			font-size: 12px;
			z-index: 999999;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.2s;
		`;
		indicator.textContent = 'Press "Z" to download';
		document.body.appendChild(indicator);

		document.addEventListener('mousemove', function(event) {
			const element = event.target;
			const imgElement = findNearestImage(element);

			if (imgElement) {
				indicator.style.left = (event.clientX + 15) + 'px';
				indicator.style.top = (event.clientY + 15) + 'px';
				indicator.style.opacity = '1';
			} else {
				indicator.style.opacity = '0';
			}
		});

		document.addEventListener('mouseout', function(event) {
			if (!event.relatedTarget) {
				indicator.style.opacity = '0';
			}
		});
	}

	document.addEventListener('keydown', function(event) {
		if ((event.key === 'z' || event.key === 'я') &&
			!(event.target.tagName === 'INPUT' ||
			  event.target.tagName === 'TEXTAREA' ||
			  event.target.isContentEditable)) {
			event.preventDefault();
			downloadPinterestImage();
		}
	});

	document.addEventListener('mouseover', handleMouseOver);

	addHoverIndicator();

	setTimeout(() => {
		showNotification('Pinterest Downloader active! Hover over a image and press "Z" to download', 'info');
	}, 2000);
})();
