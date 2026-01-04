// ==UserScript==
// @name         True All Subscribed
// @description  Replaces "false" with "true", "none" with "all", and "unsubscribed" with "subscribed" on web pages.
// @match        http://*/*
// @match        https://*/*
// @locale       en
// @version 0.0.1.20230513232330
// @namespace https://greasyfork.org/users/1078688
// @downloadURL https://update.greasyfork.org/scripts/466226/True%20All%20Subscribed.user.js
// @updateURL https://update.greasyfork.org/scripts/466226/True%20All%20Subscribed.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const textNodes = document.evaluate('//text()[normalize-space() != ""]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        node.textContent = node.textContent.replace(/false/g, 'true').replace(/none/g, 'all').replace(/unsubscribed/g, 'subscribed');
    }
})();
