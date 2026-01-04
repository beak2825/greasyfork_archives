// ==UserScript==
// @name        Größere Avatare für das Heise-Forum
// @author      pizzahut
// @description Die kleinen Avatar-Bilder werden gegen größere ausgetauscht.
// @license     MIT
// @match       https://www.heise.de/forum/heise-online/Kommentare/*
// @namespace   https://greasyfork.org/users/1117297-pizzahut
// @grant       none
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/538649/Gr%C3%B6%C3%9Fere%20Avatare%20f%C3%BCr%20das%20Heise-Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/538649/Gr%C3%B6%C3%9Fere%20Avatare%20f%C3%BCr%20das%20Heise-Forum.meta.js
// ==/UserScript==
var items, thisItem, i;
items = document.evaluate("//img[ contains(@src, '/imagine/') and contains(@src, '/preview/') ]",
  document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (i = 0; i < items.snapshotLength; i++)
{
	thisItem = items.snapshotItem(i);
	thisItem.src = thisItem.src.replace(/\/preview\//,'/gallery/');
    thisItem.style = "max-width: 122px !important;"
}
