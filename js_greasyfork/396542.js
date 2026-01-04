// ==UserScript==
// @name         Header Menu
// @namespace    https://greasyfork.org/en/users/197274-m-c-krish
// @description  Adds a link to your HITs queue into the MTurk header on worker site.
// @author       M C Krish
// @version      1.5
// @match        https://www.mturk.com/*
// @match        https://worker.mturk.com/dashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396542/Header%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/396542/Header%20Menu.meta.js
// ==/UserScript==

// Worker Site - Dashboard & Earnings Page//
if ((/^https?:\/\/(www\.)?worker\.mturk\.com\/dashboard.*/.test(location.href))||(/^https?:\/\/(www\.)?worker\.mturk\.com\/earnings.*/.test(location.href))) {
           $(".nav.navbar-nav.hidden-xs-down").append('<li class="nav-item"><a class="nav-link" href="https://worker.mturk.com/tasks">HITs Queue</a></li>');
    $(".nav.navbar-nav.hidden-xs-down").append('<li class="nav-item"><a class="nav-link" href="https://worker.mturk.com/?finder_beta" target="_forker">HITs</a></li>');
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
