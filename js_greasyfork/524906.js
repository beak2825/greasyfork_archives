// ==UserScript==
// @name         CC98-TAGs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为CC98用户添加可持久化的多标签功能
// @license      MIT
// @author       萌萌人
// @match        http://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @match        https://www.cc98.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/524906/CC98-TAGs.user.js
// @updateURL https://update.greasyfork.org/scripts/524906/CC98-TAGs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 自定义样式
    const css = `
.user-tags-container {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    width: 100%; /* 让容器宽度跟随父容器 */
}
.user-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px; /* 上下左右的内边距 */
    border-radius: 4px;
    font-size: 0.75rem;
    color: white;
    cursor: pointer;
    position: relative;
    max-width: 90%; /* 限制最大宽度 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: normal; /* 允许换行 */
    flex-shrink: 0; /* 允许缩小 */
    box-sizing: border-box; /* 确保 padding 不影响宽度计算 */
    word-wrap: break-word; /* 允许长单词换行 */
    overflow-wrap: break-word; /* 确保长单词和字符串在必要时换行 */
}
.user-tag:hover::after {
    content: '×';
    margin-left: 4px;
    font-size: 0.9em;
}
.add-tag-btn {
    background: #ddd;
    color: #666;
    border: 1px dashed #999;
    cursor: pointer;
    max-width: 100%; /* 限制最大宽度 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /* 不换行 */
}
.add-tag-btn:hover {
    background: #eee;
}
.import-export-menu {
    position: relative; /* 使用绝对定位 */
    right: 0; /* 对齐到页面最右边 */
    top: 55%; /* 垂直居中 */
    transform: translateY(-50%); /* 通过 transform 微调垂直居中 */
    display: inline-block;
    margin-left: 10px;
    padding-bottom: 5px; /* 增加底部 padding，扩展悬停区域 */
}

.import-export-menu button {
    background: none;
    border: none;
    color: white; /* 文字颜色为白色 */
    cursor: pointer;
    font-size: 16px;
    display: flex; /* 使用 flexbox 布局 */
    align-items: center; /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    height: 100%; /* 确保按钮高度与父容器一致 */
}

.import-export-menu button:hover {
    color: #ccc; /* 鼠标悬停时文字颜色变为浅灰色 */
}

.import-export-dropdown {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    width: 100%; /* 宽度与按钮对齐 */
    min-width: 80pt;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    right: 0; /* 下拉菜单也对齐到最右边 */
    top: 100%; /* 下拉菜单在按钮下方 */
    margin-top: 0;
    text-align: center; /* 下拉菜单文字居中 */
}

.import-export-dropdown a {
    color: black;
    padding: 8px 16px; /* 调整下拉菜单项的内边距 */
    text-decoration: none;
    display: block;
    text-align: center; /* 下拉菜单文字居中 */
}

.import-export-dropdown a:hover {
    background-color: #f1f1f1;
}

.import-export-menu:hover .import-export-dropdown {
    display: block;
}
`;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // 获取UID
    const getUidFromLink = (link) => {
        const match = link.href.match(/\/user\/id\/(\d+)/);
        return match ? match[1] : null;
    };

    // 固定颜色数组
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D5', '#54C6EB', '#6BFF6B', '#FFD166', '#A06CD5'];

    // 根据UID获取颜色
    const getColorByUid = (uid, index) => {
        const uidNumber = parseInt(uid, 10); // 将UID转换为数字
        const colorIndex = (uidNumber + index) % colors.length; // 对颜色数组长度取模
        return colors[colorIndex];
    };

    // 创建标签
    const createTag = (uid, tag, index) => {
        const tagElem = document.createElement('div');
        tagElem.className = 'user-tag';
        tagElem.textContent = tag;
        tagElem.style.backgroundColor = getColorByUid(uid, index); // 使用UID确定颜色
        tagElem.onclick = () => {
            if (confirm(`确定要删除标签 "${tag}" 吗？`)) {
                const tags = GM_getValue(`tags_${uid}`, []);
                tags.splice(index, 1);
                GM_setValue(`tags_${uid}`, tags);
                updateTags(uid);
            }
        };
        return tagElem;
    };

    // 创建添加标签按钮
    const createAddButton = (uid) => {
        const btn = document.createElement('div');
        btn.className = 'user-tag add-tag-btn';
        btn.textContent = '+';
        btn.style.backgroundColor = '#FFFFFF'; // 使用UID确定颜色
        btn.onclick = () => {
            const tag = prompt('请输入新标签:');
            if (tag && tag.trim()) {
                const tags = GM_getValue(`tags_${uid}`, []);
                tags.push(tag.trim());
                GM_setValue(`tags_${uid}`, tags);
                updateTags(uid);
            }
        };
        return btn;
    };

    // 更新标签显示
    const updateTags = (uid) => {
        const containers = document.querySelectorAll(`.user-tags-container[data-uid="${uid}"]`);
        containers.forEach(container => {
            container.innerHTML = '';
            const tags = GM_getValue(`tags_${uid}`, []);
            tags.forEach((tag, index) => {
                container.appendChild(createTag(uid, tag, index));
            });
            container.appendChild(createAddButton(uid));

            // 动态调整标签宽度
            const userMessage = container.closest('.userMessage');
            if (userMessage) {
                const userMessageWidth = userMessage.offsetWidth * 0.75;
                container.style.width = `${userMessageWidth}px`; // 设置标签容器宽度
            }
        });
    };

    // 初始化标签容器
    const initTagsContainer = (uid, postId) => {
        const container = document.createElement('div');
        container.className = 'user-tags-container';
        container.setAttribute('data-uid', uid);
        container.setAttribute('data-post-id', postId); // 添加帖子ID作为唯一标识
        return container;
    };

    // 检查是否需要刷新标签
    const shouldUpdateTags = () => {
        const currentUrl = window.location.href;
        // 检查URL是否以 /topic/数字 结尾
        return /\/topic\/\d+(\/.+)?$/.test(currentUrl);
    };

    // 主更新函数
    const updateAllTags = () => {
        if (!shouldUpdateTags()) return; // 如果不需要刷新标签，则直接返回

        document.querySelectorAll('.userMessage-left').forEach(container => {
            const link = container.querySelector('a[href*="/user/id/"]');
            if (!link) return;

            const uid = getUidFromLink(link);
            const postId = container.closest('.reply').id; // 获取当前楼层的ID
            const existingContainer = container.querySelector(`.user-tags-container[data-post-id="${postId}"]`);
            if (existingContainer) existingContainer.remove();

            const tagsContainer = initTagsContainer(uid, postId);
            const infoContainer = container.querySelector('.column[style*="padding-left: 1.5rem"]');
            if (infoContainer) {
                infoContainer.appendChild(tagsContainer);
                updateTags(uid);
            }
        });
    };

    // 导出标签数据（明文或Base64编码）
    const exportTags = (encode = false, copyToClipboard = false) => {
        const allTags = {};
        const allKeys = GM_listValues();
        allKeys.forEach(key => {
            if (key.startsWith('tags_')) {
                const uid = key.replace('tags_', '');
                allTags[uid] = GM_getValue(key, []);
            }
        });
        const jsonData = JSON.stringify(allTags, null, 2);
        const outputData = encode ? btoa(unescape(encodeURIComponent(jsonData))) : jsonData;

        if (copyToClipboard) {
            // 创建一个文本框用于显示导出的数据
            const textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '100%';
            textarea.style.height = '200px';
            textarea.style.zIndex = '10000';
            textarea.style.backgroundColor = '#fff';
            textarea.style.border = '1px solid #ccc';
            textarea.style.padding = '10px';
            textarea.style.boxSizing = 'border-box';
            textarea.style.fontFamily = 'monospace';
            textarea.style.fontSize = '14px';
            textarea.value = outputData;

            // 添加一个关闭按钮
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.position = 'fixed';
            closeButton.style.top = '210px';
            closeButton.style.left = '50%';
            closeButton.style.zIndex = '10001';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.padding = '5px 10px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => {
                document.body.removeChild(textarea);
                document.body.removeChild(closeButton);
            };

            // 将文本框和按钮添加到页面
            document.body.appendChild(textarea);
            document.body.appendChild(closeButton);

            // 自动选中文本框内容
            textarea.select();
        } else {
            const blob = new Blob([outputData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = encode ? 'cc98_tags_export_base64.txt' : 'cc98_tags_export.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    // 导入标签数据（明文或Base64编码）
    const importTags = (encoded = false, useTextInput = false) => {
        if (useTextInput) {
            // 创建一个大文本框
            const textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.width = '100%';
            textarea.style.height = '200px';
            textarea.style.zIndex = '10000';
            textarea.style.backgroundColor = '#fff';
            textarea.style.border = '1px solid #ccc';
            textarea.style.padding = '10px';
            textarea.style.boxSizing = 'border-box';
            textarea.style.fontFamily = 'monospace';
            textarea.style.fontSize = '14px';
            textarea.placeholder = '请在此粘贴要导入的标签数据...';

            // 创建导入按钮
            const importButton = document.createElement('button');
            importButton.textContent = '导入';
            importButton.style.position = 'fixed';
            importButton.style.top = '210px';
            importButton.style.left = '50%';
            importButton.style.transform = 'translateX(-100%)'; // 向左偏移 50% 的宽度
            importButton.style.zIndex = '10001';
            importButton.style.backgroundColor = '#4CAF50';
            importButton.style.color = '#fff';
            importButton.style.border = 'none';
            importButton.style.padding = '5px 10px';
            importButton.style.cursor = 'pointer';
            importButton.onclick = () => {
                const jsonData = textarea.value.trim();
                if (!jsonData) {
                    alert('请输入要导入的数据！');
                    return;
                }

                try {
                    let parsedData = jsonData;
                    if (encoded) {
                        parsedData = decodeURIComponent(escape(atob(jsonData)));
                    }
                    const tagsData = JSON.parse(parsedData);
                    for (const uid in tagsData) {
                        if (tagsData.hasOwnProperty(uid)) {
                            GM_setValue(`tags_${uid}`, tagsData[uid]);
                        }
                    }
                    alert('标签导入成功！');
                    updateAllTags();
                    document.body.removeChild(textarea);
                    document.body.removeChild(importButton);
                    document.body.removeChild(closeButton);
                } catch (error) {
                    alert('导入失败：数据格式不正确！');
                }
            };

            // 创建关闭按钮
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.position = 'fixed';
            closeButton.style.top = '210px';
            closeButton.style.left = '50%';
            closeButton.style.zIndex = '10001';
            closeButton.style.backgroundColor = '#f44336';
            closeButton.style.color = '#fff';
            closeButton.style.border = 'none';
            closeButton.style.padding = '5px 10px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => {
                document.body.removeChild(textarea);
                document.body.removeChild(importButton);
                document.body.removeChild(closeButton);
            };

            // 将文本框和按钮添加到页面
            document.body.appendChild(textarea);
            document.body.appendChild(importButton);
            document.body.appendChild(closeButton);

            // 自动聚焦文本框
            textarea.focus();
        } else {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt,.json';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        let jsonData = e.target.result;
                        if (encoded) {
                            jsonData = decodeURIComponent(escape(atob(jsonData)));
                        }
                        const tagsData = JSON.parse(jsonData);
                        for (const uid in tagsData) {
                            if (tagsData.hasOwnProperty(uid)) {
                                GM_setValue(`tags_${uid}`, tagsData[uid]);
                            }
                        }
                        alert('标签导入成功！');
                        updateAllTags();
                    } catch (error) {
                        alert('导入失败：文件格式不正确！');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }
    };


    const clearTags = () => {
        if (confirm("确定要清除所有用户的标签吗？")) {
            GM_listValues().forEach(key => {
                if (key.startsWith('tags_')) GM_deleteValue(key);
            });
            updateAllTags();
        }
    }

    // 创建导入导出菜单
    const createImportExportMenu = () => {
        const menuContainer = document.createElement('div');
        menuContainer.className = 'import-export-menu';

        const menuButton = document.createElement('button');
        menuButton.textContent = '导入/导出';
        menuContainer.appendChild(menuButton);

        const dropdown = document.createElement('div');
        dropdown.className = 'import-export-dropdown';

        const exportBase64 = document.createElement('a');
        exportBase64.textContent = '导出标签';
        exportBase64.onclick = () => exportTags(true, true);
        dropdown.appendChild(exportBase64);

        const importBase64 = document.createElement('a');
        importBase64.textContent = '导入标签';
        importBase64.onclick = () => importTags(true, true);
        dropdown.appendChild(importBase64);

        const clearAllTags = document.createElement('a');
        clearAllTags.textContent = '清除所有';
        clearAllTags.onclick = () => clearTags();
        dropdown.appendChild(clearAllTags);

        menuContainer.appendChild(dropdown);

        // 将菜单插入到页面左上方
        const topBar = document.querySelector('.topBar');
        if (topBar) {
            topBar.appendChild(menuContainer);
        }
    };


    // 初始化
    const init = () => {
        updateAllTags();
        createImportExportMenu();

        setInterval(updateAllTags, 1000); // 每1000ms更新一次tag
    };

    // 延迟初始化，确保页面加载完成
    setTimeout(init, 1000);

    // Tampermonkey菜单命令
    GM_registerMenuCommand("清除所有用户标签", () => {
        if (confirm("确定要清除所有用户的标签吗？")) {
            GM_listValues().forEach(key => {
                if (key.startsWith('tags_')) GM_deleteValue(key);
            });
            updateAllTags();
        }
    });

    GM_registerMenuCommand("导出标签（json）", () => exportTags(false));
    GM_registerMenuCommand("导入标签（json）", () => importTags(false));
})();