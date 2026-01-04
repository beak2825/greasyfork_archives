//
// Written by Glenn Wiking
// Script Version: 0.0.1a
// Date of issue: 02/09/17
// Date of resolution: 02/09/17
//
// ==UserScript==
// @name        ShadeFix xHamster
// @namespace   SFXH
// @description ShadeFix for xHamster, centering the player and removing fixed adspace
// @include     *xhamster.*
// @include     https://*xhamster.*

// @version     0.0.1a
// @icon        https://i.imgur.com/btbIBjl.png
// @downloadURL https://update.greasyfork.org/scripts/32907/ShadeFix%20xHamster.user.js
// @updateURL https://update.greasyfork.org/scripts/32907/ShadeFix%20xHamster.meta.js
// ==/UserScript==

function ShadeFixXH(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeFixXH (
	'#supportAds, .gListing tbody tr td[colspan="2"], #newPlayerFeedback, .cams-widget, .player-ad-overlay, .videoList div[style="float: right;"], .bottom_message, .avdo {display: none !important;}'
	+
	'#playerBox, #commentBox {width: 100%;}'
	+
	'.main tbody tr td:last-child .boxTL {display: block !important;}'
	+
	'#player, #playerSwf, #player .noFlash, #playerSwf video, #playerSwf .mp4Thumb {width: 98% !important; height: 600px !important;}'
	+
	'#playerSwf video, #playerSwf .mp4Thumb {width: 98% !important; margin: 0 auto !important;}'
	+
	'.xplayer video {left: 2% !important;}'
	+
	'#playerSwf #player {left: 1% !important;}'
	+
	'.xplayer .progress-bar {opacity: .85 !important;}'
);