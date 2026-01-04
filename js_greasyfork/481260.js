// ==UserScript==
// @name        This is a Local Shop for Local People
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay.co.uk/sch/i.html
// @grant       none
// @version     1.0
// @author      madra.net
// @license     GNU GPLv3
// @description A simple script to reload eBay UK listing pages to only show you results from eBay UK.
// Annoyingly, no matter how many times you select "UK Only"  eBay defaults to showing international
// listings each time you search. This script will reload the search listing result page and append the
// appropriate parameter to the URL to show onky UK results. Obviously only tested with eBay UK. Should
// be trivial enough to adapt to your own local eBay.
// @downloadURL https://update.greasyfork.org/scripts/481260/This%20is%20a%20Local%20Shop%20for%20Local%20People.user.js
// @updateURL https://update.greasyfork.org/scripts/481260/This%20is%20a%20Local%20Shop%20for%20Local%20People.meta.js
// ==/UserScript==

/* -- Store current URL */
var oldURL  = window.location;

/*--- Test if local results only parameter is in current URL. ie "&LH_PrefLoc=1" */
if ( ! /&LH_PrefLoc=1/.test (oldURL) ) {

    /*-- if not, append it */
    var newURL  = window.location+ "&LH_PrefLoc=1";
    
    /*-- and reload window with updated URL. */
    window.location.replace (newURL);
}