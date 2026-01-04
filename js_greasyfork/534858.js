// ==UserScript==
// @name        腾讯元宝智能填参助手
// @namespace   Violentmonkey Scripts
// @match       https://yuanbao.tencent.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=yuanbao.tencent.com
// @grant       none
// @version     2025-5-4
// @author      CathyElla
// @license     MIT
// @description 从URL中提取q查询参数，填入对话框，提交搜索，yuanbao.tencent.com?q={query}
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/534858/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E6%99%BA%E8%83%BD%E5%A1%AB%E5%8F%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534858/%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E6%99%BA%E8%83%BD%E5%A1%AB%E5%8F%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async () => {
    'use strict';


   const params = new URLSearchParams(window.location.search);
   const query = params.has('q') ? decodeURIComponent(params.get('q')) : null;
   // console.log("查询参数："+query)
   if (!query?.trim()) return;



    // 增强版元素等待器
    function waitForElement(selector, timeout = 8000) {
        return new Promise((resolve, reject) => {
            let retry = 0;
            const check = () => {
                const elem = document.querySelector(selector);
                if (elem) {
                    console.log(`[加载跟踪] 元素${selector}在第${Date.now()-start}ms加载完成`);
                    resolve(elem);
                } else if (Date.now() - start > timeout) {
                    reject(`元素加载超时: ${selector}`);
                } else {
                    setTimeout(check, 500);
                }
            };
            const start = Date.now();
            check();
        });
    }

    try {
        // 等待富文本编辑器
        const inputBox = await waitForElement('.ql-editor[contenteditable="true"]');

        // 模拟真实输入
        inputBox.focus();
        await new Promise(r => setTimeout(r, 300));
        inputBox.innerHTML = `<p>${query}</p>`; // 富文本特殊处理

        // 触发React状态更新
        inputBox.dispatchEvent(new InputEvent('input', {
            bubbles: true,
            composed: true
        }));

        // 提交优化（增加延迟确保渲染完成）
        setTimeout(() => {
            inputBox.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                bubbles: true
            }));
        }, 1200);

    } catch (error) {
        console.error('[最终错误处理]', error);
    }
})();