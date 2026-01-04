// ==UserScript==
// @name AutoClickLink
// @namespace Violentmonkey Scripts
// @match https://imgdrive.net/*
// @description Bypass the ads and open directly to the real link
// @version 0.1.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/380692/AutoClickLink.user.js
// @updateURL https://update.greasyfork.org/scripts/380692/AutoClickLink.meta.js
// ==/UserScript==

function addCss(cssString) {
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = 'text/css';
    newCss.innerHTML = cssString;
    head.appendChild(newCss);
}

addCss(`
.if,
body > div:last-child,
body > div:first-child{
    display: none !important;
}
`)

setTimeout(function () {
  document.querySelector('.overlay_ad_link').click()
}, 1000)
