// ==UserScript==
// @name        YT - Controls
// @namespace   YTC
// @description Control Youtube controls
// @include     http://*.youtube.*
// @include     https://*.youtube.*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24500/YT%20-%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/24500/YT%20-%20Controls.meta.js
// ==/UserScript==

function YTC(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

YTC(
	'.ytp-next-button, .ytp-prev-button {display: none !important;}'
);
