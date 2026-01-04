// ==UserScript==
// @name         librospdfgratismundo.net replace link shorteners
// @version      1.0
// @description  Replace link shorteners with true download links
// @author       Rust1667
// @match        https://librospdfgratismundo.net/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=librospdfgratismundo.net
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/487656/librospdfgratismundonet%20replace%20link%20shorteners.user.js
// @updateURL https://update.greasyfork.org/scripts/487656/librospdfgratismundonet%20replace%20link%20shorteners.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all <a> elements with class "btn" and iterate over them
    document.querySelectorAll('a.btn').forEach(function(link) {
        // Check if the href attribute contains "librospdfgratismundo.net"
        if (link.href.includes('librospdfgratismundo.net')) {
            // Extract the URL after the "?url=" substring
            let encodedUrl = link.href.split('?url=')[1];
            // Decode the URL from base64
            let decodedUrl = atob(encodedUrl);
            // Update the href attribute with the decoded URL
            link.href = decodedUrl;
        }
    });
})();
