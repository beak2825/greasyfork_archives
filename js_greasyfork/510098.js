// ==UserScript==
// @name         我的常用工具箱
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  显示悬浮图标，展示和管理书签
// @match        *://*/*
// @author       sanzhixiaoxia
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/510098/%E6%88%91%E7%9A%84%E5%B8%B8%E7%94%A8%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/510098/%E6%88%91%E7%9A%84%E5%B8%B8%E7%94%A8%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮图标
    const icon = document.createElement('div');
    icon.id = 'my-tools-icon';
    icon.style.position = 'fixed';
    icon.style.top = '20px';
    icon.style.right = '20px';
    icon.style.width = '50px';
    icon.style.height = '50px';
    icon.style.backgroundImage = 'url(https://img.icons8.com/color/48/000000/star.png)'; // 使用中国可以访问的地址
    icon.style.backgroundSize = 'cover';
    icon.style.cursor = 'pointer';
    icon.style.zIndex = '9999';
    document.body.appendChild(icon);

    // 创建书签列表
    const bookmarkList = document.createElement('div');
    bookmarkList.id = 'bookmark-list';
    bookmarkList.style.position = 'fixed';
    bookmarkList.style.top = '80px';
    bookmarkList.style.right = '20px';
    bookmarkList.style.width = '200px';
    bookmarkList.style.maxHeight = '400px';
    bookmarkList.style.overflowY = 'auto';
    bookmarkList.style.background = 'white';
    bookmarkList.style.border = '1px solid #ccc';
    bookmarkList.style.padding = '10px';
    bookmarkList.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    bookmarkList.style.display = 'none';
    bookmarkList.style.zIndex = '9998'; // 确保在图标下方
    document.body.appendChild(bookmarkList);

    // 显示和隐藏书签列表
    let timeout;
    icon.addEventListener('mouseover', () => {
        clearTimeout(timeout);
        bookmarkList.style.display = 'block';
        displayBookmarks();
    });

    icon.addEventListener('mouseout', () => {
        timeout = setTimeout(() => {
            bookmarkList.style.display = 'none';
        }, 300);
    });

    bookmarkList.addEventListener('mouseover', () => {
        clearTimeout(timeout);
        bookmarkList.style.display = 'block';
    });

    bookmarkList.addEventListener('mouseout', () => {
        timeout = setTimeout(() => {
            bookmarkList.style.display = 'none';
        }, 300);
    });

    function displayBookmarks() {
        bookmarkList.innerHTML = '';
        const bookmarks = GM_getValue('bookmarks', []);
        bookmarks.forEach((bookmark, index) => {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.style.display = 'flex';
            bookmarkItem.style.justifyContent = 'space-between';
            bookmarkItem.style.marginBottom = '5px';

            const bookmarkName = document.createElement('span');
            bookmarkName.textContent = bookmark.name;
            bookmarkName.style.cursor = 'pointer';
            bookmarkName.addEventListener('click', () => {
                window.open(bookmark.url, '_blank'); // 在新标签页打开URL
            });

            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.addEventListener('click', () => {
                const newName = prompt('请输入新的书签名称:', bookmark.name);
                if (newName) {
                    bookmarks[index].name = newName;
                    GM_setValue('bookmarks', bookmarks);
                    displayBookmarks();
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.addEventListener('click', () => {
                bookmarks.splice(index, 1);
                GM_setValue('bookmarks', bookmarks);
                displayBookmarks();
            });

            bookmarkItem.appendChild(bookmarkName);
            bookmarkItem.appendChild(editButton);
            bookmarkItem.appendChild(deleteButton);
            bookmarkList.appendChild(bookmarkItem);
        });
    }

    function manageBookmarks() {
        const bookmarksPage = document.createElement('div');
        bookmarksPage.id = 'bookmarks-page';
        bookmarksPage.style.position = 'fixed';
        bookmarksPage.style.top = '0';
        bookmarksPage.style.left = '0';
        bookmarksPage.style.width = '100%';
        bookmarksPage.style.height = '100%';
        bookmarksPage.style.background = 'rgba(0, 0, 0, 0.5)';
        bookmarksPage.style.display = 'flex';
        bookmarksPage.style.justifyContent = 'center';
        bookmarksPage.style.alignItems = 'center';
        bookmarksPage.style.zIndex = '10000';

        const bookmarksContainer = document.createElement('div');
        bookmarksContainer.style.background = 'white';
        bookmarksContainer.style.padding = '20px';
        bookmarksContainer.style.border = '1px solid #ccc';
        bookmarksContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        bookmarksContainer.style.width = '400px';
        bookmarksContainer.style.maxHeight = '80%';
        bookmarksContainer.style.overflowY = 'auto';

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginBottom = '10px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(bookmarksPage);
        });

        bookmarksContainer.appendChild(closeButton);

        // 显示书签
        const bookmarks = GM_getValue('bookmarks', []);
        bookmarks.forEach((bookmark, index) => {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.style.display = 'flex';
            bookmarkItem.style.justifyContent = 'space-between';
            bookmarkItem.style.marginBottom = '5px';

            const bookmarkName = document.createElement('span');
            bookmarkName.textContent = bookmark.name;

            const editButton = document.createElement('button');
            editButton.textContent = '✏️';
            editButton.addEventListener('click', () => {
                const newName = prompt('请输入新的书签名称:', bookmark.name);
                if (newName) {
                    bookmarks[index].name = newName;
                    GM_setValue('bookmarks', bookmarks);
                    manageBookmarks(); // 重新加载管理页
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.addEventListener('click', () => {
                bookmarks.splice(index, 1);
                GM_setValue('bookmarks', bookmarks);
                manageBookmarks(); // 重新加载管理页
            });

            bookmarkItem.appendChild(bookmarkName);
            bookmarkItem.appendChild(editButton);
            bookmarkItem.appendChild(deleteButton);
            bookmarksContainer.appendChild(bookmarkItem);
        });

        bookmarksPage.appendChild(bookmarksContainer);
        document.body.appendChild(bookmarksPage);
    }

    // 注册菜单命令
    GM_registerMenuCommand('隐藏悬浮图标', () => {
        icon.style.display = 'none';
    });

    GM_registerMenuCommand('管理书签页', () => {
        manageBookmarks();
    });

    GM_registerMenuCommand('添加当前网页到书签', () => {
        const bookmarks = GM_getValue('bookmarks', []);
        const name = prompt('请输入书签名称:', document.title);
        if (name) {
            bookmarks.push({ name, url: window.location.href });
            GM_setValue('bookmarks', bookmarks);
        }
    });
})();
