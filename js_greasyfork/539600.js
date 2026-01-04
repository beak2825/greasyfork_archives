// ==UserScript==
// @name         滚轮整页翻页 (Scroll Wheel to Page Up/Down)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license MIT
// @description  在指定网站上，将鼠标滚轮的上下滚动操作替换为整页翻页（Page Up/Page Down）。可配置平滑滚动。
// @author       Gemini
// @match        https://legado.ckopoer.dpdns.org:7988/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539600/%E6%BB%9A%E8%BD%AE%E6%95%B4%E9%A1%B5%E7%BF%BB%E9%A1%B5%20%28Scroll%20Wheel%20to%20Page%20UpDown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539600/%E6%BB%9A%E8%BD%AE%E6%95%B4%E9%A1%B5%E7%BF%BB%E9%A1%B5%20%28Scroll%20Wheel%20to%20Page%20UpDown%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 用户配置项开始 ----------

    // 设置为 true 开启平滑滚动，设置为 false 则为瞬间滚动
    const SMOOTH_SCROLL = true;

    // ---------- 用户配置项结束 ----------


    // 为 'wheel' 事件添加监听器
    // { passive: false } 是必需的，因为它告诉浏览器我们可能会调用 preventDefault()
    window.addEventListener('wheel', function(event) {

        // 阻止默认的滚动行为
        event.preventDefault();

        const scrollBehavior = SMOOTH_SCROLL ? 'smooth' : 'auto';

        // 判断滚轮方向
        if (event.deltaY > 0) {
            // 向下滚动 (Page Down)
            window.scrollBy({
                top: window.innerHeight * 0.85,
                left: 0,
                behavior: scrollBehavior
            });
        } else if (event.deltaY < 0) {
            // 向上滚动 (Page Up)
            window.scrollBy({
                top: -window.innerHeight * 0.85,
                left: 0,
                behavior: scrollBehavior
            });
        }
    }, { passive: false });
})();