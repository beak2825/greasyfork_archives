// ==UserScript==
// @name         GoodNote - VSCode 网页笔记助手
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  在任何网页添加VSCode编辑器功能 ctrl + shift + L
// @author       kasusa
// @license MIT
// @match        *://*/*
// @icon         http://139.196.171.60:88/images/code/code.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526873/GoodNote%20-%20VSCode%20%E7%BD%91%E9%A1%B5%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/526873/GoodNote%20-%20VSCode%20%E7%BD%91%E9%A1%B5%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建模糊背景遮罩
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'fixed';
    blurOverlay.style.top = '0';
    blurOverlay.style.left = '0';
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    blurOverlay.style.backdropFilter = 'blur(5px)';
    blurOverlay.style.WebkitBackdropFilter = 'blur(5px)'; // Safari 支持
    blurOverlay.style.zIndex = '9998'; // 确保在编辑器下面
    blurOverlay.style.display = 'none';
    blurOverlay.style.transition = 'opacity 0.2s ease';
    blurOverlay.style.opacity = '0';
    document.body.appendChild(blurOverlay);

    const editorContainer = document.createElement('div');
    editorContainer.style.position = 'fixed';
    editorContainer.style.bottom = '-100%'; // 初始位置在屏幕下方
    editorContainer.style.left = '15%';
    editorContainer.style.width = '70%';
    editorContainer.style.height = '80%';
    editorContainer.style.zIndex = '9999';
    editorContainer.style.backgroundColor = '#1e1e1e';
    editorContainer.style.border = '2.5px solid rgb(0, 237, 229)';
    editorContainer.style.borderRadius = '10px';
    editorContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.43)';
    editorContainer.style.display = 'none';
    editorContainer.style.padding = '15px';
    editorContainer.style.transition = 'bottom 0.2s ease'; // 添加过渡效果
    editorContainer.style.textAlign = 'left'; // 强制文本左对齐
    editorContainer.style.margin = '0'; // 清除可能的外边距

    // 创建语言选择下拉菜单
    const languageSelect = document.createElement('select');
    languageSelect.style.position = 'absolute';
    languageSelect.style.top = '10px';
    languageSelect.style.right = '10px';
    languageSelect.style.padding = '5px';
    languageSelect.style.backgroundColor = '#2d2d2d';
    languageSelect.style.color = '#fff';
    languageSelect.style.border = '1px solid #454545';
    languageSelect.style.borderRadius = '4px';
    languageSelect.style.zIndex = '10001';

    // 添加常用语言选项
    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'html', name: 'HTML' },
        { id: 'css', name: 'CSS' },
        { id: 'python', name: 'Python' },
        { id: 'java', name: 'Java' },
        { id: 'cpp', name: 'C++' },
        { id: 'csharp', name: 'C#' },
        { id: 'php', name: 'PHP' },
        { id: 'sql', name: 'SQL' },
        { id: 'markdown', name: 'Markdown' },
        { id: 'json', name: 'JSON' },
        { id: 'plaintext', name: '纯文本' }
    ];

    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.id;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
    });

    editorContainer.appendChild(languageSelect);
    document.body.appendChild(editorContainer);

    // 添加代码图标
    const codeIcon = document.createElement('div');
    codeIcon.style.position = 'fixed';
    codeIcon.style.bottom = '10px';
    codeIcon.style.right = '10px';
    codeIcon.style.width = '50px';
    codeIcon.style.height = '50px';
    codeIcon.style.backgroundImage = 'url(http://139.196.171.60:88/images/code/code.png)';
    codeIcon.style.backgroundSize = 'cover';
    codeIcon.style.cursor = 'pointer';
    codeIcon.style.zIndex = '10000';
    codeIcon.addEventListener('click', toggleEditor);
    document.body.appendChild(codeIcon);

    // 创建VSCode编辑器实例
    let editor;
    
    // 添加检查Monaco资源可用性的函数
    function checkMonacoAvailability(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (response.ok) {
                        resolve(true);
                    } else {
                        reject(new Error('无法加载Monaco编辑器资源'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // 显示错误信息的函数
    function showErrorMessage(message) {
        editorContainer.innerHTML = `
            <div style="color: #fff; text-align: center; padding: 20px; font-family: Arial, sans-serif;">
                <h3 style="color: #ff4444;">加载错误</h3>
                <p> ${message}</p>
                <p style="color:rgb(221, 255, 68);">一般换一个网站就可以了。(比如下面几个)</p>
                <p>有些严格网站会禁止访问 Monaco 编辑器的资源（来自 cdnjs.cloudflare.com） <br> 比如 github.com 。<br>
                可以检查一下更新内容，说不准解决了呢 <a href="https://greasyfork.org/zh-CN/scripts/526873" target="_blank">greasyfork.org</a><br>
                或者来我的博客看看: <a href="https://b.cornradio.org/" target="_blank">b.cornradio.org</a><br>
                看会儿视频放松一下： <a href="https://tva.cornradio.org/" target="_blank">tva.cornradio.org</a></p>
            </div>
        `;
    }

    function initializeEditor() {
        const monacoUrl = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/editor/editor.main.js';
        
        checkMonacoAvailability(monacoUrl)
            .then(() => {
                require(['vs/editor/editor.main'], function() {
                    editor = monaco.editor.create(editorContainer, {
                        value: '',
                        language: languageSelect.value,
                        theme: 'vs-dark',
                        automaticLayout: true
                    });

                    // 监听语言选择变化
                    languageSelect.addEventListener('change', () => {
                        monaco.editor.setModelLanguage(editor.getModel(), languageSelect.value);
                        // 保存当前选择的语言
                        GM_setValue('vscode_language', languageSelect.value);
                    });

                    // 加载保存的笔记和语言设置
                    const savedNote = GM_getValue('vscode_note', '');
                    const savedLanguage = GM_getValue('vscode_language', 'javascript');
                    languageSelect.value = savedLanguage;
                    editor.setValue(savedNote);
                    monaco.editor.setModelLanguage(editor.getModel(), savedLanguage);

                    // 屏蔽其他快捷键
                    editorContainer.addEventListener('keydown', (e) => {
                        e.stopPropagation();
                    });

                    // 自动保存功能
                    editor.onDidChangeModelContent(() => {
                        const content = editor.getValue();
                        GM_setValue('vscode_note', content);
                    });
                });
            })
            .catch(error => {
                showErrorMessage(error.message);
            });
    }

    // 切换编辑器显示
    function toggleEditor() {
        if (editorContainer.style.display === 'none') {
            // 显示模糊背景
            blurOverlay.style.display = 'block';
            setTimeout(() => {
                blurOverlay.style.opacity = '1';
            }, 0);
            
            editorContainer.style.display = 'block';
            setTimeout(() => {
                editorContainer.style.bottom = '10%'; // 显示时移动到可见位置
            }, 0);
            if (!editor) {
                initializeEditor();
            }
        } else {
            editorContainer.style.bottom = '-100%'; // 隐藏时移动到屏幕下方
            // 隐藏模糊背景
            blurOverlay.style.opacity = '0';
            setTimeout(() => {
                editorContainer.style.display = 'none';
                blurOverlay.style.display = 'none';
            }, 500); // 等待动画结束后隐藏
        }
    }

    // 添加快捷键监听
    document.addEventListener('keydown', (e) => {
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        if ((isMac && e.metaKey || !isMac && e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();
            toggleEditor();
        }
    });

    // 添加点击外部隐藏功能
    document.addEventListener('click', (e) => {
        if (editorContainer.style.display === 'block' && !editorContainer.contains(e.target) && !codeIcon.contains(e.target)) {
            editorContainer.style.bottom = '-100%'; // 隐藏时移动到屏幕下方
            // 隐藏模糊背景
            blurOverlay.style.opacity = '0';
            setTimeout(() => {
                editorContainer.style.display = 'none';
                blurOverlay.style.display = 'none';
            }, 500); // 等待动画结束后隐藏
        }
    });

    // 加载Monaco Editor
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.js';
    script.onload = function() {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' }});
    };
    document.body.appendChild(script);
})(); 