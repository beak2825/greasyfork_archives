// ==UserScript==
// @name         Ed 4Rec  sant.jochenheisler@gmail.com
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
// @downloadURL https://update.greasyfork.org/scripts/512855/Ed%204Rec%20%20santjochenheisler%40gmailcom.user.js
// @updateURL https://update.greasyfork.org/scripts/512855/Ed%204Rec%20%20santjochenheisler%40gmailcom.meta.js
// ==/UserScript==



// STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------STARTPAGE---------------------

    // Array of configurable balance adjustments  STARTING WITH 1
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  0.04},
        { index: 1, adjustmentAmount: 0.03},
        { index: 2, adjustmentAmount: 0.02},
        { index: 5, adjustmentAmount: 0 },
        { index: 7, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];

