// ==UserScript==
// @name         Canvas Confetti
// @namespace    http://github.com/Pixeled99/CanvasConfetti
// @version      2024-08-28
// @description  Brighten up your canvas experience with more confetti on your assignments!
// @author       Pixeled99
// @match        https://*.instructure.com/courses/*/assignments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505466/Canvas%20Confetti.user.js
// @updateURL https://update.greasyfork.org/scripts/505466/Canvas%20Confetti.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    if (!url.includes("confetti=true")) {
        if (url.includes("?")){
            location.replace(url + "&confetti=true")
        }
        else {
            location.replace(url + "?confetti=true")
        }
    }
})();