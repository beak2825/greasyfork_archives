// ==UserScript==
// @name         Adbar-less
// @namespace    http://tampermonkey.net/
// @version      2024-03-29
// @description  Get out of the fucking Photopea adbar
// @author       Otonieruuu
// @match        https://www.photopea.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photopea.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491151/Adbar-less.user.js
// @updateURL https://update.greasyfork.org/scripts/491151/Adbar-less.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This script is taken from https://www.reddit.com/r/photopea/comments/plkr5l/comment/k9hfd7k/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    
    var offSet = 180;

    Object.defineProperty(window, 'innerWidth', {
        get() { return document.documentElement.offsetWidth + offSet },
    })

})();