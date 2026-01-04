// ==UserScript==
// @name         自定义词条存储
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  添加浮动按钮和文本编辑界面，支持词条分类、复制
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502118/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%8D%E6%9D%A1%E5%AD%98%E5%82%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/502118/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AF%8D%E6%9D%A1%E5%AD%98%E5%82%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #floatingButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #007bff;
            color: white;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            z-index: 9999;
            font-size: 24px;
        }
        #textEditor {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            height: 500px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            overflow-y: auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .entry, .category {
            margin-bottom: 10px;
            padding: 5px;
            border: 1px solid #ddd;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .entry-text, .category-name {
            cursor: pointer;
            flex-grow: 1;
            margin-right: 10px;
        }
        .entry button, .category button {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-left: 5px;
        }
        #newEntry, #newCategory {
            width: 60%;
            padding: 5px;
            margin-right: 5px;
        }
        #addEntry, #addCategory {
            width: 20%;
            padding: 5px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .category-content {
            margin-left: 20px;
            display: none;
        }
        .toggle-category {
            background-color: #17a2b8 !important;
        }
    `;
    document.head.appendChild(style);

    // 创建浮动按钮
    const button = document.createElement('div');
    button.id = 'floatingButton';
    button.textContent = '+';
    document.body.appendChild(button);

    // 创建文本编辑界面
    const editor = document.createElement('div');
    editor.id = 'textEditor';
    editor.innerHTML = `
        <h2>文本存储库</h2>
        <div>
            <input type="text" id="newCategory" placeholder="新分类">
            <button id="addCategory">添加分类</button>
        </div>
        <div id="categoryList"></div>
    `;
    document.body.appendChild(editor);

    // 获取存储的分类和词条
    let categories = GM_getValue('categories', {});

    // 显示分类和词条列表
    function displayCategories() {
        const categoryList = document.getElementById('categoryList');
        categoryList.innerHTML = '';
        for (let categoryName in categories) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';

            const categoryNameSpan = document.createElement('span');
            categoryNameSpan.className = 'category-name';
            categoryNameSpan.textContent = categoryName;
            categoryDiv.appendChild(categoryNameSpan);

            const toggleButton = document.createElement('button');
            toggleButton.textContent = '展开';
            toggleButton.className = 'toggle-category';
            toggleButton.onclick = () => toggleCategory(categoryName);
            categoryDiv.appendChild(toggleButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.onclick = () => deleteCategory(categoryName);
            categoryDiv.appendChild(deleteButton);

            const categoryContent = document.createElement('div');
            categoryContent.className = 'category-content';
            categoryContent.id = `category-${categoryName}`;

            const newEntryInput = document.createElement('input');
            newEntryInput.type = 'text';
            newEntryInput.placeholder = '新词条';
            newEntryInput.id = `newEntry-${categoryName}`;
            categoryContent.appendChild(newEntryInput);

            const addEntryButton = document.createElement('button');
            addEntryButton.textContent = '添加词条';
            addEntryButton.onclick = () => addEntry(categoryName);
            categoryContent.appendChild(addEntryButton);

            const entriesList = document.createElement('div');
            entriesList.id = `entries-${categoryName}`;
            categoryContent.appendChild(entriesList);

            categoryDiv.appendChild(categoryContent);
            categoryList.appendChild(categoryDiv);

            displayEntries(categoryName);
        }
    }

    // 显示特定分类的词条
    function displayEntries(categoryName) {
        const entriesList = document.getElementById(`entries-${categoryName}`);
        entriesList.innerHTML = '';
        categories[categoryName].forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'entry';

            const entryText = document.createElement('span');
            entryText.className = 'entry-text';
            entryText.textContent = entry;
            entryText.onclick = () => copyToClipboard(entry);
            entryDiv.appendChild(entryText);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.onclick = () => deleteEntry(categoryName, index);
            entryDiv.appendChild(deleteButton);

            entriesList.appendChild(entryDiv);
        });
    }

    // 添加新分类
    function addCategory() {
        const newCategory = document.getElementById('newCategory');
        if (newCategory.value.trim() && !categories[newCategory.value.trim()]) {
            categories[newCategory.value.trim()] = [];
            GM_setValue('categories', categories);
            newCategory.value = '';
            displayCategories();
        }
    }

    // 删除分类
    function deleteCategory(categoryName) {
        if (confirm(`确定要删除分类"${categoryName}"及其所有词条吗？`)) {
            delete categories[categoryName];
            GM_setValue('categories', categories);
            displayCategories();
        }
    }

    // 添加新词条
    function addEntry(categoryName) {
        const newEntry = document.getElementById(`newEntry-${categoryName}`);
        if (newEntry.value.trim()) {
            categories[categoryName].push(newEntry.value.trim());
            GM_setValue('categories', categories);
            newEntry.value = '';
            displayEntries(categoryName);
        }
    }

    // 删除词条
    function deleteEntry(categoryName, index) {
        categories[categoryName].splice(index, 1);
        GM_setValue('categories', categories);
        displayEntries(categoryName);
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板：' + text);
        }).catch(err => {
            console.error('复制失败: ', err);
        });
    }

    // 展开/折叠分类
    function toggleCategory(categoryName) {
        const categoryContent = document.getElementById(`category-${categoryName}`);
        const isHidden = categoryContent.style.display === 'none' || categoryContent.style.display === '';
        categoryContent.style.display = isHidden ? 'block' : 'none';
        const toggleButton = categoryContent.previousElementSibling;
        toggleButton.textContent = isHidden ? '折叠' : '展开';
    }

    // 显示/隐藏编辑界面
    button.onclick = () => {
        editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
        if (editor.style.display === 'block') {
            displayCategories();
        }
    };

    // 添加分类事件监听
    document.getElementById('addCategory').onclick = addCategory;

    // 点击空白处双击关闭编辑器
    document.addEventListener('dblclick', function(event) {
        const editor = document.getElementById('textEditor');
        const floatingButton = document.getElementById('floatingButton');

        if (editor.style.display === 'block' &&
            !editor.contains(event.target) &&
            event.target !== floatingButton) {
            editor.style.display = 'none';
        }
    });

    // 阻止编辑器内的点击事件冒泡到文档
    editor.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // 阻止浮动按钮的点击事件冒泡到文档
    button.addEventListener('click', function(event) {
        event.stopPropagation();
    });
})();
