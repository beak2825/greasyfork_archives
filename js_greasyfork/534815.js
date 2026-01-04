// ==UserScript==
// @name         MilkyWay Idle - Replace Chinese text with English
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace Chinese text with English
// @author       Dez
// @match        https://www.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534815/MilkyWay%20Idle%20-%20Replace%20Chinese%20text%20with%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/534815/MilkyWay%20Idle%20-%20Replace%20Chinese%20text%20with%20English.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isChinese = (text) => /[\u4e00-\u9fff]/.test(text);
    const translateCache = new Map();

    async function translateText(text) {
        if (translateCache.has(text)) return translateCache.get(text);
        try {
            const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=en&dt=t&q=${encodeURIComponent(text)}`);
            const result = await response.json();
            const translation = result[0].map(item => item[0]).join('');
            translateCache.set(text, translation);
            return translation;
        } catch (error) {
            console.error('Translation failed:', error);
            return text;
        }
    }

    function aggressivelyAdjustStyle(node) {
        const el = node.parentElement;
        if (!el) return;
        el.style.fontSize = '0.75em';
        el.style.lineHeight = '1';
        el.style.wordBreak = 'break-all';
        el.style.overflowWrap = 'break-word';
        el.style.whiteSpace = 'normal';
        el.style.maxWidth = '100%';
    }

    async function processNode(node) {
        if (!node.nodeType || node.nodeType !== Node.TEXT_NODE) return;

        const originalText = node.textContent.trim();
        if (!originalText || !isChinese(originalText)) return;

        const translatedText = await translateText(originalText);
        node.textContent = translatedText;
        aggressivelyAdjustStyle(node);
    }

    function walkAndTranslate(root) {
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = treeWalker.nextNode())) {
            processNode(node);
        }
    }

    // Initial translation
    walkAndTranslate(document.body);

    // Observer for dynamic updates
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    processNode(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    walkAndTranslate(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();