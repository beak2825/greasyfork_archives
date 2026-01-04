// ==UserScript==
// @name         天使动漫防社死
// @namespace    https://www.tsdm39.com/
// @version      1.1
// @description  防止弹出页面社死
// @author       azwhikaru
// @include     http*://www.tsdm39.com*
// @match       http://www.tsdm39.com
// @grant        none
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/495390/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E9%98%B2%E7%A4%BE%E6%AD%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/495390/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E9%98%B2%E7%A4%BE%E6%AD%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adLinks = document.evaluate("//div[@class='npadv']/a", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < adLinks.snapshotLength; i++) {
        const link = adLinks.snapshotItem(i);
        link.removeAttribute("href");
    }

    const qdSmiles = document.evaluate("//ul[@class='qdsmile']/li//a[@href]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0; i < qdSmiles.snapshotLength; i++) {
        const link = qdSmiles.snapshotItem(i);
        link.removeAttribute("href");
    }

})();