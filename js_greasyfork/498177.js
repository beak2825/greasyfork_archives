// ==UserScript==
// @name        Kaplan sözlük sabit başlık kaldırma scripti
// @namespace   Violentmonkey Scripts
// @match       https://www.kaplansozluk.com/*
// @grant       none
// @version     1.1
// @author      -
// @description 6/17/2024, 5:27:38 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498177/Kaplan%20s%C3%B6zl%C3%BCk%20sabit%20ba%C5%9Fl%C4%B1k%20kald%C4%B1rma%20scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/498177/Kaplan%20s%C3%B6zl%C3%BCk%20sabit%20ba%C5%9Fl%C4%B1k%20kald%C4%B1rma%20scripti.meta.js
// ==/UserScript==

setInterval(function() {
    var spans = document.querySelectorAll('span');
    spans.forEach(function(span) {
        if (span.textContent.includes("kısa ara")) {
            var aElement = span.closest('a');
            if (aElement) {
                var divElement = aElement.closest('div');
                if (divElement) {
                    divElement.remove();
                }
            }
        }
    });
}, 1000);
