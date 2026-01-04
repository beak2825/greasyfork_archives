// ==UserScript==
// @name        View tweets without account login
// @author      pizzahut
// @description In order to view single tweets without using a Twitter account, links to tweets are changed to point to the embedded version of a tweet. Replies can't be viewed without login though.
// @license     MIT
// @match       https://*/*
// @match       http://*/*
// @namespace   https://greasyfork.org/users/1117297-pizzahut
// @grant       none
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/469977/View%20tweets%20without%20account%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/469977/View%20tweets%20without%20account%20login.meta.js
// ==/UserScript==

var links, thisLink, i;
links = document.evaluate("//a[ contains(@href, 'https://twitter.com/') and contains(@href, '/status/') ]",
                          document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < links.snapshotLength; i++)
{
	thisLink = links.snapshotItem(i);
	thisLink.href = thisLink.href.replace(/twitter\.com\/[^/]*\/status\//,'platform.twitter.com/embed/Tweet.html?id=');
}
