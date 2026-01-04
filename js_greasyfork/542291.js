// ==UserScript==
// @name         签约检查
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  状态检查
// @author       Your Name
// @match        *://*.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      bilibili.com
// @grant        unsafeWindow
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542291/%E7%AD%BE%E7%BA%A6%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/542291/%E7%AD%BE%E7%BA%A6%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储已查询的roomId
    const queriedRoomIds = new Set();
    // 记录最后一次请求时间
    let lastRequestTime = 0;
    // 请求间隔时间(ms)
    const REQUEST_INTERVAL = 500;
    // 是否启用检测
    let isEnabled = GM_getValue('isEnabled', false);
    // 开关按钮
    let toggleButton;
    // 显示degree的容器
    let degreeContainer;
    // 当前degree值
    let currentDegree = null;

    // 主函数
    function init() {
        // 创建UI元素
        createUIElements();

        // 如果启用，执行初始查询
        if (isEnabled) {
            startMonitoring();
        }
    }

    // 创建UI元素
    function createUIElements() {
        // 创建容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '60px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '8px';

        // 创建开关按钮
        toggleButton = document.createElement('div');
        toggleButton.style.padding = '8px 12px';
        toggleButton.style.backgroundColor = isEnabled ? '#00a1d6' : '#ccc';
        toggleButton.style.color = 'white';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        toggleButton.textContent = isEnabled ? '签约检测: 开' : '签约检测: 关';

        toggleButton.addEventListener('click', function() {
            isEnabled = !isEnabled;
            GM_setValue('isEnabled', isEnabled);
            updateToggleButton();

            if (isEnabled) {
                startMonitoring();
            } else {
                stopMonitoring();
                removeAllStatusTags();
            }
        });

        // 创建degree显示区域
        degreeContainer = document.createElement('div');
        degreeContainer.style.padding = '8px 12px';
        degreeContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        degreeContainer.style.borderRadius = '4px';
        degreeContainer.style.fontSize = '14px';
        degreeContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        degreeContainer.textContent = '查询剩余: 未获取';

        // 添加到容器
        container.appendChild(toggleButton);
        container.appendChild(degreeContainer);
        document.body.appendChild(container);
    }

    // 更新开关按钮状态
    function updateToggleButton() {
        toggleButton.style.backgroundColor = isEnabled ? '#00a1d6' : '#ccc';
        toggleButton.textContent = isEnabled ? '签约检测: 开' : '签约检测: 关';
    }

    // 更新degree显示
    function updateDegreeDisplay(degree) {
        currentDegree = degree;
        if (degree !== null) {
            degreeContainer.textContent = `查询剩余: ${degree}`;
            degreeContainer.style.color = getDegreeColor(degree);
        } else {
            degreeContainer.textContent = '查询剩余: 未获取';
            degreeContainer.style.color = '#333';
        }
    }

    // 根据degree值获取颜色
    function getDegreeColor(degree) {
        if (degree >= 10) return '#ff4e4e';
        if (degree >= 5) return '#ff8c4e';
        if (degree >= 3) return '#ffc04e';
        return '#4e8cff';
    }

    // 开始监控
    function startMonitoring() {
        // 初始查询
        querySelectorAll();

        // 监听滚动事件（防抖处理）
        window.addEventListener('scroll', debounce(handleScroll, 300));

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(debounce(() => {
            querySelectorAll();
        }, 300));

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 存储observer以便后续停止
        this.observer = observer;
    }

    // 停止监控
    function stopMonitoring() {
        if (this.observer) {
            this.observer.disconnect();
        }
        window.removeEventListener('scroll', debounce(handleScroll, 300));
        updateDegreeDisplay(null);
    }

    // 移除所有状态标签
    function removeAllStatusTags() {
        document.querySelectorAll('.sign-status-tag').forEach(tag => {
            tag.remove();
        });
        queriedRoomIds.clear();
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // 处理滚动事件
    function handleScroll() {
        if (isEnabled) {
            querySelectorAll();
        }
    }

    // 查询所有符合条件的元素
    function querySelectorAll() {
        if (!isEnabled) return;

        const items = document.querySelectorAll('.index_item_JSGkw');

        items.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;

            const href = link.getAttribute('href');
            const roomIdMatch = href.match(/\/\/live\.bilibili\.com\/(\d+)/);
            if (!roomIdMatch || !roomIdMatch[1]) return;

            const roomId = roomIdMatch[1];

            // 如果已经查询过，跳过
            if (queriedRoomIds.has(roomId)) return;

            queriedRoomIds.add(roomId);
            console.log('发现新直播间:', roomId);

            // 发送请求检查签约状态（带间隔）
            scheduleCheckSignStatus(roomId, item);
        });
    }

    // 带间隔的请求调度
    function scheduleCheckSignStatus(roomId, item) {
        if (!isEnabled) return;

        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        if (timeSinceLastRequest < REQUEST_INTERVAL) {
            // 如果距离上次请求时间太短，延迟执行
            setTimeout(() => {
                checkSignStatus(roomId, item);
            }, REQUEST_INTERVAL - timeSinceLastRequest);
        } else {
            // 可以直接执行
            checkSignStatus(roomId, item);
        }
    }

    // 检查签约状态
    function checkSignStatus(roomId, item) {
        if (!isEnabled) return;

        lastRequestTime = Date.now();

        const url = `https://api.live.bilibili.com/xlive/mcn-interface/v1/mcn_mng/SearchAnchor?search_type=3&search=${roomId}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Referer': 'https://live.bilibili.com/',
                'Origin': 'https://live.bilibili.com'
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    console.log('API响应:', data);

                    if (data.code === 0 && data.data && data.data.items && data.data.items.length > 0) {
                        const isSigned = data.data.items[0].is_signed;
                        const degree = data.data.degree;
                        const is_star_anchor = data.data.items[0].is_star_anchor;

                        // 更新degree显示
                        updateDegreeDisplay(degree);

                        // 更新直播间状态
                        updateItemStatus(item, isSigned, is_star_anchor);
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
            }
        });
    }

    // 更新元素状态显示
    function updateItemStatus(item, isSigned, is_star_anchor) {
        if (!isEnabled) return;
        let is_star_anchor_tag = ''
        if(is_star_anchor === 1)is_star_anchor_tag = "繁星"
        // 先检查是否已经添加过状态标签
        const existingTag = item.querySelector('.sign-status-tag');
        if (existingTag) {
            existingTag.textContent = isSigned ? `已签 ${is_star_anchor_tag}` : `未签 ${is_star_anchor_tag}`;
            existingTag.style.backgroundColor = isSigned ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
            return;
        }

        // 找到背景图元素
        const cover = item.querySelector('.Item_cover_sT5RM');
        if (cover) {
            // 创建签约状态标签
            const statusTag = document.createElement('div');
            statusTag.className = 'sign-status-tag';
            statusTag.style.position = 'absolute';
            statusTag.style.bottom = '10px';
            statusTag.style.right = '10px';
            statusTag.style.padding = '4px 8px';
            statusTag.style.backgroundColor = isSigned ? 'rgba(0, 128, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
            statusTag.style.color = 'white';
            statusTag.style.borderRadius = '4px';
            statusTag.style.fontSize = '12px';
            statusTag.style.fontWeight = 'bold';
            statusTag.style.zIndex = '10';
            statusTag.textContent = isSigned ? `已签 ${is_star_anchor_tag}` : `未签 ${is_star_anchor_tag}`;

            // 确保cover有相对定位
            cover.style.position = 'relative';
            cover.appendChild(statusTag);
        }
    }

    // 延迟初始化，确保页面加载完成
    setTimeout(init, 2000);
})();