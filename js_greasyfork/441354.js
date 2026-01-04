// ==UserScript==
// @name     readReceiptDeny
// @description Automatically refuse to send read receipt in Google workspace
// @version  1
// @grant    none
// @license GPL-3.0-or-later
// @match   https://mail.google.com/*
// @namespace https://greasyfork.org/users/885979
// @downloadURL https://update.greasyfork.org/scripts/441354/readReceiptDeny.user.js
// @updateURL https://update.greasyfork.org/scripts/441354/readReceiptDeny.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = {
    childList: true,
    subtree: true,
};
 
myObserver.observe(document, obsConfig);
 
function mutationHandler(mutationRecords) {
	for (const mutation of mutationRecords) {
        processNodes(mutation.addedNodes);
    }
}
 
function processNodes(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.tagName != "BUTTON") {
            return;
        }
        if (node.getAttribute("name") == "Later") {
            var text = node.parentNode.parentNode.innerText;
            if (text.match(/read receipts requested/i)) {
                node.click();
            }
        }
    }
}