// ==UserScript==
// @name         Ed Rec Volks combined Ann Kersten
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490589/Ed%20Rec%20Volks%20combined%20Ann%20Kersten.user.js
// @updateURL https://update.greasyfork.org/scripts/490589/Ed%20Rec%20Volks%20combined%20Ann%20Kersten.meta.js
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

