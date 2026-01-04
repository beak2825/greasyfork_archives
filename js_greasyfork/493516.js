// ==UserScript==
// @name         通载智厨BI增强工具
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  能用就行
// @author       WindOSX
// @match        https://bi.doumiaolecan.com/*
// @icon         https://bi.doumiaolecan.com/favicon.ico
// @grant        unsafeWindow
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/493516/%E9%80%9A%E8%BD%BD%E6%99%BA%E5%8E%A8BI%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/493516/%E9%80%9A%E8%BD%BD%E6%99%BA%E5%8E%A8BI%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const window = unsafeWindow;

    setInterval(setSelectable, 1000);

    setSelectable();

    function setSelectable() {
        if (window.location.hash.indexOf('#/share')) return;
        getElement(window.document, 'table').then(element => {
            element.style.userSelect = 'text';
        });

        getElement(window.document, '.tableContent').then(element => {
            element.style.userSelect = 'text';
        });

        getElement(window.document, '.sumBox').then(element => {
            element.style.userSelect = 'text';
        });
    }

    getElement(window.document, '.tableContent').then(element => {
        element.style.userSelect = 'text';
    });

    getElement(window.document, '.sumBox').then(element => {
        element.style.userSelect = 'text';
    });

    function getElement(parent, selector, timeout = 0) {
        return new Promise(resolve => {
            let result = parent.querySelector(selector);
            if (result) return resolve(result);
            let timer;
            const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
            if (mutationObserver) {
                const observer = new mutationObserver(mutations => {
                    for (let mutation of mutations) {
                        for (let addedNode of mutation.addedNodes) {
                            if (addedNode instanceof Element) {
                                result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                                if (result) {
                                    observer.disconnect();
                                    timer && clearTimeout(timer);
                                    return resolve(result);
                                }
                            }
                        }
                    }
                });
                observer.observe(parent, {
                    childList: true,
                    subtree: true
                });
                if (timeout > 0) {
                    timer = setTimeout(() => {
                        observer.disconnect();
                        return resolve(null);
                    }, timeout);
                }
            } else {
                const listener = e => {
                    if (e.target instanceof Element) {
                        result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
                        if (result) {
                            parent.removeEventListener('DOMNodeInserted', listener, true);
                            timer && clearTimeout(timer);
                            return resolve(result);
                        }
                    }
                };
                parent.addEventListener('DOMNodeInserted', listener, true);
                if (timeout > 0) {
                    timer = setTimeout(() => {
                        parent.removeEventListener('DOMNodeInserted', listener, true);
                        return resolve(null);
                    }, timeout);
                }
            }
        });
    }
})();