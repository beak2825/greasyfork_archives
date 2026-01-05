// ==UserScript==
// @name          ao3 savior config
// @description   Config script for AO3 Savior userscript
// @namespace     ao3
// @include       http*://archiveofourown.org/*
// @grant         none
// @version       1.16
// @downloadURL https://update.greasyfork.org/scripts/28782/ao3%20savior%20config.user.js
// @updateURL https://update.greasyfork.org/scripts/28782/ao3%20savior%20config.meta.js
// ==/UserScript==



(function () {
  'use strict';

  /**** CONFIG ********************/
  window.ao3SaviorConfig = {
    // Edit this file to configure AO3 Savior, then ensure that both 'ao3 savior' and 'ao3 savior
    // config' userscripts are enabled in Tampermonkey/Greasemonkey. This lets you avoid having to
    // replace the config block within AO3 Savior whenever you update - since it's stored here in a
    // separate userscript, and you should only update this one manually.


    // Set to false if you don't want to see why works were hidden.
    showReasons: true,

    // Set to false if you don't want to see the expandable "This work is hidden!" boxes.
    showPlaceholders: true,

    // Set to true if you want to be alerted when visiting a blacklisted work from outside AO3
    alertOnVisit: false,

    // Exclude works with an author that exactly matches at least one term.
    authorBlacklist: ['Hated Author 1', 'smeyer'],

    // Excludes works with a title that matches at least one term. Use * for wildcard.
    titleBlacklist: ['The Catcher in the Rye', 'Sylvester And The Magic Pebble', 'Five times*'],

    // Exclude works with a tag that matches at least one term. Use * for wildcard.
    tagBlacklist: ['dobby', 'jar jar binks', '*mimes'],

    // Include works by these authors, even if they also match any of the blacklists.
    authorWhitelist: ['astolat'],

    // Include works matching these tags, even if they also match any of the blacklists.
    tagWhitelist: ['glitter'],

    // Exclude works with summaries that contain at least one term
    summaryBlacklist: ['horse-sized ducks', 'duck-sized horses', "bee's knees"]
  };
  /********************************/

}());
