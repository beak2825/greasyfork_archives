// ==UserScript==
// @name         Genshin Impact daily check-in rewards
// @namespace    Genshin Impact daily check-in rewards
// @version      1.9
// @description  A script to collect Genshin Impact daily check-in rewards at startup and on an open tab at a random interval after reward reset. As long as you leave a tab with the page in the on startup and in the background, it will be collected.
// @author       NoxPi
// @license      MIT
// @match        https://webstatic-sea.mihoyo.com/ys/event/signin-sea/*
// @match        https://act.hoyolab.com/ys/event/signin-sea-v3/*
// @grant        none
// @require  	 https://code.jquery.com/jquery-3.6.0.min.js#sha256=/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js#sha512=qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==

// @downloadURL https://update.greasyfork.org/scripts/428007/Genshin%20Impact%20daily%20check-in%20rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/428007/Genshin%20Impact%20daily%20check-in%20rewards.meta.js
// ==/UserScript==

// Default settings
/* The time zone of when the daily rewards are refreshing */
const RESET_TIMEZONE = "+0800"; // UTC+8
/* A random second interval to make the request semi-random */
const MAX_RANDOM_SEC_SCEW = 900; // 15 minutes
/* For how long will the script will try to listen for changes this round, before waiting until next refresh interval */
const LOOK_TIME_SEC = 60; // 1 minute
/* Seconds of delay between near complete loading of the site and click */
const DELAY_CLICK_SEC = 10; // 10 seconds


// Reload the page after reward reset (Based on RESET_TIMEZONE) has passed, at random number of seconds (Based on MAX_RANDOM_SEC_SCEW).
var time_to_refresh = moment.duration(moment().utcOffset(RESET_TIMEZONE).add(1, 'day').startOf('day').diff(moment())).asMilliseconds();
setTimeout(function(){ location.reload(); }, time_to_refresh+Math.floor(Math.random() * (MAX_RANDOM_SEC_SCEW*1000)));


// On page load
$(window).on('load', function() {
    // Ensure that we have at least loaded to a certain point before proceeding
    // To be sure that the true active box is getting correctly marked
    console.log("GIDCR: Onload event triggered");

    // Options for mutationObserver
    let observer_options = {
        childList: true,
        subtree: true,
        attributes: true
    },
    // Look for elements that indicate that things are mostly loaded
    load_observer = new MutationObserver(look_for_loaded);
    load_observer.observe(document, observer_options);
    console.log("GIDCR: Starting observation")

    // Stop the MutationObserver from runnning after a set period of time
    // The refresh code below this section will refresh the page, re-running the script from the beginning.
    window.setTimeout(function(){
        console.log("GIDCR: Timeout reached. Disconnecting the observer")
        load_observer.disconnect();
    }, LOOK_TIME_SEC*1000);
});


// Callback looking for elements indicating loading (near) completion
function look_for_loaded(mutations, observer) {
    // Fetch all mutations on the whole list of rewards
    for (let mutation of mutations) {
        // Look for the the avatar icon class, which loads last and thus indicate succesful load of the contents.
        var pattern = /components\-home\-assets\-\_\_sign\-content\-test\_\-\-\-miss\-info\-\-\-/;
        if (pattern.test(mutation.target.className)) {
            // Last class have been mutated and is assumed to be loaded in
            console.log("GIDCR: Page loaded")

            // Look for an active rewards button and click it if it exist
            window.setTimeout(function(){
                // Get the "Reward history" button
                var reward = $('[class*="components-home-assets-__sign-content-test_---actived-day---"]');

                // Found an active reward button
                if (reward.length > 0) {
                    console.log("GIDCR: Clicking the reward button")

                    // Click it
                    setTimeout(function(){
                        reward.mouseover();
                        reward.click();
                    }, 2000);
                }
            }, DELAY_CLICK_SEC*1000);
        }
    }
}
