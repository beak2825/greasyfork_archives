// ==UserScript==
// @name			Immortal Seed Torrent Linker
// @description		Relinks "details" links on Immortalseed to the actual torrent
// @version			1.0
// @grant			none
// @include			http*://immortalseed.me/*
// @namespace https://greasyfork.org/users/7864
// @downloadURL https://update.greasyfork.org/scripts/377163/Immortal%20Seed%20Torrent%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/377163/Immortal%20Seed%20Torrent%20Linker.meta.js
// ==/UserScript==


var allLinks, thisLink;
allLinks = document.evaluate(
    "//a[contains(@href,'details')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < allLinks.snapshotLength; i++) {
    thisLink = allLinks.snapshotItem(i);
	thisLink.href = thisLink.href.replace("details", "download");
    console.log(thisLink);
}