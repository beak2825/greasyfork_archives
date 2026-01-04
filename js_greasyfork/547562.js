// ==UserScript==
// @name         AI Markdown Bold Formatter
// @namespace    https://blog.valley.town/@zeronox
// @version      1.3
// @description  정확한 스트리밍 완료 감지 및 복잡한 DOM 구조에서 ** 태그 변환
// @author       zeronox
// @license      MIT
// @match       https://aistudio.google.com/*
// @match       https://gemini.google.com/*
// @match       https://www.perplexity.ai/*
// @match       https://notebooklm.google.com/*
// @match       http://localhost:3000/*
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/547562/AI%20Markdown%20Bold%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/547562/AI%20Markdown%20Bold%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_SELECTORS = [
        '.markdown',
        '.markdown-main-panel',
        '.model-response-text',
        '[class*="response"]',
        '[class*="message"]',
        '[class*="model-response"]',
        '.response-container-content'
    ];

    const processNodeRecursively = (container) => {
        if (!container || ['STRONG', 'SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(container.tagName)) {
            return;
        }
        Array.from(container.childNodes).forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                processNodeRecursively(child);
            }
        });
        let changedInLoop;
        do {
            changedInLoop = false;
            const childNodes = Array.from(container.childNodes);
            let startNode = null, startIndex = -1;
            let endNode = null, endIndex = -1;
            let startNodeIndexInParent = -1;
            for (let i = 0; i < childNodes.length; i++) {
                const currentNode = childNodes[i];
                if (currentNode.nodeType === Node.TEXT_NODE) {
                    const idx = currentNode.textContent.indexOf('**');
                    if (idx !== -1) {
                        startNode = currentNode;
                        startIndex = idx;
                        startNodeIndexInParent = i;
                        break;
                    }
                }
            }
            if (startNode) {
                for (let i = startNodeIndexInParent; i < childNodes.length; i++) {
                    const currentNode = childNodes[i];
                    if (currentNode.nodeType === Node.TEXT_NODE) {
                        const searchFrom = (currentNode === startNode) ? startIndex + 2 : 0;
                        if (currentNode.textContent.length >= searchFrom) {
                            const idx = currentNode.textContent.indexOf('**', searchFrom);
                            if (idx !== -1) {
                                endNode = currentNode;
                                endIndex = idx;
                                break;
                            }
                        }
                    }
                }
            }
            if (startNode && endNode) {
                const range = document.createRange();
                range.setStart(startNode, startIndex);
                range.setEnd(endNode, endIndex + 2);

                const strong = document.createElement('strong');
                try {
                    const contents = range.extractContents();
                    if (contents.firstChild && contents.firstChild.nodeType === Node.TEXT_NODE) {
                        contents.firstChild.textContent = contents.firstChild.textContent.slice(2);
                    }
                    if (contents.lastChild && contents.lastChild.nodeType === Node.TEXT_NODE) {
                        contents.lastChild.textContent = contents.lastChild.textContent.slice(0, -2);
                    }
                    strong.appendChild(contents);
                    range.insertNode(strong);
                    changedInLoop = true;
                } catch (e) {
                    console.error('AI Markdown Bold Formatter: Error processing range.', e);
                }
            }
        } while (changedInLoop);
    };

    const runFormatter = () => {
        document.querySelectorAll(TARGET_SELECTORS.join(', ')).forEach(container => {
            processNodeRecursively(container);
        });
        console.log('Formatter 실행됨');
    };

    const elementStates = new WeakMap();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                const currentClasses = target.className;
                const previousClasses = elementStates.get(target) || '';

                elementStates.set(target, currentClasses);

                if (!previousClasses.includes('complete') &&
                    currentClasses.includes('complete')) {

                    console.log('스트리밍 완료 감지!');
                    setTimeout(runFormatter, 100);
                }
            }
        });
    });

    observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    setTimeout(runFormatter, 1000);

    console.log('Fixed Formatter 로드');
})();