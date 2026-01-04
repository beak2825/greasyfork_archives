// ==UserScript==
// @name         Plex Review Hide
// @version      0.2
// @description  Hides reviews from Movie view
// @author       Xenomer
// @include      /^https?://[a-zA-Z0-9.]+:32400/web/index.html/
// @include      http*://app.plex.tv*
// @include      http*://plex.*
// @grant        none
// @namespace https://greasyfork.org/users/696176
// @downloadURL https://update.greasyfork.org/scripts/420035/Plex%20Review%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/420035/Plex%20Review%20Hide.meta.js
// ==/UserScript==

const log = (...l) => console.log('[REVIEWHIDE]', ...l);

let interval = setInterval((function() {
    'use strict';
    var xpath = "//div[text()='Reviews'][contains(@class, 'HubTitle-hubTitle')][not(contains(@style, 'hidden'))]/../..";
    var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(matchingElement && matchingElement.style.visibility !== 'hidden') {
        matchingElement.style.visibility = 'hidden';
        matchingElement.style.height = '0';
        matchingElement.style.margin = '0';
        log('hidden');
    }
}), 500);