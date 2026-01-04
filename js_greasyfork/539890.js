// ==UserScript==
// @name         一键评教脚本 (HQU) - 全自动版
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  在华侨大学教务评教列表页添加“一键完成”和“设置”按钮，自动依次填写、确认并提交所有评教问卷，支持自定义答题间隔。
// @author       Gemini
// @match        https://jwapp.hqu.edu.cn/jwapp/sys/pjapp/*default/index.do*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539890/%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%20%28HQU%29%20-%20%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539890/%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%20%28HQU%29%20-%20%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const OPINION_TEXT = '课程很好，无其他意见'; // 自动填写的评语
    let ANSWER_DELAY = GM_getValue('answer_delay', 500); // 从存储读取答题间隔，默认为500ms

    /**
     * 延时函数
     * @param {number} ms - 毫秒数
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 等待指定元素出现
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时时间
     * @returns {Promise<Element>}
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
                elapsedTime += intervalTime;
                if (elapsedTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`等待元素超时: ${selector}`));
                }
            }, intervalTime);
        });
    }

    /**
     * 等待指定元素消失
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时时间
     */
     function waitForElementToDisappear(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                if (!document.querySelector(selector)) {
                    clearInterval(interval);
                    resolve();
                }
                 elapsedTime += intervalTime;
                if (elapsedTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`等待元素消失超时: ${selector}`));
                }
            }, intervalTime);
        });
    }


    /**
     * 填写并提交单个问卷 (已修复二次确认)
     */
    async function fillAndSubmitForm() {
        console.log("检测到问卷，开始填写...");

        await waitForElement('.wjtxQuestionItem');
        await delay(500);

        const questionItems = document.querySelectorAll('.wjtxQuestionItem');

        for (const item of questionItems) {
            // 1. 单选题
            const firstRadio = item.querySelector('.wjtxQuestionOptionItem .wjtxRadioButton');
            if (firstRadio) firstRadio.click();

            // 2. 多选题
            const checkBoxes = item.querySelectorAll('.jqx-checkbox');
            if (checkBoxes.length > 0) {
                checkBoxes.forEach(box => {
                    const labelText = box.textContent || box.innerText;
                    if (labelText && !labelText.includes('基本无变化')) {
                        if (box.getAttribute('aria-checked') === 'false') {
                            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
                            const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
                            box.dispatchEvent(mouseDownEvent);
                            box.dispatchEvent(mouseUpEvent);
                        }
                    }
                });
            }

            // 3. 主观题
            const textArea = item.querySelector('textarea.jqx-text-area-element');
            if (textArea) {
                textArea.focus();
                textArea.value = OPINION_TEXT;
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
                textArea.dispatchEvent(new Event('change', { bubbles: true }));
                textArea.blur();
            }

            // 模拟人工答题间隔
            console.log(`- 答题间隔 ${ANSWER_DELAY}ms`);
            await delay(ANSWER_DELAY);
        }

        console.log("问卷填写完毕，准备提交...");
        await delay(500);

        const initialSubmitButton = Array.from(document.querySelectorAll('.bh-paper-pile-dialog .wjtxOperationButtonContainer button'))
                                  .find(btn => btn.textContent.trim() === '提交');

        if (!initialSubmitButton) throw new Error("未找到“提交”按钮！");

        initialSubmitButton.click();
        console.log("已点击“提交”按钮，等待确认弹窗...");

        // FIX: 处理新的二次确认弹窗
        try {
            const finalConfirmButtonSelector = '.bh-dialog-btn.bh-bg-primary';
            const finalConfirmButton = await waitForElement(finalConfirmButtonSelector, 3000);
            console.log("检测到确认对话框，正在点击最终确认...");
            finalConfirmButton.click();
        } catch (e) {
            console.warn("未检测到二次确认弹窗，脚本将继续执行。");
        }
    }

    /**
     * 主流程：处理所有评教
     */
    async function processAllEvaluations(button) {
        const originalButtonText = button.innerHTML;
        button.disabled = true;
        document.getElementById('eval-settings-btn').disabled = true;

        const evalButtons = Array.from(document.querySelectorAll('.wj-wjxx .bh-btn-primary'))
                                 .filter(btn => btn.textContent.trim() === '立刻评教');

        if (evalButtons.length === 0) {
            alert("在当前页面未找到任何“立刻评教”的按钮。\n请确认您在待评课程列表页。");
            button.disabled = false;
            document.getElementById('eval-settings-btn').disabled = false;
            return;
        }

        const total = evalButtons.length;
        console.log(`发现 ${total} 个待评教课程。`);

        for (let i = 0; i < total; i++) {
            const currentEvalButton = Array.from(document.querySelectorAll('.wj-wjxx .bh-btn-primary')).find(btn => btn.textContent.trim() === '立刻评教');

            if(!currentEvalButton) {
                 console.log("找不到下一个“立刻评教”按钮，可能已经全部完成。");
                 break;
            }

            const courseTitle = currentEvalButton.closest('.wjx-container').querySelector('.wjxSubTitle').textContent.trim();
            console.log(`--- 开始处理第 ${i + 1} / ${total} 个: ${courseTitle} ---`);
            button.innerHTML = `⚡ 处理中 (${i + 1}/${total})...`;

            try {
                currentEvalButton.click();
                await fillAndSubmitForm();
                await waitForElementToDisappear('.bh-paper-pile-dialog');
                console.log(`--- ${courseTitle} 处理完成 ---`);
                await delay(1500);
            } catch (error) {
                console.error(`处理课程 "${courseTitle}" 时出错:`, error);
                alert(`处理课程 "${courseTitle}" 时发生错误，已停止。\n请检查控制台获取详细信息，然后刷新页面重试。`);
                button.innerHTML = originalButtonText;
                button.disabled = false;
                document.getElementById('eval-settings-btn').disabled = false;
                return;
            }
        }

        button.innerHTML = '🎉 全部完成';
        button.style.background = 'linear-gradient(45deg, #28a745, #218838)';
        document.getElementById('eval-settings-btn').disabled = true;
        alert(`所有 ${total} 个评教已自动完成并提交！`);
        console.log("所有评教已处理完毕！");
    }

    /**
     * 创建UI界面 (已更新，增加设置按钮)
     */
    function setupUI() {
        if (document.getElementById('eval-button-container')) return;

        GM_addStyle(`
            #eval-button-container {
                position: absolute;
                top: 8px;
                right: 0px;
                z-index: 999;
                display: flex;
                gap: 10px;
            }
            .eval-btn {
                padding: 6px 16px;
                font-size: 14px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-weight: bold;
                color: white;
                border: none;
                border-radius: 18px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .eval-btn:hover:not(:disabled) {
                transform: translateY(-2px);
            }
            #process-all-eval-btn {
                background: linear-gradient(45deg, #1E90FF, #0073e6);
                box-shadow: 0 2px 8px rgba(0, 123, 255, 0.4);
            }
            #process-all-eval-btn:hover:not(:disabled) {
                 box-shadow: 0 4px 12px rgba(0, 123, 255, 0.5);
            }
            #eval-settings-btn {
                padding: 6px 12px;
                background: linear-gradient(45deg, #6c757d, #5a6268);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }
            #eval-settings-btn:hover:not(:disabled) {
                 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            .eval-btn:disabled {
                background: linear-gradient(45deg, #9e9e9e, #888888);
                cursor: not-allowed;
                box-shadow: none;
                transform: none;
            }
        `);

        const targetContainer = document.querySelector('#wdpj-wj-section .wdpj-bh-buttons');
        if (targetContainer) {
            targetContainer.style.position = 'relative';

            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'eval-button-container';

            const processAllButton = document.createElement('button');
            processAllButton.id = 'process-all-eval-btn';
            processAllButton.className = 'eval-btn';
            processAllButton.innerHTML = '⚡ 一键完成所有评教';
            processAllButton.addEventListener('click', () => processAllEvaluations(processAllButton));

            const settingsButton = document.createElement('button');
            settingsButton.id = 'eval-settings-btn';
            settingsButton.className = 'eval-btn';
            settingsButton.innerHTML = '⚙️ 设置';
            settingsButton.addEventListener('click', () => {
                const newDelay = prompt(`请输入每个问题之间的答题间隔（单位：毫秒）：\n推荐值为 200 到 1000 之间。`, ANSWER_DELAY);
                if (newDelay !== null && !isNaN(newDelay) && newDelay >= 0) {
                    const parsedDelay = parseInt(newDelay, 10);
                    GM_setValue('answer_delay', parsedDelay);
                    ANSWER_DELAY = parsedDelay;
                    alert(`设置成功！新的答题间隔为 ${parsedDelay} 毫秒。`);
                    console.log(`答题间隔已更新为: ${parsedDelay}ms`);
                } else if (newDelay !== null) {
                    alert('输入无效，请输入一个非负数字。');
                }
            });

            buttonContainer.appendChild(settingsButton);
            buttonContainer.appendChild(processAllButton);
            targetContainer.appendChild(buttonContainer);
        }
    }

    window.addEventListener('hashchange', () => setTimeout(setupUI, 1000));
    window.addEventListener('load', () => setTimeout(setupUI, 1000));

})();
