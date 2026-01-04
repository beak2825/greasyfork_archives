// ==UserScript==
// @name         ChatGPT Mermaid Renderer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Detect and render Mermaid code blocks on the ChatGPT chat page. 
// @license      MIT
// @author       zhaokang555
// @match        *://chatgpt.com/*
// @grant        GM_log
// @require      https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/544586/ChatGPT%20Mermaid%20Renderer.user.js
// @updateURL https://update.greasyfork.org/scripts/544586/ChatGPT%20Mermaid%20Renderer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 初始化 Mermaid
    mermaid.initialize({ startOnLoad: false });
    // 创建防抖函数
    const debounceRenderMermaid = _.debounce(() => {
        checkAndRenderMermaid(document.body);
    }, 500);
    // 监听 DOM 变化，检测 Mermaid 代码块
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    debounceRenderMermaid(); // 使用防抖函数
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    async function checkAndRenderMermaid(container) {
        console.log('checkAndRenderMermaid')
        const codeBlocks = container.querySelectorAll("pre code");
        codeBlocks.forEach(codeBlock => {
            // 检查代码块内容是否为 Mermaid 代码
            if (codeBlock.classList.contains('language-mermaid')) {
                const mermaidCode = codeBlock.textContent.replace(/```mermaid|\n```/g, "").trim();
                try {
                    mermaid.parse(mermaidCode);

                    // 查找并删除旧的 mermaidContainer
                    const parentPre = codeBlock.parentNode;
                    const nextSibling = parentPre.nextElementSibling;
                    if (nextSibling && nextSibling.classList.contains('mermaid')) {
                        nextSibling.remove();
                    }

                    // 创建 Mermaid 渲染容器
                    const mermaidContainer = document.createElement("div");
                    mermaidContainer.className = "mermaid";
                    mermaidContainer.textContent = mermaidCode;
                    // 在代码块下方插入 Mermaid 容器
                    parentPre.insertAdjacentElement("afterend", mermaidContainer);

                } catch (error) {
                    console.error('mermaid.parse error:', error)
                }

            }
        });
        try {
            // 渲染 Mermaid
            await mermaid.run();
        } catch (error) {
            console.error('mermaid.run error:', error)
        }

    }
    // 初次检查已有的 Mermaid 代码
    checkAndRenderMermaid(document.body);
})();