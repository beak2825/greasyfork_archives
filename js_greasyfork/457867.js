// ==UserScript==
// @name         Vinland Saga Remove Advertisements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the Advertisements at the top of the screen when reading Vinland Saga Manga.
// @author       You
// @match        https://read-vinlandsaga.com/manga/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=read-vinlandsaga.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457867/Vinland%20Saga%20Remove%20Advertisements.user.js
// @updateURL https://update.greasyfork.org/scripts/457867/Vinland%20Saga%20Remove%20Advertisements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deleteElement() {
        const element = document.querySelector("#aswift_5_host");
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    setInterval(deleteElement, 1000);

})();