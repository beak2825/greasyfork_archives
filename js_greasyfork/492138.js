// ==UserScript==
// @name         自动滚动:双击切换滚动状态
// @name:en      AutoScroll(Double-click)
// @name:zh-CN   自动滚动:双击切换滚动状态
// @name:zh-TW   自動滾動:雙擊切換滾動狀態
// @namespace    https://viayoo.com/
// @version      0.1.1
// @author       百度文心一言 Baidu ERNIE
// @description  双击切换滚动状态，适配via浏览器的阅读模式
// @description:en  Double-click the screen to switch scrolling.Support reader mode for via browser
// @description:zh-CN  双击切换滚动状态，适配via浏览器的阅读模式
// @description:zh-TW  雙擊切換滾動狀態，適配via瀏覽器的閱讀模式
// @run-at       document-start
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492138/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%3A%E5%8F%8C%E5%87%BB%E5%88%87%E6%8D%A2%E6%BB%9A%E5%8A%A8%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/492138/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%3A%E5%8F%8C%E5%87%BB%E5%88%87%E6%8D%A2%E6%BB%9A%E5%8A%A8%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrollTimer = null;
    let lastScrollTop = 0;
    /*ScrollSpeed 滚动速度*/
    let scrollSpeed = 2;
    let autoScrollElement = null;
    let isAutoScrolling = false;
    let isElementScrolling = false;
     
    document.addEventListener('dblclick', function() {
        if (isAutoScrolling) {
            clearInterval(scrollTimer);
            isAutoScrolling = false;
            return;
        }
     
        autoScrollElement = document.querySelector('.via-reader-body');
        isElementScrolling = !!autoScrollElement;
     
        if (!isElementScrolling) {
            autoScrollElement = window;
        }
     
        let scrollTop = autoScrollElement.scrollTop || window.pageYOffset;
        lastScrollTop = scrollTop;
     
        scrollTimer = setInterval(function() {
            if (!isElementScrolling) {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                    clearInterval(scrollTimer);
                    isAutoScrolling = false;
                    return;
                }
                window.scrollBy(0, scrollSpeed);
            } else {
                if (autoScrollElement.scrollTop + autoScrollElement.clientHeight >= autoScrollElement.scrollHeight) {
                    clearInterval(scrollTimer);
                    isAutoScrolling = false;
                    autoScrollElement.style.overflow = 'auto';
                    return;
                }
                autoScrollElement.scrollTop += scrollSpeed;
            }
        }, 20);/*20 滚动间隔*/
     
        isAutoScrolling = true;
    });
     
    if (autoScrollElement) {
        autoScrollElement.addEventListener('scroll', function() {
            if (!isAutoScrolling) return;
            let scrollTop = autoScrollElement.scrollTop || window.pageYOffset;
            if (scrollTop !== lastScrollTop) {
                clearInterval(scrollTimer);
                isAutoScrolling = false;
            }
            lastScrollTop = scrollTop;
        });
    }
})();