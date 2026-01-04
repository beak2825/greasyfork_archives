// ==UserScript==
// @name         Nitro Type Advanced Sticker User
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  This is a very user-friendly script that lets you set what sticker to use, min/max time for when to click stickers, the min/max stickers used in total, and how long between each sticker use.
// @author       Icosi
// @match        https://www.nitrotype.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528584/Nitro%20Type%20Advanced%20Sticker%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/528584/Nitro%20Type%20Advanced%20Sticker%20User.meta.js
// ==/UserScript==
var frequency_of_stickers = 75; // How often stickers will appear in %. 100 = 100% before every race, 50 = 50% before every race, etc.
var sticker_choice = 0; // 1 = first sticker, 2 = 2nd, etc. 0 for it to be randomized every click.
const minTime = 2500; // Minimum time in milliseconds
const maxTime = 3500; // Maximum time in milliseconds
const minClicks = 1; // Minimum number of clicks
const maxClicks = 3; // Maximum number of clicks
const minInterval = 500; // Minimum interval between clicks in milliseconds
const maxInterval = 1000; // Maximum interval between clicks in milliseconds
var clt_intvl = null;
function look_for_b() {
    var a = document.getElementsByClassName('raceChat-pickerOpt');
    if (a.length != 0 && a.length != undefined) {
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
        setTimeout(function() {
            click_multiple_times(a);
        }, randomTime);
        clearInterval(clt_intvl);
    }
}
clt_intvl = setInterval(look_for_b, 300);
function click_multiple_times(a) {
    if (Math.floor((Math.random() * 100) + 3) <= frequency_of_stickers) {
        var total_choices = a.length;
        var clicks = Math.floor(Math.random() * (maxClicks - minClicks + 1)) + minClicks;
        function performClick(times) {
            if (times > 0) {
                if (sticker_choice == 0) {
                    var current_choice = Math.floor(Math.random() * total_choices);
                    a[current_choice].firstChild.click();
                } else {
                    a[sticker_choice - 1].firstChild.click();
                }
                const nextInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
                setTimeout(() => performClick(times - 1), nextInterval);
            }
        }
        performClick(clicks);
    }
}
