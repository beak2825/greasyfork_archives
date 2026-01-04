// ==UserScript==
// @name         YouTube Shorts Linkify
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      GPL-3.0-or-later
// @description  Converts URLs into clickable links on YouTube Shorts.
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?domain=www.youtube.com&sz=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526477/YouTube%20Shorts%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/526477/YouTube%20Shorts%20Linkify.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function initLinkify() {
        const policy = window.trustedTypes ? trustedTypes.createPolicy('ytShortsLinkify', { createHTML: input => input }) : null;

        const style = document.createElement('style');
        style.textContent = "a.yt-short-linkify { color: inherit; text-decoration: underline; cursor: pointer; }";
        document.head.appendChild(style);

        const urlRegex = /(?<=(?:\s|^|[(]))(?<![!@#$%^&*()_+\-=\[\]{};:'"\\|,\.<>\/?`~])((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}(?:\/\S*)?)\b/g;

        function linkifyTextNode(textNode) {
            if (!textNode.nodeValue || !urlRegex.test(textNode.nodeValue)) return;

            const span = document.createElement('span');
            let text = textNode.nodeValue, lastIndex = 0;
            urlRegex.lastIndex = 0;
            let match;

            while ((match = urlRegex.exec(text)) !== null) {
                const url = match[0], index = match.index;
                span.appendChild(document.createTextNode(text.substring(lastIndex, index)));

                const a = document.createElement('a');
                a.className = 'yt-short-linkify';
                a.style.color = 'inherit';
                a.href = /^https?:\/\//i.test(url) ? url : 'https://' + url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = url.replace(/^https?:\/\//i, '');

                span.appendChild(a);
                lastIndex = index + url.length;
            }

            span.appendChild(document.createTextNode(text.substring(lastIndex)));
            textNode.parentNode.replaceChild(span, textNode);
        }

        function linkifyElement(element) {
            const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
                acceptNode: function (node) {
                    return (node.parentNode && node.parentNode.nodeName === 'A')
                        ? NodeFilter.FILTER_REJECT
                        : (node.nodeValue && urlRegex.test(node.nodeValue))
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            });

            const nodes = [];
            while (treeWalker.nextNode()) {
                nodes.push(treeWalker.currentNode);
            }
            nodes.forEach(linkifyTextNode);
        }

        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    linkifyElement(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('body *').forEach(el => io.observe(el));

        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            io.observe(node);
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    if (mutation.target.parentNode) {
                        io.observe(mutation.target.parentNode);
                    }
                } else if (mutation.type === 'attributes') {
                    if (mutation.target) {
                        io.observe(mutation.target);
                    }
                }
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style'] });
    }

    window.addEventListener('load', () => {
        initLinkify();
    });

})();
