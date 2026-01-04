// ==UserScript==
// @name         Bilibili watching
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  B站学习视频进度管理
// @author       Tanphoon
// @match        *://*.bilibili.com/*
// @require      https://scriptcat.org/lib/513/2.0.1/ElementGetter.js#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521485/Bilibili%20watching.user.js
// @updateURL https://update.greasyfork.org/scripts/521485/Bilibili%20watching.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    // 创建样式
    let css = document.createElement('style');
    document.head.appendChild(css);
    css.innerHTML = `
    .floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: rgb(10, 178, 237);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        outline: none;
        z-index: 1000;
    }
    .floating-addbutton {
        width: 60px;
        height: 30px;
        text-align: center;
        font-size: 13px;
        background-color: #aaa;
        color: white;
        border: none;
        border-radius: 10%;
        cursor: pointer;
    }
    .delete-btn {
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
        margin-top: 8px;
        font-size: 14px;
    }
    .delete-btn:hover {
        background-color: #ff0000;
    }
    .floating-panel {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 400px;
        height: 310px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        display: none;
        padding: 10px;
        box-sizing: border-box;
        z-index: 999;
        overflow-y: auto;
    }
    
    .video-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 6px;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.2s;
    }
    
    .video-item:hover {
        transform: translateY(-2px);
    }
    
    .video-thumbnail {
        width: 100px;
        flex-shrink: 0;
        margin-right: 10px;
    }
    
    .video-thumbnail img {
        width: 100%;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
    }
    
    .video-info {
        flex: 1;
        min-width: 0; /* 防止文字溢出 */
    }
    
    .video-title {
        font-size: 15px;
        line-height: 1.5;
        color: #18191c;
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .video-progress {
        font-size: 12px;
        color: #9499a0;
    }
    
    .delete-btn {
        width: 50px;
        height: 30px;
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        margin-left: 10px;
        flex-shrink: 0;
        transition: background-color 0.2s;
    }
    
    .delete-btn:hover {
        background-color: #ff0000;
    }
    
    .toast-message {
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeInOut 2s ease-in-out;
    }
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }`;
    // 创建一个按钮，点击后可以添加数据
    const addButton = document.createElement('div');
    addButton.className = 'floating-addbutton';
    addButton.innerHTML = '添加';
    // 创建浮动按钮
    const button = document.createElement('button');
    button.className = 'floating-button';
    button.innerHTML = '&#9776;';
    // 创建悬浮面板
    const panel = document.createElement('div');
    panel.className = 'floating-panel';
    panel.id = 'floatingPanel';
    // 将元素添加到文档中
    setTimeout(() => {
        document.querySelector(".video-toolbar-left-main").appendChild(addButton);
    }, 2000);
    // document.body.appendChild(addButton);
    document.body.appendChild(button);
    document.body.appendChild(panel);


    let data = [];
    // 写入到页面
    const writeData = () => {
        panel.innerHTML = `${data.map((item, index) => `
            <div class="video-item">
                <div class="video-thumbnail">
                    <a href="${item.videoUrl}" target="_blank">
                        <img src="${item.pic}" alt="${item.title}" />
                    </a>
                </div>
                <div class="video-info">
                    <a href="${item.videoUrl}" target="_blank">
                        <div class="video-title">${item.title}</div>
                        <div class="video-progress">观看进度: ${item.progress} / ${item.total}</div>
                    </a>
                </div>
                <button class="delete-btn" data-index="${index}">删除</button>
            </div>
        `).join('')}`;

        // 为所有删除按钮添加事件监听器
        panel.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteData(index);
            });
        });
    }

    const loadData = () => {
        if (localStorage.getItem('doingList')) {
            data = JSON.parse(localStorage.getItem('doingList'));
        }
        writeData();
    }
    const saveData = () => {
        localStorage.setItem('doingList', JSON.stringify(data));
        writeData();
    }
    const addData = async () => {
        // 获取链接中?前面的部分
        const url = window.location.href.split('?')[0];
        const bvid = url.split('/').find(item => item.startsWith('BV'));
        const progress = new URLSearchParams(window.location.search).get('p') || 1;
        
        // 显示提示消息的函数
        const showToast = (message) => {
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // 2秒后自动移除提示
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 2000);
        };

        if (data.find(item => item.bvid === bvid)) {
            data.find(item => item.bvid === bvid).progress = progress;
            data.find(item => item.bvid === bvid).videoUrl = window.location.href;
            saveData();
            showToast('进度已更新');
            addButton.style.backgroundColor = 'rgb(10, 178, 237)';
            return;
        }

        try {
            const response = await fetch("https://api.bilibili.com/x/web-interface/view?bvid=" + bvid);
            const json = await response.json();
            const dataItem = {
                bvid: bvid,
                title: json.data.title,
                pic: json.data.pic + "@672w_378h_1c_!web-search-common-cover.webp",
                videoUrl: window.location.href,
                total: json.data.videos,
                progress: progress
            };
            data.push(dataItem);
            saveData();
            showToast('添加成功');
        } catch (error) {
            showToast('添加失败，请重试');
            console.error('Error:', error);
        }
    }
    const deleteData = (index) => {
        data.splice(index, 1);
        saveData();
    }
    // 初始化数据
    loadData();
    // 添加按钮点击事件
    addButton.addEventListener('click', addData);
    // 切换面板显示状态的函数
    function togglePanel() {
        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    }
    // 绑定按钮点击事件
    button.addEventListener('click', togglePanel);
})();