// ==UserScript==
// @name         移除百度热搜、百度广告
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  删除百度页面中的热门搜索部分
// @author       tomoyachen
// @match        *://*.baidu.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/520191/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E3%80%81%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/520191/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%83%AD%E6%90%9C%E3%80%81%E7%99%BE%E5%BA%A6%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义黑名单域名，会从搜索结果中过滤这些结果
    const blacklist = [
        'lewan.baidu.com',
    ];

    const observer = new MutationObserver(() => {
        // ---------- 移除热搜 ----------
        // 首页底部热搜
        const hotSearchWrapper = document.getElementById('s-hotsearch-wrapper');
        if (hotSearchWrapper) {
            hotSearchWrapper.remove();
        }


        // 首页搜索栏热搜
        const hotSearchInput = document.querySelector('input.s_ipt[id=kw][name=wd]')
        if (hotSearchInput) {
            hotSearchInput.placeholder = ''
        }

        const hotSearchInput2 = document.querySelector('#chat-textarea')
        if (hotSearchInput2) {
            hotSearchInput2.placeholder = ''
        }


        // 搜索后右侧热搜
        const hotSearchWrapper2 = document.getElementById('content_right');
        if (hotSearchWrapper2) {
            hotSearchWrapper2.remove();
        }

        // 首页底部热搜 ver2
        const hotSearchWrapper3 = document.querySelector('#wrapper > #head > #s_wrap');
        if (hotSearchWrapper3) {
            hotSearchWrapper3.remove();
        }

        // ---------- 移除广告项 ----------
        // 广告类型 1
        const ads = document.querySelectorAll('.ec-tuiguang');

        ads.forEach(ad => {
            const parentResult = ad.closest('.EC_result');

            if (parentResult) {
                parentResult.remove();
            }
        });

        // 广告类型 2
        const ads2 = document.querySelectorAll('a.c-gap-left');
        ads2.forEach(ad => {
            const parentResult = ad.closest('.result.c-container');

            if (parentResult) {
                parentResult.remove();
            }
        });

        // 百科广告
        const baikeAd = document.getElementById('J-union-wrapper');
        if (baikeAd) {
            baikeAd.remove();
        }

        // ---------- 一些扩展功能 ----------
        // 移除命中黑名单的搜索结果
        const searchResults = document.querySelectorAll('.result.c-container');

        searchResults.forEach(element => {
            // 一般类型的搜索结果
            const muValue = element.getAttribute('mu');
            // 百度旗下的内容
            const showUrlElement = element.querySelector('.c-showurl');

            // 检查搜索结果是否包含黑名单
            const containsBlacklistWord = blacklist.some(word => {
                return (muValue && muValue.includes(word)) || (showUrlElement && showUrlElement.textContent.includes(word));
            });

            if (containsBlacklistWord) {
                // 保留 “为你推荐”，算是一种关键字联想
                const nestedContainer = element.querySelector('.c-container');
                if (nestedContainer) {
                    nestedContainer.remove();
                } else {
                    element.remove();
                }
            }
        });

    });

    observer.observe(document.documentElement, { childList: true, subtree: true });


})();
