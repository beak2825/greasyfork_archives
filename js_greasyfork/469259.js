// ==UserScript==
// @name        Redirect to compact reddit
// @description Redirects from regular reddit to the compact version
// @version     0.5
// @match       https://*.reddit.com/*
// @run-at      document-start
// @exclude     https://www.reddit.com/gallery/*
// @namespace https://userscripts.56k-modem.online
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469259/Redirect%20to%20compact%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/469259/Redirect%20to%20compact%20reddit.meta.js
// ==/UserScript==

//Thanks to U/Jellysandwich for line 34 to line 50
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
// ------------------------------------------------
// Change links that end in .compact to .i
// this prevents the redirect nonsense .compact -> desktop site -> .i
// so navigation is slightly faster overall
// ------------------------------------------------

document.addEventListener ("DOMContentLoaded", function(){

  // check all links on page
  // https://stackoverflow.com/questions/3871358/get-all-the-href-attributes-of-a-web-site/3871370#3871370
  var links = document.links;
  for(var i=0; i<links.length; i++) {
    if (links[i].href.endsWith('/.compact')) {
      links[i].href = links[i].href.replace('/.compact', '/.i');
    }
  }
});