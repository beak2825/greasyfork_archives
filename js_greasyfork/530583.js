// ==UserScript==
// @name        GMGN Pro
// @namespace   Violentmonkey Scripts
// @match       https://gmgn.ai/bsc/token/*
// @grant       none
// @version     1.1
// @author      nocommas
// @description Adds color indicators to wallet tracker for gmgn and highlights rows with >5% ownership, except for Four.Meme LP
// @downloadURL https://update.greasyfork.org/scripts/530583/GMGN%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/530583/GMGN%20Pro.meta.js
// ==/UserScript==

/*
//////////////////////////////////////////////////
//                                              //
// GMGN Pro by nocommas                         //
// Twitter: twitter.com/n0commas                //
//                                              //
// Use the link below for FULL FEATURE          //
// Access and LOWER FEES:                       //
// https://gmgn.ai/?ref=9MCudyDH&chain=bsc      //
//                                              //
//////////////////////////////////////////////////
*/

(function() {
    'use strict';

    function processWalletTrackerCard(card) {
        card.style.backgroundColor = '';
        card.style.color = '';

        const priceElements = card.querySelectorAll('.css-k008qs');
        priceElements.forEach(element => {
            element.style.color = '#a5f3fc';
            element.style.fontWeight = '600';
        });

        if (card.querySelector('.css-1xsdv5e')) {
            card.style.backgroundColor = '#2a4d2e';
            card.style.color = '#e0e0e0';
            card.style.transition = 'background-color 0.3s, color 0.3s';

            const buyButton = card.querySelector('.css-g1urrz');
            if (buyButton) {
                buyButton.style.backgroundColor = '#1e3a8a';
                buyButton.style.color = '#ffffff';
            }
        }

        if (card.querySelector('.css-kjpscj')) {
            card.style.backgroundColor = '#4d2a2a';
            card.style.color = '#e0e0e0';
            card.style.transition = 'background-color 0.3s, color 0.3s';

            const buyButton = card.querySelector('.css-g1urrz');
            if (buyButton) {
                buyButton.style.backgroundColor = '#1e3a8a';
                buyButton.style.color = '#ffffff';
            }
        }
    }

    function processHolderRow(row, rowIndex) {
        if (rowIndex >= 7) return;

        const ownedCell = row.querySelector('div[col-id="owned"] .css-cgj7r1');
        if (ownedCell) {
            const percentageText = ownedCell.textContent.trim();
            const percentage = parseFloat(percentageText.replace('%', ''));

            if (percentage > 5) {
                const addressCell = row.querySelector('div[col-id="address"] .css-1h8ua02');
                if (addressCell && addressCell.textContent.trim() === 'Four.Meme LP') {
                    return;
                }

                row.style.backgroundColor = '#610000';
                row.style.color = '#ffffff';
                row.style.transition = 'background-color 0.3s, color 0.3s';

                const allTextElements = row.querySelectorAll('*');
                allTextElements.forEach(element => {
                    element.style.color = '#ffffff';
                });
            }
        }
    }

    const cardObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const cards = document.querySelectorAll('.css-13v3rg8 > a.css-1w6kusr');
            cards.forEach(card => processWalletTrackerCard(card));

            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('a.css-1w6kusr')) {
                            processWalletTrackerCard(node);
                        }
                        const childCards = node.querySelectorAll('a.css-1w6kusr');
                        childCards.forEach(card => processWalletTrackerCard(card));
                    }
                });
            }
        });
    });

    const rowObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const viewport = document.querySelector('.ag-center-cols-viewport');
            if (viewport) {
                const rows = viewport.querySelectorAll('div[role="row"]');
                rows.forEach((row, index) => {
                    const rowIndex = parseInt(row.getAttribute('row-index'), 10);
                    processHolderRow(row, rowIndex);
                });

                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('div[role="row"]')) {
                                const rowIndex = parseInt(node.getAttribute('row-index'), 10);
                                processHolderRow(node, rowIndex);
                            }
                            const childRows = node.querySelectorAll('div[role="row"]');
                            childRows.forEach((row, index) => {
                                const rowIndex = parseInt(row.getAttribute('row-index'), 10);
                                processHolderRow(row, rowIndex);
                            });
                        }
                    });
                }
            }
        });
    });

    const targetNode = document.body;
    cardObserver.observe(targetNode, {
        childList: true,
        subtree: true
    });

    const rowTargetNode = document.body;
    rowObserver.observe(rowTargetNode, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        const initialCards = document.querySelectorAll('.css-13v3rg8 > a.css-1w6kusr');
        initialCards.forEach(card => processWalletTrackerCard(card));

        const viewport = document.querySelector('.ag-center-cols-viewport');
        if (viewport) {
            const initialRows = viewport.querySelectorAll('div[role="row"]');
            initialRows.forEach((row, index) => {
                const rowIndex = parseInt(row.getAttribute('row-index'), 10);
                processHolderRow(row, rowIndex);
            });
        }
    });
})();