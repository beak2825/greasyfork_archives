// ==UserScript==
// @name         Suppress Facebook posts
// @namespace    https://greasyfork.org/en/users/445779-haanjj
// @version      0.3
// @description  Suppress Facebook posts with short or no post message
// @author       Jeff Haan
// @match        https://www.facebook.com/*
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/396633/Suppress%20Facebook%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/396633/Suppress%20Facebook%20posts.meta.js
// ==/UserScript==

// Facebook posts with no post message or a post message shorter than lengthLimit, are removed from the page
var lengthLimit =100;
var debug = false;

waitForKeyElements (
    "[data-testid~='fbfeed_story']",
    function ( jNode ) {
        'use strict';
        if ($( jNode ).find("div[data-testid='post_message'][class*='userContent'][style!='display: none;']").find("p").length > 0) {
            var post_message = $( jNode ).find("div[data-testid='post_message'][class*='userContent'][style!='display: none;']").find("p")[0].innerText;
            if ( debug ) console.log("POST MESSAGE " + post_message );
            if ( debug ) console.log("POST MESSAGE length"  + post_message.length );
            if ( post_message.length < lengthLimit ) $( jNode ).remove();
        } else {
            if ( debug ) console.log("       No post message!");
            $( jNode ).remove();
        }
    }
);

