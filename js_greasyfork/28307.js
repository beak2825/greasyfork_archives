// ==UserScript==
// @name           Transit Forum Fixer
// @namespace      edzep.scripts
// @version        1.0.4
// @author         EdZep at HSX
// @description    Adds 'Unread' link for each thread with new content, on the Active Topics index page
// @include        http://*fordtransitusaforum.com/*active_topics
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/28307/Transit%20Forum%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/28307/Transit%20Forum%20Fixer.meta.js
// ==/UserScript==

// Start

(function() {
    'use strict';

    var findThreadLinks = document.evaluate("//a[@class='thread_title_link' and .//strong]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    var threadCount = findThreadLinks.snapshotLength;
    //GM_log(threadCount);

    for(var i=0; i<threadCount; i++) {
        var target = findThreadLinks.snapshotItem(i);
        var targetURL = target.getAttribute("href");

        var lastDot = targetURL.lastIndexOf('.');
        var unreadURL = targetURL.substring(0,lastDot) + "-new-post.html";

        target.outerHTML = target.outerHTML + "&nbsp;&bull;&nbsp;<a href='" + unreadURL + "'>Unread</a>";
    }

})();

// End