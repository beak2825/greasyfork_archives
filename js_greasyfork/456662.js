// ==UserScript==
// @name         Google URL formatter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes the lengthy Google.com URL parameters and get a clean Google URL.
// @author       You
// @match        https://google.com/search*
// @match        https://www.google.com/search*

// @require      https://unpkg.com/url-parse@1.5.1/dist/url-parse.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js

// @run-at       document-idle
// @noframes

// @license mit
// @downloadURL https://update.greasyfork.org/scripts/456662/Google%20URL%20formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/456662/Google%20URL%20formatter.meta.js
// ==/UserScript==


(async function(){

    console.log(moment().format(), "[Google URL formatter]");

    console.log(moment().format(), `[Google URL formatter] old url: ${document.location.href}`);

    console.log(moment().format(), "[Google URL formatter] parsing...");
    url = URLParse(document.location.href , true )
    url.query = _.omit(url.query, ["sourceid", "ie", "oq", "aqs", "gs_lcp", "ved", "uact", "sclient", "ei", "sxsrf" ]);
    // url.toString()
    url.host = ""
    url.protocol = ""
    url.pathname = ""
    url.slashes = false

    console.log(moment().format(), "[Google URL formatter] modifying...");
    window.history.replaceState(null, null, url.toString());
    // window.history.replaceState(null, null, '?q=hoge');

    console.log(moment().format(), `[Google URL formatter] new url: ${document.location.href}`);

})();
