// ==UserScript==
// @name         Remove the end card
// @namespace    http://tampermonkey.net/
// @version      2025-07-28
// @description  Get rid of the annoying end card hovering over the whole page!
// @author       Loeschli
// @match        https://www.crunchyroll.com/*/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543842/Remove%20the%20end%20card.user.js
// @updateURL https://update.greasyfork.org/scripts/543842/Remove%20the%20end%20card.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let endCards = document.querySelectorAll('.erc-end-slate-recommendations-carousel');
    endCards.forEach((card) => {
        card.remove();
    });
})();