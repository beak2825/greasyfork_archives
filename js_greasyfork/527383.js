// ==UserScript==
// @name         Bing去广告自动加载下一页
// @namespace    http://kuhunt.com/
// @version      0.1
// @description  Remove all ads on Bing search results page and auto - load the next page
// @author       kuhunt
// @match        *://cn.bing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527383/Bing%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/527383/Bing%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来移除广告
    function removeBingAds() {
        // 移除常见的 div 和 li 广告
        const commonAds = document.querySelectorAll('div.b_ad, li.b_ad,ol#b_results li.b_ans, li.b_msg');
        commonAds.forEach(ad => {
            ad.style.display = 'none';
        });

        // 移除特定的 li 广告，根据类名和子元素特征
        const specificLiAds = document.querySelectorAll('li.b_algo:has(.sb_adTA_title_link_cn), li:has(.b_adPATitle),div.b_bza_pole:has(.sb_adTA_title_link_cn)');
        specificLiAds.forEach(ad => {
            ad.style.display = 'none';
        });
    }

    // 页面加载完成后立即执行移除广告的操作
    window.addEventListener('load', removeBingAds);

    // 监听页面的 DOM 变化，以处理动态加载的广告
    const observer = new MutationObserver(removeBingAds);
    observer.observe(document.body, { childList: true, subtree: true });

    // 标志变量，用于记录是否已经触发了加载下一页的操作
    let isNextPageLoading = false;

    // 定义一个函数来处理滚动事件
    function handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        // 当滚动到距离页面底部一定距离时触发加载下一页，且之前未触发过
        if (scrollTop + clientHeight >= scrollHeight - 20 &&!isNextPageLoading) {
            const nextPageButton = document.querySelector('a.sb_pagN.sb_pagN_bp.b_widePag.sb_bp');
            if (nextPageButton) {
                const nextPageUrl = new URL(nextPageButton.href, window.location.origin).toString();
                isNextPageLoading = true; // 标记为正在加载下一页
                loadNextPageResults(nextPageUrl);
            }
        }
    }

    // 定义一个函数来加载下一页的结果
    async function loadNextPageResults(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const nextPageResults = doc.querySelectorAll('#b_results > li');
                const currentResultsContainer = document.getElementById('b_results');
              //移除旧分页
                const oldPagination = document.querySelector('li.b_pag');
                if (oldPagination) {
                    oldPagination.parentNode.removeChild(oldPagination);
                }
                nextPageResults.forEach(result => {
                    currentResultsContainer.appendChild(result);
                });
              //修复图标
              const imageContainers = currentResultsContainer.querySelectorAll('.rms_iac');
                imageContainers.forEach(container => {
                    const src = container.getAttribute('data-src');
                    if (src) {
                        const img = document.createElement('img');
                        img.src = src;
                      if(parseInt(container.style.height)!==32){
                        img.style.height = container.style.height;
                        img.style.width = container.style.width;
                      }

                        container.innerHTML = '';
                        container.appendChild(img);
                    }
                });
                removeBingAds(); // 移除新加载结果中的广告
            }
        } catch (error) {
            console.error('Error loading next page:', error);
        } finally {
            isNextPageLoading = false; // 加载完成或出错，重置标志
        }
    }

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
})();