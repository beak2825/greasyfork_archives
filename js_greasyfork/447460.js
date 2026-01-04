// ==UserScript==
// @name           Dragon Cave View links for AP
// @namespace      http://www.jenneth.com/greasemonkey/dragoncave/viewlinksforap
// @description    Adds a "View" link to all eggs on the abandoned page
// @include        *//dragcave.net/abandoned
// @version 0.0.1.20220705135516
// @downloadURL https://update.greasyfork.org/scripts/447460/Dragon%20Cave%20View%20links%20for%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/447460/Dragon%20Cave%20View%20links%20for%20AP.meta.js
// ==/UserScript==

var eggLinkSnapshot = document.evaluate("//a[contains(@href,'abandoned')]",
document.getElementById("middle"), null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0; i<eggLinkSnapshot.snapshotLength; i++) {
var viewLink = document.createElement('a');
    var string = eggLinkSnapshot.snapshotItem(i).href;
    var NewArray = new Array();
    var NewArray = string.split("/");
    var viewSection = NewArray[4];
viewLink.href = eggLinkSnapshot.snapshotItem(i).href.replace(/abandoned/,'lineage');
viewLink.appendChild(document.createTextNode(viewSection));
eggLinkSnapshot.snapshotItem(i).parentNode.appendChild(document.createElement('br'));
eggLinkSnapshot.snapshotItem(i).parentNode.appendChild(viewLink);
}