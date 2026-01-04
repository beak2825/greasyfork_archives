// ==UserScript==
// @name         Hacker News - Open in tabs
// @namespace    Stout
// @version      0.1
// @description  Open links in new tabs
// @author       Stout
// @license      MIT
// @match        https://news.ycombinator.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=news.ycombinator.com
// @downloadURL https://update.greasyfork.org/scripts/502790/Hacker%20News%20-%20Open%20in%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/502790/Hacker%20News%20-%20Open%20in%20tabs.meta.js
// ==/UserScript==

function rewriteAnchorElements(path) {
    var anchorElements = document.evaluate(path,
                                           document,
                                           null,
                                           XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);

    for (let i = 0; i < anchorElements.snapshotLength; ++i)
    {
        anchorElements.snapshotItem(i).target = '_blank';
    }
}

(function() {
    'use strict';

    rewriteAnchorElements("//table[@id='hnmain']//td[@class='title']/span[@class='titleline']/a");
    rewriteAnchorElements("//table[@id='hnmain']//td[@class='subtext']/span[@class='subline']/a[starts-with(@href, 'item?')]");
})();
