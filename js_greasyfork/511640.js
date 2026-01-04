// ==UserScript==
// @name         Replace Y/N
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace (y/n) with your name
// @author       You
// @match        *://www.wattpad.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511640/Replace%20YN.user.js
// @updateURL https://update.greasyfork.org/scripts/511640/Replace%20YN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name = prompt("Enter your name:");
    if (name) {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while (node = walker.nextNode()) {
            node.nodeValue = node.nodeValue.replace(/\(y\/n\)/gi, name);
        }
    }
})();
