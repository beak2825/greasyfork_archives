// vim: ts=4 sts=4 sw=4 et
// ==UserScript==
// @name           Thrive Show Subcategory Names
// @namespace      www.arthaey.com
// @description    Shows the subcategory name of a transaction as a tooltip
// @include        https://www.justthrive.com/*
//
// Backed up from http://userscripts.org/scripts/review/38014
// Last updated on 2008-12-03
// @version 0.0.1.20140612212415
// @downloadURL https://update.greasyfork.org/scripts/2413/Thrive%20Show%20Subcategory%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/2413/Thrive%20Show%20Subcategory%20Names.meta.js
// ==/UserScript==

window.addEventListener("load", function() {

var transactions = document.evaluate(
    "//li[contains(@class, 'tagIcons')]/h6",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

var transaction;
for (var i = 0; i < transactions.snapshotLength; i++) {
    transaction = transactions.snapshotItem(i);
    transaction.title = transaction.textContent;
}

}, true);
