// ==UserScript==
// @name         Lolz Offtopic Renamer
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Меняет название оффтопика на lolz.live
// @author       eretly (optimized version)
// @match        *://lolz.live/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531111/Lolz%20Offtopic%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/531111/Lolz%20Offtopic%20Renamer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфиг
    const NEW_OFFTOPIC_NAME = "Анимешный Оффтопик"; // Вписываем название оффтопика

    let originalOfftopicName = "";
    const processedElements = new WeakSet();

    const OFFTOPIC_LINK_SELECTORS = [
        'a[href="https://lolz.live/forums/8/"]',
        'a[href="/forums/8/"]',
        'a[href="forums/8/"]',
        '.p-nav-list a[href="/forums/8/"]',
        'a.u-concealed[href="/forums/8/"]',
        '.p-breadcrumbs a[href="/forums/8/"]'
    ];

    const TEXT_ELEMENT_SELECTORS = [
        'span[itemprop="name"]',
        'span.muted',
        'span.innerText',
        '.search-choice span',
        '.p-title-value',
        '.p-title h1',
        '.p-title span',
        '.p-description .u-muted',
        '.p-navgroup-linkText',
        '.node-title'
    ];

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function replaceOfftopicName(text) {
        if (!originalOfftopicName || typeof text !== 'string' || !text.includes(originalOfftopicName)) {
            return text;
        }
        return text.replace(new RegExp(escapeRegExp(originalOfftopicName), 'g'), NEW_OFFTOPIC_NAME);
    }

    async function fetchOfftopicName() {
        try {
            const response = await fetch("https://lolz.live/forums/8/");
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const h1Element = doc.querySelector('h1[title]');
            if (h1Element && h1Element.textContent.trim()) {
                return h1Element.textContent.trim();
            }

            const titleElement = doc.querySelector('title');
            if (titleElement) {
                const match = titleElement.textContent.match(/(.*?)\s*\|\s*lolz\.live/i);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }

            const breadcrumb = doc.querySelector('.p-breadcrumbs-list li:last-child span');
            if (breadcrumb) {
                return breadcrumb.textContent.trim();
            }

            return "";
        } catch (error) {
            console.log("[Lolz Offtopic Renamer] Ошибка при запросе страницы оффтопика:", error);
            return "";
        }
    }

    function getOfftopicNameFromPage() {
        if (window.location.pathname === "/forums/8/" || window.location.pathname === "/forums/8") {
            const h1Element = document.querySelector('h1[title]');
            if (h1Element && h1Element.textContent.trim()) {
                return h1Element.textContent.trim();
            }
        }

        for (const selector of OFFTOPIC_LINK_SELECTORS) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }

        return "";
    }

    function processTextNodes(node) {
        if (node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE' || processedElements.has(node)) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue.includes(originalOfftopicName)) {
                node.nodeValue = replaceOfftopicName(node.nodeValue);
                processedElements.add(node);
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                processTextNodes(node.childNodes[i]);
            }
        }
    }

    function updateDOMElements() {
        if (!originalOfftopicName || originalOfftopicName === NEW_OFFTOPIC_NAME) {
            return;
        }

        processTextNodes(document.body);

        OFFTOPIC_LINK_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
                if (!processedElements.has(link) && link.textContent.trim() === originalOfftopicName) {
                    link.textContent = NEW_OFFTOPIC_NAME;
                    processedElements.add(link);
                }
            });
        });

        TEXT_ELEMENT_SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!processedElements.has(element) && element.textContent.trim() === originalOfftopicName) {
                    element.textContent = NEW_OFFTOPIC_NAME;
                    processedElements.add(element);
                }
            });
        });

        if (window.location.pathname === "/forums/8/" || window.location.pathname === "/forums/8") {
            document.querySelectorAll('h1').forEach(h1 => {
                if (!processedElements.has(h1) && h1.textContent.trim() === originalOfftopicName) {
                    h1.textContent = NEW_OFFTOPIC_NAME;
                    h1.setAttribute("title", NEW_OFFTOPIC_NAME);
                    processedElements.add(h1);
                }
            });

            if (document.title.includes(originalOfftopicName)) {
                document.title = replaceOfftopicName(document.title);
            }
        }

        document.querySelectorAll(`[data-cachedtitle*="${originalOfftopicName}"], [title*="${originalOfftopicName}"]`).forEach(el => {
            if (!processedElements.has(el)) {
                if (el.dataset.cachedtitle && el.dataset.cachedtitle.includes(originalOfftopicName)) {
                    el.dataset.cachedtitle = replaceOfftopicName(el.dataset.cachedtitle);
                }
                if (el.title && el.title.includes(originalOfftopicName)) {
                    el.title = replaceOfftopicName(el.title);
                }
                processedElements.add(el);
            }
        });
    }

    function patchDOMMethods() {
        const originalSetAttr = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if ((name === 'data-cachedtitle' || name === 'title') &&
                typeof value === 'string' &&
                originalOfftopicName) {
                value = replaceOfftopicName(value);
            }
            return originalSetAttr.call(this, name, value);
        };

        const originalGetAttr = Element.prototype.getAttribute;
        Element.prototype.getAttribute = function(name) {
            let value = originalGetAttr.call(this, name);
            if ((name === 'data-cachedtitle' || name === 'title') &&
                typeof value === 'string' &&
                originalOfftopicName) {
                value = replaceOfftopicName(value);
            }
            return value;
        };

        const originalTextContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
        if (originalTextContent && originalTextContent.set) {
            Object.defineProperty(Node.prototype, 'textContent', {
                set(value) {
                    if (typeof value === 'string' && originalOfftopicName) {
                        value = replaceOfftopicName(value);
                    }
                    return originalTextContent.set.call(this, value);
                },
                get: originalTextContent.get
            });
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            updateDOMElements();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    async function initialize() {
        originalOfftopicName = getOfftopicNameFromPage();

        if (!originalOfftopicName) {
            originalOfftopicName = await fetchOfftopicName();
        }

        if (originalOfftopicName && originalOfftopicName !== NEW_OFFTOPIC_NAME) {
            patchDOMMethods();
            updateDOMElements();
            observeDOMChanges();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();