// ==UserScript==
// @name         Mark United States servers on Roblox (use with btr)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  its just puts a green circle next to the word United states on roblox
// @author       b1axely
// @match        *://*.roblox.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499021/Mark%20United%20States%20servers%20on%20Roblox%20%28use%20with%20btr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499021/Mark%20United%20States%20servers%20on%20Roblox%20%28use%20with%20btr%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const textToMark = "Region: United States";

    function markText() {
        const regex = new RegExp(textToMark, 'gi');

        function walk(node) {
            let child, next;
            switch (node.nodeType) {
                case 1:
                case 9:
                case 11:
                    child = node.firstChild;
                    while (child) {
                        next = child.nextSibling;
                        walk(child);
                        child = next;
                    }
                    break;
                case 3:
                    handleText(node);
                    break;
            }
        }

        function handleText(textNode) {
            const val = textNode.nodeValue;
            const parentNode = textNode.parentNode;

            if (parentNode.nodeName === 'SPAN' && parentNode.classList.contains('marked-text')) {
                return;
            }

            const span = document.createElement('span');
            span.classList.add('marked-text');
            span.innerHTML = val.replace(regex, function(matched) {
                return matched + '<span class="green-circle" style="display:inline-block; width:10px; height:10px; background-color: green; border-radius: 50%; margin-left: 5px;"></span>';
            });
            parentNode.replaceChild(span, textNode);
        }

        walk(document.body);
    }

    function debouncedMarkText() {
        clearTimeout(debouncedMarkText.timeout);
        debouncedMarkText.timeout = setTimeout(markText, 500);
    }

    debouncedMarkText.timeout = null;

    markText();

    const observer = new MutationObserver(() => {
        debouncedMarkText();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
