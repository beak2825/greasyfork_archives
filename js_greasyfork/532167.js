// ==UserScript==
// @name         X/Twitter Ad Hider
// @name:zh-CN   隐藏 X/Twitter 广告
// @name:zh-TW   隱藏 X/Twitter 廣告
// @name:ja      X/Twitter 広告非表示
// @name:es      Ocultar Anuncios de X/Twitter
// @name:ar      إخفاء إعلانات X/Twitter
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Hides promoted tweets (ads) on the X/Twitter website.
// @description:zh-CN 在 X/Twitter 网站上隐藏推广推文（广告）。
// @description:zh-TW 在 X/Twitter 網站上隱藏推廣推文（廣告）。
// @description:ja      X/Twitter ウェブサイト上のプロモーションツイート（広告）を非表示にします。
// @description:es      Oculta los tweets promocionados (anuncios) en el sitio web de X/Twitter.
// @description:ar      يخفي التغريدات المروجة (الإعلانات) على موقع X/Twitter.
// @author       Timothy Tao
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://x.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532167/XTwitter%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/532167/XTwitter%20Ad%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const TWEET_CONTAINER_SELECTOR = 'article[role="article"]';
    const AD_TEXTS = ['Ad']; 
    const AD_DATA_TESTID_SELECTOR = '[data-testid="placementTracking"]';
    const TIMELINE_OBSERVER_TARGET_SELECTOR = 'main[role="main"]';

    // --- 核心功能 ---

    /**
     * 检查给定的推文元素是否是广告，如果是则隐藏它
     * @param {HTMLElement} tweetElement - 要检查的推文 <article> 元素
     */
    function checkAndHideAd(tweetElement) {
        if (tweetElement.style.display === 'none') {
            return;
        }

        // 方法 1: 检查特定的 data-testid 属性
        const placementTrackingElement = tweetElement.querySelector(AD_DATA_TESTID_SELECTOR);
        if (placementTrackingElement) {
            // console.log('Hiding ad (data-testid):', tweetElement);
            hideElement(tweetElement);
            return;
        }

        // 方法 2: 检查是否包含广告指示文本
        const spans = tweetElement.querySelectorAll('span');
        for (const span of spans) {
            const textContent = span.textContent?.trim();
            if (textContent && AD_TEXTS.some(adText => textContent.toLowerCase() === adText.toLowerCase())) {
                if (span.offsetParent !== null) { // 简单的可见性检查
                    // console.log(`Hiding ad (text: ${textContent}):`, tweetElement);
                    hideElement(tweetElement);
                    return;
                }
            }
        }
    }

    /**
     * 隐藏指定的元素
     * @param {HTMLElement} element
     */
    function hideElement(element) {
        element.style.setProperty('display', 'none', 'important');
    }

    /**
     * 处理 DOM 变动，检查新增的节点是否包含广告推文
     * @param {MutationRecord[]} mutationsList
     * @param {MutationObserver} observer
     */
    function handleMutations(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(TWEET_CONTAINER_SELECTOR)) {
                            checkAndHideAd(node);
                        } else { // 检查子节点，以防整个块被添加
                            const potentialTweets = node.querySelectorAll(TWEET_CONTAINER_SELECTOR);
                            potentialTweets.forEach(checkAndHideAd);
                        }
                    }
                });
            }
        }
    }

    // --- 初始化观察者 ---

    let observer = null;

    function startObserver() {
        const targetNode = document.querySelector(TIMELINE_OBSERVER_TARGET_SELECTOR);

        if (targetNode && !observer) {
            console.log('X/Twitter Ad Hider: Timeline found. Starting observer.');

            const existingTweets = document.querySelectorAll(TWEET_CONTAINER_SELECTOR);
            existingTweets.forEach(checkAndHideAd);

            observer = new MutationObserver(handleMutations);
            observer.observe(targetNode, { childList: true, subtree: true });

        } else if (!targetNode) {
            // console.log('X/Twitter Ad Hider: Timeline target not found. Retrying in 500ms...');
            setTimeout(startObserver, 500);
        }
    }

    // --- 脚本启动 ---
    console.log('X/Twitter Ad Hider: Script loaded. Waiting to start observer...');
    setTimeout(startObserver, 1000);

})();