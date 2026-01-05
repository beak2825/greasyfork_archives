// ==UserScript==
// @name           Fix links
// @include        https://www.flashback.org/*
// @version 0.0.1.20140604192605
// @namespace https://greasyfork.org/users/2463
// @description Fixar utgående länkar på Flashback
// @downloadURL https://update.greasyfork.org/scripts/2095/Fix%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/2095/Fix%20links.meta.js
// ==/UserScript==

(function () {

var leave = "https://www.flashback.org/leave.php?u=";

$x("//a[starts-with(@href, '" + leave + "')]").forEach(function (element)
{
GM_log("In loop");
	element.href = unescape(element.href.replace(leave, "")).replace(/&amp;/gi, "&");
	if (!element.href.match(/:\/\//))	// No protocol, add http
		element.href = "http://" + element.href;
});



function $x(expression, context) {
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(expression, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}

})();