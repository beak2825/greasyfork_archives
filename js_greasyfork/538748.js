// ==UserScript==
// @name         Neopets Lottery Generator
// @namespace    neopets
// @version      2025.06.07.1
// @description  Auto-generate 6 random lottery numbers on neopets.com
// @match        *://www.neopets.com/games/lottery.phtml
// @grant        none
// @run-at       document-idle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/538748/Neopets%20Lottery%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/538748/Neopets%20Lottery%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const $ = window.jQuery;
    if (!$) return console.error("jQuery not found");

    const form = $("form[action*='lottery']");
    const inputs = form.find("input[type='text']");

    if (form.length === 0 || inputs.length < 6) return;

    const row = inputs.first().closest("tr");
    const buttonCell = $('<td style="padding-left: 10px;"><button type="button" id="randomTicket">Random</button></td>');
    row.append(buttonCell);

    const generateTicket = () => {
        const nums = new Set();
        while (nums.size < 6) nums.add(Math.floor(Math.random() * 30) + 1);
        return [...nums].sort((a, b) => a - b);
    };

    $('#randomTicket').on('click', () => {
        const ticket = generateTicket();
        inputs.each((i, el) => $(el).val(ticket[i]));
    });

    $('#randomTicket').click();
})();
