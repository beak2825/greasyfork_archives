// ==UserScript==
// @name          XNXX player auto-enlarge
// @namespace     http://tampermonkey.net/
// @version       2023.12.28
// @description   Auto-enlarge video window + full browser width
// @author        Morbid Kale
// @match         https://*.xnxx.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=xnxx.com
// @grant         none
// @license       MIT

// @downloadURL https://update.greasyfork.org/scripts/483404/XNXX%20player%20auto-enlarge.user.js
// @updateURL https://update.greasyfork.org/scripts/483404/XNXX%20player%20auto-enlarge.meta.js
// ==/UserScript==

(function() {
    'use strict';

//video size
    document.getElementById("content").classList.add("player-enlarged")

//css
    document.head.insertAdjacentHTML("beforeend",`<style>.video-page .wrapper {max-width: 100% !important;height: 80% !important;}#video-content > div:nth-child(1) {display: none  !important;}</style>`)


})();