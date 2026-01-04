// ==UserScript==
// @name         Ed 4Rec  ing.homi_engel@web.de
// @namespace    http://tampermonkey.net/
// @version      3.0
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
// @downloadURL https://update.greasyfork.org/scripts/532103/Ed%204Rec%20%20inghomi_engel%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/532103/Ed%204Rec%20%20inghomi_engel%40webde.meta.js
// ==/UserScript==



////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////
/////////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// /////////
////CONFIGURE/////////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE///// ////CONFIGURE/////

    // Specify the adjustment amount for topGesamtSaldo
    const topGesamtSaldoAdjustmentAmount = 1;  // Change this to your desired amount

    // Define an array for account balance adjustments
    const accountBalanceAdjustments = [
        { index: 0, amount: 0},
        { index: 1, amount: 50},// Example: change the first account's balance by -1000 EUR
    //    { index: 2, amount: 100 },
        // Add more objects as needed for each account balance adjustment
    ];
