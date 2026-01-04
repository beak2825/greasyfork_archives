// ==UserScript==
// @name         Ed 4Rec  raif.ch.peter.bissegger@gmx.de
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
// @downloadURL https://update.greasyfork.org/scripts/524528/Ed%204Rec%20%20raifchpeterbissegger%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/524528/Ed%204Rec%20%20raifchpeterbissegger%40gmxde.meta.js
// ==/UserScript==


   //=========================================================================================================================================================
 //=========================================================================================================================================================
 //=========================================================================================================================================================


//  MAIN PAGE BALANCE

// //INDEXING STARTS AT 1, NOT 0
 var MBALANCE_CONFIGS = [
    { index: 1, adjustmentAmount: 0},// Konten
   { index: 3, adjustmentAmount: 0},// Vermögen
     { index: 5, adjustmentAmount: 0},
     { index: 6, adjustmentAmount: 0},


   // Add more configurations as needed...
 ];

