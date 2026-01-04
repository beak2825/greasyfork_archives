// ==UserScript==
// @name     Temu un-hide long product names
// @description Fixes Temu CSS to show full product names
// @version  1.2
// @author   Rennex
// @namespace https://greasyfork.org/en/users/302764-rennex
// @license  GPLv3
// @include  https://www.temu.com/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/478347/Temu%20un-hide%20long%20product%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/478347/Temu%20un-hide%20long%20product%20names.meta.js
// ==/UserScript==

// from https://stackoverflow.com/questions/23683439/gm-addstyle-equivalent-in-tampermonkey
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// target all h2's and h3's that have tabindex=0
addGlobalStyle("h2[tabindex='0'], h3[tabindex='0'] { white-space: normal; }")

console.log("Long product names un-hidden!")
