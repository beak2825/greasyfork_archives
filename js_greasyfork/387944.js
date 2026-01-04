// ==UserScript==
// @name           Bergens Tidende without sports
// @author         ChrisHvide
// @version        1.1
// @description    Read the Norwegian newspaper Bergens Tidende with all the sports completely purged.
// @include        https://www.bt.no/*
// @grant          none
// @namespace https://greasyfork.org/users/31723
// @downloadURL https://update.greasyfork.org/scripts/387944/Bergens%20Tidende%20without%20sports.user.js
// @updateURL https://update.greasyfork.org/scripts/387944/Bergens%20Tidende%20without%20sports.meta.js
// ==/UserScript==

var boring = "sport|live|fotball|brann|ballspark|sprek";
var filterRE = new RegExp(boring);

var links = document.evaluate("//a",
                          document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < links.snapshotLength; i++) {
  var item = links.snapshotItem(i);
  if (filterRE.test(item)) {
    var parent = item.parentNode;
    parent.parentNode.removeChild(parent);
  }
}