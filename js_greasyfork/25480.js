// ==UserScript==
// @name         4chan link fix
// @namespace    http://userscripts.org/users/tearshed
// @description  hiroshiMOOOOOOOOOOOOOOOOOT
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @version 0.0.1.20170126130036
// @downloadURL https://update.greasyfork.org/scripts/25480/4chan%20link%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/25480/4chan%20link%20fix.meta.js
// ==/UserScript==

var links,thisLink;
links = document.evaluate("//a[contains(@href, 'is.4chan')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);

    thisLink.href = thisLink.href.replace('is.4chan.org/',
                                          'i.4cdn.org/');
}
var links,thisLink;
links = document.evaluate("//a[contains(@href, 'is2.4chan')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);

    thisLink.href = thisLink.href.replace('is2.4chan.org/',
                                          'i.4cdn.org/');
}