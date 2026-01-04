// ==UserScript==
// @name B站播放器横向滚动居中（适用竖屏）
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 使指定元素在横向滚动条中居中显示（中文油猴插件）
// @match https://www.bilibili.com/video/*
// @match https://www.bilibili.com/list/*
// @match https://*.bilibili.com/bangumi/play/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541640/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E5%B1%85%E4%B8%AD%EF%BC%88%E9%80%82%E7%94%A8%E7%AB%96%E5%B1%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541640/B%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8%E6%A8%AA%E5%90%91%E6%BB%9A%E5%8A%A8%E5%B1%85%E4%B8%AD%EF%BC%88%E9%80%82%E7%94%A8%E7%AB%96%E5%B1%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
     'use strict';
// ====================== 配置参数 ===============//
// 需要修改为实际页面中需要居中的元素选择器
const TARGET_SELECTOR = '#bilibili-player';
// 滚动容器，默认为整个窗口，如果需要指定容器可修改此处
const SCROLL_CONTAINER = window;

// ====================== 核心功能函数 ===============//

    //实现横向滚动居中功能//
    function centerHorizontalScroll() {
        // 获取目标元素
        const target = document.querySelector(TARGET_SELECTOR);
        // 检查元素是否存在
        if (!target) {
            console.warn('警告：未找到目标元素，请检查选择器是否正确');
            return;
        }
        // 计算容器宽度
        const containerWidth = SCROLL_CONTAINER === window ?
              window.innerWidth :
        SCROLL_CONTAINER.offsetWidth;
        // 获取元素位置和尺寸信息
        const targetRect = target.getBoundingClientRect();
        // 计算需要滚动的距离
        // 公式：元素左偏移 - (容器宽度 - 元素宽度)/2
        const scrollLeft =3+targetRect.left-(containerWidth - targetRect.width)/2;
        // 执行滚动操作（带边界保护和平滑效果）
        SCROLL_CONTAINER.scrollTo({
            // 计算最终滚动位置，确保不出现负值
            left: Math.max(0,
                           (SCROLL_CONTAINER === window ?
                            window.scrollX :
                            SCROLL_CONTAINER.scrollLeft) + scrollLeft),
            behavior: 'smooth' // 启用平滑滚动效果
        });
    }
      // 保存原始的pushState方法
    const originalPushState = history.pushState;
    // 重写pushState方法以捕获URL变化
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        // URL变化后执行居中功能
        setTimeout(centerHorizontalScroll, 1000);
    };

    // 保存原始的replaceState方法
    const originalReplaceState = history.replaceState;
    // 重写replaceState方法以捕获URL变化
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        // URL变化后执行居中功能
        setTimeout(centerHorizontalScroll, 1000);
    };

    // ====================== 执行时机控制 ===============//
    // 页面完全加载后执行
    window.addEventListener('load', () => {
        // 添加100毫秒延迟，确保动态内容加载完成
        setTimeout(centerHorizontalScroll, 1000);
    });

    // 监听hash变化重新执行
    window.addEventListener('hashchange', () => {
        setTimeout(centerHorizontalScroll, 1000);
    });

    // 监听history变化重新执行(popstate)
    window.addEventListener('popstate', () => {
        setTimeout(centerHorizontalScroll, 1000);
    });

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
        setTimeout(centerHorizontalScroll, 1000);
    });
})();