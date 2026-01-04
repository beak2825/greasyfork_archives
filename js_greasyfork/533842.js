// ==UserScript==
// @name         NWAFU-评教
// @namespace    http://tampermonkey.net/
// @version      3.71
// @description  融合导航和自动填表功能。持续检测列表页和表单页。史山代码，能用就行。还未适配结果性评教。。。
// @author       Gemini
// @match        https://newehall.nwafu.edu.cn/jwapp/sys/jwwspj/*default/index.do*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533842/NWAFU-%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/533842/NWAFU-%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("【NWAFU全自动评教 】脚本已启动");

    // --- 用户配置 (合并两者) ---
    // 填表相关 (来自脚本1)
    const COMMENT_TEXT = "无意见";
    const AUTO_SUBMIT = true;
    const AUTO_CONFIRM = true;
    const SUBMIT_DELAY_MS = 500;
    const CONFIRM_DELAY_MS = 1500;
    const MAX_CONFIRM_WAIT_TIME_MS = 10000;

    // 导航相关 (来自脚本2)
    const CHECK_INTERVAL_MS = 300; // 通用检查间隔
    const MAX_WAIT_TIME_MS = 10000; // 等待元素通用超时
    const TAB_SWITCH_DELAY_MS = 1500;
    const OBSERVER_DEBOUNCE_MS = 500; // Observer 防抖

    // *** 新增：导航后延迟 ***
    const NAVIGATION_COOLDOWN_MS = 5000; // 点击列表项进入表单后，导航逻辑暂停这么久 (毫秒)

    // --- 选择器常量 (合并两者) ---
    // 导航相关
    const LIST_PAGE_MARKER = 'div[title="结果性评教"]'; // 用于粗略判断是否在列表区
    const MAIN_CONTENT_AREA_SELECTOR = 'body';
    const RESULT_TAB_SELECTOR = 'div.bh-headerBar-nav-item[title="结果性评教"]';
    const PROCESS_TAB_SELECTOR = 'div.bh-headerBar-nav-item[title="过程评教"]';
    const ACTIVE_TAB_CLASS = 'bh-active';
    const EVALUATION_ITEM_CONTAINER_SELECTOR = '.bh-card.bh-card-lv1';
    const PENDING_TAG_SELECTOR = 'div.sc-panel-diagonalStrips-bar';
    const PENDING_TAG_TEXT = '未提交';
    // 填表相关
    const RADIO_INPUT_SELECTOR = 'input[type="radio"]:not([disabled])';
    const TEXTAREA_SELECTOR = 'textarea:not([disabled]):not([readonly])';
    const SUBMIT_BUTTON_SELECTOR = 'a[data-action="提交"]:not([disabled])';
    const CONFIRM_BUTTON_SELECTOR = 'a.bh-dialog-btn.bh-bg-primary.bh-color-primary-5';

    // --- 状态变量 ---
    let observerDebounceTimer = null;
    let confirmWaitTimeout = null; // 用于等待确认按钮
    let isFillingForm = false;     // 标记是否正在执行填表操作 (来自脚本1的isEvaluating)
    let lastNavigationClickTime = 0; // 记录上次点击列表项的时间戳

    // --- 警告 ---
    if (AUTO_SUBMIT) console.warn("【NWAFU全自动评教脚本】警告：已启用自动提交功能！");
    if (AUTO_CONFIRM) console.warn("【NWAFU全自动评教脚本】警告：已启用自动点击“确认”功能！延迟 " + (CONFIRM_DELAY_MS / 1000) + " 秒。");

    // --- 辅助函数：显示消息给用户 (选用脚本1的版本) ---
    function displayMessage(message, type = 'info', duration = 5000) {
        console[type === 'error' ? 'error' : (type === 'warning' ? 'warn' : 'log')](message);
        const messageBoxId = 'nwafu-evaluation-script-message-merged';
        let messageBox = document.getElementById(messageBoxId);
        if (!messageBox && document.body) {
            messageBox = document.createElement('div');
            messageBox.id = messageBoxId;
            Object.assign(messageBox.style, {
                position: 'fixed',
                top: '15px',
                right: '15px',
                padding: '12px 18px',
                backgroundColor: '#fff',
                borderLeft: '5px solid #ccc',
                zIndex: '10001',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#333',
                maxWidth: '350px',
                wordBreak: 'break-word',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'opacity 0.5s ease-in-out, transform 0.3s ease-out',
                opacity: '0',
                transform: 'translateX(100%)',
                fontFamily: 'sans-serif',
                lineHeight: '1.5'
            });
            document.body.appendChild(messageBox);
        } else if (!document.body) {
            return;
        }

        let borderColor = '#4CAF50'; // success (default info)
        if (type === 'info') borderColor = '#2196F3';
        if (type === 'warning') borderColor = '#ff9800';
        if (type === 'error') borderColor = '#f44336';

        if (messageBox) {
            messageBox.style.borderLeftColor = borderColor;
            messageBox.innerHTML = message.replace(/\n/g, '<br>'); // Use innerHTML for line breaks
            messageBox.style.display = 'block';

            // Fade in animation
            setTimeout(() => {
                if (messageBox) {
                    messageBox.style.opacity = '1';
                    messageBox.style.transform = 'translateX(0)';
                }
            }, 50);

            // Auto hide logic
            if (messageBox.hideTimeout) clearTimeout(messageBox.hideTimeout);

            let hideDelay = duration;
            if (type === 'error') hideDelay = 15000;
            else if (type === 'warning') hideDelay = 10000;
            else if (type === 'success') hideDelay = 6000;

            if (hideDelay > 0) {
                messageBox.hideTimeout = setTimeout(() => {
                    if (messageBox) {
                        messageBox.style.opacity = '0';
                        messageBox.style.transform = 'translateX(100%)';
                        // Remove from DOM after transition
                        setTimeout(() => {
                            if (messageBox && messageBox.style.opacity === '0') {
                                messageBox.remove();
                            }
                        }, 500);
                    }
                }, hideDelay);
            } else { // duration <= 0 means persistent message
                messageBox.hideTimeout = null;
            }
        }
    }

    // --- 辅助函数：等待元素加载 (来自脚本2) ---
    function waitForElement(selector, timeout = MAX_WAIT_TIME_MS, baseElement = document) {
        return new Promise((resolve, reject) => {
            let element = baseElement.querySelector(selector);
            if (element && element.offsetParent !== null) { // Check visibility too
                resolve(element);
                return;
            }

            let intervalId = null;
            let timeoutId = null;

            const clearTimers = () => {
                clearInterval(intervalId);
                clearTimeout(timeoutId);
            };

            const check = () => {
                element = baseElement.querySelector(selector);
                if (element && element.offsetParent !== null) { // Check visibility
                    clearTimers();
                    resolve(element);
                }
            };

            intervalId = setInterval(check, CHECK_INTERVAL_MS);

            timeoutId = setTimeout(() => {
                clearTimers();
                console.warn(`【NWAFU全自动评教脚本】等待元素 ${selector} 超时 (${timeout}ms)`);
                reject(new Error(`Element ${selector} not found or not visible within ${timeout}ms`));
            }, timeout);

            check(); // Initial check
        });
    }


    // --- 填表逻辑 (来自脚本1，略作修改以使用 isFillingForm 状态) ---
    function containsEvaluationForm() { // 判断是否是“可填写”的表单页
        const radios = document.querySelectorAll(RADIO_INPUT_SELECTOR);
        const submitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
        const isSubmitButtonVisible = !!submitButton && submitButton.offsetParent !== null;
        // 简单判断：有单选按钮 且 提交按钮可见
        return radios.length > 0 && isSubmitButtonVisible;
    }

    function selectFirstRadioOption() {
        console.log("【NWAFU全自动评教脚本】步骤 1: 尝试选择“完全赞同”...");
        try {
            const allRadios = document.querySelectorAll(RADIO_INPUT_SELECTOR);
            if (allRadios.length === 0) {
                console.log("【NWAFU全自动评教脚本】未找到任何可用的单选按钮。");
                return false;
            }
            const radioGroups = {};
            allRadios.forEach(radio => {
                if (radio.offsetParent === null) return; // Skip invisible
                const name = radio.name;
                if (!name) return; // Skip radios without name (shouldn't happen in groups)
                if (!radioGroups[name]) {
                    radioGroups[name] = [];
                }
                radioGroups[name].push(radio);
            });

            const groupNames = Object.keys(radioGroups);
            if (groupNames.length === 0) {
                console.log("【NWAFU全自动评教脚本】未找到任何可见且可用的单选按钮组。");
                return false;
            }
            console.log(`【NWAFU全自动评教脚本】找到 ${groupNames.length} 个可见且可用的单选题组。`);

            let selectedCount = 0;
            let groupsProcessed = 0;
            for (const name of groupNames) {
                groupsProcessed++;
                // Only select if no option in the group is already checked
                const isAlreadySelected = radioGroups[name].some(radio => radio.checked);
                if (isAlreadySelected) {
                    selectedCount++;
                    continue;
                }

                const firstOption = radioGroups[name][0]; // Get the first radio in the group
                if (firstOption) {
                    firstOption.checked = true;
                    // Dispatch events to ensure frameworks recognize the change
                    firstOption.dispatchEvent(new Event('change', { bubbles: true }));
                    firstOption.dispatchEvent(new Event('input', { bubbles: true }));
                    selectedCount++;
                } else {
                    console.warn(`【NWAFU全自动评教脚本】单选题组 "${name}" 没有找到可用选项（异常情况）。`);
                }
            }

            if (selectedCount === 0 && groupsProcessed > 0) {
                console.warn("【NWAFU全自动评教脚本】未能选择任何单选按钮，可能是元素尚未完全加载或已被处理。");
                return false;
            }

            console.log(`【NWAFU全自动评教脚本】“完全赞同”选项选择完成，处理了 ${selectedCount} / ${groupsProcessed} 个组。`);
            return true; // Indicate success

        } catch (error) {
            console.error("【NWAFU全自动评教脚本】选择“完全赞同”时出错:", error);
            displayMessage("选择选项时出错，请检查控制台。", 'error');
            return false; // Indicate failure
        }
    }

    function fillTextBoxes() {
        console.log(`【NWAFU全自动评教脚本】步骤 2: 尝试填写评语：“${COMMENT_TEXT}”...`);
        try {
            const textAreasNodeList = document.querySelectorAll(TEXTAREA_SELECTOR); // Keep original NodeList query
            if (textAreasNodeList.length === 0) {
                console.log("【NWAFU全自动评教脚本】未找到需要填写的文本框 (textarea)。");
                return true; // Nothing to fill is considered success for this step
            }

            const textAreas = Array.from(textAreasNodeList); // Convert to Array
            console.log(`【NWAFU全自动评教脚本】找到 ${textAreas.length} 个可编辑文本框。`);

            let filledCount = 0;
            let visibleCount = 0; // Count visible ones separately

            textAreas.forEach((textarea) => {
                if (textarea.offsetParent !== null) { // Check visibility
                    visibleCount++; // Increment visible count
                    if (textarea.value.trim() === '') { // Only fill if empty
                        textarea.value = COMMENT_TEXT;
                        // Dispatch events
                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        textarea.dispatchEvent(new Event('change', { bubbles: true }));
                        filledCount++;
                    } else {
                        // Textarea already has content, count as 'processed' towards filled count
                        filledCount++;
                    }
                }
            });

            console.log(`[DEBUG] fillTextBoxes: filledCount = ${filledCount}, visibleCount = ${visibleCount}`);
            if (filledCount < visibleCount) {
                console.warn(`【NWAFU全自动评教脚本】可能部分可见文本框未能处理（已处理 ${filledCount} / ${visibleCount} 可见文本框）。`);
            } else {
                console.log(`【NWAFU全自动评教脚本】评语填写/检查完成，处理了 ${filledCount} 个可见文本框。`);
            }
            return true; // Return true even if some were pre-filled or not visible

        } catch (error) {
            console.error("【NWAFU全自动评教脚本】填写评语时发生内部错误:", error);
            displayMessage("填写评语时发生内部错误，请检查控制台。", 'error');
            return false; // Indicate failure
        }
    }

    async function clickSubmitButton_Form() {
        console.log("【NWAFU全自动评教脚本】步骤 3: 尝试查找并点击“提交”按钮...");
        try {
            // Wait for the submit button to be clickable and visible
            const submitButton = await waitForElement(SUBMIT_BUTTON_SELECTOR, 5000);

            console.log(`【NWAFU全自动评教脚本】找到可见的“提交”按钮，将在 ${SUBMIT_DELAY_MS} 毫秒后点击...`);
            displayMessage(`填写完成，${SUBMIT_DELAY_MS}ms后自动提交...`, 'info', SUBMIT_DELAY_MS + 500);

            await new Promise(resolve => setTimeout(resolve, SUBMIT_DELAY_MS)); // Wait before clicking

            // Re-check button just before clicking, in case state changed
            const currentSubmitButton = document.querySelector(SUBMIT_BUTTON_SELECTOR);
            if (currentSubmitButton && currentSubmitButton.offsetParent !== null) {
                currentSubmitButton.click();
                console.log("【NWAFU全自动评教脚本】“提交”按钮已点击。");
                return true; // Indicate submit was clicked
            } else {
                console.error("【NWAFU全自动评教脚本】错误：提交按钮在延迟后消失或被禁用。提交失败。");
                displayMessage("错误：提交按钮状态变化，无法点击！请手动提交。", 'error', 10000);
                return false; // Indicate failure
            }
        } catch (error) {
            console.error(`【NWAFU全自动评教脚本】查找或点击“提交”按钮时发生错误 (选择器: "${SUBMIT_BUTTON_SELECTOR}"):`, error);
            displayMessage(`错误：未能找到或点击“提交”按钮！请手动提交。\n${error.message}`, 'error', 10000);
            return false; // Indicate failure
        }
    }

    function clickConfirmationButton_Form() {
        console.log("【NWAFU全自动评教脚本】步骤 4: 等待并点击确认对话框...");
        let startTime = Date.now();
        clearTimeout(confirmWaitTimeout); // Clear previous timer if any

        function checkConfirmationButton() {
            if (Date.now() - startTime > MAX_CONFIRM_WAIT_TIME_MS) {
                console.error(`【NWAFU全自动评教脚本】错误：等待“确认”按钮加载超时 (${MAX_CONFIRM_WAIT_TIME_MS}ms)。`);
                displayMessage(`错误：等待“确认”按钮超时。请手动确认或刷新。`, 'error', 15000);
                isFillingForm = false; // Reset state on timeout
                return;
            }

            const confirmButton = document.querySelector(CONFIRM_BUTTON_SELECTOR);

            if (confirmButton && confirmButton.offsetParent !== null) { // Found and visible
                console.log(`【NWAFU全自动评教脚本】找到可见的“确认”按钮，将在 ${CONFIRM_DELAY_MS} 毫秒后点击...`);
                displayMessage(`找到确认按钮，${CONFIRM_DELAY_MS / 1000} 秒后点击...`, 'info', CONFIRM_DELAY_MS + 500);

                setTimeout(() => {
                    try {
                        // Re-check button just before clicking
                        const currentConfirmButton = document.querySelector(CONFIRM_BUTTON_SELECTOR);
                        if (currentConfirmButton && currentConfirmButton.offsetParent !== null) {
                            currentConfirmButton.click();
                            console.log("【NWAFU全自动评教脚本】“确认”按钮已点击。评教完成！");
                            displayMessage("评教确认完成！页面即将刷新或跳转...", 'success', 5000);
                        } else {
                            console.error("【NWAFU全自动评教脚本】错误：确认按钮在延迟后消失。确认失败。");
                            displayMessage("错误：确认按钮状态变化，无法点击！请手动处理。", 'error', 10000);
                        }
                    } catch (error) {
                        console.error("【NWAFU全自动评教脚本】点击“确认”按钮时发生错误:", error);
                        displayMessage(`点击“确认”按钮时发生错误，请手动处理。\n${error.message}`, 'error', 10000);
                    } finally {
                        // 无论成功失败，完成确认尝试后都重置状态
                        isFillingForm = false;
                        console.log("[DEBUG] isFillingForm set to false after confirmation attempt.");
                    }
                }, CONFIRM_DELAY_MS);

            } else {
                // Confirm button not found or not visible, wait and check again
                confirmWaitTimeout = setTimeout(checkConfirmationButton, CHECK_INTERVAL_MS * 2); // Check less frequently for confirm dialog
            }
        }

        checkConfirmationButton(); // Start checking
    }

    async function runAutoEvaluation() {
        if (isFillingForm) return; // 如果已在处理，则退出

        if (containsEvaluationForm()) {
            isFillingForm = true; // 设置处理中标志
            console.log("【NWAFU全自动评教脚本 - 填表】检测到评教表单，开始自动处理...");
            displayMessage("检测到评教表单，开始自动处理...", 'info', 3000);

            const step1Success = selectFirstRadioOption();
            const step2Success = fillTextBoxes();

            if (step1Success === false || step2Success === false) {
                console.error("【NWAFU全自动评教脚本 - 填表】填写步骤中遇到问题，自动提交已取消。");
                displayMessage("填写步骤遇到问题，自动提交已取消。请手动检查。", 'warning', 10000);
                isFillingForm = false; // 重置状态
                return;
            }

            if (AUTO_SUBMIT) {
                const submitted = await clickSubmitButton_Form();
                if (!submitted) {
                    isFillingForm = false; // 重置状态
                    return; // Stop processing
                }

                if (AUTO_CONFIRM) {
                    clickConfirmationButton_Form(); // 确认函数内部会重置 isFillingForm
                } else {
                    console.log("【NWAFU全自动评教脚本 - 填表】自动确认已禁用。请手动确认。");
                    displayMessage("填写完成，提交按钮已点击。请手动确认。", 'info', false); // Persistent message
                    isFillingForm = false; // 重置状态
                }
            } else {
                // Auto-submit disabled
                console.log("【NWAFU全自动评教脚本 - 填表】自动填写完成。自动提交已禁用。");
                displayMessage("自动填写完成。请检查并手动提交。", 'info', false); // Persistent message
                isFillingForm = false; // Reset state as manual action needed
            }
        }
        // else { console.log("【NWAFU全自动评教脚本 - 填表】未检测到可执行的评教表单。"); }
    }


    // --- 导航逻辑 (来自脚本2, 略作修改以配合延迟) ---
    function findAndClickNextEvaluation_Nav() {
        console.log(`【NWAFU全自动评教脚本 - 导航】查找 "${PENDING_TAG_TEXT}" 标签...`);
        try {
            const containers = document.querySelectorAll(EVALUATION_ITEM_CONTAINER_SELECTOR);
            if (containers.length === 0) {
                console.log(`【NWAFU全自动评教脚本 - 导航】未找到项目容器。`);
                return false; // No items found
            }
            // console.log(`【NWAFU全自动评教脚本 - 导航】找到 ${containers.length} 个项目容器。`); // Less verbose

            for (const container of containers) {
                const pendingTag = container.querySelector(PENDING_TAG_SELECTOR);
                if (pendingTag && pendingTag.textContent?.trim() === PENDING_TAG_TEXT) {
                    if (pendingTag.offsetParent !== null) { // Check visibility
                        console.log(`【NWAFU全自动评教脚本 - 导航】>> 找到可见的 "${PENDING_TAG_TEXT}" 标签，准备点击...`);
                        displayMessage(`找到 "${PENDING_TAG_TEXT}" 项目，正在进入...`, 'info', 2000);
                        try {
                            const clickableElement = pendingTag.closest('a') || pendingTag; // Try to find a parent link or click the tag itself
                            clickableElement.click();
                            // *** 关键：记录点击时间 ***
                            lastNavigationClickTime = Date.now();
                            console.log(`【NWAFU全自动评教脚本 - 导航】已点击 "${PENDING_TAG_TEXT}"，导航冷却开始 (${NAVIGATION_COOLDOWN_MS}ms)。`);
                            return true; // Click attempted, stop searching
                        } catch (clickError) {
                            console.error(`【NWAFU全自动评教脚本 - 导航】点击 "${PENDING_TAG_TEXT}" 出错:`, clickError);
                            displayMessage(`错误：点击 "${PENDING_TAG_TEXT}" 失败。`, 'error', false);
                            return false; // Indicate failure
                        }
                    }
                }
            }

            // console.log(`【NWAFU全自动评教脚本 - 导航】未找到可见的 "${PENDING_TAG_TEXT}" 标签。`);
            return false; // None found

        } catch (error) {
            console.error("【NWAFU全自动评教脚本 - 导航】查找评教项目时出错:", error);
            displayMessage("查找评教项目出错。", 'error');
            return false;
        }
    }

    async function runNavigationLogic() {
        // *** 关键：检查冷却时间 ***
        const now = Date.now();
        if (now - lastNavigationClickTime < NAVIGATION_COOLDOWN_MS) {
            console.log(`【NWAFU全自动评教脚本 - 导航】导航功能冷却中，剩余 ${Math.round((NAVIGATION_COOLDOWN_MS - (now - lastNavigationClickTime)) / 1000)} 秒...`);
            return; // 冷却中，不执行
        }

        // 粗略判断是否在列表页区域
        if (!document.querySelector(LIST_PAGE_MARKER)) {
            // console.log("【NWAFU全自动评教脚本 - 导航】未检测到列表页标记，跳过导航逻辑。");
            return;
        }

        console.log("【NWAFU全自动评教脚本 - 导航】开始处理列表页导航...");

        if (findAndClickNextEvaluation_Nav()) {
            return; // 找到并点击了，等待跳转，导航逻辑暂停
        }

        // 如果没找到，尝试切换 Tab
        console.log(`【NWAFU全自动评教脚本 - 导航】当前Tab无 "${PENDING_TAG_TEXT}"，检查并切换Tab...`);
        try {
            const resultTab = document.querySelector(RESULT_TAB_SELECTOR);
            const processTab = document.querySelector(PROCESS_TAB_SELECTOR);
            if (resultTab && processTab) {
                if (resultTab.classList.contains(ACTIVE_TAB_CLASS)) {
                    console.log(`【NWAFU全自动评教脚本 - 导航】切换到过程性...`);
                    processTab.click();
                    lastNavigationClickTime = Date.now(); // 切换Tab也视为一次导航动作，启动冷却
                    console.log(`【NWAFU全自动评教脚本 - 导航】已点击切换Tab，导航冷却开始 (${NAVIGATION_COOLDOWN_MS}ms)。`);
                } else if (processTab.classList.contains(ACTIVE_TAB_CLASS)) {
                    console.log(`【NWAFU全自动评教脚本 - 导航】过程性列表也无未提交。`);
                    displayMessage("所有Tab似乎都已检查完毕。", 'success', 10000);
                    // 可选：增加更长的冷却时间，避免频繁检查已完成的列表
                    // lastNavigationClickTime = Date.now() + 60000; // 冷却1分钟
                }
            } else {
                console.warn("【NWAFU全自动评教脚本 - 导航】无法找到Tab元素。");
            }
        } catch (error) {
            console.error("【NWAFU全自动评教脚本 - 导航】处理Tab时出错:", error);
        }
    }


    // --- 主执行逻辑 (简化版，同时尝试两种逻辑) ---
    function runCombinedLogic() {
        console.log("--- 【NWAFU全自动评教脚本 V3.7】开始执行检查 ---");

        // 清理旧消息
        const oldMessageBox = document.getElementById('nwafu-evaluation-script-message-merged');
        if (oldMessageBox) { clearTimeout(oldMessageBox.hideTimeout); oldMessageBox.remove(); }

        // 1. 尝试执行自动填表逻辑 (它内部有 isFillingForm 状态控制)
        runAutoEvaluation();

        // 2. 尝试执行导航逻辑 (它内部有冷却时间控制)
        runNavigationLogic();

        console.log("--- 【NWAFU全自动评教脚本 V3.7】检查执行完毕 ---");
    }

    // --- MutationObserver 设置 ---
    const observerCallback = function(mutationsList, observer) {
        let relevantChange = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                relevantChange = true;
                break;
            }
        }
        if (!relevantChange) return;

        clearTimeout(observerDebounceTimer);
        observerDebounceTimer = setTimeout(() => {
            console.log("【NWAFU全自动评教脚本 V3.7】MutationObserver 检测到变化，准备执行...");
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                runCombinedLogic(); // 直接运行合并逻辑
            } else {
                console.log("[DEBUG] Observer fired but document not ready, delaying execution slightly.");
                setTimeout(runCombinedLogic, 150);
            }
        }, OBSERVER_DEBOUNCE_MS);
    };

    // --- 启动脚本和观察者 ---
    let initialized = false;
    function initialize() {
        if (initialized) return;
        initialized = true;
        console.log("【NWAFU全自动评教脚本 V3.7】初始化...");
        displayMessage("全自动评教脚本 (模拟并发+延迟) V3.7 已启动", 'success', 4000);

        // 初始运行
        setTimeout(runCombinedLogic, 500);

        // 设置观察者
        const targetNode = document.querySelector(MAIN_CONTENT_AREA_SELECTOR) || document.body;
        if (targetNode) {
            const config = { childList: true, subtree: true };
            const observer = new MutationObserver(observerCallback);
            try {
                observer.observe(targetNode, config);
                console.log(`【NWAFU全自动评教脚本 V3.7】MutationObserver 已启动，监听目标:`, targetNode);
            } catch (e) {
                console.error("【NWAFU全自动评教脚本】启动 MutationObserver 失败:", e);
                displayMessage("错误：无法启动页面变化监听器！", "error", false);
            }
        } else {
            console.error("【NWAFU全自动评教脚本】错误：无法找到用于 MutationObserver 的目标节点！");
            displayMessage("错误：无法找到监听目标！", "error", false);
        }
    }

    // --- 脚本启动入口 ---
    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        setTimeout(initialize, 300);
    } else {
        document.addEventListener("DOMContentLoaded", () => setTimeout(initialize, 300));
        window.addEventListener("load", () => setTimeout(initialize, 300)); // Add load listener as fallback
    }

})();