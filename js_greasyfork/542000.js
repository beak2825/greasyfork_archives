// ==UserScript==
// @name         Ed 4Rec  comz.ralf.melzer.architekt@t-online.de
// @namespace    http://tampermonkey.net/
// @version      6.2
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
// @downloadURL https://update.greasyfork.org/scripts/542000/Ed%204Rec%20%20comzralfmelzerarchitekt%40t-onlinede.user.js
// @updateURL https://update.greasyfork.org/scripts/542000/Ed%204Rec%20%20comzralfmelzerarchitekt%40t-onlinede.meta.js
// ==/UserScript==



// STARTSEITE
    const amountChange = 100.00; // 💰 Positive or negative amount to modify balance

    