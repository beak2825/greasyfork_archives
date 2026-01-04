// ==UserScript==
// @name         VScode插件市场下载 / VS Code Extension Downloader（美化版）
// @namespace    http://tampermonkey.net/
// @version      2.9.1
// @description  在 vscode 插件市场 页面右下角下载按钮，选择对应版本，下载中 卡顿10-30秒正常情况，稍微等待一下。赋能到第三方IDE市场使用， 例如cursor trae qoder。
// @author       qqlcx5
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544267/VScode%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%E4%B8%8B%E8%BD%BD%20%20VS%20Code%20Extension%20Downloader%EF%BC%88%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544267/VScode%E6%8F%92%E4%BB%B6%E5%B8%82%E5%9C%BA%E4%B8%8B%E8%BD%BD%20%20VS%20Code%20Extension%20Downloader%EF%BC%88%E7%BE%8E%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局样式
    const style = document.createElement('style');
    style.textContent = `
        #vsc-downloader-btn {
            background: #0078d4;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            background-color: #0078d4;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            position: fixed;
            bottom: 60px;   /* 只改这里：从 top 改为 bottom */
            right: 30px;
            z-index: 100;
        }
        #vsc-downloader-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
        }
        #vsc-downloader-btn:disabled {
            background: #a0a0a0;
            cursor: not-allowed;
            transform: none;
        }
        #vsc-downloader-msg {
            position: fixed;
            right: 24px;
            bottom: 80px;
            z-index: 10000;
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 13px;
            color: #fff;
            background: #323130;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transition: opacity 0.3s;
        }
        #vsc-downloader-msg.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 工具：展示提示
    function showMessage(text, type = 'info', duration = 3000) {
        const msg = document.getElementById('vsc-downloader-msg') || (() => {
            const el = document.createElement('div');
            el.id = 'vsc-downloader-msg';
            document.body.appendChild(el);
            return el;
        })();
        msg.textContent = text;
        msg.style.background = type === 'error' ? '#d13438' : '#323130';
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), duration);
    }

    // 主逻辑
    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const itemName = urlParams.get('itemName');
        if (!itemName) return;

        const [publisher, extension] = itemName.split('.');

        const btn = document.createElement('button');
        btn.id = 'vsc-downloader-btn';
        btn.textContent = '下载最新版本';
        document.body.appendChild(btn);

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            try {
                // 滚动到版本历史
                window.location.hash = 'version-history';
                await new Promise(r => setTimeout(r, 1200));

                const versionCell = document.querySelector(
                    '.version-history-table-body .version-history-container-row:first-child .version-history-container-column:first-child'
                );
                if (!versionCell) throw new Error('未找到版本信息');

                const version = versionCell.textContent.trim();
                const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `${itemName}-${version}.vsix`;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                a.remove();

                showMessage('已开始下载');
            } catch (err) {
                showMessage(err.message || '下载失败', 'error');
            } finally {
                btn.disabled = false;
            }
        });
    }

    init();
})();