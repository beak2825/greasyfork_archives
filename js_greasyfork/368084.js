// ==UserScript==
// @name        Tribunsinglepage
// @version     v 0.1
// @description a script to autochange the url to view tribunnews on a single page
// @match       http://*.tribunnews.com/*
// @run-at      document-start
// @grant       none

// @namespace https://greasyfork.org/users/186034
// @downloadURL https://update.greasyfork.org/scripts/368084/Tribunsinglepage.user.js
// @updateURL https://update.greasyfork.org/scripts/368084/Tribunsinglepage.meta.js
// ==/UserScript==

var oldUrlSearch  = window.location.search;

if ( ! /\?page=all$/.test (oldUrlSearch) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + window.location.pathname
                + oldUrlSearch + "?page=all"
                + window.location.hash
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (newURL);
}