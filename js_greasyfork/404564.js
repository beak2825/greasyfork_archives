// ==UserScript==
// @name         "click allow" bypasser for adfly links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*site=adfly*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/404564/%22click%20allow%22%20bypasser%20for%20adfly%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/404564/%22click%20allow%22%20bypasser%20for%20adfly%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = new URL(document.URL); // Get the current URL
    var dest = url.searchParams.get("dest"); // get the parameter called dest ( it's an encoded URL that corresponds to the destination link [ usually the download link ] )
    var decoded = decodeURI(dest) // Decode the URL
    $('body').append("<div style='width: 100%'><a target='_blank'href='" + decoded + "' \
                     style='display: block; margin: auto !important; font-size: large !important; width:50%; text-align: center; background:white !important; color: black !important'>\
                     Download using the workaround script\
                     </a></div>"); // Append a button with the decoded link as its reference to the body
    // fuck adfly
})();