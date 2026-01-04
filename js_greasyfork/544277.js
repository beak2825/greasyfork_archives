// ==UserScript==
// @name         B站分P视频悬浮序号
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在B站分P视频列表项左侧悬浮显示序号
// @author       You
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544277/B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E6%82%AC%E6%B5%AE%E5%BA%8F%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544277/B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E6%82%AC%E6%B5%AE%E5%BA%8F%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let currentBV = null;
    let videoData = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    let lastCheckResult = null;
    let numberSpans = []; // 存储所有创建的序号元素
    let debounceTimer;

    // 获取视频数据
    async function fetchData() {
        try {
            const bvMatch = window.location.pathname.match(/\/video\/(BV\w+)/);
            if (!bvMatch) return [];
            
            const bv = bvMatch[1];
            if (bv === currentBV && videoData !== null) {
                return videoData;
            }

            currentBV = bv;
            const apiUrl = `https://api.bilibili.com/x/player/pagelist?bvid=${bv}`;
            const response = await fetch(apiUrl);
            const result = await response.json();
            videoData = result.data || [];
            return videoData;
        } catch (error) {
            console.error('获取视频数据出错:', error);
            return [];
        }
    }

    // 检查是否为分P视频
    async function isMultiPartVideo() {
        const data = await fetchData();
        return data.length > 1;
    }

    // 清理已创建的序号元素
    function cleanupNumberSpans() {
        numberSpans.forEach(span => {
            if (span && span.parentNode) {
                span.parentNode.removeChild(span);
            }
        });
        numberSpans = [];
    }

    // 获取元素在视口中的位置
    function getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            height: rect.height
        };
    }

    // 添加悬浮序号
    async function addNumberIndicators() {
        // 清理之前的序号
        cleanupNumberSpans();

        // 检查当前视频是否为分P
        const bvMatch = window.location.pathname.match(/\/video\/(BV\w+)/);
        if (!bvMatch) return;
        
        const currentBVID = bvMatch[1];
        const needCheck = currentBV !== currentBVID || lastCheckResult === null;
        
        if (needCheck) {
            const isMultiPart = await isMultiPartVideo();
            lastCheckResult = isMultiPart;
            
            if (!isMultiPart) {
                console.log('当前视频不是分P视频，不添加序号');
                return;
            }
        } else if (!lastCheckResult) {
            return;
        }

        // 获取列表容器
        const listContainer = document.querySelector('.video-pod__list.multip.list');
        if (!listContainer) {
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(addNumberIndicators, 3000);
            }
            return;
        }

        // 获取所有列表项
        const items = listContainer.querySelectorAll('.video-pod__item');
        if (items.length === 0) {
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(addNumberIndicators, 3000);
            }
            return;
        }

        retryCount = 0;

        // 为每个列表项创建序号
        items.forEach((item, index) => {
            const numberSpan = document.createElement('div');
            numberSpan.className = 'tm-video-number';
            numberSpan.textContent = index + 1;

            // 设置样式
            numberSpan.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                font-size: 13px;
                font-weight: bold;
                color: #00a1d6;
                background-color: rgba(255,255,255,0.9);
                padding: 1px 6px;
                border-radius: 10px;
                display: none;
                z-index: 9999;
                min-width: 18px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                border: 1px solid #e7e7e7;
                pointer-events: none;
                transform: translate(-120%, -50%);
            `;

            // 添加到body
            document.body.appendChild(numberSpan);
            numberSpans.push(numberSpan);

            // 更新位置函数
            const updatePosition = () => {
                const itemPos = getElementPosition(item);
                numberSpan.style.top = `${itemPos.top + itemPos.height/2}px`;
                numberSpan.style.left = `${itemPos.left}px`;
            };

            // 初始定位
            updatePosition();

            // 事件监听
            item.addEventListener('mouseenter', () => {
                numberSpan.style.display = 'block';
                updatePosition();
            });

            item.addEventListener('mouseleave', () => {
                numberSpan.style.display = 'none';
            });

            // 添加全局事件监听
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
        });
        console.log("已为视频列表添加序号");
    }

    // 防抖函数
    function debounce(func, delay) {
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(func, delay);
        };
    }

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        .tm-video-number {
            transition: opacity 0.2s ease;
        }
        .night-mode .tm-video-number {
            color: #00a1d6 !important;
            background-color: rgba(33,33,33,0.9) !important;
            border-color: #444 !important;
        }
    `;
    document.head.appendChild(style);

    // 初始化函数
    function init() {
        // 清理可能存在的旧监听器
        window.removeEventListener('scroll', updateAllPositions);
        window.removeEventListener('resize', updateAllPositions);
        window.removeEventListener('popstate', handleRouteChange);
        
        // 添加新监听器
        window.addEventListener('scroll', updateAllPositions);
        window.addEventListener('resize', updateAllPositions);
        window.addEventListener('popstate', handleRouteChange);
        
        // 重写pushState
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            originalPushState.apply(history, args);
            handleRouteChange();
        };
        
        // 初始执行
        setTimeout(addNumberIndicators, 2000);
    }

    // 更新所有序号位置
    function updateAllPositions() {
        numberSpans.forEach((span, index) => {
            const items = document.querySelectorAll('.video-pod__item');
            if (items[index]) {
                const itemPos = getElementPosition(items[index]);
                span.style.top = `${itemPos.top + itemPos.height/2}px`;
                span.style.left = `${itemPos.left}px`;
            }
        });
    }

    // 处理路由变化
    function handleRouteChange() {
        debounce(addNumberIndicators, 500)();
    }

    // 页面加载完成后初始化
    window.addEventListener('load', init);
})();