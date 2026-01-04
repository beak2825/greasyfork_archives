// ==UserScript==
// @name         Codetop Notes 增强
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  在 Codetop 题目列表每行"笔记"按钮旁插入自定义按钮（初版）
// @author       YourName
// @match        https://codetop.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543131/Codetop%20Notes%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543131/Codetop%20Notes%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数：插入自定义按钮
    function insertCustomNoteButtons() {
        // 兼容所有"笔记"按钮（无论列号、class如何变化）
        const noteSpans = Array.from(document.querySelectorAll('table tr td .el-button > span'))
            .filter(span => span.textContent.trim() === '笔记');
        noteSpans.forEach(span => {
            const noteBtn = span.parentElement;
            const btnGroup = noteBtn.parentElement;
            // 避免重复插入
            if (btnGroup.querySelector('.ctn-custom-note-btn')) {
                // 按钮已存在，但要更新状态
                const existingBtn = btnGroup.querySelector('.ctn-custom-note-btn');
                let tr = existingBtn;
                while (tr && tr.tagName !== 'TR') tr = tr.parentElement;
                if (tr) {
                    const key = getRowKeyFromBtn(existingBtn);
                    loadNote(key).then(content => {
                        updateButtonState(existingBtn, content);
                    }).catch(err => {
                        // 按钮状态更新失败不影响主要功能
                    });
                }
                return;
            }
            // 创建自定义按钮
            const btn = document.createElement('button');
            btn.className = noteBtn.className + ' ctn-custom-note-btn';
            btn.style.marginLeft = '6px';
            btn.innerHTML = '📝';
            btn.style.maxWidth = '40px';
            btn.style.padding = '0 8px';
            btn.style.fontSize = '16px';
            btn.style.whiteSpace = 'nowrap';
            btn.style.height = noteBtn.offsetHeight + 'px';
            btn.title = '自定义笔记';
            btn.addEventListener('click', showCustomNoteModal);
            btnGroup.insertBefore(btn, noteBtn.nextSibling);
            // 优化：如果该题存在笔记，按钮显示绿色
            let tr = btn;
            while (tr && tr.tagName !== 'TR') tr = tr.parentElement;
            if (tr) {
                const key = getRowKeyFromBtn(btn);
                loadNote(key).then(content => {
                    updateButtonState(btn, content);
                }).catch(err => {
                    // 按钮状态更新失败不影响主要功能
                });
            }
        });
    }

    // IndexedDB 简单封装
    const DB_NAME = 'codetop_notes';
    const STORE_NAME = 'notes';

    // 只做最基础的open，不做任何超时、自动删除、reset、test等
    function openDB() {
        return new Promise((resolve, reject) => {
            const req = window.indexedDB.open(DB_NAME, 1);
            req.onupgradeneeded = function(e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'key' });
                }
            };
            req.onsuccess = function(e) {
                resolve(e.target.result);
            };
            req.onerror = function(e) {
                console.error('数据库打开失败:', e);
                reject(e);
            };
            req.onblocked = function(e) {
                console.error('数据库被阻塞:', e);
                reject(new Error('数据库被阻塞'));
            };
        });
    }
    // 修改 saveNote 支持可选 updated_at 参数
    function saveNote(key, content, updated_at) {
        return openDB().then(db => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const putRequest = store.put({
                    key,
                    content,
                    updated_at: typeof updated_at === 'number' ? updated_at : Date.now()
                });
                putRequest.onsuccess = () => {
                    resolve();
                };
                putRequest.onerror = (e) => {
                    console.error('保存笔记失败:', e);
                    reject(e);
                };
                tx.onerror = (e) => {
                    console.error('事务失败:', e);
                    reject(e);
                };
            });
        });
    }
    function loadNote(key) {
        return openDB().then(db => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(key);
                req.onsuccess = () => {
                    const result = req.result ? req.result.content : '';
                    resolve(result);
                };
                req.onerror = (e) => {
                    console.error('加载笔记失败:', e);
                    reject(e);
                };
                tx.onerror = (e) => {
                    console.error('事务失败:', e);
                    reject(e);
                };
            });
        });
    }

    // 更新按钮状态的工具函数
    // ... existing code ...
    function updateButtonState(btn, content) {
        if (content && content.trim()) {
            btn.style.background = '#e6a23c'; // 有内容时橙色
            btn.style.color = '#fff';
            btn.style.borderColor = '#e6a23c';
        } else {
            // 默认灰色
            btn.style.background = '#909399';
            btn.style.color = '#fff';
            btn.style.borderColor = '#909399';
        }
    }
    // ... existing code ...

    // 获取当前行的题目唯一 key
    function getRowKeyFromBtn(btn) {
        let tr = btn;
        while (tr && tr.tagName !== 'TR') tr = tr.parentElement;
        if (!tr) {
            return '';
        }

        // 优先用 tr 的 data-row-key 或 data-id
        if (tr.dataset && (tr.dataset.rowKey || tr.dataset.id)) {
            return tr.dataset.rowKey || tr.dataset.id;
        }

        // 依次检查前两个td，优先用a标签href
        const tds = tr.querySelectorAll('td');
        for (let i = 0; i < Math.min(2, tds.length); i++) {
            const a = tds[i].querySelector('a');
            if (a && a.href) {
                return a.href;
            }
        }
        // 如果没有a标签，再用前两个td的文本
        for (let i = 0; i < Math.min(2, tds.length); i++) {
            const text = tds[i].textContent.trim();
            if (text) {
                return `${tr.rowIndex || ''}_${text}`;
            }
        }
        // 兜底：用整行文本+行号
        const key = `${tr.rowIndex || ''}_${tr.textContent.trim()}`;
        return key;
    }

    // 简单浮层（Modal）实现
    function showCustomNoteModal(e) {
        // 若已存在则不重复弹出
        if (document.querySelector('.ctn-modal-mask')) return;
        const btn = e.currentTarget;
        const noteKey = getRowKeyFromBtn(btn);
        // 先渲染 modal 骨架和 loading
        const mask = document.createElement('div');
        mask.className = 'ctn-modal-mask';
        mask.style = `
            position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;`;
        const modal = document.createElement('div');
        modal.className = 'ctn-modal';
        // 全屏样式
        modal.style = `
            background:#fff;
            padding:0;
            border-radius:0;
            width:100vw;
            height:100vh;
            max-width:100vw;
            max-height:100vh;
            box-shadow:none;
            position:relative;
            display:flex;
            flex-direction:row;
            gap:0;
            overflow:hidden;
        `;
        // 关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style = 'position:absolute;right:32px;top:24px;font-size:32px;cursor:pointer;z-index:2;color:#d4d4d4;background:rgba(30,30,30,0.8);border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;';
        closeBtn.title = '关闭';
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
            closeBtn.style.color = '#ffffff';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(30,30,30,0.8)';
            closeBtn.style.color = '#d4d4d4';
        });
        closeBtn.onclick = () => {
            mask.remove();
            document.removeEventListener('keydown', escListener);
        };
        // ESC 键关闭浮层
        function escListener(ev) {
            if (ev.key === 'Escape') {
                mask.remove();
                document.removeEventListener('keydown', escListener);
            }
        }
        document.addEventListener('keydown', escListener);
        // 左右两栏骨架
        const left = document.createElement('div');
        left.style = 'flex:5;min-width:0;height:100vh;max-height:100vh;overflow:auto;display:flex;flex-direction:column;padding:48px 32px 32px 48px;box-sizing:border-box;background:#1e1e1e;';
        left.innerHTML = '<div style="padding:32px;text-align:center;color:#d4d4d4;">加载编辑器中...</div>';
        const right = document.createElement('div');
        right.style = 'flex:5;min-width:0;height:100vh;max-height:100vh;overflow:auto;border-left:1px solid #3c3c3c;padding:48px 48px 32px 48px;box-sizing:border-box;background:#2d2d30;color:#d4d4d4;';
        right.innerHTML = '<div style="padding:32px;text-align:center;color:#d4d4d4;">加载预览中...</div>';

        // 为右侧面板添加自定义滚动条样式
        right.style.setProperty('scrollbar-width', 'thin');
        right.style.setProperty('scrollbar-color', '#424242 #2d2d30');
        // 组装
        modal.appendChild(closeBtn);
        modal.appendChild(left);
        modal.appendChild(right);
        mask.appendChild(modal);
        document.body.appendChild(mask);
        // 加载依赖后再初始化编辑器和预览
        loadEasyMDE(() => {
            left.innerHTML = '';
            right.innerHTML = '';
            const textarea = document.createElement('textarea');
            textarea.id = 'ctn-md-editor';
            // 保存按钮
            const saveBtn = document.createElement('button');
            saveBtn.textContent = '保存';
            saveBtn.style = 'margin:12px 0 0 0;align-self:flex-end;padding:6px 18px;background:#0e639c;color:#fff;border:1px solid #1177bb;border-radius:4px;cursor:pointer;font-size:16px;transition:background 0.2s;';
            saveBtn.addEventListener('mouseenter', () => {
                saveBtn.style.background = '#1177bb';
            });
            saveBtn.addEventListener('mouseleave', () => {
                saveBtn.style.background = '#0e639c';
            });
            // 保存提示
            const saveTip = document.createElement('span');
            saveTip.style = 'margin-left:12px;color:#4fc1ff;font-size:14px;display:none;';
            saveTip.textContent = '已保存！';
            left.appendChild(textarea);
            left.appendChild(saveBtn);
            left.appendChild(saveTip);
            right.innerHTML = '<div style="font-weight:bold;margin-bottom:8px;color:#569cd6;font-size:18px;border-bottom:1px solid #3c3c3c;padding-bottom:8px;">📖 实时预览</div><div id="ctn-md-preview" style="min-height:320px;"></div>';
            // 初始化 EasyMDE
            const easyMDE = new window.EasyMDE({
                element: textarea,
                autoDownloadFontAwesome: false,
                status: false,
                toolbar: false, // 禁用工具栏，保持简洁
                minHeight: '320px',
                spellChecker: false,
                placeholder: '请输入 Markdown 笔记...',
                theme: 'dark',
                styleSelectedText: false
            });

            // 设置编辑器暗色主题样式
            setTimeout(() => {
                const editor = easyMDE.codemirror;
                const wrapper = editor.getWrapperElement();

                // 设置编辑器暗色主题
                wrapper.style.background = '#1e1e1e';
                wrapper.style.color = '#d4d4d4';
                wrapper.style.border = '1px solid #3c3c3c';
                wrapper.style.borderRadius = '6px';

                // 设置编辑器内部样式
                const editorElement = wrapper.querySelector('.CodeMirror');
                if (editorElement) {
                    editorElement.style.background = '#1e1e1e';
                    editorElement.style.color = '#d4d4d4';
                    editorElement.style.fontFamily = 'Consolas, "Courier New", monospace';
                    editorElement.style.fontSize = '14px';
                    editorElement.style.lineHeight = '1.5';
                }

                // 设置光标颜色
                const cursorElements = wrapper.querySelectorAll('.CodeMirror-cursor');
                cursorElements.forEach(cursor => {
                    cursor.style.borderColor = '#d4d4d4';
                });

                // 设置选中文本样式
                const style = document.createElement('style');
                style.textContent = `
                    .CodeMirror-dark .CodeMirror-selected { background: #264f78; }
                    .CodeMirror-dark .CodeMirror-line::selection,
                    .CodeMirror-dark .CodeMirror-line > span::selection,
                    .CodeMirror-dark .CodeMirror-line > span > span::selection { background: #264f78; }
                    .CodeMirror-dark .CodeMirror-activeline-background { background: #2a2a2a; }
                    .CodeMirror-dark .CodeMirror-gutters { background: #252526; border-right: 1px solid #3c3c3c; }
                    .CodeMirror-dark .CodeMirror-linenumber { color: #858585; }

                    /* Markdown 语法高亮 */
                    .CodeMirror-dark .cm-header { color: #569cd6; font-weight: bold; }
                    .CodeMirror-dark .cm-header-1 { color: #569cd6; font-size: 1.4em; }
                    .CodeMirror-dark .cm-header-2 { color: #569cd6; font-size: 1.3em; }
                    .CodeMirror-dark .cm-header-3 { color: #569cd6; font-size: 1.2em; }
                    .CodeMirror-dark .cm-quote { color: #6a9955; font-style: italic; }
                    .CodeMirror-dark .cm-strong { color: #d4d4d4; font-weight: bold; }
                    .CodeMirror-dark .cm-em { color: #d4d4d4; font-style: italic; }
                    .CodeMirror-dark .cm-link { color: #4fc1ff; text-decoration: underline; }
                    .CodeMirror-dark .cm-url { color: #4fc1ff; }
                    .CodeMirror-dark .cm-comment { color: #6a9955; }
                    .CodeMirror-dark .cm-string { color: #ce9178; }
                    .CodeMirror-dark .cm-keyword { color: #569cd6; }
                    .CodeMirror-dark .cm-builtin { color: #dcdcaa; }
                    .CodeMirror-dark .cm-variable-2 { color: #9cdcfe; }
                    .CodeMirror-dark .cm-variable-3 { color: #4ec9b0; }
                    .CodeMirror-dark .cm-tag { color: #569cd6; }
                    .CodeMirror-dark .cm-attribute { color: #9cdcfe; }
                    .CodeMirror-dark .cm-number { color: #b5cea8; }
                    .CodeMirror-dark .cm-atom { color: #569cd6; }
                    .CodeMirror-dark .cm-meta { color: #dcdcaa; }
                    .CodeMirror-dark .cm-bracket { color: #d4d4d4; }

                    /* 代码块样式 */
                    .CodeMirror-dark .cm-formatting-code-block,
                    .CodeMirror-dark .cm-formatting-code { color: #808080; }
                    .CodeMirror-dark .cm-comment.cm-formatting-code-block {
                        background: #2d2d30;
                        color: #ce9178;
                        border-radius: 3px;
                        padding: 1px 3px;
                    }

                    /* 列表样式 */
                    .CodeMirror-dark .cm-formatting-list { color: #569cd6; font-weight: bold; }

                    /* 分割线样式 */
                    .CodeMirror-dark .cm-hr { color: #808080; font-weight: bold; }

                    /* 工具栏隐藏（如果存在） */
                    .CodeMirror-dark + .editor-toolbar { display: none !important; }

                    /* 滚动条样式 */
                    .CodeMirror-dark .CodeMirror-scrollbar-filler,
                    .CodeMirror-dark .CodeMirror-gutter-filler { background: #1e1e1e; }
                    .CodeMirror-dark .CodeMirror-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
                    .CodeMirror-dark .CodeMirror-scroll::-webkit-scrollbar-track { background: #2d2d30; }
                    .CodeMirror-dark .CodeMirror-scroll::-webkit-scrollbar-thumb { background: #424242; border-radius: 5px; }
                    .CodeMirror-dark .CodeMirror-scroll::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }

                    /* 焦点样式 */
                    .CodeMirror-dark.CodeMirror-focused .CodeMirror-selected { background: #264f78; }

                    /* Placeholder 样式 */
                    .CodeMirror-dark .CodeMirror-placeholder { color: #717171; }
                    .CodeMirror-dark .CodeMirror-empty.CodeMirror-focused .CodeMirror-placeholder { color: #717171; }

                    /* 预览区域暗色主题样式 */
                    #ctn-md-preview {
                        background: #2d2d30;
                        color: #d4d4d4;
                        border-radius: 6px;
                        padding: 16px;
                        line-height: 1.6;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                    }

                    #ctn-md-preview h1, #ctn-md-preview h2, #ctn-md-preview h3,
                    #ctn-md-preview h4, #ctn-md-preview h5, #ctn-md-preview h6 {
                        color: #569cd6;
                        border-bottom: 1px solid #3c3c3c;
                        padding-bottom: 0.3em;
                        margin-top: 24px;
                        margin-bottom: 16px;
                    }

                    #ctn-md-preview h1 { font-size: 2em; }
                    #ctn-md-preview h2 { font-size: 1.5em; }
                    #ctn-md-preview h3 { font-size: 1.25em; }
                    #ctn-md-preview h4 { font-size: 1em; }
                    #ctn-md-preview h5 { font-size: 0.875em; }
                    #ctn-md-preview h6 { font-size: 0.85em; }

                    #ctn-md-preview p {
                        margin-bottom: 16px;
                        color: #d4d4d4;
                    }

                    #ctn-md-preview code {
                        background: #1e1e1e;
                        color: #f8f8f2;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                        font-size: 0.875em;
                        border: 1px solid #3c3c3c;
                    }

                    #ctn-md-preview pre {
                        background: #1e1e1e;
                        border: 1px solid #3c3c3c;
                        border-radius: 6px;
                        padding: 16px;
                        overflow-x: auto;
                        margin: 16px 0;
                    }

                    #ctn-md-preview pre code {
                        background: transparent;
                        border: none;
                        padding: 0;
                        color: inherit;
                    }

                    #ctn-md-preview blockquote {
                        background: #2a2a2a;
                        border-left: 4px solid #6a9955;
                        padding: 8px 16px;
                        margin: 16px 0;
                        color: #d4d4d4;
                        font-style: italic;
                    }

                    #ctn-md-preview ul, #ctn-md-preview ol {
                        padding-left: 24px;
                        margin: 16px 0;
                    }

                    #ctn-md-preview li {
                        margin: 4px 0;
                        color: #d4d4d4;
                    }

                    #ctn-md-preview a {
                        color: #4fc1ff;
                        text-decoration: none;
                        border-bottom: 1px solid transparent;
                        transition: border-color 0.2s;
                    }

                    #ctn-md-preview a:hover {
                        border-bottom-color: #4fc1ff;
                    }

                    #ctn-md-preview table {
                        border-collapse: collapse;
                        width: 100%;
                        margin: 16px 0;
                        background: #252526;
                        border: 1px solid #3c3c3c;
                        border-radius: 6px;
                        overflow: hidden;
                    }

                    #ctn-md-preview th, #ctn-md-preview td {
                        border: 1px solid #3c3c3c;
                        padding: 8px 12px;
                        text-align: left;
                    }

                    #ctn-md-preview th {
                        background: #1e1e1e;
                        color: #569cd6;
                        font-weight: bold;
                    }

                    #ctn-md-preview td {
                        color: #d4d4d4;
                    }

                    #ctn-md-preview hr {
                        border: none;
                        border-top: 2px solid #3c3c3c;
                        margin: 24px 0;
                    }

                    #ctn-md-preview img {
                        max-width: 100%;
                        height: auto;
                        border-radius: 6px;
                        border: 1px solid #3c3c3c;
                    }

                    #ctn-md-preview strong {
                        color: #e6db74;
                        font-weight: bold;
                    }

                    #ctn-md-preview em {
                        color: #ae81ff;
                        font-style: italic;
                    }

                    /* 自定义滚动条 - 预览区域 */
                    #ctn-md-preview::-webkit-scrollbar { width: 10px; }
                    #ctn-md-preview::-webkit-scrollbar-track { background: #2d2d30; }
                    #ctn-md-preview::-webkit-scrollbar-thumb { background: #424242; border-radius: 5px; }
                    #ctn-md-preview::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }

                    /* 右侧面板滚动条样式 */
                    .ctn-modal div[style*="background:#2d2d30"]::-webkit-scrollbar { width: 12px; }
                    .ctn-modal div[style*="background:#2d2d30"]::-webkit-scrollbar-track { background: #2d2d30; }
                    .ctn-modal div[style*="background:#2d2d30"]::-webkit-scrollbar-thumb { background: #424242; border-radius: 6px; }
                    .ctn-modal div[style*="background:#2d2d30"]::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }
                `;
                document.head.appendChild(style);

                // 应用暗色主题类
                wrapper.classList.add('CodeMirror-dark');

                // 启用markdown模式和语法高亮
                const mode = window.CodeMirror && window.CodeMirror.modes && window.CodeMirror.modes.gfm
                    ? 'gfm'
                    : window.CodeMirror && window.CodeMirror.modes && window.CodeMirror.modes.markdown
                    ? 'markdown'
                    : 'text/plain';

                editor.setOption('mode', mode);
                editor.setOption('theme', 'default');
                editor.setOption('lineNumbers', false);
                editor.setOption('lineWrapping', true);
                editor.setOption('highlightFormatting', true);
                editor.setOption('tokenTypeOverrides', {
                    header: 'header',
                    quote: 'quote',
                    list1: 'variable-2',
                    list2: 'variable-3',
                    list3: 'keyword',
                    hr: 'hr',
                    image: 'tag',
                    formatting: 'meta',
                    linkInline: 'link',
                    linkEmail: 'link',
                    linkText: 'link',
                    linkHref: 'string'
                });

                // 刷新编辑器
                editor.refresh();
            }, 100);
            // 加载笔记内容
            loadNote(noteKey).then(content => {
                easyMDE.value(content);
                updatePreview();
            });
            // 实时预览
            function updatePreview() {
                const md = easyMDE.value();
                let renderMarkdown = md => md;
                if (window.marked) {
                    renderMarkdown = typeof window.marked === 'function'
                        ? window.marked
                        : (window.marked.marked ? window.marked.marked : renderMarkdown);
                }

                const previewContainer = document.getElementById('ctn-md-preview');
                previewContainer.innerHTML = renderMarkdown(md);

                // 应用代码高亮
                previewContainer.querySelectorAll('pre code').forEach(block => {
                    block.classList.add('hljs');
                    if (window.hljs && typeof window.hljs.highlightElement === 'function') {
                        // 清除之前的高亮
                        block.removeAttribute('data-highlighted');
                        window.hljs.highlightElement(block);
                    }
                });

                // 如果没有内容，显示提示
                if (!md.trim()) {
                    previewContainer.innerHTML = '<div style="text-align:center;color:#858585;padding:40px;font-style:italic;">✍️ 在左侧编辑器中输入 Markdown 内容，这里会实时显示预览效果</div>';
                }
            }
            easyMDE.codemirror.on('change', updatePreview);
            // 保存按钮事件
            saveBtn.onclick = () => {
                const val = easyMDE.value();
                saveNote(noteKey, val).then(() => {
                    saveTip.style.display = '';
                    setTimeout(() => { saveTip.style.display = 'none'; }, 1200);
                    // 保存成功后更新按钮状态
                    updateButtonState(btn, val);
                }).catch(err => {
                    console.error('保存失败:', err);
                    alert('保存失败，请重试');
                });
            };
        });
    }

    // 动态加载 EasyMDE、marked、highlight.js
    function loadEasyMDE(cb) {
        ensureFontAwesome();
        // 先加载 CodeMirror markdown 模式
        loadCodeMirrorMarkdown(() => {
            // EasyMDE
            if (!window.EasyMDE) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css';
                document.head.appendChild(link);
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.js';
                script.onload = () => {
                    loadMarked(cb);
                };
                script.onerror = () => {
                    alert('EasyMDE 加载失败，请检查网络');
                };
                document.body.appendChild(script);
            } else {
                loadMarked(cb);
            }
        });
    }

    // 加载 CodeMirror markdown 模式
    function loadCodeMirrorMarkdown(cb) {
        if (window.CodeMirror && window.CodeMirror.modes && window.CodeMirror.modes.markdown) {
            cb();
            return;
        }

        // 加载 CodeMirror markdown 模式
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.2/mode/markdown/markdown.min.js';
        script.onload = () => {
            // 加载 CodeMirror overlay 模式（markdown依赖）
            const overlayScript = document.createElement('script');
            overlayScript.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.2/addon/mode/overlay.min.js';
            overlayScript.onload = () => {
                // 加载 GFM 模式
                const gfmScript = document.createElement('script');
                gfmScript.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.2/mode/gfm/gfm.min.js';
                gfmScript.onload = cb;
                gfmScript.onerror = cb; // 即使加载失败也继续
                document.body.appendChild(gfmScript);
            };
            overlayScript.onerror = cb;
            document.body.appendChild(overlayScript);
        };
        script.onerror = cb;
        document.body.appendChild(script);
    }
    // 动态引入 FontAwesome 图标库
    function ensureFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css';
            document.head.appendChild(link);
        }
    }
    function loadMarked(cb) {
        if (!window.marked) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = () => {
                loadHLJS(cb);
            };
            script.onerror = () => {
                alert('marked 加载失败，请检查网络');
            };
            document.body.appendChild(script);
        } else {
            loadHLJS(cb);
        }
    }
    function loadHLJS(cb) {
        if (!window.hljs) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/vs2015.min.css'; // 使用暗色主题
            document.head.appendChild(link);
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js';
            script.onload = () => {
                // 配置 marked 的 highlight 选项
                if (window.marked && window.hljs) {
                    window.marked.setOptions({
                        highlight: function(code, lang) {
                            if (window.hljs.getLanguage(lang)) {
                                return window.hljs.highlight(code, { language: lang }).value;
                            }
                            return window.hljs.highlightAuto(code).value;
                        }
                    });
                }
                cb();
            };
            script.onerror = () => {
                alert('highlight.js 加载失败，请检查网络');
            };
            document.body.appendChild(script);
        } else {
            // 配置 marked 的 highlight 选项
            if (window.marked && window.hljs) {
                window.marked.setOptions({
                    highlight: function(code, lang) {
                        if (window.hljs.getLanguage(lang)) {
                            return window.hljs.highlight(code, { language: lang }).value;
                        }
                        return window.hljs.highlightAuto(code).value;
                    }
                });
            }
            cb();
        }
    }

    // 监听表格变化，保证按钮持续插入
    function observeTable() {
        // 监听整个页面的变化，不只是表格
        const targetNode = document.body;
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            mutations.forEach((mutation) => {
                // 检查是否有新增的节点包含表格行
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是表格相关的变化
                            if (node.classList?.contains('el-table__body') ||
                                node.querySelector?.('.el-table__body') ||
                                node.querySelector?.('td.el-table_1_column_6') ||
                                node.tagName === 'TR' ||
                                node.classList?.contains('el-table__row') ||
                                node.querySelector?.('.el-table__row')) {
                                shouldUpdate = true;
                            }
                        }
                    });

                    // 检查移除的节点
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'TR' ||
                                node.classList?.contains('el-table__row')) {
                                shouldUpdate = true;
                            }
                        }
                    });
                }

                // 检查属性变化（可能的翻页触发）
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'class' ||
                     mutation.attributeName === 'style' ||
                     mutation.attributeName === 'data-key')) {
                    const target = mutation.target;
                    if (target.classList?.contains('el-table') ||
                        target.closest?.('.el-table') ||
                        target.classList?.contains('el-pagination') ||
                        target.closest?.('.el-pagination')) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                // 延迟执行，确保DOM完全更新
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 100);

                // 再次更新确保状态正确
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 300);
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // 额外监听分页按钮点击
        observePaginationClicks();

        // 定期检查（后备方案）
        setInterval(() => {
            insertCustomNoteButtons();
        }, 2000); // 每2秒检查一次，增加频率
    }

    // 监听分页按钮点击
    function observePaginationClicks() {
        // 监听分页相关的点击事件
        document.addEventListener('click', (e) => {
            const target = e.target;
            // 检查是否点击了分页相关按钮
            if (target.closest('.el-pagination') ||
                target.closest('.el-pager') ||
                target.classList.contains('btn-prev') ||
                target.classList.contains('btn-next') ||
                target.classList.contains('number') ||
                target.closest('.el-pagination__jump') ||
                target.closest('.el-pagination__sizes')) {

                // 立即尝试更新一次
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 500);

                // 再次延迟更新（确保加载完成）
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 1000);

                // 最后一次更新（确保状态正确）
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 1500);
            }
        });

        // 监听键盘事件（可能的分页快捷键）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'PageUp' || e.key === 'PageDown' ||
                (e.key === 'Enter' && e.target.closest('.el-pagination'))) {
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 800);
            }
        });

        // 监听URL变化（可能的路由变化）
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => {
                    insertCustomNoteButtons();
                }, 1000);
            }
        }, 1000);
    }

    // 初始化
    function init() {
        insertCustomNoteButtons();
        observeTable();
    }

    // 页面插入导出/导入按钮区（只保留主按钮）
    function insertExportButton() {
        if (document.querySelector('.ctn-export-notes-btn-group')) return;
        const group = document.createElement('div');
        group.className = 'ctn-export-notes-btn-group';
        group.style = `
            position:fixed;
            right:36px;
            bottom:36px;
            z-index:10000;
            display:flex;
            flex-direction:column;
            gap:18px;
            align-items:flex-end;
        `;
        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.className = 'ctn-export-notes-btn';
        exportBtn.textContent = '导出笔记';
        exportBtn.style = btnStyle();
        exportBtn.onclick = exportAllNotes;
        // codetop导入按钮
        const importCodetopBtn = document.createElement('button');
        importCodetopBtn.className = 'ctn-import-codetop-btn';
        importCodetopBtn.textContent = 'codetop官方笔记 导入';
        importCodetopBtn.style = btnStyle('#67c23a');
        importCodetopBtn.onclick = showImportCodetopModal;
        // 插件导入按钮
        const importPluginBtn = document.createElement('button');
        importPluginBtn.className = 'ctn-import-plugin-btn';
        importPluginBtn.textContent = '插件笔记 导入';
        importPluginBtn.style = btnStyle('#e6a23c');
        importPluginBtn.onclick = showImportPluginModal;
        // 云同步按钮
        const syncBtn = document.createElement('button');
        syncBtn.className = 'ctn-sync-notes-btn';
        syncBtn.textContent = '云同步';
        syncBtn.style = btnStyle('#f56c6c');
        syncBtn.onclick = mergeSyncAllNotes;
        // 全量导入按钮
        const fullImportBtn = document.createElement('button');
        fullImportBtn.className = 'ctn-full-import-btn';
        fullImportBtn.textContent = '全量导入';
        fullImportBtn.style = btnStyle('#9c27b0');
        fullImportBtn.onclick = showFullImportModal;
        // 组装
        group.appendChild(exportBtn);
        group.appendChild(importCodetopBtn);
        group.appendChild(importPluginBtn);
        group.appendChild(syncBtn);
        group.appendChild(fullImportBtn);
        document.body.appendChild(group);
    }
    function btnStyle(bg) {
        return `
            background:${bg || '#409EFF'};
            color:#fff;
            border:none;
            border-radius:24px;
            padding:12px 28px;
            font-size:18px;
            box-shadow:0 2px 8px rgba(0,0,0,0.12);
            cursor:pointer;
        `;
    }
    // codetop导入弹窗
    function showImportCodetopModal() {
        showImportModal('codetop');
    }
    // 插件导入弹窗
    function showImportPluginModal() {
        showImportModal('plugin');
    }
    // 通用导入弹窗
    function showImportModal(type) {
        if (document.querySelector('.ctn-modal-mask')) {
            return;
        }
        // 遮罩
        const mask = document.createElement('div');
        mask.className = 'ctn-modal-mask';
        mask.style = 'position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:99999;display:flex;align-items:center;justify-content:center;';
        // 弹窗
        const modal = document.createElement('div');
        modal.className = 'ctn-modal';
        modal.style = 'background:#fff;padding:32px 32px 24px 32px;border-radius:12px;min-width:420px;max-width:90vw;box-shadow:0 2px 16px rgba(0,0,0,0.15);position:relative;';
        // 关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style = 'position:absolute;right:18px;top:12px;font-size:28px;cursor:pointer;z-index:2;';
        closeBtn.title = '关闭';
        closeBtn.onclick = () => mask.remove();
        // 标题
        const title = document.createElement('div');
        title.style = 'font-size:20px;font-weight:bold;margin-bottom:18px;';
        title.textContent = type === 'codetop' ? '从 codetop 导入笔记' : '从插件导入笔记';
        // 内容区
        const content = document.createElement('div');
        content.style = 'margin-bottom:18px;';
        if (type === 'codetop') {
            content.innerHTML = '<textarea style="width:100%;height:120px;font-size:16px;padding:8px;box-sizing:border-box;resize:vertical;" placeholder="粘贴 codetop API 返回的 JSON 或 JSON 数组..."></textarea>';
        } else {
            content.innerHTML = '<input type="file" accept="application/json" style="font-size:16px;">';
        }
        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.textContent = '导入';
        importBtn.style = 'margin-top:8px;padding:8px 32px;background:#409EFF;color:#fff;border:none;border-radius:6px;font-size:16px;cursor:pointer;';
        // 提示
        const tip = document.createElement('div');
        tip.style = 'margin-top:12px;color:#67c23a;font-size:15px;display:none;';
        tip.textContent = '导入成功！';
        // 组装
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(content);
        modal.appendChild(importBtn);
        modal.appendChild(tip);
        mask.appendChild(modal);
        document.body.appendChild(mask);
        // 导入逻辑
        importBtn.onclick = () => {
            // 保存原始状态
            const originalText = importBtn.textContent;
            const originalBackground = importBtn.style.background;

            // 设置导入中状态
            importBtn.disabled = true;
            importBtn.textContent = '导入中...';
            importBtn.style.background = '#909399'; // 灰色
            importBtn.style.cursor = 'not-allowed';
            importBtn.style.opacity = '0.6';

            // 恢复按钮状态的函数
            const restoreButton = () => {
                importBtn.disabled = false;
                importBtn.textContent = originalText;
                importBtn.style.background = originalBackground;
                importBtn.style.cursor = 'pointer';
                importBtn.style.opacity = '1';
            };

            if (type === 'codetop') {
                const val = content.querySelector('textarea').value;
                if (!val.trim()) {
                    alert('请输入要导入的JSON数据');
                    restoreButton();
                    return;
                }
                let arr;
                try {
                    arr = JSON.parse(val);
                } catch (e) {
                    console.error('JSON解析失败:', e);
                    alert('JSON 格式错误: ' + e.message);
                    restoreButton();
                    return;
                }
                if (!Array.isArray(arr)) arr = [arr];
                batchImportNotes(arr, type, tip, restoreButton);
            } else {
                const file = content.querySelector('input[type=file]').files[0];
                if (!file) {
                    alert('请选择文件');
                    restoreButton();
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    let arr;
                    try {
                        arr = JSON.parse(e.target.result);
                    } catch (err) {
                        console.error('文件JSON解析失败:', err);
                        alert('JSON 格式错误: ' + err.message);
                        restoreButton();
                        return;
                    }
                    if (!Array.isArray(arr)) arr = [arr];
                    batchImportNotes(arr, type, tip, restoreButton);
                };
                reader.onerror = function(e) {
                    console.error('文件读取失败:', e);
                    alert('文件读取失败');
                    restoreButton();
                };
                reader.readAsText(file);
            }
        };
    }

    // 全量导入弹窗
    function showFullImportModal() {
        if (document.querySelector('.ctn-modal-mask')) {
            return;
        }
        // 遮罩
        const mask = document.createElement('div');
        mask.className = 'ctn-modal-mask';
        mask.style = 'position:fixed;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:99999;display:flex;align-items:center;justify-content:center;';
        // 弹窗
        const modal = document.createElement('div');
        modal.className = 'ctn-modal';
        modal.style = 'background:#fff;padding:32px 32px 24px 32px;border-radius:12px;min-width:480px;max-width:90vw;box-shadow:0 2px 16px rgba(0,0,0,0.15);position:relative;';
        // 关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style = 'position:absolute;right:18px;top:12px;font-size:28px;cursor:pointer;z-index:2;';
        closeBtn.title = '关闭';
        closeBtn.onclick = () => mask.remove();
        // 标题
        const title = document.createElement('div');
        title.style = 'font-size:20px;font-weight:bold;margin-bottom:18px;color:#9c27b0;';
        title.textContent = '全量从远程服务器导入';
        // 说明文字
        const description = document.createElement('div');
        description.style = 'margin-bottom:20px;color:#666;font-size:14px;line-height:1.5;';
        description.innerHTML = '此功能将从远程服务器获取所有笔记，并覆盖本地笔记。<br><strong style="color:#f56c6c;">注意：这将覆盖所有本地笔记，请谨慎操作！</strong>';
        // 选项区域
        const optionsDiv = document.createElement('div');
        optionsDiv.style = 'margin-bottom:20px;';
        
        // 覆盖模式选择
        const modeLabel = document.createElement('label');
        modeLabel.style = 'display:block;margin-bottom:8px;font-weight:bold;color:#333;';
        modeLabel.textContent = '导入模式：';
        
        const modeSelect = document.createElement('select');
        modeSelect.style = 'width:100%;padding:8px;border:1px solid #dcdfe6;border-radius:4px;font-size:14px;margin-bottom:12px;';
        modeSelect.innerHTML = `
            <option value="overwrite">完全覆盖（删除所有本地笔记，使用远程数据）</option>
            <option value="merge">智能合并（保留本地笔记，只添加远程新笔记）</option>
            <option value="backup">备份后覆盖（先备份本地笔记，再覆盖）</option>
        `;
        
        // 服务器选择
        const serverLabel = document.createElement('label');
        serverLabel.style = 'display:block;margin-bottom:8px;font-weight:bold;color:#333;';
        serverLabel.textContent = '远程服务器：';
        
        const serverSelect = document.createElement('select');
        serverSelect.style = 'width:100%;padding:8px;border:1px solid #dcdfe6;border-radius:4px;font-size:14px;margin-bottom:12px;';
        serverSelect.innerHTML = `
            <option value="default">默认服务器 (paste.tans.fun)</option>
            <option value="custom">自定义服务器</option>
        `;
        
        // 自定义服务器输入框
        const customServerDiv = document.createElement('div');
        customServerDiv.style = 'margin-bottom:12px;display:none;';
        const customServerInput = document.createElement('input');
        customServerInput.type = 'text';
        customServerInput.placeholder = '请输入服务器地址，如：https://your-server.com/api';
        customServerInput.style = 'width:100%;padding:8px;border:1px solid #dcdfe6;border-radius:4px;font-size:14px;box-sizing:border-box;';
        
        // 显示/隐藏自定义服务器输入框
        serverSelect.onchange = () => {
            customServerDiv.style.display = serverSelect.value === 'custom' ? 'block' : 'none';
        };
        
        customServerDiv.appendChild(customServerInput);
        
        optionsDiv.appendChild(modeLabel);
        optionsDiv.appendChild(modeSelect);
        optionsDiv.appendChild(serverLabel);
        optionsDiv.appendChild(serverSelect);
        optionsDiv.appendChild(customServerDiv);
        
        // 导入按钮
        const importBtn = document.createElement('button');
        importBtn.textContent = '开始全量导入';
        importBtn.style = 'margin-top:8px;padding:12px 32px;background:#9c27b0;color:#fff;border:none;border-radius:6px;font-size:16px;cursor:pointer;width:100%;';
        // 进度显示
        const progressDiv = document.createElement('div');
        progressDiv.style = 'margin-top:16px;display:none;';
        progressDiv.innerHTML = `
            <div style="margin-bottom:8px;font-weight:bold;color:#333;">导入进度：</div>
            <div style="background:#f5f5f5;border-radius:4px;height:20px;overflow:hidden;margin-bottom:8px;">
                <div class="progress-bar" style="background:#9c27b0;height:100%;width:0%;transition:width 0.3s;"></div>
            </div>
            <div class="progress-text" style="text-align:center;font-size:14px;color:#666;">准备中...</div>
        `;
        // 提示
        const tip = document.createElement('div');
        tip.style = 'margin-top:12px;color:#67c23a;font-size:15px;display:none;';
        tip.textContent = '导入成功！';
        // 组装
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(description);
        modal.appendChild(optionsDiv);
        modal.appendChild(importBtn);
        modal.appendChild(progressDiv);
        modal.appendChild(tip);
        mask.appendChild(modal);
        document.body.appendChild(mask);
        
        // 导入逻辑
        importBtn.onclick = async () => {
            const mode = modeSelect.value;
            const serverType = serverSelect.value;
            let serverUrl = 'https://paste.tans.fun/api';
            
            if (serverType === 'custom') {
                const customUrl = customServerInput.value.trim();
                if (!customUrl) {
                    alert('请输入自定义服务器地址');
                    return;
                }
                serverUrl = customUrl;
            }
            
            // 确认操作
            let confirmMessage = '';
            if (mode === 'overwrite') {
                confirmMessage = '确定要完全覆盖所有本地笔记吗？此操作不可恢复！';
            } else if (mode === 'backup') {
                confirmMessage = '确定要备份本地笔记后覆盖吗？';
            } else {
                confirmMessage = '确定要开始智能合并导入吗？';
            }
            
            if (!confirm(confirmMessage)) {
                return;
            }
            
            // 设置导入中状态
            importBtn.disabled = true;
            importBtn.textContent = '导入中...';
            importBtn.style.background = '#909399';
            importBtn.style.cursor = 'not-allowed';
            importBtn.style.opacity = '0.6';
            
            // 显示进度
            progressDiv.style.display = 'block';
            const progressBar = progressDiv.querySelector('.progress-bar');
            const progressText = progressDiv.querySelector('.progress-text');
            
            try {
                // 如果是备份模式，先导出
                if (mode === 'backup') {
                    progressText.textContent = '正在备份本地笔记...';
                    await backupLocalNotes();
                }
                
                // 开始全量导入
                progressText.textContent = '正在连接远程服务器...';
                progressBar.style.width = '10%';
                
                const result = await performFullImport(serverUrl, mode, (progress, text) => {
                    progressBar.style.width = progress + '%';
                    progressText.textContent = text;
                });
                
                // 显示结果
                tip.textContent = result.message;
                tip.style.color = result.success ? '#67c23a' : '#f56c6c';
                tip.style.display = '';
                
                if (result.success) {
                    // 导入成功后刷新按钮状态
                    setTimeout(() => {
                        insertCustomNoteButtons();
                    }, 100);
                }
                
            } catch (error) {
                console.error('全量导入失败:', error);
                tip.textContent = '导入失败：' + error.message;
                tip.style.color = '#f56c6c';
                tip.style.display = '';
            } finally {
                // 恢复按钮状态
                importBtn.disabled = false;
                importBtn.textContent = '开始全量导入';
                importBtn.style.background = '#9c27b0';
                importBtn.style.cursor = 'pointer';
                importBtn.style.opacity = '1';
                
                // 隐藏进度条
                setTimeout(() => {
                    progressDiv.style.display = 'none';
                }, 3000);
            }
        };
    }

    // 批量导入
    function batchImportNotes(arr, type, tip, callback) {

        // 先检查 IndexedDB 是否可用
        openDB().then(() => {
            return openDB();
        }).then(db => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            let count = 0;
            let importedKeys = [];
            let processedCount = 0;
            let errors = [];

            if (arr.length === 0) {
                tip.textContent = '没有找到可导入的数据';
                tip.style.display = '';
                setTimeout(() => { tip.style.display = 'none'; }, 3000);
                if (callback) callback();
                return;
            }

            arr.forEach((item, index) => {
                let key, content;
                if (type === 'codetop') {
                    const slug = item.leetcodeInfo && item.leetcodeInfo.slug_title;
                    if (!slug) {
                        processedCount++;
                        checkComplete();
                        return;
                    }
                    key = `https://leetcode.cn/problems/${slug}`;
                    content = item.content || '';
                } else {
                    key = item.key || '';
                    content = item.content || '';
                }
                if (key) { // 只要有key就尝试导入，即使content为空
                    const putRequest = store.put({
                        key,
                        content: content || '', // 确保content不为undefined
                        updated_at: Date.now(),
                        ...(item.leetcodeInfo ? { leetcodeInfo: item.leetcodeInfo } : {})
                    });
                    putRequest.onsuccess = () => {
                        importedKeys.push(key);
                        count++;
                        processedCount++;
                        checkComplete();
                    };
                    putRequest.onerror = (e) => {
                        errors.push(`${key}: ${e.message || e}`);
                        processedCount++;
                        checkComplete();
                    };
                } else {
                    processedCount++;
                    checkComplete();
                }
            });

            function checkComplete() {
                if (processedCount === arr.length) {
                    let message = `导入完成！成功导入 ${count} 条，跳过 ${arr.length - count} 条。`;
                    if (errors.length > 0) {
                        message += `\n错误 ${errors.length} 条`;
                    }
                    tip.textContent = message;
                    tip.style.color = count > 0 ? '#67c23a' : '#f56c6c';
                    tip.style.display = '';
                    tip.style.whiteSpace = 'pre-line'; // 支持换行显示
                    setTimeout(() => { tip.style.display = 'none'; }, 4000);
                    // 导入完成后刷新按钮状态
                    setTimeout(() => {
                        insertCustomNoteButtons();
                    }, 100);
                    if (callback) callback();
                }
            }

            tx.onerror = (e) => {
                console.error('事务失败:', e);
                tip.textContent = '导入失败，请重试';
                tip.style.color = '#f56c6c';
                tip.style.display = '';
                setTimeout(() => { tip.style.display = 'none'; }, 3000);
                if (callback) callback();
            };
        }).catch(err => {
            console.error('打开数据库失败:', err);
            tip.textContent = '数据库错误，请重试';
            tip.style.color = '#f56c6c';
            tip.style.display = '';
            setTimeout(() => { tip.style.display = 'none'; }, 3000);
            if (callback) callback();
        });
    }

    // 导出所有笔记为 JSON 文件
    function exportAllNotes() {
        // 获取导出按钮并设置状态
        const exportBtn = document.querySelector('.ctn-export-notes-btn');
        const originalText = exportBtn ? exportBtn.textContent : '导出笔记';
        const originalStyle = exportBtn ? exportBtn.style.cssText : '';

        if (exportBtn) {
            exportBtn.textContent = '导出中...';
            exportBtn.disabled = true;
            exportBtn.style.background = '#909399'; // 灰色
            exportBtn.style.cursor = 'not-allowed';
            exportBtn.style.opacity = '0.6';
        }

        const restoreButton = () => {
            if (exportBtn) {
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
                exportBtn.style.cssText = originalStyle;
            }
        };

        openDB().then(db => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => {
                const data = req.result || [];
                if (data.length === 0) {
                    alert('没有笔记可以导出');
                    restoreButton();
                    return;
                }
                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const date = new Date().toISOString().slice(0, 10);
                a.href = url;
                a.download = `codetop_notes_${date}.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    restoreButton(); // 导出完成后恢复按钮
                }, 100);
            };
            req.onerror = (e) => {
                console.error('导出失败:', e);
                alert('导出失败，请重试');
                restoreButton();
            };
        }).catch(err => {
            console.error('打开数据库失败:', err);
            alert('数据库错误，无法导出');
            restoreButton();
        });
    }

    // 新增：key 哈希函数（SHA-256）
    async function hashKey(str) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('');
    }
    // 云端获取笔记（用哈希key，支持 updatedTime）
    async function fetchNoteFromCloud(key) {
        const hash = await hashKey(key);
        return fetch(`https://paste.tans.fun/api/note/${encodeURIComponent(hash)}`)
            .then(res => res.json())
            .then(json => {
                if (json.code === 0 && json.data && typeof json.data.value === 'string') {
                    let updated_at = 0;
                    if (json.data.updatedTime) {
                        // 处理云端时间：云端存储的是 +8 时区的时间戳，需要转换为 UTC
                        let timestamp = new Date(json.data.updatedTime).getTime();
                        if (!isNaN(timestamp)) {
                            // 减去8小时转换为 UTC 时间戳
                            timestamp = timestamp - (8 * 60 * 60 * 1000);
                        }
                        updated_at = isNaN(timestamp) ? Date.now() : timestamp;
                    }
                    return {
                        key: json.data.key,
                        content: json.data.value,
                        updated_at
                    };
                }
                return null;
            }).catch(() => null);
    }
    // 云端保存笔记（返回 updatedTime）
    async function saveNoteToCloud(key, value) {
        if (!key || typeof key !== 'string' || !key.trim()) {
            console.error('云同步失败：key 不合法', key);
            alert('云同步失败：key 不合法，已跳过该条笔记');
            return Promise.resolve(false);
        }
        const hash = await hashKey(key);
        return fetch('https://paste.tans.fun/api/note', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: hash, value, url: key})
        }).then(res => res.json())
          .then(json => {
              if (json.code === 0) {
                  if (json.data && json.data.updatedTime) {
                      // 处理云端返回时间：云端存储的是 +8 时区的时间戳，需要转换为 UTC
                      let serverTime = new Date(json.data.updatedTime).getTime();
                      if (!isNaN(serverTime)) {
                          // 减去8小时转换为 UTC 时间戳
                          serverTime = serverTime - (8 * 60 * 60 * 1000);
                      }
                      const finalTime = isNaN(serverTime) ? Date.now() : serverTime;
                      return finalTime;
                  }
                  // 没有 updatedTime，返回当前本地时间
                  return Date.now();
              }
              throw new Error(json.message || '云端保存失败');
          });
    }
    // 合并同步主逻辑（云端操作用哈希key）
    async function mergeSyncAllNotes() {
        // 获取同步按钮并设置为禁用状态
        const syncBtn = document.querySelector('.ctn-sync-notes-btn');
        const originalText = syncBtn ? syncBtn.textContent : '云同步';
        const originalStyle = syncBtn ? syncBtn.style.cssText : '';

        if (syncBtn) {
            syncBtn.textContent = '同步中...';
            syncBtn.disabled = true;
            syncBtn.style.background = '#909399'; // 灰色
            syncBtn.style.cursor = 'not-allowed';
            syncBtn.style.opacity = '0.6';
        }

        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);

            const localNotes = await new Promise((resolve, reject) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(new Error('读取本地笔记失败'));
            });

            if (localNotes.length === 0) {
                alert('本地没有笔记可同步');
                return;
            }

            let updatedCount = 0, uploadedCount = 0, skippedCount = 0;
            const totalNotes = localNotes.length;

            for (let i = 0; i < localNotes.length; i++) {
                const note = localNotes[i];
                const key = note.key;
                const localContent = note.content;
                const localUpdated = note.updated_at || 0;

                // 更新按钮显示进度
                if (syncBtn) {
                    syncBtn.textContent = `同步中... (${i + 1}/${totalNotes})`;
                }

                // key 校验和调试输出
                if (!key || typeof key !== 'string' || !key.trim()) {
                    skippedCount++;
                    continue;
                }

                // 拉取云端（用哈希key）
                const cloudNote = await fetchNoteFromCloud(key);
                let cloudUpdated = 0;
                if (cloudNote && typeof cloudNote.updated_at === 'number') {
                    cloudUpdated = cloudNote.updated_at;
                }

                // 详细日志输出：本地和云端更新时间（已转换为UTC）

                if (!cloudNote || !cloudNote.content) {
                    // 云端无内容，上传本地
                    const serverTime = await saveNoteToCloud(key, localContent);
                    if (serverTime) {
                        await saveNote(key, localContent, serverTime); // 用云端时间更新本地
                    }
                    uploadedCount++;
                } else {
                    // 比较时间戳（添加容错机制：如果时间差小于1分钟则认为相同）
                    const timeDiff = Math.abs(cloudUpdated - localUpdated);
                    const isTimeSimilar = timeDiff < 60000; // 1分钟内认为相同

                    if (isTimeSimilar) {
                        skippedCount++;
                    } else if (localUpdated > cloudUpdated) {
                        // 本地较新，上传
                        const serverTime = await saveNoteToCloud(key, localContent);
                        if (serverTime) {
                            await saveNote(key, localContent, serverTime); // 用云端时间更新本地
                        }
                        uploadedCount++;
                    } else if (cloudUpdated > localUpdated) {
                        // 云端较新，写回本地
                        await saveNote(key, cloudNote.content, cloudNote.updated_at);
                        updatedCount++;
                    } else {
                        // 一致，跳过
                        skippedCount++;
                    }
                }
            }

            alert(`云同步完成！上传${uploadedCount}条，下载${updatedCount}条，跳过${skippedCount}条。`);

        } catch (error) {
            console.error('云同步失败:', error);
            alert('云同步失败：' + error.message);
        } finally {
            // 恢复按钮状态
            if (syncBtn) {
                syncBtn.textContent = originalText;
                syncBtn.disabled = false;
                syncBtn.style.cssText = originalStyle;
            }
        }
    }

    // 备份本地笔记
    async function backupLocalNotes() {
        try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            
            const localNotes = await new Promise((resolve, reject) => {
                const req = store.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => reject(new Error('读取本地笔记失败'));
            });
            
            if (localNotes.length > 0) {
                const json = JSON.stringify(localNotes, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                a.href = url;
                a.download = `codetop_notes_backup_${date}.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            }
        } catch (error) {
            console.error('备份失败:', error);
            throw new Error('备份本地笔记失败');
        }
    }

    // 执行全量导入
    async function performFullImport(serverUrl, mode, progressCallback) {
        try {
            // 获取远程所有笔记的列表
            progressCallback(20, '正在获取远程笔记列表...');
            
            const notesList = await fetchRemoteNotesList(serverUrl);
            if (!notesList || notesList.length === 0) {
                return {
                    success: false,
                    message: '远程服务器没有找到笔记数据'
                };
            }
            
            progressCallback(40, `找到 ${notesList.length} 条远程笔记，正在下载...`);
            
            // 下载所有笔记内容
            const remoteNotes = [];
            let downloadSuccessCount = 0;
            let downloadFailedCount = 0;
            
            for (let i = 0; i < notesList.length; i++) {
                const noteInfo = notesList[i];
                const progress = 40 + Math.floor((i / notesList.length) * 30);
                progressCallback(progress, `正在下载第 ${i + 1}/${notesList.length} 条笔记... (成功: ${downloadSuccessCount}, 失败: ${downloadFailedCount})`);
                
                try {
                    const noteContent = await fetchRemoteNoteContent(serverUrl, noteInfo.key);
                    if (noteContent) {
                        remoteNotes.push({
                            key: noteInfo.key,
                            content: noteContent,
                            updated_at: noteInfo.updatedTime ? new Date(noteInfo.updatedTime).getTime() : Date.now()
                        });
                        downloadSuccessCount++;
                    } else {
                        downloadFailedCount++;
                    }
                } catch (error) {
                    console.warn(`下载笔记 ${noteInfo.key} 失败:`, error);
                    downloadFailedCount++;
                }
            }
            
            if (remoteNotes.length === 0) {
                return {
                    success: false,
                    message: '没有成功下载到任何笔记内容'
                };
            }
            
            progressCallback(80, '正在保存到本地数据库...');
            
            // 根据模式处理本地数据
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            
            let savedCount = 0;
            let skippedCount = 0;
            let overwrittenCount = 0;
            
            if (mode === 'overwrite' || mode === 'backup') {
                // 完全覆盖模式：清空本地数据
                await new Promise((resolve, reject) => {
                    const clearReq = store.clear();
                    clearReq.onsuccess = resolve;
                    clearReq.onerror = reject;
                });
                
                // 保存所有远程笔记
                for (let i = 0; i < remoteNotes.length; i++) {
                    const note = remoteNotes[i];
                    try {
                        await new Promise((resolve, reject) => {
                            const putReq = store.put({
                                key: note.key,
                                content: note.content,
                                updated_at: note.updated_at
                            });
                            putReq.onsuccess = () => {
                                savedCount++;
                                resolve();
                            };
                            putReq.onerror = reject;
                        });
                    } catch (error) {
                        console.warn(`保存笔记 ${note.key} 失败:`, error);
                    }
                    
                    const progress = 80 + Math.floor((i / remoteNotes.length) * 15);
                    progressCallback(progress, `正在保存第 ${i + 1}/${remoteNotes.length} 条笔记... (已保存: ${savedCount})`);
                }
            } else if (mode === 'merge') {
                // 智能合并模式：只添加新的或更新的笔记
                for (let i = 0; i < remoteNotes.length; i++) {
                    const note = remoteNotes[i];
                    try {
                        // 检查本地是否已存在该笔记
                        const existingNote = await new Promise((resolve, reject) => {
                            const getReq = store.get(note.key);
                            getReq.onsuccess = () => resolve(getReq.result);
                            getReq.onerror = reject;
                        });
                        
                        if (!existingNote) {
                            // 本地没有，直接添加
                            await new Promise((resolve, reject) => {
                                const putReq = store.put({
                                    key: note.key,
                                    content: note.content,
                                    updated_at: note.updated_at
                                });
                                putReq.onsuccess = () => {
                                    savedCount++;
                                    resolve();
                                };
                                putReq.onerror = reject;
                            });
                        } else {
                            // 本地存在，比较时间戳
                            const localTime = existingNote.updated_at || 0;
                            const remoteTime = note.updated_at || 0;
                            
                            if (remoteTime > localTime) {
                                // 远程较新，更新本地
                                await new Promise((resolve, reject) => {
                                    const putReq = store.put({
                                        key: note.key,
                                        content: note.content,
                                        updated_at: note.updated_at
                                    });
                                    putReq.onsuccess = () => {
                                        overwrittenCount++;
                                        resolve();
                                    };
                                    putReq.onerror = reject;
                                });
                            } else {
                                // 本地较新或相同，跳过
                                skippedCount++;
                            }
                        }
                    } catch (error) {
                        console.warn(`处理笔记 ${note.key} 失败:`, error);
                    }
                    
                    const progress = 80 + Math.floor((i / remoteNotes.length) * 15);
                    progressCallback(progress, `正在处理第 ${i + 1}/${remoteNotes.length} 条笔记... (新增: ${savedCount}, 更新: ${overwrittenCount}, 跳过: ${skippedCount})`);
                }
            }
            
            progressCallback(100, '导入完成！');
            
            // 根据模式返回不同的消息
            let message = '';
            if (mode === 'overwrite' || mode === 'backup') {
                message = `全量导入完成！成功导入 ${savedCount} 条笔记。`;
            } else if (mode === 'merge') {
                message = `智能合并完成！新增 ${savedCount} 条，更新 ${overwrittenCount} 条，跳过 ${skippedCount} 条。`;
            }
            
            return {
                success: true,
                message: message
            };
            
        } catch (error) {
            console.error('全量导入失败:', error);
            return {
                success: false,
                message: '导入失败：' + error.message
            };
        }
    }

    // 获取远程笔记列表 - 真正的全量获取
    async function fetchRemoteNotesList(serverUrl) {
        try {
            // 尝试多种方式获取远程笔记列表
            const methods = [
                () => fetchRemoteNotesFromAPI(serverUrl)
            ];
            
            for (const method of methods) {
                try {
                    const result = await method();
                    if (result && result.length > 0) {
                        console.log(`通过 ${method.name} 获取到 ${result.length} 条笔记`);
                        return result;
                    }
                } catch (error) {
                    console.warn(`方法 ${method.name} 失败:`, error);
                    continue;
                }
            }
            
            throw new Error('所有获取方法都失败了');
        } catch (error) {
            console.error('获取远程笔记列表失败:', error);
            throw new Error('无法获取远程笔记信息');
        }
    }

    // 方法1：从真正的全量接口获取所有笔记列表
    async function fetchRemoteNotesFromAPI(serverUrl) {
        try {
            // 使用真正的全量获取接口
            const response = await fetch(`${serverUrl}/note/`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.code === 0 && data.data && data.data.notes && Array.isArray(data.data.notes)) {
                // 根据API返回的数据结构处理
                return data.data.notes.map(note => ({
                    key: note.url || note.key, // 使用url作为key，如果没有则使用key
                    updatedTime: note.updatedTime || note.createdTime || Date.now()
                }));
            } else if (data.code === 0 && Array.isArray(data.data)) {
                // 兼容其他可能的数据结构
                return data.data.map(note => ({
                    key: note.url || note.key,
                    updatedTime: note.updatedTime || note.createdTime || Date.now()
                }));
            } else {
                throw new Error(data.message || 'API返回数据格式不正确');
            }
        } catch (error) {
            console.error('从全量接口获取笔记失败:', error);
            throw error;
        }
    }

    // 获取远程笔记内容
    async function fetchRemoteNoteContent(serverUrl, key) {
        try {
            // 使用现有的云同步逻辑
            const hash = await hashKey(key);
            const response = await fetch(`${serverUrl}/note/${encodeURIComponent(hash)}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    // 笔记不存在，返回null
                    return null;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data.code === 0 && data.data && typeof data.data.value === 'string') {
                return data.data.value;
            } else {
                throw new Error(data.message || '获取笔记内容失败');
            }
        } catch (error) {
            console.warn(`获取笔记 ${key} 内容失败:`, error);
            return null;
        }
    }

    // 页面加载后执行
    window.addEventListener('load', () => {
        setTimeout(init, 300); // 延迟，确保表格渲染
        setTimeout(insertExportButton, 1200); // 插入导出/导入按钮
    });
})();