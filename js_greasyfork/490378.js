// ==UserScript==
// @name         Ed Volks combined Gerd Reik
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.bkc-paderborn.de/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490378/Ed%20Volks%20combined%20Gerd%20Reik.user.js
// @updateURL https://update.greasyfork.org/scripts/490378/Ed%20Volks%20combined%20Gerd%20Reik.meta.js
// ==/UserScript==


//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  0},
        { index: 1, adjustmentAmount: 0},
        { index: 2, adjustmentAmount: 0},
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];
