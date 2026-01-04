// ==UserScript==
// @name        Mangadex Group Blocker
// @namespace   Violentmonkey Scripts
// @match       https://mangadex.org/titles/latest*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant       none
// @version     3.0
// @author      Onemanleft
// @description To block groups on Mangadex's latest releases page
// @downloadURL https://update.greasyfork.org/scripts/431263/Mangadex%20Group%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/431263/Mangadex%20Group%20Blocker.meta.js
// ==/UserScript==

// Start and end are the formats for the relevant element on the page.
const start = "#__layout > div > div.flex-grow.flex.flex-col.flex-shrink > div.flex-grow > div > div:nth-child(2) > div.mb-12 > div:nth-child(";
// Normal groups
const end = ") > div > div > div > div:nth-child(1) > a > div > div.flex.items-center.space-x-1.flex.space-x-2.items-center.md\\:col-span-2";
// Title if you want to debug at the end of the switch expression
const title = ") > div > a.chapter-feed__title";
// Wait for the chapters to be loaded.
waitForKeyElements(".flex-grow", function () {
try {
    // Count is how many chapters were loaded.
    const count = document.querySelector("#__layout > div > div.flex-grow.flex.flex-col.flex-shrink > div.flex-grow > div > div:nth-child(2) > div.mb-12").childElementCount;
    // Max "count" number of entries per page.
    for (let i = 1; i <= count; i++) {
        // This shows the group name.
        var x = document.querySelector(start + i + end).innerText;
        switch (x) {
            // The groups you want to block.
            case "Azuki Manga":
            case "Bilibili Comics":
            case "Comikey":
            case "MangaPlus":
            /* To block more groups add a line after 'case "Bilibili Comics":' like
            case "Test":
            Or simply delete the line if you don't want to block it.
            It IS a COLON (:) NOT a SEMICOLON (;)
            If you want to add pair group releases do
            case "Group 1\nGroup 2":
            */
            // Uncomment the line below if you want to see what got hidden by deleting the // and then going to F12 > Console
            // console.log("Hid " + x + " at count " + i + " titled " + document.querySelector(start + i + title).innerText);
            // This blocks the element if it matches the group name.
            document.querySelector(start + i + ")").style.display="none";
        }
    }
}
catch (e) {
    // If it sometimes doesn't work try refreshing. F12 > Console to view any possible errors.
    // <Cannot read property 'childElementCount' of null> sometimes appear at the start of a new latest page for some reason but stop after the next page.
    console.log(e);
}});