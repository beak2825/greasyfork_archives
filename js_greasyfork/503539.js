// ==UserScript==
// @name         禁漫天堂-快速切換上下話與頁面
// @name:zh-TW   禁漫天堂-快速切換上下話與頁面
// @name:zh-CN   禁漫天堂-快速切换上下话与页面
// @namespace    https://github.com/jmsch23280866
// @version      1.1
// @description        使用 Shift + ( ← 或 A ) 切換上一話，Shift + ( → 或 D ) 切換下一話。使用 [←] 或 [A] 切換上一頁，使用 [→] 或 [D] 切換下一頁。(此腳本由ChatGPT協助撰寫)
// @description:zh-TW  使用 Shift + ( ← 或 A ) 切換上一話，Shift + ( → 或 D ) 切換下一話。使用 [←] 或 [A] 切換上一頁，使用 [→] 或 [D] 切換下一頁。(此腳本由ChatGPT協助撰寫)
// @description:zh-CN  使用 Shift + ( ← 或 A ) 切换上一话，Shift + ( → 或 D ) 切换下一话。使用 [←] 或 [A] 切换上一页，使用 [→] 或 [D] 切换下一页。(此脚本由ChatGPT协助撰写)
// @author       特務E04
// @match        *://18comic.vip/photo/*
// @match        *://18comic.org/photo/*
// @match        *://jmcomic.me/photo/*
// @match        *://jmcomic1.me/photo/*
// @match        *://18comic.*/photo/*
// @match        *://18comic*.*/photo/*
// @match        *://jmcomic.*/photo/*
// @match        *://jmcomic*.*/photo/*
// @match        *://jm-comic*.*/photo/*
// @grant        none
// @noframes
// @supportURL   https://github.com/jmsch23280866/18comic-JMcomic-Change-Chapter-and-Page/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503539/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82-%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E8%A9%B1%E8%88%87%E9%A0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/503539/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82-%E5%BF%AB%E9%80%9F%E5%88%87%E6%8F%9B%E4%B8%8A%E4%B8%8B%E8%A9%B1%E8%88%87%E9%A0%81%E9%9D%A2.meta.js
// ==/UserScript==

// 此腳本靈感取自 https://greasyfork.org/scripts/453029

(function () {
    'use strict';

    // 快取常用的元素選擇器
    const prevChapterBtn = document.querySelector('.fa-angle-double-left.fa');
    const nextChapterBtn = document.querySelector('.fa-angle-double-right.fa');
    const albumListBtn = document.querySelector('.fa-list-alt.far');
    const navTabs = document.querySelector('ul.nav-tabs');
    const topNav = document.querySelector('div[class="top-nav"]');
    const comicTopNav = document.querySelector('div[id="Comic_Top_Nav"]');

    let scrollAmount = 0;
    let isScrolling = false;
    let lastScrollTop = 0;

    // 事件處理函數
    const handleKeyDown = (e) => {
        let actionTaken = false;

        // 判斷是否切換上一話與下一話
        if (e.shiftKey && (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd')) {
            nextChapterBtn?.click();
            actionTaken = true;
        } else if (e.shiftKey && (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a')) {
            prevChapterBtn?.click();
            actionTaken = true;
        } 
        // 返回漫畫簡介
        else if (e.key === 'Escape') {
            albumListBtn?.click();
            actionTaken = true;
        }

        if (actionTaken) {
            e.preventDefault();
        }
    };

    // 實現上下頁切換，並檢查是否在第一頁或最後一頁
    const handlePageSwitch = (event) => {
        const prevPageBtn = document.querySelector("button.owl-prev");
        const nextPageBtn = document.querySelector("button.owl-next");

        if (event.key === 'A' || event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
            if (prevPageBtn && prevPageBtn.classList.contains('disabled')) {
                prevChapterBtn?.click(); // 當在第一頁時，切換到上一話
            } else {
                prevPageBtn?.click(); // 否則切換到上一頁
            }
        } else if (event.key === 'D' || event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
            if (nextPageBtn && nextPageBtn.classList.contains('disabled')) {
                nextChapterBtn?.click(); // 當在最後一頁時，切換到下一話
            } else {
                nextPageBtn?.click(); // 否則切換到下一頁
            }
        }
    };

    // S 和 W 鍵的事件處理函數
    const handleSWKeys = (event) => {
        if (isScrolling) return; // 如果正在滾動，則返回

        if (event.key.toLowerCase() === 'w') {
            scrollAmount = -400; // 向上平滑滾動
        } else if (event.key.toLowerCase() === 's') {
            scrollAmount = 400; // 向下平滑滾動
        }
        isScrolling = true;
        smoothScroll();
    };

    // 平滑滾動函數
    const smoothScroll = () => {
        window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(() => {
            isScrolling = false;
        }, 350); // 等待滾動完成後重置滾動狀態
    };

    // 停止滾動
    const stopScroll = (event) => {
        if (event.key.toLowerCase() === 'w' || event.key.toLowerCase() === 's') {
            scrollAmount = 0;
        }
    };

    // 檢查元素是否在螢幕可見範圍內
    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // 節流函數
    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // 滾輪事件處理函數
    const handleWheel = (event) => {
        const nextPageBtn = document.querySelector("button.owl-next");

        if (isElementInViewport(navTabs) && event.deltaY > 0) {
            nextPageBtn?.click();
        }
    };

    // 滾動事件處理函數
    const handleScroll = () => {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
        if (currentScrollTop > lastScrollTop) {
            // 向下滾動，隱藏導航欄
            topNav.style.transform = 'translateY(-100%)';
            comicTopNav.style.transform = 'translateY(-100%)';
        } else {
            // 向上滾動，顯示導航欄
            topNav.style.transform = 'translateY(0)';
            comicTopNav.style.transform = 'translateY(0)';
        }
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // 避免負值
    };

    // 綁定鍵盤事件
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handlePageSwitch);
    document.addEventListener('keydown', handleSWKeys);
    document.addEventListener('keyup', stopScroll);
    document.addEventListener('wheel', throttle(handleWheel, 500)); // 使用節流函數
    window.addEventListener('scroll', throttle(handleScroll, 100));

})();