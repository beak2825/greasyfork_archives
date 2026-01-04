// ==UserScript==
// @name         MWI Character Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为MWI角色选择界面添加排序功能
// @author       shykai
// @match        https://www.milkywayidle.com/characterSelect
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530554/MWI%20Character%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/530554/MWI%20Character%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 添加CSS样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .character-order-buttons {
                display: flex;
                flex-direction: column;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            }

            .order-button {
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                margin: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                transition: background-color 0.2s;
            }

            .order-button:hover {
                background-color: rgba(0, 0, 0, 0.8);
            }

            .order-button:disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }

            .CharacterSelectPage_slot__2RKMU {
                position: relative;
            }
        `;
        document.head.appendChild(style);
    }

    // 添加排序按钮
    function addOrderButtons(container) {
        const slots = container.querySelectorAll('.CharacterSelectPage_slot__2RKMU');

        slots.forEach((slot, index) => {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'character-order-buttons';

            const upButton = document.createElement('button');
            upButton.className = 'order-button up-button';
            upButton.innerHTML = '↑';
            upButton.disabled = index === 0;
            upButton.title = '向上移动';
            upButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                moveCharacter(index, index - 1);
            };

            const downButton = document.createElement('button');
            downButton.className = 'order-button down-button';
            downButton.innerHTML = '↓';
            downButton.disabled = index === slots.length - 1;
            downButton.title = '向下移动';
            downButton.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                moveCharacter(index, index + 1);
            };

            buttonsContainer.appendChild(upButton);
            buttonsContainer.appendChild(downButton);
            slot.appendChild(buttonsContainer);
        });
    }

    // 从槽位元素中提取角色ID - 保留此函数以备将来使用
    function getCharacterIdFromSlot(slotElement) {
        const href = slotElement.getAttribute('href');
        if (!href) return null;

        const match = href.match(/characterId=(\d+)/);
        return match ? match[1] : null;
    }

    // 保存角色顺序到油猴存储
    function saveCharacterOrder(container) {
        const slots = container.querySelectorAll('.CharacterSelectPage_slot__2RKMU');
        const orderData = [];

        slots.forEach((slot) => {
            const charId = getCharacterIdFromSlot(slot);
            if (charId) {
                orderData.push(charId);
            }
        });

        if (orderData.length > 0) {
            GM_setValue('mwi_character_order', orderData);
            console.log('角色顺序已保存:', orderData);
        }
    }

    // 应用保存的角色顺序
    function applyCharacterOrder(container) {
        const orderData = GM_getValue('mwi_character_order', null);
        if (!orderData) return false;

        console.log('尝试应用保存的角色顺序:', orderData);

        try {
            const slots = Array.from(container.querySelectorAll('.CharacterSelectPage_slot__2RKMU'));

            // 创建角色ID到元素的映射
            const charMap = new Map();
            slots.forEach(slot => {
                const charId = getCharacterIdFromSlot(slot);
                if (charId) {
                    charMap.set(charId, slot);
                }
            });

            // 检查保存的顺序是否与当前角色匹配
            const allIdsMatch = orderData.every(id => charMap.has(id)) &&
                               orderData.length === charMap.size;

            if (!allIdsMatch) {
                console.log('保存的角色顺序与当前角色不匹配，跳过排序');
                return false;
            }

            // 按保存的顺序重新排列
            orderData.forEach(charId => {
                const slot = charMap.get(charId);
                if (slot) {
                    // 移到容器末尾，实现按保存顺序排列
                    container.appendChild(slot);
                }
            });

            console.log('已应用保存的角色顺序');
            return true;
        } catch (error) {
            console.error('应用保存的角色顺序时出错:', error);
            return false;
        }
    }

    // 移动角色位置
    function moveCharacter(fromIndex, toIndex) {
        if (fromIndex > toIndex) {
            [fromIndex, toIndex] = [toIndex, fromIndex];
        }
        console.log(`移动角色: 从 ${fromIndex} 到 ${toIndex}`);
        const container = document.querySelector('.CharacterSelectPage_characterSlots__3EDWm');
        const slots = Array.from(container.querySelectorAll('.CharacterSelectPage_slot__2RKMU'));

        if (fromIndex < 0 || fromIndex >= slots.length || toIndex < 0 || toIndex >= slots.length) {
            return;
        }

        try {
            // 直接在DOM中交换元素位置
            const fromSlot = slots[fromIndex];
            const toSlot = slots[toIndex];

            // 移除排序按钮以避免干扰
            fromSlot.querySelector('.character-order-buttons')?.remove();
            toSlot.querySelector('.character-order-buttons')?.remove();

            // 使用更简单可靠的方法交换节点
            if (fromIndex < toIndex) {
                // 向下移动
                container.insertBefore(toSlot, fromSlot);
            } else {
                // 向上移动
                container.insertBefore(fromSlot, toSlot.nextSibling);
            }

            // 保存新的角色顺序
            saveCharacterOrder(container);

            // 重新添加排序按钮
            setTimeout(() => {
                document.querySelectorAll('.character-order-buttons').forEach(btn => btn.remove());
                addOrderButtons(container);
            }, 0);
        } catch (error) {
            console.error('移动元素时出错:', error);
        }
    }

    // 初始化
    function init() {
        const config = { attributes: true, childList: true, subtree: true };

        const observer = new MutationObserver(function (mutationsList, observer) {
            const container = document.querySelector('.CharacterSelectPage_characterSlots__3EDWm');

            // 添加CSS样式
            addStyles();

            // 先尝试应用保存的顺序
            applyCharacterOrder(container);

            // 添加排序按钮
            addOrderButtons(container);

            // 如果是第一次加载，保存初始顺序
            if (!GM_getValue('mwi_character_order', null)) {
                saveCharacterOrder(container);
            }

            // 停止观察
            observer.disconnect();
        });

        const playerPage = document.querySelector('.CharacterSelectPage_content__-8-oQ');
        observer.observe(playerPage, config);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();