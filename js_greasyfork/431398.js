// ==UserScript==
// @name         Duanmao HTTPS
// @namespace    CCCC_David
// @version      0.4.0
// @description  使断锚网页版支持 HTTPS
// @author       CCCC_David
// @match        https://duanmao.top/*
// @run-at       document-start
// @grant        none
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/431398/Duanmao%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/431398/Duanmao%20HTTPS.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const fixURL = (url) => url === undefined ? undefined : url.replace(/^https?:\/\/cdn1\.duanmao\.top\//i, 'https://duanmao.top/')
                                                               .replace(/^http:\/\//i, 'https://');
    ah.proxy({
        onRequest: (config, handler) => {
            config.url = fixURL(config.url);
            handler.next(config);
        },
        onError: (err, handler) => {
            handler.next(err);
        },
        onResponse: (response, handler) => {
            handler.next(response);
        },
    });

    const pathname = window.location.pathname;
    const isForumPage = pathname === '/forum';

    const addMetaTags = () => {
        const metaReferrer = document.createElement('meta');
        metaReferrer.name = 'referrer';
        metaReferrer.content = 'same-origin';
        document.head.appendChild(metaReferrer);
        const metaCSP = document.createElement('meta');
        metaCSP.httpEquiv = 'Content-Security-Policy';
        metaCSP.content = "base-uri 'self'; script-src 'self'; object-src 'none'; upgrade-insecure-requests";
        document.head.appendChild(metaCSP);
    };

    const updateElementURL = (el) => {
        const tagName = el.nodeName.toLowerCase();
        // There are many HTML tag attributes which can include URLs
        // (see https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value),
        // but here we just deal with the most common two cases:
        // - <a href="..."></a>
        // - <img src="..." />
        if (tagName === 'a') {
            el.href = fixURL(el.href);
        } else if (tagName === 'img') {
            el.src = fixURL(el.src);
        }
    };

    const settingsHasHTTPS = () => {
        try {
            return JSON.parse(window.localStorage.getItem('cdn')).data === 0;
        } catch {
            return false;
        }
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const el of mutation.addedNodes) {
                    if (el.nodeName.toLowerCase() === 'head') {
                        addMetaTags();
                    }
                    updateElementURL(el);
                }
            }
        }
    });

    observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
    });

    if (document.head) {
        addMetaTags();
    }

    for (const tagName of ['a', 'img']) {
        for (const el of document.getElementsByTagName(tagName)) {
            updateElementURL(el);
        }
    }

    if (isForumPage) {
        window.addEventListener('DOMContentLoaded', () => {
            // If the inline script was blocked, we execute it again.
            if (!document.querySelector('meta[name="viewport"]')) {
                window.coverSupport = 'CSS' in window && typeof CSS.supports === 'function' && (CSS.supports('top: env(a)') || CSS.supports('top: constant(a)'));
                const metaViewport = document.createElement('meta');
                metaViewport.name = 'viewport';
                metaViewport.content = 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' + (window.coverSupport ? ', viewport-fit=cover' : '');
                document.head.appendChild(metaViewport);
            }

            if (!settingsHasHTTPS()) {
                // If the "/renew" request happened before our Ajax hook, it might be blocked due to Mixed Content error.
                // Here we send it again.
                try {
                    for (const func of getApp().$options.onLaunch) {
                        if (func.toString().includes('renew') && func.length === 0) {
                            func();
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    if (pathname === '/fourm') { // cSpell:disable-line
        window.location.replace('/forum');
    }

    console.log('Duanmao HTTPS script is loaded');
})();
