// ==UserScript==
// @name         B站网页版一键开播/关播
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在B站直播姬网页版添加按钮，动态获取RoomID和分区，选择后一键开播/关播，并用HTML展示结果及复制按钮（成功信息手动关闭）。
// @author       YourName
// @match        https://link.bilibili.com/p/center/index*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.live.bilibili.com
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/536078/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%80%E9%94%AE%E5%BC%80%E6%92%AD%E5%85%B3%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/536078/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%80%E9%94%AE%E5%BC%80%E6%92%AD%E5%85%B3%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentRoomInfo = null;
    let availableAreas = null;
    let csrfTokenCache = null;
    let resultBoxTimeoutId = null; // Store timeout ID globally for the result box

    // 1. 函数：从 cookie 中获取 CSRF token (bili_jct)
    function getCsrfToken() {
        if (csrfTokenCache) return csrfTokenCache;
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith('bili_jct=')) {
                csrfTokenCache = cookie.substring('bili_jct='.length);
                return csrfTokenCache;
            }
        }
        return null;
    }

    // Helper function for making API requests
    function makeApiRequest(options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...options,
                headers: {
                    'Content-Type': options.method === 'POST' ? 'application/x-www-form-urlencoded; charset=UTF-8' : undefined,
                    'Referer': 'https://live.bilibili.com/p/html/web-hime/index.html',
                    'Origin': 'https://live.bilibili.com',
                    ...(options.headers || {})
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 || (options.url.includes('stopLive') && data.msg === "重复关播")) {
                            resolve(data);
                        } else {
                            reject(new Error(`API Error (${options.url}): ${data.code} - ${data.message || data.msg || 'Unknown API error'}`));
                        }
                    } catch (e) {
                        console.error("Raw response for error:", response.responseText);
                        reject(new Error(`JSON Parse Error (${options.url}): ${e.message}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Request Error (${options.url}): ${JSON.stringify(error)}`));
                },
                ontimeout: function() {
                    reject(new Error(`Request Timeout (${options.url})`));
                }
            });
        });
    }

    // 2. 函数：获取房间信息 (RoomID, 当前分区等)
    async function fetchRoomInfo(forceRefresh = false) {
        if (currentRoomInfo && !forceRefresh) return currentRoomInfo.data;
        try {
            const response = await makeApiRequest({
                method: 'GET',
                url: 'https://api.live.bilibili.com/xlive/app-blink/v1/room/GetInfo?platform=pc'
            });
            currentRoomInfo = response;
            return response.data;
        } catch (error) {
            displayResultMessage(`获取房间信息失败: ${error.message}`, 'error');
            console.error('获取房间信息失败:', error);
            throw error;
        }
    }

    // 3. 函数：获取所有直播分区
    async function fetchAreaList() {
        if (availableAreas) return availableAreas.data;
        try {
            const response = await makeApiRequest({
                method: 'GET',
                url: 'https://api.live.bilibili.com/room/v1/Area/getList?show_pinyin=1'
            });
            availableAreas = response;
            return response.data;
        } catch (error) {
            displayResultMessage(`获取分区列表失败: ${error.message}`, 'error');
            console.error('获取分区列表失败:', error);
            throw error;
        }
    }

    // 4. 函数：执行开播请求
    async function startLiveStream(roomId, areaV2) {
        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            displayResultMessage('错误：无法获取到 CSRF token (bili_jct)。请确保您已登录B站。', 'error');
            return;
        }

        const build = '8786';
        const platform = 'pc_link';

        const formData = new URLSearchParams();
        formData.append('room_id', roomId);
        formData.append('platform', platform);
        formData.append('area_v2', areaV2);
        formData.append('build', build);
        formData.append('csrf', csrfToken);
        formData.append('csrf_token', csrfToken);

        console.log('发送开播请求，数据:', Object.fromEntries(formData));
        displayResultMessage('正在尝试开播，请稍候...', 'info', false); // Display "trying to start" message, don't auto-dismiss

        try {
            const data = await makeApiRequest({
                method: 'POST',
                url: 'https://api.live.bilibili.com/room/v1/Room/startLive',
                data: formData.toString(),
            });
            await fetchRoomInfo(true);

            if (data.data && data.data.rtmp) {
                const rtmpAddr = data.data.rtmp.addr;
                const rtmpCode = data.data.rtmp.code;
                const liveKey = data.data.live_key;
                const fullRtmpUrl = `${rtmpAddr}${rtmpCode}`;

                const messageHtml = `
                    <h4>开播成功！🎉</h4>
                    <div class="result-item">
                        <span>推流服务器 (Server):</span>
                        <input type="text" value="${rtmpAddr}" readonly id="rtmpAddrResult" />
                        <button class="copy-btn" data-clipboard-target="#rtmpAddrResult">复制</button>
                    </div>
                    <div class="result-item">
                        <span>串流密钥 (Stream Key):</span>
                        <input type="text" value="${rtmpCode}" readonly id="rtmpCodeResult" />
                        <button class="copy-btn" data-clipboard-target="#rtmpCodeResult">复制</button>
                    </div>
                     <div class="result-item">
                        <span>备用-直播密钥 (Live Key):</span>
                        <input type="text" value="${liveKey}" readonly id="liveKeyResult" />
                        <button class="copy-btn" data-clipboard-target="#liveKeyResult">复制</button>
                    </div>
                    <div class="result-item">
                        <span>完整推流地址 (Full RTMP):</span>
                        <input type="text" value="${fullRtmpUrl}" readonly id="fullRtmpResult" />
                        <button class="copy-btn" data-clipboard-target="#fullRtmpResult">复制</button>
                    </div>
                    <p style="font-size:0.9em; color: #555;">OBS等软件通常需要分别填写“服务器地址”和“串流密钥”。</p>
                `;
                // 修改此处：autoDismiss 设置为 false
                displayResultMessage(messageHtml, 'success', false); // <<<< MODIFIED HERE
            } else {
                const errorDetail = `开播成功，但未找到完整的推流信息。API响应: <pre>${JSON.stringify(data, null, 2)}</pre>`;
                displayResultMessage(errorDetail, 'warning', true, 10000); // Warnings can auto-dismiss
            }
            hideAreaSelectionModal();
        } catch (error) {
            displayResultMessage(`开播失败: ${error.message}`, 'error'); // Errors can auto-dismiss
            console.error('开播失败:', error);
        }
    }

    // 新增：执行关播请求的函数
    async function stopLiveStream() {
        const stopButton = document.getElementById('customStopLiveButton');
        if(stopButton) {
            stopButton.disabled = true;
            stopButton.textContent = '正在关播...';
        }

        const csrfToken = getCsrfToken();
        if (!csrfToken) {
            displayResultMessage('错误：无法获取到 CSRF token (bili_jct)。请确保您已登录B站。', 'error');
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
            return;
        }

        let roomIdToStop = null;
        try {
            const roomData = await fetchRoomInfo();
            roomIdToStop = roomData.room_id;
        } catch (e) {
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
            return;
        }

        if (!roomIdToStop) {
            displayResultMessage('错误：无法获取房间ID以进行关播。', 'error');
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
            return;
        }

        const platform = 'pc_link';
        const formData = new URLSearchParams();
        formData.append('room_id', roomIdToStop);
        formData.append('platform', platform);
        formData.append('csrf', csrfToken);
        formData.append('csrf_token', csrfToken);

        console.log('发送关播请求，数据:', Object.fromEntries(formData));
        displayResultMessage('正在尝试关播，请稍候...', 'info', false);

        try {
            const data = await makeApiRequest({
                method: 'POST',
                url: 'https://api.live.bilibili.com/room/v1/Room/stopLive',
                data: formData.toString(),
            });
            await fetchRoomInfo(true);

            let message = `关播操作已发送。状态: ${data.data && data.data.status ? data.data.status : '未知'}`;
            if (data.msg === "重复关播") {
                message = "当前直播间未在直播状态，或已成功关播。";
                 displayResultMessage(message, 'info'); // Auto-dismiss for info/warnings
            } else if (data.code === 0) {
                message = `关播成功！当前状态: ${data.data && data.data.status ? data.data.status : 'PREPARING'}`;
                displayResultMessage(message, 'success'); // Auto-dismiss for success
            } else {
                 displayResultMessage(`关播响应异常: ${data.message || data.msg}`, 'warning');
            }
            console.log('关播API响应:', data);

        } catch (error) {
            displayResultMessage(`关播失败: ${error.message}`, 'error');
            console.error('关播失败:', error);
        } finally {
            if(stopButton) {
                stopButton.disabled = false;
                stopButton.textContent = '一键关播';
            }
        }
    }


    // 显示结果信息的函数
    function displayResultMessage(message, type = 'info', autoDismiss = true, duration = 5000) {
        let resultBox = document.getElementById('userscriptResultBox');
        if (!resultBox) {
            resultBox = document.createElement('div');
            resultBox.id = 'userscriptResultBox';
            document.body.appendChild(resultBox);

            const closeButton = document.createElement('button');
            closeButton.id = 'resultBoxCloseButton';
            closeButton.innerHTML = '×'; // HTML entity for multiplication sign (X)
            closeButton.onclick = () => {
                resultBox.style.display = 'none';
                if (resultBoxTimeoutId) clearTimeout(resultBoxTimeoutId); // Clear timeout if manually closed
            };
            resultBox.appendChild(closeButton);
        }

        let messageContent = resultBox.querySelector('.message-content');
        if (!messageContent) {
            messageContent = document.createElement('div');
            messageContent.className = 'message-content';
             if (resultBox.firstChild && resultBox.firstChild.id === 'resultBoxCloseButton' && resultBox.firstChild.nextSibling) {
                 resultBox.insertBefore(messageContent, resultBox.firstChild.nextSibling);
             } else if (resultBox.firstChild && resultBox.firstChild.id === 'resultBoxCloseButton') {
                 resultBox.appendChild(messageContent);
             }
             else {
                 resultBox.appendChild(messageContent);
             }
        }

        messageContent.innerHTML = message;
        resultBox.className = ''; // Clear existing classes before adding new ones
        resultBox.classList.add('userscript-result-box-base'); // Add base class
        resultBox.classList.add(`userscript-result-box-${type}`); // Add type-specific class
        resultBox.style.display = 'block';

        messageContent.querySelectorAll('.copy-btn').forEach(button => {
            button.onclick = (e) => {
                const targetId = e.target.getAttribute('data-clipboard-target');
                const inputElement = document.querySelector(targetId);
                if (inputElement) {
                    inputElement.select();
                    inputElement.setSelectionRange(0, 99999);
                    try {
                        document.execCommand('copy');
                        e.target.textContent = '已复制!';
                        setTimeout(() => { e.target.textContent = '复制'; }, 1500);
                    } catch (err) {
                        console.error('复制失败:', err);
                        e.target.textContent = '复制失败';
                        setTimeout(() => { e.target.textContent = '复制'; }, 1500);
                    }
                    if (window.getSelection) {
                        window.getSelection().removeAllRanges();
                    } else if (document.selection) {
                        document.selection.empty();
                    }
                }
            };
        });

        if (resultBoxTimeoutId) { // Clear any existing timeout
            clearTimeout(resultBoxTimeoutId);
            resultBoxTimeoutId = null;
        }

        if (autoDismiss) {
            resultBoxTimeoutId = setTimeout(() => {
                if (resultBox) resultBox.style.display = 'none';
            }, duration);
        }
    }


    // 5. 创建和管理分区选择模态框
    function createAreaSelectionModal() {
        if (document.getElementById('areaSelectionModal')) return;

        const modalHTML = `
            <div id="areaSelectionModalOverlay"></div>
            <div id="areaSelectionModal">
                <h2>选择直播分区</h2>
                <div>
                    <label for="parentAreaSelect">父分区:</label>
                    <select id="parentAreaSelect"></select>
                </div>
                <div>
                    <label for="subAreaSelect">子分区:</label>
                    <select id="subAreaSelect"></select>
                </div>
                <div id="modalButtons">
                    <button id="confirmStartLiveBtn">确认开播</button>
                    <button id="cancelStartLiveBtn">取消</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const parentSelect = document.getElementById('parentAreaSelect');
        parentSelect.addEventListener('change', () => {
            const selectedParentId = parentSelect.value;
            // Ensure availableAreas is loaded before trying to access its data
            if (availableAreas && availableAreas.data) {
                populateSubAreas(selectedParentId, availableAreas.data);
            } else {
                console.warn("Area list not loaded yet for populating sub-areas.");
            }
        });

        document.getElementById('confirmStartLiveBtn').addEventListener('click', async () => {
            const selectedSubAreaId = document.getElementById('subAreaSelect').value;
            if (!selectedSubAreaId) {
                displayResultMessage('请选择一个子分区！', 'warning');
                return;
            }
            let roomData;
            try {
                roomData = await fetchRoomInfo();
                if (!roomData || !roomData.room_id) {
                    displayResultMessage('无法获取房间ID，请重试。', 'error');
                    return;
                }
            } catch (e) {
                return;
            }

            document.getElementById('confirmStartLiveBtn').disabled = true;
            document.getElementById('confirmStartLiveBtn').textContent = '处理中...';
            await startLiveStream(roomData.room_id, selectedSubAreaId);
            document.getElementById('confirmStartLiveBtn').disabled = false;
            document.getElementById('confirmStartLiveBtn').textContent = '确认开播';
        });

        document.getElementById('cancelStartLiveBtn').addEventListener('click', hideAreaSelectionModal);
        document.getElementById('areaSelectionModalOverlay').addEventListener('click', hideAreaSelectionModal);
    }

    function populateParentAreas(areas, defaultParentId) {
        const parentSelect = document.getElementById('parentAreaSelect');
        parentSelect.innerHTML = '<option value="">--请选择父分区--</option>';
        if (!areas) {
            console.error("Cannot populate parent areas: area data is null.");
            return;
        }
        areas.forEach(parentArea => {
            const option = document.createElement('option');
            option.value = parentArea.id;
            option.textContent = parentArea.name;
            parentSelect.appendChild(option);
        });
        if (defaultParentId) {
            parentSelect.value = defaultParentId;
        }
    }

    function populateSubAreas(parentId, allAreas, defaultSubId) {
        const subSelect = document.getElementById('subAreaSelect');
        subSelect.innerHTML = '<option value="">--请选择子分区--</option>';
        if (!parentId || !allAreas) return;

        const parent = allAreas.find(p => p.id.toString() === parentId.toString());
        if (parent && parent.list) {
            parent.list.forEach(subArea => {
                const option = document.createElement('option');
                option.value = subArea.id;
                option.textContent = subArea.name;
                subSelect.appendChild(option);
            });
        }
        if (defaultSubId) {
            subSelect.value = defaultSubId;
        }
    }

    async function showAreaSelectionModal() {
        if (!document.getElementById('areaSelectionModal')) {
            createAreaSelectionModal();
        }
        document.getElementById('areaSelectionModalOverlay').style.display = 'block';
        document.getElementById('areaSelectionModal').style.display = 'block';

        try {
            // Ensure data is fetched before populating.
            // These calls will use cached data if available, or fetch if not.
            const roomData = await fetchRoomInfo();
            const areasData = await fetchAreaList();

            if (roomData && areasData) {
                populateParentAreas(areasData, roomData.parent_id);
                // Dispatch change event *after* parent areas are populated
                document.getElementById('parentAreaSelect').dispatchEvent(new Event('change'));
                // Then populate sub-areas, potentially with a default
                populateSubAreas(roomData.parent_id, areasData, roomData.area_v2_id);
            } else {
                throw new Error("Failed to load necessary data for modal.");
            }
        } catch (e) {
            console.error("Error showing area selection modal:", e);
            // displayResultMessage is likely called by fetch functions already
            hideAreaSelectionModal();
        }
    }

    function hideAreaSelectionModal() {
        if (document.getElementById('areaSelectionModal')) {
            document.getElementById('areaSelectionModalOverlay').style.display = 'none';
            document.getElementById('areaSelectionModal').style.display = 'none';
        }
    }


    // 6. 创建并添加主按钮到页面
    function addActionButtons() {
        const startButton = document.createElement('button');
        startButton.id = 'customStartLiveAdvancedButton';
        startButton.textContent = '一键开播';
        startButton.addEventListener('click', async () => {
            startButton.disabled = true;
            startButton.textContent = '加载数据...';
            try {
                await showAreaSelectionModal();
            } catch (error) {
                console.error("开播按钮点击处理失败:", error);
            }
            startButton.disabled = false;
            startButton.textContent = '一键开播';
        });
        document.body.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.id = 'customStopLiveButton';
        stopButton.textContent = '一键关播';
        stopButton.addEventListener('click', stopLiveStream);
        document.body.appendChild(stopButton);

        console.log('B站开播/关播按钮已添加。');
    }

    // 7. 添加CSS样式
    GM_addStyle(`
        #customStartLiveAdvancedButton, #customStopLiveButton {
            position: fixed;
            right: 20px;
            z-index: 9998;
            padding: 10px 15px;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease, opacity 0.2s ease;
        }
        #customStartLiveAdvancedButton {
            bottom: 120px;
            background-color: #fb7299;
        }
        #customStartLiveAdvancedButton:hover {
            background-color: #f0628a;
        }
        #customStopLiveButton {
            bottom: 70px;
            background-color: #757575;
        }
        #customStopLiveButton:hover {
            background-color: #616161;
        }
        #customStartLiveAdvancedButton:disabled, #customStopLiveButton:disabled {
            background-color: #ccc;
            cursor: not-allowed;
            opacity: 0.7;
        }

        #areaSelectionModalOverlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 10000;
        }
        #areaSelectionModal {
            display: none;
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px 30px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10001;
            min-width: 300px;
        }
        #areaSelectionModal h2 {
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
        }
        #areaSelectionModal div:not(#modalButtons) {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        #areaSelectionModal label {
            display: inline-block;
            width: 80px;
            margin-right: 10px;
            color: #555;
            text-align: right;
            flex-shrink: 0;
        }
        #areaSelectionModal select {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #modalButtons {
            text-align: right;
            margin-top: 20px;
        }
        #modalButtons button {
            padding: 8px 15px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #confirmStartLiveBtn {
            background-color: #00aeec;
            color: white;
        }
        #confirmStartLiveBtn:hover {
            background-color: #0095cc;
        }
        #confirmStartLiveBtn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        #cancelStartLiveBtn {
            background-color: #e7e7e7;
            color: #333;
        }
        #cancelStartLiveBtn:hover {
            background-color: #d0d0d0;
        }

        .userscript-result-box-base {
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            padding: 15px;
            padding-top: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            box-sizing: border-box;
        }
        #resultBoxCloseButton {
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
            color: #aaa;
            padding: 0;
        }
        #resultBoxCloseButton:hover {
            color: #333;
        }
        .userscript-result-box-info {
            background-color: #e6f7ff;
            border: 1px solid #91d5ff;
            color: #0050b3;
        }
        .userscript-result-box-success {
            background-color: #f6ffed;
            border: 1px solid #b7eb8f;
            color: #389e0d;
        }
        .userscript-result-box-success h4 {
            color: #237804;
        }
        .userscript-result-box-warning {
            background-color: #fffbe6;
            border: 1px solid #ffe58f;
            color: #ad6800;
        }
        .userscript-result-box-error {
            background-color: #fff1f0;
            border: 1px solid #ffa39e;
            color: #cf1322;
        }
        .userscript-result-box-base .message-content h4 {
            margin-top: 0;
            margin-bottom: 12px;
            font-size: 17px;
            font-weight: 600;
        }
        .userscript-result-box-base .result-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .userscript-result-box-base .result-item span {
            flex-basis: 150px;
            flex-shrink: 0;
            font-weight: 500;
            margin-right: 8px;
            font-size: 0.9em;
            color: #555;
        }
        .userscript-result-box-base .result-item input[type="text"] {
            flex-grow: 1;
            padding: 7px 9px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 0.9em;
            background-color: #fff;
            color: #333;
            box-sizing: border-box;
        }
        .userscript-result-box-base .copy-btn {
            margin-left: 10px;
            padding: 6px 12px;
            font-size: 0.85em;
            background-color: #1890ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .userscript-result-box-base .copy-btn:hover {
            background-color: #40a9ff;
        }
        .userscript-result-box-base pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e8e8e8;
            white-space: pre-wrap;
            word-break: break-all;
            max-height: 100px;
            overflow-y: auto;
            font-size: 0.85em;
            color: #595959;
        }
    `);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addActionButtons);
    } else {
        addActionButtons();
    }

})();