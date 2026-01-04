// ==UserScript==
// @name         SP2netease Custom
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Click a floating button to get the last played song from Last.fm and search it on Netease Music
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      last.fm
// @downloadURL https://update.greasyfork.org/scripts/544518/SP2netease%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/544518/SP2netease%20Custom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储工具函数
    const storage = {
        // 设置存储
        setItem: function(key, value) {
            try {
                // 首先尝试使用油猴存储API（跨域）
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(key, value);
                    console.log('使用GM_setValue保存:', key, value);
                    return;
                }
            } catch (e) {
                console.log('GM_setValue不可用:', e);
            }
            
            try {
                // 然后尝试使用localStorage
                localStorage.setItem(key, value);
                console.log('使用localStorage保存:', key, value);
            } catch (e) {
                // localStorage不可用时使用cookie
                console.log('localStorage不可用，使用cookie保存:', key, value);
                this.setCookie(key, value, 365);
            }
        },
        
        // 获取存储
        getItem: function(key) {
            try {
                // 首先尝试使用油猴存储API（跨域）
                if (typeof GM_getValue !== 'undefined') {
                    const value = GM_getValue(key, null);
                    console.log('从GM_getValue读取:', key, value);
                    return value;
                }
            } catch (e) {
                console.log('GM_getValue不可用:', e);
            }
            
            try {
                // 然后尝试使用localStorage
                const value = localStorage.getItem(key);
                console.log('从localStorage读取:', key, value);
                return value;
            } catch (e) {
                // localStorage不可用时使用cookie
                console.log('localStorage不可用，从cookie读取:', key);
                return this.getCookie(key);
            }
        },
        
        // 设置cookie
        setCookie: function(name, value, days) {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            // 设置cookie为跨域共享
            document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=." + window.location.hostname.split('.').slice(-2).join('.');
        },
        
        // 获取cookie
        getCookie: function(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }
    };
    
    // 创建设置面板
    const createSettingsPanel = () => {
        // 创建面板元素
        const panel = document.createElement('div');
        panel.id = 'netease-settings-panel';
        
        // 添加面板内容
        panel.innerHTML = `
            <div class="netease-settings-header">
                <h3>Last.fm 用户名设置</h3>
                <button id="close-settings">×</button>
            </div>
            <div class="netease-settings-content">
                <label for="lastfm-username">用户名:</label>
                <input type="text" id="lastfm-username" placeholder="请输入Last.fm用户名">
                <button id="save-settings">保存</button>
            </div>
        `;
        
        // 设置输入框的默认值
        const usernameInput = panel.querySelector('#lastfm-username');
        const savedUsername = storage.getItem('lastfmUsername');
        
        // 调试信息
        console.log('从存储中读取到的用户名:', savedUsername);
        
        if (savedUsername !== null && savedUsername !== '') {
            usernameInput.value = savedUsername;
            console.log('设置输入框默认值为:', savedUsername);
        } else {
            console.log('未设置输入框默认值');
        }
        
        // 设置面板为浮动窗口样式
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            padding: 20px;
        `;
        
        // 设置面板头部样式
        const header = panel.querySelector('.netease-settings-header');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        `;
        
        // 设置关闭按钮样式
        const closeButton = panel.querySelector('#close-settings');
        closeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // 设置内容区域样式
        const content = panel.querySelector('.netease-settings-content');
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        
        // 设置标签样式
        const label = panel.querySelector('label');
        label.style.cssText = `
            font-weight: bold;
        `;
        
        // 设置输入框样式
        const input = panel.querySelector('input');
        input.style.cssText = `
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        `;
        
        // 设置保存按钮样式
        const saveButton = panel.querySelector('#save-settings');
        saveButton.style.cssText = `
            padding: 10px;
            background-color: #E20000;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        // 将面板添加到页面
        document.body.appendChild(panel);
        
        // 添加事件监听器
        document.getElementById('close-settings').addEventListener('click', () => {
            panel.remove();
        });
        
        document.getElementById('save-settings').addEventListener('click', () => {
            const username = document.getElementById('lastfm-username').value.trim();
            if (username) {
                try {
                    storage.setItem('lastfmUsername', username);
                    alert('设置已保存');
                    panel.remove();
                } catch (e) {
                    alert('保存失败: ' + e.message);
                    // 保存失败时不移除面板，让用户重新尝试
                }
            } else {
                alert('请输入有效的用户名');
                // 不移除面板，让用户重新输入
            }
        });
        
        // 点击面板外部关闭面板
        panel.addEventListener('click', (e) => {
            if (e.target === panel) {
                panel.remove();
            }
        });
        
        // 阻止事件冒泡到面板外部
        const contentElement = panel.querySelector('.netease-settings-content');
        contentElement.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    };
    
    // 创建浮动按钮
    const createFloatingButton = () => {
        // 创建按钮元素
        const button = document.createElement('div');
        button.id = 'netease-search-button';
        
        // 添加SVG图标
        button.innerHTML = '<svg t="1754156884017" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3730" width="32" height="32"><path d="M512 32c265.12 0 480 214.88 480 480 0 265.088-214.88 480-480 480-265.088 0-480-214.912-480-480C32 246.848 246.912 32 512 32z m82.08 173.568c-51.84 17.152-76.736 65.44-61.856 120.32l5.344 20.192c-11.2 2.432-22.208 5.696-32.928 9.824-50.656 19.52-90.848 62.816-104.896 113.024a153.696 153.696 0 0 0-5.088 55.04 137.92 137.92 0 0 0 57.536 100.576 121.504 121.504 0 0 0 103.264 17.6 120.96 120.96 0 0 0 63.68-42.56c24.736-32.288 32.096-74.752 20.8-119.52-4.16-16.32-9.344-34.368-14.4-51.904l-5.376-18.976c21.44 5.376 41.184 16.032 57.44 31.04 56 52.288 66.784 142.368 25.088 209.536-36.608 59.008-107.936 97.088-181.664 97.088a225.76 225.76 0 0 1-225.536-225.472c0-28.992 5.696-57.696 16.832-84.448a221.664 221.664 0 0 1 41.856-65.6 223.712 223.712 0 0 1 81.408-56.416A31.712 31.712 0 0 0 412.064 256a299.52 299.52 0 0 0-25.696 11.808 289.504 289.504 0 0 0-100 86.432 286.56 286.56 0 0 0-54.304 167.136c0 159.296 129.6 288.896 288.96 288.896 95.2 0 187.648-49.856 235.552-127.072 58.304-93.888 43.232-215.584-35.712-289.344-32.32-30.208-74.368-47.872-118.784-51.776-2.304-8.96-5.888-22.592-8.64-32.832-2.08-7.584-3.104-16.16-0.864-23.808a31.808 31.808 0 0 1 38.4-21.44c4.416 1.184 8.608 3.264 12.256 6.048 3.84 2.88 6.848 6.624 10.368 9.888a31.744 31.744 0 0 0 49.856-37.664l-0.64-1.056a65.312 65.312 0 0 0-14.4-16.448 100.48 100.48 0 0 0-53.376-23.392 96.128 96.128 0 0 0-40.96 4.224z m-40.224 201.92c3.36 12.416 7.04 25.344 10.752 38.176 4.928 17.28 9.888 34.432 13.824 49.92 4.576 18.176 6.624 44.192-9.664 65.472a57.056 57.056 0 0 1-30.24 19.936 58.464 58.464 0 0 1-50.144-8.544 73.92 73.92 0 0 1-30.528-53.952 89.6 89.6 0 0 1 2.944-32.416c8.8-31.36 34.304-58.528 66.624-71.008 8.672-3.36 17.536-5.856 26.432-7.584z" fill="#FFFFFF" p-id="3731"></path></svg>';
        
        // 添加按钮样式
        GM_addStyle(`
            #netease-search-button {
                position: fixed;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background-color: #E20000; /* 红色背景 */
                cursor: pointer;
                z-index: 10000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                transition: opacity 0.3s;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            #netease-search-button:hover {
                opacity: 0.8;
            }
            
            #netease-search-button svg {
                width: 100%;
                height: 100%;
            }
        `);
        
        // 设置按钮初始位置
        // 从存储中读取保存的位置，如果没有则使用默认位置
        const savedPosition = storage.getItem('neteaseButtonPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            button.style.left = position.x + 'px';
            button.style.top = position.y + 'px';
        } else {
            button.style.left = '20px';
            button.style.top = '20px';
        }
        
        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        
        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            button.style.left = (e.clientX - offsetX) + 'px';
            button.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            button.style.cursor = 'pointer';
            
            // 保存按钮位置到存储
            const position = {
                x: button.offsetLeft,
                y: button.offsetTop
            };
            storage.setItem('neteaseButtonPosition', JSON.stringify(position));
        });
        
        // 添加右键点击功能打开设置
        button.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            createSettingsPanel();
        });
    
    // 添加油猴脚本管理页面的设置入口
    if (window.location.href.startsWith('chrome-extension://') || window.location.href.startsWith('moz-extension://')) {
        // 创建设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'SP2netease 设置';
        settingsButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10001;
            padding: 10px;
            background-color: #E20000;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        
        settingsButton.addEventListener('click', (e) => {
            e.preventDefault();
            createSettingsPanel();
        });
        
        document.body.appendChild(settingsButton);
    }
        
        // 添加左键点击功能
        button.addEventListener('click', () => {
            if (!isDragging) {
                // 直接搜索最近播放的歌曲
                searchDirectly();
            }
        });
        
        // 将按钮添加到页面
        document.body.appendChild(button);
    };
    
    // 直接搜索功能 - 在网易云音乐中搜索
    const searchDirectly = () => {
        // 从存储中读取保存的Last.fm用户名
        const lastfmUsername = storage.getItem('lastfmUsername');
        
        // 调试信息
        console.log('读取到的Last.fm用户名:', lastfmUsername);
        
        // 检查用户名是否存在
        if (!lastfmUsername || lastfmUsername.trim() === '') {
            alert('请先设置Last.fm用户名');
            createSettingsPanel();
            return;
        }
        
        // 自动获取Last.fm最近播放的歌曲信息
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.last.fm/zh/user/${lastfmUsername}`,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                
                // 获取最近播放的歌曲信息
                const recentTracks = doc.querySelector('.chartlist tbody tr');
                
                if (!recentTracks) {
                    alert('无法找到最近播放的歌曲信息');
                    return;
                }
                
                const songNameElement = recentTracks.querySelector('.chartlist-name a');
                const artistElement = recentTracks.querySelector('.chartlist-artist a');
                
                if (!songNameElement || !artistElement) {
                    alert('无法获取歌曲信息');
                    return;
                }
                
                const songName = songNameElement.textContent.trim();
                const artist = artistElement.textContent.trim();
                
                // 构建搜索URL
                const searchQuery = encodeURIComponent(`${songName} ${artist}`);
                const searchUrl = `https://music.163.com/#/search/m/?s=${searchQuery}`;
                
                // 在新窗口打开搜索页面
                window.open(searchUrl, '_blank');
            },
            onerror: function(error) {
                alert('获取歌曲信息失败: ' + error.statusText);
            }
        });
    };
    
    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }
})();