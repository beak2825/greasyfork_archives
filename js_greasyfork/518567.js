// ==UserScript==
// @name         超星个人云盘 Pro
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在超星云盘显示文件详细信息的悬浮窗
// @author       榛铭
// @match        https://pan-yz.chaoxing.com/
// @match        https://i.chaoxing.com/base*
// @match        https://pan-yz.cldisk.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518567/%E8%B6%85%E6%98%9F%E4%B8%AA%E4%BA%BA%E4%BA%91%E7%9B%98%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/518567/%E8%B6%85%E6%98%9F%E4%B8%AA%E4%BA%BA%E4%BA%91%E7%9B%98%20Pro.meta.js
// ==/UserScript==



class FloatingWindow {
    constructor() {
        if (document.getElementById('fileInfoWindow')) {
            document.getElementById('fileInfoWindow').remove();
        }
        this.window = null;
        this.isDragging = false;
        this.isResizing = false;
        this.init();
    }

    init() {
        this.createWindow();
        this.setupEventListeners();
        setInterval(() => {
            const data = window.currentPageRespData || window.yunpanModelNew?.currentPageRespData;
            if (data?.list) this.updateContent(data.list);
        }, 1000);
    }

    createWindow() {
        this.window = document.createElement('div');
        this.window.id = 'fileInfoWindow';
        this.window.style.cssText = `
            position: fixed;
            left: ${(window.innerWidth - 500) / 2}px;
            top: ${(window.innerHeight - 400) / 2}px;
            width: 500px;
            max-height: 80vh;
            background-color: rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(204, 204, 204, 0.3);
            box-shadow: 0 0 10px rgba(0,0,0,0.05);
            z-index: 9999;
            overflow-y: auto;
            border-radius: 5px;
            backdrop-filter: blur(2px)
        `;

        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            padding: 10px;
            background-color: rgba(33, 150, 243, 0.7);
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move
        `;
        titleBar.innerHTML = `
            <h2 style="margin:0">文件详细信息</h2>
            <button class="minimize-btn" style="background:none;border:none;color:white;cursor:pointer;font-size:20px;padding:0 5px;line-height:1">−</button>
        `;

        titleBar.querySelector('.minimize-btn').onclick = e => {
            e.stopPropagation();
            this.toggleMinimize();
        };

        const content = document.createElement('div');
        content.id = 'fileInfoContent';

        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: se-resize;
            background-color: rgba(33, 150, 243, 0.7);
            clip-path: polygon(100% 0, 100% 100%, 0 100%)
        `;

        this.window.append(titleBar, content, resizeHandle);

        const savedPosition = JSON.parse(localStorage.getItem('floatingWindowPosition'));
        const savedSize = JSON.parse(localStorage.getItem('floatingWindowSize'));

        if (savedPosition) {
            const maxX = window.innerWidth - this.window.offsetWidth;
            const maxY = window.innerHeight - this.window.offsetHeight;
            this.window.style.left = `${Math.min(Math.max(0, savedPosition.x), maxX)}px`;
            this.window.style.top = `${Math.min(Math.max(0, savedPosition.y), maxY)}px`;
        }
        if (savedSize) {
            if (savedSize.width) this.window.style.width = savedSize.width;
            if (savedSize.height) this.window.style.height = savedSize.height;
        }

        document.body.appendChild(this.window);
    }

