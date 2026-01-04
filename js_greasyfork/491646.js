// ==UserScript==
// @name         Bazaar Easy Buy
// @namespace    heartflower.torn.com
// @version      2.0
// @description  Moves Bazaar Buttons
// @author       Heartflower [2626587]
// @match        https://www.torn.com/bazaar.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491646/Bazaar%20Easy%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/491646/Bazaar%20Easy%20Buy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set to false if you don't want it
    let noConfirm = true;
    let autoFillMax = true;

    // Observe page upon load
    function observePageLoad() {
        let bazaarGrid = document.body.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
        if (!bazaarGrid) {
            setTimeout(observePageLoad, 100);
            return;
        }

        let rows = bazaarGrid.querySelectorAll('.row___LkdFI');
        if (!rows || rows.length < 1) {
            setTimeout(observePageLoad, 100);
            return;
        }

        rows.forEach(row => {
            moveBuyIcon(row);
        });
    }

    // Create the observer for new nodes added
    function createObserver() {
        // Select the target node
        let targetNode = document.body.querySelector('.ReactVirtualized__Grid__innerScrollContainer');
        if (!targetNode) {
            setTimeout(createObserver, 100);
            return;
        }

        // Options for the observer (which mutations to observe)
        let config = { attributes: false, childList: true, subtree: true };

        // Create an observer instance linked to the callback function
        let observer = new MutationObserver(newNodeAdded);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

    // Autofill max if the right node is added
    function newNodeAdded(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('tt-max-buy')) {
                        moveBuyButton(node);

                        if (autoFillMax === true) {
                            clickFillButton(node);
                        }
                    } else if (node.nodeType === 1 && node.classList.contains('row___LkdFI')) {
                        moveBuyIcon(node);
                    } else if (node.nodeType === 1 && node.classList.contains('buyConfirmation___pRG1v')) {
                        if (noConfirm === false) {
                            moveYesButton(node);
                        } else if (noConfirm === true) {
                            clickYesButton(node);
                        }
                    } else if (node.nodeType === 1 && node.classList.contains('item___GYCYJ')) {
                        let rowItems = node.parentNode;
                        let row = rowItems.parentNode;

                        moveBuyIcon(row);
                    } else if (node.nodeType === 1 && node.classList.contains('itemDescription___j4EfE')) {
                        let item = node.parentNode;
                        let rowItems = item.parentNode;
                        let row = rowItems.parentNode;

                        moveBuyIcon(row);
                    }
                });
            }
        }
    }

    // Click the "Fill Max" button
    function clickFillButton(node) {
        let parent = node.parentNode;
        let maxFillButton = parent.querySelector('.tt-max-buy');

        maxFillButton.dispatchEvent(new Event('click', { bubbles: true }));
        maxFillButton.remove();

        let buyButton = parent.querySelector('.buy___Obyz6');
    }

    // Click the "Yes" button
    function clickYesButton(node) {
        let button = node.querySelector('.button___g7ktb');
        button.dispatchEvent(new Event('click', { bubbles: true }));
    }

    // Move buy icon
    function moveBuyIcon(node) {
        let imgBars = node.querySelectorAll('.imgBar___Dbu1b');

        imgBars.forEach(imgBar => {
            let buyButton = imgBar.querySelector('.controlPanelButton___MSBz0:nth-child(2)');
            imgBar.appendChild(buyButton);

            buyButton.style.position = 'absolute';
            buyButton.style.top = '40px';
            buyButton.style.left = '210px';
            buyButton.style.border = 'none';
        });
    }

    // Move buy button
    function moveBuyButton(node) {
        let parent = node.parentNode;
        let button = parent.querySelector('.buy___Obyz6');

        node.addEventListener('click', function() {
            node.remove();
            button.classList.remove('tt-buy');
            button.style.marginTop = '5px';
        });
    }

    // Move confirm/yes button
    function moveYesButton(node) {
        let button = node.querySelector('.button___g7ktb');
        button.style.position = 'absolute';
        button.style.right = '20px';
        button.style.bottom = '8px';
    }

    // Call scripts upon opening the page
    createObserver();
    observePageLoad();

})();