// ==UserScript==
// @name         Disable Scroll Switch Bing
// @namespace    https://www.bing.com/
// @version      0.1
// @description  Prevent Bing from switching to search/chat panel while scrolling
// @author       Nischal Tonthanahal
// @match        https://www.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/471452/Disable%20Scroll%20Switch%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/471452/Disable%20Scroll%20Switch%20Bing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("wheel", e => {
        if (e.target.className.includes("cib-serp-main")){
            e.stopPropagation();
        }
    });
})();