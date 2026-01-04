// ==UserScript==
// @name        Hackaday De-cartouche
// @namespace   http://hackaday.com/*
// @namespace   https://hackaday.com/*
// @description Replace asinine "[name]" tokens with "name"
// @include     http://hackaday.com/*
// @include     https://hackaday.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/392745/Hackaday%20De-cartouche.user.js
// @updateURL https://update.greasyfork.org/scripts/392745/Hackaday%20De-cartouche.meta.js
// ==/UserScript==

textNodes = document.evaluate("//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var searchRE = new RegExp('[\\[\\]]','gi');
var replace = '';

for (var i=0; i<textNodes.snapshotLength; i++)
{
var node = textNodes.snapshotItem(i);
node.data = node.data.replace(searchRE, replace);
}