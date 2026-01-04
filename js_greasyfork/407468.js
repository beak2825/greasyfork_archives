// ==UserScript==
// @name         Land Registry Price Change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://landregistry.data.gov.uk/app/ppd/search
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407468/Land%20Registry%20Price%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/407468/Land%20Registry%20Price%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var offset = window.scrollY;
    document.querySelectorAll("li .row div:nth-child(1) > table").forEach(function (table) {
        var dates = [];
        var prices = [];
        table.querySelectorAll("tbody tr").forEach(function (row) {
            dates.push(new Date(row.querySelector("td:nth-child(2)").innerText));
            prices.push(parseInt(row.querySelector("td:nth-child(3)").innerText.replace(/[^0-9]/g, ''), 0))
        });
        table.querySelectorAll("tbody tr").forEach(function (row, idx, arr) {
            var pct = 1;
            var annual = 1;
            if (idx != arr.length - 1) {
                pct = prices[idx] / prices[idx + 1];
                var y = (dates[idx] - dates[idx + 1]) / 365 / 24 / 3600 / 1000;
                annual = Math.exp(Math.log(pct) / y);
            }
            var rect = row.getBoundingClientRect();
            var d = document.createElement('div');
            d.textContent = `${pct.toFixed(2)} / ${annual.toFixed(2)}`;
            d.style.position = 'absolute'
            d.style.top = `${rect.y + offset + 10}px`;
            d.style.left = `${rect.x - 80}px`;
            document.body.append(d);
        });
    });
})();