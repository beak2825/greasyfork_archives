// ==UserScript==
// @name Jeff Zero is Florida Man
// @description Replace "Florida Man" with "Jeff Zero"
// @include http://*
// @version 0.0.1.20150716045501
// @namespace https://greasyfork.org/users/13344
// @downloadURL https://update.greasyfork.org/scripts/11001/Jeff%20Zero%20is%20Florida%20Man.user.js
// @updateURL https://update.greasyfork.org/scripts/11001/Jeff%20Zero%20is%20Florida%20Man.meta.js
// ==/UserScript==
(function doStuff()
{
    textNodes = document.evaluate(
"//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var searchRE = new RegExp('florida man','gi');
var replace = 'Jeff Zero';
for (var i=0;i<textNodes.snapshotLength;i++) {
var node = textNodes.snapshotItem(i);
node.data = node.data.replace(searchRE, replace); 
}
}());
