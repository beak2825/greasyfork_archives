// ==UserScript==
// @name         妖火黑名单Pro
// @version      2.4
// @description  屏蔽妖火网特定用户的帖子和回复，支持按用户ID/用户名/关键词屏蔽，兼容新旧页面格式.
// @match        *://yaohuo.me/*
// @match        *://www.yaohuo.me/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1361841
// @downloadURL https://update.greasyfork.org/scripts/539495/%E5%A6%96%E7%81%AB%E9%BB%91%E5%90%8D%E5%8D%95Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/539495/%E5%A6%96%E7%81%AB%E9%BB%91%E5%90%8D%E5%8D%95Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置需要屏蔽的用户ID、用户名和关键词
    let blockedUserIds = ['998', '999'];
    let blockedUsernames = ['屏蔽用户名1', '屏蔽用户名2'];
    let blockedKeywords = ['组队', '拼团'];

    // 不可屏蔽的特殊用户列表
    const protectedUserIds = ['1000'];
    const protectedUsernames = ['Clover'];

    // 保存屏蔽列表到本地存储（增加特殊用户校验）
    function saveBlockedList() {
        try {
            // 过滤掉特殊用户ID
            blockedUserIds = blockedUserIds.filter(id => !protectedUserIds.includes(id));
            // 过滤掉特殊用户用户名
            blockedUsernames = blockedUsernames.filter(name => !protectedUsernames.includes(name));

            localStorage.setItem('yaohuo_blocked_user_ids', JSON.stringify(blockedUserIds));
            localStorage.setItem('yaohuo_blocked_usernames', JSON.stringify(blockedUsernames));
            localStorage.setItem('yaohuo_blocked_keywords', JSON.stringify(blockedKeywords));
        } catch (error) {
            console.error('保存屏蔽列表时出错:', error);
        }
    }

    // 从本地存储加载屏蔽列表
    function loadBlockedList() {
        try {
            const savedIds = localStorage.getItem('yaohuo_blocked_user_ids');
            const savedNames = localStorage.getItem('yaohuo_blocked_usernames');
            const savedKeywords = localStorage.getItem('yaohuo_blocked_keywords');

            if (savedIds) {
                blockedUserIds = JSON.parse(savedIds);
            }

            if (savedNames) {
                blockedUsernames = JSON.parse(savedNames);
            }

            if (savedKeywords) {
                blockedKeywords = JSON.parse(savedKeywords);
            }
        } catch (error) {
            console.error('加载屏蔽列表时出错:', error);
        }
    }

    // 隐藏回复（兼容新旧格式）
    function hideReplies() {
        try {
            // 处理新格式回复区域（.forum-post）
            document.querySelectorAll('.forum-post').forEach(post => {
                const userIdElement = post.querySelector('.user-id a');
                const usernameElement = post.querySelector('.user-nick a');

                if (userIdElement) {
                    const userIdMatch = userIdElement.textContent.match(/\((\d+)\)/);
                    const userId = userIdMatch ? userIdMatch[1] : '';

                    if (userId && blockedUserIds.includes(userId)) {
                        post.style.display = 'none';
                        return;
                    }
                }

                if (usernameElement && blockedUsernames.some(name => usernameElement.textContent.trim().includes(name))) {
                    post.style.display = 'none';
                    return;
                }
            });

            // 处理旧格式回复区域（.reline.list-reply）
            document.querySelectorAll('.reline.list-reply').forEach(reply => {
                const userIdElement = reply.querySelector('.renickid');
                const usernameElement = reply.querySelector('.renick a');

                if (userIdElement && blockedUserIds.includes(userIdElement.textContent.trim())) {
                    reply.style.display = 'none';
                    return;
                }

                if (usernameElement && blockedUsernames.some(name => usernameElement.textContent.trim().includes(name))) {
                    reply.style.display = 'none';
                    return;
                }
            });
        } catch (error) {
            console.error('隐藏回复时出错:', error);
        }
    }

    // 隐藏首页推荐中含关键词的主题
    function hideTopicsOnHomePage() {
        try {
            const homePage = document.querySelector('.list');
            if (homePage) {
                homePage.querySelectorAll('a').forEach(link => {
                    const title = link.textContent.trim();
                    if (blockedKeywords.some(keyword => title.includes(keyword))) {
                        link.textContent = '';
                        link.href = 'javascript:;';
                        link.style.display = 'none';
                    }
                });
            }
        } catch (error) {
            console.error('处理首页推荐时出错:', error);
        }
    }

    // 隐藏最新帖子中含关键词或屏蔽用户的主题
    function hideTopicsInList() {
        try {
            document.querySelectorAll('.listdata.line1, .listdata.line2').forEach(topic => {
                const usernameElement = topic.querySelector('.louzhunicheng');
                const titleElement = topic.querySelector('a.topic-link');

                // 检查用户名屏蔽
                if (usernameElement && blockedUsernames.some(name => usernameElement.textContent.trim().includes(name))) {
                    topic.style.display = 'none';
                    return;
                }

                // 检查关键词屏蔽
                if (titleElement) {
                    const title = titleElement.textContent.trim();
                    if (blockedKeywords.some(keyword => title.includes(keyword))) {
                        topic.style.display = 'none';
                    }
                }
            });
        } catch (error) {
            console.error('处理最新帖子时出错:', error);
        }
    }

    // 创建屏蔽名单管理界面（增加特殊用户校验）
    function createBlockListManager() {
        if (document.querySelector('.yaohuo-block-list-modal')) return;

        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'yaohuo-block-list-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%; /* 增加宽度适配移动端 */
            max-width: 600px;
            background: white;
            padding: 15px; /* 减少内边距 */
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            max-height: 90vh; /* 增加最大高度 */
            box-sizing: border-box; /* 包含内边距和边框 */
        `;

        // 头部
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            font-size: 18px; /* 增大字体 */
        `;

        const title = document.createElement('h3');
        title.textContent = '屏蔽名单管理';
        title.style.margin = '0';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 22px; /* 增大关闭按钮 */
            cursor: pointer;
            padding: 5px; /* 增加点击区域 */
        `;
        closeBtn.onclick = () => {
            const overlay = document.querySelector('.yaohuo-block-list-overlay');
            if (overlay) document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 编辑区域
        const editSection = document.createElement('div');
        editSection.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: 15px; /* 减少间距 */
            overflow-y: auto; /* 添加滚动条支持 */
            max-height: calc(90vh - 120px); /* 计算最大高度 */
        `;

        // 用户ID编辑区域
        addEditField(editSection, 'yaohuo-blocked-id-input', '按用户ID屏蔽 (不可屏蔽管理)', blockedUserIds.join(','));
        // 用户名编辑区域
        addEditField(editSection, 'yaohuo-blocked-username-input', '按用户名屏蔽 (不可屏蔽管理)', blockedUsernames.join(','));
        // 关键词编辑区域
        addEditField(editSection, 'yaohuo-blocked-keyword-input', '按主题关键词屏蔽 (英文逗号分隔)', blockedKeywords.join(','));

        // 按钮区域 - 使用flex布局
        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = `
            display: flex;
            justify-content: space-between; /* 改为两端对齐 */
            padding-top: 15px;
            border-top: 1px solid #eee;
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        saveBtn.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px; /* 增大按钮 */
            border-radius: 4px;
            cursor: pointer;
            width: 48%; /* 占比48%，留出间距 */
            font-size: 16px; /* 增大字体 */
        `;

        saveBtn.onclick = () => {
            const idInput = document.getElementById('yaohuo-blocked-id-input').value.trim();
            const nameInput = document.getElementById('yaohuo-blocked-username-input').value.trim();
            const keywordInput = document.getElementById('yaohuo-blocked-keyword-input').value.trim();

            // 解析新的屏蔽列表
            let newIds = idInput ? idInput.split(',').map(id => id.trim()) : [];
            let newNames = nameInput ? nameInput.split(',').map(name => name.trim()) : [];
            let newKeywords = keywordInput ? keywordInput.split(',').map(keyword => keyword.trim()) : [];

            // 校验并过滤特殊用户
            const idHasProtected = newIds.some(id => protectedUserIds.includes(id));
            const nameHasProtected = newNames.some(name => protectedUsernames.includes(name));

            if (idHasProtected) {
                alert('警告: 用户ID 1000为论坛管理用户，无法添加到屏蔽列表！');
                newIds = newIds.filter(id => !protectedUserIds.includes(id));
            }

            if (nameHasProtected) {
                alert('警告: 用户名"Clover"为论坛管理用户，无法添加到屏蔽列表！');
                newNames = newNames.filter(name => !protectedUsernames.includes(name));
            }

            blockedUserIds = newIds;
            blockedUsernames = newNames;
            blockedKeywords = newKeywords;

            saveBlockedList();
            applyBlockingRules();
            document.body.removeChild(modal);
            const overlay = document.querySelector('.yaohuo-block-list-overlay');
            if (overlay) document.body.removeChild(overlay);
        };

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 15px; /* 增大按钮 */
            border-radius: 4px;
            cursor: pointer;
            width: 48%; /* 占比48%，留出间距 */
            font-size: 16px; /* 增大字体 */
        `;

        closeButton.onclick = () => {
            document.body.removeChild(modal);
            const overlay = document.querySelector('.yaohuo-block-list-overlay');
            if (overlay) document.body.removeChild(overlay);
        };

        buttonSection.appendChild(closeButton);
        buttonSection.appendChild(saveBtn);

        // 组装模态框
        modal.appendChild(header);
        modal.appendChild(editSection);
        modal.appendChild(buttonSection);

        // 添加遮罩
        const overlay = document.createElement('div');
        overlay.className = 'yaohuo-block-list-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        `;
        overlay.onclick = () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        };

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    // 辅助函数：添加编辑字段
    function addEditField(container, id, title, defaultText) {
        const fieldContainer = document.createElement('div');
        fieldContainer.style.cssText = `
            margin-bottom: 15px;
        `;

        const titleElement = document.createElement('h4');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin: 0 0 5px 0;
            font-size: 16px; /* 增大标题字体 */
        `;

        const textarea = document.createElement('textarea');
        textarea.id = id;
        textarea.style.cssText = `
            width: 100%;
            height: 80px;
            padding: 10px; /* 增加内边距 */
            margin-top: 5px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            box-sizing: border-box; /* 包含内边距和边框 */
            font-size: 14px; /* 增大字体 */
        `;
        textarea.value = defaultText;

        fieldContainer.appendChild(titleElement);
        fieldContainer.appendChild(textarea);
        container.appendChild(fieldContainer);
    }

    // 添加顶部快捷入口
    function addTopMenuEntry() {
        try {
            const topMenu = document.querySelector('.top2');
            if (!topMenu) return;

            const blockManagerLink = document.createElement('a');
            blockManagerLink.href = 'javascript:;';
            blockManagerLink.textContent = '屏蔽管理';
            blockManagerLink.className = 'yaohuo-block-manager-text';
            blockManagerLink.style.cssText = `
                float: right;
                cursor: pointer;
            `;

            blockManagerLink.onclick = createBlockListManager;
            topMenu.appendChild(blockManagerLink);
        } catch (error) {
            console.error('添加顶部菜单入口时出错:', error);
        }
    }

    // 在用户页面添加屏蔽按钮（增加特殊用户校验）
    function addBlockButton() {
        try {
            const btBox = document.querySelector('.btBox');
            if (!btBox) return;

            let userId = '';
            let username = '';

            // 获取用户ID（保持原有逻辑）
            document.querySelectorAll('b').forEach(b => {
                if (b.textContent.includes('ID号')) {
                    let nextNode = b.nextSibling;
                    while (nextNode) {
                        if (nextNode.nodeType === 3) {
                            userId = nextNode.textContent.trim();
                            break;
                        }
                        nextNode = nextNode.nextSibling;
                    }
                }
            });

            // 获取用户名（使用标准选择器替代:contains）
            let nicknameTag = null;
            let crystalTag = null;

            // 查找昵称标签
            document.querySelectorAll('b').forEach(b => {
                if (b.textContent.includes('昵称') && b.querySelector('.recolon')) {
                    nicknameTag = b;
                }
                if (b.textContent.includes('妖晶') && b.querySelector('.recolon')) {
                    crystalTag = b;
                }
            });

            if (nicknameTag && crystalTag && nicknameTag.nextSibling) {
                // 定位到两个标签之间的所有节点
                let currentNode = nicknameTag.nextSibling;
                let usernameText = '';

                while (currentNode && currentNode !== crystalTag) {
                    // 递归提取节点中的文本内容
                    usernameText += extractTextFromNode(currentNode);
                    currentNode = currentNode.nextSibling;
                }

                username = usernameText.trim();
            }

            // 备用方案（处理极端情况）
            if (!username) {
                const fallbackElements = document.querySelectorAll('.nickname, .user-nick, .renick');
                if (fallbackElements.length > 0) {
                    username = extractTextFromNode(fallbackElements[0]).trim();
                }
            }

            if (!userId || !username) return;

            // 检查是否为受保护用户
            const isProtectedUser = protectedUserIds.includes(userId) || protectedUsernames.includes(username);

            // 创建屏蔽按钮组
            const newLine = document.createElement('div');
            newLine.style.cssText = 'margin: 5px 0;';

            const titleLabel = document.createElement('b');
            titleLabel.textContent = '屏蔽管理';

            const colon = document.createElement('span');
            colon.className = 'recolon';
            colon.textContent = ':';

            const blockButton = document.createElement('a');

            if (isProtectedUser) {
                // 受保护用户显示不可屏蔽状态
                blockButton.textContent = '不可屏蔽';
                blockButton.style.backgroundColor = '#ccc';
                blockButton.style.cursor = 'not-allowed';
            } else {
                // 普通用户显示屏蔽按钮
                blockButton.href = 'javascript:;';
                blockButton.textContent = '点击屏蔽此人';
                blockButton.onclick = () => {
                    if (confirm(`确定要屏蔽用户 ${username} (ID: ${userId}) 吗？`)) {
                        // 再次校验是否为受保护用户（防止数据更新）
                        if (protectedUserIds.includes(userId) || protectedUsernames.includes(username)) {
                            alert('警告: 该用户为论坛管理用户，无法添加到屏蔽列表！');
                            return;
                        }

                        if (!blockedUserIds.includes(userId)) blockedUserIds.push(userId);
                        if (username && !blockedUsernames.includes(username)) blockedUsernames.push(username);
                        saveBlockedList();
                        applyBlockingRules();
                        blockButton.textContent = '已屏蔽';
                        blockButton.style.backgroundColor = '#888';
                        blockButton.onclick = null;
                    }
                };
            }

            // 组装按钮组并插入到DOM中
            try {
                newLine.appendChild(titleLabel);
                newLine.appendChild(colon);
                newLine.appendChild(blockButton);
                btBox.parentNode.insertBefore(newLine, btBox.nextSibling);
            } catch (domError) {
                console.error('组装或插入屏蔽按钮时出错:', domError);
            }
        } catch (error) {
            console.error('添加屏蔽按钮时出错:', error);
        }
    }

    // 辅助函数：从节点中提取纯文本（支持嵌套标签）
    function extractTextFromNode(node) {
        if (node.nodeType === 3) {
            return node.textContent.trim(); // 文本节点直接返回内容
        } else if (node.nodeType === 1) {
            let text = '';
            // 递归处理子节点
            for (let i = 0; i < node.childNodes.length; i++) {
                text += extractTextFromNode(node.childNodes[i]);
            }
            return text;
        }
        return '';
    }

    // 应用所有屏蔽规则
    function applyBlockingRules() {
        hideReplies();
        hideTopicsOnHomePage();
        hideTopicsInList();
    }

    // 初始化观察器
    function initObserver() {
        try {
            new MutationObserver(() => applyBlockingRules()).observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (error) {
            console.error('初始化观察器时出错:', error);
        }
    }

    // 初始化脚本
    function init() {
        loadBlockedList();
        addTopMenuEntry();
        applyBlockingRules();
        addBlockButton();
        initObserver();
    }

    init();
})();