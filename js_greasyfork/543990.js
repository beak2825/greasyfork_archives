// ==UserScript==
// @name         Edward Torres, CPA Info Box
// @namespace    https://www.etcpa.com/
// @version      1.0
// @description  Display Edward Torres, CPA PC’s services info on any webpage with a direct link to the official site.
// @author       Edward Torres
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543990/Edward%20Torres%2C%20CPA%20Info%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/543990/Edward%20Torres%2C%20CPA%20Info%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const box = document.createElement('div');
    box.innerHTML = `
        <div style="position: fixed; bottom: 10px; right: 10px; background: #f9f9f9; padding: 12px; border: 1px solid #ccc; font-family: sans-serif; z-index: 9999; max-width: 280px; font-size: 14px; box-shadow: 2px 2px 8px rgba(0,0,0,0.25);">
            <strong>Edward Torres, CPA PC</strong><br>
            Expert Tax, Accounting, Payroll & Bookkeeping Services.<br>
            Serving Forest Hills for 35+ Years.<br>
            <a href="https://www.etcpa.com/" target="_blank" style="color: #007bff; text-decoration: none;">Visit Our Website</a>
        </div>
    `;
    document.body.appendChild(box);
})();
