// ==UserScript==
// @name         百度百科精简【电脑端】
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  隐藏百度百科中的广告和杂项内容
// @author       黄瓜战神
// @match        *://baike.baidu.com/*
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/532450/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%B2%BE%E7%AE%80%E3%80%90%E7%94%B5%E8%84%91%E7%AB%AF%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/532450/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E7%B2%BE%E7%AE%80%E3%80%90%E7%94%B5%E8%84%91%E7%AB%AF%E3%80%91.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const selectors = [
        '[class^="index-module_pageHeader"]',
        '[class^="btnList"]',
        '#J-lemma-video-list',
        '#J-lemma-structured',
        '#J-right-tashuo',
        '#side > div[class*="lemmaStatistics"]',
        'div[class*="secondContainer"] > div[class*="secondContent"] > div[class*="contentBottom"]:last-child',
        'div[class*="secondContent"] > div[class*="contentTop"]:first-child > div[class*="posterFlag"]:last-child',
        'div[class*="mainContent"] > div[class*="contentTab"]:first-child > div[class*="topToolsWrap"]:first-child',
        '#J-graph-card',
        'div[class^="editLemma_"]',
        '[class^="ttsBtn"], [class^="paragraph"]',
        'div[class^="albumList"]',
        '#root > div[class*="pageWrapper"] > div:last-child',
        'div[class*="posterFlag"][class*="authority"]:nth-child(3)',
        '#J-bottom-tashuo',
        '#J-lemma-main-wrapper > div:nth-child(3)',
        '#J-side-auth',
        '#side > div[class*="normalProfessional"]:nth-child(2)',
        'div[class^="lemmaSciencePaper_"]:last-child > div[class^="sciencePaperTitle_"]:first-child > div[class^="paperFrom_"]:last-child',
        'div[class^="worksAndRelation"]',
        'div[class^="posterFlag"][class*="excellent"][class*="largeFeature"]',
        'div[class^="featurePosterBg"] > div[class^="posterBg"]:last-child > div[class^="posterMiddle"]:nth-child(3)',
        'div[class^="featurePosterBg"] > div[class^="posterBg"]:last-child > div:last-child',
        'div[class^="posterBg"] > div[class^="posterTop"]:nth-child(2) > div[class^="largeSummary"]:last-child',
        '#side > div[class^="bjhWrapper_"]',
        '#J-hotspot',
        'div[class^="mainContent"] > div[class*="contentTab"] > div[class*="authorityList"]',
        'div[class^="posterFlag_"][class*="excellent"][class*="secondHeader"]:nth-child(2)',
        'div[class^="sendFlower_"][class*="light_"][class*="isLogin_"]:last-child',
        '#J-goAuthBox',
        'div[class^="posterFlag_"][class*="excellent"][class*="undefined"]:nth-child(3)',
        'div[class^="lemmaSciencePaper_"]:last-child',
        'div[class^="posterLeft_"]:first-child > div:first-child > div[class^="topToolsWrap_"]:first-child',
        'div[class^="poster_"] > div[class^="posterLeft_"]:first-child > div[class^="posterBottom_"]:last-child',
        'div[class^="editPrompt_"]',
        '#side > div[class^="slideAdBox_"]:nth-child(2)',
        '#J-union-wrapper'
    ];

    function hideElements() {
        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';  // 隐藏元素
            });
        }
    }

    // 初始隐藏
    hideElements();

    // 监听 DOM 变化，防止异步加载的元素遗漏
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // 屏蔽指定图片链接
    const observerImg = new MutationObserver(() => {
        document.querySelectorAll('img[src*="bkimg.cdn.bcebos.com/pic"]').forEach(img => {
            if (img.src.includes("resize,m_lfit,limit_1,h_452")) {
                img.style.display = 'none';  // 隐藏图片
            }
        });
    });
    observerImg.observe(document.body, { childList: true, subtree: true });

})();
