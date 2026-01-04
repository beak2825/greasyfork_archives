// ==UserScript==
// @name		   YouTube Black Background
// @namespace	  https://github.com/AbdurazaaqMohammed
// @version		1.7.2.4
// @author		 Abdurazaaq Mohammed
// @description	Change background color to AMOLED black on YouTube
// @match		  https://www.youtube.com/*
// @homepage	   https://github.com/AbdurazaaqMohammed/userscripts
// @license		The Unlicense
// @supportURL	 https://github.com/AbdurazaaqMohammed/userscripts/issues
// @run-at		 document-start
// @grant		  none
// @downloadURL https://update.greasyfork.org/scripts/499512/YouTube%20Black%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/499512/YouTube%20Black%20Background.meta.js
// ==/UserScript==
(function() {
	'use strict';
	(document.head || document.documentElement).appendChild(document.createElement('style')).textContent = '* { color: white !important; } yt-searchbox *, #masthead > div:nth-child(5), ytd-app, div:not(.lock-scrollbar div):not(yt-lockup-view-model div):not(button div):not(#page-header > yt-page-header-renderer > yt-page-header-view-model > div > div.page-header-view-model-wiz__page-header-headline > yt-decorated-avatar-view-model > yt-avatar-shape div):not(ytd-shorts div):not(#container div):not(#dismissible div):not(.ytd-backstage-items.style-scope div):not(#contentWrapper div):not(#owner div):not(#video-preview div):not(li div):not(#items *):not(#page-manager > ytd-browse > ytd-playlist-header-renderer div), ytd-playlist-panel-renderer div:not(ytd-playlist-panel-video-renderer div), yt-spec-touch-feedback-shape__fill div, #contentWrapper *:not(tp-yt-paper-item):not(tp-yt-paper-item *), #sections, #ytp-id-18, .ytd-rich-metadata-row-renderer *, body > ytd-app > ytd-popup-container > tp-yt-paper-dialog > ytd-voice-search-dialog-renderer, #backstage-post-dialog > ytd-backstage-post-dialog-renderer > div, body > ytd-app > ytd-popup-container > tp-yt-paper-dialog, #header-author *, #content > ytd-mini-guide-renderer, #endpoint, #dismissible div:not(yt-horizontal-list-renderer div):not(button div):not(#thumbnail div):not(.yt-spec-avatar-shape__image-overlays):not(.yt-spec-avatar-shape__image), #header, #page-manager > ytd-shorts > div.navigation-container.style-scope.ytd-shorts, #teaser-carousel > yt-video-metadata-carousel-view-model, yt-chip-cloud-chip-renderer, #footer { background-color: black !important; } #right-arrow::before, #left-arrow::after { content: none !important; }';
})();