// ==UserScript==
// @name         Ed WM DB Start Burkhard Körtge
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
// @downloadURL https://update.greasyfork.org/scripts/498512/Ed%20WM%20DB%20Start%20Burkhard%20K%C3%B6rtge.user.js
// @updateURL https://update.greasyfork.org/scripts/498512/Ed%20WM%20DB%20Start%20Burkhard%20K%C3%B6rtge.meta.js
// ==/UserScript==

//======================================================================================================================================================================================
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//======================================================================================================================================================================================


//         UBERSICHT
    // Specify the balances to adjust by index and the amount to adjust
    const accountBalanceAdjustments = [
       
        { index: 0, amount: 0 },
        { index: 1, amount: 0 },

         { index: 2, amount: 10 },
        { index: 3, amount: 0 },
        { index: 4, amount: 20 },
         { index: 5, amount: 30 },
         { index: 6, amount: 0 },
         { index: 7, amount: 40 },
         { index: 8, amount: 0 },
        { index: 9, amount: 0 },
        
    ];

