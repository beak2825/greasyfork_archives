// ==UserScript==
// @name         remove images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       abbelot
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      KIO 
// @downloadURL https://update.greasyfork.org/scripts/473739/remove%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/473739/remove%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("run")
    const observer = new MutationObserver(function () {
        if (document.querySelector("img")) {
            document.querySelectorAll("img").forEach(el => el.remove())
        }
if (document.querySelector("video")) {
            document.querySelectorAll("video").forEach(el => el.remove())
        }


    })
    const target = document.querySelector("body")
    const config = { childList: true, subtree: true }
    observer.observe(target, config)
})();