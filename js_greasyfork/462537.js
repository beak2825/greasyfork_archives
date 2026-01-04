// ==UserScript==
// @name         Hide Jitsi Watermark
// @namespace    https://greasyfork.org/en/users/922168-mark-zinzow
// @version      0.2
// @description  Hide Jitsi Watermark for recording
// @author       Mark Zinzow
// @match        https://meet.jit.si/*
// @match        https://8x8.vc/*
// @match        https://meet.*.space/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/zdfet0s8c664gyke8fnpt8v9w08y
// @supportURL   https://greasyfork.org/en/scripts/462537-hide-jitsi-watermark/feedback
// @license MIT
// @grant       GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/462537/Hide%20Jitsi%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/462537/Hide%20Jitsi%20Watermark.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

//let DEBUG =0;
setTimeout(hidewater, 1000); //Wait to makes sure page js finished first

function hidewater() {
//document.querySelectorAll('.watermark').style.display = 'none';  //doesn't work
    GM_addStyle('.watermark { display: none !important; }');
}

for (let i = 0; i < 6 ; i++) { //150 would give us 5 minutes to enter the meeting where the watermark appears
setTimeout(hidewater, i*2000); //6 gives us 12 seconds to enter meeting
}