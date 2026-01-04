// ==UserScript==
// @name         Inverted Webpage
// @namespace    http://lolno.com/
// @version      0.22
// @description  Invert pages
// @author       Dobby233Liu
// @match        *://*/*
// @match        chrome-extension://*/*
// @match        moz-extension://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/384847/Inverted%20Webpage.user.js
// @updateURL https://update.greasyfork.org/scripts/384847/Inverted%20Webpage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        document.body.style.filter="invert(100%)";
        document.body.style.webkitFilter="invert(100%)"; // for images
    }, 0);
})();