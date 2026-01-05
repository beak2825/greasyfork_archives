// Author: epost72
//
// ==UserScript==
// @name           Flashback Ultimate Ignore
// @namespace      A
// @include        https://www.flashback.org/*
// @version 0.0.1.20140604192605
// @description Ignorera moderatorer och användare helt
// @downloadURL https://update.greasyfork.org/scripts/2094/Flashback%20Ultimate%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/2094/Flashback%20Ultimate%20Ignore.meta.js
// ==/UserScript==

var ignoreUsernames = ["Schlesien"];

//             "Schlesien", "Schlesien", "Schlesien"    

$x("//a[contains(@class, 'bigusername') and (contains(child::text(), '" + ignoreUsernames.join("') or contains(child::text(), '") + "'))]").forEach(function(e)
{
    e.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
});

function $x(expression, context) {
  if (!context) context = document;
  var i, arr = [], xpr = document.evaluate(expression, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
  return arr;
}