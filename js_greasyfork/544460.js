// ==UserScript==
// @name         魂+收藏夹
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  支持层级目录、删除、拖动排序、折叠状态记忆和目录重命名
// @author       annet
// @match        https://bbs.imoutolove.me/read.php?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544460/%E9%AD%82%2B%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/544460/%E9%AD%82%2B%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .my-bookmark-btn {
            color: #444;
            cursor: pointer;
            margin: 0 5px;
        }
        .my-bookmark-btn:hover {
            text-decoration: underline;
        }
        .bookmark-list {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9998;
            display: none;
            width: 450px;
        }
        .bookmark-category {
            font-weight: bold;
            margin: 15px 0 5px 0;
            color: #333;
            padding: 5px;
            background: #f5f5f5;
            border-radius: 3px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        .bookmark-category:hover {
            background: #eaeaea;
        }
        .bookmark-items {
            margin-left: 15px;
            transition: all 0.3s ease;
        }
        .bookmark-item {
            margin-bottom: 5px;
            padding: 8px;
            border-radius: 3px;
            background: #f9f9f9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        .bookmark-item:hover {
            background: #f0f0f0;
        }
        .bookmark-title {
            color: #4a6ea9;
            text-decoration: none;
            flex-grow: 1;
        }
        .bookmark-title:hover {
            text-decoration: underline;
        }
        .delete-btn {
            color: #ff6b6b;
            cursor: pointer;
            margin-left: 10px;
            font-weight: bold;
            padding: 0 5px;
        }
        .close-button {
            float: right;
            cursor: pointer;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .drag-over {
            border: 2px dashed #4a6ea9;
            background: #e6f0ff !important;
        }
        .collapse-icon {
            margin-left: 10px;
            font-size: 12px;
        }
        .category-edit {
            border: 1px solid #ddd;
            padding: 3px;
            width: 80%;
            font-weight: bold;
        }
    `);

    // 创建收藏列表容器
    const bookmarkList = document.createElement('div');
    bookmarkList.className = 'bookmark-list';
    document.body.appendChild(bookmarkList);

    // 查找目标位置插入按钮
    const targetContainer = document.querySelector('.fr.w');
    if (!targetContainer) return;

    // 创建显示目录按钮
    const showButton = document.createElement('a');
    showButton.className = 'fn my-bookmark-btn';
    showButton.textContent = '显示目录';
    showButton.style.cursor = 'pointer';

    // 创建收藏按钮
    const saveButton = document.createElement('a');
    saveButton.className = 'fn my-bookmark-btn';
    saveButton.textContent = '收藏';
    saveButton.style.cursor = 'pointer';

    // 获取所有现有的链接
    const existingLinks = targetContainer.querySelectorAll('a');
    const browserBookmarkLink = Array.from(existingLinks).find(a => a.onclick && a.onclick.toString().includes('Addtoie'));
    const printLink = Array.from(existingLinks).find(a => a.href.includes('simple/index.php'));

    // 清空容器并重新构建
    targetContainer.innerHTML = '';

    // 添加分隔符和按钮
    targetContainer.appendChild(document.createTextNode(' | '));
    targetContainer.appendChild(showButton);
    targetContainer.appendChild(document.createTextNode(' | '));
    targetContainer.appendChild(saveButton);
    targetContainer.appendChild(document.createTextNode(' | '));
    if (browserBookmarkLink) targetContainer.appendChild(browserBookmarkLink);
    targetContainer.appendChild(document.createTextNode(' | '));
    if (printLink) targetContainer.appendChild(printLink);

    // 其余功能代码保持不变...
    // [这里保留之前的所有功能代码]

    // 获取折叠状态
    function getCollapseState() {
        return GM_getValue('collapseState', {});
    }

    // 设置折叠状态
    function setCollapseState(path, isCollapsed) {
        const collapseState = getCollapseState();
        collapseState[path] = isCollapsed;
        GM_setValue('collapseState', collapseState);
    }

    // 获取当前页面的目录和标题
    function getPageInfo() {
        let categories = [];
        let title = document.title;
        const url = window.location.href;

        // 从面包屑导航获取目录层级
        const breadcrumbs = document.querySelector('#breadcrumbs');
        if (breadcrumbs) {
            // 获取所有.crumbs-item.gray3元素作为目录层级
            const categoryItems = breadcrumbs.querySelectorAll('.crumbs-item.gray3');
            categoryItems.forEach(item => {
                categories.push(item.textContent.trim());
            });

            // 获取当前页面标题（最后一个strong或a元素）
            const lastTitle = breadcrumbs.querySelector('strong a, .current a');
            if (lastTitle) {
                title = lastTitle.textContent.trim();
            }
        }

        // 如果没有从面包屑获取到目录，尝试其他方法
        if (categories.length === 0) {
            categories = ['未分类'];
        }

        return { categories, title, url };
    }

    // 保存书签
    saveButton.addEventListener('click', () => {
        const { categories, title, url } = getPageInfo();
        let bookmarks = GM_getValue('bookmarks', {});

        // 构建目录层级
        let currentLevel = bookmarks;
        for (let i = 0; i < categories.length; i++) {
            const category = categories[i];
            if (!currentLevel[category]) {
                currentLevel[category] = i === categories.length - 1 ? [] : {};
            }
            currentLevel = currentLevel[category];
        }

        // 检查是否已经收藏过
        if (Array.isArray(currentLevel)) {
            const alreadySaved = currentLevel.some(item => item.url === url);
            if (alreadySaved) {
                return;
            }

            currentLevel.push({ title, url });
            GM_setValue('bookmarks', bookmarks);
        }
    });

    // 显示/隐藏书签列表
    showButton.addEventListener('click', () => {
        if (bookmarkList.style.display === 'block') {
            bookmarkList.style.display = 'none';
        } else {
            displayBookmarks();
            bookmarkList.style.display = 'block';
        }
    });

    // 递归渲染书签列表
    function renderBookmarks(data, parentElement, path = []) {
        for (const key in data) {
            if (Array.isArray(data[key])) {
                // 这是分类下的书签列表
                if (data[key].length > 0) {
                    const fullPath = path.join('|') + (path.length ? '|' : '') + key;
                    const collapseState = getCollapseState();
                    const isCollapsed = collapseState[fullPath] || false;

                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'bookmark-category';
                    categoryDiv.dataset.path = fullPath;

                    const categoryName = document.createElement('span');
                    categoryName.textContent = key;
                    categoryDiv.appendChild(categoryName);

                    const collapseIcon = document.createElement('span');
                    collapseIcon.className = 'collapse-icon';
                    collapseIcon.textContent = isCollapsed ? '▶' : '▼';
                    categoryDiv.appendChild(collapseIcon);

                    parentElement.appendChild(categoryDiv);

                    const itemsContainer = document.createElement('div');
                    itemsContainer.className = 'bookmark-items';
                    itemsContainer.style.display = isCollapsed ? 'none' : 'block';
                    parentElement.appendChild(itemsContainer);

                    // 添加折叠/展开功能
                    categoryDiv.addEventListener('click', function(e) {
                        if (e.target.classList.contains('delete-btn')) return;

                        if (e.target === this || e.target === categoryName || e.target === collapseIcon) {
                            const newState = itemsContainer.style.display === 'none';
                            itemsContainer.style.display = newState ? 'block' : 'none';
                            collapseIcon.textContent = newState ? '▼' : '▶';
                            setCollapseState(fullPath, !newState);
                        }
                    });

                    // 添加双击重命名功能
                    categoryDiv.addEventListener('dblclick', function(e) {
                        if (e.target.classList.contains('delete-btn')) return;

                        const oldName = categoryName.textContent;
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'category-edit';
                        input.value = oldName;

                        categoryName.replaceWith(input);
                        input.focus();

                        const handleRename = () => {
                            const newName = input.value.trim();
                            if (newName && newName !== oldName) {
                                // 更新数据
                                let bookmarks = GM_getValue('bookmarks');
                                let currentLevel = bookmarks;

                                // 导航到父级
                                for (let i = 0; i < path.length; i++) {
                                    currentLevel = currentLevel[path[i]];
                                }

                                // 重命名
                                currentLevel[newName] = currentLevel[oldName];
                                delete currentLevel[oldName];

                                // 更新折叠状态
                                const collapseState = getCollapseState();
                                if (collapseState[fullPath] !== undefined) {
                                    collapseState[fullPath.replace(oldName, newName)] = collapseState[fullPath];
                                    delete collapseState[fullPath];
                                    GM_setValue('collapseState', collapseState);
                                }

                                GM_setValue('bookmarks', bookmarks);
                                displayBookmarks();
                            } else {
                                input.replaceWith(categoryName);
                            }
                        };

                        input.addEventListener('blur', handleRename);
                        input.addEventListener('keypress', function(e) {
                            if (e.key === 'Enter') {
                                handleRename();
                            }
                        });
                    });

                    data[key].forEach((bookmark, index) => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'bookmark-item';
                        itemDiv.draggable = true;
                        itemDiv.dataset.path = [...path, key, index].join('|');

                        const titleLink = document.createElement('a');
                        titleLink.className = 'bookmark-title';
                        titleLink.textContent = bookmark.title;
                        titleLink.href = bookmark.url;
                        titleLink.target = '_blank';
                        itemDiv.appendChild(titleLink);

                        const deleteBtn = document.createElement('span');
                        deleteBtn.className = 'delete-btn';
                        deleteBtn.textContent = '×';
                        deleteBtn.title = '删除';
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            // 获取完整路径
                            const fullPath = itemDiv.dataset.path.split('|');
                            let bookmarks = GM_getValue('bookmarks');
                            let currentLevel = bookmarks;

                            // 导航到父级
                            for (let i = 0; i < fullPath.length - 1; i++) {
                                currentLevel = currentLevel[fullPath[i]];
                            }

                            // 删除项目
                            const indexToDelete = parseInt(fullPath[fullPath.length - 1]);
                            currentLevel.splice(indexToDelete, 1);

                            GM_setValue('bookmarks', bookmarks);
                            displayBookmarks();
                        });
                        itemDiv.appendChild(deleteBtn);

                        // 拖动相关事件
                        itemDiv.addEventListener('dragstart', handleDragStart);
                        itemDiv.addEventListener('dragover', handleDragOver);
                        itemDiv.addEventListener('dragleave', handleDragLeave);
                        itemDiv.addEventListener('drop', handleDrop);
                        itemDiv.addEventListener('dragend', handleDragEnd);

                        itemsContainer.appendChild(itemDiv);
                    });
                }
            } else {
                // 这是子分类
                renderBookmarks(data[key], parentElement, [...path, key]);
            }
        }
    }

    // 显示书签列表
    function displayBookmarks() {
        const bookmarks = GM_getValue('bookmarks', {});
        bookmarkList.innerHTML = '<div class="close-button" id="closeBookmarkList">×</div><h3>我的收藏夹</h3>';

        if (Object.keys(bookmarks).length === 0) {
            bookmarkList.innerHTML += '<p>暂无收藏内容</p>';
            return;
        }

        renderBookmarks(bookmarks, bookmarkList);

        // 添加关闭按钮事件
        document.getElementById('closeBookmarkList').addEventListener('click', () => {
            bookmarkList.style.display = 'none';
        });
    }

    // 拖动相关变量
    let draggedItem = null;
    let draggedPath = null;

    // 拖动事件处理
    function handleDragStart(e) {
        draggedItem = this;
        draggedPath = this.dataset.path.split('|');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        setTimeout(() => this.classList.add('drag-over'), 0);
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
        return false;
    }

    function handleDragLeave() {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        this.classList.remove('drag-over');

        if (draggedItem !== this) {
            const targetPath = this.dataset.path.split('|');

            // 检查是否在同一分类下
            if (draggedPath.slice(0, -1).join() === targetPath.slice(0, -1).join()) {
                let bookmarks = GM_getValue('bookmarks');
                let currentLevel = bookmarks;

                // 导航到父级分类
                for (let i = 0; i < draggedPath.length - 1; i++) {
                    currentLevel = currentLevel[draggedPath[i]];
                }

                // 获取原始索引和目标索引
                const draggedIndex = parseInt(draggedPath[draggedPath.length - 1]);
                const targetIndex = parseInt(targetPath[targetPath.length - 1]);

                // 移动项目
                const [movedItem] = currentLevel.splice(draggedIndex, 1);
                currentLevel.splice(targetIndex, 0, movedItem);

                // 保存更新
                GM_setValue('bookmarks', bookmarks);
                displayBookmarks();
            }
        }
        return false;
    }

    function handleDragEnd() {
        this.classList.remove('drag-over');
    }

    // 点击页面其他地方关闭书签列表
    document.addEventListener('click', (e) => {
        if (!bookmarkList.contains(e.target) &&
            e.target !== showButton &&
            e.target !== saveButton) {
            bookmarkList.style.display = 'none';
        }
    });
})();