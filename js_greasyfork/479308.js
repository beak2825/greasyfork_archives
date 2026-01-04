// ==UserScript==
// @name         Popcat Autoclicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sum autoclicker
// @author       actuallyreal
// @match        https://popcat.click/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=popcat.click
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479308/Popcat%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/479308/Popcat%20Autoclicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
alert("press E to enable autoclicker");

      function Autoclicker(e) {
        e.code == 'KeyE' && (setInterval(()=>{document.dispatchEvent(new Event("keydown"))},40))
    };
    addEventListener('keypress', Autoclicker);
    // Your code here...
})();