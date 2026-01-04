// ==UserScript==
// @name         超星云盘文件信息提取器--分享链接
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提取云盘文件信息
// @author       榛铭
// @match        https://pan-yz.cldisk.com/external/m/file/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518560/%E8%B6%85%E6%98%9F%E4%BA%91%E7%9B%98%E6%96%87%E4%BB%B6%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8--%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/518560/%E8%B6%85%E6%98%9F%E4%BA%91%E7%9B%98%E6%96%87%E4%BB%B6%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8--%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 通用样式
    const styles = {
        base: `
            background: rgba(255, 255, 255, 0.98);
            border-radius: 12px;
            transition: all 0.2s ease;
        `,
        button: `
            width: 100%;
            border: none;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        `
    };

    // 检查文件信息是否存在
    const checkExist = setInterval(() => {
        if (window.fileinfo) {
            clearInterval(checkExist);
            createInfoWindow(window.fileinfo);
        }
    }, 200);

    setTimeout(() => clearInterval(checkExist), 60000);

    // 文件大小格式化
    const formatSize = bytes => {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    };

    // 复制到剪贴板
    async function copyToClipboard(text) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        } catch (err) {
            console.error('复制失败:', err);
            return false;
        }
    }

    // 显示提示
    function showTip(tip, isSuccess = true) {
        const copyTip = document.querySelector('#copyTip');
        copyTip.textContent = tip;
        copyTip.style.background = isSuccess ? 'rgba(0, 0, 0, 0.8)' : '#ff4444';
        copyTip.style.opacity = '1';
        copyTip.style.transform = 'translate(-50%, -50%) scale(1)';
        setTimeout(() => {
            copyTip.style.opacity = '0';
            copyTip.style.transform = 'translate(-50%, -50%) scale(0.8)';
        }, 2000);
    }

    // 添加悬停效果
    function addHoverEffect(element, defaultColor, hoverColor) {
        element.addEventListener('mouseover', () => element.style.background = hoverColor);
        element.addEventListener('mouseout', () => element.style.background = defaultColor);
    }

    // 拖拽处理类
    class DragHandler {
        constructor(element, handle) {
            this.element = element;
            this.handle = handle;
            this.isDragging = false;
            this.offset = { x: 0, y: 0 };
            this.init();
        }

        init() {
            this.handle.addEventListener('mousedown', e => this.dragStart(e));
            document.addEventListener('mousemove', e => this.drag(e));
            document.addEventListener('mouseup', () => this.dragEnd());
        }

        dragStart(e) {
            if (e.target === this.handle || e.target.parentNode === this.handle) {
                this.isDragging = true;
                this.initial = {
                    x: e.clientX - this.offset.x,
                    y: e.clientY - this.offset.y
                };
                this.element.style.transition = 'none';
                this.element.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
            }
        }

        drag(e) {
            if (this.isDragging) {
                e.preventDefault();
                this.offset.x = e.clientX - this.initial.x;
                this.offset.y = e.clientY - this.initial.y;
                this.element.style.right = `${-this.offset.x}px`;
                this.element.style.top = `${this.offset.y + 10}px`;
            }
        }

        dragEnd() {
            if (this.isDragging) {
                this.isDragging = false;
                this.element.style.transition = 'all 0.3s ease';
                this.element.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    }

    function createInfoWindow(fileinfo) {
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 15px;
            z-index: 2147483647;
            font-size: 14px;
            max-width: 300px;
            width: calc(100% - 40px);
            border: 1px solid #e0e0e0;
            ${!isMobile ? 'cursor: move;' : ''}
            user-select: none;
            opacity: 0;
            transform: translateY(-20px);
            backdrop-filter: blur(10px);
            ${styles.base}
        `;

        const realDownloadLink = `https://sharewh.chaoxing.com/share/download/${fileinfo.objectId}`;

        infoDiv.innerHTML = `
            <div id="dragHandle" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                ${!isMobile ? 'cursor: move;' : ''}
            ">
                <span style="font-weight: bold; color: #333;">文件信息</span>
                <span id="toggleBtn" style="
                    cursor: pointer;
                    padding: 4px 10px;
                    background: #f5f5f5;
                    border-radius: 6px;
                    font-size: 12px;
                    ${styles.base}
                ">收起</span>
            </div>
            <div id="infoContent">
                <div style="
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    font-size: 13px;
                    line-height: 1.6;
                    border: 1px solid #eee;
                ">
                    <div><strong>文件名：</strong>${fileinfo.name}</div>
                    <div><strong>大小：</strong>${formatSize(fileinfo.filesize)}</div>
                    <div><strong>类型：</strong>${fileinfo.suffix.toUpperCase()}</div>
                </div>
                <button id="copyBtn" style="
                    background: #4CAF50;
                    color: white;
                    ${styles.button}
                ">复制下载链接</button>
            </div>
            <div id="copyTip" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.8);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                opacity: 0;
                transition: all 0.3s ease;
                pointer-events: none;
                z-index: 2147483648;
            ">已复制到剪贴板</div>
        `;

        document.body.appendChild(infoDiv);

        // 显示动画
        setTimeout(() => {
            infoDiv.style.opacity = '1';
            infoDiv.style.transform = 'translateY(0)';
        }, 100);

        const toggleBtn = infoDiv.querySelector('#toggleBtn');
        const copyBtn = infoDiv.querySelector('#copyBtn');
        const infoContent = infoDiv.querySelector('#infoContent');

        // 添加悬停效果
        addHoverEffect(toggleBtn, '#f5f5f5', '#e9ecef');
        addHoverEffect(copyBtn, '#4CAF50', '#45a049');

        // 拖拽功能
        if (!isMobile) {
            new DragHandler(infoDiv, infoDiv.querySelector('#dragHandle'));
        }

        // ��开/收起功能
        let isCollapsed = false;
        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            infoContent.style.opacity = isCollapsed ? '0' : '1';
            infoContent.style.transform = isCollapsed ? 'translateY(-10px)' : 'translateY(0)';
            infoContent.style.display = isCollapsed ? 'none' : 'block';
            toggleBtn.textContent = isCollapsed ? '展开' : '收起';
            if (!isCollapsed) {
                infoContent.style.display = 'block';
                setTimeout(() => {
                    infoContent.style.opacity = '1';
                    infoContent.style.transform = 'translateY(0)';
                }, 10);
            }
        });

        // 复制功能
        copyBtn.addEventListener('click', async () => {
            const success = await copyToClipboard(realDownloadLink);
            showTip(success ? '已复制到剪贴板' : '复制失败', success);
        });
    }
})();