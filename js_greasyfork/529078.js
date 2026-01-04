// ==UserScript==
// @name         市场物品收藏助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  将收藏的物品置顶显示，其余物品保持原有顺序
// @author       Trae AI, shykai
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529078/%E5%B8%82%E5%9C%BA%E7%89%A9%E5%93%81%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529078/%E5%B8%82%E5%9C%BA%E7%89%A9%E5%93%81%E6%94%B6%E8%97%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 从存储中获取收藏物品列表，如果没有则使用默认值
    let favoriteItems = GM_getValue('favoriteItems', []);

    // 添加排序状态标记
    let isSorted = false;
    let lastItemCount = 0;

    // 主函数，定期检查并排序物品
    function sortMarketItems(forceSort = false) {
        // 查找市场物品容器
        const marketPanel = document.querySelector('.MarketplacePanel_marketItems__D4k7e');
        if (!marketPanel) {
            isSorted = false;
            return;
        }

        // 获取所有物品容器
        const itemContainers = Array.from(marketPanel.querySelectorAll('.Item_itemContainer__x7kH1'));
        if (itemContainers.length === 0) {
            isSorted = false;
            return;
        }

        // 检查是否需要重新排序
        if (!forceSort && isSorted && itemContainers.length === lastItemCount) {
            return;
        }

        // 更新物品数量记录
        lastItemCount = itemContainers.length;

        // 分离收藏物品和其他物品
        const favorites = [];
        const others = [];

        itemContainers.forEach(item => {
            const useElement = item.querySelector('use');
            if (!useElement) {
                others.push(item);
                return;
            }

            const href = useElement.getAttribute('href');
            if (!href) {
                others.push(item);
                return;
            }

            const itemId = href.split('#')[1];

            if (favoriteItems.includes(itemId)) {
                favorites.push(item);
            } else {
                others.push(item);
            }
        });

        // 清空容器
        while (marketPanel.firstChild) {
            marketPanel.removeChild(marketPanel.firstChild);
        }

        // 先添加收藏物品
        favorites.forEach(item => {
            marketPanel.appendChild(item);
        });

        // 再添加其他物品（保持原有顺序）
        others.forEach(item => {
            marketPanel.appendChild(item);
        });

        // 更新样式
        updateFavoriteStyles(itemContainers);

        // 标记为已排序
        isSorted = true;
    }

    // 单独更新收藏物品样式，不重排DOM
    function updateFavoriteStyles(itemContainers) {
        itemContainers.forEach(item => {
            const useElement = item.querySelector('use');
            if (!useElement) return;

            const href = useElement.getAttribute('href');
            if (!href) return;

            const itemId = href.split('#')[1];
            const itemElement = item.querySelector('.Item_item__2De2O');
            if (!itemElement) return;

            if (favoriteItems.includes(itemId)) {
                // 为收藏物品添加突出样式
                itemElement.style.boxShadow = '0 0 5px 2px gold';
                itemElement.style.position = "relative";

                // 添加星标标记
                let starMark = itemElement.querySelector('.favorite-star-mark');
                if (!starMark) {
                    starMark = document.createElement('div');
                    starMark.className = 'favorite-star-mark';
                    starMark.style.position = 'absolute';
                    starMark.style.top = '2px';
                    starMark.style.left = '2px';
                    starMark.style.color = 'gold';
                    starMark.style.fontSize = '14px';
                    starMark.style.fontWeight = 'bold';
                    starMark.style.zIndex = '2';
                    starMark.innerHTML = '★';
                    itemElement.appendChild(starMark);
                }
            } else {
                // 移除非收藏物品的突出样式
                itemElement.style.boxShadow = '';
                const starMark = itemElement.querySelector('.favorite-star-mark');
                if (starMark) {
                    itemElement.removeChild(starMark);
                }
            }
        });
    }

    // 添加收藏按钮到物品操作菜单
    function addFavoriteButton() {
        // 查找所有物品操作菜单
        const actionMenus = document.querySelectorAll('.Item_actionMenu__2yUcG');
        if (actionMenus.length === 0) return;

        actionMenus.forEach(actionMenu => {
            // 检查是否已经有收藏按钮
            if (actionMenu.querySelector('.favorite-button')) return;

            // 找到物品名称
            const nameElement = actionMenu.querySelector('.Item_name__2C42x');
            if (!nameElement) return;

            // 获取物品名称
            const itemName = nameElement.textContent.trim();

            // 尝试从页面上找到对应的物品元素
            const svgElements = document.querySelectorAll(`svg[aria-label="${itemName}"]`);
            if (svgElements.length === 0) return;

            // 获取物品ID
            const useElement = svgElements[0].querySelector('use');
            if (!useElement) return;

            const href = useElement.getAttribute('href');
            if (!href) return;

            const itemId = href.split('#')[1];
            if (!itemId) return;

            // 创建收藏按钮
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'Button_button__1Fe9z Button_fullWidth__17pVU favorite-button';
            favoriteButton.textContent = favoriteItems.includes(itemId) ? '取消收藏' : '收藏物品';

            // 添加点击事件
            favoriteButton.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (favoriteItems.includes(itemId)) {
                    favoriteItems = favoriteItems.filter(id => id !== itemId);
                    favoriteButton.textContent = '收藏物品';
                } else {
                    favoriteItems.push(itemId);
                    favoriteButton.textContent = '取消收藏';
                }

                GM_setValue('favoriteItems', favoriteItems);
                // 强制重新排序
                isSorted = false;
                sortMarketItems();
            });

            actionMenu.appendChild(favoriteButton);
        });
    }

    // 监听物品操作菜单的出现
    function observeTooltips() {
        // 定期检查是否有新的操作菜单出现
        setInterval(() => {
            addFavoriteButton();
        }, 1000);

        // 同时使用MutationObserver作为备用方案
        const observer = new MutationObserver(function (mutations) {
            let shouldCheck = false;

            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) {
                            if (node.classList && (
                                node.classList.contains('MuiTooltip-tooltip') ||
                                node.classList.contains('Item_actionMenu__2yUcG')
                            )) {
                                shouldCheck = true;
                            } else if (node.querySelector && (
                                node.querySelector('.MuiTooltip-tooltip') ||
                                node.querySelector('.Item_actionMenu__2yUcG')
                            )) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                setTimeout(addFavoriteButton, 100);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    // 监听市场物品容器的变化
    function observeMarketItems() {
        let isProcessing = false;

        // 使用防抖函数来减少排序操作的频率
        function debouncedSort() {
            if (isProcessing) return;
            isProcessing = true;

            setTimeout(() => {
                sortMarketItems();
                isProcessing = false;
            }, 100);
        }

        // 定期检查市场容器是否存在
        const checkMarketPanel = setInterval(() => {
            const marketPanel = document.querySelector('.TabsComponent_tabPanelsContainer__26mzo');
            if (marketPanel) {
                clearInterval(checkMarketPanel);

                // 使用更轻量级的监听配置
                const observer = new MutationObserver(debouncedSort);
                observer.observe(marketPanel, {
                    childList: true,
                    subtree: true
                });

                // 初始排序
                sortMarketItems();
            }
        }, 500);
    }

    // 设置定时器，降低检查频率以减轻性能负担
    setInterval(sortMarketItems, 200);

    // 初始执行一次排序
    setTimeout(sortMarketItems, 1000);

    // 开始监听市场物品容器的变化
    observeMarketItems();

    // 开始监听提示框的出现
    observeTooltips();
})();