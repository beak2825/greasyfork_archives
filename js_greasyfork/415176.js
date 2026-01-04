// ==UserScript==
// @name         AliExpress Price range eliminator
// @version      0.1
// @description  Hides products with a price range in AliExpress search results and leaves only products with a single price
// @author       ms93
// @match        https://*.aliexpress.com/wholesale*
// @grant        none
// @namespace https://greasyfork.org/users/700037
// @downloadURL https://update.greasyfork.org/scripts/415176/AliExpress%20Price%20range%20eliminator.user.js
// @updateURL https://update.greasyfork.org/scripts/415176/AliExpress%20Price%20range%20eliminator.meta.js
// ==/UserScript==

document.addEventListener('DOMNodeInserted', function() {
    'use strict';
    var iterator = document.evaluate (
        '//span[@class="price-current" and contains(./text(), "-")]/ancestor::li[1]',
        document.documentElement,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
    );

    var targetNode = iterator.iterateNext();
    while (targetNode) {
        targetNode.style.display = "none";
        targetNode = iterator.iterateNext();
    }
})();