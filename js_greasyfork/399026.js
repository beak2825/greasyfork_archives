// ==UserScript==
// @name          The Weather Network/MeteoMedia Scrollbar Fix
// @namespace     http://tampermonkey.net/
// @description   Forces the vertical scrollbar to always show.
// @include       https://*.meteomedia.com/*
// @include       https://*.theweathernetwork.com/*
// @version       1
// @downloadURL https://update.greasyfork.org/scripts/399026/The%20Weather%20NetworkMeteoMedia%20Scrollbar%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/399026/The%20Weather%20NetworkMeteoMedia%20Scrollbar%20Fix.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body { overflow-y:scroll !important; }');