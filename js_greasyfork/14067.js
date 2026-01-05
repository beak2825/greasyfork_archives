// ==UserScript==
// @name Mediablock
// @description Closes social media from 7 AM to 6 PM inclusive on weekdays, 6 AM to 10 AM Saturdays, and completely free on Sundays!
// @include https://*.reddit.com
// @include https://*.reddit.com/*
// @include https://*.facebook.com
// @include https://*.facebook.com/*
// @include https://*.twitter.com
// @include https://*.twitter.com/*
// @include https://scratch.mit.edu
// @include https://scratch.mit.edu/*
// @include https://*.newgrounds.com
// @include https://*.newgrounds.com/*
// @include https://*.myspace.com
// @include https://*.myspace.com/*
// @include https://*.youtube.com
// @include https://*.youtube.com/*
// @run-at document-start
// @namespace https://greasyfork.org/users/12417
// @version 0.0.1.20151125025222
// @downloadURL https://update.greasyfork.org/scripts/14067/Mediablock.user.js
// @updateURL https://update.greasyfork.org/scripts/14067/Mediablock.meta.js
// ==/UserScript==

// For any further inquiries, please contact me at scratch.mit.edu/users/iamunknown2 or reddit/u/iamunknowntwo
function block() // Function will block the website.
{
    var current = window.location.href;
    window.history.back(); // Attempt to go back (if it's opened in a tab with no tab history)
    if (window.location.href == current) // If it's still there 
    {
        window.close(); // Attempt to close page
        if (window.location.href == current) // If it's still there (if it's the only tab)
        {
            window.location.href = "about://newtab"; // Go to a new tab; always works!
        }
    }
}

var date1 = new Date();
var hours = date1.getHours(); // Hours
var day = date1.getDay(); // Day of the week

if (day === 6) // If it's a Saturday
{
    if (hours >= 5 && hours <= 9) //  Doesn't hurt to add a few more hours of work.
    {
        block();
    }
}

else if (hours >= 6 && hours <= 17 && day !== 0) // If hours are 7 AM to 6 PM (inclusive) and not a Sunday
{
    block();
}