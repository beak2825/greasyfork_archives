// ==UserScript==
// @name         123 云盘资源快搜助手 | 一键生成分享链接
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  访问123panfx.com 123云盘资源社区时，点击发新帖按钮旁的「123云盘分享」图标，一键检索个人云盘资源并生成分享链接。
// @author       Walking
// @match        *://123panfx.com/*
// @match        *://www.123panfx.com/*
// @match        *://pan1.me/*
// @match        *://www.123pan.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542716/123%20%E4%BA%91%E7%9B%98%E8%B5%84%E6%BA%90%E5%BF%AB%E6%90%9C%E5%8A%A9%E6%89%8B%20%7C%20%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/542716/123%20%E4%BA%91%E7%9B%98%E8%B5%84%E6%BA%90%E5%BF%AB%E6%90%9C%E5%8A%A9%E6%89%8B%20%7C%20%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式配置
    const StyleConfig = {
        BG_COLOR: "#f5f5f7",
        ACCENT_COLOR: "#2c7be5",
        TEXT_COLOR: "#333333",
        LIGHT_TEXT: "#666666",
        BORDER_COLOR: "#e0e0e0",
        HOVER_COLOR: "#e8f0fe",
        SELECT_COLOR: "#d0e2ff",
        FONT_FAMILY: "Microsoft YaHei, sans-serif",
        FONT_SIZE: "14px",
        PADDING: "12px",
        MARGIN: "8px",
        SPACING: "10px"
    };

    // 全局存储
    const Storage = {
        get(key) {
            const value = GM_getValue(key, '');
            console.log(`[存储读取] ${key}=${value}`);
            return value;
        },
        set(key, value) {
            GM_setValue(key, value);
            console.log(`[存储写入] ${key}=${value}`);
        },
        getObj(key) {
            const val = GM_getValue(key, '{}');
            try {
                return JSON.parse(val);
            } catch (e) {
                console.error(`[存储解析失败] ${key}`, e);
                return {};
            }
        },
        setObj(key, obj) {
            GM_setValue(key, JSON.stringify(obj));
            console.log(`[存储写入对象] ${key}=${JSON.stringify(obj)}`);
        },
        clearToken() {
            GM_setValue('crossDomainToken', '');
            console.log(`[存储清除] 已清除token`);
        }
    };

    // 目标域名集合（同一网站的不同域名）
    const targetDomains = new Set([
        '123panfx.com',
        'www.123panfx.com',
        'pan1.me'
    ]);
    const tokenSourceDomain = 'www.123pan.com'; // token来源域名

    // 域名判断工具函数
    function getCurrentDomain() {
        return window.location.hostname.replace(/^www\./, ''); // 移除www.前缀统一判断
    }
    const currentDomain = getCurrentDomain();
    const isTargetDomain = targetDomains.has(currentDomain); // 是否为目标使用域名
    const isTokenSource = currentDomain === tokenSourceDomain.replace(/^www\./, ''); // 是否为token来源域名

    console.log(`[域名信息] 当前域名=${window.location.hostname}，处理后=${currentDomain}，是否目标域名=${isTargetDomain}，是否token来源=${isTokenSource}`);

    // 目标域名接收并缓存token（从URL参数）
    function handleTokenFromURL() {
        if (!isTargetDomain) return;

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const loginUuid = urlParams.get('loginUuid');

        console.log(`[目标域名接收token] token=${token ? '存在' : '不存在'}，loginUuid=${loginUuid || '空'}`);

        if (token) {
            // 持久化存储token
            Storage.set('crossDomainToken', token);
            if (loginUuid) Storage.set('loginUuid', loginUuid);

            // 移除URL中的token参数
            urlParams.delete('token');
            urlParams.delete('loginUuid');
            const cleanUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
            window.history.replaceState({}, document.title, cleanUrl);
            alert('✅ token获取成功，可以开始搜索了');
        }
    }

    // token来源域名（www.123pan.com）处理逻辑（静默优化）
    function fetchTokenAndRedirect() {
        if (!isTokenSource) return;

        // 从URL参数中获取原目标域名的跳转地址
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        console.log(`[token来源域名] redirectUrl=${redirectUrl || '空'}`);

        // 无跳转参数时，完全静默（不提示、不操作）
        if (!redirectUrl) {
            console.log(`[www.123pan.com] 无跳转参数，静默模式`);
            return;
        }

        // 有跳转参数时，读取token并跳转（仅此时执行操作）
        const token = localStorage.getItem('authorToken');
        const loginUuid = localStorage.getItem('LoginUuid');
        console.log(`[来源域名读取token] authorToken=${token ? '存在' : '不存在'}，LoginUuid=${loginUuid || '空'}`);

        // 即使token不存在，也不提示（避免干扰用户），仅在控制台输出日志
        if (!token) {
            console.log(`[www.123pan.com] 未找到token，无法完成跳转`);
            return;
        }

        // 跳转回目标域名，并携带token
        try {
            const targetUrl = new URL(decodeURIComponent(redirectUrl));
            targetUrl.searchParams.set('token', token);
            if (loginUuid) targetUrl.searchParams.set('loginUuid', loginUuid);
            console.log(`[准备跳转回目标域名] url=${targetUrl.toString()}`);
            window.location.href = targetUrl.toString();
        } catch (e) {
            console.error('[跳转地址解析失败]', e);
            // 解析失败也不提示，仅日志记录
        }
    }

    // 获取缓存的token（无效则返回null）
    function getCachedToken() {
        return Storage.get('crossDomainToken') || null;
    }

    // 处理token过期（清除缓存并重新获取）
    function handleTokenExpired() {
        console.log('[token已过期] 准备重新获取');
        Storage.clearToken();
        alert('⚠️ token已过期，请重新获取授权');
        // 跳转至token来源域名
        const currentUrl = window.location.href;
        window.location.href = `https://${tokenSourceDomain}?redirect=${encodeURIComponent(currentUrl)}`;
    }

    // 全局状态
    let globalState = {
        clientID: Storage.get('clientID'),
        clientSecret: Storage.get('clientSecret'),
        accessToken: getCachedToken(),
        loginUuid: Storage.get('loginUuid'),
        folderCache: Storage.getObj('folderCache')
    };

    // 保存状态
    function saveState() {
        Storage.set('clientID', globalState.clientID);
        Storage.set('clientSecret', globalState.clientSecret);
        Storage.set('loginUuid', globalState.loginUuid);
        Storage.setObj('folderCache', globalState.folderCache);
    }

    // 创建UI（所有目标域名都显示）
    function createUI() {
        if (!isTargetDomain) return;

        const newPostBtn = Array.from(document.querySelectorAll('a, button, span')).find(el =>
            el.textContent.trim().includes('发新帖')
        );

        const container = document.createElement('div');
        container.style.cssText = 'position: relative; display: inline-block; margin-left: 8px;';

        const shareBtn = document.createElement('button');
        shareBtn.style.cssText = `
            padding: 6px 12px;
            background-color: ${StyleConfig.ACCENT_COLOR};
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: ${StyleConfig.FONT_FAMILY};
            font-size: 14px;
        `;
        shareBtn.textContent = '123云盘分享';

        const searchBox = document.createElement('div');
        searchBox.id = 'shareSearchBox';
        searchBox.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            width: 400px;
            background: ${StyleConfig.BG_COLOR};
            border-radius: 6px;
            padding: ${StyleConfig.PADDING};
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 999998;
            display: none;
        `;
        searchBox.innerHTML = `
            <div style="margin-bottom: ${StyleConfig.SPACING}px; font-size: 16px; font-weight: bold;">
                请输入关键词搜索
            </div>
            <input type="text" id="searchInput" style="
                width: 100%;
                padding: 8px;
                border: 1px solid ${StyleConfig.BORDER_COLOR};
                border-radius: 4px;
                margin-bottom: ${StyleConfig.SPACING}px;
            " placeholder="例如：权力的游戏...">
            <button id="searchBtn" style="
                background: ${StyleConfig.ACCENT_COLOR};
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            ">搜索</button>
        `;

        const folderList = document.createElement('div');
        folderList.id = 'folderListContainer';
        folderList.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 4px;
            width: 600px;
            max-height: 500px;
            overflow-y: auto;
            background: ${StyleConfig.BG_COLOR};
            border-radius: 6px;
            padding: ${StyleConfig.PADDING};
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 999998;
            display: none;
        `;

        container.appendChild(shareBtn);
        container.appendChild(searchBox);
        container.appendChild(folderList);

        // 插入页面
        if (newPostBtn && newPostBtn.parentNode) {
            newPostBtn.parentNode.insertBefore(container, newPostBtn.nextSibling);
        } else {
            shareBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: ${StyleConfig.ACCENT_COLOR};
                border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                cursor: pointer;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            `;
            shareBtn.textContent = '123';
            document.body.appendChild(shareBtn);
            document.body.appendChild(searchBox);
            document.body.appendChild(folderList);
        }

        // 事件绑定
        shareBtn.addEventListener('click', () => {
            const isVisible = searchBox.style.display === 'block';
            searchBox.style.display = isVisible ? 'none' : 'block';
            folderList.style.display = 'none';
            if (!isVisible) document.getElementById('searchInput')?.focus();
        });

        document.getElementById('searchBtn')?.addEventListener('click', () => {
            const keyword = document.getElementById('searchInput')?.value.trim();
            if (keyword) searchFolders(keyword);
        });

        document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('searchBtn')?.click();
        });
    }

    // 搜索文件夹（处理token有效性）
    async function searchFolders(keyword) {
        if (!isTargetDomain) return;

        const cachedToken = getCachedToken();
        if (!cachedToken) {
            // 无有效token，跳转获取
            const currentUrl = window.location.href;
            console.log(`[无有效token] 准备跳转至${tokenSourceDomain}，原地址=${currentUrl}`);
            alert('需要从www.123pan.com获取授权，请点击确定跳转');
            window.location.href = `https://${tokenSourceDomain}?redirect=${encodeURIComponent(currentUrl)}`;
            return;
        }

        let allFiles = [];
        let lastFileId = 0;

        try {
            for (let i = 0; i < 3; i++) {
                const response = await fetch(`https://open-api.123pan.com/api/v2/file/list?parentFileId=0&searchData=${encodeURIComponent(keyword)}&searchMode=1&limit=100&lastFileId=${lastFileId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${cachedToken}`,
                        'Platform': 'open_platform',
                        'LoginUuid': globalState.loginUuid || ''
                    }
                });
                const data = await response.json();

                // 检查API返回的错误是否为token过期
                if (data.code === 401 || data.message?.includes('expired')) {
                    throw new Error('token expired');
                }
                if (data.code !== 0) throw new Error(`[${data.code}] ${data.message}`);

                allFiles = allFiles.concat(data.data.fileList);
                lastFileId = data.data.lastFileId;

                if (lastFileId === -1) {
                    break;
                }
            }

            const folders = allFiles
               .filter(item => item.type === 1)
               .slice(0, 20);

            for (const folder of folders) {
                folder.fullPath = await buildFullPath(folder);
            }
            showFolderList(folders);
        } catch (e) {
            console.error('[搜索失败]', e);
            // 若错误为token过期，触发重新获取
            if (e.message.includes('expired')) {
                handleTokenExpired();
            } else {
                alert(`搜索失败: ${e.message}`);
            }
        }
    }

    // 获取文件详情（处理token过期）
    async function getFileDetail(fileId) {
        if (globalState.folderCache[fileId]) {
            return globalState.folderCache[fileId];
        }
        try {
            const cachedToken = getCachedToken();
            const response = await fetch(`https://open-api.123pan.com/api/v1/file/detail?fileID=${fileId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cachedToken}`,
                    'Platform': 'open_platform',
                    'LoginUuid': globalState.loginUuid || ''
                }
            });
            const data = await response.json();

            // 检查token过期
            if (data.code === 401 || data.message?.includes('expired')) {
                throw new Error('token expired');
            }
            if (data.code !== 0) throw new Error(`[${data.code}] ${data.message}`);

            const detail = {
                filename: data.data.filename,
                parentFileID: data.data.parentFileID
            };
            globalState.folderCache[fileId] = detail;
            Storage.setObj('folderCache', globalState.folderCache);
            return detail;
        } catch (e) {
            console.error(`获取文件${fileId}详情失败:`, e);
            if (e.message.includes('expired')) {
                handleTokenExpired();
            }
            return null;
        }
    }

    // 构建文件路径
    async function buildFullPath(folder) {
        const pathParts = [folder.filename];
        let currentId = folder.parentFileId;
        for (let i = 0; i < 2; i++) {
            if (!currentId || currentId === 0) break;
            const parent = await getFileDetail(currentId);
            if (!parent) break;
            pathParts.unshift(parent.filename);
            currentId = parent.parentFileID;
        }
        return pathParts.join('/');
    }

    // 显示文件夹列表
    function showFolderList(folders) {
        const container = document.getElementById('folderListContainer');
        const searchBox = document.getElementById('shareSearchBox');
        if (folders.length === 0) {
            container.innerHTML = '<div style="padding: 10px; color: #666;">没有找到匹配的文件夹</div>';
            container.style.display = 'block';
            searchBox.style.display = 'none';
            return;
        }

        let html = `
            <div style="margin-bottom: 10px; font-weight: bold;">
                请选择文件夹（共${folders.length}个）
            </div>
            <div style="margin-bottom: 10px;">
                <input type="text" id="folderIndex" style="
                    width: 60px;
                    padding: 4px;
                    border: 1px solid ${StyleConfig.BORDER_COLOR};
                    border-radius: 4px;
                " placeholder="序号">
                <button id="goBtn" style="
                    background: ${StyleConfig.ACCENT_COLOR};
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-left: 5px;
                ">确认</button>
            </div>
            <div style="border-top: 1px solid ${StyleConfig.BORDER_COLOR}; padding-top: 10px;">
        `;

        folders.forEach((folder, index) => {
            const idx = index + 1;
            html += `
                <div class="folderItem" data-index="${index}" style="
                    padding: 10px;
                    margin-bottom: 8px;
                    border-radius: 4px;
                    background: white;
                    border: 1px solid ${StyleConfig.BORDER_COLOR};
                    cursor: pointer;
                ">
                    <div style="margin-bottom: 4px;">${idx}. ${folder.fullPath}</div>
                    <div style="font-size: 12px; color: ${StyleConfig.LIGHT_TEXT}">ID: ${folder.fileId}</div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        container.style.display = 'block';
        searchBox.style.display = 'none';

        // 绑定事件
        document.querySelectorAll('.folderItem').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                handleFolderSelect(folders[index]);
            });
            item.addEventListener('mouseover', () => item.style.backgroundColor = StyleConfig.HOVER_COLOR);
            item.addEventListener('mouseout', () => item.style.backgroundColor = 'white');
        });

        document.getElementById('goBtn').addEventListener('click', () => {
            const num = parseInt(document.getElementById('folderIndex').value) - 1;
            if (num >= 0 && num < folders.length) {
                handleFolderSelect(folders[num]);
            } else {
                alert('请输入有效的序号');
            }
        });

        document.getElementById('folderIndex').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') document.getElementById('goBtn').click();
        });
    }

    // 处理文件夹选择（处理token过期）
    async function handleFolderSelect(folder) {
        const container = document.getElementById('folderListContainer');
        const folderName = folder.filename;
        const folderId = folder.fileId;

        try {
            const existingLink = await getExistingShareLink(folderName);
            if (existingLink) {
                copyToClipboard(existingLink);
                alert(`已找到现有分享链接，已复制：\n${existingLink}`);
                container.style.display = 'none';
                return;
            }

            const newLink = await createShareLink(folderId, folderName);
            if (newLink) {
                copyToClipboard(newLink);
                alert(`分享链接已创建，已复制：\n${newLink}`);
            }
            container.style.display = 'none';
        } catch (e) {
            console.error('[处理文件夹选择失败]', e);
            if (e.message.includes('expired')) {
                handleTokenExpired();
            } else {
                alert(`操作失败: ${e.message}`);
            }
        }
    }

    // 获取已有分享链接（处理token过期）
    async function getExistingShareLink(targetName) {
        let lastShareId = 0;
        try {
            const cachedToken = getCachedToken();
            while (true) {
                const response = await fetch(`https://open-api.123pan.com/api/v1/share/list?limit=100&lastShareId=${lastShareId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${cachedToken}`,
                        'Platform': 'open_platform'
                    }
                });
                const data = await response.json();

                if (data.code === 401 || data.message?.includes('expired')) {
                    throw new Error('token expired');
                }
                if (data.code !== 0) throw new Error(`[${data.code}] ${data.message}`);

                for (const share of data.data.shareList) {
                    if (share.shareName === targetName && !share.sharePwd && !share.expired) {
                        return `https://www.123pan.com/s/${share.shareKey}`;
                    }
                }
                if (data.data.lastShareId === -1) break;
                lastShareId = data.data.lastShareId;
            }
            return null;
        } catch (e) {
            console.error('[查询已有分享失败]', e);
            if (e.message.includes('expired')) {
                throw e; // 抛给上层处理
            }
            alert(`查询已有分享失败: ${e.message}`);
            return null;
        }
    }

    // 创建分享链接（处理token过期）
    async function createShareLink(fileId, name) {
        try {
            const cachedToken = getCachedToken();
            const response = await fetch('https://open-api.123pan.com/api/v1/share/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${cachedToken}`,
                    'Platform': 'open_platform',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shareName: name,
                    shareExpire: 0,
                    fileIDList: [fileId].join(','),
                    sharePwd: null
                })
            });
            const data = await response.json();

            if (data.code === 401 || data.message?.includes('expired')) {
                throw new Error('token expired');
            }
            if (data.code !== 0) throw new Error(`[${data.code}] ${data.message}`);

            return `https://www.123pan.com/s/${data.data.shareKey}`;
        } catch (e) {
            console.error('[创建分享链接失败]', e);
            if (e.message.includes('expired')) {
                throw e; // 抛给上层处理
            }
            alert(`创建分享链接失败: ${e.message}`);
            return null;
        }
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        });
    }

    // 初始化执行
    (function init() {
        // 目标域名：接收token并创建UI
        if (isTargetDomain) {
            handleTokenFromURL();
            createUI();
        }
        // token来源域名：仅在有跳转参数时执行逻辑（完全静默）
        if (isTokenSource) {
            fetchTokenAndRedirect();
        }
    })();
})();