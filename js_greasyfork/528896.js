// ==UserScript==
// @name         Startpage Promo Remover
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  Removes the annoying promotion links from Startpage.
// @author       solarunes
// @license      MIT
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528896/Startpage%20Promo%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/528896/Startpage%20Promo%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", () => {

        const el = document.getElementById("gcsa-top");

        el.parentNode.remove();
    });
})();