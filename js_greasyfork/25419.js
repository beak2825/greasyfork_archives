//
// Written by Glenn Wiking
// Script Version: 1.0.2a
// Date of issue: 26/09/16
// Date of resolution: 27/09/16
//
// ==UserScript==
// @name        ShadeFix Minds
// @namespace   SFMI
// @version     0.1.0a
// @grant       none
// @icon        http://i.imgur.com/lvuAvcb.png
// @description ShadeFix for Minds, broadening the central content on any page

// @include     http://*.minds.com/*
// @include     https://*.minds.com/*

// @downloadURL https://update.greasyfork.org/scripts/25419/ShadeFix%20Minds.user.js
// @updateURL https://update.greasyfork.org/scripts/25419/ShadeFix%20Minds.meta.js
// ==/UserScript==

function ShadeFixMinds(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeFixMinds(
	'minds-body minds-newsfeed .newsfeed-grid, minds-channel .channel-grid {max-width: 70vw !important;}'
	+
	'minds-body minds-newsfeed .newsfeed-grid .mdl-cell--4-col, minds-body minds-newsfeed .newsfeed-grid .mdl-cell--4-col-desktop.mdl-cell--4-col-desktop {width: calc(30.333% - 16px) !important;}'
);