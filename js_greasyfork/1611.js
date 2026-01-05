// ==UserScript==
// @name           Embiggen the Smallest Metafilter
// @namespace      http://example.com/embiggen_the_smallest_metafilter
// @description    Mouse over small text on Metafilter to embiggen it.
// @include        http://metafilter.com/*
// @include        http://*.metafilter.com/*
// @version 0.0.1.20140524193823
// @downloadURL https://update.greasyfork.org/scripts/1611/Embiggen%20the%20Smallest%20Metafilter.user.js
// @updateURL https://update.greasyfork.org/scripts/1611/Embiggen%20the%20Smallest%20Metafilter.meta.js
// ==/UserScript==

var smallStuff = document.evaluate(
   "//small", document, null,
   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   
for (var i = 0; i < smallStuff.snapshotLength; i++) {
   var smallThing = smallStuff.snapshotItem(i);
   smallThing.addEventListener('mouseover', onSmallThingMouseover, false);
}

function onSmallThingMouseover(ev) {
   this.style.fontSize = '100%';
}
