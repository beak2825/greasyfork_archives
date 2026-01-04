// ==UserScript==
// @name 增強漫畫櫃手機版
// @namespace http://tampermonkey.net/
// @version 1.2
// @description 漫畫櫃自動隐藏頂部元素、中鍵捲動頁面、圖片高度為視窗高度
// @license MIT
// @match *://m.manhuagui.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/528464/%E5%A2%9E%E5%BC%B7%E6%BC%AB%E7%95%AB%E6%AB%83%E6%89%8B%E6%A9%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528464/%E5%A2%9E%E5%BC%B7%E6%BC%AB%E7%95%AB%E6%AB%83%E6%89%8B%E6%A9%9F%E7%89%88.meta.js
// ==/UserScript==
(function() {
  'use strict';

    // 滑鼠中鍵捲動頁面（優化版）
    let isMiddleButtonPressed = false;
    let [lastX, lastY] = [0, 0];

    document.addEventListener('mousedown', e => {
        if (e.button === 1) {
            isMiddleButtonPressed = true;
            document.body.style.cursor = 'grab';
            [lastX, lastY] = [e.clientX, e.clientY];
            e.preventDefault();
        }
    });

    document.addEventListener('mouseup', e => {
        if (e.button === 1) {
            isMiddleButtonPressed = false;
            document.body.style.cursor = 'default';
        }
    });

    document.addEventListener('mousemove', e => {
        if (isMiddleButtonPressed) {
            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            window.scrollBy(-deltaX * 1.5, -deltaY * 4); // 調整滑動速度
            [lastX, lastY] = [e.clientX, e.clientY];
        }
    });
const url = window.location.href;
if (url.includes('html')&&url.includes('/comic/')) {
//改變css style
    const style = document.createElement('style');
    style.textContent = `
        html {
            overflow: overlay;
        }
        .manga-box {
            text-align: center;
        }
        footer {
            padding:0;
        }
        #popCat {
            z-Index: 10;
        }
        #popHistory {
            z-Index: 10;
        }
        #popSearch {
            z-Index: 10;
        }
        #popShelf {
            z-Index: 10;
        }
        .mainnav {
            z-Index: 9;
        }
        .manga-box' {
            z-Index: 5;
        }
        .manga-panel-box {
            z-Index: 4;
        }
        .manga-panel-prev {
            z-Index: 4;
        }
    `;
    document.head.appendChild(style);

//隱藏元素
  // 获取要隐藏的元素
    const elementsToHide = ['.main-nav', '.main-bar'];
    const header = document.querySelector('header');
    const headerHeight = '42px';

    if (header) {
        Object.assign(header.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: headerHeight,
            display: 'block', opacity: '0', zIndex: '1000', marginBottom: '0'
        });

        [...elementsToHide, 'header'].forEach(selector => {
            const el = document.querySelector(selector);
            el && el.addEventListener('mouseover', () => toggleHeaderVisibility(true));
            el && el.addEventListener('mouseout', () => toggleHeaderVisibility(false));
        });

        // 頁面載入時先隱藏元素
        elementsToHide.forEach(selector => {
            const el = document.querySelector(selector);
            el && (el.style.display = 'none');
        });
    }

    function toggleHeaderVisibility(show) {
        header.style.opacity = show ? '1' : '0';
        elementsToHide.forEach(selector => {
            const el = document.querySelector(selector);
            el && (el.style.display = show ? 'block' : 'none');
        });
//        header.style.height = show ? '34px' : headerHeight;
        header.style.position= show ? 'relative' : 'absolute';
    }

    // 動態改變圖片大小
    function resizeImage() {
        const img = document.querySelector('.manga-box img');
        if (!img || !img.complete) return;

        const [windowHeight, windowWidth] = [window.innerHeight, window.innerWidth];
        const adjustedWidth = (windowHeight / img.naturalHeight) * img.naturalWidth;

        if (img.naturalHeight > img.naturalWidth && windowHeight > 1.5*windowWidth) {
            // 圖片高度大於圖片寬度，且圖片寬度超過視窗寬度，將圖片寬度設為視窗寬度
            img.style.width = `${windowWidth}px`;
            img.style.height = 'auto';
            document.body.style.width = `${windowWidth}px`;
            header.style.width = '100%';
//        } else if (img.naturalHeight > windowHeight && adjustedWidth > windowWidth) {
            // 高度大於視窗高度且調整過圖片寬度大於視窗寬度，將圖片高度設為視窗高度且header, .main-nav .main-bar為調整過寬度
//            img.style.height = `${windowHeight}px`;
//            img.style.width = 'auto';
//            document.body.style.width = `${adjustedWidth}px`;
//            header.style.width = `${adjustedWidth}px`;
        } else if (img.naturalHeight > 2.5*img.naturalWidth) {
            // 條漫為auto
            img.style.height = 'auto';
            img.style.width = 'auto';
            document.body.style.width = '100%';
            header.style.width = `100%`;
        } else if (img.naturalHeight > windowHeight || img.naturalHeight > img.naturalWidth || adjustedWidth < windowWidth) {
            // 圖片高度大於視窗高度，將圖片高度設為視窗高度
            img.style.height = `${windowHeight}px`;
            img.style.width = 'auto';
            document.body.style.width = '100%';
            header.style.width = `100%`;
        } else if (img.naturalWidth > windowWidth) {
            // 圖片寬度度大於視窗寬度，將header, .main-nav .main-bar為圖片寬度
            img.style.height = 'auto';
            img.style.width = 'auto';
            document.body.style.width = `${img.naturalWidth}px`;
            header.style.width = `${img.naturalWidth}px`;
        } else {
            // 其他情況，auto
            img.style.height = 'auto';
            img.style.width = 'auto';
            document.body.style.width = '100%';
            header.style.width = `100%`;
        }
    }

    new MutationObserver(resizeImage).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', resizeImage);//-----------------------------------------------------------------------------------------------------------
    // 自動捲動到右側大圖
    function scrollToRightIfNeeded() {
        const viewportWidth = window.innerWidth;
        document.querySelectorAll('img').forEach(img => {
            if (img.complete && img.offsetWidth > viewportWidth) {
                setTimeout(() => window.scrollTo({ left: document.documentElement.scrollWidth }), 50);
            }
        });
    }

    window.addEventListener('load', scrollToRightIfNeeded);
    new MutationObserver(scrollToRightIfNeeded).observe(document.body, { childList: true, subtree: true });
}
    // 修改 cookie
    const targetCookie = 'country=CN; path=/; domain=.manhuagui.com; expires=' + new Date(Date.now() + 7 * 864e5).toUTCString();
    document.cookie = targetCookie;
})();