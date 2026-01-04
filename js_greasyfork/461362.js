// ==UserScript==
// @name         双击空白处返回网页顶部
// @namespace    [url]http://tampermonkey.net/[/url]
// @version      0.0.2
// @description  在所有页面空白处双击左键，自动返回网页顶部。
// @match        *://*/*
// @author       zixuan203344
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461362/%E5%8F%8C%E5%87%BB%E7%A9%BA%E7%99%BD%E5%A4%84%E8%BF%94%E5%9B%9E%E7%BD%91%E9%A1%B5%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461362/%E5%8F%8C%E5%87%BB%E7%A9%BA%E7%99%BD%E5%A4%84%E8%BF%94%E5%9B%9E%E7%BD%91%E9%A1%B5%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==
 
(function() 
{
    'use strict';
    
    var lastClickTime = 0;	// 定义一个变量用来记录上次点击的时间
    const SCROLL_DURATION = 300; // 滚动动画的持续时间（毫秒）
    let isScrolling = false; // 防止多个滚动动画的标志 
    
    // 监听页面的点击事件
    document.addEventListener('click', function(e) 
    {
        // 如果点击的目标元素不是文本或图片，即为空白处
        if (e.target.nodeName !== 'TEXT' && e.target.nodeName !== 'IMG') 
        {
            // 获取当前点击时间
            var currentTime = new Date().getTime();
            // 如果当前点击和上次点击间隔小于400毫秒（0.4秒内鼠标左键点了两下），即为双击
            if (currentTime - lastClickTime < 400) 
            {
                // 滚动到页面顶部
                // window.scrollTo(0, 0);
                scrollToTop();
            }
            // 更新上次点击的时间为当前时间
            lastClickTime = currentTime;
        }
    });
    
    // 用动画将页面滚动到顶部
    function scrollToTop() {
        if (isScrolling) return;
        isScrolling = true;
        const scrollStep = -window.scrollY / (SCROLL_DURATION / 15); // distance to scroll per step
        const scrollInterval = setInterval(function() {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
                isScrolling = false;
            }
        }, 15);
    }
})();