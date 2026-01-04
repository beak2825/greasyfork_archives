// ==UserScript==
// @name         Bangumi高清图片
// @namespace    rabbitohh.top
// @version      1.5
// @description  同时支持封面和角色图高清化，角色图仅在用户页面生效
// @author       rabbitohh & deepseek
// @match        *://bgm.tv/*
// @match        *://bangumi.tv/*
// @match        *://chii.in/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526673/Bangumi%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/526673/Bangumi%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REPLACE_RULES = [
        // 封面图规则（全局生效）
        {
            match: /(\/pic\/cover\/)s\//,
            replace: '$1l/',
            insert: '/r/400'
        },
        {
            match: /(\/pic\/cover\/)c\//,
            replace: '$1l/',
            insert: '/r/400'
        },
        // 角色图规则（仅在用户页面生效）
        {
            match: /(\/pic\/crt\/)g\//,
            replace: '$1m/',
            insert: '',
            // 仅当页面URL匹配用户页面时生效
            enabled: window.location.pathname.startsWith('/user/')
        }
    ];

    function enhancedReplace(url) {
        let newUrl = url;
        for (const rule of REPLACE_RULES) {
            // 检查规则是否启用
            if (rule.enabled === false) continue;

            if (rule.match.test(newUrl)) {
                newUrl = newUrl
                    .replace(/\/\/lain\.bgm\.tv\//, `//lain.bgm.tv${rule.insert}/`)
                    .replace(rule.match, rule.replace);
                break;
            }
        }
        return newUrl;
    }

    function safeUpgradeImages() {
        document.querySelectorAll('img[src*="lain.bgm.tv"]:not([data-upgraded])').forEach(img => {
            try {
                const original = img.src;
                const newSrc = enhancedReplace(original);

                if (newSrc === original) return;

                const testImg = new Image();
                testImg.onload = function() {
                    img.src = newSrc;
                    img.setAttribute('data-upgraded', 'true');
                    img.style.cssText = 'max-width: 100%; height: auto;';
                };
                testImg.onerror = function() {
                    console.warn('图片加载失败，保留原始地址:', original);
                    img.src = original;
                };
                testImg.src = newSrc;

            } catch (error) {
                console.error('图片处理失败:', error);
            }
        });
    }

    function init() {
        // 重新检查规则状态（页面可能变化）
        REPLACE_RULES[2].enabled = window.location.pathname.startsWith('/user/');

        setTimeout(safeUpgradeImages, 2000);
        document.addEventListener('DOMContentLoaded', safeUpgradeImages);
        window.addEventListener('load', safeUpgradeImages);
    }

    let isProcessing = false;
    const safeObserver = new MutationObserver((mutations) => {
        if (!isProcessing) {
            isProcessing = true;
            requestIdleCallback(() => {
                safeUpgradeImages();
                isProcessing = false;
            }, { timeout: 1000 });
        }
    });

    safeObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // 监听页面变化（SPA应用）
    const urlObserver = new MutationObserver(() => {
        REPLACE_RULES[2].enabled = window.location.pathname.startsWith('/user/');
    });
    urlObserver.observe(document, { subtree: true, childList: true });

    init();
})();