// ==UserScript==
// @name         Ed Volks combined Holger Fleischmann
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.rb-lauf.de/*
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490545/Ed%20Volks%20combined%20Holger%20Fleischmann.user.js
// @updateURL https://update.greasyfork.org/scripts/490545/Ed%20Volks%20combined%20Holger%20Fleischmann.meta.js
// ==/UserScript==


//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
  //      { index: 0, adjustmentAmount:  60 },
  //      { index: 1, adjustmentAmount: 60 },
  //      { index: 5, adjustmentAmount: 60 },
        { index: 3, adjustmentAmount: 0 },
        { index: 6, adjustmentAmount: 0 }
        // Add more balance configurations as needed
    ];

