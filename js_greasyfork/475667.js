// ==UserScript==
// @name        FMHY base64 Automatic Decoder
// @description it decodes all base64 links in FMHY
// @match       https://fmhy.pages.dev/base64/
// @grant       none
// @version     1.0
// @author      SH3LL
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/475667/FMHY%20base64%20Automatic%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/475667/FMHY%20base64%20Automatic%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all <p> elements on the page
    var paragraphs = document.getElementsByTagName('p');

    // Iterate over each <p> element
    for (var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];

        // Get the <code> element inside the <p> element
        var codeElement = paragraph.querySelector('code');

        // If a <code> element exists, decode its Base64 encoded text
        if (codeElement) {
            var encodedText = codeElement.textContent;
            var decodedText = atob(encodedText);
            codeElement.textContent = decodedText;
        }
    }
})();