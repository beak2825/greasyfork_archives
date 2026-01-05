// ==UserScript==
// @name       DeQualiter Home to Latest
// @version    0.2
// @description  Redirects DeQualiter logo to latest
// @match      http://forum.dequaliter.com/*
// @copyright  2016
// @namespace https://greasyfork.org/users/54481
// @downloadURL https://update.greasyfork.org/scripts/21331/DeQualiter%20Home%20to%20Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/21331/DeQualiter%20Home%20to%20Latest.meta.js
// ==/UserScript==

var links,thisLink;
links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);

    thisLink.href = thisLink.href.replace(RegExp('http://forum.dequaliter.com'),
                                      'http://forum.dequaliter.com/latest');
}