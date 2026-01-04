// ==UserScript==
// @name        auto fill sensitivity
// @namespace   Violentmonkey Scripts
// @match       https://www.mouse-sensitivity.com/*
// @grant       GM_registerMenuCommand
// @version     1.1
// @author      wray-lee
// @license     GPL-V3
// @description 2024/5/27 23:22:07
// @downloadURL https://update.greasyfork.org/scripts/545865/auto%20fill%20sensitivity.user.js
// @updateURL https://update.greasyfork.org/scripts/545865/auto%20fill%20sensitivity.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 等待指定的元素出现在页面上，并确保它可见可交互
     * @param {string} selector - CSS 选择器
     * @returns {Promise<Element>} - 返回找到的元素
     */
    function waitForElement(selector) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearInterval(interval);
                reject(new Error(`等待元素 "${selector}" 超时。`));
            }, 10000);

            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    resolve(element);
                }
            }, 100);
        });
    }

    /**
     * 主执行函数
     */
    async function main() {
        try {
            // --- 步骤 1: 打开游戏选择下拉菜单 ---
            console.log('正在等待游戏选择框的交互区域...');
            const gameDropdown = await waitForElement('span[aria-labelledby="select2-g0-container"]');

            // 使用 mousedown 事件模拟点击以打开下拉菜单
            const clickEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: unsafeWindow
            });
            gameDropdown.dispatchEvent(clickEvent);
            console.log('已向游戏选择框发送 mousedown 事件以打开菜单。');

            // --- 步骤 2: 在动态出现的搜索框中输入游戏名称 ---
            console.log('正在等待搜索框...');
            const searchInput = await waitForElement('.select2-search__field');
            console.log('搜索框已找到。');

            searchInput.value = 'apex';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('已在搜索框中输入 "apex"。');

            // --- 步骤 3: 等待 "Apex 英雄" 选项被高亮，并模拟回车键确认选择 ---
            console.log('正在等待 "Apex 英雄" 选项高亮...');
            // 确保选项出现且高亮
            const apexOption = await waitForElement('li.select2-results__option--highlighted');

            if (apexOption && apexOption.innerText.trim() === 'Apex 英雄') {
                console.log('已确认 "Apex 英雄" 被高亮。');

                // 关键修改：模拟键盘回车键（keyCode 13）来确认选择
                console.log('正在模拟回车键确认选择...');
                const keyboardEvent = new KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    keyCode: 13,
                    which: 13
                });

                // 将键盘事件派发到搜索输入框上，这是 Select2 监听键盘事件的地方
                searchInput.dispatchEvent(keyboardEvent);
                console.log('已成功发送回车键事件，"Apex 英雄" 应该已被选中。');
            } else {
                throw new Error('高亮的选项不是 "Apex 英雄"。');
            }

            // 等待下拉菜单关闭或页面状态更新，给网站的JS留出处理时间
            await new Promise(resolve => setTimeout(resolve, 500));

            // --- 步骤 4: 填充灵敏度等数据 ---
            console.log('等待并填充其他数据...');
            const sensInput = await waitForElement('#sens1ag0');
            sensInput.value = 1.25;

            const dpiInput = await waitForElement('#dpiag0');
            dpiInput.value = 1200;

            const fovInput = await waitForElement('#fovag0');
            fovInput.value = 110;

            const dpi2Input = await waitForElement('#dpiag1');
            dpi2Input.value = 1200;

            // 触发 change 事件，确保网站的计算逻辑被激活
            [sensInput, dpiInput, fovInput, dpi2Input].forEach(el => {
                el.dispatchEvent(new Event('change', { bubbles: true }));
            });

            console.log('所有数据填充完毕！');

        } catch (error) {
            console.error('自动填充脚本出错:', error);
        }
    }

    // 监听 window.load 事件，确保页面所有资源都加载完毕后再执行
    window.addEventListener('load', () => {
        console.log('页面已完全加载，将在1秒后运行自动填充脚本。');
        setTimeout(main, 1000);
    });

})();