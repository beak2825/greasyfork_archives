// ==UserScript==
// @name         Redirect Modifier
// @namespace    http://silaspuma.github.io/silaspuma
// @version      0.5
// @description  Modify redirected URL based on a specific pattern
// @author       Silas Puterbaugh
// @match        https://ckreport.lisd.net/cgi-bin/blockpage/lisdnl.cgi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492947/Redirect%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/492947/Redirect%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the separate URL template
    const separateURL = "https://api.ready.mobi/api/v1/prism/proxy?_=-7877237838868219284&prismid=2241251&device=0&url=";

    // Get the redirected URL from the CKReport page
    const redirectedURL = decodeURIComponent(new URLSearchParams(window.location.search).get('RAW'));

    // Construct the modified URL by appending the redirected URL to the separate URL template
    const modifiedURL = separateURL + encodeURIComponent(redirectedURL);

    // Redirect the browser to the modified URL
    window.location.href = modifiedURL;
})();