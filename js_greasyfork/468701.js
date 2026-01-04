// ==UserScript==
// @name         AutoActivateLikestCodes
// @license MIT
// @namespace    http://example.com
// @version      1.0
// @description  Converts Likest codes into hyperlinks on pages for API activation
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468701/AutoActivateLikestCodes.user.js
// @updateURL https://update.greasyfork.org/scripts/468701/AutoActivateLikestCodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A function that converts a key to a hyperlink
    function encodeCoupon(coupon) {
        return 'http://likest.ru/api/coupons.use?coupons=' + coupon;
    }

    // Find all texts with keys of type ****-****-****-****-****-****-****-****
    var couponRegex = /[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/g;
    var textNodes = document.evaluate("//text()[normalize-space(.) != '']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var text = node.textContent;

        // Replace the key text with a hyperlink
        var encodedText = text.replace(couponRegex, function(coupon) {
            return '<a href="' + encodeCoupon(coupon) + '">' + coupon + '</a>';
        });

        // Update the node content
        if (encodedText !== text) {
            var span = document.createElement('span');
            span.innerHTML = encodedText;
            node.parentNode.replaceChild(span, node);
        }
    }
})();