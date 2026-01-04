// ==UserScript==
// @name         Cartel Empire - Items For Sale Filter
// @namespace    baccy.ce
// @version      0.1
// @description  Allows you to select which items you want to sell, including armour and weapons, and filter out the rest on the inventory page for easier screenshots
// @author       Baccy
// @match        https://*.cartelempire.online/Inventory
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534664/Cartel%20Empire%20-%20Items%20For%20Sale%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/534664/Cartel%20Empire%20-%20Items%20For%20Sale%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const header = [...document.querySelectorAll('.header-section h2')].find(h2 => h2.textContent.trim() === 'Inventory').parentElement;
    header.style.cssText = 'display: flex; align-items: center; gap: 10px;';

    const selectedItems = {};

    const inventoryItems = document.querySelectorAll('.align-items-center.inventoryItemWrapper');
    inventoryItems.forEach(item => {
        const buttonSection = item.querySelector('.col.col-12.col-sm-3.col-xl-2.pe-xl-2.d-none.d-sm-inline');
        const id = item.id;

        let isChecked = false;

        // BUTTON FOR MOBILE VIEW
        const collapsedButton = document.createElement('button');

        // BUTTON FOR PC VIEW
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-sm btn-outline-dark action-btn ms-1 float-end';
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            isChecked = !isChecked;
            path.setAttribute('stroke', isChecked ? 'lightgreen' : 'white');
            collapsedButton.style.color = isChecked ? 'lightgreen' : 'white';

            if (isChecked) selectedItems[id] = item;
            else delete selectedItems[id];
        });

        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('width', '22');
        icon.setAttribute('height', '22');
        icon.setAttribute('viewBox', '0 0 24 24');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M7 13l3 3 7-7');
        path.setAttribute('stroke', 'white');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');

        icon.appendChild(path);
        btn.appendChild(icon);

        buttonSection.prepend(btn);


        // REST OF MOBILE VIEW LOGIC
        const collapsedSection = item.querySelector('.col.col-12.collapse .row.row-cols-2.d-md-none.mt-3.mb-2');

        const collapsedHeader = document.createElement('div');
        collapsedHeader.className = 'col col-6 mb-2';

        collapsedButton.className = 'btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100';
        collapsedButton.textContent = 'Select for Filter';
        collapsedButton.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();

            isChecked = !isChecked;
            collapsedButton.style.color = isChecked ? 'lightgreen' : 'white';
            path.setAttribute('stroke', isChecked ? 'lightgreen' : 'white');

            if (isChecked) selectedItems[id] = item;
            else delete selectedItems[id];
        });

        collapsedHeader.appendChild(collapsedButton);
        collapsedSection.appendChild(collapsedHeader);
    });

    let isFiltered = false;

    const filterBtn = document.createElement('button');
    filterBtn.textContent = 'Filter Items';
    filterBtn.style.cssText = 'background-color: #333; color: #fff; border: none; border-radius: 6px; padding: 6px 12px; cursor: pointer;';
    filterBtn.addEventListener('click', () => {
        isFiltered = !isFiltered;

        inventoryItems.forEach(item => {
            const id = item.id;
            const isSelected = selectedItems.hasOwnProperty(id);
            item.style.setProperty('display', isFiltered && !isSelected ? 'none' : '', 'important');
        });
        filterBtn.textContent = isFiltered ? 'Remove Filter' : 'Filter Items';
    });

    header.appendChild(filterBtn);
})();