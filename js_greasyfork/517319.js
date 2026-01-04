// ==UserScript==
// @name         Market Easy Buy
// @namespace    heartflower.torn
// @version      1.0
// @description  Autofill max, move buy buttons - PC and PDA friendly
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/517319/Market%20Easy%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/517319/Market%20Easy%20Buy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentPage = window.location.href;

    // Listen for the full item list to appear;
    createObserver(document.body, '.itemList___u4Hg1');

    // Create a mutation observer to watch for changes on the page
    function createObserver(parent, className) {
        let target;
        if (parent === 'skip') {
            let element = className;
            target = element;
        } else {
            target = parent.querySelector(className);
            if (!target) {
                setTimeout(() => createObserver(parent, className), 100);
                return;
            }
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            newNodeObserved(node);
                        }
                    });
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    // Function for when the change on the page has been detected
    function newNodeObserved(node) {
        if (node.classList.contains('sellerListWrapper___PN32N')) {
            sellerListWrapperAdded(node);
        } else if (node.classList.contains('confirmWrapper___T6EcT')) {
            let confirmMessage = node.querySelector('.confirmMessage___FJwkp');
            confirmMessageAdded(confirmMessage);
        } else if (node.classList.contains('.confirmMessage___FJwkp')) {
            confirmMessageAdded(node);
        } else if (node.classList.contains('rowWrapper___me3Ox') || node.classList.contains('sellerRow___AI0m6') || node.classList.contains('input-money-group')) {
            let moneyInput = node.querySelector('.input-money-symbol');
            if (moneyInput) {
                moneyInput.click();
            }

            let buyControlsButton = node.querySelector('.showBuyControlsButton___K8f72');
            if (buyControlsButton) {
                mobileClickBuyIcon(node, node.parent);
            }
        } else if (node.classList.contains('buyDialog___iBsgu')) {
            findElement(node, '.buyButton___Flkhg');
            setTimeout(() => findElement(node, '.closeButton___kyy2h'), 0);
        }

    }

    // Find an element based on className
    function findElement(parent, className) {
        let element = parent.querySelector(className);
        if (!element) {
            setTimeout(() => findElement(parent, className), 100);
            return;
        }

        if (className === '.closeButtonWrapper___y5R6c') {
            // Put the close button under the buy button after buy button is clicked
            element.style.right = '40px';
        } else if (className === '.showBuyControlsButton___K8f72') {
        } else if (className === '.buyDialog___iBsgu') {
            findElement(element, '.buyButton___Flkhg');
            setTimeout(() => findElement(element, '.closeButton___kyy2h'), 0);
        } else if (className === '.confirmMessage___FJwkp') {
            mobileConfirmMessageAdded(element);
            let buyDialog = element.parentNode;
            setTimeout(() => findElement(buyDialog, '.closeButton___kyy2h'),0);
        } else if (className === '.closeButtonWrapper___UHxtx') {
            mobileCloseButtonAdded(element);
        } else if (className === '.buyButton___Flkhg') {
            mobileMoveBuyButton(element);
        } else if (className === '.closeButton___kyy2h') {
            clickedPrematurely(element);
        } else if (className === '.input-money-symbol') {
            element.click();
        }
    }

    // Clicked "Close" button before buying an item
    function clickedPrematurely(closeButton) {
        closeButton.addEventListener('click', function() {
            let sellerList = closeButton.parentNode.parentNode.parentNode;
            let sellerRow = sellerList.querySelector('.expanded___S9xGz');

            let buyButton = sellerRow.querySelector('.buyButton___Flkhg');
            if (buyButton) {
                buyButton.remove();
            }

            let yesButton = sellerRow.querySelector('.confirmButton___WoFpj');
            if (yesButton) {
                yesButton.remove();
            }

            let buyIcon = sellerRow.querySelector('.showBuyControlsButton___K8f72');
            buyIcon.style.display = '';
        });
    }

    // Find elements based on className
    function findElements(parent, className, mobile) {
        let elements = parent.querySelectorAll(className);
        if (!elements || elements.length == 0) {
            setTimeout(() => findElements(parent, className, mobile), 100);
            return;
        }

        elements.forEach(element => {
            if (mobile == true) {
                let priceHead = element.querySelector ('.priceHead___Yo8ku');
                if (!priceHead) {
                    createObserver('skip', element);
                } else {
                    let list = element.parentNode;
                    createObserver('skip', element.parentNode);
                }

            } else if (className === '.rowWrapper___me3Ox' || className === '.sellerRow___Ca2pK') {
                createObserver('skip', element);
            } else if (className === '.input-money-symbol') {
                // click the "fill max button" item
                element.click();
            }
        });
    }

    // Reshow the original "buy icon" on all previously clicked items
    function mobileResetButtons(sellerList) {
        let hfMovedElements = document.body.querySelectorAll('.hf-moved');
        if (hfMovedElements && hfMovedElements.length > 1) {
            hfMovedElements.forEach(element => {
                element.remove();
            });

            let buyIcons = sellerList.querySelectorAll('.showBuyControlsButton___K8f72');
            if (buyIcons && buyIcons.length > 1) {
                buyIcons.forEach(icon => {
                    icon.style.display = '';
                });
            }
        }
    }

    // Find the buy button on mobile and move it
    function mobileMoveBuyButton(buyButton) {
        buyButton.style.width = '34px';
        buyButton.classList.add('hf-moved');

        let buyButtonTitle = buyButton.querySelector('.title___uDZTJ');
        buyButtonTitle.style.fontSize = 'smaller';
        buyButtonTitle.style.marginLeft = '-3px';

        let buyControls = buyButton.parentNode;
        let buyControlsWrapper = buyControls.parentNode;
        let buyDialog = buyControlsWrapper.parentNode;
        let sellerList = buyDialog.parentNode;
        let sellerRow = sellerList.querySelector('.expanded___S9xGz');

        mobileResetButtons(sellerList);

        let buyIcon = sellerRow.querySelector('.showBuyControlsButton___K8f72');
        buyIcon.style.display = 'none';

        // Move second buy button
        sellerRow.appendChild(buyButton);

        let moneyInput = buyDialog.querySelector('.input-money-symbol');
        if (!moneyInput) {
            return;
        }
        moneyInput.click();

        buyButtonTitle.addEventListener('click', function() {
            findElement(buyDialog, '.confirmMessage___FJwkp');
        });
    }

    // If the "buy" icon is clicked on mobile, move buttons
    function mobileClickBuyIcon(showBuyIcon, sellerRow) {
        showBuyIcon.addEventListener('click', function() {
            mobileResetButtons(sellerList);

            showBuyIcon.style.display = 'none';
            let sellerList = sellerRow.parentNode;

            createObserver(sellerList, '.buyDialog___iBsgu');
        });
    }

    // A specific market item is clicked open
    function sellerListWrapperAdded(node) {
        // Find the "fill max" buttons
        findElements(document.body, '.input-money-symbol');

        // Listen for new lines to appear
        createObserver(node, '.sellerList___kgAh_');

        // Find all the listings rows
        findElements(node, '.rowWrapper___me3Ox');
    }

    // "Are you sure you wanna buy?" add click listeners for clicking "no" or "yes" on mobile
    function mobileConfirmMessageAdded(confirmMessage) {
        let confirmButtons = confirmMessage.querySelector('.confirmButtons___Imp8D');
        let yesButton = confirmButtons.children[0];
        let noButton = confirmButtons.children[1];
        let sellerRow = document.body.querySelector('.expanded___S9xGz');
        let buyButton = sellerRow.querySelector('.buyButton___Flkhg');
        let buyButtonTitle = buyButton.querySelector('.title___uDZTJ');

        buyButton.style.display = 'none';

        sellerRow.appendChild(yesButton);
        yesButton.style.width = '34px';
        yesButton.style.padding = '0px';
        yesButton.classList.add('hf-moved');

        yesButton.addEventListener('click', function() {
            let buyDialog = confirmMessage.parentNode;
            setTimeout(() => findElement(buyDialog, '.closeButtonWrapper___UHxtx'), 0);
        });

        noButton.addEventListener('click', function() {
            yesButton.remove();
            buyButton.remove();

            let buyIcon = sellerRow.querySelector('.showBuyControlsButton___K8f72');
            buyIcon.style.display = '';

            // Autofill again
            findElement(sellerRow.parentNode, '.input-money-symbol');

            // Search buy button again
            findElement(sellerRow.parentNode, '.buyDialog___iBsgu');
        });
    }

    // The "X" button was added on mobile after buying an item
    function mobileCloseButtonAdded(closeButtonWrapper) {
        let sellerRow = document.body.querySelector('.expanded___S9xGz');
        let yesButton = sellerRow.querySelector('.confirmButton___WoFpj');
        yesButton.style.display = 'none';

        sellerRow.appendChild(closeButtonWrapper);
        closeButtonWrapper.style.position = 'relative';
        closeButtonWrapper.style.width = '34px';
    }

    // The "Buy Item" button is clicked, after which the confirmation message appeared
    function confirmMessageAdded(node) {
        // Style the text differently so it's easier to click
        node.style.justifyContent = 'space-between';

        let confirmButtons = node.querySelector('.confirmButtons___Imp8D');
        // Check if already switched around or not
        let firstConfirmButton = confirmButtons.children[0];
        if (firstConfirmButton.textContent == 'Yes') {
            // Switch "Yes" and "No" buttons to make them easier to click
            confirmButtons.insertBefore(confirmButtons.children[1], confirmButtons.children[0]);
        }

        // Find the confirm ("Yes") button
        let okayButton = confirmButtons.children[1];
        // Find the close button after the confirm ("Yes") button is clicked
        okayButton.addEventListener('click', function() {
            let confirmWrapper = node.parentNode;
            setTimeout(() => findElement(confirmWrapper, '.closeButtonWrapper___y5R6c'), 0);
        });
    }

    // Listen for the user to click anything on the page
    document.body.addEventListener('click', handleButtonClick);

    // If anything on the page is clicked, check if it's a page chance - if yes, rerun script
    function handleButtonClick(event) {
        let clickedElement = event.target;

        // Use a slight delay to allow the URL change to occur after the click
        setTimeout(() => {
            if (clickedElement.classList.contains('title___Zkrpo') || clickedElement.classList.contains('actionButton___pb_Da')) {
                findElements(document.body, '.sellerRow___Ca2pK', true);

            }

            let newPage = window.location.href;
            if (newPage !== currentPage) {
                currentPage = newPage;
                // Listen for the full item list to appear;
                createObserver(document.body, '.itemList___u4Hg1');
            }
        }, 50);
    }

})();