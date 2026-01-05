// ==UserScript==
// @name         Skip Promoted Posts Script
// @namespace    http://heyisthisusernametaken.com/skip_promoted
// @version      0.2
// @description  Detects promoted posts and presses the next button
// @author       heyisthisusernametaken
// @match        http://imgur.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        click
// @downloadURL https://update.greasyfork.org/scripts/11483/Skip%20Promoted%20Posts%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/11483/Skip%20Promoted%20Posts%20Script.meta.js
// ==/UserScript==

console.log('Loading "Skip Promoted Posts" script');
//Determine if post is promoted
if (document.getElementsByClassName("promoted-tag").length > 0) {
    console.log('Promoted post detected');
    // Press the next button
    var nextBtns = document.getElementsByClassName("navNext");
    $(window).bind("load", function() {
       console.log("Skipping promoted post");
       nextBtns[0].click();
    });
} else {
    //console.log("not a promoted post");
}