// ==UserScript==
// @name MAM Max User Gift
// @namespace yyyzzz999
// @author yyyzzz999
// @description 3/21/23 Maximizes the default gift value for old and new members
// @match https://www.myanonamouse.net/u/*
// @version 0.7
// @icon  https://cdn.myanonamouse.net/imagebucket/164109/mgs64b.png
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462043/MAM%20Max%20User%20Gift.user.js
// @updateURL https://update.greasyfork.org/scripts/462043/MAM%20Max%20User%20Gift.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */

// Script icon uses Gift icons created by Freepik - Flaticon https://www.flaticon.com/free-icons/gift
// Automate adjusting to new gift limits on MAM
// 2023-03-17: Decreased bonus gifts to new users (sub 2 weeks) from 1k to 100 per user
setTimeout(function() {
    'use strict';
    var DEBUG =1; // Debugging mode on (1) or off (0)
    if (DEBUG > 0) console.log('Starting MAM Max User Gift');
    var now = new Date();
    var dateString = document.querySelector(".coltable").rows[0].cells[1].textContent ; //
    const date = new Date(dateString.split(' ')[0] + 'T' + dateString.split(' ')[1] + 'Z');
    const twoWeeksAfter = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 14, date.getHours(), date.getMinutes(), date.getSeconds());
    if (DEBUG > 0) {
        console.log("Join date: " + date.toUTCString());
        console.log("2 weeks after join: " + twoWeeksAfter.toUTCString());
        console.log("Now: " + now.toUTCString());
    }
    if (now > twoWeeksAfter) {
       document.getElementById("bonusgift").value = "1000";
    } else {
       document.getElementById("bonusgift").value = "100";
    }
    if (DEBUG > 0) console.log('MAM Max User Gift Finished');
}, 500); // delay in ms to run after MAM+ is finished, default 0.5 seconds