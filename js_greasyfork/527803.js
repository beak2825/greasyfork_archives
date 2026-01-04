// ==UserScript==
// @name         Convert Any Links to Clickable Links
// @namespace    kdroidwin.hatenablog.com
// @version      3.1
// @description  すべてのリンクをクリックできるリンクにかえる。
// @author       Kdroidwin
// @match        *://*/*
// @exclude      *://github.com/*
// @exclude      *://chat.openai.com/*
// @exclude      *://blog.hatena.ne.jp/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/527803/Convert%20Any%20Links%20to%20Clickable%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/527803/Convert%20Any%20Links%20to%20Clickable%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlPattern = /\b(?:h?ttps?:\/\/[^\s<>"]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s<>"]*)?)\b/g;

    function convertTextToLinks(node) {
        if (node.nodeType !== 3 || !urlPattern.test(node.nodeValue)) return;

        const parent = node.parentNode;
        if (parent.tagName === 'A' || parent.matches('input, textarea, [contenteditable]')) return;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;

        node.nodeValue.replace(urlPattern, (match, offset) => {
            frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, offset)));

            let url = match;
            if (url.startsWith('ttp')) {
                url = 'h' + url; // 'ttps://' → 'https://'
            } else if (!url.includes('://')) {
                url = 'https://' + url; // 'example.com' → 'https://example.com'
            }

            const a = document.createElement('a');
            a.href = url;
            a.textContent = url;
            a.target = '_blank';
            a.style.display = 'inline'; // レイアウト崩れ防止

            frag.appendChild(a);
            lastIndex = offset + match.length;
        });

        frag.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
        parent.replaceChild(frag, node);
    }

    function debounce(func, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    const observer = new MutationObserver(debounce(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        node.querySelectorAll('*').forEach(el => {
                            for (const textNode of el.childNodes) {
                                convertTextToLinks(textNode);
                            }
                        });
                    } else if (node.nodeType === 3) {
                        convertTextToLinks(node);
                    }
                }
            } else if (mutation.type === 'characterData') {
                convertTextToLinks(mutation.target);
            }
        }
    }, 500));

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    document.body.querySelectorAll('*').forEach(el => {
        for (const node of el.childNodes) {
            convertTextToLinks(node);
        }
    });
})();
