// ==UserScript==
// @name        Prevent Zoom Pro Ads and Success Hash
// @namespace   https://github.com/DenverCoder1
// @version     0.0.4
// @description Prevents the #success Hash on Zoom join links to allow sharing the link with others and prevents Zoom Pro ads from appearing after the button is clicked.
// @match       https://*.zoom.us/j/*
// @match       https://*.zoom.us/s/*
// @match       https://*.zoom.us/postattendee
// @grant       none
// @author      Jonah Lawrence (DenverCoder1)
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/447274/Prevent%20Zoom%20Pro%20Ads%20and%20Success%20Hash.user.js
// @updateURL https://update.greasyfork.org/scripts/447274/Prevent%20Zoom%20Pro%20Ads%20and%20Success%20Hash.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

/**
 * Redirect success links containing the #success hash and "/s/" to the same link at /j/ without the hash.
 */
function redirectSuccessToJoin() {
    history.replaceState(null, null, window.location.href.replace("/s/", "/j/").replace(/#.*?$/, ""));
}

// if window contains a /postattendee (zoom ad), redirect to last join url or default url
if (window.location.href.includes("/postattendee")) {
    const lastJoinUrl = localStorage.getItem("lastJoinUrl");
    if (lastJoinUrl) {
        window.location.href = lastJoinUrl;
    } else {
        window.history.back();
        // fallback to default url if can't go back
        window.location.href = "https://google.com";
    }
}
// if on a success link, redirect to join link
else if (window.location.href.includes("/s/")) {
    redirectSuccessToJoin();
}

// check for the url to change, and turn it back into the /j/ url
window.addEventListener("hashchange", redirectSuccessToJoin);
// set last join link to redirect back to later
window.localStorage.setItem("lastJoinUrl", window.location.href);
