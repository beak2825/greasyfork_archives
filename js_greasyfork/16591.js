// ==UserScript==
// @name        MassDrop Automatic Guest Mode
// @namespace   Symmetry
// @match       *://*.massdrop.com/*
// @run-at      document-start
// @description When opening a Massdrop URL, check to see if "?mode=guest_open" is appended to the URL, and if not, append it. This will allow unregistered users to browse Massdrop.
// @version 0.0.1.20160128061648
// @downloadURL https://update.greasyfork.org/scripts/16591/MassDrop%20Automatic%20Guest%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/16591/MassDrop%20Automatic%20Guest%20Mode.meta.js
// ==/UserScript==

/*--- Test that "?mode=guest_open" is at end of URL, excepting any "hashes"
    or searches.
*/
if ( ! /mode=guest_open/.test(window.location.search) ) {

    var newURL  = window.location.protocol + "//"
                + window.location.host
                + window.location.pathname + "?mode=guest_open"
                + window.location.search
                + window.location.hash
                ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (newURL);
}