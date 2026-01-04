// ==UserScript==
// @name         Remove Watched
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes all watched entries
// @author       ModProg
// @match        https://*.nebula.tv/myshows
// @match        https://nebula.tv/myshows
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nebula.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453492/Remove%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/453492/Remove%20Watched.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function () {document.querySelectorAll(".css-17ebdnl > *").forEach(child => {
        if(child.querySelector(".css-3mlnbm")) {
            child.remove()
        }
    })}, 1000);
})();