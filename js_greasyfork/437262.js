// ==UserScript==
// @name         Remove Try-Beta Pop-Up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes annoying Try-Beta Message by deleting the div and its content
// @author       vincely
// @match        https://www.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?domain=crunchyroll.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437262/Remove%20Try-Beta%20Pop-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/437262/Remove%20Try-Beta%20Pop-Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var elements = document.getElementsByClassName("opt-in");

   while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

})();