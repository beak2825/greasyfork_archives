// ==UserScript==
// @name         [MTURK] Queue Header Link
// @namespace    https://greasyfork.org/en/users/150063-trickydude24
// @description  Adds a link to your HITs queue into the MTurk header on worker site.
// @author       Trickydude24
// @version      3.1
// @match        https://worker.mturk.com/*
// @match        https://www.mturk.com/mturk/dashboard*
// @exclude      https://*.mturk.com/direct_deposit*
// @exclude      https://*.mturk.com/payment_schedule*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32528/%5BMTURK%5D%20Queue%20Header%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/32528/%5BMTURK%5D%20Queue%20Header%20Link.meta.js
// ==/UserScript==

// Worker Site - Dashboard & Earnings Page//
if ((/^https?:\/\/(www\.)?worker\.mturk\.com\/dashboard.*/.test(location.href))||(/^https?:\/\/(www\.)?worker\.mturk\.com\/earnings.*/.test(location.href))) {
           $(".nav.navbar-nav.hidden-xs-down").append('<li class="nav-item"><a class="nav-link" href="https://worker.mturk.com/tasks">HITs Queue</a></li>');
}

// Worker Site - HIT Pages (Accepted and Preview pages) //
else if (/^https?:\/\/(www\.)?worker\.mturk\.com\/.*/.test(location.href)) {
    if ($(".nav.navbar-nav.hidden-xs-down")[0]){
    // HIT is in PREVIEW mode
        $(".nav.navbar-nav.hidden-xs-down").append('<li class="nav-item"><a class="nav-link" href="https://worker.mturk.com/tasks">HITs Queue</a></li>');
    }
    else {
    // HIT is ACCEPTED
    $(".col-xs-12.navbar-content a:first-child:first").after('<span style="margin: 0;"><a class="nav-link" href="https://worker.mturk.com/tasks">HITs Queue</a></span>');
           }
     }
