// ==UserScript==
// @name         Twitter sol/bsc to gmgn (Optimized)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  More stable and wider range recognition of sol/bsc addresses on Twitter/X and turns them into gmgn.ai links.
// @author       mqtt
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542371/Twitter%20solbsc%20to%20gmgn%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542371/Twitter%20solbsc%20to%20gmgn%20%28Optimized%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const solAddressRegex = /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g;
    const evmAddressRegex = /\b(0x[a-fA-F0-9]{40})\b/g;

    const TARGET_SELECTORS = [
        '[data-testid="tweetText"]',                  
        '[data-testid="userProfileHeader_bio"]'       
    ].join(', ');

    const SOL_LINK_CLASS = 'sol-address-link-gemini';
    const EVM_LINK_CLASS = 'evm-address-link-gemini';
    const PROCESSED_MARKER_CLASS = 'address-link-processed-gemini';

    let processQueue = new Set();
    let processTimer = null;

    GM_addStyle(`
        a.${SOL_LINK_CLASS}, a.${EVM_LINK_CLASS} {
            color: #FF4500 !important; 
            text-decoration: underline !important;
            font-weight: bold;
            transition: all 0.2s ease;
        }
        a.${SOL_LINK_CLASS}:hover, a.${EVM_LINK_CLASS}:hover {
            color: #FF6347 !important;
            text-shadow: 0 0 5px rgba(255, 69, 0, 0.7);
        }
    `);

    function processNodes() {
        if (processQueue.size === 0) return;
        const nodesToProcess = [...processQueue];
        processQueue.clear();

        nodesToProcess.forEach(element => {
            if (element.classList.contains(PROCESSED_MARKER_CLASS)) {
                return;
            }

            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    if (node.parentElement.closest('script, style, a, textarea')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (solAddressRegex.test(node.textContent) || evmAddressRegex.test(node.textContent)) {
                        solAddressRegex.lastIndex = 0; 
                        evmAddressRegex.lastIndex = 0;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            });

            let changed = false;
            const textNodes = [];
            while (walker.nextNode()) textNodes.push(walker.currentNode);

            textNodes.forEach(textNode => {
                const parent = textNode.parentElement;
                if (!parent) return;

                const text = textNode.textContent;
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;

                const matches = [];
                let match;
                while ((match = solAddressRegex.exec(text)) !== null) {
                    matches.push({ type: 'sol', index: match.index, address: match[1] });
                }
                while ((match = evmAddressRegex.exec(text)) !== null) {
                    matches.push({ type: 'evm', index: match.index, address: match[1] });
                }

                if (matches.length === 0) return;

                changed = true;
                matches.sort((a, b) => a.index - b.index);

                matches.forEach(m => {
                    if (m.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.substring(lastIndex, m.index)));
                    }
                    const link = document.createElement('a');
                    link.textContent = m.address;
                    if (m.type === 'sol') {
                        link.href = `https://gmgn.ai/sol/token/ufeXUTjX_${m.address}?filter=All`;
                        link.className = SOL_LINK_CLASS;
                    } else { // evm
                        link.href = `https://gmgn.ai/bsc/token/${m.address}`;
                        link.className = EVM_LINK_CLASS;
                    }
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.onclick = (e) => e.stopPropagation(); // 防止点击链接触发行推文的导航事件

                    fragment.appendChild(link);
                    lastIndex = m.index + m.address.length;
                });

                if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
                }

                parent.replaceChild(fragment, textNode);
            });

            if (changed) {
                element.classList.add(PROCESSED_MARKER_CLASS);
            }
        });
    }

    function enqueueNode(node) {
        if (node.nodeType === 1 && !processQueue.has(node) && !node.classList.contains(PROCESSED_MARKER_CLASS)) {
            if (node.matches(TARGET_SELECTORS)) {
                 processQueue.add(node);
            } else {
                node.querySelectorAll(TARGET_SELECTORS).forEach(innerNode => {
                     if (!processQueue.has(innerNode) && !innerNode.classList.contains(PROCESSED_MARKER_CLASS)) {
                        processQueue.add(innerNode);
                    }
                });
            }
        }

        if (processQueue.size > 0 && !processTimer) {
            processTimer = setTimeout(() => {
                processNodes();
                processTimer = null;
            }, 200); 
        }
    }

    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => enqueueNode(node));
                }
                if (mutation.type === 'attributes' && mutation.target.nodeType === 1) {
                    if (!mutation.target.classList.contains(PROCESSED_MARKER_CLASS)) {
                        enqueueNode(mutation.target);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }

    function initialScan() {
        document.querySelectorAll(TARGET_SELECTORS).forEach(node => enqueueNode(node));
        if (processQueue.size > 0) {
            processNodes();
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialScan);
    } else {
        initialScan();
    }

    setupObserver();
}());