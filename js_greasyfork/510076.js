// ==UserScript==
// @name         超级书签管理器软件
// @namespace    http://tampermonkey.net/
// @version      1.24
// @description  超级书签管理器是一个高效的书签管理工具，提供了添加、编辑、删除、排序、导出和导入书签的功能。界面简洁美观，支持拖拽排序和一次打开多个书签，提升用户的书签管理体验。
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @author       wll
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_log
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/510076/%E8%B6%85%E7%BA%A7%E4%B9%A6%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/510076/%E8%B6%85%E7%BA%A7%E4%B9%A6%E7%AD%BE%E7%AE%A1%E7%90%86%E5%99%A8%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

/* 脚本特点及好处：
 * 1. **集中管理**：提供一个居中显示的书签管理界面，可以一次性管理所有书签。
 * 2. **快速添加**：通过菜单选项快速添加当前页面为书签，支持自定义书签名称。
 * 3. **拖放排序**：支持拖放功能，可以方便地对书签进行排序调整。
 * 4. **多列展示**：书签以最多四列的方式展示，布局合理，方便查看。
 * 5. **书签编辑和删除**：提供直观的编辑和删除按钮，方便快速修改或移除书签。
 * 6. **数据存储**：利用油猴自带的数据存储功能，确保书签数据持久保存。
 * 7. **导入导出**：支持书签的导入和导出功能，方便在不同设备之间迁移书签。
 * 8. **多选打开**：可以一次选择多个书签，并一键打开所有选中的书签。
 * 9. **通知提示**：操作成功后会弹出通知提示，无需点击确认，操作体验流畅。
 * 10. **精致界面**：界面美观简洁，字体和元素大小适中，小巧精致，提供良好的用户体验。

体验其便捷和高效的书签管理功能。
*/
(function() {
    'use strict';

    const defaultBookmarks = [
        { title: '百度', url: 'https://www.baidu.com' },
        { title: '搜狗', url: 'https://www.sogou.com' },
        { title: 'Bing', url: 'https://www.bing.com' },
        { title: '谷歌', url: 'https://www.google.com' }
    ];

    let isManagerOpen = false;

    // GM_log("脚本初始化中...");

    GM_registerMenuCommand("管理书签", async () => {
        // GM_log("管理书签菜单被点击");
        if (!isManagerOpen) {
            await openBookmarkManager();
        }
    });

    GM_registerMenuCommand("添加当前页到书签", async () => {
        // GM_log("添加当前页到书签菜单被点击");
        await addCurrentPageBookmark();
    });

    async function initializeBookmarks() {
        // GM_log("初始化书签数据...");
        let bookmarks = await GM_getValue('bookmarks', null);
        if (!bookmarks) {
            bookmarks = defaultBookmarks;
            await GM_setValue('bookmarks', bookmarks);
            // GM_log("书签已初始化为默认数据");
        }
        return bookmarks;
    }

    async function getBookmarks() {
        const bookmarks = await GM_getValue('bookmarks', defaultBookmarks);
        // GM_log("书签数据已获取", bookmarks);
        return bookmarks;
    }

    async function setBookmarks(bookmarks) {
        // GM_log("设置书签数据", bookmarks);
        await GM_setValue('bookmarks', bookmarks);
    }

    async function getSelectedBookmarks() {
        const selectedBookmarks = await GM_getValue('selectedBookmarks', []);
        // GM_log("获取选择的书签", selectedBookmarks);
        return selectedBookmarks;
    }

    async function setSelectedBookmarks(selectedBookmarks) {
        // GM_log("设置选择的书签", selectedBookmarks);
        await GM_setValue('selectedBookmarks', selectedBookmarks);
    }

    function showNotification(message) {
        // GM_log("显示通知:", message);
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px';
        notification.style.backgroundColor = '#007bfa';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 1500); // 提示时间为 1.5 秒
    }

    async function addCurrentPageBookmark() {
        // GM_log("添加当前页面到书签");
        const bookmarks = await getBookmarks();
        const currentUrl = window.location.href;
        const currentTitle = document.title;
        if (!bookmarks.some(bookmark => bookmark.url === currentUrl)) {
            const newTitle = prompt('输入书签名称', currentTitle);
            if (newTitle !== null && newTitle.trim() !== '') {
                const newBookmark = { title: newTitle.trim(), url: currentUrl };
                bookmarks.push(newBookmark);
                await setBookmarks(bookmarks);
                showNotification('书签已添加');
                await renderBookmarks();
            }
        } else {
            showNotification('该页面已经在书签中');
        }
    }

    async function exportBookmarks() {
        // GM_log("导出书签");
        const bookmarks = await getBookmarks();
        const date = new Date();
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `超级书签管理器_${dateStr}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        showNotification('书签已导出');
    }

    async function importBookmarks() {
        // GM_log("导入书签");
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const importedBookmarks = JSON.parse(e.target.result);
                        const existingBookmarks = await getBookmarks();
                        const newBookmarks = importedBookmarks.filter(bookmark =>
                            !existingBookmarks.some(existing => existing.url === bookmark.url)
                        );
                        if (newBookmarks.length > 0) {
                            const allBookmarks = existingBookmarks.concat(newBookmarks);
                            await setBookmarks(allBookmarks);
                            await renderBookmarks();
                            showNotification(`书签已导入，共导入${newBookmarks.length}条新书签`);
                        } else {
                            showNotification('没有新书签被导入');
                        }
                    } catch (error) {
                        showNotification('导入失败: 无效的 JSON 文件');
                    }
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    }

    // 渲染书签列表
    async function renderBookmarks() {
        // GM_log("渲染书签列表");
        const bookmarkList = document.querySelector('.bookmark-list');
        if (!bookmarkList) {
            // GM_log("未找到书签列表元素");
            return;
        }

        const bookmarks = await getBookmarks();
        const selectedBookmarks = await getSelectedBookmarks();

        // GM_log("即将渲染的书签数据：", bookmarks);

        bookmarkList.innerHTML = ''; // Clear the list before re-rendering

        bookmarks.forEach((bookmark, index) => {
            const card = document.createElement('div');
            card.style.position = 'relative';
            card.style.border = '1px solid #ccc';
            card.style.padding = '10px';
            card.style.borderRadius = '5px';
            card.style.backgroundColor = '#fff';
            card.draggable = true;
            card.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', index);
            };
            card.ondragover = (e) => {
                e.preventDefault();
            };
            card.ondrop = async (e) => {
                e.preventDefault();
                const draggedIndex = e.dataTransfer.getData('text/plain');
                const draggedBookmark = bookmarks.splice(draggedIndex, 1)[0];
                bookmarks.splice(index, 0, draggedBookmark);
                await setBookmarks(bookmarks);
                await renderBookmarks();
                showNotification('书签已排序');
            };

            const editButton = document.createElement('span');
            editButton.innerHTML = '✎';
            editButton.title = '编辑';
            editButton.style.position = 'absolute';
            editButton.style.top = '5px';
            editButton.style.left = '5px';
            editButton.style.fontSize = '14px';
            editButton.style.cursor = 'pointer';
            editButton.onclick = async (e) => {
                e.stopPropagation();
                const newTitle = prompt('输入新的书签名称', bookmark.title);
                if (newTitle !== null && newTitle.trim() !== '') {
                    bookmark.title = newTitle.trim();
                    await setBookmarks(bookmarks);
                    await renderBookmarks();
                    showNotification('书签已修改');
                }
            };
            card.appendChild(editButton);

            const removeButton = document.createElement('span');
            removeButton.innerHTML = '🗑';
            removeButton.title = '删除';
            removeButton.style.position = 'absolute';
            removeButton.style.bottom = '5px';
            removeButton.style.left = '5px';
            removeButton.style.fontSize = '14px';
            removeButton.style.cursor = 'pointer';
            removeButton.onclick = async (e) => {
                e.stopPropagation();
                bookmarks.splice(index, 1);
                await setBookmarks(bookmarks);
                await renderBookmarks();
                showNotification('书签已删除');
            };
            card.appendChild(removeButton);

            const title = document.createElement('div');
            title.textContent = bookmark.title;
            title.style.marginBottom = '30px';
            title.style.cursor = 'pointer';
            title.style.color = '#007bfa';
            title.style.paddingRight = '20px';
            title.onmouseover = () => { title.style.textDecoration = 'underline'; };
            title.onmouseout = () => { title.style.textDecoration = 'none'; };
            title.onclick = (e) => {
                if (e.target !== editButton && e.target !== removeButton) {
                    window.open(bookmark.url, '_blank');
                }
            };
            card.appendChild(title);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'bookmark-checkbox';
            checkbox.style.position = 'absolute';
            checkbox.style.top = '5px';
            checkbox.style.right = '5px';
            checkbox.setAttribute('data-url', bookmark.url);
            checkbox.checked = selectedBookmarks.includes(bookmark.url);
            checkbox.onclick = async (e) => {
                e.stopPropagation();
                if (checkbox.checked) {
                    selectedBookmarks.push(bookmark.url);
                } else {
                    const index = selectedBookmarks.indexOf(bookmark.url);
                    if (index !== -1) {
                        selectedBookmarks.splice(index, 1);
                    }
                }
                await setSelectedBookmarks(selectedBookmarks);
            };
            card.appendChild(checkbox);

            card.onclick = (e) => {
                if (e.target !== checkbox && e.target !== editButton && e.target !== removeButton && e.target !== title) {
                    window.open(bookmark.url, '_blank');
                }
            };

            bookmarkList.appendChild(card);
        });

        // GM_log("书签列表渲染完成");
    }

    async function openBookmarkManager() {
        // GM_log("打开书签管理器");
        isManagerOpen = true;

        await initializeBookmarks();

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9999';
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(bookmarkUI);
            isManagerOpen = false;
            // GM_log("关闭书签管理器");
        };

        const bookmarkUI = document.createElement('div');
        bookmarkUI.className = 'bookmark-manager';
        bookmarkUI.style.position = 'fixed';
        bookmarkUI.style.top = '50%';
        bookmarkUI.style.left = '50%';
        bookmarkUI.style.transform = 'translate(-50%, -50%)';
        bookmarkUI.style.width = '600px';
        bookmarkUI.style.backgroundColor = '#f9f9f9';
        bookmarkUI.style.border = '1px solid #ccc';
        bookmarkUI.style.padding = '20px';
        bookmarkUI.style.zIndex = '10000';
        bookmarkUI.style.maxHeight = '80%';
        bookmarkUI.style.overflowY = 'auto';
        bookmarkUI.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        bookmarkUI.style.borderRadius = '10px';
        bookmarkUI.style.fontFamily = 'Arial, sans-serif';
        bookmarkUI.onclick = (e) => {
            e.stopPropagation();
        };

        const title = document.createElement('h2');
        title.textContent = '书签管理';
        title.style.textAlign = 'center';
        title.style.marginTop = '0';
        bookmarkUI.appendChild(title);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginBottom = '10px';
        bookmarkUI.appendChild(buttonContainer);

        const addButton = document.createElement('button');
        addButton.textContent = '添加当前页到书签';
        addButton.style.backgroundColor = '#007bfa';
        addButton.style.color = 'white';
        addButton.style.border = 'none';
        addButton.style.padding = '10px';
        addButton.style.borderRadius = '5px';
        addButton.style.cursor = 'pointer';
        addButton.onmouseover = () => { addButton.style.backgroundColor = '#005bb5'; };
        addButton.onmouseout = () => { addButton.style.backgroundColor = '#007bfa'; };
        addButton.onclick = async () => {
            await addCurrentPageBookmark();
            await renderBookmarks();
        };
        buttonContainer.appendChild(addButton);

        const exportButton = document.createElement('button');
        exportButton.textContent = '导出书签';
        exportButton.style.backgroundColor = '#007bfa';
        exportButton.style.color = 'white';
        exportButton.style.border = 'none';
        exportButton.style.padding = '10px';
        exportButton.style.borderRadius = '5px';
        exportButton.style.cursor = 'pointer';
        exportButton.onmouseover = () => { exportButton.style.backgroundColor = '#005bb5'; };
        exportButton.onmouseout = () => { exportButton.style.backgroundColor = '#007bfa'; };
        exportButton.onclick = async () => {
            await exportBookmarks();
        };
        buttonContainer.appendChild(exportButton);

        const importButton = document.createElement('button');
        importButton.textContent = '导入书签';
        importButton.style.backgroundColor = '#007bfa';
        importButton.style.color = 'white';
        importButton.style.border = 'none';
        importButton.style.padding = '10px';
        importButton.style.borderRadius = '5px';
        importButton.style.cursor = 'pointer';
        importButton.onmouseover = () => { importButton.style.backgroundColor = '#005bb5'; };
        importButton.onmouseout = () => { importButton.style.backgroundColor = '#007bfa'; };
        importButton.onclick = async () => {
            await importBookmarks();
            await renderBookmarks();
        };
        buttonContainer.appendChild(importButton);

        const openMultipleButton = document.createElement('button');
        openMultipleButton.textContent = '打开选择的书签';
        openMultipleButton.style.backgroundColor = '#007bfa';
        openMultipleButton.style.color = 'white';
        openMultipleButton.style.border = 'none';
        openMultipleButton.style.padding = '10px';
        openMultipleButton.style.borderRadius = '5px';
        openMultipleButton.style.cursor = 'pointer';
        openMultipleButton.onmouseover = () => { openMultipleButton.style.backgroundColor = '#005bb5'; };
        openMultipleButton.onmouseout = () => { openMultipleButton.style.backgroundColor = '#007bfa'; };
        openMultipleButton.onclick = () => {
            const selectedCheckboxes = document.querySelectorAll('.bookmark-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                showNotification('请选择至少一个书签');
                return;
            }
            selectedCheckboxes.forEach(checkbox => {
                const url = checkbox.getAttribute('data-url');
                window.open(url, '_blank');
            });
        };
        buttonContainer.appendChild(openMultipleButton);

        const bookmarkList = document.createElement('div');
        bookmarkList.className = 'bookmark-list';
        bookmarkList.style.display = 'grid';
        bookmarkList.style.gridTemplateColumns = 'repeat(auto-fit, minmax(120px, 1fr))';
        bookmarkList.style.gap = '10px';
        bookmarkList.style.minHeight = '200px';
        bookmarkUI.appendChild(bookmarkList);

        document.body.appendChild(overlay);
        document.body.appendChild(bookmarkUI);

        await renderBookmarks();  // 确保渲染书签列表在元素创建后执行
    }

    initializeBookmarks();

})();
