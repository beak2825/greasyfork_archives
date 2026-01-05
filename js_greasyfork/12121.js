// ==UserScript==
// @name MagicPowers
// @namespace http://userscripts.org
// @description Replace "intangibles" with magic powers
// @include * 
// @grant none
// @version 0.0.1.20150901211600
// @downloadURL https://update.greasyfork.org/scripts/12121/MagicPowers.user.js
// @updateURL https://update.greasyfork.org/scripts/12121/MagicPowers.meta.js
// ==/UserScript==
textNodes = document.evaluate('//text()', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var searchRE = new RegExp('intangibles', 'gi');
var replace = 'magic powers';
for (var i = 0; i < textNodes.snapshotLength; i++) {
  var node = textNodes.snapshotItem(i);
  node.data = node.data.replace(searchRE, replace);
}