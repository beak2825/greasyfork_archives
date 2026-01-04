// ==UserScript==
// @name         Yandex双列显示（修复版）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将Yandex搜索结果改为双列显示布局（修复版）
// @author       您的名字
// @match        *://yandex.com/search*
// @match        *://yandex.ru/search*
// @match        *://*.yandex.com/search*
// @match        *://*.yandex.ru/search*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533914/Yandex%E5%8F%8C%E5%88%97%E6%98%BE%E7%A4%BA%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533914/Yandex%E5%8F%8C%E5%88%97%E6%98%BE%E7%A4%BA%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加CSS样式使搜索结果变为双列
    GM_addStyle(`
        /* 调整主容器宽度 */
        .main {
            width: 95% !important;
            max-width: 1600px !important;
            margin: 0 auto !important;
        }
        
        /* 搜索结果容器 */
        .serp-list, .content__left .organic, ul.serp-list {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            grid-gap: 16px !important;
            width: 100% !important;
            padding: 0 !important;
        }
        
        /* 搜索结果项目样式 */
        .serp-item, .organic .serp-item, .serp-item.organic, li.serp-item, .organic__item {
            width: 100% !important;
            margin: 0 0 15px 0 !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            padding: 12px !important;
            box-sizing: border-box !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
            transition: box-shadow 0.3s ease !important;
            display: block !important;
        }
        
        .serp-item:hover, .organic .serp-item:hover, li.serp-item:hover, .organic__item:hover {
            box-shadow: 0 3px 8px rgba(0,0,0,0.15) !important;
        }
        
        /* 确保搜索结果区域宽度充足 */
        .content__left {
            width: 100% !important;
            max-width: none !important;
            float: none !important;
        }
        
        /* 重新调整右侧栏位置，使其在结果下方 */
        .content__right, .serp-list + .content__right {
            width: 100% !important;
            margin-top: 20px !important;
            float: none !important;
            clear: both !important;
            position: static !important;
        }
        
        /* 响应式设计 - 在小屏幕上恢复单列 */
        @media (max-width: 1024px) {
            .serp-list, .content__left .organic, ul.serp-list {
                grid-template-columns: 1fr !important;
            }
        }
    `);
    
    // 监听DOM变化以处理动态加载的内容
    function setupObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        
        const callback = function(mutationsList, observer) {
            // 检查是否有新的搜索结果加载
            const updateLayout = () => {
                // 确保即使在动态加载后也应用双列布局
                const allListContainers = document.querySelectorAll('.serp-list, .content__left .organic');
                allListContainers.forEach(container => {
                    if (!container.classList.contains('dual-column-processed')) {
                        container.classList.add('dual-column-processed');
                    }
                });
            };
            
            // 延迟执行以确保DOM元素完全加载
            setTimeout(updateLayout, 100);
        };
        
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    
    // 主函数：在页面加载后应用样式
    function initDualColumn() {
        setupObserver();
        
        // 标记初始结果列表
        const initialLists = document.querySelectorAll('.serp-list, .content__left .organic, ul.serp-list');
        initialLists.forEach(list => {
            list.classList.add('dual-column-processed');
        });
        
        // 如果DOM还没有完全加载，设置额外的监听器
        if (initialLists.length === 0) {
            window.addEventListener('DOMContentLoaded', function() {
                setupObserver();
                
                const loadedLists = document.querySelectorAll('.serp-list, .content__left .organic, ul.serp-list');
                loadedLists.forEach(list => {
                    list.classList.add('dual-column-processed');
                });
            });
        }
    }
    
    // 执行初始化
    initDualColumn();
    
    // 在页面完全加载后再次检查
    window.addEventListener('load', function() {
        setTimeout(initDualColumn, 500);
    });
})();