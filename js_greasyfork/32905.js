//
// Written by Glenn Wiking
// Script Version: 0.0.1a
// Date of issue: 24/05/16
// Date of resolution: 24/05/16
//
// ==UserScript==
// @name        ShadeFix Motherless
// @namespace   SFML
// @include     *motherless.*
// @include     https://*motherless.*
// @description Shadefix for Motherless, maximizes player size and blocks ad banners

// @version     0.0.1a
// @icon        https://i.imgur.com/n0JID9l.png
// @downloadURL https://update.greasyfork.org/scripts/32905/ShadeFix%20Motherless.user.js
// @updateURL https://update.greasyfork.org/scripts/32905/ShadeFix%20Motherless.meta.js
// ==/UserScript==

function ShadeFixML(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeFixML (
	'.vjs-progress-holder, .video-js .vjs-progress-holder .vjs-play-progress, .video-js .vjs-progress-holder .vjs-load-progress, .video-js .vjs-progress-holder .vjs-tooltip-progress-bar, .video-js .vjs-progress-holder .vjs-load-progress div {height: 1em !important;}'
	+
	'.ad-on-video, #topbar {display: none !important; visibility: hidden !important;}'
	+
	'.player-container .ima-ad-container, .player-container .ima-ad-container > div:first-child, .player-container .ima-ad-container iframe, #content-video_html5_api, .video-js {height: 95% !important;}'
	+
	'.vjs-menu-button-inline {transition: all .1s !important;}'
	+
	'.vjs-play-progress::before {top: -.2em !important; right: -.5em !important; font-size: 1.5em !important;}'
	+
	'.vjs-control-bar, .vjs-big-play-button, .vjs-big-play-button:focus {opacity: .75 !important;}'
	+
	'.vjs-play-progress {background-color: #0a0e15 !important;}'
	+
	'object.jwswf {height: 136% !important;}'
	+
	'#media-media, #media-info {padding-bottom: 11.2em !important; width: 148% !important;}'
	+
	'.sub_menu {width: 148% !important; padding: 4px !important; margin-bottom: 2px !important; max-width: 64.2vw !important; opacity: .85 !important;}'
	+
	'#media-info {padding: 8px 1.2em !important;}'
	+
	'#media-control-buttons li {padding: 9px 9px 9px 0 !important;}'
	+
	'.container .row .col-md-12 #main #header a#logo {height: 72px !important;}'
	+
	'#header2 img[alt="motherless is the shit"] {visibility: hidden !important;}'
	+
	'#header #menu-bar-links div#menu {height: 37px !important;}'
	+
	'div[data-cbh="consent.google.com"] {display: none !important;}'
	+
	'.col-lg-4 {pointer-events: none;}'
	+
	'.col-lg-4 .comments.noSwipe {width: 76%; top: -7.4em !important; left: 26em !important; position: relative !important; pointer-events: all !important;}'
	+
	'.comments #media-comments-form textarea {height: 60px !important; background: #060505 !important; color: #c3c1c1 !important; overflow-y: hidden !important;}'
	+
	'.col-md-6 {opacity: .85 !important;}'
	+
	'.player .advert {display: none !important;}'
);