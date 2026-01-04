// ==UserScript==
// @name         maxcine.net link shortener bypass
// @version      1.0
// @description  Redirects to URL the destination URL bypassing the link shorteners
// @author       Rust1667
// @match        https://links.cuevana.ac/short/*
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/485671/maxcinenet%20link%20shortener%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/485671/maxcinenet%20link%20shortener%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the line containing "document.getElementById('contador').href = 'htt"
    var lines = document.documentElement.innerHTML.split('\n');
    var targetLine = lines.find(line => line.includes("document.getElementById('contador').href = 'htt"));

    if (targetLine) {
        // Extract the URL
        var startIndex = targetLine.indexOf("http");
        var endIndex = targetLine.indexOf("'", startIndex);
        var extractedUrl = targetLine.substring(startIndex, endIndex);

        // Check if '?s=' exists in the URL
        if (extractedUrl.includes('?s=')) {
            var sIndex = extractedUrl.indexOf('?s=') + 3; // 3 is the length of '?s='
            extractedUrl = extractedUrl.substring(sIndex);
        }

        // Redirect to the extracted URL
        window.location.href = extractedUrl;
    } else {
        console.log("Target line not found.");
    }
})();