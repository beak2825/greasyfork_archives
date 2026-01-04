// ==UserScript==
// @name        Large Twitter images
// @author      pizzahut
// @description Links to small Twitter images are changed to point to the large size of the image.
// @license     MIT
// @match       https://*/*
// @match       http://*/*
// @namespace   https://greasyfork.org/users/1117297-pizzahut
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/469979/Large%20Twitter%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/469979/Large%20Twitter%20images.meta.js
// ==/UserScript==

var links, thisLink, i;
links = document.evaluate("//a[ contains(@href, 'https://pbs.twimg.com/') and contains(@href, 'name=small') ]",
                          document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < links.snapshotLength; i++)
{
	thisLink = links.snapshotItem(i);
	thisLink.href = thisLink.href.replace(/name=small/,'name=large');
}
