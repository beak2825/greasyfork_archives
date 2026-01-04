// ==UserScript==
// @name        Dragcave code monitor
// @namespace   http://localhost
// @description Show codes for you code lovers.
// @include     *//dragcave.net/locations/*
// @version     1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/447461/Dragcave%20code%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/447461/Dragcave%20code%20monitor.meta.js
// ==/UserScript==
var eggLinkSnapshot = document.evaluate("//a[contains(@href,'get')]",
document.getElementById("middle"), null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i=0; i<eggLinkSnapshot.snapshotLength; i++) {
var viewLink = document.createElement('a');
    var string = eggLinkSnapshot.snapshotItem(i).href;
    var NewArray = new Array();
    var NewArray = string.split("/");
    var viewSection = NewArray[4];
    viewLink.href = eggLinkSnapshot.snapshotItem(i).href .replace(/get/,'lineage');
viewLink.appendChild(document.createTextNode(viewSection));
eggLinkSnapshot.snapshotItem(i).parentNode.appendChild(document.createElement('br'));
eggLinkSnapshot.snapshotItem(i).parentNode.appendChild(viewLink);
}