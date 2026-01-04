// ==UserScript==
// @name         Bilibili 快速收藏
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在B站视频播放页添加"快速收藏"按钮。完美复刻原生UI风格，不会阻塞视频缩略图加载。新增：右键图片选择收藏夹功能。
// @author       YourName & AliubYiero (Inspired by)
// @match        https://www.bilibili.com/video/*
// @connect      api.bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546656/Bilibili%20%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/546656/Bilibili%20%E5%BF%AB%E9%80%9F%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置区域 ---
    let defaultFavId = GM_getValue('BILI_DEFAULT_FAV_ID', null);
    let userFolders = null; // 缓存用户的收藏夹列表

    // --- 核心功能 ---
    function bvToAv(bvid) {
        const XOR_CODE = 23442827791579n;
        const MASK_CODE = 2251799813685247n;
        const BASE = 58n;
        const data = "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
        const bvidArr = Array.from(bvid);
        [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
        [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
        bvidArr.splice(0, 3);
        const tmp = bvidArr.reduce(((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar))), 0n);
        return Number(tmp & MASK_CODE ^ XOR_CODE);
    }

    function getCsrf() {
        const cookies = document.cookie.split('; ').join('&');
        const params = new URLSearchParams(cookies);
        return params.get('bili_jct');
    }

    function getAid() {
        if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.aid) {
            return window.__INITIAL_STATE__.aid.toString();
        }
        try {
            const path = window.location.pathname;
            const match = path.match(/\/video\/(av\d+|BV1[a-zA-Z0-9]+)/);
            if (match && match[1]) {
                let videoId = match[1];
                if (videoId.startsWith('BV')) {
                    return bvToAv(videoId).toString();
                } else if (videoId.startsWith('av')) {
                    return videoId.substring(2);
                }
            }
        } catch (e) { console.error('快速收藏脚本：从URL解析aid时出错', e); }
        console.error('快速收藏脚本：所有方法都无法获取到 aid。');
        return null;
    }

    /**
     * 获取用户的收藏夹列表
     */
    function fetchUserFolders() {
        return new Promise((resolve, reject) => {
            if (userFolders) {
                resolve(userFolders);
                return;
            }

            // 获取当前用户的mid
            const mid = window.__INITIAL_STATE__?.mid || getCookieValue('DedeUserID');
            if (!mid) {
                reject(new Error('无法获取用户ID'));
                return;
            }

            const url = `https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid=${mid}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Referer': 'https://www.bilibili.com'
                },
                responseType: 'json',
                onload: function (response) {
                    const res = response.response;
                    if (res.code === 0 && res.data && res.data.list) {
                        userFolders = res.data.list;
                        resolve(userFolders);
                    } else {
                        reject(new Error('获取收藏夹列表失败'));
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * 获取Cookie值
     */
    function getCookieValue(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function doCollect(aid, favId, button) {
        const csrf = getCsrf();
        if (!aid || !favId || !csrf || Number(aid) <= 0) {
            console.error('快速收藏失败：参数无效', { aid, favId, csrf });
            alert('快速收藏失败，无法获取有效的视频ID。');
            const buttonText = button.querySelector('.video-toolbar-item-text');
            if (buttonText) buttonText.textContent = '快收';
            button.disabled = false;
            return;
        }
        const url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
        const postData = new URLSearchParams({ 'rid': aid, 'type': '2', 'add_media_ids': favId, 'del_media_ids': '', 'csrf': csrf });
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Referer': 'https://www.bilibili.com' },
            data: postData.toString(),
            responseType: 'json',
            onload: function (response) {
                const res = response.response;
                const buttonText = button.querySelector('.video-toolbar-item-text');
                if (res.code === 0 || res.code === 11015) {
                    console.log(res.code === 0 ? '快速收藏成功！' : '视频已在该收藏夹中。');
                    if (buttonText) buttonText.textContent = '已收';
                    button.classList.add('on'); // 添加高亮样式
                    button.disabled = true;
                } else {
                    console.error('快速收藏失败:', res);
                    alert(`收藏失败：${res.message}`);
                    if (buttonText) buttonText.textContent = '快收';
                    button.disabled = false;
                }
            },
            onerror: function (error) {
                console.error('快速收藏请求错误:', error);
                alert('快速收藏请求发送失败，请检查网络或控制台报错。');
                const buttonText = button.querySelector('.video-toolbar-item-text');
                if (buttonText) buttonText.textContent = '快收';
                button.disabled = false;
            }
        });
    }

    /**
     * 弹出对话框，让用户输入并保存默认收藏夹ID。
     */
    function promptForFavId() {
        const currentId = GM_getValue('BILI_DEFAULT_FAV_ID', '');
        const newId = prompt('请输入你的B站默认收藏夹ID（纯数字）：\n\n如何获取ID？\n1. 进入"我的收藏"。\n2. 点击目标收藏夹。\n3. 地址栏中 fid= 后面的数字就是ID。', currentId);

        if (newId !== null) {
            if (newId && /^\d+$/.test(newId)) {
                GM_setValue('BILI_DEFAULT_FAV_ID', newId);
                defaultFavId = newId;
                alert(`设置成功！默认收藏夹ID已更新为: ${newId}\n请刷新页面以使新按钮生效。`);
                window.location.reload();
            } else if (newId !== currentId) {
                alert('ID格式不正确，请输入纯数字。');
            }
        }
    }

    /**
     * 创建右键菜单
     */
    function createContextMenu() {
        const existingMenu = document.getElementById('fav-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.id = 'fav-context-menu';
        menu.style.cssText = `
            position: fixed;
            background: #fff;
            border: 1px solid #e7e7e7;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 8px 0;
            z-index: 10000;
            min-width: 200px;
            max-height: 300px;
            overflow-y: auto;
            display: none;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        `;

        document.body.appendChild(menu);
        return menu;
    }

    /**
     * 显示收藏夹选择菜单（用于设置默认收藏夹）
     */
    function showFolderMenu(x, y, button) {
        fetchUserFolders().then(folders => {
            const menu = createContextMenu();
            menu.innerHTML = '';

            // 添加标题
            const title = document.createElement('div');
            title.textContent = '选择默认收藏夹';
            title.style.cssText = `
                padding: 8px 16px;
                font-weight: 600;
                color: #222;
                border-bottom: 1px solid #e7e7e7;
                margin-bottom: 4px;
            `;
            menu.appendChild(title);

            // 添加收藏夹选项
            folders.forEach(folder => {
                const item = document.createElement('div');
                const isDefault = defaultFavId == folder.id;
                item.innerHTML = `
                    <span>${folder.title} (${folder.media_count})</span>
                    ${isDefault ? '<span style="color: #00aeec; font-weight: 600; margin-left: 8px;">✓ 当前默认</span>' : ''}
                `;
                item.style.cssText = `
                    padding: 10px 16px;
                    cursor: pointer;
                    color: #333;
                    transition: background-color 0.2s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f6f7f8';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'transparent';
                });

                item.addEventListener('click', () => {
                    // 设置为默认收藏夹
                    GM_setValue('BILI_DEFAULT_FAV_ID', folder.id.toString());
                    defaultFavId = folder.id.toString();

                    // 更新按钮状态
                    const buttonText = button.querySelector('.video-toolbar-item-text');
                    if (buttonText) {
                        buttonText.textContent = '快收';
                    }
                    button.classList.remove('on');
                    button.disabled = false;

                    // 显示成功提示
                    item.innerHTML = `<span>✓ 已设为默认收藏夹</span>`;
                    item.style.color = '#00aeec';
                    item.style.fontWeight = '600';

                    setTimeout(() => {
                        hideContextMenu();
                    }, 1000);
                });

                menu.appendChild(item);
            });

            // 设置菜单位置
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';
            menu.style.display = 'block';

            // 确保菜单不超出屏幕
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                menu.style.left = (window.innerWidth - rect.width - 10) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = (window.innerHeight - rect.height - 10) + 'px';
            }

        }).catch(error => {
            console.error('获取收藏夹列表失败:', error);
            alert('获取收藏夹列表失败，请确保已登录B站账号');
        });
    }

    /**
     * 隐藏右键菜单
     */
    function hideContextMenu() {
        const menu = document.getElementById('fav-context-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    /**
     * 收藏到指定文件夹
     */
    function doCollectToFolder(aid, favId, callback) {
        const csrf = getCsrf();
        if (!aid || !favId || !csrf || Number(aid) <= 0) {
            callback(false, '参数无效');
            return;
        }

        const url = 'https://api.bilibili.com/x/v3/fav/resource/deal';
        const postData = new URLSearchParams({
            'rid': aid,
            'type': '2',
            'add_media_ids': favId,
            'del_media_ids': '',
            'csrf': csrf
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Referer': 'https://www.bilibili.com'
            },
            data: postData.toString(),
            responseType: 'json',
            onload: function (response) {
                const res = response.response;
                if (res.code === 0 || res.code === 11015) {
                    callback(true, res.code === 0 ? '收藏成功' : '视频已在该收藏夹中');
                } else {
                    callback(false, res.message);
                }
            },
            onerror: function (error) {
                callback(false, '网络错误');
            }
        });
    }

    /**
     * 初始化右键菜单功能
     */
    function initContextMenu() {
        // 隐藏菜单的事件
        document.addEventListener('click', hideContextMenu);
        document.addEventListener('scroll', hideContextMenu);
        window.addEventListener('resize', hideContextMenu);
    }

    // --- 新的按钮添加逻辑 ---
    function initializeQuickFavButton() {
        // 完全延迟执行，避免与初始页面加载冲突
        setTimeout(() => {
            // 使用一次性定时器检查并添加按钮
            const checkAndAddInterval = setInterval(() => {
                const toolbarContainer = document.querySelector('.video-toolbar-left');
                const originalFavButtonWrap = document.querySelector('.video-fav')?.closest('.toolbar-left-item-wrap');

                if (toolbarContainer && originalFavButtonWrap && !document.querySelector('#quick-fav-button-wrap')) {
                    try {
                        // 创建快速收藏按钮
                        const quickFavWrap = document.createElement('div');
                        quickFavWrap.id = 'quick-fav-button-wrap';
                        quickFavWrap.className = 'toolbar-left-item-wrap';

                        // 复制样式属性
                        for (const attr of originalFavButtonWrap.attributes) {
                            if (attr.name.startsWith('data-v-')) {
                                quickFavWrap.setAttribute(attr.name, attr.value);
                            }
                        }

                        // 创建按钮本身
                        const quickFavButton = document.createElement('div');
                        quickFavButton.id = 'quick-fav-button';
                        quickFavButton.className = 'video-toolbar-left-item';
                        quickFavButton.title = '左键：一键收藏到默认收藏夹\n右键：选择默认收藏夹';

                        // 复制按钮样式属性
                        const originalButton = originalFavButtonWrap.querySelector('.video-toolbar-left-item');
                        if (originalButton) {
                            for (const attr of originalButton.attributes) {
                                if (attr.name.startsWith('data-v-')) {
                                    quickFavButton.setAttribute(attr.name, attr.value);
                                }
                            }
                        }

                        // 创建图标
                        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        svgIcon.setAttribute('width', '28');
                        svgIcon.setAttribute('height', '28');
                        svgIcon.setAttribute('viewBox', '0 0 28 28');
                        svgIcon.setAttribute('class', 'video-toolbar-item-icon');
                        svgIcon.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M12.636 2.444a1.5 1.5 0 0 1 2.728 0l2.339 4.742a1.5 1.5 0 0 0 1.12.814l5.235.76a1.5 1.5 0 0 1 .83 2.56l-3.787 3.69a1.5 1.5 0 0 0-.433 1.328l.894 5.214a1.5 1.5 0 0 1-2.176 1.58l-4.682-2.46a1.5 1.5 0 0 0-1.402 0l-4.682 2.46a1.5 1.5 0 0 1-2.176-1.58l.894-5.214a1.5 1.5 0 0 0-.433-1.328L3.242 11.32a1.5 1.5 0 0 1 .83-2.56l5.235-.76a1.5 1.5 0 0 0 1.12-.814l2.209-4.742h.001Z M14.5 11.5v-4l-4 6h3v4l4-6h-3Z" fill="currentColor"></path>`;

                        // 创建文字部分
                        const buttonText = document.createElement('span');
                        buttonText.className = 'video-toolbar-item-text';
                        buttonText.textContent = '快收';

                        // 复制文字样式属性
                        const originalText = originalFavButtonWrap.querySelector('.video-toolbar-item-text');
                        if (originalText) {
                            for (const attr of originalText.attributes) {
                                if (attr.name.startsWith('data-v-')) {
                                    buttonText.setAttribute(attr.name, attr.value);
                                }
                            }
                        }

                        // 组装元素
                        quickFavButton.appendChild(svgIcon);
                        quickFavButton.appendChild(buttonText);
                        quickFavWrap.appendChild(quickFavButton);

                        // 添加点击事件
                        quickFavButton.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (quickFavButton.disabled) return;
                            if (!defaultFavId) {
                                promptForFavId();
                                return;
                            }
                            buttonText.textContent = '...';
                            quickFavButton.disabled = true;
                            const aid = getAid();
                            doCollect(aid, defaultFavId, quickFavButton);
                        });

                        // 添加右键事件
                        quickFavButton.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            showFolderMenu(e.clientX, e.clientY, quickFavButton);
                        });

                        // 插入到DOM
                        originalFavButtonWrap.parentNode.insertBefore(quickFavWrap, originalFavButtonWrap.nextSibling);

                        // 成功添加按钮后清除定时器
                        clearInterval(checkAndAddInterval);
                        console.log('快速收藏按钮添加成功');
                    } catch (e) {
                        console.error('添加快速收藏按钮时出错:', e);
                        clearInterval(checkAndAddInterval);
                    }
                }
            }, 1000); // 每秒检查一次

            // 设置最大运行时间，防止无限循环
            setTimeout(() => {
                if (checkAndAddInterval) {
                    clearInterval(checkAndAddInterval);
                    console.log('停止尝试添加快速收藏按钮');
                }
            }, 15000); // 最多运行15秒
        }, 2500); // 页面加载后等待2.5秒再开始尝试添加按钮
    }

    // --- 脚本启动逻辑 ---
    GM_registerMenuCommand('设置默认收藏夹ID', promptForFavId);

    // 初始化右键菜单功能
    function initialize() {
        initializeQuickFavButton();
        initContextMenu();
    }

    // 使用window.onload确保页面完全加载后再执行脚本
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();
