// ==UserScript==
// @name Javlibrary helper
// @version 1.0.1
// @namespace http://tampermonkey.net/
// @description Javlibrary link to javmost
// @author none
// @license https://opensource.org/licenses/MIT
// @match https://www.javlibrary.com/*
// @downloadURL https://update.greasyfork.org/scripts/484916/Javlibrary%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/484916/Javlibrary%20helper.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

function main() {
    const td = document.querySelector('#video_id td:nth-of-type(2)');
    if (!td) {
        return;
    }
    const videoID = td.textContent;
    const link = `https://www5.javmost.com/${videoID}`;
    td.innerHTML = `<a href=${link}>${videoID}</a>`;
}
main();

/******/ })()
;