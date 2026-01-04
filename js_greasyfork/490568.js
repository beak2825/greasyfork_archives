// ==UserScript==
// @name         Ed Volks combined DIETER HÖLSCHER
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.rb-lauf.de/*
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490568/Ed%20Volks%20combined%20DIETER%20H%C3%96LSCHER.user.js
// @updateURL https://update.greasyfork.org/scripts/490568/Ed%20Volks%20combined%20DIETER%20H%C3%96LSCHER.meta.js
// ==/UserScript==


//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  212000},
        { index: 1, adjustmentAmount: 212000},
        { index: 2, adjustmentAmount: 212000},
        { index: 3, adjustmentAmount: 0},
        { index: 6, adjustmentAmount: 0 }
        // Add more balance configurations as needed
    ];
