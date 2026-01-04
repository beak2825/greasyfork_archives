// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       https://www.imdb.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/18/2023, 12:42:57 AM
// @downloadURL https://update.greasyfork.org/scripts/492531/New%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/492531/New%20script.meta.js
// ==/UserScript==


(function() {
injectCSS('[class*="rating"] { display: none !important;}');

function injectCSS(cssContent) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(cssContent));
    document.head.appendChild(style);
}
})()
