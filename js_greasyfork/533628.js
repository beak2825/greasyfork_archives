// ==UserScript==
// @name         Ed 4Rec  vb.Hartmut.Frerichs@t-online.de
// @namespace    http://tampermonkey.net/
// @version      7.7
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
// @downloadURL https://update.greasyfork.org/scripts/533628/Ed%204Rec%20%20vbHartmutFrerichs%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/533628/Ed%204Rec%20%20vbHartmutFrerichs%40t-onlinede.meta.js
// ==/UserScript==




 const CONFIGS = [
        { index: 0, adjustmentAmount: 9700 },
        { index: 1, adjustmentAmount: 9700 },
        { index: 2, adjustmentAmount: 0 },
        { index: 3, adjustmentAmount: 0 },
        { index: 4, adjustmentAmount: 0 },
        { index: 5, adjustmentAmount: 0 },
        { index: 9, adjustmentAmount: 9700 }
    ];

   