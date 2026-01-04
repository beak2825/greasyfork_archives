// ==UserScript==
// @name         网页文本收集器
// @namespace    https://violentmonkey.github.io/
// @version      0.3
// @description  增强版文本收储器：支持编辑、添加、导出等功能
// @author       小烧猪
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523386/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523386/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 GM 存储实现跨域存储
    const storage = {
        save: function(key, value) {
            try {
                GM_setValue(key, value);
                return true;
            } catch (e) {
                console.error('存储失败:', e);
                return false;
            }
        },
        
        get: function(key, defaultValue = []) {
            try {
                const value = GM_getValue(key, defaultValue);
                return value || defaultValue;
            } catch (e) {
                console.error('读取失败:', e);
                return defaultValue;
            }
        }
    };

    // 添加更新笔记文本函数
    function updateNoteText(noteId, newText) {
        let notes = storage.get('notes', []);
        notes = notes.map(note => {
            if (note.id === noteId) {
                return { ...note, text: newText.trim() };
            }
            return note;
        });
        storage.save('notes', notes);
        updateNoteList();
        showToast('已更新笔记');
    }

    // 修改保存笔记函数
    function saveNote(text) {
        if (!text || text.trim() === '') {
            showToast('请输入内容！');
            return;
        }
        
        try {
            let notes = storage.get('notes', []);
            const newNote = {
                id: Date.now(),
                text: text.trim(),
                time: new Date().toLocaleString(),
                url: window.location.href,
                selected: false
            };
            
            notes.unshift(newNote);
            storage.save('notes', notes);
            
            const panel = document.getElementById('note-panel');
            if (panel) {
                panel.style.display = 'block';
                updateNoteList();
                showToast('已保存笔记！');
            }
        } catch (error) {
            console.error('保存笔记时出错:', error);
            showToast('保存失败，请重试！');
        }
    }

    // 修改删除笔记函数
    function deleteNote(noteId) {
        let notes = storage.get('notes', []);
        notes = notes.filter(note => note.id !== noteId);
        storage.save('notes', notes);
        updateNoteList();
        showToast('已删除笔记');
    }

    // 修改删除选中笔记函数
    function deleteSelectedNotes() {
        let notes = storage.get('notes', []);
        const selectedCount = notes.filter(note => note.selected).length;
        
        if (selectedCount === 0) {
            showToast('请先选择要删除的笔记');
            return;
        }
        
        notes = notes.filter(note => !note.selected);
        storage.save('notes', notes);
        updateNoteList();
        showToast(`已删除 ${selectedCount} 条笔记`);
    }

    // 修改切换选中状态函数
    function toggleNoteSelection(noteId) {
        let notes = storage.get('notes', []);
        notes = notes.map(note => {
            if (note.id === noteId) {
                return { ...note, selected: !note.selected };
            }
            return note;
        });
        storage.save('notes', notes);
        updateNoteList();
    }

    // 修改全选/取消全选函数
    function toggleSelectAll() {
        let notes = storage.get('notes', []);
        const allSelected = notes.length > 0 && notes.every(note => note.selected);
        
        notes = notes.map(note => ({
            ...note,
            selected: !allSelected
        }));
        
        storage.save('notes', notes);
        updateNoteList();
        showToast(allSelected ? '已取消全选' : '已全选');
    }

    // 修改搜索笔记函数
    function searchNotes(keyword) {
        const notes = storage.get('notes', []);
        const filtered = notes.filter(note => 
            note.text.toLowerCase().includes(keyword.toLowerCase())
        );
        renderNotes(filtered);
    }

    // 修改更新笔记列表函数
    function updateNoteList() {
        const noteList = document.getElementById('note-list');
        if (!noteList) return;
        
        const notes = storage.get('notes', []);
        renderNotes(notes);
    }

    // 创建浮动按钮
    function createFloatButton() {
        const btn = document.createElement('div');
        btn.innerHTML = '📝';
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(btn);
        return btn;
    }

    // 创建按钮的辅助函数
    function createButton(text) {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.style.cssText = `
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        `;
        return btn;
    }

    // 创建小按钮的辅助函数
    function createSmallButton(text) {
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.style.cssText = `
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        `;
        return btn;
    }

    // 创建面板
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'note-panel';
        panel.style.cssText = `
            position: fixed;
            right: 80px;
            bottom: 20px;
            width: 350px;
            max-height: 500px;
            background: white;
            border-radius: 12px;
            padding: 16px;
            display: none;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            overflow-y: auto;
        `;

        // 工具栏
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        `;

        // 添加按钮
        const addBtn = createButton('📝 新建');
        const exportBtn = createButton('📤 导出');
        const selectAllBtn = createButton('☑️ 全选');
        const deleteSelectedBtn = createButton('🗑️ 删除');
        
        addBtn.onclick = addNewNote;
        exportBtn.onclick = exportToMd;
        selectAllBtn.onclick = toggleSelectAll;
        deleteSelectedBtn.onclick = deleteSelectedNotes;
        
        deleteSelectedBtn.style.background = '#dc3545';

        toolbar.appendChild(addBtn);
        toolbar.appendChild(exportBtn);
        toolbar.appendChild(selectAllBtn);
        toolbar.appendChild(deleteSelectedBtn);

        // 搜索框
        const searchBox = document.createElement('input');
        searchBox.style.cssText = `
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 6px;
        `;
        searchBox.placeholder = '搜索笔记...';
        searchBox.oninput = (e) => searchNotes(e.target.value);

        // 笔记列表容器
        const noteList = document.createElement('div');
        noteList.id = 'note-list';

        panel.appendChild(toolbar);
        panel.appendChild(searchBox);
        panel.appendChild(noteList);
        document.body.appendChild(panel);

        return panel;
    }

    // 添加显示提示函数
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10001;
            pointer-events: none;
            animation: fadeIn 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }

    // 添加动画样式
    GM_addStyle(`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `);

    // 修改新建笔记功能
    function addNewNote() {
        const dialog = document.createElement('div');
        dialog.id = 'note-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10002;
            width: 400px;
        `;
        
        const textarea = document.createElement('textarea');
        textarea.style.cssText = `
            width: 100%;
            height: 100px;
            padding: 8px;
            margin: 8px 0;
            border: 1px solid #ddd;
            border-radius: 6px;
            resize: vertical;
        `;
        
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        `;
        
        const saveBtn = createButton('保存');
        const cancelBtn = createButton('取消');
        cancelBtn.style.background = '#666';
        
        // 修改保存按钮点击事件
        saveBtn.onclick = () => {
            const text = textarea.value;
            if (text.trim()) {
                saveNote(text);
                const dialogElement = document.getElementById('note-dialog');
                if (dialogElement) {
                    document.body.removeChild(dialogElement);
                }
            } else {
                showToast('请输入内容！');
            }
        };
        
        // 修改取消按钮点击事件
        cancelBtn.onclick = () => {
            const dialogElement = document.getElementById('note-dialog');
            if (dialogElement) {
                document.body.removeChild(dialogElement);
            }
        };
        
        // 添加按键事件支持
        textarea.onkeydown = (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                saveBtn.click();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelBtn.click();
            }
        };
        
        btnContainer.appendChild(cancelBtn);
        btnContainer.appendChild(saveBtn);
        
        dialog.appendChild(textarea);
        dialog.appendChild(btnContainer);
        document.body.appendChild(dialog);
        
        textarea.focus();
    }

    // 修改导出为Markdown功能
    function exportToMd() {
        const notes = storage.get('notes', []);
        const selectedNotes = notes.filter(note => note.selected);
        
        if (selectedNotes.length === 0) {
            showToast('请先选择要导出的笔记');
            return;
        }
        
        const markdown = selectedNotes.reverse().map(note => {
            return `## ${note.time}\n\n${note.text}\n\n[源链接](${note.url})\n\n---\n`;
        }).join('\n');
        
        const blob = new Blob([markdown], {type: 'text/markdown'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `笔记导出_${new Date().toLocaleDateString()}.md`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('导出成功！');
    }

    // 修改初始化函数
    function initialize() {
        const floatBtn = createFloatButton();
        const panel = createPanel();
        
        floatBtn.onclick = function() {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            if (isHidden) {
                updateNoteList();
            }
        };

        document.addEventListener('copy', handleCopy);
    }

    // 直接调用初始化
    initialize();

    // 修改渲染笔记函数，确保正确显示
    function renderNotes(notes) {
        const noteList = document.getElementById('note-list');
        if (!noteList) return;
        
        noteList.innerHTML = '';
        
        if (!notes || notes.length === 0) {
            noteList.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">暂无笔记</div>';
            return;
        }
        
        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.style.cssText = `
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 12px;
                margin: 8px 0;
                background: #fafafa;
            `;

            // 笔记内容区域
            const contentWrapper = document.createElement('div');
            contentWrapper.style.cssText = `
                display: flex;
                gap: 8px;
                align-items: start;
            `;

            // 复选框
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = note.selected;
            checkbox.style.marginTop = '3px';
            checkbox.onchange = () => toggleNoteSelection(note.id);

            // 可编辑的内容区域
            const content = document.createElement('div');
            content.textContent = note.text;
            content.style.cssText = `
                flex-grow: 1;
                margin: 8px 0;
                padding: 8px;
                min-height: 20px;
                border-radius: 4px;
            `;
            content.onclick = function() {
                content.contentEditable = true;
                content.focus();
            };
            content.onblur = function() {
                content.contentEditable = false;
                if (content.textContent !== note.text) {
                    updateNoteText(note.id, content.textContent);
                }
            };

            contentWrapper.appendChild(checkbox);
            contentWrapper.appendChild(content);

            // 按钮组
            const buttonGroup = document.createElement('div');
            buttonGroup.style.cssText = `
                display: flex;
                gap: 4px;
                margin-top: 8px;
                justify-content: flex-end;
            `;

            // 复制按钮
            const copyBtn = createSmallButton('📋 复制');
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(note.text);
                showToast('已复制到剪贴板');
            };

            // 保存按钮
            const saveBtn = createSmallButton('💾 保存');
            saveBtn.onclick = () => {
                updateNoteText(note.id, content.textContent);
                showToast('已保存更改');
            };

            // 删除按钮
            const deleteBtn = createSmallButton('🗑️ 删除');
            deleteBtn.style.background = '#dc3545';
            deleteBtn.onclick = () => deleteNote(note.id);

            buttonGroup.appendChild(copyBtn);
            buttonGroup.appendChild(saveBtn);
            buttonGroup.appendChild(deleteBtn);

            noteDiv.appendChild(contentWrapper);
            noteDiv.appendChild(buttonGroup);
            noteList.appendChild(noteDiv);
        });
    }

    // 修改复制事件处理函数
    function handleCopy(e) {
        setTimeout(() => {
            const selectedText = window.getSelection().toString();
            if (selectedText && selectedText.trim() !== '') {
                saveNote(selectedText);
            }
        }, 100);
    }
})(); 