// ==UserScript==
// @name         晋江文学城作者屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在搜索结果页面屏蔽不想看的作者的文章
// @author       CursorAI
// @license MIT
// @match        *://*.jjwxc.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/518578/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E4%BD%9C%E8%80%85%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/518578/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E4%BD%9C%E8%80%85%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .block-panel {
            position: fixed;
            right: 20px;
            top: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 1001;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            width: 300px;
            transition: all 0.3s ease;
        }
        .block-panel.login-active {
            top: 320px !important;
        }
        .block-panel h3 {
            margin: 0 0 10px 0;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .block-panel input {
            padding: 5px;
            margin-right: 5px;
            width: 200px;
        }
        .block-panel button {
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .blocked-content {
            display: none !important;
        }
        #blockList {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 10px;
            display: none;
        }
        #blockList.show {
            display: block;
        }
        .author-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            border-bottom: 1px solid #eee;
        }
        .remove-btn {
            background: #ff4444 !important;
            padding: 2px 8px !important;
            font-size: 12px;
        }
        .toggle-btn {
            background: #666 !important;
        }
    `);

    let blockedAuthors = GM_getValue('blockedAuthors', []);
    let contextMenu = null;

    // 添加一个辅助函数来检查登录状态
    function hasLoginElements() {
        return document.getElementById('qrCodeDiv') || document.querySelector('.login-qrcode');
    }

    // 简化 createControlPanel 函数
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'block-panel';

        if (hasLoginElements()) {
            panel.classList.add('login-active');
        }

        panel.innerHTML = `
            <h3>
                作者屏蔽
                <button class="toggle-btn" id="toggleList">显示列表</button>
            </h3>
            <div>
                <input type="text" id="authorInput" placeholder="输入要屏蔽的作者名称">
                <button id="addBlock">添加</button>
            </div>
            <div id="blockList"></div>
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button id="exportList" style="background: #666;">导出列表</button>
                <button id="importList" style="background: #666;">导入列表</button>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('addBlock').addEventListener('click', () => addBlockedAuthor());
        document.getElementById('toggleList').addEventListener('click', toggleBlockList);

        // 绑定导出/导入事件
        document.getElementById('exportList').addEventListener('click', exportBlockList);
        document.getElementById('importList').addEventListener('click', importBlockList);

        updateBlockList();
    }

    // 切换列表显示
    function toggleBlockList() {
        const blockList = document.getElementById('blockList');
        const toggleBtn = document.getElementById('toggleList');
        const isShown = blockList.classList.toggle('show');
        toggleBtn.textContent = isShown ? '隐藏列表' : '显示列表';
    }

    // 创建右键菜单
    function createContextMenu(e, author) {
        if (contextMenu) {
            contextMenu.remove();
        }

        // 创建新菜单元素
        const menu = document.createElement('div');

        // 获取鼠标位置
        const x = e.clientX;
        const y = e.clientY;

        // 获取窗口尺寸
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const menuWidth = 150;
        const menuHeight = 40;

        // 调整位置，确保菜单不会超出视窗
        let adjustedX = x;
        let adjustedY = y;

        // 如果菜单会超出右边界，向左偏移
        if (x + menuWidth > windowWidth) {
            adjustedX = x - menuWidth;
        }

        // 如果菜单会超出下边界，向上偏移
        if (y + menuHeight > windowHeight) {
            adjustedY = y - menuHeight;
        }

        const menuStyle = `
            position: fixed;
            left: ${adjustedX}px;
            top: ${adjustedY}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px 0;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            z-index: 999999 !important;
            min-width: 120px;
            user-select: none;
            font-size: 14px;
            color: #333;
        `.trim();

        menu.style.cssText = menuStyle;

        // 创建菜单项
        const menuItem = document.createElement('div');
        const menuItemStyle = `
            padding: 8px 15px;
            cursor: pointer;
            white-space: nowrap;
            background: white;
            transition: background-color 0.2s;
        `.trim();

        menuItem.style.cssText = menuItemStyle;

        const isBlocked = blockedAuthors.includes(author);
        menuItem.textContent = `${isBlocked ? '取消屏蔽' : '屏蔽'} "${author}"`;

        // 添加hover效果
        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = '#f0f0f0';
        });

        menuItem.addEventListener('mouseout', () => {
            menuItem.style.backgroundColor = 'white';
        });

        // 添加点击事件
        menuItem.addEventListener('click', () => {
            if (isBlocked) {
                removeBlockedAuthor(author);
            } else {
                addBlockedAuthor(author);
            }
            menu.remove();
            contextMenu = null;
        });

        menu.appendChild(menuItem);
        document.body.appendChild(menu);
        contextMenu = menu;
    }

    // 修改绑定右键事件的函数
    function bindContextMenu() {
        document.addEventListener('contextmenu', function(e) {
            const authorLink = e.target.closest('a[href*="oneauthor.php"]');
            if (authorLink) {
                e.preventDefault();
                e.stopPropagation();
                const author = authorLink.textContent.trim();
                createContextMenu(e, author);  // 传入事件对象
                return false;
            }
        }, true);

        // 点击其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (contextMenu && !contextMenu.contains(e.target)) {
                contextMenu.remove();
                contextMenu = null;
            }
        });
    }

    // 添加屏蔽作者
    function addBlockedAuthor(author) {
        const authorName = author || document.getElementById('authorInput')?.value.trim();
        if (authorName && !blockedAuthors.includes(authorName)) {
            blockedAuthors.push(authorName);
            GM_setValue('blockedAuthors', blockedAuthors);
            updateBlockList();
            hideBlockedContent();
            if (document.getElementById('authorInput')) {
                document.getElementById('authorInput').value = '';
            }
        }
    }

    // 移除屏蔽作者
    function removeBlockedAuthor(author) {
        blockedAuthors = blockedAuthors.filter(a => a !== author);
        GM_setValue('blockedAuthors', blockedAuthors);
        updateBlockList();
        hideBlockedContent();
    }

    // 更新屏蔽列表显示
    function updateBlockList() {
        const blockList = document.getElementById('blockList');
        if (blockList) {
            blockList.innerHTML = blockedAuthors
                .sort((a, b) => a.localeCompare(b, 'zh-CN'))
                .map(author => `
                    <div class="author-item">
                        <span class="author-name">${author}</span>
                        <button class="remove-btn" data-author="${author}">删除</button>
                    </div>
                `).join('');

            blockList.querySelectorAll('.remove-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const author = this.getAttribute('data-author');
                    removeBlockedAuthor(author);
                });
            });
        }
    }

    // 隐藏被屏蔽的内容
    function hideBlockedContent() {
        const authorElements = document.querySelectorAll('a[href*="oneauthor.php"]');
        authorElements.forEach(authorElement => {
            const authorName = authorElement.textContent.trim();
            if (blockedAuthors.includes(authorName)) {
                let articleContainer = authorElement.closest('tr');
                if (articleContainer) {
                    articleContainer.classList.add('blocked-content');
                }
            }
        });
    }

    // 导出黑名单
    function exportBlockList() {
        const data = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            authors: blockedAuthors
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `晋江作者黑名单_${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 导入黑名单
    function importBlockList() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    // 验证文件格式
                    if (!data.authors || !Array.isArray(data.authors)) {
                        throw new Error('无效的黑名单文件格式');
                    }

                    // 显示导入选项对话框
                    const importType = confirm(
                        `发现 ${data.authors.length} 个作者。\n` +
                        `点击"确定"合并到当前列表\n` +
                        `点击"取消"覆盖当前列表`
                    );

                    if (importType) {
                        // 合并选项：添加新作者到现有列表
                        const newAuthors = data.authors.filter(author => !blockedAuthors.includes(author));
                        if (newAuthors.length > 0) {
                            blockedAuthors = [...blockedAuthors, ...newAuthors];
                            GM_setValue('blockedAuthors', blockedAuthors);
                            updateBlockList();
                            hideBlockedContent();
                            alert(`合并成功！新增 ${newAuthors.length} 个作者。`);
                        } else {
                            alert('没有新的作者需要添加。');
                        }
                    } else {
                        // 覆盖选项：完全替换现有列表
                        blockedAuthors = [...new Set(data.authors)]; // 去重
                        GM_setValue('blockedAuthors', blockedAuthors);
                        updateBlockList();
                        hideBlockedContent();
                        alert(`覆盖成功！共导入 ${blockedAuthors.length} 个作者。`);
                    }
                } catch (err) {
                    alert('导入失败：' + err.message);
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    // 简化 observer 部分
    const observer = new MutationObserver(() => {
        const panel = document.querySelector('.block-panel');
        if (panel) {
            panel.classList.toggle('login-active', hasLoginElements());
        }
    });

    // 初始化
    function init() {
        setTimeout(() => {
            // 清理可能存在的旧面板
            const oldPanels = document.querySelectorAll('.block-panel');
            oldPanels.forEach(panel => panel.remove());

            // 创建新面板
            createControlPanel();
            hideBlockedContent();
            bindContextMenu();

            // 找到所有可能的登录按钮
            const loginLinks = document.querySelectorAll('a[href*="login"], a[onclick*="login"]');
            loginLinks.forEach(link => {
                link.addEventListener('click', () => {
                    document.querySelector('.block-panel')?.classList.add('login-active');
                });
            });

            // 监听关闭按钮
            document.addEventListener('click', (e) => {
                if (e.target.matches('a[onclick*="unblockUI"]')) {
                    document.querySelector('.block-panel')?.classList.remove('login-active');
                }
            });

            // 添加登录元素检测和位置调整
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }, 1500);
    }

    window.addEventListener('load', init);
})();