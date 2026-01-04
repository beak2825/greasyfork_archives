// ==UserScript==
// @name        Redirect to compact reddit
// @description Redirects from regular reddit to the compact version
// @version     0.3
// @match       https://*.reddit.com/*
// @run-at      document-start
// @namespace https://userscripts.56k-modem.online
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466865/Redirect%20to%20compact%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/466865/Redirect%20to%20compact%20reddit.meta.js
// ==/UserScript==

//Thanks to people at http://stackoverflow.com/questions/10675049/
//Only works with a secure (HTTPS) connection to Reddit. Download
//HTTPS Everywhere at https://www.eff.org/https-everywhere
//Restored from http://web.archive.org/web/*/https://userscripts.org/scripts/show/133891

var oldUrlPath = window.location.pathname;

/*--- Test that ".compact" is at end of URL, excepting any "hashes"
    or searches.
*/
if ( ! /\.i$/.test (oldUrlPath) ) {

    var newURL = window.location.protocol + "//"
               + window.location.hostname
               + oldUrlPath + ".i"
               + window.location.search
               + window.location.hash
               ;
    /*-- replace() puts the good page in the history instead of the
        bad page.
    */
    window.location.replace (newURL);
}
