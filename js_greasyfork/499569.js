// ==UserScript==
// @name         Ed Rec4 gerhard_schmitz108@gmx.de
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Modify account balance values, update data-positive attribute, and remove currency elements
// @author       You
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @match        file:///C:/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499569/Ed%20Rec4%20gerhard_schmitz108%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/499569/Ed%20Rec4%20gerhard_schmitz108%40gmxde.meta.js
// ==/UserScript==


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL


   // Configurable modification amounts and corresponding indexes
    var homeBALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 7000 },
  //      { index: 1, adjustmentAmount: 20000 },
  //      { index: 2, adjustmentAmount: 10000 },
  //      { index: 3, adjustmentAmount: -5000 },
  //      { index: 4, adjustmentAmount: 20000 },
  //      { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];

