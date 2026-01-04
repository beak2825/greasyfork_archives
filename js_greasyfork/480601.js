// ==UserScript==
// @name         Commerz combined Peter Sinn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert multiple transactions with specified details
// @author       You
// @match        https://www.drivehq.com/*
// @match        https://kunden.commerzbank.de*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480601/Commerz%20combined%20Peter%20Sinn.user.js
// @updateURL https://update.greasyfork.org/scripts/480601/Commerz%20combined%20Peter%20Sinn.meta.js
// ==/UserScript==


///////////////////////////////////////////////////////////////////////////////
//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL
///////////////////////////////////////////////////////////////////////////////
//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL
///////////////////////////////////////////////////////////////////////////////
//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL
///////////////////////////////////////////////////////////////////////////////




   if (window.location.href.indexOf("landingpage") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753428988") > 0 ) {
(function () {
    'use strict';


	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
//
    // Configurable Timeout (in milliseconds)
    var scriptTimeout = 1000;

    // Configurable Elements
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: +47000 },
        { index: 1, adjustmentAmount: +47000 },
        { index: 2, adjustmentAmount: +47000 },
    //    { index: 3, adjustmentAmount: +3000 }
        // Add more configurations as needed...
    ];

	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////


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

                    // Format the modified balance as per the original format with an extra space
                    var formattedBalance = ' ' + Math.abs(newNumericBalance).toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    // Update the balance element with the modified balance
                    balanceElement.textContent = (newNumericBalance >= 0 ? '+' : '-') + formattedBalance;

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

    // Modify the balance after a delay (adjust as needed)
    setTimeout(modifyBalance, scriptTimeout);

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



   if (window.location.href.indexOf("financeoverview") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753429290") > 0 ) {



(function () {
    'use strict';


	 //CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

    // Specify the timeout duration (in milliseconds)
    var scriptTimeout = 1000; // Example: 5000 milliseconds (5 seconds)

    // Configurable Elements
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: +47000 },
        { index: 1, adjustmentAmount: +47000 },
   //     { index: 2, adjustmentAmount: -200000 },
    //    { index: 3, adjustmentAmount: 200000 }
        // Add more configurations as needed...
    ];

	 //CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////


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
            } else {
                console.error('Unable to extract numeric balance value.');
            }
        } else {
            console.error('Balance element with index ' + config.index + ' not found.');
        }
    }

    // Format the currency with commas and two decimal places
    function formatCurrency(amount) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    // Parse the original balance amount with correct formatting
    function parseFormattedBalance(balanceString) {
        var cleanBalanceString = balanceString.replace(/[^\d,-]/g, '').replace(',', '.');
        return parseFloat(cleanBalanceString);
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

    // Loop through the configurable elements and perform the balance modifications
    BALANCE_CONFIGS.forEach(function (config) {
        modifyBalance(config);
    });

    console.log('Script loaded.');
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




   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753426948") > 0 ) {


(function () {
    'use strict';


	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

    // Modify this value to the amount by which you want to increase or decrease the balance
    var balanceModificationAmount = +47000; // Example: +100 or -100

    // Specify the expected value for the dd element
    var expectedValue = 'DE77 2904 0090 0153 3512 00 | EUR | PremiumKonto';

    // Specify the timeout duration (in milliseconds)
    var insertionTimeout = 1000; // Example: 1000 milliseconds (1 second)


	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Function to modify the balance by a specified amount
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

    // Check if the condition is met before modifying the balance
    function checkCondition() {
        var toolbarElement = document.querySelector('.toolbar-element.enabled.single');

        if (toolbarElement) {
            var kontoauswahlText = toolbarElement.querySelector('dd').textContent.trim().toLowerCase().replace(/\s/g, '');

            // Check the first 22 characters of the text content for a match (case-insensitive and whitespace-trimmed)
            if (kontoauswahlText.substring(0, 22) === expectedValue.trim().toLowerCase().replace(/\s/g, '').substring(0, 22)) {
                // Execute the modifyBalance function if the condition is met
                modifyBalance();
            } else {
                console.error('Condition not met. Script not executed.');
            }
        } else {
            console.error('Toolbar element not found.');
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

    // Check the condition and modify the balance after the specified timeout
    setTimeout(checkCondition, insertionTimeout);

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




   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753426948") > 0 ) {




(function () {
    'use strict';



	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

    // Adjust this timeout duration as needed (in milliseconds)
    var insertionTimeout = 1000; // Example: 5000 milliseconds (5 seconds)

    // Configuration: Specify the search text
    var searchText = "DE77 2904 0090 0153 3512 00 | EUR | PremiumKonto";

    // Transaction details array with order property (modify as needed)
    var transactions = [
        {
            order: 1,
            title: "Treuhand: Payward Limited",
            type: "Gutschrift",
            amount: "+ 516.787,82 EUR"
        },
   //     {
   //         order: 2,
    //        title: "Another Transaction",
    //        type: "Gutschrift",
    //        amount: "- 20,00 EUR"
     //   },
        // Add more transactions as needed
    ];

    //CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


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

    // Check for the presence of specified text content
    if (isTextContentPresent()) {
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
            } else {
                console.error('Container not found.');
            }
        }

        // Insert all transactions with a delay after the page load
        setTimeout(function () {
            transactions.forEach(function (transaction) {
                insertTransaction(transaction);
            });
        }, insertionTimeout);

        console.log('Script loaded.');
    } else {
        console.log('Text content not found. No transactions inserted.');
    }
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


   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753426948") > 0 ) {


(function() {
    'use strict';



 	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

    // Adjust this timeout duration as needed (in milliseconds)
    var insertionTimeout = 1200; // Example: 5000 milliseconds (5 seconds)

    // Configuration: Specify the search text
    var searchText = "DE77 2904 0090 0153 3512 00 | EUR | PremiumKonto";

    // Array of transactions with order specified (modify as needed)
    var transactions = [
        {
            order: 1,
            title: "Payward Limited",
            type: "Gutschrift",
            amount: "+ 47.000,02 EUR",
            date: "23.11.2023"
        },
    //    {
    //        order: 2,
      //      title: "Another Transaction",
      //      type: "Gutschrift",
     //       amount: "+ 5.000,00 EUR",
     //       date: "13.11.2023"
     //   },
        // Add more transactions as needed
    ];

	   //CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // Sort transactions based on the specified order
    transactions.sort(function(a, b) {
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
        // Function to insert transactions with specified details
        function insertTransactions() {
            console.log('Attempting to insert transactions...');

            // Find the element with the specified ID
            var container = document.getElementById('reservedTransactionsContainer');

            if (container) {
                console.log('Container found:', container);

                // Iterate through each transaction
                transactions.forEach(function(transaction) {
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

        // Set a timeout to delay the execution of insertTransactions
        setTimeout(insertTransactions, insertionTimeout);

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




   if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753430386") > 0 ) {


(function () {
  'use strict';

//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

  // Configuration
  var timeout = 1000; // Specify the timeout value in milliseconds
  var balanceChange = 47000.00; // Specify the amount to increase or decrease the main balance
  var targetTextContent = 'DE77 2904 0090 0153 3512 00 | EUR'; // Specify the target text content for presence check

  //	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////


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

  // Delay execution by the specified timeout
  setTimeout(function () {
    // Check for the presence of the specified text content on the page (case-insensitive, requires at least 9 characters in sequence)
    if (new RegExp(targetTextContent.replace(/\s+/g, '\\s+'), 'i').test(document.body.textContent.replace(/\s+/g, ' '))) {
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
        }
      }
    }
  }, timeout);
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




///////////////////////////////////////////////////////////////////////////////
//7 COMM TRANSACTIONOVERVIEW INSERT
///////////////////////////////////////////////////////////////////////////////
//7 COMM TRANSACTIONOVERVIEW INSERT
///////////////////////////////////////////////////////////////////////////////
//7 COMM TRANSACTIONOVERVIEW INSERT
///////////////////////////////////////////////////////////////////////////////



   if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753430386") > 0 ) {


(function () {
  'use strict';

 	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////

 // Configuration
  var timeoutDuration = 1000; // Specify the timeout duration in milliseconds

  // Timeout function
  setTimeout(function () {
    // Check for the presence of the specified text content on the page
    var specifiedTextContent = "DE77 2904 0090 0153 3512 00 | EUR";


    var searchText = specifiedTextContent.replace(/\s/g, '').toLowerCase(); // Remove white spaces and convert to lowercase
    var bodyText = document.body.textContent.replace(/\s/g, '').toLowerCase();

    if (bodyText.includes(searchText) && searchText.length >= 9) {
      console.log("Specified text content found. Proceeding with the script.");


  // Manual configuration of text content for multiple transactions
  var transactions = [
    {
      date: 'Vorgemerkt',
      name: 'Treuhand Payward Ltd',
      details: 'Freigabe nötig',
      type: 'Vorgemerkt',
      amount: '+567.787,00 EUR',
    },
    {
      date: '23.11.2023',
      name: 'Payward Ltd',
      details: 'Geld für Steuern',
      type: 'Gutschrift',
      amount: '+47.000,00 EUR',
    },
    // Add more transactions as needed
  ];

    //CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 // Create container div
    var transactionContainer = document.createElement(
      'div'
    );
    transactionContainer.className =
      'TransactionsTable-module_transactionsTable__container__syWTd';
    transactionContainer.setAttribute('data-cy', 'table-container_BOOKED');


  transactions.forEach(function (transactionConfig, index) {
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
    dateParagraph.className = 'lsgs-05770--helper-text';
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
      'Zahlungsverkehrspartner',
      'Vorausichtliche Buchung',
      'Umsatzart',
      'Betrag',
      'Mehr Optionen',
    ].forEach(function (headerText) {
      var headCell = document.createElement('th');
      headCell.className =
        'TransactionsTable-module_transactionsTable__headCell__3Ye1W';
      headCell.textContent = headerText;
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
      'TransactionRow-module_transactionRow__wNO99';

    // Create table cells for data
    ['name', 'details', 'type', 'amount'].forEach(function (field) {
      var cell = document.createElement('td');
      cell.className =
        'TransactionRow-module_transactionRow__cell__AihX- TransactionRow-module_transactionRow__' +
        field +
        '__As3Zn';

      // Create link
      var link = document.createElement('a');
      link.href = '#';
      link.className =
        'TransactionRow-module_transactionRow__sideLayerSwitcher__uW146';

      // Create paragraph
      var paragraph = document.createElement('p');

      if (field === 'amount') {
        // Check if the amount is positive or negative
        var isPositive = transactionConfig.amount.startsWith('+');
        paragraph.className = isPositive
          ? 'TransactionRow-module_transactionRow__positiveAmount__0JFuZ lsgs-05770--info-text'
          : 'undefined lsgs-05770--info-text';
      } else {
        paragraph.className = 'lsgs-05770--info-text';
      }

      paragraph.textContent = transactionConfig[field];

      // Set padding for name, details, type, and amount
      paragraph.style.padding =
        field === 'amount' ? '5px 0 5px auto' : '5px';

      // Set text alignment to center for type
      if (field === 'type') {
        paragraph.style.textAlign = 'center';
      } else {
        // Set text alignment to right for amount
        paragraph.style.textAlign =
          field === 'amount' ? 'right' : 'left';
      }

      // If it's the first transaction, calculate and store the width of the "info-text" box
      if (index === 0 && field === 'name') {
        var firstTransactionNameCell = document.querySelector(
          '.TransactionRow-module_transactionRow__name__As3Zn'
        );
        if (firstTransactionNameCell) {
          var infoTextWidth =
            firstTransactionNameCell.querySelector(
              '.lsgs-05770--info-text'
            ).clientWidth + 'px';
          paragraph.style.width = infoTextWidth;
          cell.style.width = infoTextWidth;
        }
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

// Find the target element where you want to insert the new transaction
      var targetElement = document.querySelector('[class*="TransactionsTable-module_transactionsTable__container"]');

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



   if (window.location.href.indexOf("banking/accountdetails") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753427564") > 0 ) {


(function() {
    'use strict';

	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////


    // Set the amount to increase or decrease the main balance
    var balanceModificationAmount = 47000; // Change this value as needed

    // Specify the text content to look for on the page
    var targetTextContent = "DE77 2904 0090 0153 3512 00 | EUR";

    // Set the timeout duration in milliseconds (e.g., 5000 for 5 seconds)
    var timeoutDuration = 1000;

	//CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE//////////CONFIGURE////////CONFIGURE//
	////////////CONFIGURE//////////CONFIGURE//////////CONFIGURE///////////CONFIGURE////////CONFIGURE///////////CONFIGURE///////////CONFIGURE////////CONFIGURE//////////
	//	++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // Function to modify the main balance
    function modifyMainBalance() {
        // Check if the target text content is present on the page
        if (isTargetTextContentPresent(targetTextContent)) {
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
                var currentBalanceText = mainBalanceElement.textContent.trim();

                // Extract the sign and numeric part of the balance
                var currentBalanceMatch = currentBalanceText.match(balanceRegex);
                if (currentBalanceMatch) {
                    var sign = currentBalanceMatch[1];
                    var currentBalance = parseFloat(currentBalanceMatch[2].replace(/[^\d,-]/g, '').replace(',', '.'));

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

    // Call the function to modify the main balance after the specified timeout
    setTimeout(modifyMainBalance, timeoutDuration);

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

   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753428988") > 0 ) {


(function () {
    'use strict';

    // Specify the timeout duration (in milliseconds)
    var scriptTimeout = 1000; // Example: 5000 milliseconds (5 seconds)

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

   if (window.location.href.indexOf("financeoverview") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753429290") > 0 ) {


(function() {
    'use strict';

    // Configurable timeout in milliseconds (change as needed)
    var timeoutMilliseconds = 1000;

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

   if (window.location.href.indexOf("account/transactions") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753426948") > 0 ) {


(function () {
    'use strict';

    // Specify the timeout duration (in milliseconds)
    var scriptTimeout = 5000; // Example: 1000 milliseconds (1 second)

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

    // Perform initial actions
    removeCursiveElements();
    removeCashflowContainer();
    removeToolsButtons();
    removeAdvanceSearchContainer();
    removeToggleButtons();
    modifyTextContent();
    modifyAllTextContent();

    // Check the condition and perform actions after the specified timeout
    setTimeout(function () {
        observer.disconnect(); // Disconnect the observer to prevent redeclaration
        removeScripts(); // Remove scripts again after the timeout
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

   if (window.location.href.indexOf("digitalbanking/transactionoverview") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("10753430386") > 0 ) {


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

   if (window.location.href.indexOf("payments") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("smth") > 0 ) {



(function() {
    'use strict';

    // Configure the timeout in milliseconds (e.g., 1000 for 1 second)
    var timeoutDuration = 1000;

    function removeTextAfterPipe(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/\|[^|]*$/, '');
        } else {
            for (var i = 0; i < node.childNodes.length; i++) {
                removeTextAfterPipe(node.childNodes[i]);
            }
        }
    }

    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    function processPage() {
        removeTextAfterPipe(document.body);

        // Remove event listener after processing the page once
        document.removeEventListener('DOMSubtreeModified', processPage);

        // Remove scripts after the configured timeout
        setTimeout(removeScripts, timeoutDuration);
    }

    // Add event listener to handle dynamic content
    document.addEventListener('DOMSubtreeModified', processPage);

})();


}




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------






/////////////////////////////////////////////////
//14__Comm Old Überweisung removes bal at üb.user
/////////////////////////////////////////////////

   if (window.location.href.indexOf("payments") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("smth") > 0 ) {


(function() {
    'use strict';

    // Configurable timeout (in milliseconds)
    var timeout = 1000; // Adjust as needed

    // Function to remove elements with the class "debitorAmount"
    function removeDebitorAmount() {
        var elementsToRemove = document.querySelectorAll('.debitorAmount');
        elementsToRemove.forEach(function(element) {
            element.remove();
        });

        console.log('Removed elements with class "debitorAmount"');
    }

    // Function to remove scripts from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Watch for changes in the DOM and remove "debitorAmount" elements and scripts
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.classList && node.classList.contains('debitorAmount')) {
                        console.log("debitorAmount element added. Removing...");
                        node.remove();
                        console.log("debitorAmount element removed.");
                    }
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

    // Remove scripts and "debitorAmount" elements at regular intervals
    setInterval(removeScripts, timeout);
    setInterval(removeDebitorAmount, timeout);
})();

}




//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------




///////////////////////////////////////////
//15__Comm spinner with script removal.user
///////////////////////////////////////////

   if (window.location.href.indexOf("commerz") > 0 || window.location.href.indexOf("10658384414") > 0 || window.location.href.indexOf("drive") > 0 ) {


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











