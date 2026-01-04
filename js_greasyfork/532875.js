// ==UserScript==
// @name         NGA 用户标红
// @name:en      NGA User Highlighter
// @namespace    https://github.com/eep
// @version      1.0.0
// @description  标红你关注的用户
// @description:en Highlight specific users on NGA forums
// @author       EEP
// @license      MIT
// @match        https://nga.178.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532875/NGA%20%E7%94%A8%E6%88%B7%E6%A0%87%E7%BA%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/532875/NGA%20%E7%94%A8%E6%88%B7%E6%A0%87%E7%BA%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Storage keys
    const COLOR_CATEGORIES_KEY = 'nga_color_categories';
    const USER_CATEGORY_MAP_KEY = 'nga_user_category_map';

    // Default categories
    const DEFAULT_CATEGORIES = {
        'red': {
            name: '网事杂谈',
            color: '#ffcfcf'
        },
        'blue': {
            name: '大时代',
            color: '#cfdaff'
        },
        'green': {
            name: '其他',
            color: '#cfffcf'
        }
    };

    // Get color categories from storage
    function getColorCategories() {
        const stored = localStorage.getItem(COLOR_CATEGORIES_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    }

    // Save color categories to storage
    function saveColorCategories(categories) {
        localStorage.setItem(COLOR_CATEGORIES_KEY, JSON.stringify(categories));
    }

    // Get user to category mapping
    function getUserCategoryMap() {
        const stored = localStorage.getItem(USER_CATEGORY_MAP_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    // Save user to category mapping
    function saveUserCategoryMap(userMap) {
        localStorage.setItem(USER_CATEGORY_MAP_KEY, JSON.stringify(userMap));
    }

    // Add a user to a category
    function addUserToCategory(userId, categoryId) {
        const userMap = getUserCategoryMap();
        userMap[userId] = categoryId;
        saveUserCategoryMap(userMap);
    }

    // Remove a user from highlighting
    function removeUser(userId) {
        const userMap = getUserCategoryMap();
        if (userId in userMap) {
            delete userMap[userId];
            saveUserCategoryMap(userMap);
        }
    }

    // Add a new category
    function addCategory(id, name, color) {
        const categories = getColorCategories();
        categories[id] = {
            name: name,
            color: color
        };
        saveColorCategories(categories);
    }

    // Remove a category
    function removeCategory(categoryId) {
        const categories = getColorCategories();
        if (categoryId in categories) {
            delete categories[categoryId];
            saveColorCategories(categories);

            // Also remove users assigned to this category
            const userMap = getUserCategoryMap();
            Object.entries(userMap).forEach(([userId, catId]) => {
                if (catId === categoryId) {
                    delete userMap[userId];
                }
            });
            saveUserCategoryMap(userMap);
        }
    }

    // Update category properties
    function updateCategory(categoryId, name, color) {
        const categories = getColorCategories();
        if (categoryId in categories) {
            categories[categoryId].name = name;
            categories[categoryId].color = color;
            saveColorCategories(categories);
        }
    }

    // Function to highlight users in the page
    function highlightUsers() {
        const userMap = getUserCategoryMap();
        const categories = getColorCategories();

        if (Object.keys(userMap).length === 0) return;

        // Find all user IDs in the page
        const uidElements = document.querySelectorAll('a[name="uid"]');

        uidElements.forEach(element => {
            // Get the user ID from the text content of the element
            const userId = element.textContent.trim();

            // Check if this user ID is in our highlight list
            if (userId in userMap) {
                const categoryId = userMap[userId];
                // Check if the category exists
                if (categoryId in categories) {
                    // Find the parent td element
                    let parent = element;
                    while (parent && parent.tagName !== 'TD') {
                        parent = parent.parentElement;
                    }

                    // Apply highlighting if parent td was found
                    if (parent) {
                        parent.style.backgroundColor = categories[categoryId].color;
                    }
                }
            }
        });
    }

    // Add UI for managing highlighted users
    function addManagementUI() {
        // Create a floating button
        const button = document.createElement('button');
        button.textContent = '用户管理';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px';
        button.style.backgroundColor = '#f0f0f0';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', showMainPanel);

        document.body.appendChild(button);
    }

    function showMainPanel() {
        // Create panel container
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid #ccc';
        panel.style.borderRadius = '4px';
        panel.style.padding = '20px';
        panel.style.zIndex = '10000';
        panel.style.minWidth = '400px';
        panel.style.maxHeight = '80vh';
        panel.style.overflowY = 'auto';
        panel.style.overflowX = 'hidden';
        panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';

        // Create title
        const title = document.createElement('h3');
        title.textContent = 'NGA用户高亮管理器';
        title.style.marginTop = '0';
        panel.appendChild(title);

        // Tab navigation
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.marginBottom = '15px';
        tabContainer.style.borderBottom = '1px solid #ccc';

        const createTab = (text, isActive, clickHandler) => {
            const tab = document.createElement('div');
            tab.textContent = text;
            tab.style.padding = '8px 15px';
            tab.style.cursor = 'pointer';
            tab.style.backgroundColor = isActive ? '#f0f0f0' : 'transparent';
            tab.style.borderBottom = isActive ? '2px solid #0078d7' : 'none';
            tab.style.fontWeight = isActive ? 'bold' : 'normal';
            tab.addEventListener('click', clickHandler);
            return tab;
        };

        const contentContainer = document.createElement('div');

        // Users tab
        const usersTab = createTab('用户管理', true, () => {
            Array.from(tabContainer.children).forEach(tab => {
                tab.style.backgroundColor = 'transparent';
                tab.style.borderBottom = 'none';
                tab.style.fontWeight = 'normal';
            });
            usersTab.style.backgroundColor = '#f0f0f0';
            usersTab.style.borderBottom = '2px solid #0078d7';
            usersTab.style.fontWeight = 'bold';

            contentContainer.innerHTML = '';
            showUserManagement(contentContainer);
        });

        // Categories tab
        const categoriesTab = createTab('分类管理', false, () => {
            Array.from(tabContainer.children).forEach(tab => {
                tab.style.backgroundColor = 'transparent';
                tab.style.borderBottom = 'none';
                tab.style.fontWeight = 'normal';
            });
            categoriesTab.style.backgroundColor = '#f0f0f0';
            categoriesTab.style.borderBottom = '2px solid #0078d7';
            categoriesTab.style.fontWeight = 'bold';

            contentContainer.innerHTML = '';
            showCategoryManagement(contentContainer);
        });

        tabContainer.appendChild(usersTab);
        tabContainer.appendChild(categoriesTab);
        panel.appendChild(tabContainer);
        panel.appendChild(contentContainer);

        // Initialize with user management tab
        showUserManagement(contentContainer);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginTop = '15px';
        closeButton.style.display = 'block';
        closeButton.style.width = '100%';
        closeButton.style.padding = '8px';
        closeButton.addEventListener('click', function() {
            panel.remove();
        });

        panel.appendChild(closeButton);
        document.body.appendChild(panel);
    }

    function showUserManagement(container) {
        const userMap = getUserCategoryMap();
        const categories = getColorCategories();

        // Create user list
        const userListContainer = document.createElement('div');
        userListContainer.style.marginBottom = '20px';

        const userListTitle = document.createElement('h4');
        userListTitle.textContent = '已添加用户';
        userListTitle.style.marginBottom = '10px';
        userListContainer.appendChild(userListTitle);

        if (Object.keys(userMap).length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '暂无添加用户。';
            emptyMessage.style.fontStyle = 'italic';
            emptyMessage.style.color = '#666';
            userListContainer.appendChild(emptyMessage);
        } else {
            // Sort users by category for better organization
            const usersByCategory = {};
            Object.entries(userMap).forEach(([userId, categoryId]) => {
                if (!usersByCategory[categoryId]) {
                    usersByCategory[categoryId] = [];
                }
                usersByCategory[categoryId].push(userId);
            });

            Object.entries(usersByCategory).forEach(([categoryId, userIds]) => {
                const categoryExists = categories[categoryId] !== undefined;
                const categoryName = categoryExists ? categories[categoryId].name : '未知分类';
                const categoryColor = categoryExists ? categories[categoryId].color : '#cccccc';

                const categoryHeader = document.createElement('div');
                categoryHeader.style.padding = '5px 10px';
                categoryHeader.style.backgroundColor = categoryColor;
                categoryHeader.style.borderRadius = '4px';
                categoryHeader.style.marginBottom = '8px';
                categoryHeader.style.marginTop = '12px';
                categoryHeader.style.fontWeight = 'bold';
                categoryHeader.textContent = categoryName;
                userListContainer.appendChild(categoryHeader);

                userIds.forEach(userId => {
                    const userItem = document.createElement('div');
                    userItem.style.padding = '5px 10px';
                    userItem.style.margin = '5px 0';
                    userItem.style.display = 'flex';
                    userItem.style.justifyContent = 'space-between';
                    userItem.style.alignItems = 'center';
                    userItem.style.backgroundColor = '#f9f9f9';
                    userItem.style.borderRadius = '4px';

                    const userIdText = document.createElement('span');
                    userIdText.textContent = userId;

                    const actionContainer = document.createElement('div');

                    // Category selector
                    const categorySelect = document.createElement('select');
                    categorySelect.style.marginRight = '10px';

                    Object.entries(categories).forEach(([catId, category]) => {
                        const option = document.createElement('option');
                        option.value = catId;
                        option.textContent = category.name;
                        option.selected = catId === categoryId;
                        categorySelect.appendChild(option);
                    });

                    categorySelect.addEventListener('change', function() {
                        addUserToCategory(userId, this.value);
                        container.innerHTML = '';
                        showUserManagement(container);
                        highlightUsers();
                    });

                    // Remove button
                    const removeButton = document.createElement('button');
                    removeButton.textContent = '删除';
                    removeButton.addEventListener('click', function() {
                        removeUser(userId);
                        container.innerHTML = '';
                        showUserManagement(container);
                        highlightUsers();
                    });

                    actionContainer.appendChild(categorySelect);
                    actionContainer.appendChild(removeButton);

                    userItem.appendChild(userIdText);
                    userItem.appendChild(actionContainer);
                    userListContainer.appendChild(userItem);
                });
            });
        }

        container.appendChild(userListContainer);

        // Add new user form
        const addUserContainer = document.createElement('div');
        addUserContainer.style.borderTop = '1px solid #eee';
        addUserContainer.style.paddingTop = '15px';

        const addUserTitle = document.createElement('h4');
        addUserTitle.textContent = '添加新用户';
        addUserTitle.style.marginBottom = '10px';
        addUserContainer.appendChild(addUserTitle);

        const form = document.createElement('div');
        form.style.display = 'flex';
        form.style.alignItems = 'center';
        form.style.marginBottom = '10px';

        const userIdInput = document.createElement('input');
        userIdInput.setAttribute('type', 'text');
        userIdInput.setAttribute('placeholder', '输入用户ID');
        userIdInput.style.flexGrow = '1';
        userIdInput.style.padding = '8px';
        userIdInput.style.marginRight = '10px';

        const categorySelect = document.createElement('select');
        categorySelect.style.padding = '8px';
        categorySelect.style.marginRight = '10px';

        if (Object.keys(categories).length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '请先添加分类';
            option.disabled = true;
            option.selected = true;
            categorySelect.appendChild(option);
        } else {
            Object.entries(categories).forEach(([catId, category]) => {
                const option = document.createElement('option');
                option.value = catId;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }

        const addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.disabled = Object.keys(categories).length === 0;
        addButton.addEventListener('click', function() {
            const userId = userIdInput.value.trim();
            const categoryId = categorySelect.value;

            if (userId && categoryId) {
                addUserToCategory(userId, categoryId);
                userIdInput.value = '';
                container.innerHTML = '';
                showUserManagement(container);
                highlightUsers();
            }
        });

        form.appendChild(userIdInput);
        form.appendChild(categorySelect);
        form.appendChild(addButton);

        addUserContainer.appendChild(form);
        container.appendChild(addUserContainer);
    }

    function showCategoryManagement(container) {
        const categories = getColorCategories();

        // Create category list
        const categoryListContainer = document.createElement('div');
        categoryListContainer.style.marginBottom = '20px';

        const categoryListTitle = document.createElement('h4');
        categoryListTitle.textContent = '颜色分类';
        categoryListTitle.style.marginBottom = '10px';
        categoryListContainer.appendChild(categoryListTitle);

        if (Object.keys(categories).length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '暂无颜色分类。';
            emptyMessage.style.fontStyle = 'italic';
            emptyMessage.style.color = '#666';
            categoryListContainer.appendChild(emptyMessage);
        } else {
            Object.entries(categories).forEach(([categoryId, category]) => {
                const categoryItem = document.createElement('div');
                categoryItem.style.padding = '12px';
                categoryItem.style.margin = '10px 0';
                categoryItem.style.display = 'flex';
                categoryItem.style.justifyContent = 'space-between';
                categoryItem.style.alignItems = 'center';
                categoryItem.style.backgroundColor = category.color;
                categoryItem.style.borderRadius = '4px';
                categoryItem.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';

                const categoryInfo = document.createElement('div');
                categoryInfo.style.display = 'flex';
                categoryInfo.style.flexDirection = 'column';

                const nameContainer = document.createElement('div');
                nameContainer.style.fontWeight = 'bold';
                nameContainer.style.marginBottom = '5px';

                const nameLabel = document.createElement('span');
                nameLabel.textContent = '分类名称: ';
                nameLabel.style.marginRight = '5px';

                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.value = category.name;
                nameInput.style.border = '1px solid #ccc';
                nameInput.style.padding = '3px';
                nameInput.style.borderRadius = '2px';

                nameContainer.appendChild(nameLabel);
                nameContainer.appendChild(nameInput);

                const idContainer = document.createElement('div');
                idContainer.style.fontSize = '0.9em';
                idContainer.style.color = '#333';
                idContainer.textContent = `ID: ${categoryId}`;

                categoryInfo.appendChild(nameContainer);
                categoryInfo.appendChild(idContainer);

                const actionContainer = document.createElement('div');
                actionContainer.style.display = 'flex';
                actionContainer.style.alignItems = 'center';

                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = category.color;
                colorInput.style.marginRight = '10px';
                colorInput.style.border = 'none';
                colorInput.style.width = '30px';
                colorInput.style.height = '30px';
                colorInput.style.padding = '0';
                colorInput.style.cursor = 'pointer';

                const saveButton = document.createElement('button');
                saveButton.textContent = '保存';
                saveButton.style.marginRight = '5px';
                saveButton.addEventListener('click', function() {
                    updateCategory(categoryId, nameInput.value, colorInput.value);
                    container.innerHTML = '';
                    showCategoryManagement(container);
                    highlightUsers();  // Refresh highlighting
                });

                const removeButton = document.createElement('button');
                removeButton.textContent = '删除';
                removeButton.addEventListener('click', function() {
                    if (confirm(`确定要删除分类 "${category.name}" 吗？这将同时删除所有关联的用户高亮。`)) {
                        removeCategory(categoryId);
                        container.innerHTML = '';
                        showCategoryManagement(container);
                        highlightUsers();  // Refresh highlighting
                    }
                });

                actionContainer.appendChild(colorInput);
                actionContainer.appendChild(saveButton);
                actionContainer.appendChild(removeButton);

                categoryItem.appendChild(categoryInfo);
                categoryItem.appendChild(actionContainer);

                categoryListContainer.appendChild(categoryItem);
            });
        }

        container.appendChild(categoryListContainer);

        // Add new category form
        const addCategoryContainer = document.createElement('div');
        addCategoryContainer.style.borderTop = '1px solid #eee';
        addCategoryContainer.style.paddingTop = '15px';

        const addCategoryTitle = document.createElement('h4');
        addCategoryTitle.textContent = '添加新分类';
        addCategoryTitle.style.marginBottom = '10px';
        addCategoryContainer.appendChild(addCategoryTitle);

        const form = document.createElement('div');
        form.style.display = 'grid';
        form.style.gridTemplateColumns = '1fr 1fr';
        form.style.gridGap = '10px';
        form.style.alignItems = 'center';

        const idInput = document.createElement('input');
        idInput.setAttribute('type', 'text');
        idInput.setAttribute('placeholder', '分类ID（英文/数字）');
        idInput.style.padding = '8px';

        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('placeholder', '分类名称');
        nameInput.style.padding = '8px';

        const colorInput = document.createElement('input');
        colorInput.setAttribute('type', 'color');
        colorInput.value = '#ffcfcf';
        colorInput.style.width = '100%';

        const addButton = document.createElement('button');
        addButton.textContent = '添加分类';
        addButton.style.gridColumn = '1 / span 2';
        addButton.style.padding = '8px';
        addButton.addEventListener('click', function() {
            const id = idInput.value.trim();
            const name = nameInput.value.trim();
            const color = colorInput.value;

            if (id && name) {
                addCategory(id, name, color);
                idInput.value = '';
                nameInput.value = '';
                container.innerHTML = '';
                showCategoryManagement(container);
            }
        });

        form.appendChild(idInput);
        form.appendChild(nameInput);
        form.appendChild(colorInput);
        form.appendChild(addButton);

        addCategoryContainer.appendChild(form);
        container.appendChild(addCategoryContainer);
    }

    // Run when the page loads
    function init() {
        // Convert old format to new format if needed
        const migrateFromOldFormat = () => {
            const oldUserData = localStorage.getItem('nga_highlighted_users');
            if (oldUserData) {
                try {
                    const data = JSON.parse(oldUserData);

                    // If old data is an array
                    if (Array.isArray(data)) {
                        const userMap = {};
                        data.forEach(userId => {
                            userMap[userId] = 'green';  // Default to green category
                        });
                        saveUserCategoryMap(userMap);
                    }
                    // If old data is an object mapping user IDs to colors
                    else if (typeof data === 'object') {
                        const userMap = {};
                        const categories = getColorCategories();

                        // Create categories based on unique colors
                        const uniqueColors = [...new Set(Object.values(data))];
                        uniqueColors.forEach((color, index) => {
                            const categoryId = `migrated_${index}`;
                            categories[categoryId] = {
                                name: `迁移颜色 ${index + 1}`,
                                color: color
                            };

                            // Assign users to this category
                            Object.entries(data).forEach(([userId, userColor]) => {
                                if (userColor === color) {
                                    userMap[userId] = categoryId;
                                }
                            });
                        });

                        saveColorCategories(categories);
                        saveUserCategoryMap(userMap);
                    }

                    // Remove old data format
                    localStorage.removeItem('nga_highlighted_users');
                } catch (e) {
                    console.error("Error migrating old data format", e);
                }
            }
        };

        migrateFromOldFormat();

        highlightUsers();
        addManagementUI();

        // Add mutation observer to handle dynamically loaded content
        const observer = new MutationObserver(function(mutations) {
            highlightUsers();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run the script after the page loads
    window.addEventListener('load', init);
})();
