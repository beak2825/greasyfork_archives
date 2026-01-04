// ==UserScript==
// @name         Bus论坛助手
// @namespace    http://tampermonkey.net/
// @version      0.05
// @description  将页面中的磁力链接转换为可点击的超链接，并将番号转换为当前网站的超链接
// @author       1
// @grant        none
// @license      MIT
// @include      *javbus.com/*
// @include      *javdb.com/*
// @include      *avmoo.cyou/*
// @include      *javlibrary.com/*
// @include      /^.*(javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav)\..*$/
// @include      /^.*(javdb)[0-9]*\..*$/
// @include      /^.*(avmoo)\..*$/
// @downloadURL https://update.greasyfork.org/scripts/519141/Bus%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519141/Bus%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const magnetRegex = /magnet:\?xt=urn:btih:[a-fA-F0-9]{40}(?:&[a-zA-Z0-9_]+=[a-zA-Z0-9_%+-]*)*|[a-fA-F0-9]{7,}/g;
    const specificTextRegex = /[a-zA-Z]+-\d+/g; // 修改这里，只匹配字母-数字模式
    const hashRegex = /[0-9A-Fa-f]{40}/g;
    const siteRootUrl = window.location.origin;
    const currentUrl = window.location.href;
    let scriptRunning = false;

    function convertLinksAndTexts() {
        if (scriptRunning) return;
        scriptRunning = true;

        const textNodes = getTextNodes(document.body);
        const fragment = document.createDocumentFragment();

        textNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const parent = node.parentNode;
                let text = node.textContent;
                let lastIndex = 0;

                let magnetMatch;
                while ((magnetMatch = magnetRegex.exec(text)) !== null) {
                    const magnetLink = magnetMatch[0];
                    if (!isLongNumber(magnetLink) && !isExcludedPattern(magnetLink) && !isContinuousSameCharacters(magnetLink)) {
                        const fullMagnetLink = magnetLink.startsWith('magnet:') ? magnetLink : `magnet:?xt=urn:btih:${magnetLink}`;
                        const anchor = createAnchor(fullMagnetLink, magnetLink, '_blank');

                        const beforeText = text.slice(lastIndex, magnetMatch.index);
                        fragment.appendChild(document.createTextNode(beforeText));
                        fragment.appendChild(anchor);
                        lastIndex = magnetRegex.lastIndex;
                    }
                }

                let specificTextMatch;
                while ((specificTextMatch = specificTextRegex.exec(text)) !== null) {
                    const specificText = specificTextMatch[0];
                    if (!isLongNumber(specificText) && !isExcludedPattern(specificText) && !isContinuousSameCharacters(specificText) && !currentUrl.includes(specificText)) {
                        const anchor = createAnchor(`${siteRootUrl}/${specificText}`, specificText, '_blank');

                        const beforeText = text.slice(lastIndex, specificTextMatch.index);
                        fragment.appendChild(document.createTextNode(beforeText));
                        fragment.appendChild(anchor);
                        lastIndex = specificTextRegex.lastIndex;
                    }
                }

                const remainingText = text.slice(lastIndex);
                if (remainingText) {
                    fragment.appendChild(document.createTextNode(remainingText));
                }

                parent.replaceChild(fragment, node);
                fragment.textContent = '';
            }
        });

        setTimeout(() => {
            scriptRunning = false;
            observer.disconnect();
        }, 3 * 60 * 1000);
    }

    function createAnchor(href, text, target) {
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.textContent = text;
        anchor.target = target;
        return anchor;
    }

    function getTextNodes(node) {
        const textNodes = [];
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            for (const child of node.childNodes) {
                textNodes.push(...getTextNodes(child));
            }
        }
        return textNodes;
    }

    function isLongNumber(str) {
        return /^\d{6,}$/.test(str);
    }

    function isExcludedPattern(str) {
        const excludedPatterns = [
            /^FC2-PPV-\d+$/,
            /^FC2-\d+$/,
            /^PPV-\d+$/
        ];
        return excludedPatterns.some(pattern => pattern.test(str));
    }

    function isContinuousSameCharacters(str) {
        return /^(.)\1{5,}$/.test(str);
    }

    function runWhenReady() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            convertLinksAndTexts();
        } else {
            document.addEventListener('DOMContentLoaded', convertLinksAndTexts);
        }
    }

    function setFavicon() {
        const link = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
        if (link && link.href) {
            GM_setValue('favicon', link.href);
            GM_registerMenuCommand('更新图标', () => {
                setFavicon();
            });
        }
    }

    function updateIcon() {
        const faviconUrl = GM_getValue('favicon');
        if (faviconUrl) {
            GM_setIcon(faviconUrl);
        }
    }

    runWhenReady();
    setFavicon();
    updateIcon();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    convertLinksAndTexts();
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();