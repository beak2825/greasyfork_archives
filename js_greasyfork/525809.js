// ==UserScript==
// @name         DeepSeek Chat 页面 Mermaid 渲染增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在Mermaid代码块旁添加渲染按钮，点击后打开新窗口（由 DeepSeek 深度思考编写）
// @author       DeepSeek-R1 & Conglinyizhi
// @match        https://chat.deepseek.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525809/DeepSeek%20Chat%20%E9%A1%B5%E9%9D%A2%20Mermaid%20%E6%B8%B2%E6%9F%93%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525809/DeepSeek%20Chat%20%E9%A1%B5%E9%9D%A2%20Mermaid%20%E6%B8%B2%E6%9F%93%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置mermaid
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose'
    });

    // 创建渲染窗口样式
    const style = document.createElement('style');
    style.textContent = `
        .mermaid-render-window {
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            overflow: auto;
        }
    `;
    document.head.appendChild(style);

    // 添加渲染按钮的函数
    function addRenderButton(codeBlock) {
        const copyBtn = codeBlock.querySelector('.ds-markdown-code-copy-button');
        if (!copyBtn || copyBtn.nextElementSibling?.classList.contains('render-btn')) return;

        const renderBtn = document.createElement('div');
        renderBtn.className = 'ds-markdown-code-copy-button render-btn';
        renderBtn.textContent = '渲染';
        renderBtn.style.marginLeft = '8px';
        renderBtn.style.cursor = 'pointer';

        renderBtn.addEventListener('click', async () => {
            const code = codeBlock.querySelector('pre').innerText;
            const cleanedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>');

            const renderWindow = window.open('', '_blank', 'width=800,height=600');
            renderWindow.document.write(`
                <html>
                    <head>
                        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.css">
                        <style>
                            :root {
                                --bg-color: #ffffff;
                                --text-color: #000000;
                            }
                            @media (prefers-color-scheme: dark) {
                                :root {
                                    --bg-color: rgb(102, 102, 102);
                                    --text-color: #ffffff;
                                }
                            }
                            body {
                                margin: 0;
                                background: var(--bg-color);
                                color: var(--text-color);
                                transition: background 0.3s, color 0.3s;
                            }
                            .container {
                                padding: 20px;
                                min-height: 100vh;
                            }
                            .render-status {
                                position: fixed;
                                top: 20px;
                                left: 50%;
                                transform: translateX(-50%);
                                padding: 8px 16px;
                                background: rgba(0,0,0,1);
                                color: white;
                                border-radius: 4px;
                                font-family: sans-serif;
                                z-index: 1000;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="render-status">🔄 正在渲染图表...</div>
                        <div class="container v-cloak">
                            <div class="mermaid">${cleanedCode}</div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/mermaid@9/dist/mermaid.min.js"><\/script>
                        <script>
                            // 主题适配
                            function updateTheme() {
                                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                document.body.style.backgroundColor = isDark ? '#6666666' : '#ffffff';
                                document.body.style.color = isDark ? '#ffffff' : '#000000';
                            }

                            // 监听系统主题变化
                            window.matchMedia('(prefers-color-scheme: dark)')
                                .addEventListener('change', updateTheme);

                            // 初始化主题
                            updateTheme();

                            // 初始化Mermaid
                            mermaid.initialize({
                                theme: 'default',
                                securityLevel: 'loose',
                                darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
                            });

                            // 执行渲染并移除提示
                            mermaid.init(undefined, document.querySelectorAll('.mermaid'))
                                .then(() => {
                                    document.querySelector('.render-status').remove();
                                    // 删除 v-cloak 属性
                                    document.querySelectorAll('.v-cloak').forEach(el => el.removeAttribute('v-cloak'));
                                });
                        <\/script>
                    </body>
                </html>
            `);
        });

        copyBtn.parentNode.insertBefore(renderBtn, copyBtn.nextSibling);
    }

    // 使用MutationObserver监听动态加载
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                document.querySelectorAll('.md-code-block').forEach(block => {
                    if (block.querySelector('.md-code-block-infostring')?.textContent === 'mermaid') {
                        addRenderButton(block);
                    }
                });
            }
        });
    });

    // 启动观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始处理已有元素
    document.querySelectorAll('.md-code-block').forEach(block => {
        if (block.querySelector('.md-code-block-infostring')?.textContent === 'mermaid') {
            addRenderButton(block);
        }
    });
})();