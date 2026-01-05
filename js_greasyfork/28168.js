/* Modified version of the code a this Stack Overflow article:
http://stackoverflow.com/questions/16065937/changing-a-pages-url-parameters
*/
// ==UserScript==
// @name        AV Club Permalink
// @namespace   _pc
// @description:en adds ?permalink=true to AV Club articles and gets old Newswire experience back
// @match       *://*.avclub.com/article*
// @run-at      document-start
// @version 0.0.1.20170316001157
// @description adds ?permalink=true to AV Club articles and gets old Newswire experience back
// @downloadURL https://update.greasyfork.org/scripts/28168/AV%20Club%20Permalink.user.js
// @updateURL https://update.greasyfork.org/scripts/28168/AV%20Club%20Permalink.meta.js
// ==/UserScript==

var oldUrlSearch  = window.location.search;

/*--- Test that "?permalink=true" is at end of URL, excepting any "hashes"
or searches.
*/
if ( ! /\?permalink=true/.test (oldUrlSearch) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + window.location.pathname
                + oldUrlSearch + "?permalink=true"
                + window.location.hash
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (newURL);
}