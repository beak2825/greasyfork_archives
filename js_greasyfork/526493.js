// ==UserScript==
// @name        Pestpac - Duplicate Ticket Table
// @version     2.0
// @description Duplicates table for the tickets and places it at the top of the page so the information is easier to get to when loading the account
// @match       https://app.pestpac.com/*
// @author      Jamie Cruz
// @grant       none
// @license MIT
// @namespace https://greasyfork.org/users/1433767
// @downloadURL https://update.greasyfork.org/scripts/526493/Pestpac%20-%20Duplicate%20Ticket%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/526493/Pestpac%20-%20Duplicate%20Ticket%20Table.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        initInterfaceTools();
    });

    function initInterfaceTools() {
        // --- SELECTION PHASE ---
        const bottomContainer = document.querySelector('.bottom-buttons');
        const addressContainer = document.querySelector('.belowaddresses-container');
        const originalOrderInfo = document.getElementById("OrderInfo");
        const pageHeader = document.getElementById("page-header");

        if (!bottomContainer || !originalOrderInfo || !pageHeader) {
            return;
        }

        // --- SETUP CONTROL BAR (The remote control at the bottom) ---
        const controlArea = document.createElement('div');
        controlArea.style.padding = '10px 0';
        controlArea.style.marginTop = '10px';
        controlArea.style.clear = 'both';
        controlArea.style.display = 'flex';
        controlArea.style.gap = '10px';
        controlArea.style.justifyContent = 'flex-start';

        bottomContainer.parentNode.insertBefore(controlArea, bottomContainer.nextSibling);

        // --- FEATURE 1: BUTTON MOVER ---
        const btnMoveToggle = createButton('Loading...');
        controlArea.appendChild(btnMoveToggle);

        let isButtonsUp = localStorage.getItem('pp_buttons_pos') === 'up';

        function applyButtonPosition() {
            if (isButtonsUp && addressContainer) {
                // MOVE UP (Under Address Links)

                // --- STYLING ADJUSTMENTS (Per your request) ---
                bottomContainer.style.marginTop = '5px'; // Tiny bit of space from the element above
                bottomContainer.style.marginBottom = '0px'; // No bottom margin
                bottomContainer.style.paddingTop = '0px';   // No top padding
                bottomContainer.style.paddingBottom = '0px';// No bottom padding
                bottomContainer.style.borderTop = '1px solid #eee'; // Keep the thin line separator?

                // Insert after address container
                addressContainer.parentNode.insertBefore(bottomContainer, addressContainer.nextSibling);

                btnMoveToggle.innerText = '⬇ Bring Action Buttons Down';
                btnMoveToggle.style.backgroundColor = '#e2e6ea';
            } else {
                // MOVE DOWN (Restore Original)
                bottomContainer.style.marginTop = '';
                bottomContainer.style.marginBottom = '';
                bottomContainer.style.paddingTop = '';
                bottomContainer.style.paddingBottom = '';
                bottomContainer.style.borderTop = '';

                // Insert before our control area
                controlArea.parentNode.insertBefore(bottomContainer, controlArea);

                btnMoveToggle.innerText = '⬆ Move Action Buttons Up';
                btnMoveToggle.style.backgroundColor = '#d4edda';
            }
        }

        btnMoveToggle.addEventListener('click', (e) => {
            e.preventDefault();
            isButtonsUp = !isButtonsUp;
            localStorage.setItem('pp_buttons_pos', isButtonsUp ? 'up' : 'down');
            applyButtonPosition();
        });

        // --- FEATURE 2: DUPLICATE TICKET TABLE ---
        const btnTicketToggle = createButton('Loading...');
        controlArea.appendChild(btnTicketToggle);

        // Create the clone ONCE
        const clonedTable = originalOrderInfo.cloneNode(true);
        clonedTable.id = "OrderInfo_TopClone";

        // --- STYLING ADJUSTMENTS (Per your request) ---
        // "0 20px" means: 0px Top/Bottom, 20px Left/Right
        clonedTable.style.padding = "0 20px";

        clonedTable.style.marginBottom = "10px";
        clonedTable.style.backgroundColor = "#fff";
        clonedTable.style.display = 'none';

        // Insert the clone above the page header
        pageHeader.parentNode.insertBefore(clonedTable, pageHeader);

        let isTableVisible = localStorage.getItem('pp_table_vis') === 'show';

        function applyTableVisibility() {
            if (isTableVisible) {
                clonedTable.style.display = 'block';
                btnTicketToggle.innerText = '✖ Hide Top Ticket Table';
                btnTicketToggle.style.backgroundColor = '#f8d7da';
            } else {
                clonedTable.style.display = 'none';
                btnTicketToggle.innerText = '✚ Show Ticket Table at Top';
                btnTicketToggle.style.backgroundColor = '#fff3cd';
            }
        }

        btnTicketToggle.addEventListener('click', (e) => {
            e.preventDefault();
            isTableVisible = !isTableVisible;
            localStorage.setItem('pp_table_vis', isTableVisible ? 'show' : 'hide');
            applyTableVisibility();
        });

        // --- INITIALIZE ---
        applyButtonPosition();
        applyTableVisibility();
    }

    function createButton(text) {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.innerText = text;
        btn.style.padding = '6px 12px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '4px';
        btn.style.color = '#333';
        btn.style.fontWeight = 'bold';
        return btn;
    }

})();