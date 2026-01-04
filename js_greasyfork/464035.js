// ==UserScript==
// @name         Neopets Trading Post - Lab Map Duplicate Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Looks at trading post entries with secret laboratory map pieces and tells you how many total pieces there are and how many are distinct/unique (so you can buy a full set and avoid being scammed)
// @author       Morde
// @match        https://www.neopets.com/island/tradingpost.phtml?type=browse*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464035/Neopets%20Trading%20Post%20-%20Lab%20Map%20Duplicate%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/464035/Neopets%20Trading%20Post%20-%20Lab%20Map%20Duplicate%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('td:not([bgcolor]) > table[width="100%"][cellpadding="2"][cellspacing="0"][border="0"]').each((i, table) => {
        const imgs = $(table).find('img');
        const imgSrcs = imgs.toArray().map(x => x.src).filter(x => x.includes('/labmap_'));
        const distinctImgSrcs = new Set(imgSrcs);

        if (imgSrcs.length) {
            table.append(`${imgSrcs.length} piece${imgSrcs.length === 1 ? '' : 's'}, ${distinctImgSrcs.size} distinct`);
        }
    })
})();