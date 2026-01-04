// ==UserScript==
// @name         Replace Y/N
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace (y/n) with your name
// @author       You
// @match        *://www.wattpad.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511639/Replace%20YN.user.js
// @updateURL https://update.greasyfork.org/scripts/511639/Replace%20YN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var name = prompt("Enter your name:");
    if (name) {
        document.querySelectorAll('body *').forEach(function(node) {
            if (node.nodeType === 3) {
                node.nodeValue = node.nodeValue.replace(/\(y\/n\)/gi, name);
            }
        });
    }
})();
