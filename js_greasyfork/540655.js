// ==UserScript==
// @name         SpaceApp Deals
// @namespace    http://tampermonkey.net/
// @author       You
// @description  123
// @match        https://spaceapp.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spaceapp.ru
// @grant        none
// @version 0.0.1.20250625062137
// @downloadURL https://update.greasyfork.org/scripts/540655/SpaceApp%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/540655/SpaceApp%20Deals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function countDeals(selector) {
        const links = document.querySelectorAll(`${selector} a`);
        let title = document.querySelector(`${selector} strong`);
        if (title && links.length) {
            title.innerText = `${title.innerText} ${links.length}`;
        }
    }

    countDeals('#priorityDeals');
    countDeals('#newDeals');
    countDeals('#failedDeals');

})();