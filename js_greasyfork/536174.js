// ==UserScript==
// @name         弹幕结尾自动添加desuwa
// @namespace    https://space.bilibili.com/28106105?spm_id_from=333.1007.0.0
// @version      2.3
// @description  要开开发者模式!代码爆改b站@少女乐队抹茶大芭菲，原作者@阿琴-kotori
// @author       ysl&akoto
// @match        *://www.douyu.com/*
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_cookie
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536174/%E5%BC%B9%E5%B9%95%E7%BB%93%E5%B0%BE%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0desuwa.user.js
// @updateURL https://update.greasyfork.org/scripts/536174/%E5%BC%B9%E5%B9%95%E7%BB%93%E5%B0%BE%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0desuwa.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // --- 配置读取 ---
const SUFFIX_CONFIG_KEY = 'desuwa_suffix_text'; // 油猴存储后缀的键名
const ENABLED_CONFIG_KEY = 'desuwa_script_enabled'; // 油猴存储启用状态的键名
let currentSuffix = GM_getValue(SUFFIX_CONFIG_KEY, 'desuwa'); // 当前后缀，默认 'desuwa'
let isScriptEnabled = GM_getValue(ENABLED_CONFIG_KEY, true); // 脚本是否启用，默认 true

// --- 常量定义 ---
const MAX_LENGTH = 66; // 弹幕最大长度
const INPUT_SELECTORS = '.inputView-1f53d9, .inputView-2a65aa'; // 标准模式和全屏模式的输入框选择器
const SEND_BUTTON_SELECTORS = '.sendDanmu-741305, .sendDanmu-592760'; // 发送按钮选择器

// --- 状态变量 ---
let lastProcessedValue = null; // 上一次脚本处理后的输入框最终值，用于避免不必要的DOM操作和事件递归
let isIMETyping = false; // 标记用户是否正在使用输入法进行组词

// --- 菜单配置 ---
function registerMenuCommands() {
    GM_registerMenuCommand(`${isScriptEnabled ? '禁用' : '启用'}脚本`, () => {
        isScriptEnabled = !isScriptEnabled;
        GM_setValue(ENABLED_CONFIG_KEY, isScriptEnabled);
        alert(`脚本已${isScriptEnabled ? '启用' : '禁用'}。\n刷新页面后生效。`);
        location.reload();
    });
    GM_registerMenuCommand(`设置后缀 (当前: ${currentSuffix})`, () => {
        const newSuffix = prompt('请输入新的弹幕后缀文本：', currentSuffix);
        if (newSuffix !== null && newSuffix.trim() !== "") {
            currentSuffix = newSuffix.trim();
            GM_setValue(SUFFIX_CONFIG_KEY, currentSuffix);
            alert('后缀已更新为: ' + currentSuffix);
        } else if (newSuffix !== null) {
            alert('后缀不能为空。');
        }
    });
}
registerMenuCommands();

if (!isScriptEnabled) {
    console.log('弹幕后缀脚本：脚本已禁用。');
    return;
}

/**
 * 核心函数：尝试规范化输入框内容，确保其以指定后缀结尾。
 * @param {HTMLInputElement|HTMLTextAreaElement} inputElement 目标输入框元素
 * @param {string} reason 调用此函数的原因 (用于调试或特定逻辑)
 */
function ensureSuffix(inputElement, reason = "unknown") {
    if (!inputElement || typeof inputElement.value === 'undefined') return;

    // 如果用户正在输入法组词，并且是由 'input' 事件触发的，则暂时不处理，等待组词结束
    if (isIMETyping && reason.startsWith("input")) {
        return;
    }

    const currentValue = inputElement.value;

    // 如果当前值与上次处理完的值相同 (通常意味着是脚本自身操作或无变化)，则跳过
    if (reason.startsWith("input") && currentValue === lastProcessedValue) {
        return;
    }

    let baseText = currentValue; // 基础文本，即用户实际输入的部分
    let originalEndsWithSuffix = false; // 原始输入是否已经带有后缀

    // 检查当前值是否以设定的后缀结尾
    if (currentValue.endsWith(currentSuffix)) {
        baseText = currentValue.substring(0, currentValue.length - currentSuffix.length);
        originalEndsWithSuffix = true;
    }

    // 如果剥离后缀后，基础文本为空（用户可能删光了内容或只输入了后缀）
    if (baseText.trim().length === 0) {
        // 只有当原始值就是后缀，或者原始值本身就为空时，才清空输入框
        if (originalEndsWithSuffix || currentValue.trim().length === 0) {
            if (inputElement.value !== "") { // 仅在需要时修改 DOM
                inputElement.value = "";
            }
            lastProcessedValue = ""; // 记录处理后的状态
        } else {
            // 用户可能只输入了空格等，不是我们的后缀，保留，并记录为已处理
            lastProcessedValue = currentValue;
        }
        return;
    }

    // 计算添加后缀后的理想文本，并处理长度限制
    const availableLengthForBase = MAX_LENGTH - currentSuffix.length;
    if (availableLengthForBase < 0) {
        console.error('弹幕后缀脚本：错误，后缀本身已超出最大长度限制！');
        lastProcessedValue = currentValue; // 无法处理，记录原始值
        return;
    }
    const idealFinalText = baseText.slice(0, availableLengthForBase) + currentSuffix;

    // 只有当计算出的理想文本与当前输入框的值不同时，才更新DOM，以减少操作和光标跳动
    if (currentValue !== idealFinalText) {
        let selectionStart = -1, selectionEnd = -1;
        try { // 保存当前光标位置
            selectionStart = inputElement.selectionStart;
            selectionEnd = inputElement.selectionEnd;
        } catch(e) {/* 某些情况下获取会失败，忽略 */}

        inputElement.value = idealFinalText; // 更新输入框的值

        try { // 尝试恢复或调整光标位置
            if (selectionStart !== -1) { // 仅当成功获取光标位置时
                if (originalEndsWithSuffix && selectionStart <= baseText.length) {
                    // 如果原先有后缀，且光标在基础文本内，则尝试保持原位
                    inputElement.setSelectionRange(selectionStart, selectionEnd);
                } else {
                    // 其他情况（如新输入或光标在后缀后），将光标置于新添加的后缀之前
                    const cursorPos = idealFinalText.length - currentSuffix.length;
                    inputElement.setSelectionRange(cursorPos, cursorPos);
                }
            }
        } catch (e) { /* 设置光标失败，忽略 */ }
    }
    lastProcessedValue = inputElement.value; // 记录本次处理后的最终值
}

