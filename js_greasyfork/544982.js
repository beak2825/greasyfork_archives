// ==UserScript==
// @name         Wiki 树形菜单
// @namespace    http://tampermonkey.net/
// @version      2025-08-08
// @description  增加 wiki js 左侧树形菜单
// @author       You
// @match        http://192.168.1.111:7001/*
// @exclude      http://192.168.1.111:7001/e/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544982/Wiki%20%E6%A0%91%E5%BD%A2%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/544982/Wiki%20%E6%A0%91%E5%BD%A2%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找 nav 下 button，获取第二个
    const getTargetButton = () => {
        const buttons = document.querySelectorAll('nav button');
        return buttons.length >= 2 ? buttons[1] : null;
    };

    // 获取 button 下 span -> div 的文字
    const getDivText = (button) => {
        const span = button?.querySelector('span');
        const div = span?.querySelector('div');
        return div?.textContent.trim();
    };

    // 获取当前 URL 中的 path
    const getCurrentPath = () => {
        const match = window.location.pathname.match(/^\/zh\/(.+)/);
        return match ? match[1] : '';
    };

    // 初始检查
    const init = () => {
        const button = getTargetButton();
        if (button) {
            const text = getDivText(button);
            if (text) {
                handleMenuDisplay(text);
                return text === '浏览';
            }
        }
        return false;
    };

    // 渲染菜单项
    const renderMenuItems = (items, level = 0, parentNode = null, currentPath = '') => {
        const listDiv = document.createElement('div');
        listDiv.className = 'v-list py-2 v-sheet theme--dark v-list--dense primary';
        const pathParts = currentPath ? currentPath.split('/') : [];

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.tabIndex = 0;
            itemDiv.className = `v-list-item v-list-item--link theme--dark`;
            itemDiv.style.minHeight = '30px';

            // 检查是否为当前路径的菜单项
            //if (!item.isFolder && item.path === currentPath) {
            if (!item.isFolder && item.path === decodeURI(currentPath)) {
                itemDiv.classList.add('v-list-item--active');
            }

            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'v-avatar v-list-item__avatar';
            avatarDiv.style.height = '18px';
            avatarDiv.style.minWidth = '18px';
            avatarDiv.style.width = 'auto';
            avatarDiv.style.paddingLeft = `${level * 8}px`;
            avatarDiv.style.margin = '0px 5px 0px 0px';

            const icon = document.createElement('i');
            icon.setAttribute('aria-hidden', 'true');
            icon.className = `v-icon notranslate mdi mdi-${
                item.isFolder ? 'folder' : 'text-box'
            } theme--dark`;
            icon.style.fontSize = '16px';

            avatarDiv.appendChild(icon);

            const titleDiv = document.createElement('div');
            titleDiv.className = 'v-list-item__title';
            titleDiv.textContent = item.title;

            itemDiv.appendChild(avatarDiv);
            itemDiv.appendChild(titleDiv);

            // 为文件夹添加点击事件
            if (item.isFolder) {
                let isExpanded = false;
                itemDiv.addEventListener('click', () => {
                    const existingSubMenu = itemDiv.nextElementSibling?.classList.contains('v-list') ? itemDiv.nextElementSibling : null;
                    if (isExpanded && existingSubMenu) {
                        existingSubMenu.remove();
                        icon.className = 'v-icon notranslate mdi mdi-folder theme--dark';
                        icon.style.fontSize = '16px';
                        isExpanded = false;
                    } else {
                        getMenuByParent(item.id).then(response => {
                            const subMenu = renderMenuItems(response, level + 1, null, currentPath);
                            if (existingSubMenu) {
                                existingSubMenu.remove();
                            }
                            itemDiv.parentElement.insertBefore(subMenu, itemDiv.nextSibling);
                            icon.className = 'v-icon notranslate mdi mdi-folder-open theme--dark';
                            icon.style.fontSize = '16px';
                            isExpanded = true;
                        });
                    }
                });

                // 自动展开包含当前路径的文件夹
                // if (pathParts.length > 0 && item.path === pathParts.slice(0, level + 1).join('/')) {
                if (pathParts.length > 0 && item.path === decodeURI(pathParts.slice(0, level + 1).join('/'))) {
                    getMenuByParent(item.id).then(response => {
                        const subMenu = renderMenuItems(response, level + 1, null, currentPath);
                        itemDiv.parentElement.insertBefore(subMenu, itemDiv.nextSibling);
                        icon.className = 'v-icon notranslate mdi mdi-folder-open theme--dark';
                        icon.style.fontSize = '16px';
                        isExpanded = true;
                    });
                }
            } else {
                // 为非文件夹添加跳转事件
                itemDiv.addEventListener('click', () => {
                    window.location.href = `${window.location.origin}/zh/${item.path}`;
                });
            }

            listDiv.appendChild(itemDiv);
        });

        return listDiv;
    };

    // 处理 custom_tree_menu 的显示/隐藏逻辑
    const handleMenuDisplay = (text) => {
        const existingDiv = document.querySelector('div#custom_tree_menu');
        const button = getTargetButton();
        const parent = button?.parentElement?.parentElement;
        const currentPath = getCurrentPath();

        if (text === '浏览') {
            if (!existingDiv && parent) {
                const newDiv = document.createElement('div');
                newDiv.id = 'custom_tree_menu';
                parent.appendChild(newDiv);
                getHomeMenu().then(response => {
                    newDiv.appendChild(renderMenuItems(response, 0, null, currentPath));
                });
            } else if (existingDiv) {
                existingDiv.style.display = 'block';
                getHomeMenu().then(response => {
                    existingDiv.innerHTML = '';
                    existingDiv.appendChild(renderMenuItems(response, 0, null, currentPath));
                });
            }
        } else if (text === '主菜单' && existingDiv) {
            existingDiv.style.display = 'none';
        }
    };

    // 使用 MutationObserver 监听 div 内容变化
    const observeDivChanges = () => {
        const button = getTargetButton();
        const targetDiv = button?.querySelector('span div');
        if (!targetDiv) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const text = getDivText(button);
                if (text) handleMenuDisplay(text);
            });
        });

        observer.observe(targetDiv, {
            characterData: true,
            subtree: true,
            childList: true
        });
    };

    // 获取最外层 menu
    async function getHomeMenu() {
        const currentUrl = window.location.origin;
        const uploadUrl = `${currentUrl}/graphql`;
        const jwt = document.cookie.split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];
        const auth = `Bearer ${jwt}`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify([{
                operationName: null,
                variables: { parent: "home", locale: "zh" },
                extensions: {},
                query: "query ($path: String, $locale: String!) {\n  pages {\n    tree(path: $path, mode: ALL, locale: $locale, includeAncestors: true) {\n      id\n      path\n      title\n      isFolder\n      pageId\n      parent\n      locale\n      __typename\n    }\n    __typename\n  }\n}\n"
            }])
        });

        const result = await response.json();
        const tree = result[0]?.data?.pages?.tree || [];

        return tree.map(item => ({
            id: item.id,
            path: item.path,
            title: item.title,
            isFolder: item.isFolder,
            pageId: item.pageId,
            parent: item.parent
        }));
    }

    // 点击 folder 获取新的 menu
    async function getMenuByParent(parentId) {
        const currentUrl = window.location.origin;
        const uploadUrl = `${currentUrl}/graphql`;
        const jwt = document.cookie.split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];
        const auth = `Bearer ${jwt}`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify([{
                operationName: null,
                variables: { parent: parentId, locale: "zh" },
                extensions: {},
                query: "query ($parent: Int, $locale: String!) {\n  pages {\n    tree(parent: $parent, mode: ALL, locale: $locale) {\n      id\n      path\n      title\n      isFolder\n      pageId\n      parent\n      locale\n      __typename\n    }\n    __typename\n  }\n}"
            }])
        });

        const result = await response.json();
        const tree = result[0]?.data?.pages?.tree || [];

        return tree.map(item => ({
            id: item.id,
            path: item.path,
            title: item.title,
            isFolder: item.isFolder,
            pageId: item.pageId,
            parent: item.parent
        }));
    }

    let intervalId = window.setInterval(function() {
        if (init()) {
            observeDivChanges();
            window.clearInterval(intervalId);
        }
    }, 500);
})();