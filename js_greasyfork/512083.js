// ==UserScript==
// @name         动作重构偷懒脚本
// @namespace    http://tampermonkey.net/
// @version      2024-10-10
// @description  help config action
// @author       You
// @match        https://safe.bytedance.net/v2/*/strategy/op/strategy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512083/%E5%8A%A8%E4%BD%9C%E9%87%8D%E6%9E%84%E5%81%B7%E6%87%92%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512083/%E5%8A%A8%E4%BD%9C%E9%87%8D%E6%9E%84%E5%81%B7%E6%87%92%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 观察器回调函数
    function callback(mutationsList, observer) {
        for (let mutation of mutationsList) {
            // 检查是否有新的节点被添加
            for (let node of mutation.addedNodes) {
                // 如果是弹窗节点
                const isSideSheet = Boolean(Array.from(node.querySelectorAll('div')).find(el => el.textContent === '新建规则'))
                if (node.tagName === 'DIV' && node.classList.contains('semi-portal') && isSideSheet) {
                    // 填充输入框
                    fillFormFields();
                    // 停止观察，避免重复执行
                    // observer.disconnect();
                }
            }
        }
    }

    // 选择器观察者配置
    const config = { attributes: false, childList: true, subtree: true };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 选择目标节点
    const targetNode = document.body;

    // 观察配置
    observer.observe(targetNode, config);

    const sleep = time => new Promise((res, rej) => setTimeout(res, time))
    // 填充表单字段的函数
    async function fillFormFields() {
        const fillNameField = () => {
            let input = document.querySelector("#name");
            let lastValue = input.value;
            input.value = 'test';
            let event = new Event('change', { bubbles: true });
            // hack React15
            // event.simulated = true;
            // hack React16 内部定义了descriptor拦截value，此处重置状态
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
        }
        const fillConditionField = async () => {
            const conditionEl = document.querySelector('.semi-list-item-body-main').querySelector('input') || document.querySelector('.semi-list-item-body-main div div div div div div');
            conditionEl.click()
            await sleep(300)
            const conditionTabEl = Array.from(document.querySelector('.ant-popover-inner-content').querySelectorAll('span')).find(el => el.textContent === '必定执行')
            conditionTabEl.click()
            await sleep(300)
            const conditionItemEl = Array.from(document.querySelector('.ant-popover-inner-content').querySelectorAll('span')).find(el => el.textContent === '必定执行(true)')
            conditionItemEl && conditionItemEl.click()

        }

        fillNameField()
        await sleep(200)
        fillConditionField()

        
    }
})();