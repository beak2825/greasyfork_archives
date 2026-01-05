// ==UserScript==
// @name           TV Guide - Remove Spoilers
// @namespace      floyd.scripts
// @version        1.0.0
// @author         Another Floyd at Amazon.com
// @description    Removes the video display row, which often contains spoilerish click-bait
// @match          http://www.tvguide.com/listings/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/25187/TV%20Guide%20-%20Remove%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/25187/TV%20Guide%20-%20Remove%20Spoilers.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var findVideoContainer = document.evaluate("//div[@class='listings-video-container row']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var target = findVideoContainer.snapshotItem(0);
    target.parentNode.removeChild(target);
})();
