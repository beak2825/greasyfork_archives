// ==UserScript==
// @name         B站黑名单便捷管理
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在B站空间页面便捷地管理您的黑名单，支持分页浏览、一键移除，扫描不活跃用户（3个月未更新、已封禁、已注销）。
// @author       yingming006
// @match        https://space.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.bilibili.com
// @connect      app.biliapi.com
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/545558/B%E7%AB%99%E9%BB%91%E5%90%8D%E5%8D%95%E4%BE%BF%E6%8D%B7%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/545558/B%E7%AB%99%E9%BB%91%E5%90%8D%E5%8D%95%E4%BE%BF%E6%8D%B7%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    let currentPage = 1, pageSize = 10, totalUsers = 0, totalPages = 1, csrfToken = '', isFetchingVideo = {}, intersectionObserver = null;
    let isScanning = false;

    // --- CSS样式 ---
    GM_addStyle(`
        /* Bilibili Style Color Palette & Variables */
        :root {
            --bili-blue: #00aeec;
            --bili-blue-hover: #00b5e5;
            --bili-red: #f44336;
            --bili-red-hover: #e53935;
            --bili-orange: #ff9800;
            --bili-orange-hover: #fb8c00;
            --bili-text-main: #18191c;
            --bili-text-light: #61666d;
            --bili-text-lighter: #9499a0;
            --bili-bg-light: #fff;
            --bili-border-color: #e3e5e7;
            --bili-bg-hover: #f1f2f3;
            --bili-bg-disabled: #e3e5e7;
            --bili-text-disabled: #b8c0cc;
        }

        /* Modal Base */
        #blacklist-modal, #inactive-scan-modal {
            position: fixed; z-index: 9999; left: 0; top: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            display: none; justify-content: center; align-items: center;
        }
        #blacklist-modal-content, #inactive-scan-modal-content {
            background-color: var(--bili-bg-light);
            padding: 24px;
            width: clamp(500px, 60vw, 800px);
            max-height: 85vh;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex; flex-direction: column;
        }

        /* Modal Header */
        #blacklist-modal-header, #inactive-scan-modal-header {
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--bili-border-color);
            padding-bottom: 16px; margin-bottom: 16px;
        }
        #blacklist-modal-header h2, #inactive-scan-modal-header h2 {
            font-size: 18px; color: var(--bili-text-main); font-weight: 500;
        }
        #blacklist-modal-close, #inactive-scan-modal-close {
            color: var(--bili-text-lighter); font-size: 24px; font-weight: bold;
            cursor: pointer; transition: color 0.2s;
        }
        #blacklist-modal-close:hover, #inactive-scan-modal-close:hover {
            color: var(--bili-text-light);
        }

        /* List Container & Items */
        #blacklist-list-container, #inactive-list-container {
            flex-grow: 1; overflow-y: auto; margin-right: -8px; padding-right: 8px;
        }
        .blacklist-item {
            display: flex; align-items: center; gap: 15px;
            padding: 12px 8px;
            border-bottom: 1px solid var(--bili-border-color);
            transition: background-color 0.2s;
        }
        .blacklist-item:last-child { border-bottom: none; }
        .blacklist-item:hover { background-color: var(--bili-bg-hover); }
        .blacklist-item img { width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0; }

        /* User Info */
        .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
        .info a { text-decoration: none; color: var(--bili-blue); font-weight: 500; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px; }
        .info a:hover { color: var(--bili-blue-hover); }
        .info span { color: var(--bili-text-lighter); font-size: 12px; display: block; }

        /* Video/Status Info */
        .latest-video-info { display: flex; flex-direction: column; justify-content: center; flex: 2; min-width: 0; font-size: 13px; color: var(--bili-text-light); line-height: 1.5; }
        .latest-video-info a { color: var(--bili-text-light); text-decoration: none; }
        .latest-video-info a:hover { color: var(--bili-blue); }
        .latest-video-info .video-title { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; }
        .user-status { font-weight: bold; text-align: left; font-size: 13px; }
        .status-banned { color: var(--bili-orange); }
        .status-cancelled { color: var(--bili-text-lighter); }

        /* General Button Style */
        .btn-remove, #blacklist-pagination button, #stopScanBtn {
            padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;
            font-size: 14px; color: white; transition: background-color 0.2s;
            flex-shrink: 0;
        }
        .btn-remove:disabled, #blacklist-pagination button:disabled, #stopScanBtn:disabled {
            background-color: var(--bili-bg-disabled) !important;
            color: var(--bili-text-disabled); cursor: not-allowed;
        }
        .btn-remove { background-color: var(--bili-red); }
        .btn-remove:hover:not(:disabled) { background-color: var(--bili-red-hover); }

        /* Pagination & Scan Button */
        #blacklist-pagination {
            margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--bili-border-color);
            text-align: center; display: flex; justify-content: center; align-items: center; gap: 10px; flex-wrap: wrap;
            color: var(--bili-text-light);
        }
        #blacklist-pagination button { background-color: var(--bili-blue); }
        #blacklist-pagination button:hover:not(:disabled) { background-color: var(--bili-blue-hover); }
        #scanInactiveBtn { background-color: var(--bili-orange); margin-left: auto; }
        #scanInactiveBtn:hover:not(:disabled) { background-color: var(--bili-orange-hover); }
        #stopScanBtn { background-color: var(--bili-red); }
        #stopScanBtn:hover:not(:disabled) { background-color: var(--bili-red-hover); }
        #pageJumpInput {
            width: 50px; text-align: center; border: 1px solid var(--bili-border-color);
            border-radius: 4px; padding: 5px; font-size: 14px;
            background-color: var(--bili-bg-light);
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        #pageJumpInput:focus { border-color: var(--bili-blue); outline: none; box-shadow: 0 0 0 2px rgba(0, 174, 236, 0.2); }

        /* Utility */
        .spinner { width: 18px; height: 18px; border: 2px solid var(--bili-bg-hover); border-top: 2px solid var(--bili-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .toast-notification { position: fixed; top: 20px; right: 20px; padding: 12px 20px; border-radius: 6px; color: white; font-size: 14px; z-index: 10000; opacity: 0; transition: opacity 0.3s, top 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .toast-notification.show { top: 40px; opacity: 1; }
        .toast-notification.success { background-color: #4CAF50; }
        .toast-notification.error { background-color: #f44336; }
        #scan-status { padding: 10px; text-align: center; font-style: italic; color: var(--bili-text-light); }
        #blacklist-message { padding: 40px; text-align: center; color: var(--bili-text-light); }
    `);

    // --- 辅助函数 ---
    function getCsrfToken() { const cookies = document.cookie.split(';'); for (let c of cookies) { c = c.trim(); if (c.startsWith('bili_jct=')) return c.substring('bili_jct='.length); } return ''; }
    function showToast(message, type = 'success') { const t = document.createElement('div'); t.className = `toast-notification ${type}`; t.textContent = message; document.body.appendChild(t); setTimeout(() => t.classList.add('show'), 10); setTimeout(() => { t.classList.remove('show'); setTimeout(() => document.body.removeChild(t), 300); }, 3000); }
    function formatTimestamp(unixTimestamp) { if (!unixTimestamp) return '未知时间'; return new Date(unixTimestamp * 1000).toLocaleDateString(); }

    // --- API请求 ---
    async function fetchBlacklist(page = 1) {
        showLoadingMessage('正在加载黑名单...');
        const apiUrl = `https://api.bilibili.com/x/relation/blacks?pn=${page}&ps=${pageSize}`;
        try {
            const response = await fetch(apiUrl, { credentials: 'include' });
            const data = await response.json();
            if (data.code === 0) {
                totalUsers = data.data.total;
                totalPages = Math.ceil(totalUsers / pageSize) || 1;
                currentPage = page;
                renderBlacklist(data.data.list);
                renderPagination();
            } else { throw new Error(`API错误: ${data.message}`); }
        } catch (error) { console.error('查询黑名单失败:', error); showLoadingMessage(`查询失败: ${error.message}`); }
    }

    async function removeFromBlacklist(mid, uname, onSuccess) {
        showToast(`正在移除【${uname}】...`, 'success');
        const apiUrl = 'https://api.bilibili.com/x/relation/modify';
        const formData = new URLSearchParams({ fid: mid, act: 6, re_src: 11, csrf: csrfToken });
        try {
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData, credentials: 'include' });
            const data = await response.json();
            if (data.code === 0) {
                showToast(`用户【${uname}】已成功移出黑名单！`, 'success');
                if (onSuccess) onSuccess();
            } else { throw new Error(`API错误: ${data.message}`); }
        } catch (error) { console.error('移除失败:', error); showToast(`移除失败: ${error.message}`, 'error'); }
    }

    function fetchLatestVideo(mid, container) {
        if (isFetchingVideo[mid]) return;
        isFetchingVideo[mid] = true;
        fetchLatestVideoPromise(mid).then(result => {
            if (result && result.video) {
                const video = result.video;
                const pubDate = new Date(video.ctime * 1000).toLocaleDateString();
                container.innerHTML = `<div><a class="video-title" href="//www.bilibili.com/video/${video.bvid}" target="_blank" title="${video.title}">${video.title}</a><span style="color: var(--bili-text-lighter);">发布于: ${pubDate}</span></div>`;
            } else {
                container.textContent = result.message;
            }
        }).finally(() => { delete isFetchingVideo[mid]; });
    }

    function fetchLatestVideoPromise(mid) {
        return new Promise((resolve) => {
            const params = new URLSearchParams({ vmid: mid, ps: 1, order: 'pubdate', build: '8430300', mobi_app: 'android', platform: 'android', qn: 80 });
            GM_xmlhttpRequest({
                method: "GET", url: `https://app.biliapi.com/x/v2/space/archive/cursor?${params.toString()}`,
                headers: { 'User-Agent': 'Mozilla/5.0' }, anonymous: true,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data.item && data.data.item.length > 0) resolve({ video: data.data.item[0], message: '成功' });
                        else resolve({ video: null, message: '未找到或隐藏了动态' });
                    } catch (e) { resolve({ video: null, message: '数据解析失败' }); }
                },
                onerror: function() { resolve({ video: null, message: '获取失败' }); }
            });
        });
    }

    // --- 渲染函数 ---
    function renderBlacklist(users) {
        const container = document.getElementById('blacklist-list-container');
        container.innerHTML = '';
        if (intersectionObserver) intersectionObserver.disconnect();
        if (!users || users.length === 0) { container.innerHTML = '<div id="blacklist-message">黑名单中没有用户。</div>'; return; }

        intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const mid = target.dataset.mid;
                    fetchLatestVideo(mid, target);
                    intersectionObserver.unobserve(target);
                }
            });
        }, { root: container });

        users.forEach(user => {
            const faceUrl = user.face.startsWith('//') ? 'https:' + user.face : user.face;
            const userSpaceUrl = `https://space.bilibili.com/${user.mid}`;
            const item = document.createElement('div');
            item.className = 'blacklist-item';

            const isBanned = user.uname.startsWith('bili_') && user.uname === `bili_${user.mid}`;
            const isCancelled = user.uname === '账号已注销';
            let statusOrVideoHTML = isBanned ? `<div class="latest-video-info"><span class="user-status status-banned">状态: 已封禁</span></div>`
                : isCancelled ? `<div class="latest-video-info"><span class="user-status status-cancelled">状态: 已注销</span></div>`
                : `<div class="latest-video-info" data-mid="${user.mid}"><div class="spinner"></div></div>`;

            const addTime = formatTimestamp(user.mtime);
            const userInfoHTML = `
                <div class="info">
                    <a href="${userSpaceUrl}" target="_blank" title="${user.uname}">${user.uname}</a>
                    <span>MID: ${user.mid}</span>
                    <span>拉黑于: ${addTime}</span>
                </div>`;

            item.innerHTML = `<a href="${userSpaceUrl}" target="_blank"><img src="${faceUrl.replace('http:', 'https:')}" alt="${user.uname}的头像"></a>${userInfoHTML}${statusOrVideoHTML}<button class="btn-remove">移除</button>`;
            container.appendChild(item);
            const removeBtn = item.querySelector('.btn-remove');
            removeBtn.onclick = () => { removeFromBlacklist(user.mid, user.uname, () => { removeBtn.textContent = '已移除'; removeBtn.disabled = true; }); };
            if (!isBanned && !isCancelled) intersectionObserver.observe(item.querySelector('.latest-video-info'));
        });
    }

    function renderPagination() {
        const container = document.getElementById('blacklist-pagination');
        if (totalUsers === 0) { container.innerHTML = ''; return; }
        container.innerHTML = `<button id="scanInactiveBtn">扫描不活跃用户</button><div><button id="prevPageBtn">上一页</button><span style="margin: 0 8px;">第</span><input type="number" id="pageJumpInput" value="${currentPage}" min="1" max="${totalPages}"><span> / ${totalPages} 页 (共 ${totalUsers} 人)</span><button id="jumpPageBtn" style="margin-left:8px;">跳转</button><button id="nextPageBtn" style="margin-left:8px;">下一页</button></div>`;
        document.getElementById('prevPageBtn').disabled = currentPage <= 1;
        document.getElementById('nextPageBtn').disabled = currentPage >= totalPages;
        document.getElementById('prevPageBtn').onclick = () => fetchBlacklist(currentPage - 1);
        document.getElementById('nextPageBtn').onclick = () => fetchBlacklist(currentPage + 1);
        document.getElementById('scanInactiveBtn').onclick = scanForInactiveUsers;
        const jumpInput = document.getElementById('pageJumpInput');
        const jumpBtn = document.getElementById('jumpPageBtn');
        const jumpToPage = () => {
            let pageNum = parseInt(jumpInput.value, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) { fetchBlacklist(pageNum); }
            else { showToast(`请输入 1 到 ${totalPages} 之间的有效页码！`, 'error'); jumpInput.value = currentPage; }
        };
        jumpBtn.onclick = jumpToPage;
        jumpInput.onkeydown = (event) => { if (event.key === 'Enter') { event.preventDefault(); jumpToPage(); } };
    }

    function showLoadingMessage(msg) {
        document.getElementById('blacklist-list-container').innerHTML = `<div id="blacklist-message">${msg}</div>`;
        document.getElementById('blacklist-pagination').innerHTML = '';
    }

    // --- 不活跃用户扫描功能 ---
    async function scanForInactiveUsers() {
        if (isScanning) { showToast('扫描已在进行中...', 'error'); return; }
        isScanning = true;

        const scanModal = document.getElementById('inactive-scan-modal');
        const scanContainer = document.getElementById('inactive-list-container');
        const scanStatus = document.getElementById('scan-status');
        const stopScanBtn = document.getElementById('stopScanBtn');

        scanModal.style.display = 'flex';
        scanContainer.innerHTML = '';
        stopScanBtn.style.display = 'inline-block';
        stopScanBtn.disabled = false;
        stopScanBtn.textContent = '中止扫描';

        let inactiveUsersFoundCount = 0;
        let scanPage = 1;
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        while (scanPage <= totalPages && isScanning) {
            scanStatus.textContent = `正在扫描第 ${scanPage}/${totalPages} 页... 已找到 ${inactiveUsersFoundCount} 位不活跃用户...`;
            try {
                const response = await fetch(`https://api.bilibili.com/x/relation/blacks?pn=${scanPage}&ps=${pageSize}`, { credentials: 'include' });
                const data = await response.json();
                if (data.code !== 0) throw new Error(data.message);

                const usersToCheckVideo = [];
                for (const user of data.data.list) {
                    if (!isScanning) break;
                    const isBanned = user.uname.startsWith('bili_') && user.uname === `bili_${user.mid}`;
                    const isCancelled = user.uname === '账号已注销';
                    if (isBanned || isCancelled) {
                        inactiveUsersFoundCount++;
                        renderInactiveUser(user, null);
                    } else {
                        usersToCheckVideo.push(user);
                    }
                }

                if (isScanning && usersToCheckVideo.length > 0) {
                    const videoPromises = usersToCheckVideo.map(user => fetchLatestVideoPromise(user.mid).then(result => ({ user, result })));
                    const results = await Promise.all(videoPromises);
                    for (const { user, result } of results) {
                        if (!isScanning) break;
                        if (result.video) {
                            const videoDate = new Date(result.video.ctime * 1000);
                            if (videoDate < threeMonthsAgo) {
                                inactiveUsersFoundCount++;
                                renderInactiveUser(user, result.video);
                            }
                        } else {
                            // 如果用户没有视频动态，也视为不活跃
                            inactiveUsersFoundCount++;
                            renderInactiveUser(user, null, '未找到动态');
                        }
                    }
                }
                scanPage++;
            } catch (error) {
                scanStatus.textContent = `扫描出错: ${error.message}。已停止。`;
                isScanning = false;
            }
        }

        if (!isScanning && scanPage <= totalPages) {
            scanStatus.textContent = `扫描已中止。共扫描 ${scanPage - 1} 页，找到 ${inactiveUsersFoundCount} 位不活跃用户。`;
        } else if (inactiveUsersFoundCount === 0) {
            scanStatus.textContent = `扫描完成。在 ${totalPages} 页中未找到不活跃用户。`;
        } else {
            scanStatus.textContent = `扫描完成！共找到 ${inactiveUsersFoundCount} 位不活跃用户。`;
        }
        isScanning = false;
        stopScanBtn.style.display = 'none';
    }

    function renderInactiveUser(user, video, message = '') {
        const container = document.getElementById('inactive-list-container');
        const item = document.createElement('div');
        item.className = 'blacklist-item';
        item.id = `inactive-user-${user.mid}`;
        const faceUrl = user.face.startsWith('//') ? 'https:' + user.face : user.face;
        const userSpaceUrl = `https://space.bilibili.com/${user.mid}`;

        let statusOrVideoHTML = '';
        if (video) {
            const pubDate = new Date(video.ctime * 1000).toLocaleDateString();
            statusOrVideoHTML = `<div class="latest-video-info"><div><a class="video-title" href="//www.bilibili.com/video/${video.bvid}" target="_blank" title="${video.title}">${video.title}</a><span style="color: var(--bili-text-lighter);">最后更新: ${pubDate} (超过3个月)</span></div></div>`;
        } else {
            const isBanned = user.uname.startsWith('bili_') && user.uname === `bili_${user.mid}`;
            if (isBanned) {
                statusOrVideoHTML = `<div class="latest-video-info"><span class="user-status status-banned">状态: 已封禁</span></div>`;
            } else if(user.uname === '账号已注销') {
                statusOrVideoHTML = `<div class="latest-video-info"><span class="user-status status-cancelled">状态: 已注销</span></div>`;
            } else {
                statusOrVideoHTML = `<div class="latest-video-info"><span class="user-status status-cancelled">状态: ${message || '无动态'}</span></div>`;
            }
        }

        const addTime = formatTimestamp(user.mtime);
        const userInfoHTML = `
            <div class="info">
                <a href="${userSpaceUrl}" target="_blank" title="${user.uname}">${user.uname}</a>
                <span>MID: ${user.mid}</span>
                <span>拉黑于: ${addTime}</span>
            </div>`;

        item.innerHTML = `<a href="${userSpaceUrl}" target="_blank"><img src="${faceUrl.replace('http:', 'https:')}" alt="${user.uname}的头像"></a>${userInfoHTML}${statusOrVideoHTML}<button class="btn-remove">移除</button>`;
        container.appendChild(item);
        const removeBtn = item.querySelector('.btn-remove');
        removeBtn.onclick = () => { removeFromBlacklist(user.mid, user.uname, () => { removeBtn.textContent = '已移除'; removeBtn.disabled = true; }); };
    }


    // --- 初始化 ---
    function init() {
        const modal = document.createElement('div');
        modal.id = 'blacklist-modal';
        modal.innerHTML = `<div id="blacklist-modal-content"><div id="blacklist-modal-header"><h2>黑名单管理</h2><span id="blacklist-modal-close">&times;</span></div><div id="blacklist-list-container"></div><div id="blacklist-pagination"></div></div>`;
        document.body.appendChild(modal);

        const scanModal = document.createElement('div');
        scanModal.id = 'inactive-scan-modal';
        scanModal.innerHTML = `
            <div id="inactive-scan-modal-content">
                <div id="inactive-scan-modal-header">
                    <h2>不活跃用户扫描结果</h2>
                    <div>
                        <button id="stopScanBtn" style="display:none;">中止扫描</button>
                        <span id="inactive-scan-modal-close" style="margin-left: 15px;">&times;</span>
                    </div>
                </div>
                <div id="scan-status">点击主面板的扫描按钮开始...</div>
                <div id="inactive-list-container"></div>
            </div>`;
        document.body.appendChild(scanModal);

        const floatBtn = document.createElement('button');
        floatBtn.textContent = '管理黑名单';
        Object.assign(floatBtn.style, {
            position: 'fixed',
            bottom: '120px',
            left: '30px',
            zIndex: '9998',
            padding: '10px 15px',
            backgroundColor: 'var(--bili-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '14px',
            transition: 'background-color 0.2s'
        });
        floatBtn.onmouseover = () => floatBtn.style.backgroundColor = 'var(--bili-blue-hover)';
        floatBtn.onmouseout = () => floatBtn.style.backgroundColor = 'var(--bili-blue)';
        document.body.appendChild(floatBtn);

        floatBtn.onclick = () => {
            csrfToken = getCsrfToken();
            if (!csrfToken) { showToast('获取登录信息失败，请确保您已登录B站！', 'error'); return; }
            isFetchingVideo = {};
            modal.style.display = 'flex';
            fetchBlacklist(1);
        };

        const closeModal = () => { modal.style.display = 'none'; };
        document.getElementById('blacklist-modal-close').onclick = closeModal;
        modal.onclick = (event) => { if (event.target == modal) closeModal(); };

        const stopScanBtn = document.getElementById('stopScanBtn');
        const closeScanModal = () => {
            scanModal.style.display = 'none';
            if(isScanning) {
                isScanning = false;
                showToast('扫描已中止', 'success');
            }
        };
        stopScanBtn.onclick = () => {
            if(isScanning) {
                isScanning = false;
                stopScanBtn.disabled = true;
                stopScanBtn.textContent = '正在中止...';
                showToast('扫描将在当前页面完成后中止...', 'success');
            }
        };
        document.getElementById('inactive-scan-modal-close').onclick = closeScanModal;
        scanModal.onclick = (event) => { if (event.target == scanModal) closeScanModal(); };
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();