// --- 事件监听器 ---

// 输入法开始组词
document.addEventListener('compositionstart', function(e) {
    if (!isScriptEnabled) return;
    const target = e.target;
    if (target && target.matches(INPUT_SELECTORS)) {
        isIMETyping = true;
    }
}, true);

// 输入法结束组词
document.addEventListener('compositionend', function(e) {
    if (!isScriptEnabled) return;
    const target = e.target;
    if (target && target.matches(INPUT_SELECTORS)) {
        isIMETyping = false;
        // 组词结束后，立即处理一次输入框内容，确保后缀正确
        setTimeout(() => { // 使用setTimeout确保DOM值已更新为选中的汉字
            if (document.activeElement === target) {
                lastProcessedValue = null; // 强制重新评估和处理
                ensureSuffix(target, "compositionend_event");
            }
        }, 0);
    }
}, true);

// 实时输入监听
document.addEventListener('input', function(e) {
    if (!isScriptEnabled) return;
    const target = e.target;
    // 检查事件对象是否表明输入法正在组词 (e.isComposing 是 InputEvent 的属性)
    const eventIndicatesComposing = (e instanceof InputEvent && e.isComposing);

    if (target && target.matches(INPUT_SELECTORS)) {
        // 如果事件表明正在组词，或我们的全局标志位为true，则跳过
        if (eventIndicatesComposing || isIMETyping) {
            return;
        }
        ensureSuffix(target, "input_event");
    }
}, true);

// 输入框获得焦点时 (处理粘贴或浏览器填充等情况)
document.addEventListener('focusin', function(e) {
    if (!isScriptEnabled) return;
    const target = e.target;
    if (target && target.matches(INPUT_SELECTORS)) {
        isIMETyping = false; // 焦点切换，认为组词已结束
        setTimeout(() => {
             if (document.activeElement === target) {
                lastProcessedValue = null; // 强制重新评估
                ensureSuffix(target, "focusin_event");
             }
        }, 50); // 稍作延迟，确保值已稳定
    }
}, true);

// 点击发送按钮前 (用mousedown尝试更早介入)
document.addEventListener('mousedown', function(e) {
    if (!isScriptEnabled) return;
    const sendButton = e.target.closest(SEND_BUTTON_SELECTORS);
    if (sendButton) {
        const inputElement = document.querySelector(INPUT_SELECTORS); // 通常只有一个相关输入框
        if (inputElement) {
             isIMETyping = false; // 点击按钮，认为组词已结束
             lastProcessedValue = null; // 强制重新评估
             ensureSuffix(inputElement, "mousedown_on_send_button");
        }
    }
}, true);

// 按下回车键时
document.addEventListener('keydown', function(e) {
    if (!isScriptEnabled) return;
    // 确保不是在输入法组词过程中按回车 (e.isComposing 是 KeyboardEvent 的属性)
    if (e.key !== 'Enter' || (e instanceof KeyboardEvent && e.isComposing)) {
        return;
    }
    const activeElement = document.activeElement;
    if (activeElement && activeElement.matches(INPUT_SELECTORS)) {
        isIMETyping = false; // 按回车（非组词），认为组词已结束
        lastProcessedValue = null; // 强制重新评估
        ensureSuffix(activeElement, "enter_keydown");
        // 注意：此处不阻止默认行为 (e.preventDefault())，让斗鱼自行处理回车发送
    }
}, true);
    // 监听发送按钮点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.ChatSend-button')) {
            processMessage();
        }
    });

    // 监听回车键发送
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && document.activeElement.classList.contains('ChatSend-txt')) {
            processMessage();
        }
    });

    function processMessage() {
        const textarea = document.querySelector('.ChatSend-txt');
        if (!textarea) return;

        // 添加后缀并处理长度限制
        const maxLength = 66;
        const suffix = currentSuffix;
        const baseText = textarea.value.replace(/desuwa$/, ''); // 避免重复添加

        // 计算可用长度
        const availableLength = maxLength - suffix.length;
        const finalText = baseText.slice(0, availableLength) + suffix;

        // 更新输入框内容
        textarea.value = finalText;

        // 触发输入事件（部分网站需要）
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }

console.log('弹幕后缀脚本：已加载并设置监听器。脚本当前状态:', isScriptEnabled ? '启用' : '禁用', ', 后缀:', currentSuffix);
})();