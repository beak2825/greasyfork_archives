// ==UserScript==
// @name         磁力链接magnet收集器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  收集页面上的所有磁力链接并去重显示
// @author       Thomas Hayes
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522183/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5magnet%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/522183/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5magnet%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮文本框
    function createFloatingBox() {
        const box = document.createElement('div');
        const style = {
            position: 'fixed',
            right: '20px',
            top: '20px',
            zIndex: '9999',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        };
        Object.assign(box.style, style);

        // 创建拖拽把手
        const dragHandle = document.createElement('div');
        dragHandle.style.cssText = `
            padding: 5px;
            margin: -10px -10px 10px -10px;
            background-color: #808080;
            color: white;
            border-bottom: 1px solid #222;
            cursor: move;
            user-select: none;
            border-radius: 5px 5px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;

        // 添加拖拽功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        dragHandle.addEventListener('mousedown', function(e) {
            isDragging = true;
            initialX = e.clientX - box.offsetLeft;
            initialY = e.clientY - box.offsetTop;
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // 确保不会拖出屏幕
            const maxX = window.innerWidth - box.offsetWidth;
            const maxY = window.innerHeight - box.offsetHeight;

            currentX = Math.min(Math.max(0, currentX), maxX);
            currentY = Math.min(Math.max(0, currentY), maxY);

            box.style.left = currentX + 'px';
            box.style.top = currentY + 'px';
            box.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // 把手左侧文字
        const handleText = document.createElement('span');
        handleText.textContent = '磁力链接';
        dragHandle.appendChild(handleText);

        const textarea = document.createElement('textarea');
        textarea.style.width = '40em';
        textarea.style.height = '10em';
        textarea.style.margin = '10px 0';
        textarea.readOnly = true;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.onclick = () => {
            textarea.select();
            navigator.clipboard.writeText(textarea.value)
                .then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '已复制！';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                    }, 1000);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
        };

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.onclick = () => {
            box.remove();
            // 重新显示提示按钮
            const hintBtn = createHintButton();
            document.body.appendChild(hintBtn);
        };

        buttonContainer.appendChild(copyBtn);
        buttonContainer.appendChild(closeBtn);

        box.appendChild(dragHandle);
        box.appendChild(textarea);
        box.appendChild(buttonContainer);

        // 修改 ESC 键关闭功能
        const escKeyHandler = function(e) {
            if (e.key === 'Escape') {
                box.remove();
                // 移除事件监听器，避免内存泄漏
                document.removeEventListener('keydown', escKeyHandler);
                // 重新显示提示按钮
                const hintBtn = createHintButton();
                document.body.appendChild(hintBtn);
            }
        };
        document.addEventListener('keydown', escKeyHandler);

        // 当框被关闭时也要移除事件监听器
        const originalCloseHandler = closeBtn.onclick;
        closeBtn.onclick = () => {
            originalCloseHandler();
            document.removeEventListener('keydown', escKeyHandler);
        };

        return { box, textarea };
    }

    // 获取并去重磁力链接
    function getMagnetLinks() {
        const links = document.querySelectorAll('a');
        const magnetLinks = new Set();

        links.forEach(link => {
            var href = link.href;
            if (href && href.startsWith('magnet:')) {

                href = href.replace(/&dn.*$/, '');

                if (!magnetLinks.has(href)) {
                    magnetLinks.add(href);
                }
            }
        });

        return Array.from(magnetLinks);
    }

    // 创建提示按钮
    function createHintButton() {
        const hintBtn = document.createElement('div');
        const style = {
            position: 'fixed',
            right: '20px',
            top: '20px',
            width: '30px',
            height: '30px',
            backgroundColor: '#808080',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '9998',
            userSelect: 'none'
        };
        Object.assign(hintBtn.style, style);

        hintBtn.textContent = 'M';

        // 添加悬停效果
        hintBtn.addEventListener('mouseover', () => {
            hintBtn.style.backgroundColor = '#666';
        });
        hintBtn.addEventListener('mouseout', () => {
            hintBtn.style.backgroundColor = '#808080';
        });

        // 点击时显示磁力链接框
        hintBtn.addEventListener('click', () => {
            hintBtn.remove();
            showMagnetBox();
        });

        return hintBtn;
    }

    // 显示磁力链接框
    function showMagnetBox() {
        const { box, textarea } = createFloatingBox();
        const magnetLinks = getMagnetLinks();
        textarea.value = magnetLinks.join('\n');
        document.body.appendChild(box);
    }

    // 主函数
    function main() {
        const magnetLinks = getMagnetLinks();
        if (magnetLinks.length > 0) {
            // 创建并显示提示按钮
            const hintBtn = createHintButton();
            document.body.appendChild(hintBtn);
        }
    }

    // 页面加载完成后自动检查
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

    // 快捷键，显示磁力链接框
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'g') {
            showMagnetBox();
        }
    });
})(); 