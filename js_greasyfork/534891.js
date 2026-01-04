// ==UserScript==
// @name         花瓣网用户采集页信息增强
// @namespace    https://github.com/yourname
// @version      2.0
// @description  在用户采集页面显示图片分辨率、来源和画板信息，支持滚动加载
// @match        https://huaban.com/*/pins
// @match        https://huaban.com/user/*/pins
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      huaban.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534891/%E8%8A%B1%E7%93%A3%E7%BD%91%E7%94%A8%E6%88%B7%E9%87%87%E9%9B%86%E9%A1%B5%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/534891/%E8%8A%B1%E7%93%A3%E7%BD%91%E7%94%A8%E6%88%B7%E9%87%87%E9%9B%86%E9%A1%B5%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .huaban-pin-info {
            font-size: 14px;
            color: #333;
            background: rgba(255,255,255,0.8);
            padding: 2px 2px;
            border-radius: 2px;
            margin-top: 2px;
            display: block;
            line-height: 1.2;
        }
        .fki7oGar:hover .huaban-pin-info {
            background: rgba(0,0,0,0.7);
            color: #fff;
        }
        .pin-size {
            color: #e74c3c;
            font-weight: bold;
        }
        .pin-source {
            color: #3498db;
        }
        .pin-board {
            color: #2ecc71;
        }
    `);

    // 1. 获取用户名
    const getUsername = () => {
        const path = window.location.pathname;
        const match = path.match(/\/(?:user\/)?([^\/]+)\/pins/);
        return match ? match[1] : null;
    };
    const username = getUsername();
    if (!username) return;

    // 2. 数据存储和状态
    const pinDataMap = new Map();
    let currentMax = null;
    let isLoading = false;
    let isLastPage = false;

    // 3. 获取单页图片数据
    async function fetchPinPage() {
        if (isLoading || isLastPage) return;
        isLoading = true;

        let url = `https://huaban.com/v3/${username}/pins?limit=30&fields=pins:PIN|total,page_num,page_size`;
        if (currentMax) {
            url += `&max=${currentMax}`;
        }

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.pins && data.pins.length > 0) {
                // 更新分页参数
                currentMax = data.pins[data.pins.length - 1].pin_id;

                // 存储新获取的pin数据
                data.pins.forEach(pin => {
                    pinDataMap.set(pin.pin_id.toString(), pin);
                });

                // 检查是否是最后一页
                if (data.pins.length < 30) {
                    isLastPage = true;
                }

                return data.pins;
            } else {
                isLastPage = true;
                return [];
            }
        } catch (error) {
            console.error('获取数据失败:', error);
            return [];
        } finally {
            isLoading = false;
        }
    }

    // 4. 注入图片信息
    function injectPinInfo() {
        const pinContainers = document.querySelectorAll('.BR9Lhzqi:not(.info-enhanced)');

        pinContainers.forEach(container => {
            const pinId = container.getAttribute('data-pin-id');
            if (!pinId) return;

            const pinInfo = pinDataMap.get(pinId);
            if (!pinInfo || !pinInfo.file) {
                // 如果数据未加载，且不是正在加载中，则触发加载
                if (!isLoading && !isLastPage) {
                    fetchPinPage().then(injectPinInfo);
                }
                return;
            }

            // 标记已处理
            container.classList.add('info-enhanced');

            // 创建信息元素
            const infoElement = document.createElement('div');
            infoElement.className = 'huaban-pin-info';

            // 构建信息HTML
            let infoHTML = `
                <span class="pin-size">${pinInfo.file.width} × ${pinInfo.file.height}</span>
            `;

            // 修改这里：无论是否有来源都显示来源信息
            infoHTML += ` | <span class="pin-source">来源: ${pinInfo.source || '无'}</span>`;

            if (pinInfo.board?.title) {
                infoHTML += ` | <span class="pin-board">画板: ${pinInfo.board.title}</span>`;
            }

            infoElement.innerHTML = infoHTML;

            // 插入到图片下方
            const targetElement = container.querySelector('.hUfxKZoq') ||
                                 container.querySelector('.__0ionfaOd');
            if (targetElement) {
                targetElement.insertAdjacentElement('afterend', infoElement);
            }
        });
    }

    // 5. 滚动加载处理
    const scrollHandler = debounce(() => {
        // 当距离底部500px时加载更多
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            fetchPinPage().then(injectPinInfo);
        }
    }, 300);

    // 6. DOM变化观察器
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                injectPinInfo();
            }
        });
    });

    // 7. 初始化
    async function initialize() {
        // 初始加载第一页
        await fetchPinPage();
        injectPinInfo();

        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 添加滚动监听
        window.addEventListener('scroll', scrollHandler);

        // 定期检查（防止某些情况下遗漏）
        setInterval(() => {
            if (!isLoading) {
                injectPinInfo();
            }
        }, 3000);
    }

    // 防抖函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    initialize();
})();