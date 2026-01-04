// ==UserScript==
// @name         RedirectFromCertainCC98Board
// @namespace    http://tampermonkey.net/
// @version      2025-02-25
// @description  使用模态框实现的版面拦截器
// @author       Monci
// @match        *://www.cc98.org/*
// @match       *://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527958/RedirectFromCertainCC98Board.user.js
// @updateURL https://update.greasyfork.org/scripts/527958/RedirectFromCertainCC98Board.meta.js
// ==/UserScript==

// 关于创建窗口的方案和脚本头部的参数借鉴了yacu - Yet another CC98 userscript(https://update.greasyfork.org/scripts/438399/yacu%20-%20Yet%20another%20CC98%20userscript.user.js)
// 安装后启用，在cc98论坛内部所有页面右侧顶端生成一个透明蓝色按钮，点击按钮弹出对话框指定需要拦截的版面。打开相应版面的帖子时，将自动重定向到cc98论坛的主页（使用webvpn访问情况下也生效）


(function () {
    'use strict';

    const FIXED_BOARD_LIST = ["感性空间",
                              "心灵之约",
                              "郁闷小屋",
                             ];
    let boardConditions = JSON.parse(GM_getValue('boardConditions', '[]'));
    let isModalOpen = false; // 用于跟踪模态框是否已经打开

    // 添加全局样式（仅修改按钮部分）
    GM_addStyle(`
        .blocker-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 10000;
            min-width: 300px;
        }
        .modal-mask {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        .modal-close {
            cursor: pointer;
            font-size: 24px;
        }
        .board-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .board-item {
            flex: 1 0 30%; /* 每个版面占用30%的宽度，确保每行最多显示3个 */
            margin: 8px 0;
            display: flex;
            align-items: center;
        }
        /* 处理不足三个版面时，最后一个项居中显示 */
        .board-item:nth-child(3n+1) {
            margin-left: 0;
        }
        .board-item:nth-child(3n) {
            margin-right: 0;
        }
        .save-button {
            margin-top: 15px;
            padding: 8px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        /* 新增按钮样式 */
        .floating-btn {
            background: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 8px 16px !important;
            opacity: 0.2 !important;
            transition: opacity 0.3s ease !important;
            cursor: pointer !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        }
        .floating-btn:hover {
            opacity: 1 !important;
        }
            .board-list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 15px;
        }
        .board-item {
            display: flex;
            align-items: center;
            white-space: nowrap;
            gap: 8px;
            margin: 0 !important;
        }
    `);

    // 创建控制按钮（修改后）
    function createControlButton() {
        const btn = document.createElement('button');
        btn.className = 'floating-btn'; // 应用新样式类
        btn.textContent = '拦截设置';

        // 位置设置保持不变
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '10000';

        btn.addEventListener('click', showModal);
        document.body.appendChild(btn);
    }

    // 显示模态框
    function showModal() {
        // 如果模态框已经打开，直接返回
        if (isModalOpen) return;

        isModalOpen = true; // 标记模态框为已打开

        const mask = document.createElement('div');
        mask.className = 'modal-mask';

        const modal = document.createElement('div');
        modal.className = 'blocker-modal';

        // 弹窗内容
        modal.innerHTML = `
            <div class="modal-header">
                <h3>选择要拦截的版面</h3>
                <div class="modal-close">×</div>
            </div>
            <div class="board-list">
                ${FIXED_BOARD_LIST.map(name => `
                    <label class="board-item">
                        <input type="checkbox" ${boardConditions.includes(name) ? 'checked' : ''}>
                        ${name}
                    </label>
                `).join('')}
            </div>
            <button class="save-button">保存设置</button>
        `;

        // 关闭事件
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            mask.remove();
            isModalOpen = false; // 标记模态框已关闭
        });
        mask.addEventListener('click', (e) => {
            if (e.target === mask) {
                mask.remove();
                isModalOpen = false; // 标记模态框已关闭
            }
        });

        // 保存事件
        const saveBtn = modal.querySelector('.save-button');
        saveBtn.addEventListener('click', () => {
            const checked = Array.from(modal.querySelectorAll('input:checked'))
                .map(input => input.parentNode.textContent.trim());

            boardConditions = checked;
            GM_setValue('boardConditions', JSON.stringify(checked));
            mask.remove();
            isModalOpen = false; // 标记模态框已关闭
            checkRedirect(); // 立即应用新规则
        });

        mask.appendChild(modal);
        document.body.appendChild(mask);
    }

    // 确认是否是通过webvpn访问
    function getRedirectURL() {
        // 判断当前是否在VPN域名下
        const isVPN = window.location.hostname.includes('webvpn.zju.edu.cn');
        return isVPN
           ? 'http://www-cc98-org-s.webvpn.zju.edu.cn:8001/'
           : 'https://www.cc98.org/';
   }

    // 检查是否需要重定向
    function checkRedirect() {
        const currentBoard = document.querySelector("#root > div > div.center > div:nth-child(1) > div > div.row > a:nth-child(5)"); // 根据实际页面结构调整选择器
        if (currentBoard && boardConditions.includes(currentBoard.textContent.trim())) {
            // window.location.href = 'https://www.cc98.org/';
            window.location.href = getRedirectURL();
        }
    }

    // 初始化
    function init() {
        createControlButton();
        checkRedirect();
        // 添加DOM变化监听（根据实际需要）
        new MutationObserver(checkRedirect).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
