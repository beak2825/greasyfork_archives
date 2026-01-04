// ==UserScript==
// @name         B站弹幕屏蔽词导入器
// @namespace    https://github.com/xingguang2333/BiliBlocklistImporter/
// @version      1.0.1
// @description  一个可以快速导入Bilibili弹幕屏蔽词的油猴脚本，网页端导入并同步至移动端
// @author       StarsOcean
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_download
// @connect      *
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/526584/B%E7%AB%99%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E8%AF%8D%E5%AF%BC%E5%85%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526584/B%E7%AB%99%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E8%AF%8D%E5%AF%BC%E5%85%A5%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        CHECK_INTERVAL: 300,      // 操作间隔时间(ms)
        MAX_WAIT_TIME: 5000,     // 元素等待最大时间(ms)
        RETRY_TIMES: 3,           // 失败重试次数
        FIRST_USE_KEY: 'BHELPER_PRO_FIRST_USE' // 本地存储键名
    };

    // 元素选择器
    const SELECTORS = {
        DROPDOWN_WRAP: '.bui-dropdown-wrap',              // 设置面板容器
        CURRENT_SETTING: '.bui-dropdown-name',           // 当前设置显示
        MENU_ITEM: '.bui-dropdown-item',                  // 菜单项
        BLOCK_INPUT: '.bpx-player-block-add-input',       // 规则输入框
        ADD_BUTTON: '.bui-area.bui-button-gray',          // 添加按钮
        SETTING_BUTTON: '.video-settings-button'           // 设置按钮
    };

    // 样式注入
    GM_addStyle(`
    .bili-helper-pro {
        position: fixed;
        right: 25px;
        bottom: 25px;
        z-index: 2147483647;
    }
    .main-btn-pro {
        width: 56px;
        height: 56px;
        background: #00a1d6;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .main-btn-pro:hover {
        transform: scale(1.15) rotate(15deg);
        background: #0091c8;
    }
    .menu-pro {
        position: absolute;
        right: 0;
        bottom: 70px;
        width: 200px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }
    .menu-pro.show {
        opacity: 1;
        transform: translateY(0);
    }
    .menu-item-pro {
        padding: 14px 20px;
        font-size: 14px;
        color: #1a1a1a;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
    }
    .menu-item-pro:hover {
        background: #f5f5f7;
        padding-left: 25px;
    }
    .input-modal-pro {
        /* 保持原有输入框样式 */
    }
    .input-modal-pro {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 2147483647;
        min-width: 300px;
    }
    .url-input {
        width: 100%;
        padding: 8px;
        margin: 10px 0;
        border: 1px solid #ddd;
    }
    .btn-group {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    .confirm-btn, .cancel-btn {
        flex:1;
        padding: 8px;
        background: #00a1d6;
        color: white;
        border: none;
        border-radius: 4px;
    }
    .cancel-btn {
        background: #f0f0f0;
        color: #333;
    }
    .close-btn {
        margin-top: 15px;
        padding: 8px 16px;
        background: #00a1d6;
        color: white;
        border-radius: 4px;
    }
    .about-modal-pro {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    z-index: 2147483647;
    min-width: 400px;
    max-width: 500px;
    font-family: Arial, sans-serif;
    cursor: move;
    }
    .about-modal-pro h3 {
        margin: 0 0 15px;
        font-size: 20px;
        color: #00a1d6;
    }

    .about-modal-pro p {
        margin: 10px 0;
        font-size: 14px;
        color: #333;
    }

    .about-modal-pro ul {
        margin: 10px 0;
        padding-left: 20px;
    }

    .about-modal-pro ul li {
        margin: 5px 0;
        font-size: 14px;
        color: #555;
    }

    .about-modal-pro a {
        color: #00a1d6;
        text-decoration: none;
    }

    .about-modal-pro a:hover {
        text-decoration: underline;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #f0f0f0;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #333;
    }

    .close-btn:hover {
        background: #e0e0e0;
    }
    .guide-modal-pro {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        z-index: 2147483647;
        min-width: 500px;
        max-width: 600px;
        font-family: Arial, sans-serif;
        cursor: move;
    }
    .guide-modal-pro h2 {
        color: #00a1d6;
        margin: 0 0 15px;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 10px;
    }
    .guide-content {
        max-height: 60vh;
        overflow-y: auto;
        padding-right: 10px;
    }
    .dont-show-again {
        display: flex;
        align-items: center;
        margin: 15px 0;
        font-size: 14px;
    }
    .dont-show-again input {
        margin-right: 8px;
    }
    .progress-container {
        position: fixed;
        left: 20px;
        bottom: 20px;
        width: 300px;
        background: rgba(255,255,255,0.9);
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2147483646;
        display: none;
    }
    .progress-bar {
        height: 12px;
        background: #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        margin: 8px 0;
    }
    .progress-fill {
        height: 100%;
        background: #00a1d6;
        width: 0%;
        transition: width 0.3s ease;
    }
    .progress-text {
        font-size: 12px;
        color: #666;
        text-align: center;
    }
    `);

    // 主界面
    const createUI = () => {
        const container = document.createElement('div');
        container.className = 'bili-helper-pro';

        const mainBtn = document.createElement('div');
        mainBtn.className = 'main-btn-pro';
        mainBtn.innerHTML = '🛡️';

        const menu = document.createElement('div');
        menu.className = 'menu-pro';

        // 菜单项
        const menuItems = [
            { name: '使用必看', icon: '📘', action: showGuide },
            { name: 'TXT导入', icon: '📁', action: handleLocalImport },
            { name: '在线导入', icon: '🌐', action: handleWebImport },
            {
                name: '屏蔽词库',
                icon: '📚',
                action: () => {
                    // 在新标签页打开规则仓库
                    window.open(
                        'https://github.com/xingguang2333/BiliBlocklistImporter/tree/main/Blocklist',
                        '_blank',
                        'noopener,noreferrer'
                    );
                    // 可选：添加点击统计
                    console.log('[统计] 屏蔽词库菜单点击');
                }
            },
            { name: '关于', icon: 'ℹ️', action: showAbout }
        ];

        menuItems.forEach(item => {
            const btn = document.createElement('div');
            btn.className = 'menu-item-pro';
            btn.innerHTML = `${item.icon} ${item.name}`;
            btn.addEventListener('click', item.action);
            menu.appendChild(btn);
        });

        // 事件绑定
        mainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });

        container.appendChild(menu);
        container.appendChild(mainBtn);
        document.body.appendChild(container);

        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">准备就绪</div>
        `;
        document.body.appendChild(progressContainer);
    };

    // 本地导入处理
    const handleLocalImport = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            try {
                const text = await file.text();
                await processRules(text);
                showToast('本地导入成功!', 'success');
            } catch (err) {
                showToast(`导入失败: ${err}`, 'error');
            }
        };
        input.click();
    };

    // 在线导入处理
    const handleWebImport = () => {
        const modal = document.createElement('div');
        modal.className = 'input-modal-pro';
        modal.innerHTML = `
            <h3>在线导入</h3>
            <input type="url" placeholder="输入TXT文件URL" class="url-input">
            <div class="btn-group">
                <button class="confirm-btn">确定</button>
                <button class="cancel-btn">取消</button>
            </div>
        `;

        modal.querySelector('.confirm-btn').onclick = async () => {
            const url = modal.querySelector('.url-input').value;
            if (!url) return;

            try {
                const text = await fetchWithRetry(url, CONFIG.RETRY_TIMES);
                await processRules(text);
                showToast('在线导入成功!', 'success');
            } catch (err) {
                showToast(`导入失败: ${err}`, 'error');
            }
            modal.remove();
        };

        modal.querySelector('.cancel-btn').onclick = () => modal.remove();
        document.body.appendChild(modal);
    };

    const processRules = async (text) => {
        const progressContainer = document.querySelector('.progress-container');
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        try {
            // 显示进度条
            progressContainer.style.display = 'block';
            progressFill.style.width = '0%';
            progressText.textContent = '初始化中...';

            // 展开屏蔽设置
            if (!await checkCurrentSetting()) {
                await expandSettingsPanel();
                await selectBlockSetting();
            }

            // 执行规则导入
            const rules = text.split('\n').filter(l => l.trim());
            let successCount = 0;
            const total = rules.length;

            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                try {
                    await waitForElement(SELECTORS.BLOCK_INPUT, CONFIG.MAX_WAIT_TIME);
                    const input = document.querySelector(SELECTORS.BLOCK_INPUT);
                    const addBtn = document.querySelector(SELECTORS.ADD_BUTTON);

                    if (!input || !addBtn) throw new Error('页面元素未找到');

                    input.value = rule.trim();
                    addBtn.click();
                    successCount++;

                    // 更新进度
                    const progress = ((i + 1) / total * 100).toFixed(1);
                    progressFill.style.width = `${progress}%`;
                    progressText.textContent = `处理中 ${i + 1}/${total} (${progress}%)`;

                    await wait(CONFIG.CHECK_INTERVAL);
                } catch (err) {
                    console.error(`规则 "${rule}" 导入失败:`, err);
                }
            }

            // 完成时更新状态
            progressFill.style.width = '100%';
            progressText.textContent = `完成！成功导入 ${successCount}/${total} 条规则`;

            // 3秒后隐藏进度条
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 3000);

        } catch (error) {
            // 错误处理
            progressContainer.style.display = 'none';
            showToast(`导入中断: ${error.message}`, 'error');
            throw error;
        }
    };

    // 辅助函数
    const checkCurrentSetting = async () => {
        const current = document.querySelector(SELECTORS.CURRENT_SETTING);
        return current?.textContent.includes('屏蔽设定');
    };

    const expandSettingsPanel = async () => {
        const dropdown = document.querySelector(SELECTORS.DROPDOWN_WRAP);
        if (dropdown) {
            dropdown.classList.add('bui-dropdown-unfold');
            await wait(800);
        }
    };

    const selectBlockSetting = async () => {
        const items = await waitForElements(SELECTORS.MENU_ITEM);
        const target = Array.from(items).find(el =>
            el.textContent.match(/屏蔽设定|block setting/i)
        );

        if (target) {
            target.click();
            await wait(1000);
        }
    };

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (Date.now() - start > timeout) {
                    reject(new Error(`Element ${selector} not found`));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    };

    const waitForElements = (selector) => waitForElement(selector).then(() =>
        document.querySelectorAll(selector)
    );

    const fetchWithRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
                        onload: (res) => res.status === 200 ?
                            resolve(res.responseText) :
                            reject(new Error(`HTTP ${res.status}`)),
                        onerror: reject
                    });
                });
            } catch (err) {
                if (i === retries - 1) throw err;
                await wait(1000 * (i + 1));
            }
        }
    };

    const showToast = (message, type = 'info') => {
        const colors = {
            info: '#2196F3',
            success: '#4CAF50',
            error: '#F44336'
        };
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.bottom = '150px';
        toast.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 30px;
            background: ${colors[type]};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    const showGuide = (isFirstTime = false) => {
        // 添加首页元素存在性检测
        if (!document.querySelector(SELECTORS.SETTING_BUTTON) && window.location.pathname === '/') {
            console.log('检测到当前为首页，跳过播放器元素检测');
        }
        const modal = document.createElement('div');
        modal.className = 'guide-modal-pro';
        modal.innerHTML = `
            <h2>📖 使用必读指南</h2>
            <div class="guide-content">
                <p><strong>重要提示：</strong>使用本插件前请仔细阅读以下内容</p>
                <ul>
                    <li>🔒 本插件仅用于学习交流，请勿用于商业用途</li>
                    <li>⚙️ 导入规则前请确保格式为每行一个关键词</li>
                    <li>🔄 更新插件后建议清除旧规则重新导入</li>
                    <li>⚠️ 必须在视频页面导入才有效果</li>
                </ul>
                <p><strong>你可以用下面方式获得规则：</strong></p>
                <ol>
                    <li><a href="https://github.com/xingguang2333/BiliBlocklistImporter/tree/main/Blocklist" target="_blank">屏蔽词库</a></li>
                    <li></li>
                    <li>热心b友分享，并把他们保存在一个txt文件，一行一个屏蔽词</li>
                </ol>
            </div>
            ${isFirstTime ? `
            <div class="dont-show-again">
                <input type="checkbox" id="dontShow">
                <label for="dontShow">不再显示此提示</label>
            </div>
            ` : ''}
            <button class="bui-button bui-button-blue" style="width:100%">
                ${isFirstTime ? '我已知晓，开始使用' : '关闭'}
            </button>
            <button class="close-btn">×</button>
        `;

        // 关闭功能
        const closeModal = () => {
            if (isFirstTime) {
                const dontShow = modal.querySelector('#dontShow').checked;
                if (dontShow) {
                    localStorage.setItem(CONFIG.FIRST_USE_KEY, '1');
                }
            }
            modal.remove();
        };

        modal.querySelector('button.bui-button').onclick = closeModal;
        modal.querySelector('.close-btn').onclick = closeModal;

        // 拖动功能（复用about窗口的拖动逻辑）
        let isDragging = false;
        let offsetX, offsetY;
        modal.addEventListener('mousedown', (e) => {
            if (!e.target.closest('button, input, a')) {
                isDragging = true;
                offsetX = e.clientX - modal.offsetLeft;
                offsetY = e.clientY - modal.offsetTop;
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => isDragging = false);

        document.body.appendChild(modal);
    };

    // 新增：首次访问检测
    const checkFirstUse = () => {
        if (!localStorage.getItem(CONFIG.FIRST_USE_KEY)) {
            showGuide(true);
        }
    };

    const showAbout = () => {
        const modal = document.createElement('div');
        modal.className = 'about-modal-pro';
        modal.innerHTML = `
            <h3>B站弹幕屏蔽词导入 v1.0</h3>
            <p>一个可以快速导入Bilibili弹幕屏蔽词的油猴脚本，网页端导入并同步至移动端。A Tampermonkey script that can quickly import Bilibili subtitle blocking words, import on the web page and synchronize to the mobile terminal.</p>
            <p>相关链接：</p>
            <ul>
                <li><a href="https://moestars.top" target="_blank">个人网站</a></li>
                <li><a href="https://github.com/xingguang2333/BiliBlocklistImporter/" target="_blank">GitHub</a></li>
                <li><a href="https://greasyfork.org/zh-CN/scripts/your-script" target="_blank">GreasyFork</a></li>
                <li><a href="https://github.com/xingguang2333/BiliBlocklistImporter/tree/main/Blocklist" target="_blank">屏蔽词库</a></li>
            </ul>
            <button class="close-btn">×</button>
        `;

        // 关闭按钮
        modal.querySelector('.close-btn').onclick = () => modal.remove();

        // 拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        modal.addEventListener('mousedown', (e) => {
            if (e.target.tagName.toLowerCase() !== 'a') { // 避免拖动时误点击链接
                isDragging = true;
                offsetX = e.clientX - modal.offsetLeft;
                offsetY = e.clientY - modal.offsetTop;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.body.appendChild(modal);
    };

    // 初始化
    (function init() {
        const checkDOMLoaded = () => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                createUI();
                checkFirstUse();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    createUI();
                    checkFirstUse();
                });
            }
        };

        // 无论当前页面类型都执行初始化
        checkDOMLoaded();
    })();

})();