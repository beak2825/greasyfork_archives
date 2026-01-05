// ==UserScript==
// @name iPmart Forum LinkDecode Fixer
// @namespace dc
// @description Fixes the redirection problem on linkdecode.com urls via AdsBypasser
// @include http://www.ipmart-forum.com/*
// @exclude http://hideref.de/
// @version 1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/11929/iPmart%20Forum%20LinkDecode%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/11929/iPmart%20Forum%20LinkDecode%20Fixer.meta.js
// ==/UserScript==

var links,thisLink;
links = document.evaluate("//a[@href]",
document,
null,
XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
null);
for (var i=0;i<links.snapshotLength;i++) {
var thisLink = links.snapshotItem(i);

thisLink.href = thisLink.href.replace('http://www.linkdecode.com/',
'http://hideref.de/?http://www.linkdecode.com/');
}