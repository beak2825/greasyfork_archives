// ==UserScript==
// @name         自动跳转到 Reddit 官方中文翻译的页面
// @namespace    reddit.com
// @version      0.8
// @description  Automatically jump to the official Chinese translation page of Reddit
// @author       xxnuo
// @match        *://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537173/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%20Reddit%20%E5%AE%98%E6%96%B9%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E7%9A%84%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/537173/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%20Reddit%20%E5%AE%98%E6%96%B9%E4%B8%AD%E6%96%87%E7%BF%BB%E8%AF%91%E7%9A%84%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const paramToAdd = 'tl=zh-hans';
    const redditPostPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/comments\/[a-zA-Z0-9_]+(\/[a-zA-Z0-9_]*\/?)?($|\?.*)/;

    let lastHandledUrl = '';
    let redirectCheckTimer = null;

    function performRedirectChecks() {
        const currentBrowserUrl = window.location.href;
        if (currentBrowserUrl === lastHandledUrl) {
            return;
        }
        if (!redditPostPattern.test(currentBrowserUrl)) {
            lastHandledUrl = currentBrowserUrl;
            return;
        }

        const currentUrlObj = new URL(currentBrowserUrl);

        if (currentUrlObj.searchParams.get('tl') !== 'zh-hans') {
            const oldTlParam = currentUrlObj.searchParams.get('tl');
            currentUrlObj.searchParams.set('tl', 'zh-hans');
            const newRedirectUrl = currentUrlObj.href;
            if (newRedirectUrl !== currentBrowserUrl) {
                lastHandledUrl = newRedirectUrl;
                window.location.replace(newRedirectUrl);
                return;
            }
        }
        lastHandledUrl = currentBrowserUrl;
    }

    function scheduleRedirectCheck() {
        clearTimeout(redirectCheckTimer);
        redirectCheckTimer = setTimeout(performRedirectChecks, 100);
    }
    performRedirectChecks();
    const observer = new MutationObserver((mutationsList, obs) => {
        scheduleRedirectCheck();
    });
    const targetNode = document.head || document.documentElement;
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        const fallbackObserver = new MutationObserver((mutationsList, obs) => {
            scheduleRedirectCheck();
        });
        if (document.documentElement) {
            fallbackObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                if (document.documentElement) {
                    fallbackObserver.observe(document.documentElement, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        }
    }
})();