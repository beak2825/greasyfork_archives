// ==UserScript==
// @license MIT
// @name         GMGN.ai 添加推特搜索按钮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在 GMGN.ai 网站上为地址添加推特搜索图标
// @author       https://x.com/dami16z
// @match        https://gmgn.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532163/GMGNai%20%E6%B7%BB%E5%8A%A0%E6%8E%A8%E7%89%B9%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/532163/GMGNai%20%E6%B7%BB%E5%8A%A0%E6%8E%A8%E7%89%B9%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加推特图标的CSS
    const style = document.createElement('style');
    style.textContent = `
        .twitter-search-icon {
            margin-left: 8px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            display: inline-flex;
            vertical-align: middle;
            position: relative;
            z-index: 9999;
        }
        .twitter-search-icon:hover {
            opacity: 0.8;
        }
        .twitter-search-icon svg {
            width: 100%;
            height: 100%;
        }
    `;
    document.head.appendChild(style);

    // 添加推特图标到地址单元格
    function addTwitterIcons() {
        // 处理trader列的地址
        processAddressCells('div[col-id="trader"]');

        // 处理address列的地址
        processAddressCells('div[col-id="address"]');
    }

    // 处理地址单元格通用函数
    function processAddressCells(selector) {
        const addressCells = document.querySelectorAll(selector);

        addressCells.forEach(cell => {
            // 检查是否已添加图标
            if (cell.querySelector('.twitter-search-icon')) {
                return;
            }

            // 尝试提取钱包地址
            const addressLink = cell.querySelector('a.css-1kjnow1');
            if (!addressLink) return;

            const addressPath = addressLink.getAttribute('href');
            if (!addressPath) return;

            // 从路径中提取地址
            const address = addressPath.split('/').pop();

            // 找到放置图标的合适位置
            let targetDiv = cell.querySelector('.css-1w1vbxm');
            if (!targetDiv) return;

            // 创建推特图标容器
            const twitterContainer = document.createElement('div');
            twitterContainer.className = 'twitter-search-icon';
            twitterContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`;
            twitterContainer.title = '在推特搜索此地址';

            // 添加直接点击事件而不是通过a标签
            twitterContainer.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // 阻止事件冒泡
                window.open(`https://twitter.com/search?q=${address}`, '_blank');
                return false;
            }, true); // 使用捕获阶段

            // 插入到目标div的最后
            targetDiv.appendChild(twitterContainer);
        });
    }

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver((mutations) => {
        addTwitterIcons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始执行
    setTimeout(addTwitterIcons, 1000);

    // 再添加一个延迟执行的调用，确保在页面完全加载后执行
    setTimeout(addTwitterIcons, 3000);

    // 添加全局点击监听器以便响应点击
    document.addEventListener('click', function(e) {
        if (e.target.closest('.twitter-search-icon')) {
            // 找到包含地址的单元格
            const cell = e.target.closest('div[col-id="trader"], div[col-id="address"]');
            if (cell) {
                const addressLink = cell.querySelector('a.css-1kjnow1');
                if (addressLink) {
                    const addressPath = addressLink.getAttribute('href');
                    if (addressPath) {
                        const address = addressPath.split('/').pop();
                        window.open(`https://twitter.com/search?q=${address}`, '_blank');
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
        }
    }, true);
})();