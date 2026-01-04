// ==UserScript==
// @name         Neopets Food Club - History Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Adds a win/bet ratio column and number formatting for easier reading
// @author       Morde
// @match        https://www.neopets.com/pirates/foodclub.phtml?type=history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464034/Neopets%20Food%20Club%20-%20History%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/464034/Neopets%20Food%20Club%20-%20History%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rows = $('table:has(> tbody > tr[bgcolor="darkred"]) tr');

    const [_, bet, win] = /(?:\d+)\t(\d+) NP\t(\d+) NP/.exec(document.body.innerText).map(Number);
    const ratio = win / bet;

    // Format numbers
    $(rows[2]).find('td').each((i, ele) => {
        const font = $(ele).find('font');

        if (font.length) ele = font[0];

        ele.innerText = ele.innerText.split(' ').map(x => {
            const num = Number(x);
            return Number.isFinite(num) ? num.toLocaleString() : x;
        }).join(' ');
    });

    // Add ratio column
    $(rows[1]).append(`<td align=center><b>Ratio</b></td>`);
    $(rows[2]).append(`<td align=center><font color=${ratio > 1 ? 'green' : ratio < 1 ? 'red' : 'black'}>${ratio.toFixed(2)}</font></td>`);
})();