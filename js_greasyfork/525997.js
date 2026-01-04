// ==UserScript==
// @name         Kiwifarms - Expand Avatars on Hover
// @namespace    typpi.online
// @version      1.2.1
// @description  Expand avatars on hover for Kiwifarms Users
// @author       Nick2bad4u
// @match        kiwifarms.com/*
// @match        kiwifarms.net/*
// @match        kiwifarms.ms/*
// @match        kiwifarms.ru/*
// @match        kiwifarms.is/*
// @match        kiwifarms.top/*
// @match        kiwifarms.tw/*
// @match        kiwifarms.hk/*
// @match        kiwifarms.nl/*
// @match        sneed.today/*
// @match        kiwifarms.pl/*
// @match        kiwifarms.st/*
// @connect      kiwifarms.st/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepageURL  https://github.com/Nick2bad4u/UserStyles
// @license      Unlicense
// @resource     https://www.google.com/s2/favicons?sz=64&domain=kiwifarms.st
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiwifarms.st
// @icon64       https://www.google.com/s2/favicons?sz=64&domain=kiwifarms.st
// @tag          kiwifarms
// @downloadURL https://update.greasyfork.org/scripts/525997/Kiwifarms%20-%20Expand%20Avatars%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/525997/Kiwifarms%20-%20Expand%20Avatars%20on%20Hover.meta.js
// ==/UserScript==

/* eslint-disable no-undef */

(function () {
	'use strict';

	// Default settings
	const defaultSize = 400;
	const defaultScale = 2;
	let avatarSize = GM_getValue('avatarSize', defaultSize);
	let avatarScale = GM_getValue('avatarScale', defaultScale);

	// Add custom styles for the expanded avatar
	const style = document.createElement('style');
	style.textContent = `
			.expanded-avatar {
					position: absolute;
					border: 2px solid #000;
					border-radius: 50%;
					max-width: ${avatarSize}px;
					max-height: ${avatarSize}px;
					z-index: 9999;
					display: none;
					transform: scale(${avatarScale});
			}
	`;
	document.head.appendChild(style);

	// Create an element to show the expanded avatar
	const expandedAvatar = document.createElement('img');
	expandedAvatar.className = 'expanded-avatar';
	document.body.appendChild(expandedAvatar);

	// Function to show the expanded avatar
	function showExpandedAvatar(event) {
			const avatar = event.target;
			expandedAvatar.src = avatar.src;
			expandedAvatar.style.left = `${event.pageX + 60}px`;
			expandedAvatar.style.top = `${event.pageY + 60}px`;
			expandedAvatar.style.display = 'block';
	}

	// Function to hide the expanded avatar
	function hideExpandedAvatar() {
			expandedAvatar.style.display = 'none';
	}

	// Attach event listeners to avatar images
	document.querySelectorAll('.avatar img').forEach((avatar) => {
			avatar.addEventListener('mouseover', showExpandedAvatar);
			avatar.addEventListener('mouseout', hideExpandedAvatar);
	});

	// Update avatar position on mouse move
	document.addEventListener('mousemove', (event) => {
			if (expandedAvatar.style.display === 'block') {
					expandedAvatar.style.left = `${event.pageX + 60}px`;
					expandedAvatar.style.top = `${event.pageY + 60}px`;
			}
	});

	// Function to set avatar size
	function setAvatarSize() {
			const size = prompt('Enter the avatar size (in pixels, max 400):', avatarSize);
			if (size !== null) {
					// Check if the input is a valid number and within the limit
					const parsedSize = parseInt(size, 10);
					if (!isNaN(parsedSize) && parsedSize > 0 && parsedSize <= 400) {
							avatarSize = parsedSize;
							GM_setValue('avatarSize', avatarSize);
							updateStyle();
					} else {
							alert('Please enter a valid positive number up to 400 for avatar size.');
					}
			}
	}

	// Function to set avatar scale
	function setAvatarScale() {
			const scale = prompt('Enter the avatar scale (e.g., 2 for 200%):', avatarScale);
			if (scale !== null) {
					// Check if the input is a valid number
					const parsedScale = parseFloat(scale);
					if (!isNaN(parsedScale) && parsedScale > 0 && parsedScale <= 2) {
							avatarScale = parsedScale;
							GM_setValue('avatarScale', avatarScale);
							updateStyle();
					} else {
							alert('Please enter a valid positive number for avatar scale.');
					}
			}
	}

	// Function to update the custom styles
	function updateStyle() {
			style.textContent = `
					.expanded-avatar {
							position: absolute;
							border: 2px solid #000;
							border-radius: 50%;
							max-width: ${avatarSize}px;
							max-height: ${avatarSize}px;
							z-index: 9999;
							display: none;
							transform: scale(${avatarScale});
					}
			`;
	}

	// Register menu commands to set avatar size and scale
	GM_registerMenuCommand('Set Avatar Hover Size', setAvatarSize);
	GM_registerMenuCommand('Set Avatar Hover Scale', setAvatarScale);
})();
