// ==UserScript==
// @name         Annoyingtion - Remove annoying message on Notion
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove specific HTML element on Notion pages
// @author       Laercio Nascimento
// @match        https://www.notion.so/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476990/Annoyingtion%20-%20Remove%20annoying%20message%20on%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/476990/Annoyingtion%20-%20Remove%20annoying%20message%20on%20Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList') {
                var addedNodes = mutation.addedNodes;
                for (var node of addedNodes) {
                    if (node instanceof HTMLElement && node.tagName === 'DIV' &&
                        node.previousElementSibling && node.previousElementSibling.classList.contains('notion-topbar')) {
                        node.remove();
                    }
                }
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
