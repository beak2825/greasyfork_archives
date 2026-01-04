// ==UserScript==
// @name         Custom YouTube Logo Color
// @namespace    https://github.com/charlie-moomoo
// @version      0.1
// @description  Custom the color of the YouTube Logo on the nav bar!
// @author       CharlieMoomoo
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459102/Custom%20YouTube%20Logo%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/459102/Custom%20YouTube%20Logo%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const color = "#ff00a7" //Replace it with anything you want
    const replace = ()=>{
        document.querySelector("#logo-icon").children[0].children[0].children[0].children[0].style.fill = color
    }
    replace()
    window.addEventListener("urlchange",replace);
})();