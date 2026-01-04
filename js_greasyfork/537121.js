// ==UserScript==
// @name         百度识图显示图片分辨率-基于通义千问AI生成
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在百度识图结果中，显示分辨率
// @author       Teddymvs
// @match        https://graph.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537121/%E7%99%BE%E5%BA%A6%E8%AF%86%E5%9B%BE%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%E5%88%86%E8%BE%A8%E7%8E%87-%E5%9F%BA%E4%BA%8E%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AEAI%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/537121/%E7%99%BE%E5%BA%A6%E8%AF%86%E5%9B%BE%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%E5%88%86%E8%BE%A8%E7%8E%87-%E5%9F%BA%E4%BA%8E%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AEAI%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 每个图片项的选择器（例如每个图片都在 a 标签中）
    const ITEM_SELECTOR = 'a img[src*="w="][src*="h="]'; // 可根据实际结构修改选择器
    // 已处理过的元素集合，防止重复处理
    const processedElements = new Set();

    /**
     * 给指定元素添加分辨率徽标（显示在左上角 + 偏移）
     * @param element 目标元素，通常是一个包含图片的容器（如 a 或 div）
     */
    function addResolutionBadge(element) {
        const src = element.src;
        const widthMatch = src.match(/[?&]w=(\d+)/);
        const heightMatch = src.match(/[?&]h=(\d+)/);

        if (!widthMatch || !heightMatch) return;

        const width = widthMatch[1];
        const height = heightMatch[1];

        // 创建分辨率标签
        const badge = document.createElement('div');
        badge.style.position = 'absolute';
        badge.style.top = '10px';      // 向下偏移
        badge.style.left = '10px';     // 向右偏移
        badge.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // 背景颜色和透明度
        badge.style.color = '#fff'; // 文字颜色
        badge.style.fontSize = '12px'; // 字体大小
        badge.style.padding = '8px 12px'; // 增加内边距以扩大背景范围
        badge.style.minWidth = '40px'; // 设置最小宽度，确保背景足够大
        badge.style.textAlign = 'center'; // 文字居中显示
        badge.style.borderRadius = '3px';
        badge.style.zIndex = '9999';
        badge.textContent = `${width}×${height}px`;

        // 如果目标元素是静态定位，则更改为相对定位以支持绝对定位的子元素
        const parentElement = element.closest('a'); // 假设图片直接父级是 a 标签
        if (parentElement && getComputedStyle(parentElement).position === 'static') {
            parentElement.style.position = 'relative';
        }

        // 清除旧的 badge（防止重复添加）
        const existing = parentElement.querySelector('.resolution-badge');
        if (existing) existing.remove();

        badge.classList.add('resolution-badge');
        if (parentElement) parentElement.appendChild(badge);
    }

    /**
     * 处理所有匹配的选择器元素，过滤出未处理过的
     */
    function processNewItems() {
        const items = document.querySelectorAll(ITEM_SELECTOR);
        items.forEach(item => {
            const key = item.outerHTML; // 使用 outerHTML 作为唯一标识符（可根据需要更换为 dataset.id 等）
            if (!processedElements.has(key)) {
                addResolutionBadge(item);
                processedElements.add(key); // 标记为已处理
            }
        });
    }

    /**
     * 初始化监听函数
     * 使用 MutationObserver 监听 DOM 变化，检测新增的内容
     */
    function initObserver() {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    processNewItems(); // 当有新节点插入时处理
                }
            }
        });

        // 开始观察整个文档，监听子节点变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始处理已经存在的内容
        processNewItems();
    }

    /**
     * 页面加载完成后初始化监听
     */
    function init() {
        window.addEventListener('load', () => {
            setTimeout(initObserver, 1000); // 延迟确保页面加载完成
        });
    }

    init();
})();