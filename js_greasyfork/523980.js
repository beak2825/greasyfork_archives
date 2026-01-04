// ==UserScript==
// @name         Replace "Level" with "Game" on Bopimo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace most instances of "level" to "game" on bopimo.
// @author       Teemsploit
// @match        https://www.bopimo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523980/Replace%20%22Level%22%20with%20%22Game%22%20on%20Bopimo.user.js
// @updateURL https://update.greasyfork.org/scripts/523980/Replace%20%22Level%22%20with%20%22Game%22%20on%20Bopimo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function replaceTextExceptLinks() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (!node.parentNode.closest('a')) {
                node.nodeValue = node.nodeValue.replace(/level/gi, 'game');
            }
        }
    }

    replaceTextExceptLinks();
})();
