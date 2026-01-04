// ==UserScript==
// @name         e621/danbooru tag extractor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  copy tags from e621
// @author       NorthPolarise
// @include      https://e621.net/posts/*
// @include      https://danbooru.donmai.us/posts/*
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/520979/e621danbooru%20tag%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/520979/e621danbooru%20tag%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
        .copy-button {
            background-color: #2e51a2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .copy-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .copy-button:active {
            transform: translateY(0);
        }

        .copy-button::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: -100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
        }

        .copy-button.clicked::after {
            left: 100%;
        }

        .success-animation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 20px;
            height: 20px;
            background-color: #4CAF50;
            border-radius: 50%;
            opacity: 0;
        }

        .copy-button.success .success-animation {
            animation: successPop 0.5s ease-out forwards;
        }

        @keyframes successPop {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.2);
                opacity: 0.5;
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0;
            }
        }
        .tag-row {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            position: relative;
            z-index: 1;
        }

        .tag-row:hover {
            transform: translateX(5px);
            box-shadow: -2px 2px 5px rgba(0,0,0,0.2);
        }

        .tag-row.dragging {
            opacity: 0.5;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10;
        }

        .tag-row.drag-over {
            transform: translateY(40px);
        }

        .tag-row.drag-over-up {
            transform: translateY(-40px);
        }

        .placeholder {
            height: 40px;
            background-color: rgba(46, 81, 162, 0.2);
            border: 2px dashed #2e51a2;
            border-radius: 3px;
            margin: 5px 0;
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    createInterface();

    // 加载保存的选择状态和顺序
    function loadSavedState(tagList) {
        const savedOrder = JSON.parse(localStorage.getItem('tagOrder') || '[]');
        const savedChecked = JSON.parse(localStorage.getItem('tagChecked') || '{}');

        if (savedOrder.length > 0) {
            // 按保存的顺序重新排列标签
            savedOrder.forEach(tagName => {
                const tagRow = Array.from(tagList.children).find(row =>
                                                                 row.querySelector('span').textContent === tagName
                                                                );
                if (tagRow) {
                    tagList.appendChild(tagRow);
                }
            });
        }

        // 恢复选中状态
        Array.from(tagList.children).forEach(tagRow => {
            const label = tagRow.querySelector('span').textContent;
            const checkbox = tagRow.querySelector('input');
            if (savedChecked[label] !== undefined) {
                checkbox.checked = savedChecked[label];
            }
        });
    }

    // 保存当前状态
    function saveCurrentState(tagList) {
        const currentOrder = Array.from(tagList.children).map(row =>
                                                              row.querySelector('span').textContent
                                                             );
        const currentChecked = {};
        Array.from(tagList.children).forEach(row => {
            const label = row.querySelector('span').textContent;
            currentChecked[label] = row.querySelector('input').checked;
        });

        localStorage.setItem('tagOrder', JSON.stringify(currentOrder));
        localStorage.setItem('tagChecked', JSON.stringify(currentChecked));
    }

    function createInterface() {
        // 创建主容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '10px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#284a81';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 创建头部（始终可见的部分）
        const header = document.createElement('div');
        header.style.padding = '10px';
        header.style.borderBottom = '1px solid #2e51a2';
        header.style.display = 'flex';
        header.style.gap = '10px';
        header.style.alignItems = 'center';

        // 创建展开/收起按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '展开';
        toggleButton.className = 'copy-button';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.backgroundColor = '#2e51a2';
        toggleButton.style.color = 'white';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '3px';
        toggleButton.style.cursor = 'pointer';

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制标签';
        copyButton.className = 'copy-button';
        copyButton.style.padding = '5px 10px';
        copyButton.style.backgroundColor = '#2e51a2';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';

        // 创建标签列表容器
        const content = document.createElement('div');
        content.style.display = 'none';
        content.style.padding = '10px';

        const tagList = document.createElement('div');
        tagList.style.display = 'flex';
        tagList.style.flexDirection = 'column';
        tagList.style.gap = '5px';

        const tagTypes = [
            { id: 'general', name: '一般标签 (General)', class: 'tag-type-0' },
            { id: 'artist', name: '艺术家标签 (Artist)', class: 'tag-type-1' },
            { id: 'character', name: '角色标签 (Character)', class: 'tag-type-4' },
            { id: 'species', name: '物种标签 (Species)', class: 'tag-type-5' },
            { id: 'copyright', name: '版权标签 (Copyright)', class: 'tag-type-3' },
            { id: 'meta', name: '元标签 (Meta)', class: 'tag-type-7' }
        ];

        tagTypes.forEach((type, index) => {
            const tagRow = document.createElement('div');
            tagRow.className = 'tag-row';
            tagRow.draggable = true;
            tagRow.style.display = 'flex';
            tagRow.style.alignItems = 'center';
            tagRow.style.padding = '5px';
            tagRow.style.backgroundColor = '#1d3b8f';
            tagRow.style.borderRadius = '3px';
            tagRow.style.cursor = 'move';
            tagRow.dataset.class = type.class;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '10px';
            // 添加 change 事件监听器
            checkbox.addEventListener('change', () => {
                saveCurrentState(tagList);
            });


            const label = document.createElement('span');
            label.textContent = type.name;
            label.style.color = 'white';
            label.style.flex = '1';

            tagRow.appendChild(checkbox);
            tagRow.appendChild(label);
            tagList.appendChild(tagRow);

            // 添加拖拽事件
            tagRow.addEventListener('dragstart', handleDragStart);
            tagRow.addEventListener('dragover', handleDragOver);
            tagRow.addEventListener('dragend', handleDragEnd)
            tagRow.addEventListener('drop', handleDrop);
            tagRow.addEventListener('dragenter', (e) => e.preventDefault());
        });

        // 事件处理
        toggleButton.addEventListener('click', function() {
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            toggleButton.textContent = isHidden ? '收起' : '展开';
        });

        copyButton.addEventListener('click', function() {
            extractTags();
            copyButton.style.backgroundColor = '#1d3b8f';
            setTimeout(() => {
                copyButton.style.backgroundColor = '#2e51a2';
            }, 200);
        });

        // 加载保存的状态
        loadSavedState(tagList);

        // 组装界面
        header.appendChild(toggleButton);
        header.appendChild(copyButton);
        content.appendChild(tagList);
        container.appendChild(header);
        container.appendChild(content);
        document.body.appendChild(container);
    }

    let dragSrcElement = null;
    let placeholder = null;

    function createPlaceholder() {
        const div = document.createElement('div');
        div.className = 'placeholder';
        return div;
    }

    function handleDragStart(e) {
        dragSrcElement = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);

        // 创建占位符
        placeholder = createPlaceholder();

        // 添加拖动样式
        this.classList.add('dragging');

        // 延迟添加占位符，使动画更流畅
        requestAnimationFrame(() => {
            this.parentNode.insertBefore(placeholder, this);
            this.style.display = 'none';
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const tagRow = this;
        if (tagRow === dragSrcElement || tagRow === placeholder) {
            return;
        }

        // 获取鼠标在元素上的相对位置
        const rect = tagRow.getBoundingClientRect();
        const midpoint = rect.top + (rect.height / 2);
        const moveUp = e.clientY < midpoint;

        // 移除所有其他元素的过渡类
        document.querySelectorAll('.tag-row').forEach(row => {
            row.classList.remove('drag-over', 'drag-over-up');
        });

        // 移动占位符
        if (placeholder) {
            if (moveUp) {
                tagRow.parentNode.insertBefore(placeholder, tagRow);
            } else {
                tagRow.parentNode.insertBefore(placeholder, tagRow.nextSibling);
            }
        }

        return false;
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        this.style.display = '';

        // 移除所有过渡类
        document.querySelectorAll('.tag-row').forEach(row => {
            row.classList.remove('drag-over', 'drag-over-up');
        });

        // 移除占位符
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.insertBefore(this, placeholder);
            placeholder.remove();
        }

        placeholder = null;
        dragSrcElement = null;
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        if (dragSrcElement !== this) {
            // 位置已经由 dragover 事件处理，这里只需确保元素可见
            dragSrcElement.style.display = '';
        }

        // 保存当前状态
    const tagList = this.parentNode;

    saveCurrentState(tagList);

    return false;
    }

    // 修改复制函数
    function extractTags() {
    let allTags = [];

    // 修改选择器以获取正确的标签文本
    const tagClasses = {
        'general': '.general-tag-list .tag-list-item .tag-list-search span:first-child',
        'artist': '.artist-tag-list .tag-list-item .tag-list-search span:first-child',
        'character': '.character-tag-list .tag-list-item .tag-list-search span:first-child',
        'species': '.species-tag-list .tag-list-item .tag-list-search span:first-child',
        'copyright': '.copyright-tag-list .tag-list-item .tag-list-search span:first-child',
        'meta': '.meta-tag-list .tag-list-item .tag-list-search span:first-child'
    };

    const tagRows = document.querySelectorAll('.tag-row');
    console.log('找到的标签行数：', tagRows.length);

    tagRows.forEach(row => {
        const checkbox = row.querySelector('input');
        const label = row.querySelector('span').textContent;
        console.log(`标签类型: ${label}, 是否选中: ${checkbox.checked}`);

        if (checkbox.checked) {
            let type = '';
            if (label.includes('一般标签')) type = 'general';
            else if (label.includes('艺术家标签')) type = 'artist';
            else if (label.includes('角色标签')) type = 'character';
            else if (label.includes('物种标签')) type = 'species';
            else if (label.includes('版权标签')) type = 'copyright';
            else if (label.includes('元标签')) type = 'meta';

            if (type && tagClasses[type]) {
                console.log(`正在查找选择器: ${tagClasses[type]}`);
                const elements = document.querySelectorAll(tagClasses[type]);
                console.log(`找到 ${elements.length} 个标签元素`);

                const tags = Array.from(elements)
                    .map(tag => {
                        // 确保只获取标签名称，不包括计数
                        const text = tag.textContent.trim();
                        console.log(`找到标签: ${text}`);
                        return text;
                    })
                    .filter(tag => tag && !tag.match(/^\d+$/)) // 过滤掉纯数字
                    .sort();

                console.log(`处理后的标签: ${tags.join(', ')}`);
                allTags = allTags.concat(tags);
            }
        }
    });

    console.log('最终收集到的所有标签:', allTags);

    if (allTags.length === 0) {
        alert('请至少选择一个标签类型！');
        return;
    }

    const tagsText = allTags.join(',') + ',';
    navigator.clipboard.writeText(tagsText).then(() => {
        const copyButton = document.querySelector('#copy-button');
        if (copyButton) {
            copyButton.classList.add('clicked');
            copyButton.classList.add('success');
            const successAnim = document.createElement('div');
            successAnim.className = 'success-animation';
            copyButton.appendChild(successAnim);
            setTimeout(() => {
                copyButton.classList.remove('clicked');
                copyButton.classList.remove('success');
                if (successAnim.parentNode === copyButton) {
                    copyButton.removeChild(successAnim);
                }
            }, 1000);
        }
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制：\n' + tagsText);
    });
}

    // 创建按钮
    function createCopyButton() {
        const button = document.createElement('button');
        button.id = 'copy-button';
        button.className = 'copy-button';
        button.textContent = '复制标签';
        button.onclick = extractTags;
        return button;
    }
})();