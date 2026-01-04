// ==UserScript==
// @name        复制Rongseven月份
// @namespace   Violentmonkey Scripts
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @version     1.1
// @description  复制rongseven@月份到剪切板
// @author      -15d23
// @description 2025/2/1 12:18:49
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/525494/%E5%A4%8D%E5%88%B6Rongseven%E6%9C%88%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/525494/%E5%A4%8D%E5%88%B6Rongseven%E6%9C%88%E4%BB%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 调试开关
    const DEBUG = true;

    // 获取当前月份
    const currentMonth = new Date().getMonth() + 1;

    // 调试日志函数
    function log(...args) {
        if (DEBUG) {
            console.log('[Rongseven脚本]', ...args);
        }
    }

    // 定义复制并粘贴到表单的操作
    function copyAndPaste() {
        const textToCopy = `rongseven@${currentMonth}`;

        // 直接查找页面上的所有表单输入框
        const allInputs = document.querySelectorAll('input[type="text"], input:not([type]), textarea');
        
        log('找到所有输入框数量:', allInputs.length);
        allInputs.forEach((input, index) => {
            log(`输入框 ${index + 1}:`, {
                type: input.type,
                id: input.id,
                name: input.name,
                class: input.className,
                placeholder: input.placeholder,
                value: input.value
            });
        });

        // 查找包含"优惠"的输入框
        const couponInputs = Array.from(allInputs).filter(input => {
            const hasKeyword = (
                input.placeholder?.includes('优惠') ||
                input.name?.includes('优惠') ||
                input.id?.includes('优惠') ||
                input.className?.includes('优惠')
            );
            if (hasKeyword) {
                log('找到优惠相关输入框:', input);
            }
            return hasKeyword;
        });
        
        if (couponInputs.length > 0) {
            // 优先使用包含"优惠"的输入框
            log('使用优惠相关输入框');
            couponInputs[0].value = textToCopy;
            couponInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
            GM_notification({
                text: `已自动填入优惠码输入框：${textToCopy}`,
                title: '填入成功',
                timeout: 2000
            });
            return;
        }
        
        if (allInputs.length === 0) {
            log('未找到任何输入框');
            GM_setClipboard(textToCopy);
            GM_notification({
                text: `已复制：${textToCopy}，但未找到可输入的表单`,
                title: '复制成功',
                timeout: 2000
            });
        } else if (allInputs.length === 1) {
            log('找到单个输入框，直接填入');
            allInputs[0].value = textToCopy;
            allInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
            GM_notification({
                text: `已自动填入：${textToCopy}`,
                title: '填入成功',
                timeout: 2000
            });
        } else {
            const activeElement = document.activeElement;
            log('当前焦点元素:', activeElement);
            
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                log('使用当前焦点输入框');
                activeElement.value = textToCopy;
                activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                GM_notification({
                    text: `已填入当前位置：${textToCopy}`,
                    title: '填入成功',
                    timeout: 2000
                });
            } else {
                log('无焦点输入框，复制到剪贴板');
                GM_setClipboard(textToCopy);
                GM_notification({
                    text: `已复制：${textToCopy}，请手动粘贴到需要的位置`,
                    title: '复制成功',
                    timeout: 2000
                });
            }
        }
    }

    // 注册菜单项
    GM_registerMenuCommand(`填入 rongseven@${currentMonth}`, copyAndPaste);

})();