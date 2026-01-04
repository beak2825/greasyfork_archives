// ==UserScript==
// @name         Perplexity UI - Premium Highlighter Theme (Definitive)
// @namespace    http://tampermonkey.net/
// @version      13.0
// @description  The final, definitive script for a premium Perplexity UI with a robust, persistent, multi-color highlighting tool.
// @match        https://www.perplexity.ai/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546138/Perplexity%20UI%20-%20Premium%20Highlighter%20Theme%20%28Definitive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546138/Perplexity%20UI%20-%20Premium%20Highlighter%20Theme%20%28Definitive%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Part 1: The CSS for the Premium Theme & Highlighter ---
    GM_addStyle(`
        /* --- [ IMPORTS & THEME VARIABLES ] --- */
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono&display=swap');

        :root {
            --main-bg: #0b0f10;
            --panel-bg: #111414;
            --text-color: #c3c3c3;
            --header-color: #f0f0f0;
            --link-color: #6ac9ff;
            --border-color: #2b3b3a;
            --border-color-focus: #555;
        }

        /* --- [ GLOBAL STYLES ] --- */
        html, body {
            font-family: 'Merriweather', serif !important;
            background-color: var(--main-bg) !important;
            color: var(--text-color) !important;
            font-size: 1.1rem !important;
        }

        /* --- [ PREMIUM TYPOGRAPHY ] --- */
        .prose, .prose p, .prose li {
            font-family: 'Merriweather', serif !important;
            font-size: 1.1rem !important;
            line-height: 1.8 !important;
            color: var(--text-color) !important;
        }
        .prose h2 {
            font-size: 1.7rem !important; margin-top: 2.5rem !important; margin-bottom: 1.2rem !important;
            color: var(--header-color) !important; font-weight: 700 !important;
        }
        .prose h3 {
            font-size: 1.3rem !important; margin-top: 2rem !important; margin-bottom: 0.5rem !important;
            color: var(--header-color) !important; font-weight: 700 !important;
        }
        a { color: var(--link-color) !important; text-decoration: none !important; }

        /* --- [ LAYOUT & UI ] --- */
        .prose {
            background: var(--panel-bg) !important; border: none !important;
            border-radius: 14px !important; padding: 2rem 2.5rem !important;
            box-shadow: 0 8px 40px rgba(0,0,0,0.5) !important;
        }
        div[cplx-follow-up-query-box="true"] .bg-offset {
            background-color: var(--panel-bg) !important; border: 1px solid var(--border-color) !important;
            border-radius: 16px !important; box-shadow: 0 8px 40px rgba(0,0,0,0.5) !important;
            transition: border-color 0.2s ease;
        }
        div[cplx-follow-up-query-box="true"] .bg-offset:focus-within {
            border-color: var(--border-color-focus) !important;
            box-shadow: 0 8px 40px rgba(0,0,0,0.5) !important; outline: none !important;
        }
        textarea {
            font-family: 'Merriweather', serif !important; font-size: 1.1rem !important;
            background-color: transparent !important;
        }
        .bg-offset, .bg-base, .bg-default, .bg-offsetPlus, .bg-raised { background-color: var(--panel-bg) !important; }

        /* --- [ HIGHLIGHTER TOOL STYLES ] --- */
        #highlighter-toolbar {
            position: absolute; background-color: #252a2b;
            border: 1px solid #444; border-radius: 8px;
            padding: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            z-index: 10000; display: none; gap: 5px;
        }
        .highlight-btn {
            width: 24px; height: 24px; border-radius: 50%;
            cursor: pointer; border: 2px solid transparent;
            transition: all 0.2s ease;
            outline: none !important;
        }
        .highlight-btn:hover { transform: scale(1.1); border-color: #fff; }
        .h-yellow { background-color: rgba(253, 224, 71, 0.5); }
        .h-pink   { background-color: rgba(244, 114, 182, 0.5); }
        .h-blue   { background-color: rgba(96, 165, 250, 0.5); }
        .h-green  { background-color: rgba(74, 222, 128, 0.5); }
        .h-clear  { background-color: #9ca3af; font-size: 12px; color: #fff; display:grid; place-items:center; }
        mark.ph-highlight {
            border-radius: 3px;
            padding: 0 2px;
            color: #FFF !important;
            background-color: var(--highlight-color);
        }

        /* --- [ FINAL BUG FIXES ] --- */
        .pb-md.border-b, .divide-y > :not([hidden]) ~ :not([hidden]) {
            border: none !important;
        }
    `);

    // --- Part 2: The JavaScript for Highlighting & Persistence ---

    function getXPath(node) {
        let path = '';
        for (; node && node.nodeType == 1; node = node.parentNode) {
            let index = 0;
            for (let sibling = node.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType == 1 && sibling.nodeName == node.nodeName) index++;
            }
            const tagName = node.nodeName.toLowerCase();
            const pathIndex = (index > 0 ? `[${index + 1}]` : '');
            path = `/${tagName}${pathIndex}${path}`;
        }
        return path;
    }

    function getNodeFromXPath(path) {
        try {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (e) { return null; }
    }

    async function saveHighlights() {
        const highlights = [];
        document.querySelectorAll('.prose mark.ph-highlight').forEach(mark => {
            const parent = mark.parentNode;
            if (!parent) return;
            parent.normalize();
            let startOffset = 0;
            for (let i = 0; i < parent.childNodes.length; i++) {
                const child = parent.childNodes[i];
                if (child === mark) break;
                startOffset += child.textContent.length;
            }
            highlights.push({
                path: getXPath(parent),
                start: startOffset,
                length: mark.textContent.length,
                color: mark.style.backgroundColor
            });
        });
        const key = `highlights_${window.location.pathname}`;
        await GM_setValue(key, JSON.stringify(highlights));
    }

    async function applyHighlights() {
        const key = `highlights_${window.location.pathname}`;
        const savedHighlights = JSON.parse(await GM_getValue(key, '[]'));
        if (savedHighlights.length === 0) return;

        savedHighlights.forEach(h => {
            const parentNode = getNodeFromXPath(h.path);
            if (parentNode) {
                const textNodes = Array.from(parentNode.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
                let charCount = 0;
                for (const textNode of textNodes) {
                    const nodeLength = textNode.textContent.length;
                    if (charCount + nodeLength >= h.start) {
                        const range = document.createRange();
                        const start = h.start - charCount;
                        const end = start + h.length;
                        if (start < 0 || end > nodeLength) continue;
                        range.setStart(textNode, start);
                        range.setEnd(textNode, end);
                        const mark = document.createElement('mark');
                        mark.className = 'ph-highlight';
                        mark.style.backgroundColor = h.color;
                        try {
                            range.surroundContents(mark);
                        } catch (e) {}
                        break;
                    }
                    charCount += nodeLength;
                }
            }
        });
    }

    let selectionRange = null;
    const toolbar = document.createElement('div');
    toolbar.id = 'highlighter-toolbar';
    document.body.appendChild(toolbar);

    const colors = {
        'yellow': 'rgba(253, 224, 71, 0.5)', 'pink': 'rgba(244, 114, 182, 0.5)',
        'blue': 'rgba(96, 165, 250, 0.5)', 'green': 'rgba(74, 222, 128, 0.5)'
    };

    for (const [name, color] of Object.entries(colors)) {
        const btn = document.createElement('div');
        btn.className = `highlight-btn h-${name}`;
        btn.addEventListener('mousedown', (e) => { e.preventDefault(); highlightSelection(color); });
        toolbar.appendChild(btn);
    }

    const clearBtn = document.createElement('div');
    clearBtn.className = 'highlight-btn h-clear';
    clearBtn.innerHTML = 'X';
    clearBtn.addEventListener('mousedown', (e) => { e.preventDefault(); clearHighlight(); });
    toolbar.appendChild(clearBtn);

    function highlightSelection(color) {
        if (selectionRange) {
            const mark = document.createElement('mark');
            mark.className = 'ph-highlight';
            mark.style.backgroundColor = color;
            try {
                mark.appendChild(selectionRange.extractContents());
                selectionRange.insertNode(mark);
                saveHighlights();
            } catch (e) {}
        }
        toolbar.style.display = 'none';
        window.getSelection().removeAllRanges();
    }

    function clearHighlight() {
        if (selectionRange) {
            let parent = selectionRange.commonAncestorContainer;
            if (parent.nodeType === Node.TEXT_NODE) parent = parent.parentElement;
            if (parent.tagName === 'MARK' && parent.classList.contains('ph-highlight')) {
                const grandParent = parent.parentNode;
                grandParent.innerHTML = grandParent.innerHTML.replace(parent.outerHTML, parent.innerHTML);
                grandParent.normalize();
                saveHighlights();
            }
        }
        toolbar.style.display = 'none';
        window.getSelection().removeAllRanges();
    }

    document.addEventListener('mouseup', (e) => {
        if (!e.target.closest('.prose')) {
            if (toolbar.style.display === 'flex') toolbar.style.display = 'none';
            return;
        }
        const selection = window.getSelection();
        if (selection.toString().trim().length > 0) {
            selectionRange = selection.getRangeAt(0);
            const rect = selectionRange.getBoundingClientRect();
            toolbar.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (toolbar.offsetWidth / 2)}px`;
            toolbar.style.top = `${rect.top + window.scrollY - toolbar.offsetHeight - 8}px`;
            toolbar.style.display = 'flex';
        } else {
            toolbar.style.display = 'none';
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (!e.target.closest('#highlighter-toolbar')) {
            toolbar.style.display = 'none';
        }
    });

    // --- Part 3: The Bulletproof Observer Engine ---
    let observer;
    const startObserver = () => {
        const targetNode = document.querySelector('div[data-cplx-component="thread-wrapper"]');
        if (targetNode) {
            if (observer) observer.disconnect();
            applyHighlights();
            observer = new MutationObserver(() => {
                applyHighlights();
            });
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    };

    // Use an interval to constantly check for the chat container, which handles SPA navigation.
    setInterval(startObserver, 500);

})();
