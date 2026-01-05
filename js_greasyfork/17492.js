// ==UserScript==
// @name         Anti-Unblocker
// @description  Blocks unblocked game sites
// @author       You
// @include      *
// @run-at       document-body
// @grant        none
// @version 0.0.1.20160228092418
// @namespace https://greasyfork.org/users/12417
// @downloadURL https://update.greasyfork.org/scripts/17492/Anti-Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/17492/Anti-Unblocker.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var title = document.title.toLowerCase().replace(/ /g, "");
var unblocked =
[
    "unblock",
    "unblocked",
    "unblocks",
    "ublock",
    "ublocked",
    "ublocks"
]; // Initializes list of all variations of the word "unblocked"

var games =
[
    "game",
    "gaming",
]; // Initializes list of all variations of the beginnings of the word "games" (the end doesn't matter)

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

for (var i in unblocked) // Iterate through list of all variations of the word "unblocked"
{
    for (var x in games) // Iterate through list of all variations of the beginnings of the word "games" (the end doesn't matter)
    {
        var search_result = title.search(unblocked[i] + games[x]); // This variable will equal -1 if it is not found
        if (search_result !== -1) // If the search exists
        {
            block(); // Block
        }
    }
}