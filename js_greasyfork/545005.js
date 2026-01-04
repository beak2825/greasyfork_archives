// ==UserScript==
// @name         B站动态首页鼠标悬停完整标题和简介显示
// @name:en      Bilibili Dynamic Title Tooltip
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  在B站动态页(t.bilibili.com)鼠标悬停标题/简介一小段时间后，显示完整标题/简介，不用点进视频就能知道主要内容。具有高优先级样式以避免冲突。
// @description:en Shows the full video title in a tooltip after hovering on a truncated title in Bilibili's dynamic feed (t.bilibili.com). Features high-priority styling to avoid conflicts.
// @author       Smetona
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545005/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E5%AE%8C%E6%95%B4%E6%A0%87%E9%A2%98%E5%92%8C%E7%AE%80%E4%BB%8B%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/545005/B%E7%AB%99%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E9%BC%A0%E6%A0%87%E6%82%AC%E5%81%9C%E5%AE%8C%E6%95%B4%E6%A0%87%E9%A2%98%E5%92%8C%E7%AE%80%E4%BB%8B%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 全局变量与配置 ---

    /** @type {HTMLElement | null} 用于存储当前显示的Tooltip DOM元素 */
    let tooltip = null;

    /** @type {number | undefined} 用于存储 setTimeout 的 ID，以便清除计时器 */
    let tooltipTimer;

    let latestMouseEvent; // <--- 新增一个变量，用于存储最新的鼠标事件对象

    /**
     * @constant {number} 鼠标悬停后延迟显示Tooltip的时间（单位：毫秒）
     * 用户可根据个人喜好修改此值
     */
    const HOVER_DELAY = 500;


    // --- 核心功能函数 ---

    /**
     * 创建并显示Tooltip
     * @param {string} text - 要在Tooltip中显示的完整标题文本
     * @param {MouseEvent} e - 触发创建的 'mouseenter' 事件对象，用于获取初始鼠标位置
     */
    function createTooltip(text, e) {
        // 防御性检查：如果因为未知原因已有tooltip，先移除，确保页面上只有一个实例
        const existingTooltip = document.getElementById('bili-dyn-tooltip-final');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        tooltip = document.createElement('div');
        tooltip.id = 'bili-dyn-tooltip-final'; // 设置唯一ID，便于识别和避免样式冲突
        tooltip.textContent = text;

        // 应用高优先级的“堡垒”样式，确保在各种环境下都能正确显示
        Object.assign(tooltip.style, {
            // 定位与布局
            position: 'fixed',
            left: e.clientX + 10 + 'px', // 初始位置在鼠标右下方
            top: e.clientY + 10 + 'px',
            maxWidth: '450px',

            // 外观样式
            background: 'white',
            color: 'black',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '5px 10px',
            fontSize: '14px',
            lineHeight: '1.5',
            whiteSpace: 'normal', // 允许长文本自动换行
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',

            // “铠甲”：确保最高优先级和可见性，对抗外部CSS冲突
            zIndex: '2147483647',   // 使用CSS理论上的最大值，确保永远在最顶层
            pointerEvents: 'none', // 让鼠标可以“穿透”Tooltip，避免事件干扰
            display: 'block',      // 强制设为块级元素
            visibility: 'visible', // 强制可见
            opacity: '1'           // 强制不透明
        });

        document.body.appendChild(tooltip);
    }

    /**
     * 从页面上移除当前的Tooltip
     */
    function removeTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null; // 清理变量，方便垃圾回收
        }
    }

    /**
     * 当鼠标在标题上移动时，更新Tooltip的位置
     * @param {MouseEvent} e - 'mousemove' 事件对象
     */
    function moveTooltip(e) {
        latestMouseEvent = e; // <--- 在移动时，总是更新这个变量
        if (tooltip) {
            tooltip.style.left = e.clientX + 10 + 'px';
            tooltip.style.top = e.clientY + 10 + 'px';
        }
    }

    /**
     * @description 这是本脚本的核心绑定逻辑函数。
     * 它接收一个选择器，并为所有匹配该选择器的元素绑定悬停事件。
     * @param {string} selector - 用于查询目标元素的CSS选择器 (例如 '.bili-dyn-card-video__title')
     * @param {string} boundFlag - 用于防止重复绑定的 dataset 标记名 (例如 'tipBoundTitle')
     */
    function bindHoverForSelector(selector, boundFlag) {
        document.querySelectorAll(selector).forEach(el => {
            // 如果该元素已经绑定过事件，则跳过，提高效率
            if (el.dataset[boundFlag]) return;
            el.dataset[boundFlag] = '1'; // 打上“已绑定”的标记

            // 鼠标进入事件：启动延迟计时器
            el.addEventListener('mouseenter', e => {
                const text = e.currentTarget.innerText.trim();
                if (!text) return; // 如果标题为空，则不执行任何操作

                latestMouseEvent = e; // <--- 进入时，先记录一次

                tooltipTimer = setTimeout(() => {
                    createTooltip(text, latestMouseEvent);
                }, HOVER_DELAY);
            });

            // 鼠标移动事件：实时更新Tooltip位置
            el.addEventListener('mousemove', moveTooltip);

            // 鼠标离开事件：清除计时器并移除Tooltip
            el.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimer);
                removeTooltip();
            });
        });
    }

     /**
     * @description 一个统一的入口函数，用于调用所有需要绑定的元素的逻辑。
     * 这样可以方便地在未来添加更多需要悬停提示的元素。
     */
    function initializeAllHovers() {
        // 为视频标题绑定悬停事件
        bindHoverForSelector('.bili-dyn-card-video__title', 'tipBoundTitle');

        // 为视频简介绑定悬停事件
        bindHoverForSelector('.bili-dyn-card-video__desc', 'tipBoundDesc');
    }


    // --- 脚本启动入口 ---

    // 1. 页面初次加载时，立即执行一次绑定
    initializeAllHovers();

    // 2. 创建一个 MutationObserver 来监听页面的动态变化（滚动加载）
    //    当页面内容变化时，再次调用绑定函数，确保新加载的内容也能生效
    new MutationObserver(initializeAllHovers).observe(document.body, { childList: true, subtree: true });

})();