// ==UserScript==
// @name         銀河奶牛放置-任務製作材料快捷購買
// @name:en      Milky way idle Quest Materials Instant buy 
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  在製作配方彈窗中，為缺少的材料(包含升級道具)右側添加一個快捷購買按鈕，並在購買後自動刷新狀態。
// @description:en Adds a quick-buy button with the missing quantity for required materials in any crafting/upgrading window.
// @author       YourName
// @match        https://www.milkywayidle.com/game*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544234/%E9%8A%80%E6%B2%B3%E5%A5%B6%E7%89%9B%E6%94%BE%E7%BD%AE-%E4%BB%BB%E5%8B%99%E8%A3%BD%E4%BD%9C%E6%9D%90%E6%96%99%E5%BF%AB%E6%8D%B7%E8%B3%BC%E8%B2%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/544234/%E9%8A%80%E6%B2%B3%E5%A5%B6%E7%89%9B%E6%94%BE%E7%BD%AE-%E4%BB%BB%E5%8B%99%E8%A3%BD%E4%BD%9C%E6%9D%90%E6%96%99%E5%BF%AB%E6%8D%B7%E8%B3%BC%E8%B2%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // ========== 設定區：你可以根據需要修改下面的值 ==========
    // =================================================================================
    const MAX_PRICE_MULTIPLIER = 10; // 願意用高於市價 15% 的價格購買 (可自行調整)
    const REFRESH_DELAY_MS = 200; // 購買後等待多少毫秒刷新UI (2.5秒)，如果伺服器回應慢可以適當加長
    // =================================================================================

    /**
     * 購買單一物品的函式
     * @param {string} itemName - 物品的中文名稱
     * @param {number} quantity - 要購買的數量
     */
    async function buyItem(itemName, quantity) {
        if (quantity <= 0) return;
        if (!window.mwi?.MWICoreInitialized) {
            alert('錯誤：遊戲核心物件 (mwi) 未就緒！');
            return;
        }
        const itemHrid = window.mwi.itemNameToHridDict[itemName];
        if (!itemHrid) {
            alert(`錯誤：找不到物品 "${itemName}" 的內部ID！`);
            return;
        }
        const priceInfo = window.mwi.coreMarket.getItemPrice(itemHrid, 0, true);
        const askPrice = priceInfo?.ask;
        if (!askPrice || askPrice <= 0) {
            alert(`錯誤：查不到 "${itemName}" 的市場價格，無法自動下單。`);
            return;
        }
        const maxPrice = Math.ceil(askPrice * MAX_PRICE_MULTIPLIER);
        const totalCost = (quantity * maxPrice).toLocaleString();
        const confirmationMessage = `確認購買？\n\n物品：${itemName}\n數量：${quantity}\n最高單價：${maxPrice.toLocaleString()}\n\n預計最高花費：${totalCost} 金幣`;
        // const isConfirmed = confirm(confirmationMessage);
        const isConfirmed = true;

        if (isConfirmed) {
            console.log(`下單購買: ${itemName}, Hrid: ${itemHrid}, 數量: ${quantity}, 最高單價: ${maxPrice}`);
            try {
                window.mwi.game.handlePostMarketOrder(false, itemHrid, 0, quantity, maxPrice, true);

                // *** 新增功能：購買後延遲刷新UI ***
                setTimeout(() => {
                    const activeModal = document.querySelector('.Modal_modal__1Jiep');
                    if (activeModal) {
                        console.log('刷新按鈕狀態...');
                        refreshButtons(activeModal);
                    }
                }, REFRESH_DELAY_MS);

            } catch (e) {
                console.error("呼叫購買函式時出錯！", e);
                alert("執行購買操作時發生錯誤，請按 F12 查看主控台以獲取詳細資訊。");
            }
        }
    }

    /**
     * 核心函式：刷新指定視窗內的所有購買按鈕
     * @param {Node} modalNode - 彈出視窗的 DOM 節點
     */
    function refreshButtons(modalNode) {
        // 先移除所有由本腳本添加的舊按鈕和數量提示
        modalNode.querySelectorAll('.quick-buy-wrapper').forEach(el => el.remove());

        const productionCountInput = modalNode.querySelector('.SkillActionDetail_maxActionCountInput__1C0Pw .Input_input__2-t98');
        if (!productionCountInput) return;
        const productionCount = parseFloat(productionCountInput.value) || 1;

        // --- 1. 處理普通材料 ---
        const requirementsContainer = modalNode.querySelector('.SkillActionDetail_itemRequirements__3SPnA');
        if (requirementsContainer) {
            const childNodes = requirementsContainer.childNodes;
            for (let i = 0; i < childNodes.length; i += 3) {
                const itemContainerDiv = childNodes[i + 2];
                if (!itemContainerDiv || itemContainerDiv.nodeName !== 'DIV') continue;
                const baseRequiredAmount = parseFloat((childNodes[i + 1]).textContent.replace(/[^0-9.]/g, ''));
                const currentAmount = parseFloat((childNodes[i]).textContent.replace(/[^0-9.]/g, ''));
                const itemName = itemContainerDiv.querySelector('.Item_name__2C42x')?.textContent;
                if (isNaN(currentAmount) || isNaN(baseRequiredAmount) || !itemName) continue;
                const missingAmount = Math.ceil((baseRequiredAmount * productionCount) - currentAmount);

                if (missingAmount > 0) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'quick-buy-wrapper';
                    wrapper.style.cssText = 'display: flex; align-items: center;';
                    const button = document.createElement('button');
                    button.innerHTML = '🛒';
                    button.title = `總需求: ${baseRequiredAmount * productionCount}\n缺少: ${missingAmount}\n點擊購買`;
                    button.className = 'quick-buy-button Button_button__1Fe9z Button_small__3fqC7';
                    button.style.cssText = 'padding: 0px 6px; flex-shrink: 0;';
                    button.onclick = (e) => { e.stopPropagation(); buyItem(itemName, missingAmount); };
                    const missingSpan = document.createElement('span');
                    missingSpan.textContent = `-${missingAmount.toLocaleString()}`;
                    missingSpan.style.cssText = 'color: red; margin-left: 5px; font-weight: bold;';
                    wrapper.appendChild(button);
                    wrapper.appendChild(missingSpan);
                    itemContainerDiv.style.cssText = 'display: flex; align-items: center; justify-content: space-between; width: 100%;';
                    itemContainerDiv.appendChild(wrapper);
                }
            }
        }

        // --- 2. 處理需要升級的道具 ---
        const upgradeSection = modalNode.querySelector('.SkillActionDetail_upgradeItemSelectorInput__2mnS0');
        if (upgradeSection) {
            const itemNameElement = upgradeSection.querySelector('svg[aria-label]');
            const itemName = itemNameElement ? itemNameElement.getAttribute('aria-label') : null;
            const ownedAmountText = upgradeSection.querySelector('.Item_count__1HVvv')?.textContent || '0';
            const ownedAmount = parseFloat(ownedAmountText.replace(/,/g, ''));
            if (!itemName || isNaN(ownedAmount)) return;

            const missingAmount = Math.ceil(productionCount - ownedAmount);
            if (missingAmount > 0) {
                const wrapper = document.createElement('div');
                wrapper.className = 'quick-buy-wrapper';
                wrapper.style.cssText = 'display: flex; align-items: center; margin-left: 8px;';
                const button = document.createElement('button');
                button.innerHTML = '🛒';
                button.title = `總需求: ${productionCount}\n缺少: ${missingAmount}\n點擊購買`;
                button.className = 'quick-buy-button Button_button__1Fe9z Button_small__3fqC7';
                button.style.cssText = 'padding: 0px 6px; flex-shrink: 0;';
                button.onclick = (e) => { e.stopPropagation(); buyItem(itemName, missingAmount); };
                const missingSpan = document.createElement('span');
                missingSpan.textContent = `-${missingAmount.toLocaleString()}`;
                missingSpan.style.cssText = 'color: red; margin-left: 5px; font-weight: bold;';
                wrapper.appendChild(button);
                wrapper.appendChild(missingSpan);
                const itemSelector = upgradeSection.querySelector('.ItemSelector_itemSelector__2eTV6');
                if (itemSelector) {
                    itemSelector.parentElement.style.display = 'flex';
                    itemSelector.parentElement.style.alignItems = 'center';
                    itemSelector.parentElement.appendChild(wrapper);
                }
            }
        }
    }

    function observeAndInject() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            const modal = node.matches('.Modal_modal__1Jiep') ? node : node.querySelector('.Modal_modal__1Jiep');
                            if (modal) {
                                const reprocess = () => {
                                    setTimeout(() => refreshButtons(modal), 100);
                                };
                                setTimeout(reprocess, 200);
                                const input = modal.querySelector('.SkillActionDetail_maxActionCountInput__1C0Pw .Input_input__2-t98');
                                if (input) {
                                    input.addEventListener('change', reprocess);
                                    input.addEventListener('keyup', reprocess);
                                }
                            }
                        }
                    });
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    new Promise(resolve => {
        let count = 0;
        const interval = setInterval(() => {
            count++;
            if (count > 30) { clearInterval(interval); }
            if (window.mwi?.MWICoreInitialized) { clearInterval(interval); resolve(); }
        }, 1000);
    }).then(() => {
        console.log("銀河放置-配方材料快捷購買腳本已啟動。");
        observeAndInject();
    });
})();