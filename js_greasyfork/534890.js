// ==UserScript==
// @name         花瓣网图片信息显示（分辨率+来源）优化版
// @namespace    https://github.com/yourname
// @version      2.1
// @description  在花瓣网图片下方显示原图分辨率和来源信息（拦截原生请求获取数据）
// @match        https://huaban.com/boards/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534890/%E8%8A%B1%E7%93%A3%E7%BD%91%E5%9B%BE%E7%89%87%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA%EF%BC%88%E5%88%86%E8%BE%A8%E7%8E%87%2B%E6%9D%A5%E6%BA%90%EF%BC%89%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/534890/%E8%8A%B1%E7%93%A3%E7%BD%91%E5%9B%BE%E7%89%87%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA%EF%BC%88%E5%88%86%E8%BE%A8%E7%8E%87%2B%E6%9D%A5%E6%BA%90%EF%BC%89%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .huaban-info {
            font-size: 14px;
            background: rgba(255,255,255,0.8);
            padding: 2px 2px;
            border-radius: 2px;
            margin-top: 2px;
            display: inline-block;
        }
        .fki7oGar:hover .huaban-info {
            background: rgba(0,0,0,0.6);
        }
        .resolution-info {
            color: red;
        }
        .source-info {
            color: #0a0; /* 绿色 */
            margin-left: 5px;
        }
    `);

    // 存储所有pin数据
    const pinDataMap = new Map();

    // 拦截花瓣网的API请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('/boards/') && url.includes('/pins?')) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response.pins) {
                        response.pins.forEach(pin => {
                            pinDataMap.set(pin.pin_id.toString(), pin);
                        });
                        // 数据更新后立即注入信息
                        setTimeout(injectPinInfo, 100);
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
            });
        }
        originalOpen.apply(this, arguments);
    };

    // 注入图片信息
    function injectPinInfo() {
        const pinContainers = document.querySelectorAll('.BR9Lhzqi:not(.info-added)');

        pinContainers.forEach(container => {
            const pinId = container.getAttribute('data-pin-id');
            if (!pinId) return;

            const pinInfo = pinDataMap.get(pinId);
            if (!pinInfo || !pinInfo.file) return;

            // 标记已处理
            container.classList.add('info-added');

            // 创建信息容器
            const infoContainer = document.createElement('div');
            infoContainer.className = 'huaban-info';

            // 创建分辨率信息元素
            const resolutionElement = document.createElement('span');
            resolutionElement.className = 'resolution-info';
            resolutionElement.textContent = `尺寸: ${pinInfo.file.width} × ${pinInfo.file.height}`;

            // 创建来源信息元素
            const sourceElement = document.createElement('span');
            sourceElement.className = 'source-info';
            sourceElement.textContent = pinInfo.source ? `来源: ${pinInfo.source}` : '来源: 无';

            // 将两个元素添加到容器中
            infoContainer.appendChild(resolutionElement);
            infoContainer.appendChild(sourceElement);

            // 插入到DOM中
            const titleElement = container.querySelector('.__0ionfaOd');
            if (titleElement) {
                titleElement.insertAdjacentElement('afterend', infoContainer);
            }
        });
    }

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
        let hasNewPins = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches && 
                    (node.matches('.BR9Lhzqi') || node.querySelector('.BR9Lhzqi'))) {
                    hasNewPins = true;
                }
            });
        });
        
        if (hasNewPins) {
            injectPinInfo();
        }
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始注入（页面加载完成后）
    window.addEventListener('load', () => {
        setTimeout(injectPinInfo, 1000);
    });

    // 定期检查未处理的图片（防止遗漏）
    setInterval(() => {
        if (document.querySelectorAll('.BR9Lhzqi:not(.info-added)').length > 0) {
            injectPinInfo();
        }
    }, 2000);
})();