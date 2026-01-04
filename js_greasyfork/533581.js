// ==UserScript==
// @name         ChatGPT 输出文本转HTML
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将 ChatGPT 输出快速转换为 HTML，支持复制和新页面预览（含时间戳），兼容新版界面
// @match        https://chatgpt.com/*
// @license MIT
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533581/ChatGPT%20%E8%BE%93%E5%87%BA%E6%96%87%E6%9C%AC%E8%BD%ACHTML.user.js
// @updateURL https://update.greasyfork.org/scripts/533581/ChatGPT%20%E8%BE%93%E5%87%BA%E6%96%87%E6%9C%AC%E8%BD%ACHTML.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 构造完整 HTML 页面，直接嵌入渲染后的 HTML
    function getFormattedHTML(htmlContent) {
        const timestamp = new Date().toLocaleString('zh-CN');
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>ChatGPT 输出预览</title>
  <style>
    body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
    p, li { margin: 10px 0; }
  </style>
</head>
<body>
  <!-- 输出时间：${timestamp} -->
  ${htmlContent}
</body>
</html>`;
    }

    // 通用按钮生成
    function createButton(text, onClick, bgColor = '#4CAF50') {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            margin: '6px 4px',
            padding: '5px 10px',
            background: bgColor,
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 添加按钮组到渲染后的 markdown 容器
    function addButtons(mdNode) {
        if (mdNode.parentElement.querySelector('.gpt-html-btn-group')) return;
        const htmlContent = mdNode.innerHTML;
        const btnGroup = document.createElement('div');
        btnGroup.className = 'gpt-html-btn-group';
        btnGroup.style.marginTop = '10px';

        const copyBtn = createButton('📋 复制为 HTML', () => {
            const fullHTML = getFormattedHTML(htmlContent);
            GM_setClipboard(fullHTML);
            copyBtn.textContent = '✅ 已复制！';
            setTimeout(() => copyBtn.textContent = '📋 复制为 HTML', 2000);
        });

        const runBtn = createButton('🚀 预览 HTML', () => {
            const fullHTML = getFormattedHTML(htmlContent);
            const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }, '#2196F3');

        btnGroup.append(copyBtn, runBtn);
        mdNode.parentElement.appendChild(btnGroup);
    }

    // 处理新增节点
    function processNode(node) {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches('div.markdown')) {
            addButtons(node);
        }
        node.querySelectorAll && node.querySelectorAll('div.markdown').forEach(addButtons);
    }

    // 初始化并监听变化
    function initObserver() {
        document.querySelectorAll('div.markdown').forEach(addButtons);
        const observer = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(processNode)));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => setTimeout(initObserver, 2000));
})();

