// ==UserScript==
// @name     AliExpress un-hide long product names
// @description Fixes AliExpress CSS to show full product names
// @version  1.4
// @author   Rennex
// @namespace https://greasyfork.org/en/users/302764-rennex
// @license  GPLv3
// @include  https://www.aliexpress.com/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/468392/AliExpress%20un-hide%20long%20product%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/468392/AliExpress%20un-hide%20long%20product%20names.meta.js
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

// if the class names change in the future,
// inspect a product name (h3) and look at its parent div's class
addGlobalStyle("div.G7dOC { display: block !important; }")
addGlobalStyle("h3.nXeOv { word-break: normal !important; }")

console.log("Long product names un-hidden!")
