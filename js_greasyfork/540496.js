// ==UserScript==
// @name         亚马逊货件状态着色
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  把亚马逊卖家后台花花绿绿的货件状态着色改回来
// @author       HikaRin
// @match        https://sellercentral.amazon.com/gp/ssof/shipping-queue.html*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/540496/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%B4%A7%E4%BB%B6%E7%8A%B6%E6%80%81%E7%9D%80%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/540496/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%B4%A7%E4%BB%B6%E7%8A%B6%E6%80%81%E7%9D%80%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置
    const CONFIG = {
        // 状态元素选择器（支持多个）
        selectors: ['#shipment-status', '.status-item', '.shipment-status'],
        
        // 状态颜色映射
        statusColors: {
            'grey': '#757575',
            'light_grey': '#b7b7b7',
            'green': '#00b426',
            'cyan': '#00a4b4',
            'red': '#b43700'
        },
        
        // 重试间隔（毫秒）
        retryInterval: 1000,
        
        // 重试次数（0表示无限重试）
        maxRetries: 10
    };
    
    // 添加样式到页面
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .status-colored {
                padding: 2px 10px !important;
                border-radius: 20px !important;
                font-size: x-small !important;
                font-weight: normal !important;
                display: inline-block !important;
                color: white !important;
                transition: background-color 0.3s ease, transform 0.2s ease !important;
            }
            
            .status-colored:hover {
                transform: scale(1.05) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 应用状态颜色
    function applyStatusColors() {
        let foundElements = false;
        
        // 尝试所有选择器
        for (const selector of CONFIG.selectors) {
            const elements = document.querySelectorAll(selector);
            
            if (elements.length > 0) {
                foundElements = true;
                
                elements.forEach(element => {
                    // 获取状态文本
                    const status = (element.textContent || '').trim().toLowerCase();
                    
                    // 移除之前的颜色类
                    //element.classList.remove('status-closed', 'status-receiving', 'status-other');
                    
                    // 添加基础类
                    element.classList.add('status-colored');
                    
                    // 应用对应颜色
                    if (status === 'closed' || status === '已完成') {
                        element.style.backgroundColor = CONFIG.statusColors.grey;
                    } else if (status === 'receiving' || status === '正在接收') {
                        element.style.backgroundColor = CONFIG.statusColors.green;
                    } else if (status === 'checked in' || status === '已登记') {
                        element.style.backgroundColor = CONFIG.statusColors.green;
                    } else if (status === 'in transit' || status === '运输中') {
                        element.style.backgroundColor = CONFIG.statusColors.cyan;
                    } else if (status === 'shipped' || status === '已发货') {
                        element.style.backgroundColor = CONFIG.statusColors.cyan;
                    } else if (status === 'created' || status === '已创建') {
                        element.style.backgroundColor = CONFIG.statusColors.light_grey;
                    } else if (status === 'cancelled' || status === '已取消') {
                        element.style.backgroundColor = CONFIG.statusColors.light_grey;
                    } else {
                        element.style.backgroundColor = CONFIG.statusColors.cyan;
                    }
                });
            }
        }
        
        return foundElements;
    }
    
    // 初始化函数
    function init() {
        addGlobalStyles();
        
        let retries = 0;
        const tryApply = () => {
            const success = applyStatusColors();
            
            if (!success) {
                retries++;
                
                if (CONFIG.maxRetries === 0 || retries <= CONFIG.maxRetries) {
                    setTimeout(tryApply, CONFIG.retryInterval);
                }
            }
        };
        
        tryApply();
        
        // 监听动态内容变化
        const observer = new MutationObserver(() => {
            applyStatusColors();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }
    
    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();