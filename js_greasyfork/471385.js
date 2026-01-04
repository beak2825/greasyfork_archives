// ==UserScript==
// @name         南+关注功能
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.4
// @description  添加关注功能。点击按钮时会弹出关注的作者列表和查看主题链接，支持导出导入数据。
// @author       You
// @match        https://www.level-plus.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/471385/%E5%8D%97%2B%E5%85%B3%E6%B3%A8%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/471385/%E5%8D%97%2B%E5%85%B3%E6%B3%A8%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 缓存关注状态
    const FOLLOW_KEY_PREFIX = 'follow_';

    // 初始化关注状态
    const getFollowStatus = (uid) => GM_getValue(FOLLOW_KEY_PREFIX + uid, false);
    const setFollowStatus = (uid, status) => GM_setValue(FOLLOW_KEY_PREFIX + uid, status);
    const getFollowingAuthors = () => {
        const allValues = GM_listValues();
        return allValues
            .filter(key => key.startsWith(FOLLOW_KEY_PREFIX) && GM_getValue(key))
            .map(key => key.replace(FOLLOW_KEY_PREFIX, ''));
    };

    // 创建关注按钮
    const createFollowButton = (userInfo, uid) => {
        const isFollowing = getFollowStatus(uid);
        const button = document.createElement('button');
        button.textContent = isFollowing ? '取消关注' : `关注 ${uid}`;
        button.className = 'uid-button';
        button.style.marginLeft = '10px';
        button.addEventListener('click', () => toggleFollow(uid, button));
        return button;
    };

    // 切换关注状态
    const toggleFollow = (uid, button) => {
        const newStatus = !getFollowStatus(uid);
        setFollowStatus(uid, newStatus);
        button.textContent = newStatus ? '取消关注' : `关注 ${uid}`;
        updateFloatingMenu();
    };

    // 初始化页面上的关注按钮
    const initFollowButtons = () => {
        const userInfos = document.querySelectorAll('table.js-post .r_two');
        userInfos.forEach(userInfo => {
            const uidElement = userInfo.querySelector('.f12');
            const uid = uidElement ? uidElement.innerText.trim() : null;
            if (!uid) return;

            // 避免重复添加按钮
            if (userInfo.querySelector('.uid-button')) return;

            const followButton = createFollowButton(userInfo, uid);
            const authorLink = userInfo.querySelector('a[title="只看该作者的所有回复"]');
            const parentElement = authorLink ? authorLink.parentElement : userInfo;
            parentElement.appendChild(followButton);
        });
    };

    // 创建并添加浮动按钮
    const createFloatingButton = () => {
        const button = document.createElement('button');
        button.textContent = '南+助手';
        button.className = 'floating-button';
        document.body.appendChild(button);
        button.addEventListener('click', toggleFloatingMenu);
    };

    // 切换浮动菜单显示
    const toggleFloatingMenu = () => {
        if (document.getElementById('floating-menu')) {
            removeFloatingMenu();
        } else {
            createFloatingMenu();
        }
    };

    // 移除浮动菜单
    const removeFloatingMenu = () => {
        const menu = document.getElementById('floating-menu');
        if (menu) document.body.removeChild(menu);
    };

    // 更新浮动菜单（重建）
    const updateFloatingMenu = () => {
        removeFloatingMenu();
        createFloatingMenu();
    };

    // 创建浮动菜单
    const createFloatingMenu = () => {
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'floating-menu';
        floatingDiv.className = 'floating-menu';

        // 标题
        const title = document.createElement('h3');
        title.textContent = '关注的作者';
        floatingDiv.appendChild(title);

        const followingAuthors = getFollowingAuthors();

        if (followingAuthors.length > 0) {
            const list = document.createElement('ul');
            list.className = 'author-list';

            followingAuthors.forEach(uid => {
                const listItem = document.createElement('li');
                listItem.className = 'author-item';

                // 作者UID
                const uidDiv = document.createElement('div');
                uidDiv.textContent = `UID: ${uid}`;
                listItem.appendChild(uidDiv);

                // 取消关注按钮
                const cancelButton = document.createElement('button');
                cancelButton.textContent = '取消关注';
                cancelButton.className = 'cancel-button';
                cancelButton.addEventListener('click', () => {
                    setFollowStatus(uid, false);
                    updateFloatingMenu();
                });
                listItem.appendChild(cancelButton);

                // 查看主题按钮
                const viewButton = document.createElement('button');
                viewButton.textContent = '查看主题';
                viewButton.className = 'view-button';
                viewButton.addEventListener('click', () => {
                    window.open(`https://level-plus.net/u.php?action-topic-uid-${uid}.html`, '_blank');
                });
                listItem.appendChild(viewButton);

                // 获取最新主题信息
                const topicInfoDiv = document.createElement('div');
                topicInfoDiv.textContent = '加载中...';
                listItem.appendChild(topicInfoDiv);

                getLatestTopicInfo(uid)
                    .then(info => {
                        if (info) {
                            topicInfoDiv.innerHTML = `最新主题: <a href="https://level-plus.net/${info.link}" target="_blank">${info.name}</a><br>时间: ${info.time}`;
                        } else {
                            topicInfoDiv.textContent = '无法获取最新主题信息';
                        }
                    })
                    .catch(() => {
                        topicInfoDiv.textContent = '无法获取最新主题信息';
                    });

                list.appendChild(listItem);
            });

            floatingDiv.appendChild(list);
        } else {
            const noFollow = document.createElement('p');
            noFollow.textContent = '暂无关注的作者';
            floatingDiv.appendChild(noFollow);
        }

        // 导出按钮
        const exportButton = document.createElement('button');
        exportButton.textContent = '导出关注数据';
        exportButton.className = 'export-button';
        exportButton.addEventListener('click', exportFollowData);
        floatingDiv.appendChild(exportButton);

        // 导入按钮
        const importButton = document.createElement('button');
        importButton.textContent = '导入关注数据';
        importButton.className = 'import-button';
        importButton.addEventListener('click', importFollowData);
        floatingDiv.appendChild(importButton);

        document.body.appendChild(floatingDiv);
    };

    // 导出关注数据
    const exportFollowData = () => {
        const data = JSON.stringify(getFollowingAuthors(), null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'following_authors.json';
        a.click();

        URL.revokeObjectURL(url);
    };

    // 导入关注数据
    const importFollowData = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const importedAuthors = JSON.parse(reader.result);
                    if (Array.isArray(importedAuthors)) {
                        importedAuthors.forEach(uid => setFollowStatus(uid, true));
                        alert('导入成功！');
                        updateFloatingMenu();
                    } else {
                        throw new Error('数据格式错误');
                    }
                } catch (error) {
                    alert('导入失败：' + error.message);
                }
            };
            reader.readAsText(file);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    // 获取最新主题信息
    const getLatestTopicInfo = async (uid) => {
        try {
            const response = await fetch(`https://level-plus.net/u.php?action-topic-uid-${uid}.html`);
            if (!response.ok) throw new Error('网络响应不正常');

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const topicRows = doc.querySelectorAll('tbody tr');

            let latestTopic = null;

            topicRows.forEach(row => {
                const topicNameElement = row.querySelector('th a');
                const topicTimeElement = row.querySelector('.gray.f9');

                if (topicNameElement && topicTimeElement) {
                    const topicName = topicNameElement.textContent.trim();
                    const topicTime = topicTimeElement.textContent.trim();
                    const topicLink = topicNameElement.getAttribute('href');

                    if (!latestTopic || new Date(topicTime) > new Date(latestTopic.time)) {
                        latestTopic = { name: topicName, time: topicTime, link: topicLink };
                    }
                }
            });

            return latestTopic;
        } catch (error) {
            console.error(`获取UID ${uid} 的最新主题信息失败：`, error);
            return null;
        }
    };

    // 添加样式
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .floating-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #007BFF;
                color: white;
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            }
            .floating-button:hover {
                background-color: #0056b3;
            }
            .floating-menu {
                position: fixed;
                bottom: 60px;
                right: 20px;
                background-color: white;
                color: black;
                padding: 15px;
                border: 1px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                width: 400px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .floating-menu h3 {
                margin-top: 0;
            }
            .author-list {
                list-style: none;
                padding: 0;
            }
            .author-item {
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .author-item div {
                margin-bottom: 5px;
            }
            .author-item button {
                margin-right: 5px;
                padding: 5px 10px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            }
            .cancel-button {
                background-color: #dc3545;
                color: white;
            }
            .cancel-button:hover {
                background-color: #c82333;
            }
            .view-button {
                background-color: #28a745;
                color: white;
            }
            .view-button:hover {
                background-color: #218838;
            }
            .export-button, .import-button {
                margin-top: 10px;
                padding: 7px 12px;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                background-color: #17a2b8;
                color: white;
            }
            .export-button:hover, .import-button:hover {
                background-color: #138496;
            }
        `;
        document.head.appendChild(style);
    };

    // 初始化脚本
    const init = () => {
        addStyles();
        initFollowButtons();
        createFloatingButton();
    };

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
