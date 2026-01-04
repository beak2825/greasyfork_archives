// ==UserScript==
// @name         deepseek内容抓取
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  顶部紧凑型activeId提取工具，支持自动跳转签到页面
// @author       YourName
// @match        https://v1.chaoxing.com/manage?ws=*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/532631/deepseek%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532631/deepseek%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 紧凑型顶部样式[5,8](@ref)
    GM_addStyle(`
        #cx-top-bar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99999;
            width: 100%;
            height: 50px;
            background: rgba(255,255,255,0.95);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            padding: 5px 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        /* 其他样式保持不变 */
    `);

    // 创建顶部栏
    const topBar = document.createElement('div');
    topBar.id = 'cx-top-bar';
    topBar.innerHTML = `
        <input type="text" id="cx-inputUrl" placeholder="粘贴含activeId的链接">
        <button id="cx-extractBtn">提取</button>
    `;
    document.body.prepend(topBar);

    // 事件绑定（新增跳转逻辑）[1,5](@ref)
    document.getElementById('cx-extractBtn').addEventListener('click', function() {
        const inputUrl = document.getElementById('cx-inputUrl').value;
        const result = extractActiveId(inputUrl);

        if (result.success) {
            // 构造签到页面URL并跳转（支持新标签页打开）[3,7](@ref)
            const targetUrl = `https://mobilelearn.chaoxing.com/widget/sign/refreshEwn?activeId=${result.value}`;
            window.location.href = targetUrl; // 当前页跳转
            // 如需新标签页打开请使用：GM_openInTab(targetUrl, {active: true});
        } else {
            showResultTip(result);
        }
    });

    // activeId提取函数[6](@ref)
    function extractActiveId(url) {
        try {
            const activeId = new URL(url).searchParams.get('activeId');
            return activeId ? { success: true, value: activeId } : { error: "未找到activeId参数" };
        } catch {
            return { error: "无效的URL格式" };
        }
    }

    // 提示显示函数（优化版）[8](@ref)
    function showResultTip(result) {
        const tip = document.createElement('div');
        tip.className = 'cx-result-tip';
        tip.style.color = result.success ? 'green' : 'red';
        tip.textContent = result.success ? `即将跳转至签到页面...` : result.error;
        document.getElementById('cx-top-bar').appendChild(tip);
        setTimeout(() => tip.remove(), 3000);
    }
})();