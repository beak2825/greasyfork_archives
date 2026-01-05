// ==UserScript==
// @name	   FurkExt_Mandy
// @description    Furk direct download by Mandy Magic
// @include        http://www.furk.net/*
// @include        https://www.furk.net/*
// @include	   http://furk.net/*
// @include	   https://furk.net/*
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @version 0.0.1.20140520195549
// @namespace https://greasyfork.org/users/1584
// @downloadURL https://update.greasyfork.org/scripts/1298/FurkExt_Mandy.user.js
// @updateURL https://update.greasyfork.org/scripts/1298/FurkExt_Mandy.meta.js
// ==/UserScript==


			
var lianks = document.evaluate(
"//a[contains(@href, '/r/')]",
document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < lianks.snapshotLength; i++) {
var link = lianks.snapshotItem(i);
link.href = link.href.replace("/r/","/R/")
}