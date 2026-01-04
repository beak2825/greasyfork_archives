// ==UserScript==
// @name         51CTO题目助手
// @namespace    http://tampermonkey.net/
// @homepage	 https://github.com/minivv/tampermonkey
// @version      0.1
// @description  支持复制题目到剪贴板（可选是否带提示词），支持设置提示词
// @author       minivv
// @match        https://rk.51cto.com/t/n/exam/answer/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://linux.do/uploads/default/optimized/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994_2_32x32.png
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/537501/51CTO%E9%A2%98%E7%9B%AE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537501/51CTO%E9%A2%98%E7%9B%AE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 默认配置 ---
    const DEFAULT_PROMPT = "请作为一名资深的IT技术专家和讲师，详细分析以下选择题。请按以下结构进行解答：\n1.  题目分析：解释题目考查的核心知识点。\n2.  正确选项解析：详细说明正确选项为什么正确，并提供相关的背景知识和例子。\n3.  错误选项分析：逐个分析其他选项为什么错误。\n4.  知识点总结：总结与该题目相关的关键概念和学习要点。\n5.  扩展思考：如果适用，可以提出一些相关的扩展问题或实际应用场景。\n请确保解释清晰、准确、易于理解。题目内容如下：";
    const DEFAULT_COPY_WITH_PROMPT = true;

    // --- 全局变量 ---
    let userPrompt = '';
    let copyWithPrompt = DEFAULT_COPY_WITH_PROMPT;

    // --- 加载设置 ---
    function loadSettings() {
        userPrompt = GM_getValue('userPrompt', DEFAULT_PROMPT);
        copyWithPrompt = GM_getValue('copyWithPrompt', DEFAULT_COPY_WITH_PROMPT);
    }
    // --- 保存设置 ---
    function saveSettings(newPrompt, newCopyWithPrompt) {
        userPrompt = newPrompt;
        copyWithPrompt = newCopyWithPrompt;
        GM_setValue('userPrompt', userPrompt);
        GM_setValue('copyWithPrompt', copyWithPrompt);
    }

    // --- 弹窗编辑提示词和开关 ---
    function showPromptDialog() {
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.left = '50%';
        dialog.style.top = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.background = '#fff';
        dialog.style.border = '1px solid #ccc';
        dialog.style.borderRadius = '8px';
        dialog.style.zIndex = 99999;
        dialog.style.padding = '24px 20px 16px 20px';
        dialog.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
        dialog.style.minWidth = '600px';
        dialog.innerHTML = `
            <div style="font-weight:bold;font-size:16px;margin-bottom:10px;">设置</div>
            <label style="display:block;margin-bottom:5px;">提示词：</label>
            <textarea id="tmk-prompt" style="width:100%;height:150px;border:1px solid #ccc;">${userPrompt}</textarea>
            <label style="display:block;margin:10px 0 4px 0;">
              <input type="checkbox" id="tmk-copywithprompt" ${copyWithPrompt ? 'checked' : ''}> 复制时自动带提示词
            </label>
            <div style="text-align:right;margin-top:10px;">
                <button id="tmk-save" style="margin-right:10px;">保存</button>
                <button id="tmk-cancel">取消</button>
            </div>
        `;
        document.body.appendChild(dialog);
        document.getElementById('tmk-save').onclick = function() {
            const newPrompt = document.getElementById('tmk-prompt').value;
            const newCopyWithPrompt = document.getElementById('tmk-copywithprompt').checked;
            saveSettings(newPrompt, newCopyWithPrompt);
            document.body.removeChild(dialog);
            showTip('设置已保存！');
        };
        document.getElementById('tmk-cancel').onclick = function() {
            document.body.removeChild(dialog);
        };
    }

    // --- 获取当前题目文本 ---
    function getCurrentQuestionText(card) {
        let questionText = "";
        const titleElement = card.querySelector('.exam-item-title p');
        if (titleElement) {
            questionText += titleElement.innerText.trim() + "\n";
        }
        const options = card.querySelectorAll('.exam-item-content .el-radio-group .el-radio');
        if (options.length > 0) {
            options.forEach(option => {
                const label = option.querySelector('.el-radio__label');
                if (label) questionText += label.innerText.trim() + "\n";
            });
        }
        return questionText.trim();
    }

    // --- 复制题目到剪贴板 ---
    function copyQuestion(card) {
        const question = getCurrentQuestionText(card);
        let text = question;
        if (copyWithPrompt) {
            text = userPrompt + "\n\n" + question;
        }
        navigator.clipboard.writeText(text).then(() => {
            showTip('题目已复制到剪贴板！');
        }).catch(err => {
            showTip('复制失败: ' + err, true);
        });
    }

    // --- 显示临时提示 ---
    function showTip(msg, isErr) {
        let tip = document.createElement('div');
        tip.textContent = msg;
        tip.style.position = 'fixed';
        tip.style.left = '50%';
        tip.style.top = '20%';
        tip.style.transform = 'translateX(-50%)';
        tip.style.background = isErr ? '#d93025' : '#28a745';
        tip.style.color = '#fff';
        tip.style.padding = '10px 24px';
        tip.style.borderRadius = '6px';
        tip.style.fontSize = '16px';
        tip.style.zIndex = 99999;
        document.body.appendChild(tip);
        setTimeout(() => { tip.remove(); }, 1800);
    }

    // --- 插入按钮到每道题 ---
    function insertButtons() {
        // 查找每道题的操作按钮组
        document.querySelectorAll('.exam-item-card-inner').forEach(card => {
            const opBar = card.querySelector('.card-header-operation.flex');
            if (!opBar || opBar.querySelector('.tmk-copy-btn')) return; // 已插入则跳过
            // 复制题目按钮
            const copyBtn = document.createElement('div');
            copyBtn.className = 'card-operation-item tmk-copy-btn';
            copyBtn.innerHTML = `<button type="button" class="el-button is-link"><span><img src="https://cdn-icons-png.flaticon.com/128/11238/11238246.png" style="width:16px;vertical-align:middle;">复制题目</span></button>`;
            copyBtn.onclick = function(e) {
                e.stopPropagation();
                copyQuestion(card);
            };
            // 编辑提示词按钮
            const promptBtn = document.createElement('div');
            promptBtn.className = 'card-operation-item tmk-prompt-btn';
            promptBtn.innerHTML = `<button type="button" class="el-button is-link"><span><img src="https://cdn-icons-png.flaticon.com/128/2040/2040510.png" style="width:16px;vertical-align:middle;">编辑提示词</span></button>`;
            promptBtn.onclick = function(e) {
                e.stopPropagation();
                showPromptDialog();
            };
            // 插入到操作栏
            opBar.appendChild(copyBtn);
            opBar.appendChild(promptBtn);
        });
    }

    // --- 添加样式使按钮一致 ---
    GM_addStyle(`
      .tmk-copy-btn, .tmk-prompt-btn { display:inline-block; }
      .tmk-copy-btn .el-button, .tmk-prompt-btn .el-button { padding: 4px 0px; font-size: 14px; }
      .tmk-copy-btn .el-button img, .tmk-prompt-btn .el-button img { margin-right: 2px; }
    `);

    // --- 初始化 ---
    function init() {
        loadSettings();
        insertButtons();
        // 监听动态加载（如切换题目时）
        const observer = new MutationObserver(() => insertButtons());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();