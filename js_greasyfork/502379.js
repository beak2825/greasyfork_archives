// ==UserScript==
// @name         Better PCPartPicker
// @namespace    https://github.com/victornpb
// @version      0.6
// @description  Toggle between table and grid view on PCPartPicker
// @author       Victor
// @contributionURL https://www.buymeacoffee.com/vitim
// @match        https://pcpartpicker.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/502379/Better%20PCPartPicker.user.js
// @updateURL https://update.greasyfork.org/scripts/502379/Better%20PCPartPicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the toggle button to .productList__actions
    function addToggleButton() {
        const actionsContainer = document.querySelector('.nav__bottom .nav__categories');
        if (actionsContainer && !document.querySelector('#toggleGridButton')) { // Check if the button is already added
            const toggleButton = document.createElement('button');
            toggleButton.id = 'toggleGridButton';
            toggleButton.title = 'Toggle Grid View (Better PCPartPicker)';
            toggleButton.style.cssText = `
              padding: 5px 5px;
              background-color: #eda920;
              color: #000000;
              --font-size: 22px;
              font-weight: bold;
              border: none;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100px;
              margin: 5px;
            `;
             const svgIcon = `
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="1" y="1" width="6" height="6" fill="white"/>
                      <rect x="9" y="1" width="6" height="6" fill="white"/>
                      <rect x="1" y="9" width="6" height="6" fill="white"/>
                      <rect x="9" y="9" width="6" height="6" fill="white"/>
                  </svg>
              `;
              toggleButton.innerHTML = '᎒᎒᎒ Grid View';

            // Append the button to the actions container
            actionsContainer.appendChild(toggleButton);

            // Add event listener to toggle grid view
            let isGridView = false;
            toggleButton.addEventListener('click', () => {
                isGridView = !isGridView;
                if (isGridView) {
                    document.documentElement.classList.add('grid-view-active');
                } else {
                    document.documentElement.classList.remove('grid-view-active');
                }
            });
        }
    }

    // Initial styles for normal view
    GM_addStyle(`
        :root {
            --size: 128px;
        }

        table.productList--detailed tr td.td__name a .td__image {
            width: var(--size);
            height: var(--size);
        }

        .productList--detailed .tr__product .td__imageWrapper {
            width: var(--size) !important;
            height: var(--size) !important;
        }
    `);

    // Scoped CSS for grid view
    GM_addStyle(`
        .grid-view-active table {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .grid-view-active table thead {
            display: none;
        }

        .grid-view-active table tbody {
            display: contents;
        }

        .grid-view-active table .tr__product {
            position: relative;
            display: flex;
            flex-direction: column;
            border: 1px solid #ddd;
            padding: 5px;
            background-color: #f9f9f9;
            align-items: center;
            text-align: center;
        }

        .grid-view-active table .td__checkbox {
            position: absolute;
            z-index: 99999;
            left: 3px;
            top: 3px;
        }

        .grid-view-active table .td__name {
            padding: 0px;
        }

        .grid-view-active table .td__name a {
            display: flex !important;
            flex-direction: column;
        }

        .grid-view-active table .td__imageWrapper {
            width: 100%;
            margin-bottom: 10px;
        }

        .grid-view-active table .td__image {
            width: 100%;
            display: block;
        }

        .grid-view-active table .td__nameWrapper {
            margin-bottom: 10px;
            font-weight: bold;
        }

        .grid-view-active table .td__nameWrapper p {
            margin: 0;
            font-size: 1.1em;
        }

        .grid-view-active table .td__spec,
        .grid-view-active table .td__rating,
        .grid-view-active table .td__price {
            margin-bottom: 1px;
        }

        .grid-view-active {
            --size: 100%;
        }

        #partlist .partlist table tbody tr td.td__image a, #user-saved-partlists .partlist table tbody tr td.td__image a, #user-completed-builds .partlist table tbody tr td.td__image a, #user-inventory-products .partlist table tbody tr td.td__image a, #user-favorite-products .partlist table tbody tr td.td__image a, #userbuild-pick-partlist .partlist table tbody tr td.td__image a, #buildguide-view .partlist table tbody tr td.td__image a {
            width: var(--size);
            height: var(--size);
        }

        .grid-view-active .productList--detailed .tr__product .td__imageWrapper {
            width: var(--size) !important;
            height: var(--size) !important;
        }

        #partlist .partlist table tbody tr td, #user-saved-partlists .partlist table tbody tr td, #user-completed-builds .partlist table tbody tr td, #user-inventory-products .partlist table tbody tr td, #user-favorite-products .partlist table tbody tr td, #userbuild-pick-partlist .partlist table tbody tr td, #buildguide-view .partlist table tbody tr td {
            height: var(--size) !important;
        }
    `);

    // Observe DOM changes to re-add the button if necessary
    const observer = new MutationObserver(() => {
        addToggleButton();
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call to add the toggle button
    addToggleButton();
})();
