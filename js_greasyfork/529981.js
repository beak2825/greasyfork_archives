// ==UserScript==
// @name         Threads 關注者管理工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  獲取所有關注者並批量移除追蹤
// @author       You
// @match        https://www.threads.net/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529981/Threads%20%E9%97%9C%E6%B3%A8%E8%80%85%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/529981/Threads%20%E9%97%9C%E6%B3%A8%E8%80%85%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存儲所有關注者
    let allFollowers = [];
    // 標記腳本是否已經初始化
    let isInitialized = false;

    // 創建用戶界面
    function createUI() {
        // 確保不會重複創建UI
        if (isInitialized || document.getElementById('threads-unfollower')) {
            return;
        }

        isInitialized = true;

        // 創建主容器
        const container = document.createElement('div');
        container.id = 'threads-unfollower';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#222';
        container.style.border = '1px solid #444';
        container.style.padding = '15px';
        container.style.borderRadius = '5px';
        container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        container.style.maxHeight = '80vh';
        container.style.overflow = 'auto';
        container.style.width = '320px';
        container.style.fontFamily = 'Arial, sans-serif';

        // 標題
        const header = document.createElement('h3');
        header.textContent = 'Threads 關注者管理';
        header.style.margin = '0 0 15px 0';
        header.style.color = '#e0e0e0';
        header.style.fontSize = '16px';
        header.style.textAlign = 'center';

        // 按鈕容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginBottom = '15px';

        // 獲取關注者按鈕
        const fetchButton = document.createElement('button');
        fetchButton.textContent = '獲取所有關注者';
        fetchButton.style.padding = '8px 12px';
        fetchButton.style.backgroundColor = '#4b4b4b';
        fetchButton.style.color = '#e0e0e0';
        fetchButton.style.border = '1px solid #666';
        fetchButton.style.borderRadius = '4px';
        fetchButton.style.cursor = 'pointer';
        fetchButton.style.flex = '1';
        fetchButton.style.marginRight = '10px';
        fetchButton.style.fontSize = '14px';
        fetchButton.addEventListener('click', fetchAllFollowers);

        // 移除所有追蹤按鈕
        const removeAllButton = document.createElement('button');
        removeAllButton.textContent = '全部移除追蹤';
        removeAllButton.style.padding = '8px 12px';
        removeAllButton.style.backgroundColor = '#8B0000';
        removeAllButton.style.color = 'white';
        removeAllButton.style.border = 'none';
        removeAllButton.style.borderRadius = '4px';
        removeAllButton.style.cursor = 'pointer';
        removeAllButton.style.flex = '1';
        removeAllButton.style.fontSize = '14px';
        removeAllButton.addEventListener('click', removeAllFollowers);

        buttonContainer.appendChild(fetchButton);
        buttonContainer.appendChild(removeAllButton);

        // 狀態顯示區域
        const status = document.createElement('div');
        status.id = 'follower-status';
        status.textContent = '就緒';
        status.style.margin = '10px 0';
        status.style.color = '#e0e0e0';
        status.style.padding = '5px';
        status.style.backgroundColor = '#333';
        status.style.borderRadius = '3px';
        status.style.fontSize = '14px';

        // 計數器
        const counter = document.createElement('div');
        counter.id = 'follower-counter';
        counter.textContent = '關注者: 0';
        counter.style.margin = '10px 0';
        counter.style.color = '#e0e0e0';
        counter.style.fontSize = '14px';

        // 進度條
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar-container';
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#444';
        progressBar.style.borderRadius = '4px';
        progressBar.style.marginTop = '10px';
        progressBar.style.display = 'none';
        progressBar.style.overflow = 'hidden';
        progressBar.style.height = '15px';

        const progressFill = document.createElement('div');
        progressFill.id = 'progress-bar-fill';
        progressFill.style.height = '100%';
        progressFill.style.width = '0%';
        progressFill.style.backgroundColor = '#4CAF50';
        progressFill.style.borderRadius = '4px';
        progressFill.style.transition = 'width 0.3s ease';
        progressBar.appendChild(progressFill);

        // 關注者列表
        const followerList = document.createElement('div');
        followerList.id = 'follower-list';
        followerList.style.marginTop = '15px';
        followerList.style.borderTop = '1px solid #444';
        followerList.style.paddingTop = '10px';

        // 添加元素到容器
        container.appendChild(header);
        container.appendChild(buttonContainer);
        container.appendChild(status);
        container.appendChild(counter);
        container.appendChild(progressBar);
        container.appendChild(followerList);

        // 添加到頁面
        document.body.appendChild(container);
    }

    // 更新狀態消息
    function updateStatus(message) {
        const status = document.getElementById('follower-status');
        if (status) {
            status.textContent = message;
        }
        console.log('[Threads 關注者管理]:', message);
    }

    // 更新關注者計數
    function updateCounter() {
        const counter = document.getElementById('follower-counter');
        if (counter) {
            counter.textContent = `關注者: ${allFollowers.length}`;
        }
    }

    // 設置進度條的進度
    function updateProgressBar(percent, show = true) {
        const progressBar = document.getElementById('progress-bar-container');
        const progressFill = document.getElementById('progress-bar-fill');

        if (!progressBar || !progressFill) return;

        progressBar.style.display = show ? 'block' : 'none';
        progressFill.style.width = `${percent}%`;
    }

    // 安全地設置元素內容
    function safelySetInnerHTML(element, html) {
        try {
            element.innerHTML = html;
        } catch (error) {
            console.error('無法設置 innerHTML:', error);
            // 使用 textContent 作為備用
            element.textContent = '內容載入失敗，請檢查控制台。';
        }
    }

    // 在用戶界面中顯示關注者
    function displayFollowers() {
        const followerList = document.getElementById('follower-list');
        if (!followerList) return;

        try {
            // 清空列表
            while (followerList.firstChild) {
                followerList.removeChild(followerList.firstChild);
            }

            if (allFollowers.length === 0) {
                const noFollowers = document.createElement('div');
                noFollowers.textContent = '沒有找到關注者。';
                noFollowers.style.color = '#e0e0e0';
                noFollowers.style.padding = '10px 0';
                noFollowers.style.textAlign = 'center';
                followerList.appendChild(noFollowers);
                return;
            }

            // 創建關注者列表
            allFollowers.forEach((follower, index) => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.padding = '10px 0';
                item.style.borderBottom = index < allFollowers.length - 1 ? '1px solid #444' : 'none';
                item.dataset.userId = follower.pk;

                // 頭像
                const img = document.createElement('img');
                img.src = follower.profilePicUrl;
                img.alt = follower.username;
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.borderRadius = '50%';
                img.style.marginRight = '15px';
                img.style.objectFit = 'cover';

                // 用戶名和全名
                const userInfo = document.createElement('div');
                userInfo.style.flex = '1';

                const username = document.createElement('div');
                username.textContent = follower.username;
                username.style.fontWeight = 'bold';
                username.style.color = '#e0e0e0';
                username.style.fontSize = '14px';

                const fullName = document.createElement('div');
                fullName.textContent = follower.fullName || '';
                fullName.style.fontSize = '12px';
                fullName.style.color = '#aaa';
                fullName.style.marginTop = '3px';

                userInfo.appendChild(username);
                userInfo.appendChild(fullName);

                // 移除追蹤按鈕
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '移除追蹤';
                removeBtn.style.padding = '5px 10px';
                removeBtn.style.backgroundColor = '#3a3a3a';
                removeBtn.style.color = '#e0e0e0';
                removeBtn.style.border = '1px solid #555';
                removeBtn.style.borderRadius = '4px';
                removeBtn.style.cursor = 'pointer';
                removeBtn.style.fontSize = '12px';
                removeBtn.style.transition = 'all 0.2s ease';

                removeBtn.addEventListener('click', async () => {
                    removeBtn.disabled = true;
                    removeBtn.textContent = '處理中...';
                    removeBtn.style.opacity = '0.7';

                    try {
                        await removeFollower(follower.pk);
                        item.style.opacity = '0.5';
                        removeBtn.textContent = '已移除';
                        removeBtn.style.backgroundColor = '#555';
                    } catch (error) {
                        removeBtn.textContent = '失敗';
                        removeBtn.style.backgroundColor = '#8B0000';
                        console.error('移除追蹤失敗:', error);
                        setTimeout(() => {
                            removeBtn.disabled = false;
                            removeBtn.textContent = '重試';
                            removeBtn.style.backgroundColor = '#3a3a3a';
                            removeBtn.style.opacity = '1';
                        }, 2000);
                    }
                });

                item.appendChild(img);
                item.appendChild(userInfo);
                item.appendChild(removeBtn);

                followerList.appendChild(item);
            });
        } catch (error) {
            console.error('顯示關注者列表時出錯:', error);
            if (error.message.includes('TrustedHTML')) {
                updateStatus(`已成功獲取所有 ${allFollowers.length} 位關注者，但顯示存在安全限制。`);

                // 創建一個簡單的信息提示
                const infoMessage = document.createElement('div');
                infoMessage.textContent = `因瀏覽器安全限制，無法顯示完整列表。已獲取 ${allFollowers.length} 位關注者。請查看控制台獲取完整數據。`;
                infoMessage.style.color = '#e0e0e0';
                infoMessage.style.padding = '10px';
                infoMessage.style.backgroundColor = '#444';
                infoMessage.style.borderRadius = '4px';
                infoMessage.style.margin = '10px 0';

                // 清空列表並添加信息
                while (followerList.firstChild) {
                    followerList.removeChild(followerList.firstChild);
                }
                followerList.appendChild(infoMessage);
            } else {
                throw error;
            }
        }
    }

    // 獲取所有關注者的主函數
    async function fetchAllFollowers() {
        allFollowers = [];
        updateStatus('正在獲取關注者...');
        updateProgressBar(0, true);

        // 從 cookies 中獲取 CSRF 令牌和用戶 ID
        const csrftoken = getCookie('csrftoken');
        const userId = getCookie('ds_user_id');

        if (!csrftoken || !userId) {
            updateStatus('錯誤：缺少所需的 cookies。請確保已登錄 Threads。');
            updateProgressBar(0, false);
            return;
        }

        try {
            // 開始獲取關注者，無游標（第一頁）
            await fetchFollowersPage(null, csrftoken, userId);

            // 用結果更新 UI
            updateProgressBar(100);
            updateStatus(`完成！找到 ${allFollowers.length} 位關注者。`);
            displayFollowers();

            // 記錄數據以進行調試
            console.log('所有關注者:', allFollowers);
        } catch (error) {
            console.error('獲取關注者時出錯:', error);
            updateStatus(`錯誤: ${error.message}`);
            updateProgressBar(0, false);
        }
    }

    // 獲取一頁關注者的函數
    async function fetchFollowersPage(cursor, csrftoken, userId) {
        // 根據是否有游標確定要使用的查詢
        const friendlyName = cursor ?
            "BarcelonaFriendshipsFollowersTabRefetchableQuery" :
            "BarcelonaFriendshipsFollowersTabQuery";

        // 根據查詢確定要使用的 doc_id
        const docId = cursor ? "9226067564176291" : "9523819394337000";

        // 準備請求的變量
        const variables = cursor ?
            {
                "after": cursor,
                "first": 20,
                "id": userId,
                "__relay_internal__pv__BarcelonaIsLoggedInrelayprovider": true,
                "__relay_internal__pv__BarcelonaIsCrawlerrelayprovider": false,
                "__relay_internal__pv__BarcelonaHasDisplayNamesrelayprovider": false
            } :
            {
                "first": 20,
                "userID": userId,
                "__relay_internal__pv__BarcelonaIsLoggedInrelayprovider": true,
                "__relay_internal__pv__BarcelonaIsCrawlerrelayprovider": false,
                "__relay_internal__pv__BarcelonaHasDisplayNamesrelayprovider": false,
                "__relay_internal__pv__BarcelonaShouldShowFediverseListsrelayprovider": true
            };

        // 創建表單數據
        const formData = new URLSearchParams();
        formData.append('av', '17841467954992287');
        formData.append('__user', userId);
        formData.append('__a', '1');
        formData.append('__req', cursor ? 'r' : 'o');
        formData.append('dpr', '1');
        formData.append('fb_api_caller_class', 'RelayModern');
        formData.append('fb_api_req_friendly_name', friendlyName);
        formData.append('variables', JSON.stringify(variables));
        formData.append('server_timestamps', 'true');
        formData.append('doc_id', docId);

        try {
            // 發送 API 請求
            const response = await fetch('https://www.threads.net/graphql/query', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'x-csrftoken': csrftoken,
                    'x-fb-friendly-name': friendlyName,
                    'x-ig-app-id': '238260118697367'
                },
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            // 處理API回應結構差異，第一次請求使用user，後續請求使用fetch__XDTUserDict
            let followersData;
            let pageInfo;

            if (data.data.user && data.data.user.followers) {
                // 第一次請求的結構
                followersData = data.data.user.followers.edges;
                pageInfo = data.data.user.followers.page_info;
            } else if (data.data.fetch__XDTUserDict && data.data.fetch__XDTUserDict.followers) {
                // 後續請求的結構
                followersData = data.data.fetch__XDTUserDict.followers.edges;
                pageInfo = data.data.fetch__XDTUserDict.followers.page_info;
            } else {
                console.error('未知的API回應結構:', data);
                throw new Error('無效的響應數據');
            }

            // 處理每個關注者
            followersData.forEach(edge => {
                if (edge.node) {
                    allFollowers.push({
                        id: edge.node.id,
                        pk: edge.node.pk,
                        username: edge.node.username,
                        fullName: edge.node.full_name || '',
                        profilePicUrl: edge.node.profile_pic_url,
                        followedBy: edge.node.friendship_status.followed_by,
                        following: edge.node.friendship_status.following
                    });
                }
            });

            // 更新 UI
            updateCounter();
            updateStatus(`目前已獲取 ${allFollowers.length} 位關注者...`);

            // 檢查是否有更多頁面要獲取
            if (pageInfo.has_next_page && pageInfo.end_cursor) {
                // 獲取下一頁
                await fetchFollowersPage(pageInfo.end_cursor, csrftoken, userId);
            }
        } catch (error) {
            console.error('獲取關注者頁面時出錯:', error);
            throw error;
        }
    }

    // 移除追蹤單個用戶
    async function removeFollower(userId) {
        const csrftoken = getCookie('csrftoken');
        const myUserId = getCookie('ds_user_id');

        if (!csrftoken || !myUserId) {
            throw new Error('缺少 CSRF 令牌或用戶ID');
        }

        const formData = new URLSearchParams();
        formData.append('av', '17841467954992287');
        formData.append('__user', myUserId);
        formData.append('__a', '1');
        formData.append('__req', '1i');
        formData.append('dpr', '1');
        formData.append('fb_api_caller_class', 'RelayModern');
        formData.append('fb_api_req_friendly_name', 'useBarcelonaRemoveFollowerMutation');
        formData.append('variables', JSON.stringify({ "userID": userId }));
        formData.append('server_timestamps', 'true');
        formData.append('doc_id', '9347461858632460');

        const response = await fetch('https://www.threads.net/graphql/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
                'X-IG-App-ID': '238260118697367',
                'X-FB-Friendly-Name': 'useBarcelonaRemoveFollowerMutation'
            },
            body: formData,
            credentials: 'include'
        });

        const data = await response.json();

        if (!data || !data.data || !data.status || data.status !== 'ok') {
            console.error('移除追蹤響應異常:', data);
            throw new Error('移除追蹤請求失敗');
        }

        return data;
    }

    // 移除所有追蹤
    async function removeAllFollowers() {
        if (allFollowers.length === 0) {
            updateStatus('沒有關注者可以移除追蹤。請先獲取關注者列表。');
            return;
        }

        const confirmRemove = confirm(`確定要移除追蹤所有 ${allFollowers.length} 位用戶嗎？\n此操作無法撤銷。`);
        if (!confirmRemove) return;

        updateProgressBar(0, true);
        updateStatus(`開始批量移除追蹤，共 ${allFollowers.length} 位用戶...`);

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        let successCount = 0;
        let failCount = 0;
        let continuousFailCount = 0;

        for (let i = 0; i < allFollowers.length; i++) {
            const follower = allFollowers[i];
            const progress = Math.round(((i + 1) / allFollowers.length) * 100);

            updateProgressBar(progress);
            updateStatus(`正在處理 ${i+1}/${allFollowers.length}：${follower.username}`);

            try {
                await removeFollower(follower.pk);
                successCount++;
                continuousFailCount = 0;

                // 更新UI
                const followerItem = document.querySelector(`[data-user-id="${follower.pk}"]`);
                if (followerItem) {
                    followerItem.style.opacity = '0.5';
                    const removeBtn = followerItem.querySelector('button');
                    if (removeBtn) {
                        removeBtn.textContent = '已移除';
                        removeBtn.style.backgroundColor = '#555';
                        removeBtn.disabled = true;
                    }
                }

                // 避免請求過於頻繁，添加隨機延遲
                await delay(Math.random() * 1000 + 1500);
            } catch (error) {
                console.error(`移除 ${follower.username} 的追蹤失敗:`, error);
                failCount++;
                continuousFailCount++;

                // 如果連續失敗，暫停一段時間
                if (continuousFailCount > 3) {
                    updateStatus(`連續失敗 ${continuousFailCount} 次，暫停中...`);
                    await delay(5000); // 暫停5秒
                }

                // 錯誤太多，詢問是否繼續
                if (continuousFailCount > 10) {
                    const continueProcess = confirm(`已發生多次連續錯誤 (${continuousFailCount}次)。\n是否繼續進行？`);
                    if (!continueProcess) {
                        updateStatus(`操作已暫停。成功: ${successCount}, 失敗: ${failCount}`);
                        return;
                    }
                    continuousFailCount = 0; // 重置連續失敗計數
                }
            }
        }

        updateProgressBar(100);
        updateStatus(`完成! 成功移除追蹤 ${successCount} 位用戶，失敗 ${failCount} 位。`);
    }

    // 獲取 cookie 值的輔助函數
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // 初始化腳本
    function init() {
        // 僅在 Threads 網站上運行
        if (window.location.hostname === 'www.threads.net') {
            // 確保頁面完全加載後再創建UI
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(createUI, 1000);
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    setTimeout(createUI, 1000);
                });
            }
        }
    }

    // 啟動腳本
    init();
})();