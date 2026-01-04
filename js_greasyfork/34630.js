// ==UserScript==
// @name        Tom's Hardware Print View
// @namespace   http://elvencraft.com/greasemonkey
// @description Displays Tom's Hardware articles in print view.
// @match       *://*.tomshardware.com/*
// @run-at      document-start
// @version     2017.11.16
// Tested using Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/34630/Tom%27s%20Hardware%20Print%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/34630/Tom%27s%20Hardware%20Print%20View.meta.js
// ==/UserScript==

(function ()
{
  function changeLinks()
  {
    if (!location.href.match('/print/')) {
      var links = document.evaluate("//a[contains(@href, '/reviews/')]",
        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var index = 0; index < links.snapshotLength; index++)
        links.snapshotItem(index).href = links.snapshotItem(index).href
        .replace('/reviews/', '/print/') .replace(',', ',reviews-');
    }
  }
  unsafeWindow.print = function () {}; // disable window.print();
  document.addEventListener("DOMContentLoaded", changeLinks);
})();
