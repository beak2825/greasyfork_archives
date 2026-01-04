// ==UserScript==
// @name        ESOUI Changelog
// @match       *://www.esoui.com/downloads/*
// @description  Automatically opens Changelog Tab on ESOUI Addon pages (purpose is to go to the changelog when opening webpage from Minion)
// @run-at      document-start
// @grant       none
// @version 0.0.1.20220309033645
// @namespace https://greasyfork.org/users/884740
// @downloadURL https://update.greasyfork.org/scripts/441192/ESOUI%20Changelog.user.js
// @updateURL https://update.greasyfork.org/scripts/441192/ESOUI%20Changelog.meta.js
// ==/UserScript==

var oldUrlPath = window.location.pathname;

/*--- Test that "#changelog" is at end of URL, excepting any "hashes"
    or searches.
*/
if ( ! /\#changelog$/.test (oldUrlPath) ) {

    var newURL = window.location.protocol + "//"
                + window.location.host
                + oldUrlPath + "#changelog"
                + window.location.search
                + window.location.hash
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (newURL);
}