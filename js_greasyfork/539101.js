// ==UserScript==
// @name         Mobile01 會員標籤
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @author       ziugat
// @description  為 Mobile01 支持自訂會員標籤，便於區分特定帳號
// @license      MIT
// @homepage     https://github.com/ZiugatWong/mobile01-user-tags
// @supportURL   https://github.com/ZiugatWong/mobile01-user-tags
// @match        http://www.mobile01.com/forumtopic.php*
// @match        http://www.mobile01.com/topiclist.php*
// @match        http://www.mobile01.com/topicdetail.php*
// @match        https://www.mobile01.com/forumtopic.php*
// @match        https://www.mobile01.com/topiclist.php*
// @match        https://www.mobile01.com/topicdetail.php*
// @icon         https://www.mobile01.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/539101/Mobile01%20%E6%9C%83%E5%93%A1%E6%A8%99%E7%B1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/539101/Mobile01%20%E6%9C%83%E5%93%A1%E6%A8%99%E7%B1%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tags = GM_getValue('tags', []);
    let userTags = GM_getValue('userTags', {});
    let nameSelectors = '.u-username,.c-link--gn';

    // global css
    GM_addStyle(`
        .tag-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #323231;
            padding: 20px 20px 20px 20px;
            border-radius: 8px;
            border: 1px solid #ccc;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            min-width: 300px;
        }
        .tag-item {
            margin: 2px;
            padding: 2px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-list {
            height: 300px;
            overflow-y: auto;
            margin: 10px 0;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .tag-list {
            height: 300px;
            overflow-y: auto;
            margin: 10px 0;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .user-tag {
            display: inline-block;
            margin-left: 5px;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 0.8em;
            color: white;
            text-shadow: 0 1px 1px rgba(0,0,0,0.2);
        }
        .user-tags {
            display: inline !important;
            margin-left: 8px;
        }
        .context-menu {
            position: absolute;
            background: #323231;
            border: 1px solid #555;
            border-radius: 4px;
            padding: 5px 0;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .context-menu-item {
            padding: 8px 15px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .context-menu-item:hover {
            background: #444;
        }

        .context-menu-item .context-menu-user-tag {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.85em;
            color: white;
            text-shadow: 0 1px 1px rgba(0,0,0,0.2);
            margin-left: 10px;
            white-space: nowrap;
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .context-menu-item .menu-text {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tag-controls {
            display: flex;
            gap: 5px;
        }
    `);

    // panel for tag manager
    class TagManager {
        constructor() {
            this.currentTag = null;
            this.initPanel();
        }

        initPanel() {
            this.panel = document.createElement('div');
            this.panel.className = 'tag-panel';
            this.panel.innerHTML = `
                <div class="panel-header">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <h3 style="margin: 0;">標籤儀表盤</h3>
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 45%;">
                            <button id="exportBtn" class="action-btn">匯出</button>
                            <button id="importBtn" class="action-btn">匯入</button>
                            <div class="close-btn">×</div>
                    </div>
                </div>
                </div>
                <div class="panel-body">
                    <div class="input-group">
                        <h4 style="margin:0 0 10px">標籤管理</h4>
                        <input type="text" id="tagName" placeholder="填入標籤名稱">
                        <input type="color" id="tagColor">
                        <button id="saveTag">保存</button>
                    </div>
                    <div class="tag-list"></div>
                    <div class="user-list"></div>
                </div>
            `;
            document.body.appendChild(this.panel);

            // css addition
            GM_addStyle(`
                .panel-header {
                    position: relative;
                    padding: 0 0 15px 0;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #555;
                }
                .close-btn {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    border-radius: 4px;
                    background: #444;
                    border: 1px solid #555;
                }

                .close-btn:hover {
                    color: #ff4444;
                    background: #555;
                }
            `);

            // define css for export-panel
            GM_addStyle(`
                .export-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #323231;
                    padding: 20px;
                    border-radius: 8px;
                    border: 1px solid #555;
                    z-index: 10001;
                    box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    width: 80%;
                    max-width: 600px;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                }

                .export-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #555;
                }

                .export-content {
                    flex: 1;
                    padding: 10px;
                    background: #2a2a2a;
                    border-radius: 4px;
                    overflow: auto;
                    margin-bottom: 15px;
                    box-sizing: border-box;
                }

                .export-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }

                .export-btn {
                    padding: 6px 12px;
                    background: #444;
                    border: 1px solid #555;
                    border-radius: 4px;
                    color: #eee;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .export-btn:hover {
                    background: #555;
                }

                #exportData {
                    font-family: monospace;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #ddd;
                    margin: 0;
                    white-space: pre-wrap;
                    word-break: break-all;
                }
            `);

            GM_addStyle(`
                #importData {
                    font-family: monospace;
                    font-size: 13px;
                    color: white;
                    background: #2a2a2a;
                    width: 100%;
                    box-sizing: border-box;
                    height: 300px;
                    resize: none;
                    padding: 8px;
                    border: 1px solid #555;
                    border-radius: 0px;
                }
            `);

            this.tagList = this.panel.querySelector('.tag-list');
            this.userList = this.panel.querySelector('.user-list');
            this.bindEvents();
            this.renderTags();
        }

        bindEvents() {
            this.panel.querySelector('#saveTag').addEventListener('click', () => this.saveTag());
            this.panel.querySelector('.close-btn').addEventListener('click', () => {
                this.panel.remove();
            });
            this.panel.querySelector('#exportBtn').addEventListener('click', () => this.showExportPanel());
            this.panel.querySelector('#importBtn').addEventListener('click', () => this.showImportPanel());
        }

        renderTags() {
            this.tagList.innerHTML = `
                <h4 style="margin:10px 0 10px">標籤清單</h4>
                ${tags.map((tag, index) => `
                    <div class="tag-item" data-index="${index}" title="點擊展示關聯會員">
                        <span class="user-tag" style="background:${tag.color}">${tag.name}</span>
                        <div class="tag-controls">
                            <button class="edit">編輯</button>
                            <button class="delete">移除</button>
                        </div>
                    </div>
                `).join('')}
                ${tags?.length ? '' : '<div style="color:#666">無標籤</div>'}
            `;

            this.tagList.querySelectorAll('.tag-item').forEach(item => {
                item.querySelector('.edit').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editTag(item.dataset.index);
                });
                item.querySelector('.delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (confirm('確定移除此標籤？')) this.deleteTag(item.dataset.index);
                });
                item.addEventListener('click', () => this.showUsers(item.dataset.index));
            });
        }

        showUsers(index) {
            const tag = tags[index];
            this.userList.innerHTML = `
                <h4 style="margin:0 0 10px"><span class="user-tag" style="background:${tag.color}">${tag.name}</span> 關聯會員</h4>
                ${(userTags[tag.name] || []).map(user => `
                    <div style="padding:5px">
                        ${user}
                        <button data-user="${user}" style="float:right">移除</button>
                    </div>
                `).join('')}
                ${userTags[tag.name]?.length ? '' : '<div style="color:#666">未關聯會員</div>'}
            `;
            this.userList.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => this.removeUser(tag.name, btn.dataset.user));
            });
        }

        removeUser(tagName, user) {
            userTags[tagName] = (userTags[tagName] || []).filter(u => u !== user);
            GM_setValue('userTags', userTags);
            this.showUsers(tags.findIndex(t => t.name === tagName));
            applyTags();
        }

        saveTag() {
            const nameInput = this.panel.querySelector('#tagName');
            const colorInput = this.panel.querySelector('#tagColor');
            const name = nameInput.value.trim();
            const color = colorInput.value;

            if (!name) {
                alert('必須填入標籤名稱');
                return;
            }

            // rename tag
            let oldName = null;
            if (this.currentTag !== null) {
                oldName = tags[this.currentTag].name;
            }

            // upadate data
            if (this.currentTag !== null) {
                tags[this.currentTag] = { name, color };
                if (oldName && oldName !== name && userTags[oldName]) {
                    userTags[name] = userTags[oldName];
                    delete userTags[oldName];
                }
            } else {
                tags.push({ name, color });
            }

            GM_setValue('tags', tags);
            GM_setValue('userTags', userTags);
            this.currentTag = null;
            nameInput.value = '';
            colorInput.value = '#000000';
            this.renderTags();
            applyTags();
        }

        editTag(index) {
            const tag = tags[index];
            this.panel.querySelector('#tagName').value = tag.name;
            this.panel.querySelector('#tagColor').value = tag.color;
            this.currentTag = index;
        }

        deleteTag(index) {
            const tagName = tags[index].name;
            tags.splice(index, 1);
            delete userTags[tagName];
            GM_setValue('tags', tags);
            GM_setValue('userTags', userTags);
            this.renderTags();
            applyTags();
        }

        showExportPanel() {
            const exportData = {
                tags: GM_getValue('tags', []),
                userTags: GM_getValue('userTags', {})
            };

            const formattedData = JSON.stringify(exportData, null, 2);

            const exportPanel = document.createElement('div');
            exportPanel.className = 'export-panel';
            exportPanel.innerHTML = `
            <div class="export-header">
                <h3 style="margin:0">匯出標籤數據</h3>
                <div class="close-btn">×</div>
            </div>
            <div class="export-content">
                <pre id="exportData">${formattedData}</pre>
            </div>
            <div class="export-actions">
                <button id="copyExportBtn" class="export-btn">複製到剪貼簿</button>
                <button id="closeExportBtn" class="export-btn">關閉</button>
            </div>
        `;

            document.body.appendChild(exportPanel);

            exportPanel.querySelector('.close-btn').addEventListener('click', () => {
                exportPanel.remove();
            });

            exportPanel.querySelector('#closeExportBtn').addEventListener('click', () => {
                exportPanel.remove();
            });

            exportPanel.querySelector('#copyExportBtn').addEventListener('click', () => {
                this.copyToClipboard(formattedData, exportPanel.querySelector('#copyExportBtn'));
            });

            const closeOnOutsideClick = (e) => {
                if (!exportPanel.contains(e.target)) {
                    exportPanel.remove();
                    document.removeEventListener('click', closeOnOutsideClick);
                }
            };

            setTimeout(() => {
                document.addEventListener('click', closeOnOutsideClick);
            });
        }

        copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = '已複製';
                button.style.background = '#2e7d32';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '#444';
                }, 2000);
            }).catch(err => {
                console.error('複製失敗:', err);
                button.textContent = '複製失敗';
                button.style.background = '#c62828';

                setTimeout(() => {
                    button.textContent = '複製到剪貼簿';
                    button.style.background = '#444';
                }, 2000);
            });
        }

        showImportPanel() {
            const importPanel = document.createElement('div');
            importPanel.className = 'export-panel';
            importPanel.innerHTML = `
            <div class="export-header">
                <h3 style="margin:0">匯入標籤數據</h3>
                <div class="close-btn">×</div>
            </div>
            <div class="export-content">
                <textarea id="importData" placeholder="請貼上匯出的JSON格式標籤數據..."></textarea>
            </div>
            <div class="export-actions">
                <button id="confirmImport" class="export-btn">確認匯入</button>
                <button id="cancelImport" class="export-btn">取消</button>
            </div>
        `;

            document.body.appendChild(importPanel);

            importPanel.querySelector('#importData').focus();

            importPanel.querySelector('.close-btn').addEventListener('click', () => {
                importPanel.remove();
            });

            importPanel.querySelector('#cancelImport').addEventListener('click', () => {
                importPanel.remove();
            });

            importPanel.querySelector('#confirmImport').addEventListener('click', () => {
                this.handleImport(importPanel);
            });

            const closeOnOutsideClick = (e) => {
                if (!importPanel.contains(e.target)) {
                    importPanel.remove();
                    document.removeEventListener('click', closeOnOutsideClick);
                }
            };

            setTimeout(() => {
                document.addEventListener('click', closeOnOutsideClick);
            });
        }

        handleImport(panel) {
            const importData = panel.querySelector('#importData').value.trim();

            if (!importData) {
                alert('請填入要匯入的JSON數據');
                return;
            }

            try {
                const parsedData = JSON.parse(importData);

                if (!parsedData.tags || !parsedData.userTags) {
                    throw new Error('JSON數據格式不正確，缺少tags或userTags索引鍵');
                }

                if (!Array.isArray(parsedData.tags)) {
                    throw new Error('tags必須是陣列');
                }

                if (!confirm('匯入將覆蓋現有標籤數據，確定要繼續嗎？')) {
                    return;
                }

                GM_setValue('tags', parsedData.tags);
                GM_setValue('userTags', parsedData.userTags);

                tags = parsedData.tags;
                userTags = parsedData.userTags;
                this.renderTags();
                applyTags();

                panel.remove();

                alert('匯入成功');
            } catch (error) {
                alert(`匯入失敗: ${error.message}`);
            }
        }
    }

    // show tags
    function applyTags() {
        document.querySelectorAll(nameSelectors).forEach(userEl => {
            const username = userEl.textContent.trim();
            let tagsHtml = '';

            Object.entries(userTags).forEach(([tagName, users]) => {
                const tagExists = tags.some(t => t.name === tagName);
                if (tagExists && users.includes(username)) {
                    const tag = tags.find(t => t.name === tagName);
                    tagsHtml += `<span class="user-tag" style="background:${tag.color}">${tag.name}</span>`;
                }
            });

            // remove old tags
            let tagContainer = userEl.nextElementSibling;
            if (tagContainer?.classList?.contains('user-tags')) {
                tagContainer.remove();
            }

            // show tags
            if (tagsHtml) {
                userEl.insertAdjacentHTML(
                    "afterend",
                    `<span class="user-tags" style="display: inline;">${tagsHtml}</span>`
                );
            }
        });
    }

    document.addEventListener('contextmenu', (e) => {
        const target = e.target.closest(nameSelectors);
        if (target) {
            e.preventDefault();
            showContextMenu(target, e.pageX, e.pageY);
        }
    });

    function showContextMenu(target, x, y) {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;

        if (tags.length === 0) {
            const item = document.createElement('div');
            item.className = 'context-menu-item';
            item.textContent = '請先創建標籤';
            item.style.color = '#999';
            item.style.cursor = 'default';
            menu.appendChild(item);
        } else {
            const username = target.textContent.trim();
            const hasTags = Object.entries(userTags).some(([tagName, users]) =>
                                                            tags.some(t => t.name === tagName) && users.includes(username)
                                                            );

            if (hasTags) {
                const removeItem = document.createElement('div');
                removeItem.className = 'context-menu-item';
                removeItem.innerHTML = '取消關聯的所有標籤';
                removeItem.addEventListener('click', () => {
                    Object.keys(userTags).forEach(tagName => {
                        userTags[tagName] = userTags[tagName].filter(u => u !== username);
                    });
                    GM_setValue('userTags', userTags);
                    applyTags();
                    menu.remove();
                });
                menu.appendChild(removeItem);

                const divider = document.createElement('div');
                divider.style.height = '1px';
                divider.style.background = '#555';
                divider.style.margin = '5px 0';
                menu.appendChild(divider);
            }

            tags.forEach(tag => {
                const item = document.createElement('div');
                item.className = 'context-menu-item';

                const isTagged = (userTags[tag.name] || []).includes(username);

                const menuText = document.createElement('span');
                menuText.className = 'menu-text';
                menuText.textContent = isTagged ? '取消關聯' : '關聯到';

                const tagSpan = document.createElement('span');
                tagSpan.className = 'context-menu-user-tag';
                tagSpan.textContent = tag.name;
                tagSpan.style.backgroundColor = tag.color;

                item.appendChild(menuText);
                item.appendChild(tagSpan);

                item.addEventListener('click', () => {
                    if (isTagged) {
                        // 取消關聯
                        userTags[tag.name] = (userTags[tag.name] || []).filter(u => u !== username);
                    } else {
                        // 添加關聯
                        userTags[tag.name] = [...new Set([...(userTags[tag.name] || []), username])];
                    }
                    GM_setValue('userTags', userTags);
                    applyTags();
                    menu.remove();
                });
                menu.appendChild(item);
            });
        }

        document.body.appendChild(menu);

        // click other location to close
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
                document.removeEventListener('contextmenu', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
            document.addEventListener('contextmenu', closeMenu);
        });
    }

    GM_registerMenuCommand("標籤儀表盤", () => {
        new TagManager();
    });

    applyTags();
})();