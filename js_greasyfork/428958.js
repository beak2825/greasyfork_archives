// ==UserScript==
// @name         Genshin Impact & Honkai Star Rail daily check-in rewards claimer
// @namespace    Genshin Impact daily check-in rewards
// @version      2.1
// @description  A script to collect daily check-in rewards for Genshin Impact and Honkai Star Rail at startup on an open tab at a random interval after reward reset. As long as you leave a tab open with the daily checkin page loaded (pinned tabs work well), it will be collected.
// @author       NoxPi
// @modifiedBy   Bunta
// @licence      CC BY 4.0
// @match        https://*.hoyolab.com/*/event/signin*
// @grant        none
// @require  	 https://code.jquery.com/jquery-3.6.0.min.js#sha256=/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=

// @downloadURL https://update.greasyfork.org/scripts/428958/Genshin%20Impact%20%20Honkai%20Star%20Rail%20daily%20check-in%20rewards%20claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/428958/Genshin%20Impact%20%20Honkai%20Star%20Rail%20daily%20check-in%20rewards%20claimer.meta.js
// ==/UserScript==

// Default settings
/* The time window to refresh the page to check for changes
   Fresh will be between MIN & MAX value to provide some randomness
   Ensure MAX is greater than MIN */
const RESET_TIMEOUT_MIN = 240; // 4 hours
const RESET_TIMEOUT_MAX = 480; // 8 hours
/* What interval will the script wait before checking for rewards after page load */
const DELAY_REWARD_CHECK = 20; // 20 seconds

// Show in console when page was last refreshed
var d = new Date();
console.log(d.toLocaleString()+" GIDCR: Script Loaded");

// Reload the page after reward reset (Based on RESET_TIMEOUT) has passed, at random number of seconds (Based on MAX_RANDOM_SEC_SCEW).
var time_to_refresh = (Math.floor(Math.random() * (RESET_TIMEOUT_MAX - RESET_TIMEOUT_MIN)) + RESET_TIMEOUT_MIN)*60*1000
var refresh_date = new Date(d.getTime() + time_to_refresh);
setTimeout(function(){ location.reload(); }, time_to_refresh);

// Look for an active rewards button and click it if it exist
setTimeout(function(){
    // Get active reward for Genshin Impact
    var reward = $('[class*="_---active"]');
    // Get active reward for Honkai Star Rail
    if (reward.length < 1) {
        reward = $('[class*="components-pc-assets-__prize-list_---no---3smN44"]').filter(function() {
            return ( $(this).css('color') == 'rgb(0, 0, 0)' );
        })
    }

    var d = new Date();
    // Found an active reward button
    if (reward.length > 0) {
        // Click it and disconnect the observer
        console.log(d.toLocaleString()+" GIDCR: Reward Claimed!");
        reward.mouseover();
        reward.click();
    } else {
        console.log(d.toLocaleString()+" GIDCR: No reward to claim");
    }
    console.log(d.toLocaleString()+" GIDCR: Next page refresh at "+refresh_date.toLocaleTimeString());
}, DELAY_REWARD_CHECK*1000);