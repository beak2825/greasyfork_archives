// ==UserScript==
// @name         angewNoEPDF
// @namespace    no
// @version      0.025
// @description  To rewrite the link end by pdf
// @author       fanll
// @match        http://onlinelibrary.wiley.com/*
// @match        https://onlinelibrary.wiley.com/*
// @match        https://www.onlinelibrary.wiley.com/*
// @match        https://pericles.pericles-prod.literatumonline.com/*
// @match        https://chemistry-europe.onlinelibrary.wiley.com/*
// @match        https://onlinelibrary.wiley.com/doi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31526/angewNoEPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/31526/angewNoEPDF.meta.js
// ==/UserScript==

var links;
links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i=0;i<links.snapshotLength;i++) {
    var nopdfLink = links.snapshotItem(i);

    nopdfLink.href = nopdfLink.href.replace(/epdf/i, 'pdf');

}