// ==UserScript==
// @name         Torn Sort Inventory
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Sort inventory by quantity (toggle asc/desc), integrated into Torn inventory header UI bar cleanly.
// @author       ChuckFlorist
// @match        https://www.torn.com/item.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542280/Torn%20Sort%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/542280/Torn%20Sort%20Inventory.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let ascending = true;

    function createButtonInHeader() {
        if (document.querySelector('#sortBtn')) return;

        // Find the Torn header container
        const header = document.querySelector('.title-black.hospital-dark.top-round.scroll-dark');
        if (!header) return console.warn('Inventory header not found.');

        // Create button
        const btn = document.createElement('button');
        btn.id = 'sortBtn';
        btn.textContent = '📦 ↑';
        Object.assign(btn.style, {
            marginLeft: '10px',
            padding: '2px 6px',
            fontSize: '12px',
            cursor: 'pointer',
            borderRadius: '4px',
            border: '1px solid rgb(196, 196, 196)',
            background: 'rgb(64, 64, 64)',
            color: '#fff',
            verticalAlign: 'middle',
        });

        // Sorting logic
        btn.onclick = () => {
            const cat_wrap = document.getElementById('category-wrap');
            if (!cat_wrap) return console.warn('Category wrap not found.');

            const ul = Array.from(cat_wrap.querySelectorAll('ul.items-cont')).find(ul =>
                window.getComputedStyle(ul).display !== 'none'
            );

            if (!ul) return console.warn('No visible inventory list found.');

            const items = Array.from(ul.querySelectorAll(':scope > li')).filter(li =>
                li.hasAttribute('data-qty')
            );

            items.sort((a, b) => {
                const qtyA = parseInt(a.getAttribute('data-qty')) || 0;
                const qtyB = parseInt(b.getAttribute('data-qty')) || 0;
                return ascending ? qtyA - qtyB : qtyB - qtyA;
            });

            items.forEach(item => ul.appendChild(item));

            ascending = !ascending;
            btn.textContent = ascending ? '📦 ↑' : '📦 ↓';
        };

        // Insert button into the header, before the search form
        const searchForm = header.querySelector('form');
        header.insertBefore(btn, searchForm);
    }

    // Try inserting after slight delay to ensure DOM loads
    setTimeout(createButtonInHeader, 200);
})();