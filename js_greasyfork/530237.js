// ==UserScript==
// @name         Disable blank target
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在当前页面打开同域名超链接，而不是跳转新页面，适配所有网站，包括头条和网易。Disable open links in a new window/tab(based on the hostname).
// @author       Logan Wang
// @copyright    Logan Wang
// @homepage     https://github.com/azone
// @license      MIT
// @match        http*://*/*
// @icon         none
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530237/Disable%20blank%20target.user.js
// @updateURL https://update.greasyfork.org/scripts/530237/Disable%20blank%20target.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const neteasyRe = /163\.com$/
    const toutiaoRe = /toutiao\.com$/

    const originalURL = window.location;

    if (toutiaoRe.test(originalURL.host)) {
        const listener = document.addEventListener;
        document.addEventListener = (event, listenerFunc, options) => {
            if (event !== 'click') {
                listener(event, listenerFunc, options);
            }
        };
    }

    function shouldRemove(element) {
        const href = element.href;
        if (!href) {
            return false;
        }

        const url = new URL(href);
        return !url.host || url.host === originalURL.host || neteasyRe.test(url.host);
    }

    function removeBlankTargetIfNecessary(rootElement) {
        const selector = rootElement.querySelectorAll;
        if (!selector) {
            return;
        }

        const elements = rootElement.querySelectorAll('a[target="_blank"]');
        for (const element of elements) {
            if (shouldRemove(element)) {
                element.removeAttribute('target');
            }
        }
    }

    function removeBaseElements() {
        const baseElements = document.querySelectorAll('base[target="_blank"]');
        for (const base of baseElements) {
            base.parentNode.removeChild(base);
        }
    }

    function processElements() {
        removeBlankTargetIfNecessary(document);

        removeBaseElements();
    }

    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', (e) => {
            processElements();
        });
    } else {
        processElements();
    }

    function observeChanges(records, observer) {
        for (const record of records) {
            if (record.type === 'attributes') {
                if (record.attributeName === 'target' && record.target.getAttribute(record.attributeName) === '_blank') {
                    if (shouldRemove(record.target)) {
                        record.target.removeAttribute(record.attributeName);
                    } else if (record.target.nodeName === 'BASE') {
                        record.target.parentNode.removeChild(record.target);
                    }
                }
            } else if (record.addedNodes.length > 0) {
                for (const node of record.addedNodes) {
                    if (node.nodeName === 'A' && shouldRemove(node)) {
                        node.removeAttribute('target');
                    } else if (node.nodeName === 'BASE' && node.getAttribute('target') === '_blank') {
                        node.parentNode.removeChild(node);
                    } else {
                        removeBlankTargetIfNecessary(node);
                    }
                }
            }
        }
    }

    const observer = new MutationObserver(observeChanges);
    observer.observe(document, {attributes: true, subtree: true, childList: true});
})();