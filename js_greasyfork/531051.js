// ==UserScript==
// @name         阻止 "阅读全文/readmore"
// @name:en      Block readmore.js Request
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过 GM_webRequest 阻止加载任何路径包含 readmore.js 的脚本文件。
// @description:en Blocks requests to any script file whose path contains readmore.js using GM_webRequest.
// @author       AI Assistant & Your Name
// @match        *://*/*
// @grant        GM_webRequest
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531051/%E9%98%BB%E6%AD%A2%20%22%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87readmore%22.user.js
// @updateURL https://update.greasyfork.org/scripts/531051/%E9%98%BB%E6%AD%A2%20%22%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87readmore%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    // 你可以在这里修改要阻止的脚本文件名或路径中的关键字
    const blockKeyword = 'readmore.js';
    // 是否在控制台输出阻止日志
    const enableLogging = true;
    // --- 配置结束 ---

    // 检查 GM_webRequest 是否可用
    if (typeof GM_webRequest === 'undefined') {
        if (enableLogging) {
            console.error(`[阻止 ${blockKeyword}] 错误: GM_webRequest API 不可用。请确保您的用户脚本管理器（如 Tampermonkey）支持此功能，并且脚本已获得相应授权。`);
        }
        // 可以取消注释下一行以弹窗提示用户，但这可能会比较烦人
        // alert(`【${blockKeyword} 阻止脚本】需要 GM_webRequest API，您的环境可能不支持或未授权。`);
        return;
    }

    if (enableLogging) {
        console.log(`[阻止 ${blockKeyword}] 脚本已启动，尝试添加规则以阻止包含 "${blockKeyword}" 的请求。`);
    }

    // 定义 web 请求规则
    const rules = [
        {
            // 选择器：匹配所有 URL 路径中包含 blockKeyword 的请求
            // 语法 '*://*/*<keyword>*' 匹配任何协议、任何域名下，路径中包含 <keyword> 的 URL
            selector: `*://*/*${blockKeyword}*`,
            // 操作：取消（阻止）匹配到的请求
            action: { cancel: true }
        }
    ];

    // 应用规则
    try {
        // GM_webRequest 的注册函数本身可能返回一个包含 ruleId 的对象，或通过回调传递信息
        // Tampermonkey 文档建议使用回调方式处理结果
        GM_webRequest(rules, (info, message, details) => {
            // 这个回调主要用于确认规则添加/移除状态或报告错误
            // 它通常不会在每次请求被阻止时触发 (因为 action: { cancel: true } 直接处理了)
            if (message === 'ruleAdded') {
                if (enableLogging) {
                    console.log(`[阻止 ${blockKeyword}] 规则添加成功: ${JSON.stringify(details.rule)} (ID: ${details.ruleId})`);
                }
            } else if (message === 'ruleRemoved') {
                if (enableLogging) {
                    console.log(`[阻止 ${blockKeyword}] 规则已移除: ${JSON.stringify(details.rule)} (ID: ${details.ruleId})`);
                }
            } else if (message === 'error') {
                 console.error(`[阻止 ${blockKeyword}] 应用规则时出错: ${details.error} - 规则: ${JSON.stringify(details.rule)}`);
                 // alert(`应用请求阻止规则时出错: ${details.error}`);
            }
            // 注意：info, message, details 的具体内容和触发时机可能因用户脚本管理器和规则类型而异。
            // 对于 {cancel: true} 规则，主要关注 'ruleAdded' 和 'error' 消息。
        });

    } catch (e) {
        console.error(`[阻止 ${blockKeyword}] 设置 GM_webRequest 时发生意外错误:`, e);
        alert(`【${blockKeyword} 阻止脚本】设置请求阻止规则时发生错误，请检查浏览器控制台获取详细信息。`);
    }

})();
