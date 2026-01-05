// ==UserScript==
// @name        MAL See All Discussions
// @namespace   http://greasyfork.org/users/5975
// @include     /^(http|https):\/\/myanimelist\.net\/(anime|manga)(\.php\?id=|\/)\d+/
// @description Replaces "More discussions" link on anime and manga entries with "All discussions" link
// @version     1.0.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11129/MAL%20See%20All%20Discussions.user.js
// @updateURL https://update.greasyfork.org/scripts/11129/MAL%20See%20All%20Discussions.meta.js
// ==/UserScript==

var moreLink = document.evaluate("//a[contains(@href, '/anime/') or contains(@href, '/manga/')][contains(@href, '/forum')][contains(., 'More discussions') or contains(., 'Forum')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < moreLink.snapshotLength; i++) {
    var linkParts = moreLink.snapshotItem(i).href.match(/\/\/myanimelist.net\/(anime|manga)\/([0-9]+)\//);
    moreLink.snapshotItem(i).href = "http://myanimelist.net/forum/?" + linkParts[1] + "id=" + linkParts[2];
    moreLink.snapshotItem(i).textContent = "All discussions";
}