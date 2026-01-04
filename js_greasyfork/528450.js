// ==UserScript==
// @name         Remove Quora Home Feed
// @version      1.0
// @description  Removes the algorithmic home feed from Quora's homepage
// @match        https://www.quora.com/
// @icon         https://www.quora.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/528450/Remove%20Quora%20Home%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/528450/Remove%20Quora%20Home%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Target the specific element using XPath
    const feed = document.evaluate(
        '/html/body/div[2]/div/div[2]/div/div[3]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;

    if (feed) feed.remove();
})();