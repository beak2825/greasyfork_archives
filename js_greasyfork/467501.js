// ==UserScript==
// @name         YouTube Fixed Video Quality
// @name:zh-TW   YouTube固定影片畫質
// @name:zh-CN   YouTube固定视频画质

// @description          Remember video quality without any additional user interface.
// @description:zh-TW    記住選取的 YouTube 影片畫質，不需任何額外的操作介面。
// @description:zh-CN    记住选取的 YouTube 视频画质，不需任何额外的操作介面。

// @license MIT
// @namespace    https://greasyfork.org/users/1086571
// @version      1.2
// @author       IzsKon
// @match        https://www.youtube.com/*
// @icon         https://raw.githubusercontent.com/IzsKon/YouTube-Fixed-Video-Quality/main/icon.png
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/467501/YouTube%20Fixed%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/467501/YouTube%20Fixed%20Video%20Quality.meta.js
// ==/UserScript==

(async function() {
	'use strict';

	let vidQuality = await GM.getValue( 'videoQuality', 1 );
	let player = null;

	document.addEventListener('yt-player-updated', () => {

		/* Check page type. Video url should be /watch or /live */
		if ( /^\/watch|^\/live/.test(window.location.pathname) ) {
			setVideoQuality();
		}
	});


	async function setVideoQuality() {

		/* Load settings panel. */
		let settingsBtn = document.querySelector('.ytp-settings-button');
		settingsBtn.click();
		settingsBtn.click();

		/* Open quality selection panel. */
		let qualityBtn = document.querySelector('.ytp-menuitem-content div:not(.ytp-menuitem-toggle-checkbox)');
		if (!qualityBtn) { /* Video not loaded: stream not started or other issues. */
			detectVideoStart();
			return;
		}
		qualityBtn.click();
		let qualityOptions = document.querySelectorAll('.ytp-quality-menu .ytp-menuitem:not(:has(.ytp-premium-label))');

		/* Close quality selection panel. */
		settingsBtn.click();
		settingsBtn.click();

		/* Select video quality. */
		let nth_option = qualityOptions.length - vidQuality;
		qualityOptions[ Math.max(0, nth_option) ].click();

		/* Add event listener to quality selection. */
		for ( let i = 0; i < qualityOptions.length; ++i ) {
			qualityOptions[i].addEventListener('click', () => {
				GM.setValue( 'videoQuality', qualityOptions.length - i );
			});
		}
	}


	function detectVideoStart() {

		/* Prevent infinite loop b/w detectVideoStart() & setVideoQuality() in case sth go wrong. */
		if (player) return;

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type != 'attributes') return;
				if (mutation.attributeName != 'class') return;

				/* Detect when a stream starts. */
				if ( player.classList.contains('unstarted-mode') ) return;

				observer.disconnect();
				setVideoQuality();
			});
		});

		player = document.getElementById('movie_player');
		observer.observe(player, { attributes: true });
	}

})();