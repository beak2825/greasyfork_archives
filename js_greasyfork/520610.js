// ==UserScript==
// @name         B站动态批量删除助手
// @version      0.30 
// @description  这是一个帮助B站用户高效管理个人动态的脚本，支持多种类型动态的批量删除操作。
// @author       梦把我
// @match        https://space.bilibili.com/*
// @match        http://space.bilibili.com/*
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @require      https://unpkg.com/axios@1.7.3/dist/axios.min.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @namespace https://greasyfork.org/users/1383389
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520610/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/520610/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 动态类型映射配置 - 集中管理所有动态类型数字
    const DYNAMIC_TYPES = {
        REPOST: 1,          // 转发动态
        IMAGE: 2,           // 图片动态  
        TEXT: 2,            // 文字动态
        VIDEO: 8,           // 视频动态
        SHORT_VIDEO: 16,    // 小视频动态
        ARTICLE: 64,        // 专栏动态
        MUSIC: 256,         // 音乐动态
        BANGUMI: 512,       // 番剧动态
        LIVE: 4200,         // 直播动态
        LIVE_RECORD: 4201   // 直播回放动态
    };

    const uid = window.location.pathname.split("/")[1];

    function getUserCSRF() {
        return document.cookie.split("; ").find(row => row.startsWith("bili_jct="))?.split("=")[1];
    }

    const csrfToken = getUserCSRF();

    class Api {
        constructor() { }

        async spaceHistory(offset = 0) { // 获取个人动态
            return this.retryOn429(() => this._api(
                `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?visitor_uid=${uid}&host_uid=${uid}&offset_dynamic_id=${offset}`,
                {}, "get"
            ));
        }

        async removeDynamic(id) { // 删除动态
            return this._api(
                "https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/rm_dynamic",
                { dynamic_id: id, csrf_token: csrfToken }
            );
        }

        async _api(url, data, method = "post") { // 通用请求
            // 检查 axios 是否可用，如果不可用则使用 fetch 作为备用方案
            if (typeof axios !== 'undefined') {
                return axios({
                    url,
                    method,
                    data: this.transformRequest(data),
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => res.data);
            } else {
                // 使用 fetch 作为备用方案
                const options = {
                    method: method.toUpperCase(),
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                if (method.toLowerCase() === 'post') {
                    options.body = this.transformRequest(data);
                } else if (method.toLowerCase() === 'get' && Object.keys(data).length > 0) {
                    // 对于 GET 请求，将参数添加到 URL
                    const params = this.transformRequest(data);
                    url += (url.includes('?') ? '&' : '?') + params;
                }

                const response = await fetch(url, options);
                return await response.json();
            }
        }

        transformRequest(data) { // 转换请求参数
            return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        }

        async fetchJsonp(url) { // jsonp请求
            return fetchJsonp(url).then(res => res.json());
        }

        async retryOn429(func, retries = 5, delay = 100) { // 出现429错误时冷却100ms重试，出现412错误时提示并退出
            while (retries > 0) {
                try {
                    return await func();
                } catch (err) {
                    if (err.response && err.response.status === 429) {
                        await this.sleep(delay);
                        retries--;
                    } else if (err.response && err.response.status === 412) {
                        alert('由于请求过于频繁，IP暂时被ban，请更换IP或稍后再试。');
                        throw new Error('IP blocked, please retry later.');
                    } else {
                        throw err;
                    }
                }
            }
            throw new Error('Too many retries, request failed.');
        }

        sleep(ms) { // 睡眠
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    const api = new Api();
    const buttons = [
        ".onlyDeleteRepost",
        ".deleteVideo",
        ".deleteImage",
        ".deleteText",
        ".deleteArticle",
        ".deleteShortVideo"
    ];
    let logNode;

    // 添加确认状态管理
    const confirmStates = {
        deleteStates: {},
        resetTimer: null
    };

    // 获取当前URL中的UID
    function getCurrentUID() {
        const pathParts = window.location.pathname.split('/');
        return pathParts[1] || '';
    }

    // 获取自己的UID（通过访问space.bilibili.com）
    async function getMyUID() {
        try {
            const response = await fetch('https://space.bilibili.com/', {
                credentials: 'include'  // 确保携带cookie
            });
            // 获取重定向后的URL
            const redirectUrl = response.url;
            const uid = redirectUrl.split('/').pop();
            return uid;
        } catch (error) {
            console.error('获取用户UID失败:', error);
            return null;
        }
    }

    async function init() {
        try {
            // 检查依赖库是否加载成功
            console.log('检查依赖库状态:');
            console.log('axios 可用:', typeof axios !== 'undefined');
            console.log('fetch 可用:', typeof fetch !== 'undefined');

            if (typeof axios === 'undefined' && typeof fetch === 'undefined') {
                console.error('错误: axios 和 fetch 都不可用，脚本无法正常工作');
                alert('脚本加载失败：网络请求库不可用，请刷新页面重试');
                return;
            }

            // 等待页面加载完成
            await new Promise(resolve => setTimeout(resolve, 500));

            // 获取当前页面UID和自己的UID
            const currentUID = getCurrentUID();
            const myUID = await getMyUID();

            // 判断是否为自己的空间
            if (!currentUID || !myUID || currentUID !== myUID) {
                console.log('当前不是自己的个人动态页面，脚本未启用');
                return;
            }

            // 创建控制面板节点
            const node = createControlPanel();

            // 尝试插入到新版或旧版界面
            try {
                // 先尝试获取新版界面的位置
                const newVersionContainer = document.querySelector("#app > main > div.space-dynamic > div.space-dynamic__right");
                if (newVersionContainer) {
                    const firstChild = newVersionContainer.querySelector("div:nth-child(1)");
                    if (firstChild) {
                        newVersionContainer.insertBefore(node, firstChild);
                    } else {
                        newVersionContainer.appendChild(node);
                    }
                    console.log('成功插入到新版界面');
                } else {
                    // 如果找不到新版界面，尝试旧版界面
                    const oldVersionContainer = document.querySelector("#page-dynamic .col-2");
                    if (oldVersionContainer) {
                        oldVersionContainer.appendChild(node);
                        console.log('成功插入到旧版界面');
                    } else {
                        console.error('无法找到合适的插入位置');
                        return;
                    }
                }

                // 设置事件监听
                setEventListeners();

                // 设置教程链接
                document.querySelector('.tutorial-btn').href = 'https://www.bilibili.com/video/BV13NBnYyEML/';

                // 添加样式
                addConfirmationStyles();

            } catch (error) {
                console.error('插入控制面板失败:', error);
            }

        } catch (error) {
            console.error('验证用户身份失败:', error);
        }
    }

    function createControlPanel() {
        const node = document.createElement("div");
        node.className = "msc_panel";
        node.innerHTML = `
            <div class="inner">
                <div class="panel-section quick-actions">
                    <h3>快捷操作</h3>
                    <div class="button-group">
                        <button class="onlyDeleteRepost">删除转发动态</button>
                        <button class="deleteVideo">删除视频动态</button>
                        <button class="deleteImage">删除图片动态</button>
                        <button class="deleteText">删除文字动态</button>
                        <button class="deleteArticle">删除专栏动态</button>
                        <button class="deleteShortVideo">删除小视频动态</button>
                    </div>
                </div>

                <div class="panel-section other-actions">
                    <h3>其他</h3>
                    <div class="button-group">
                        <a href="#" class="tutorial-btn" target="_blank">使用视频教程</a>
                    </div>
                </div>

                <div class="panel-section pin-settings">
                    <h3>动态保留设置</h3>
                    <div class="setting-group">
                        <label class="switch">
                            <input type="checkbox" id="preservePinned">
                            <span class="slider round"></span>
                            <span class="label">保留指定的动态</span>
                        </label>
                        <div class="preserve-contents">
                            <div class="preserve-content-item">
                                <input type="text" class="preserve-content" placeholder="输入要保留的动态文字内容">
                                <small class="tip">输入动态中的部分内容即可,建议复制完整内容以提高匹配准确度</small>
                            </div>
                            <button class="add-preserve-content" title="添加更多保留内容">
                                <span>+</span>
                            </button>
                        </div>

                        <div class="most-liked-setting">
                            <label class="switch">
                                <input type="checkbox" id="preserveMostLiked">
                                <span class="slider round"></span>
                                <span class="label">保留点赞最高的动态</span>
                            </label>
                            <div class="most-liked-count">
                                <input type="number" id="mostLikedCount" value="3" min="1" disabled>
                                <small class="tip">设置要保留的点赞最高动态数量</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        return node;
    }

    function setEventListeners() {
        document.querySelector(".onlyDeleteRepost").addEventListener("click", () => handleConfirmation("onlyDeleteRepost", () => handleDelete(false)));
        document.querySelector(".deleteVideo").addEventListener("click", () => handleConfirmation("deleteVideo", () => handleDeleteByType(DYNAMIC_TYPES.VIDEO)));
        document.querySelector(".deleteImage").addEventListener("click", () => handleConfirmation("deleteImage", () => handleDeleteByType(DYNAMIC_TYPES.IMAGE)));
        document.querySelector(".deleteText").addEventListener("click", () => handleConfirmation("deleteText", () => handleDeleteByType(DYNAMIC_TYPES.TEXT)));
        document.querySelector(".deleteArticle").addEventListener("click", () => handleConfirmation("deleteArticle", () => handleDeleteByType(DYNAMIC_TYPES.ARTICLE)));
        document.querySelector(".deleteShortVideo").addEventListener("click", () => handleConfirmation("deleteShortVideo", () => handleDeleteByType(DYNAMIC_TYPES.SHORT_VIDEO)));

        // 添加新的保留内容输入框
        document.querySelector('.add-preserve-content').addEventListener('click', addPreserveContentInput);

        // 添加点赞设置相关的事件监听
        const preserveMostLikedCheckbox = document.querySelector('#preserveMostLiked');
        const mostLikedCountInput = document.querySelector('#mostLikedCount');

        preserveMostLikedCheckbox.addEventListener('change', (e) => {
            mostLikedCountInput.disabled = !e.target.checked;
        });

        mostLikedCountInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1) e.target.value = 1;
        });
    }

    async function handleDelete(deleteLottery) { // 删除参数 unfollow
        disableAll();
        let deleteCount = 0; // 删除计数
        let hasMore = true; // 是否还有更多动态
        let offset = 0; // 动态偏移量

        while (hasMore) {
            const { data } = await api.spaceHistory(offset);
            hasMore = data.has_more;

            for (const card of data.cards) {
                offset = card.desc.dynamic_id_str;

                if (card.desc.orig_dy_id != 0 || card.desc.type === DYNAMIC_TYPES.REPOST) { // 如果是转发动态
                    try {
                        const content = JSON.parse(card.card);
                        const content2 = JSON.parse(content.origin_extend_json);

                        if (!deleteLottery || content2.lott) { // 如果"仅删除抽奖"为假，或判断为抽奖动态
                            const rm = await api.removeDynamic(card.desc.dynamic_id_str);
                            if (rm.code === 0) deleteCount++;
                            else throw new Error("删除出错");
                        }
                        await api.sleep(50);
                        log(`已删除 ${deleteCount} 条动态`);
                    } catch (e) {
                        console.error(e);
                        break;
                    }
                }
            }
        }
        enableAll();
    }

    function disableAll() {
        console.log('start');
        buttons.forEach(btn => {
            const button = document.querySelector(btn);
            button.disabled = true;
            resetButtonState(btn.substring(1)); // 移除开头的点号
        });
        confirmStates.deleteStates = {}; // 清除所有确认状态
    }

    function enableAll() {
        console.log('done');
        buttons.forEach(btn => {
            const button = document.querySelector(btn);
            if (button) {
                button.disabled = false;
                resetButtonState(btn.substring(1));
            }
        });
        confirmStates.deleteStates = {};
        log('操作已完成！', true);
    }

    let currentPopup = null;
    let currentTimer = null;

    function log(message, autoRefresh = false) {
        // 如果存在之前的弹窗和定时器，先清除
        if (currentPopup) {
            currentPopup.remove();
            clearTimeout(currentTimer);
        }

        // 创建新的弹窗
        const popup = document.createElement('div');
        popup.className = 'log-popup';
        popup.textContent = message;
        document.body.appendChild(popup);
        currentPopup = popup;

        if (autoRefresh) {
            let countdown = 20;
            const updateCountdown = () => {
                popup.textContent = `${message} (${countdown}秒后自动刷新)`;
                countdown--;
                if (countdown < 0) {
                    window.location.reload();
                } else {
                    currentTimer = setTimeout(updateCountdown, 1000);
                }
            };
            updateCountdown();
        } else {
            // 3秒后自动隐藏弹窗
            currentTimer = setTimeout(() => {
                popup.classList.add('hide');
                setTimeout(() => popup.remove(), 300);
            }, 3000);
        }
    }

    async function handleDeleteByType(targetType) {
        const preservePinned = document.querySelector('#preservePinned').checked;
        const preserveMostLiked = document.querySelector('#preserveMostLiked').checked;
        const mostLikedCount = parseInt(document.querySelector('#mostLikedCount').value);
        const preserveContents = Array.from(document.querySelectorAll('.preserve-content'))
            .map(input => input.value.trim())
            .filter(value => value !== '');

        if (preservePinned && preserveContents.length === 0) {
            alert('检测到开启保留动态功能，请至少输入一个要保留的动态内容');
            return;
        }

        try {
            disableAll();
            let deleteCount = 0;
            let hasMore = true;
            let offset = 0;
            let allDynamics = [];

            console.log('开始获取动态，目标类型:', targetType);
            log(`开始获取类型为 ${targetType} 的动态...`);

            // 首先收集所有动态
            let pageCount = 0;
            while (hasMore) {
                pageCount++;
                console.log(`正在获取第 ${pageCount} 页动态，offset:`, offset);
                
                try {
                    const response = await api.spaceHistory(offset);
                    console.log('API响应:', response);
                    
                    if (!response || !response.data) {
                        console.error('API响应格式错误:', response);
                        log('获取动态数据失败，响应格式错误');
                        break;
                    }
                    
                    const { data } = response;
                    hasMore = data.has_more;
                    console.log(`第 ${pageCount} 页: 获取到 ${data.cards?.length || 0} 条动态，还有更多: ${hasMore}`);

                    // 修复：当cards为null时，说明没有更多动态了，但不应该报错
                    if (!data.cards) {
                        console.log('当前页面没有更多动态，cards为null，结束获取');
                        break; // 正常结束，不是错误
                    }

                    if (!Array.isArray(data.cards)) {
                        console.error('动态卡片数据格式错误，cards不是数组:', typeof data.cards);
                        log('动态数据格式错误');
                        break;
                    }

                    console.log(`开始处理 ${data.cards.length} 条动态`);
                    for (const card of data.cards) {
                        console.log(`检查动态 ID: ${card.desc.dynamic_id_str}, 类型: ${card.desc.type}, 目标类型: ${targetType}`);
                        
                        if (card.desc.type === targetType) {
                            try {
                                console.log(`匹配到目标类型动态，开始解析内容...`);
                                const cardContent = JSON.parse(card.card);
                                console.log(`解析后的动态内容:`, cardContent);
                                
                                const content = cardContent?.item?.content || cardContent?.item?.description || '';
                                console.log(`提取的文本内容: ${content.substring(0, 100)}...`);
                                
                                allDynamics.push({
                                    id: card.desc.dynamic_id_str,
                                    likes: card.desc.like,
                                    content: content
                                });
                                
                                console.log(`成功添加动态: ID=${card.desc.dynamic_id_str}, 点赞=${card.desc.like}`);
                            } catch (parseError) {
                                console.error('解析动态内容失败:', parseError, card.card);
                            }
                        }
                        offset = card.desc.dynamic_id_str;
                    }
                    
                    log(`已扫描 ${pageCount} 页，找到 ${allDynamics.length} 条匹配动态`);
                    
                } catch (apiError) {
                    console.error('API请求失败:', apiError);
                    log('获取动态数据失败: ' + apiError.message);
                    break;
                }
            }

            console.log(`动态收集完成，总共找到 ${allDynamics.length} 条类型为 ${targetType} 的动态`);
            log(`找到 ${allDynamics.length} 条类型为 ${targetType} 的动态`);

            // 确保即使只找到少量动态也能正常处理
            if (allDynamics.length === 0) {
                log(`没有找到类型为 ${targetType} 的动态`);
                return;
            }

            // 如果需要保留点赞最高的动态
            let preservedIds = new Set();
            if (preserveMostLiked && mostLikedCount > 0) {
                const topLiked = allDynamics
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, mostLikedCount);
                preservedIds = new Set(topLiked.map(d => d.id));
                console.log('保留点赞最高的动态:', topLiked.map(d => `ID=${d.id}, 点赞=${d.likes}`));
            }

            // 执行删除操作
            for (const dynamic of allDynamics) {
                // 跳过需要保留的动态
                if (preservedIds.has(dynamic.id)) {
                    console.log('保留点赞数最高的动态:', dynamic.id, '点赞数:', dynamic.likes);
                    continue;
                }

                // 检查是否包含需要保留的内容
                if (preservePinned && preserveContents.length > 0) {
                    if (preserveContents.some(content => dynamic.content.includes(content))) {
                        console.log('跳过包含保留内容的动态:', dynamic.content);
                        continue;
                    }
                }

                try {
                    console.log('正在删除动态:', dynamic.id);
                    const rm = await api.removeDynamic(dynamic.id);
                    console.log('删除结果:', rm);
                    if (rm.code === 0) deleteCount++;
                    await api.sleep(50);
                    log(`已删除 ${deleteCount} 条类型为 ${targetType} 的动态`);
                } catch (e) {
                    console.error('删除动态失败:', e);
                    break;
                }
            }
        } catch (error) {
            console.error('删除操作执行出错:', error);
            log('操作执行出错: ' + error.message);
        } finally {
            enableAll();
        }
    }

    // 添加确认处理函数
    function handleConfirmation(buttonId, callback) {
        const button = document.querySelector(`.${buttonId}`);
        if (!button) return;

        const originalText = button.textContent;

        // 如果是首次点击
        if (!confirmStates.deleteStates[buttonId]) {
            // 设置确认状态
            confirmStates.deleteStates[buttonId] = true;

            // 修改按钮文字
            button.textContent = "确认删除？";
            button.style.backgroundColor = "#ff6b6b";

            // 添加闪烁动画
            button.style.animation = "buttonBlink 1s infinite";

            // 5秒后重置状态
            setTimeout(() => {
                resetButtonState(buttonId);
            }, 5000);

            // 显示提示
            log("请再次点击确认删除操作");
        } else {
            try {
                // 第二次点击，执行删除
                resetButtonState(buttonId);
                callback();
            } catch (error) {
                console.error('执行删除操作时出错:', error);
                resetButtonState(buttonId);
                enableAll();
                log('操作执行出错，请重试');
            }
        }
    }

    // 重置按钮状态
    function resetButtonState(buttonId) {
        const button = document.querySelector(`.${buttonId}`);
        if (!button) return;

        // 重置确认状态
        confirmStates.deleteStates[buttonId] = false;

        // 重置按钮状态
        button.disabled = false;
        button.textContent = getOriginalButtonText(buttonId);
        button.style.backgroundColor = "";
        button.style.animation = "";

        // 清除可能存在的定时器
        if (confirmStates.resetTimer) {
            clearTimeout(confirmStates.resetTimer);
            confirmStates.resetTimer = null;
        }
    }

    // 获取按钮原始文字
    function getOriginalButtonText(buttonId) {
        const textMap = {
            'onlyDeleteRepost': '删除转发动态',
            'deleteVideo': '删除视频动态',
            'deleteImage': '删除图片动态',
            'deleteText': '删除文字动态',
            'deleteArticle': '删除专栏动态',
            'deleteShortVideo': '删除小视频动态'
        };
        return textMap[buttonId] || '删除';
    }

    // 添加闪烁动画样式
    function addConfirmationStyles() {
        // 使用 GM_addStyle 替代直接创建 style 标签
        const styles = `
            .msc_panel {
                max-width: 100%;
                margin: 0 0 20px 0;
                padding: 20px;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .panel-section {
                margin-bottom: 24px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }

            .panel-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .panel-section h3 {
                font-size: 16px;
                color: #18191c;
                margin-bottom: 16px;
                font-weight: 500;
            }

            .type-table table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
                font-size: 14px;
            }

            .type-table th, .type-table td {
                padding: 8px;
                text-align: center;
                border: 1px solid #eee;
            }

            .type-table th {
                background: #f6f7f8;
            }

            .input-group {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }

            .type-input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .msc_panel button {
                padding: 8px 16px;
                border-radius: 4px;
                border: 1px solid #ddd;
                background: #fff;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }

            .msc_panel button:hover {
                background: #f6f7f8;
            }

            .msc_panel button.primary-btn {
                background: #00aeec;
                color: #fff;
                border-color: #00aeec;
            }

            .msc_panel button.primary-btn:hover {
                background: #0096cc;
            }

            .msc_panel button.warning-btn {
                background: #fb7299;
                color: #fff;
                border-color: #fb7299;
            }

            .msc_panel button.warning-btn:hover {
                background: #e45c80;
            }

            .msc_panel button:disabled {
                background: #eee;
                color: #999;
                cursor: not-allowed;
                border-color: #ddd;
            }

            .tutorial-btn {
                display: inline-block;
                padding: 8px 16px;
                background: #6c757d;
                color: #fff;
                text-decoration: none;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .tutorial-btn:hover {
                background: #5a6268;
            }

            .log {
                margin-top: 16px;
                padding: 12px;
                background: #f6f7f8;
                border-radius: 4px;
                font-size: 14px;
                color: #666;
            }

            @keyframes buttonBlink {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }

            .msc_panel button.confirming {
                background-color: #ff6b6b !important;
                color: white !important;
            }

            .msc_panel button:disabled {
                animation: none !important;
                opacity: 0.5 !important;
            }

            .pin-settings {
                margin: 15px 0;
            }
            .setting-group {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .switch {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .switch input {
                display: none;
            }
            .slider {
                position: relative;
                width: 40px;
                height: 20px;
                background-color: #ccc;
                border-radius: 20px;
                cursor: pointer;
                transition: .4s;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                border-radius: 50%;
                transition: .4s;
            }
            input:checked + .slider {
                background-color: #2196F3;
            }
            input:checked + .slider:before {
                transform: translateX(20px);
            }
            .pin-content-input {
                margin-top: 5px;
            }
            .pin-content-input input {
                width: 100%;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .tip {
                color: #999;
                font-size: 12px;
                margin-top: 5px;
                display: block;
            }

            /* 弹窗样式 */
            .log-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 999999;
                font-size: 14px;
                max-width: 300px;
                animation: fadeInOut 0.3s ease-in-out;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            }

            @keyframes fadeInOut {
                0% {
                    opacity: 0;
                    transform: translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .log-popup.hide {
                animation: fadeOut 0.3s ease-in-out forwards;
            }

            @keyframes fadeOut {
                0% {
                    opacity: 1;
                    transform: translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }

            .preserve-contents {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 10px;
            }

            .preserve-content-item {
                position: relative;
            }

            .input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .preserve-content {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                width: 100%;
            }

            .add-preserve-content {
                align-self: flex-start;
                padding: 4px 12px;
                background: #87CEEB;
                color: blue;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 30px;
                margin-top: 5px;
            }

            .add-preserve-content:hover {
                background: #6BB6FF;
            }

            .remove-content {
                padding: 4px 8px;
                background: #87CEEB;
                color: blue;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 30px;
            }

            .remove-content:hover {
                background: #6BB6FF;
            }

            .most-liked-setting {
                margin-top: 15px;
            }

            .most-liked-count {
                margin-top: 10px;
                margin-left: 30px;
            }

            .most-liked-count input {
                width: 60px;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }

            .most-liked-count input:disabled {
                background-color: #f5f5f5;
                cursor: not-allowed;
            }
        `;

        // 添加 @grant GM_addStyle 到脚本头部后，使用 GM_addStyle
        GM_addStyle(styles);
    }

    // 添加动态类型验证函数
    function isValidDynamicType(type) {
        const validTypes = Object.values(DYNAMIC_TYPES);
        return validTypes.includes(type);
    }

    // 检查是否存在置顶动态
    async function checkPinnedDynamic() {
        try {
            // 检查新版界面
            const newVersionPin = document.evaluate(
                '//*[@id="app"]/main/div[1]/div[2]/div/div/div/div[1]/div[1]/div/div[1]/div/div',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            // 检查旧版界面
            const oldVersionPin = document.evaluate(
                '//*[@id="page-dynamic"]/div[1]/div/div[1]/div/div/div[1]/div/div',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            return !!(newVersionPin || oldVersionPin);
        } catch (error) {
            console.error('检查置顶动态失败:', error);
            return false;
        }
    }

    // 添加新的保留内容输入框的函数
    function addPreserveContentInput() {
        const container = document.querySelector('.preserve-contents');
        const newItem = document.createElement('div');
        newItem.className = 'preserve-content-item';
        newItem.innerHTML = `
            <div class="input-wrapper">
                <input type="text" class="preserve-content" placeholder="输入要保留的动态文字内容">
                <button class="remove-content" title="删除此条件">×</button>
            </div>
            <small class="tip">输入动态中的部分内容即可,建议复制完整内容以提高匹配准确度</small>
        `;

        // 添加删除按钮的事件监听
        newItem.querySelector('.remove-content').addEventListener('click', () => {
            newItem.remove();
        });

        container.insertBefore(newItem, document.querySelector('.add-preserve-content'));
    }

    init();
})();