    setupEventListeners() {
        const titleBar = this.window.querySelector('div');
        const resizeHandle = this.window.querySelector('div:last-child');
        let originalSize, originalMouse;

        titleBar.onmousedown = e => {
            if (e.target === titleBar) {
                this.isDragging = true;
                const rect = this.window.getBoundingClientRect();
                this.dragOffset = {x: e.clientX - rect.left, y: e.clientY - rect.top};
                this.window.style.opacity = '0.9';
            }
        };

        resizeHandle.onmousedown = e => {
            this.isResizing = true;
            originalSize = {width: this.window.offsetWidth, height: this.window.offsetHeight};
            originalMouse = {x: e.clientX, y: e.clientY};
            e.stopPropagation();
        };

        document.onmousemove = e => {
            if (this.isDragging) {
                const x = e.clientX - this.dragOffset.x;
                const y = e.clientY - this.dragOffset.y;
                const maxX = window.innerWidth - this.window.offsetWidth;
                const maxY = window.innerHeight - this.window.offsetHeight;

                this.window.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
                this.window.style.top = `${Math.min(Math.max(0, y), maxY)}px`;

                localStorage.setItem('floatingWindowPosition', JSON.stringify({
                    x: parseInt(this.window.style.left),
                    y: parseInt(this.window.style.top)
                }));
            }

            if (this.isResizing) {
                const width = originalSize.width + (e.clientX - originalMouse.x);
                const height = originalSize.height + (e.clientY - originalMouse.y);

                if (width > 300 && width < window.innerWidth * 0.8) {
                    this.window.style.width = `${width}px`;
                }
                if (height > 200 && height < window.innerHeight * 0.8) {
                    this.window.style.height = `${height}px`;
                }

                localStorage.setItem('floatingWindowSize', JSON.stringify({
                    width: this.window.style.width,
                    height: this.window.style.height
                }));
            }
        };

        document.onmouseup = () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.window.style.opacity = '1';
            }
            this.isResizing = false;
        };

        this.window.onclick = () => {
            if (this.window.classList.contains('minimized')) {
                this.toggleMinimize();
            }
        };
    }

    updateContent(files) {
        if (!files?.length) return;

        const content = this.window.querySelector('#fileInfoContent');
        content.innerHTML = '';

        const cardStyle = `
            padding: 15px;
            margin: 10px;
            background: rgba(249, 249, 249, 0.5);
            border-radius: 5px;
            border: 1px solid rgba(238, 238, 238, 0.3);
            backdrop-filter: blur(1px)
        `;

        files.forEach(file => {
            const card = document.createElement('div');
            card.style.cssText = cardStyle;
            card.innerHTML = `
                <h3 style="margin:0 0 10px">${file.name}</h3>
                <div style="margin-bottom:10px">
                    <img src="${file.logo}" style="width:30px;margin-right:10px">
                    <span>文件类型: ${file.suffix.toUpperCase()}</span>
                </div>
                <div style="margin-bottom:10px">
                    <strong>文件大小:</strong> ${file.sizestr}<br>
                    <strong>上传日期:</strong> ${file.timestr}
                </div>
                <div style="text-align:right">
                    ${file.preview ? `<button onclick="window.open('${file.preview}', '_blank')" 
                        style="margin:0 5px;padding:6px 16px;background:none;border:none;color:#2196F3;cursor:pointer">预览</button>` : ''}
                    ${file.objectId ? `<button class="copyBtn" data-id="${file.objectId}"
                        style="margin:0 5px;padding:6px 16px;background:none;border:1px solid #4CAF50;color:#4CAF50;border-radius:4px;cursor:pointer">复制下载链接</button>` : ''}
                </div>
            `;

            const copyBtn = card.querySelector('.copyBtn');
            if (copyBtn) {
                copyBtn.onclick = () => {
                    const url = `https://sharewh.chaoxing.com/share/download/${copyBtn.dataset.id}`;
                    try {
                        const input = document.createElement('textarea');
                        input.value = url;
                        input.style.position = 'fixed';
                        input.style.left = '-9999px';
                        document.body.appendChild(input);
                        input.select();
                        input.setSelectionRange(0, 99999);
                        
                        const success = document.execCommand('copy');
                        document.body.removeChild(input);
                        
                        copyBtn.textContent = success ? '复制成功！' : '复制失败';
                        copyBtn.style.backgroundColor = success ? '#4CAF50' : '#ff5252';
                        copyBtn.style.color = '#fff';
                    } catch {
                        copyBtn.textContent = '复制失败';
                        copyBtn.style.backgroundColor = '#ff5252';
                        copyBtn.style.color = '#fff';
                    }

                    setTimeout(() => {
                        copyBtn.textContent = '复制下载链接';
                        copyBtn.style.backgroundColor = '';
                        copyBtn.style.color = '#4CAF50';
                    }, 2000);
                };
            }

            content.appendChild(card);
        });
    }

    toggleMinimize() {
        if (this.window.classList.contains('minimized')) {
            // 展开
            this.window.classList.remove('minimized');
            this.window.style.cssText = this.window.dataset.originalStyle;
            this.window.innerHTML = this.window.dataset.originalContent;
            
            // 重新绑定最小化按钮事件
            const minimizeBtn = this.window.querySelector('.minimize-btn');
            if (minimizeBtn) {
                minimizeBtn.onclick = e => {
                    e.stopPropagation();
                    this.toggleMinimize();
                };
            }
            
            // 重新绑定其他事件
            this.setupEventListeners();
        } else {
            // 最小化
            this.window.dataset.originalStyle = this.window.style.cssText;
            this.window.dataset.originalContent = this.window.innerHTML;
            
            this.window.classList.add('minimized');
            this.window.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background-color: rgba(33, 150, 243, 0.9);
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
                border: none;
                overflow: hidden;
            `;
            this.window.innerHTML = '🌟';
        }
    }
}

(() => {
    const waitForData = setInterval(() => {
        const data = window.currentPageRespData || window.yunpanModelNew?.currentPageRespData;
        if (data?.list && !document.getElementById('fileInfoWindow')) {
            clearInterval(waitForData);
            new FloatingWindow();
        }
    }, 1000);
})();