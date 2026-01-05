// ==UserScript==
// @name           Jessamyn's Star
// @namespace      http://example.com/jessamyns_star
// @description    Bring Jessamyn's star back to Metafilter
// @include        http://metafilter.com/*
// @include        http://*.metafilter.com/*
// @version 0.0.1.20140524193823
// @downloadURL https://update.greasyfork.org/scripts/1612/Jessamyn%27s%20Star.user.js
// @updateURL https://update.greasyfork.org/scripts/1612/Jessamyn%27s%20Star.meta.js
// ==/UserScript==

var jessamynLinks = document.evaluate(
   "//a[@href='http://www.metafilter.com/user/292' or @href='/user/292']", document, null,
   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   
for (var i = 0; i < jessamynLinks.snapshotLength; i++) {
   var link = jessamynLinks.snapshotItem(i);
   var star = document.createElement('span');
   star.setAttribute('style', 'color: #cccc00;');
   star.innerHTML += "&#9733;";
   link.appendChild(star);
}
