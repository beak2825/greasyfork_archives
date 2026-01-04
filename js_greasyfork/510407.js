// ==UserScript==
// @name        网页转二维码
// @namespace   http://tampermonkey.net/
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @version     2.0
// @license     MIT
// @author      BergerLee
// @description 优美地展示网页二维码，供手机扫描，并支持一键复制链接，UI 风格仿苹果。
// @downloadURL https://update.greasyfork.org/scripts/510407/%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/510407/%E7%BD%91%E9%A1%B5%E8%BD%AC%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        /* 弹窗容器：浮动在页面中央，使用柔和阴影和圆角 */
        .apple-qr-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 340px; /* 适当的宽度 */
            padding: 24px;
            background: rgba(45, 45, 45, 0.85); /* 半透明深色背景 */
            backdrop-filter: blur(20px); /* 核心：毛玻璃效果 */
            border-radius: 20px; /* 大圆角 */
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.15);
            z-index: 99999;
            opacity: 0; /* 初始隐藏 */
            visibility: hidden;
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #f0f0f0; /* 浅色文字 */
            text-align: center;
        }
        /* 弹窗显示时的状态 */
        .apple-qr-dialog.visible {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, -50%) scale(1);
        }

        /* 弹窗标题 */
        .apple-qr-dialog h3 {
            margin: 0 0 12px 0;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.5px;
            color: #ffffff;
        }

        /* 二维码容器 */
        .apple-qr-container {
            width: 200px;
            height: 200px;
            margin: 0 auto 16px;
            padding: 8px; /* 留白 */
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .apple-qr-container canvas {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 8px; /* 二维码内部圆角 */
        }
        
        /* URL显示与复制部分 */
        .apple-qr-url-box {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 8px 12px;
            margin-bottom: 16px;
            overflow: hidden;
            white-space: nowrap;
        }
        .apple-qr-url {
            flex-grow: 1;
            font-size: 13px;
            color: #d0d0d0;
            overflow: hidden;
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            cursor: pointer;
        }
        .apple-qr-copy-btn {
            background: none;
            border: none;
            color: #b0b0b0;
            cursor: pointer;
            font-size: 14px;
            padding: 0;
            transition: color 0.2s ease;
        }
        .apple-qr-copy-btn:hover {
            color: #ffffff;
        }

        /* 关闭按钮 */
        .apple-qr-close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 28px;
            height: 28px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f0f0f0;
            font-size: 16px;
            line-height: 1;
            transition: background-color 0.2s ease;
        }
        .apple-qr-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* 底部信息 */
        .apple-qr-footer {
            font-size: 11px;
            color: #a0a0a0;
            margin-top: 10px;
        }
        .apple-qr-footer a {
            color: #b0b0b0;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
        }
        .apple-qr-footer a:hover {
            color: #ffffff;
        }
    `);
    const qriousScript = document.createElement('script');
    qriousScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js';
    qriousScript.onload = () => {
        init();
    };
    document.head.appendChild(qriousScript);

    function init() {
        // 注册 Tampermonkey 菜单命令，显示当前系统的快捷键
        GM_registerMenuCommand(`✨ 生成二维码 (Ctrl + M)`, () => showQRDialog(location.href));

        // 注册快捷键监听器
        window.addEventListener('keydown', (event) => {
            // 根据操作系统判断正确的修饰键和字符键
            const modifierKey = event.ctrlKey;
            const targetKey = 'm'; // 统一使用小写，keydown事件不区分大小写

            if (modifierKey && event.key === targetKey) {
                event.preventDefault();
                showQRDialog(location.href);
            }
        });
    }

    /**
     * 显示 Apple 风格的二维码弹窗
     * @param {string} url - 需要生成二维码的 URL
     */
    function showQRDialog(url) {
        // 如果弹窗已存在，则直接返回
        if (document.getElementById('apple-qr-dialog')) {
            return;
        }

        // 创建弹窗容器
        const dialog = document.createElement('div');
        dialog.id = 'apple-qr-dialog';
        dialog.className = 'apple-qr-dialog';

        // 弹窗内容 HTML
        dialog.innerHTML = `
            <button class="apple-qr-close-btn">&times;</button>
            <h3>本页面二维码</h3>
            <div class="apple-qr-container">
                <canvas></canvas>
            </div>
            <div class="apple-qr-url-box">
                <div class="apple-qr-url" title="${url}">${url}</div>
                <button class="apple-qr-copy-btn">📋</button>
            </div>
            <p class="apple-qr-footer">由 <a href="https://greasyfork.org/zh-CN/users/747774-berger-lee-berger" target="_blank">BergerLee</a> 制作</p>
        `;
        document.body.appendChild(dialog);

        // 渲染二维码
        const canvas = dialog.querySelector('canvas');
        new QRious({
            element: canvas,
            value: url,
            size: 200,
            background: 'transparent',
            foreground: '#000000'
        });

        // 添加事件监听
        setupDialogEvents(dialog, url);

        // 延迟添加 visible class，触发 CSS 动画
        setTimeout(() => {
            dialog.classList.add('visible');
        }, 10);
    }

    /**
     * 为弹窗设置事件监听器
     * @param {HTMLElement} dialog - 弹窗 DOM 元素
     * @param {string} url - 待复制的 URL
     */
    function setupDialogEvents(dialog, url) {
        const closeBtn = dialog.querySelector('.apple-qr-close-btn');
        const urlBox = dialog.querySelector('.apple-qr-url-box');
        const copyBtn = dialog.querySelector('.apple-qr-copy-btn');
        const originalCopyBtnText = copyBtn.innerText;

        // 关闭弹窗
        const closeDialog = () => {
            dialog.classList.remove('visible');
            setTimeout(() => {
                if (dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog);
                }
            }, 300); // 等待动画完成再移除元素
        };

        // 关闭按钮
        closeBtn.addEventListener('click', closeDialog);

        // 点击 URL 框也进行复制
        urlBox.addEventListener('click', async () => {
            try {
                GM_setClipboard(url);
                // 提供复制成功的视觉反馈
                copyBtn.innerText = '✅';
                setTimeout(() => {
                    copyBtn.innerText = originalCopyBtnText;
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                copyBtn.innerText = '❌';
                setTimeout(() => {
                    copyBtn.innerText = originalCopyBtnText;
                }, 2000);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.contains(dialog)) {
                closeDialog();
            }
        });
    }

})();
