// ==UserScript==
// @name          custom ao3 savior config
// @description   personal ao3 savior Config script
// @namespace     ao3
// @include       http*://archiveofourown.org/*
// @grant         none
// @version       1.16
// @downloadURL https://update.greasyfork.org/scripts/464004/custom%20ao3%20savior%20config.user.js
// @updateURL https://update.greasyfork.org/scripts/464004/custom%20ao3%20savior%20config.meta.js
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
    showReasons: false,
 
    // Set to false if you don't want to see the expandable "This work is hidden!" boxes.
    showPlaceholders: false,
 
    // Set to true if you want to be alerted when visiting a blacklisted work from outside AO3
    alertOnVisit: true,
 
    // Exclude works with an author that exactly matches at least one term.
    authorBlacklist: ['J.K. Rowling', 'Stephanie Meyer'],
 
    // Excludes works with a title that matches at least one term. Use * for wildcard.
    titleBlacklist: ['Five times*'],
 
    // Exclude works with a tag that matches at least one term. Use * for wildcard.
    tagBlacklist: ['Millions Knives/Vash the Stampede', 'incest’, ‘brocon’, Millions Knives/Vash the Stampede*', '* Millions Knives/Vash the Stampede'],
 
    // Include works by these authors, even if they also match any of the blacklists.
    authorWhitelist: [''],
 
    // Include works matching these tags, even if they also match any of the blacklists.
    tagWhitelist: [''],
 
    // Exclude works with summaries that contain at least one term
    summaryBlacklist: ['incest']
  };
  /********************************/
 
}());