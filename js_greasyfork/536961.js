// ==UserScript==
// @name         SIMPLE TEXT NOTE FOR COPY 浏览器浮窗记事本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  创建一个可编辑的浮窗记事本，支持拖拽和位置记忆
// @author       leifeng
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536961/SIMPLE%20TEXT%20NOTE%20FOR%20COPY%20%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B5%AE%E7%AA%97%E8%AE%B0%E4%BA%8B%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/536961/SIMPLE%20TEXT%20NOTE%20FOR%20COPY%20%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B5%AE%E7%AA%97%E8%AE%B0%E4%BA%8B%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const style = `
        .floating-notepad {
            position: fixed;
            bottom: -310px;
            right: 20px;
            width: 300px;
            background-color: #e9f7e8;
            border-radius: 8px 8px 0 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }

        .floating-notepad.collapsed {
            bottom: -330px;
        }

        .notepad-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 15px;
            background-color: #4a6cf7;
            color: white;
            border-radius: 8px 8px 0 0;
            user-select: none;
            cursor: move;
            height: 30px;
        }

        .notepad-header.over-limit {
            background-color: #dc3545;
        }

        .notepad-title {
            font-weight: 600;
            font-size: 15px;
        }

        .notepad-control-buttons {
            display: flex;
            align-items: center;
        }

        .notepad-toggle-btn, .notepad-center-btn, .notepad-hide-btn {
            font-size: 18px;
            cursor: pointer;
            padding: 0 10px; /* 增加按钮之间的间距 */
            transition: transform 0.2s ease;
        }

        .notepad-toggle-btn:hover, .notepad-center-btn:hover, .notepad-hide-btn:hover {
            transform: scale(1.2);
        }

        .notepad-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 5px;
            padding: 8px 15px;
            border-top: 1px solid #e0e0e0;
        }

        .notepad-count {
            font-size: 12px;
            color: #6c757d;
        }

        .notepad-clear-all {
            font-size: 12px;
            color: #dc3545;
            cursor: pointer;
            text-decoration: underline;
            transition: color 0.2s ease;
        }

        .notepad-clear-all:hover {
            color: #c82333;
        }

        .notepad-content {
            padding: 15px;
            max-height: 350px;
            display: flex;
            flex-direction: column;
        }

        .notepad-list {
            flex: 1;
            margin-bottom: 10px;
            max-height: 250px;
            overflow-y: auto;
            padding-right: 5px;
        }

        .notepad-item {
            padding: 8px 10px;
            margin-bottom: 8px;
            background-color: #ffffff;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.4;
            min-height: 40px;
            transition: all 0.2s ease;
        }

        .notepad-item:hover {
            background-color: #f1f3f5;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .notepad-item-empty {
            border: 1px dashed #ced4da;
            background-color: transparent;
            display: flex;
            align-items: center;
            color: #6c757d;
            font-size: 13px;
        }

        .notepad-item-empty:hover {
            border-color: #4a6cf7;
            color: #4a6cf7;
        }

        .notepad-item-text {
            padding: 0;
            color: #333333;
        }

        .notepad-item-char-count {
            font-size: 11px;
            color: #6c757d;
            margin-top: 3px;
            text-align: right;
        }

        .notepad-item-edit-area {
            width: 100%;
            padding: 5px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            resize: none;
            margin-bottom: 3px;
            box-sizing: border-box;
            min-height: 40px;
            background-color: white;
            color: #333333;
            transition: all 0.2s ease;
        }

        .notepad-item-edit-area.expanded {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: calc(100% - 40px);
            max-width: 500px;
            height: calc(100% - 100px);
            max-height: 400px;
            z-index: 10000;
            font-size: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
    `;

    // 添加样式
    GM_addStyle(style);

    // 存储键名
    const STORAGE_KEY = 'floating_notepad_items';
    const MAX_CHAR_COUNT = 500;
    const DEFAULT_TITLE = '浮窗记事本';

    // 创建记事本元素
    function createNotepad() {
        const container = document.createElement('div');
        container.className = 'floating-notepad';

        // 头部
        const header = document.createElement('div');
        header.className = 'notepad-header';

        const title = document.createElement('div');
        title.className = 'notepad-title';
        title.textContent = DEFAULT_TITLE;

        // 控制按钮容器
        const controlButtons = document.createElement('div');
        controlButtons.className = 'notepad-control-buttons';

        const centerBtn = document.createElement('div');
        centerBtn.className = 'notepad-center-btn';
        centerBtn.innerHTML = '⮙';
        centerBtn.addEventListener('click', centerNotepad);

        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'notepad-toggle-btn';
        toggleBtn.innerHTML = '⮛';
        toggleBtn.addEventListener('click', toggleNotepad);

        const hideBtn = document.createElement('div');
        hideBtn.className = 'notepad-hide-btn';
        hideBtn.innerHTML = '✕';
        hideBtn.addEventListener('click', hideNotepad);

        controlButtons.appendChild(centerBtn); // 先添加 ⮙ 按钮
        controlButtons.appendChild(toggleBtn); // 再添加 ⮛ 按钮
        controlButtons.appendChild(hideBtn);   // 最后添加 ✕ 按钮

        header.appendChild(title);
        header.appendChild(controlButtons);

        // 内容区域
        const content = document.createElement('div');
        content.className = 'notepad-content';

        // 列表区域
        const listContainer = document.createElement('div');
        listContainer.className = 'notepad-list';

        // 底部区域
        const footer = document.createElement('div');
        footer.className = 'notepad-footer';

        const countIndicator = document.createElement('div');
        countIndicator.className = 'notepad-count';
        updateCountIndicator();

        const clearAllBtn = document.createElement('div');
        clearAllBtn.className = 'notepad-clear-all';
        clearAllBtn.textContent = '清除所有';
        clearAllBtn.addEventListener('click', clearAllNotes);

        footer.appendChild(countIndicator);
        footer.appendChild(clearAllBtn);

        content.appendChild(listContainer);
        content.appendChild(footer);

        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);

        // 状态管理
        let isDragging = false;
        let initialDragPosition = { x: 0, y: 0 };
        let initialElementPosition = { bottom: 0, right: 20 };
        let expandedItemId = null;
        let currentEditingId = null;

        // 加载已保存的笔记
        loadNotes();

        // 窗口拖动功能
        header.addEventListener('mousedown', startDrag);

        // 点击外部关闭展开的编辑框
        document.addEventListener('click', (e) => {
            if (expandedItemId && !e.target.closest('.notepad-item-edit-area.expanded')) {
                collapseAllEditors();
            }
        });

        // ESC 键关闭展开的编辑框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && expandedItemId) {
                collapseAllEditors();
            }
        });

        // 鼠标事件处理
        function startDrag(e) {
            if (e.target.closest('.notepad-control-buttons')) return;

            e.preventDefault();
            isDragging = true;

            const rect = container.getBoundingClientRect();
            initialDragPosition = { x: e.clientX, y: e.clientY };

            const computedStyle = getComputedStyle(container);
            initialElementPosition = {
                bottom: parseInt(computedStyle.bottom) || 0,
                right: parseInt(computedStyle.right) || 20
            };

            container.style.zIndex = "10000";

            // 拖拽时隐藏编辑框
            if (currentEditingId) {
                saveCurrentEdit();
                collapseAllEditors();
            }
        }

        function handleDrag(e) {
            if (!isDragging) return;

            e.preventDefault();

            const dx = e.clientX - initialDragPosition.x;
            const dy = e.clientY - initialDragPosition.y;

            container.classList.remove('top-position', 'collapsed');

            // 计算新位置
            let newBottom = initialElementPosition.bottom - dy;
            let newRight = initialElementPosition.right + dx;

            // 边界限制
            const minBottom = -container.offsetHeight + header.offsetHeight;
            const maxBottom = window.innerHeight - header.offsetHeight;
            const minRight = 0;
            const maxRight = window.innerWidth - container.offsetWidth;

            newBottom = Math.max(minBottom, Math.min(maxBottom, newBottom));
            newRight = Math.max(minRight, Math.min(maxRight, newRight));

            // 更新位置
            container.style.bottom = `${newBottom}px`;
            container.style.right = `${newRight}px`;
            container.style.top = 'auto';
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            container.style.zIndex = "9999";
        }

        // 笔记管理功能
        function loadNotes() {
            let items = getSavedItems();

            if (items.length === 0) {
                items = Array.from({ length: 10 }, (_, i) => ({
                    id: Date.now() + i,
                    text: '',
                    timestamp: new Date().toISOString()
                }));
                saveItems(items);
            }

            renderNotes(items);
        }

        function renderNotes(items) {
            listContainer.innerHTML = '';

            items.forEach(item => {
                const noteEl = document.createElement('div');
                noteEl.className = item.text ? 'notepad-item' : 'notepad-item notepad-item-empty';
                noteEl.dataset.id = item.id;

                // 查看模式
                const viewMode = document.createElement('div');
                viewMode.className = 'notepad-item-view-mode';

                const textEl = document.createElement('div');
                textEl.className = 'notepad-item-text';
                textEl.textContent = item.text || '点击编辑...';

                const charCountEl = document.createElement('div');
                charCountEl.className = 'notepad-item-char-count';
                charCountEl.textContent = item.text ? `${item.text.length}/${MAX_CHAR_COUNT}` : `0/${MAX_CHAR_COUNT}`;

                viewMode.appendChild(textEl);
                viewMode.appendChild(charCountEl);

                // 编辑模式
                const editMode = document.createElement('div');
                editMode.className = 'notepad-item-edit-mode';
                editMode.style.display = 'none';

                const editArea = document.createElement('textarea');
                editArea.className = 'notepad-item-edit-area';
                editArea.value = item.text;
                editArea.maxLength = MAX_CHAR_COUNT;

                const editCharCountEl = document.createElement('div');
                editCharCountEl.className = 'notepad-item-char-count';
                editCharCountEl.textContent = `${item.text.length}/${MAX_CHAR_COUNT}`;

                editMode.appendChild(editArea);
                editMode.appendChild(editCharCountEl);

                // 添加到笔记元素
                noteEl.appendChild(viewMode);
                noteEl.appendChild(editMode);

                // 点击进入编辑模式
                noteEl.addEventListener('click', (e) => {
                    if (e.target.closest('.notepad-item-edit-area')) return;

                    if (container.classList.contains('collapsed')) {
                        toggleNotepad();
                    }

                    currentEditingId = item.id;
                    switchToEditMode(noteEl, item);

                    setTimeout(() => {
                        expandEditor(editArea, item.id);
                        checkCharCount(editArea);
                    }, 10);
                });

                // 编辑区域事件
                editArea.addEventListener('input', () => {
                    const length = editArea.value.length;
                    editCharCountEl.textContent = `${length}/${MAX_CHAR_COUNT}`;
                    checkCharCount(editArea);
                });

                editArea.addEventListener('paste', () => {
                    setTimeout(() => {
                        const length = editArea.value.length;
                        editCharCountEl.textContent = `${length}/${MAX_CHAR_COUNT}`;
                        checkCharCount(editArea);
                    }, 10);
                });

                editArea.addEventListener('blur', () => {
                    saveEditedNote(item.id, editArea.value);
                    collapseAllEditors();
                    resetHeader();
                    currentEditingId = null;
                });

                editArea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        if (e.shiftKey) {
                            e.preventDefault();
                            editArea.blur();
                        }
                    }
                });

                listContainer.appendChild(noteEl);
            });

            updateCountIndicator(items.length);
        }

        function switchToEditMode(noteEl, item) {
            document.querySelectorAll('.notepad-item-edit-mode').forEach(el => {
                if (el.parentElement.dataset.id !== item.id) {
                    el.style.display = 'none';
                    el.parentElement.querySelector('.notepad-item-view-mode').style.display = 'block';
                    if (!el.parentElement.querySelector('.notepad-item-text').textContent.trim()) {
                        el.parentElement.classList.add('notepad-item-empty');
                    }
                }
            });

            const viewMode = noteEl.querySelector('.notepad-item-view-mode');
            const editMode = noteEl.querySelector('.notepad-item-edit-mode');

            noteEl.classList.remove('notepad-item-empty');
            viewMode.style.display = 'none';
            editMode.style.display = 'block';
            editMode.querySelector('.notepad-item-edit-area').focus();
        }

        function expandEditor(editArea, itemId) {
            collapseAllEditors();
            editArea.classList.add('expanded');
            expandedItemId = itemId;

            const cursorPos = editArea.selectionStart;
            setTimeout(() => {
                editArea.focus();
                editArea.setSelectionRange(cursorPos, cursorPos);
            }, 10);
        }

        function collapseAllEditors() {
            document.querySelectorAll('.notepad-item-edit-area.expanded').forEach(el => {
                el.classList.remove('expanded');
            });
            expandedItemId = null;
        }

        function saveEditedNote(id, newText) {
            newText = newText.trim();

            const items = getSavedItems();
            const itemIndex = items.findIndex(item => item.id === id);

            if (itemIndex !== -1) {
                items[itemIndex].text = newText.substring(0, MAX_CHAR_COUNT);
                items[itemIndex].timestamp = new Date().toISOString();
                saveItems(items);
                renderNotes(items);
            }

            resetHeader();
        }

        function saveCurrentEdit() {
            if (!currentEditingId) return;

            const editArea = document.querySelector(`.notepad-item[data-id="${currentEditingId}"] .notepad-item-edit-area`);
            if (editArea) {
                saveEditedNote(currentEditingId, editArea.value);
            }
        }

        function checkCharCount(editArea) {
            const length = editArea.value.length;

            if (length >= MAX_CHAR_COUNT) {
                title.textContent = '字符数达限制';
                header.classList.add('over-limit');
            } else {
                title.textContent = DEFAULT_TITLE;
                header.classList.remove('over-limit');
            }
        }

        function resetHeader() {
            title.textContent = DEFAULT_TITLE;
            header.classList.remove('over-limit');
        }

        function clearAllNotes() {
            if (confirm('确定要清除所有笔记吗？')) {
                const emptyItems = Array.from({ length: 10 }, (_, i) => ({
                    id: Date.now() + i,
                    text: '',
                    timestamp: new Date().toISOString()
                }));
                saveItems(emptyItems);
                renderNotes(emptyItems);
            }
        }

        function getSavedItems() {
            try {
                const saved = sessionStorage.getItem(STORAGE_KEY);
                return saved ? JSON.parse(saved) : [];
            } catch (e) {
                console.error('Failed to load notes:', e);
                return [];
            }
        }

        function saveItems(items) {
            try {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.error('Failed to save notes:', e);
            }
        }

        function updateCountIndicator(count = 0) {
            countIndicator.textContent = `共 ${count} 条笔记`;
        }

        function toggleNotepad() {
            container.classList.toggle('collapsed');

            if (container.classList.contains('collapsed')) {
                container.style.bottom = '-330px';
                container.style.top = 'auto';
            } else {
                container.style.bottom = '-310px';
                container.style.top = 'auto';
            }
        }

        function centerNotepad() {
            const windowHeight = window.innerHeight;
            const notepadHeight = container.offsetHeight;
            const centerPosition = (windowHeight - notepadHeight) / 2;

            container.classList.remove('top-position', 'collapsed');
            container.style.top = `${centerPosition}px`;
            container.style.bottom = 'auto';
        }

        function hideNotepad() {
            const windowHeight = window.innerHeight;
            const initialBottom = -310;

            container.classList.remove('top-position', 'collapsed');
            container.style.bottom = `${initialBottom - windowHeight}px`;
            container.style.top = 'auto';
        }

        // 添加鼠标事件监听
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('mouseleave', stopDrag);
    }

    // 初始化记事本
    createNotepad();
})();