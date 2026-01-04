// ==UserScript==
// @name         自动选择提效方式为AIGC-LightCode
// @namespace    https://dev.hundsun.com/frameV2/pms/workbench?task_id=*
// @version      0.2
// @description  在恒生效能平台(dev.hundsun.com/frameV2/pms/)页面自动将'提效方式'选择为'AIGC-LightCode'
// @author       xiaohu
// @match        https://dev.hundsun.com/frameV2/pms/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533574/%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%8F%90%E6%95%88%E6%96%B9%E5%BC%8F%E4%B8%BAAIGC-LightCode.user.js
// @updateURL https://update.greasyfork.org/scripts/533574/%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%8F%90%E6%95%88%E6%96%B9%E5%BC%8F%E4%B8%BAAIGC-LightCode.meta.js
// ==/UserScript==   

(function() {
    'use strict';

    // --- 配置项 ---
    const TARGET_PLACEHOLDER = '请选择提效方式'; // 定位输入框的 placeholder
    const TARGET_OPTION_TEXT = 'AIGC-LightCode'; // 要选择的选项文本
    const DROPDOWN_WAIT_MS = 400; // 点击触发器后等待下拉菜单弹出的毫秒数 (关键!)
    const CHECK_INTERVAL_MS = 500; // 每隔多少毫秒检查一次元素是否存在
    const MAX_ATTEMPTS = 2; // 最多尝试多少次

    let attempts = 0;
    let intervalTimer = null;
    let alreadyProcessed = false; // 标记是否已在本视图处理过

    /**
     * 主要功能函数：查找并选择指定的选项
     */
    function selectEfficiencyOption(triggerInput) {
        console.log('[油猴脚本] 找到触发器，且值为空，尝试选择提效方式...');

        // 模拟点击输入框以展开下拉菜单
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        triggerInput.dispatchEvent(clickEvent);
        console.log('[油猴脚本] 已模拟点击触发器，等待下拉菜单...');

        // 使用 setTimeout 等待下拉菜单渲染
        setTimeout(() => {
            console.log(`[油猴脚本] 等待 ${DROPDOWN_WAIT_MS}ms 后，开始查找选项...`);
            let targetOptionElement = null;
            // 查找所有可见的 el-select 下拉菜单中的 li 元素
            const dropdowns = document.querySelectorAll('.el-select-dropdown.el-popper:not([style*="display: none"])');

            console.log(`[油猴脚本] 找到 ${dropdowns.length} 个可见的下拉菜单。`);

            dropdowns.forEach((dropdown, index) => {
                 const options = dropdown.querySelectorAll('.el-scrollbar__view li');
                 console.log(`[油猴脚本] 检查第 ${index + 1} 个下拉菜单中的 ${options.length} 个选项...`);
                 options.forEach(option => {
                    const optionText = option.querySelector('span')?.textContent.trim();
                    if (optionText === TARGET_OPTION_TEXT) {
                        if (!targetOptionElement) {
                            targetOptionElement = option;
                        }
                    }
                 });
            });

            if (targetOptionElement) {
                console.log('[油猴脚本] 找到目标选项元素:', targetOptionElement);
                // 模拟点击该选项 (使用 mousedown 可能更稳定)
                const mousedownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
                targetOptionElement.dispatchEvent(mousedownEvent);
                targetOptionElement.click(); // click 作为备选
                console.log(`[油猴脚本] 已模拟点击 "${TARGET_OPTION_TEXT}" 选项。`);
                alreadyProcessed = true; // 标记已成功处理
            } else {
                console.error(`[油猴脚本错误] 未在可见的下拉菜单中找到文本为 "${TARGET_OPTION_TEXT}" 的选项。请确保下拉菜单已正确展开，或尝试增加 DROPDOWN_WAIT_MS 的值。`);
                // 自动执行失败时，不弹出 alert，避免干扰用户
                alreadyProcessed = true; // 标记为已处理（尝试过但失败），避免在同一视图重复尝试
            }

        }, DROPDOWN_WAIT_MS);
    }

    /**
     * 检查目标元素是否存在并根据条件执行操作
     */
    function checkAndRun() {
        // 如果已处理过，或者计时器已被清除（说明已找到或已超时），则不再执行
        if (alreadyProcessed || !intervalTimer) {
            if (intervalTimer) {
                console.log('[油猴脚本] 已处理过或计时器已停止，跳过本次检查。');
                clearInterval(intervalTimer);
                intervalTimer = null;
            }
            return;
        }

        attempts++;
        console.log(`[油猴脚本] 检查元素尝试次数: ${attempts}/${MAX_ATTEMPTS}`);

        const triggerInputs = document.querySelectorAll(`input[placeholder="${TARGET_PLACEHOLDER}"]`);

        if (triggerInputs.length > 0){
             triggerInputs.forEach((element, index) => {
                 //console.log(`  元素 ${index + 1}:`, element);
                 console.log('[油猴脚本] 找到目标输入框。');
                 clearInterval(intervalTimer); // 找到元素后停止计时器
                 intervalTimer = null;
                 console.log('[油猴脚本] 清除检查计时器。');


                 // --- 核心判断：仅在当前值为空或为占位符时才执行 ---
                 if (element.value === '' || element.value === TARGET_PLACEHOLDER) {
                     console.log('[油猴脚本] 检测到"提效方式"当前为空或为占位符，尝试执行选择操作...');
                     selectEfficiencyOption(element);
                 } else {
                     console.log(`[油猴脚本] 检测到"提效方式"已有值 (${element.value})，跳过自动选择。`);
                     alreadyProcessed = true; // 标记为已处理（因为不需要处理）
                 }
                 // --- 判断结束 ---

             });
        }
        if (attempts >= MAX_ATTEMPTS) {
            console.log(`[油猴脚本] 达到最大尝试次数 (${MAX_ATTEMPTS})，仍未找到目标元素，停止检查。`);
            clearInterval(intervalTimer);
            intervalTimer = null;
        }
    }

    /**
     * 重置状态并开始检查 (用于 SPA 导航或需要重新检查时)
     */
    function resetAndStartCheck() {
        console.log('[油猴脚本] 重置状态并开始检查...');
        alreadyProcessed = false; // 重置处理标记
        attempts = 0; // 重置尝试次数
        if (intervalTimer) { // 清除可能存在的旧计时器
            clearInterval(intervalTimer);
        }
        // 稍微延迟启动，给页面一些时间渲染
        setTimeout(() => {
             intervalTimer = setInterval(checkAndRun, CHECK_INTERVAL_MS);
        }, 500); // 延迟 0.5 秒开始检查
    }

    // --- 脚本入口 ---
    console.log('[油猴脚本] "自动选择提效方式" 脚本启动 (版本 0.4)。');
    // 页面加载完成后稍等片刻开始检查
    setTimeout(resetAndStartCheck, 1500); // 初始延迟 1.5 秒

    // --- SPA 路由变化处理 (简化) ---
    // 监听 URL 变化，如果变化了，重置处理标记并重新开始检查
    let lastHrefForCheck = document.location.href;
    const spaObserver = new MutationObserver(mutations => {
        // 稍微延迟检查 URL 变化，避免过于频繁的重置
        setTimeout(() => {
            if (lastHrefForCheck !== document.location.href) {
                console.log('[油猴脚本] 检测到 URL 变化。');
                lastHrefForCheck = document.location.href;
                resetAndStartCheck(); // 重置并重新开始检查
            }
        }, 500); // 延迟 0.5 秒检查 URL 变化
    });

    // 观察 body 的子节点变化和整个子树的变化，以捕捉 SPA 路由切换
    spaObserver.observe(document.body, { childList: true, subtree: true });

})();
