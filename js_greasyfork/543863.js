// ==UserScript==
// @name         NotebookLM Robust KaTeX Renderer v2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Render LaTeX in NotebookLM using KaTeX, with support for multi-node math and TrustedHTML policy safety.
// @match        https://notebooklm.google.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js
// @resource     KATEX_CSS https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543863/NotebookLM%20Robust%20KaTeX%20Renderer%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/543863/NotebookLM%20Robust%20KaTeX%20Renderer%20v20.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Load KaTeX CSS
    const katexCSS = document.createElement('link');
    katexCSS.rel = 'stylesheet';
    katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css';
    document.head.appendChild(katexCSS);

    const mathPattern = /\$\$(.+?)\$\$|\$(.+?)\$/gs;

    function extractMathExpressions(text) {
        return Array.from(text.matchAll(mathPattern)).map(m => m[0]);
    }

    function safeRenderMath(text) {
        const container = document.createDocumentFragment();
        let lastIndex = 0;

        for (const match of text.matchAll(mathPattern)) {
            const [full, displayExpr, inlineExpr] = match;
            const index = match.index;

            if (index > lastIndex) {
                container.appendChild(document.createTextNode(text.slice(lastIndex, index)));
            }

            const expr = (displayExpr || inlineExpr).trim();
            const isDisplay = !!displayExpr;
            const el = document.createElement(isDisplay ? 'div' : 'span');

            try {
                katex.render(expr, el, {
                    displayMode: isDisplay,
                    throwOnError: false
                });
            } catch (err) {
                console.error("KaTeX render error:", expr, err);
                el.textContent = full;
            }

            container.appendChild(el);
            lastIndex = index + full.length;
        }

        if (lastIndex < text.length) {
            container.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        return container;
    }

    function combineAndRender(container) {
        // 再帰的にテキストを結合して、$$ ... $$ の範囲を検出
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
        const textNodes = [];
        let buffer = '';
        let node;

        while ((node = walker.nextNode())) {
            textNodes.push(node);
            buffer += node.textContent;
        }

        const matches = [...buffer.matchAll(mathPattern)];
        if (matches.length === 0) return false;

        // 1つずつ置換していく
        let offset = 0;
        for (const match of matches) {
            const [full, displayExpr, inlineExpr] = match;
            const expr = (displayExpr || inlineExpr).trim();
            const isDisplay = !!displayExpr;
            const start = match.index;
            const end = start + full.length;

            // 開始・終了位置に該当する textNode を特定
            let startNodeIndex = 0, endNodeIndex = 0, pos = 0;
            for (let i = 0; i < textNodes.length; i++) {
                const len = textNodes[i].textContent.length;
                if (pos <= start) startNodeIndex = i;
                if (pos + len >= end) { endNodeIndex = i; break; }
                pos += len;
            }

            // 対象ノード群をまとめて置き換える
            const el = document.createElement(isDisplay ? 'div' : 'span');
            try {
                katex.render(expr, el, { displayMode: isDisplay, throwOnError: false });
            } catch (err) {
                console.error("KaTeX render error:", expr, err);
                el.textContent = full;
            }

            const firstNode = textNodes[startNodeIndex];
            const lastNode = textNodes[endNodeIndex];
            const range = document.createRange();
            range.setStartBefore(firstNode);
            range.setEndAfter(lastNode);
            range.deleteContents();
            range.insertNode(el);
        }

        return true;
    }

    function scanAndRender() {
        const cardContents = document.querySelectorAll('mat-card-content');

        cardContents.forEach(card => {
            const blocks = card.querySelectorAll('div.paragraph');

            blocks.forEach(block => {
                if (block.dataset.katexRendered === 'true') return;

                const success = combineAndRender(block);
                if (success) {
                    block.dataset.katexRendered = 'true';
                }
            });
        });
    }

    setInterval(scanAndRender, 1000);
})();
