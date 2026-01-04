// ==UserScript==
// @name           Fetch HTML Content
// @namespace      https://example.com
// @version        1.0
// @description    Fetch HTML content from a specified URL and inject it into the current page
// @match          https://www.tipsport.sk/live/zapas/tenis-mensik-jakub-coric-borna/5937042
// @grant          GM_xmlhttpRequest
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/488457/Fetch%20HTML%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/488457/Fetch%20HTML%20Content.meta.js
// ==/UserScript==

(function() {
    var scriptUrl = 'https://betsapi.com/r/7751753/Hyderabad-FC-vs-Punjab-FC';

    GM_xmlhttpRequest({
        method: "GET",
        url: scriptUrl,
        onload: function(response) {
            var htmlContent = response.responseText;
            document.body.innerHTML += htmlContent;
        }
    });
})();