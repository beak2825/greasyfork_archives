// ==UserScript==
// @name         Stripchat 黑名单
// @namespace    https://greasyfork.org/fr/users/1468290-payamarre
// @version      1.1
// @license MIT
// @description  增强Stripchat体验：查找主播信息和隐藏不感兴趣的主播
// @author       NoOne
// @match        https://stripchat.com/*
// @match        https://*.stripchat.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         https://stripchat.com/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538598/Stripchat%20%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/538598/Stripchat%20%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================ 公共功能 ================
    const common = {
        getModelName() {
            const path = window.location.pathname.split('/');
            const model = path[1];
            if (model && !['female', 'male', 'trans', 'new', 'tags', 'login', 'signup'].includes(model)) {
                return model;
            }
            return null;
        },

        createButton(id, svg, onClick, className = '') {
            const a = document.createElement('a');
            a.href = '#';
            a.className = className;
            a.innerHTML = svg;
            a.id = id;
            a.addEventListener('click', e => {
                e.preventDefault();
                onClick();
            });
            return a;
        }
    };

    // ================ 查找主播信息功能 ================
    function initFindMore() {
        let buttonsInserted = false;

        function insertButtons() {
            if (buttonsInserted) return true;

            const modelName = common.getModelName();
            if (!modelName) return false;

            const targetWrapper = document.querySelector('.view-cam-buttons-wrapper');
            if (!targetWrapper || !targetWrapper.parentNode) return false;

            ['scfinder-button', 'recume-button', 'dodao-button', 'search-button'].forEach(id => {
                const oldBtn = document.getElementById(id);
                if (oldBtn) oldBtn.remove();
            });

            const scfinderBtn = common.createButton(
                'scfinder-button',
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>`,
                () => window.open(`https://camgirlfinder.net/models/sc/${modelName}`, '_blank'),
                'enhanced-button'
            );

            const recumeBtn = common.createButton(
                'recume-button',
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>`,
                () => window.open(`https://recu.me/performer/${modelName}`, '_blank'),
                'enhanced-button'
            );

            const dodaoBtn = common.createButton(
                'dodao-button',
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>`,
                () => window.open(`https://dodao.xyz/?cat=&s=${modelName}`, '_blank'),
                'enhanced-button'
            );

            const searchBtn = common.createButton(
                'search-button',
                `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>`,
                () => {
                    const urls = [
                        `https://www.google.com/search?q=%22${modelName}%22&num=10&uact=5`,
                        `https://yandex.com/search/?text=%22${modelName}%22`,
                        `https://recu.me/performer/${modelName}`,
                        `https://camgirlfinder.net/models/sc/${modelName}`,
                        `https://btdig.com/search?order=0&q="${modelName}"`,
                        `https://dodao.xyz/?cat=&s=${modelName}`
                    ];
                    urls.forEach((url, index) => {
                        setTimeout(() => window.open(url, '_blank'), index * 200);
                    });
                },
                'enhanced-button'
            );

            const buttonGroup = document.createElement('div');
            buttonGroup.style.display = 'flex';
            buttonGroup.style.gap = '18px';
            buttonGroup.style.alignItems = 'center';
            buttonGroup.appendChild(dodaoBtn);
            buttonGroup.appendChild(scfinderBtn);
            buttonGroup.appendChild(recumeBtn);
            buttonGroup.appendChild(searchBtn);

            targetWrapper.parentNode.insertBefore(buttonGroup, targetWrapper);

            buttonsInserted = true;
            return true;
        }

        const observer = new MutationObserver(() => insertButtons());
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(insertButtons, 1000);
    }

    // ================ 隐藏不感兴趣主播功能 ================
    function initHideModels() {
        // 存储不感兴趣的主播列表
        let blockedModels = GM_getValue('blockedModels', {});

        // 创建管理面板按钮
        function createToggleButton() {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'blocked-models-toggle';
            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>`;
            toggleBtn.title = '管理已隐藏主播';
            toggleBtn.addEventListener('click', toggleBlockedModelsPanel);
            document.body.appendChild(toggleBtn);
        }

        // 创建管理面板
        function createBlockedModelsPanel() {
            const panel = document.createElement('div');
            panel.className = 'blocked-models-panel';
            panel.id = 'blocked-models-panel';

            const header = document.createElement('div');
            header.className = 'blocked-models-header';

            const title = document.createElement('h3');
            title.textContent = '已隐藏的主播';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'unblock-btn';
            closeBtn.textContent = '关闭';
            closeBtn.addEventListener('click', () => {
                document.getElementById('blocked-models-panel').style.display = 'none';
            });

            header.appendChild(title);
            header.appendChild(closeBtn);

            const content = document.createElement('div');
            content.className = 'blocked-models-content';

            panel.appendChild(header);
            panel.appendChild(content);
            document.body.appendChild(panel);

            updateBlockedModelsList();
        }

        // 切换管理面板显示
        function toggleBlockedModelsPanel() {
            const panel = document.getElementById('blocked-models-panel');
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                updateBlockedModelsList();
                panel.style.display = 'block';
            }
        }

        // 更新已隐藏主播列表
        function updateBlockedModelsList() {
            const content = document.querySelector('.blocked-models-content');
            content.innerHTML = '';

            const modelCount = Object.keys(blockedModels).length;

            if (modelCount === 0) {
                const emptyMsg = document.createElement('p');
                emptyMsg.textContent = '您还没有隐藏任何主播';
                emptyMsg.style.color = '#aaa';
                emptyMsg.style.textAlign = 'center';
                content.appendChild(emptyMsg);
                return;
            }

            for (const modelId in blockedModels) {
                const modelItem = document.createElement('div');
                modelItem.className = 'blocked-model-item';

                const modelName = document.createElement('span');
                modelName.className = 'blocked-model-name';
                modelName.textContent = blockedModels[modelId].name;

                const unblockBtn = document.createElement('button');
                unblockBtn.className = 'unblock-btn';
                unblockBtn.textContent = '取消隐藏';
                unblockBtn.dataset.modelId = modelId;
                unblockBtn.addEventListener('click', function() {
                    unblockModel(this.dataset.modelId);
                });

                modelItem.appendChild(modelName);
                modelItem.appendChild(unblockBtn);
                content.appendChild(modelItem);
            }
        }

        // 添加隐藏按钮到主播缩略图
        function addHideButtons() {
            const modelItems = document.querySelectorAll('.model-list-item:not(.processed-for-hiding)');

            modelItems.forEach(item => {
                // 标记为已处理
                item.classList.add('processed-for-hiding');

                // 获取主播ID和名称
                const linkEl = item.querySelector('a[href*="/"]');
                if (!linkEl) return;

                const href = linkEl.getAttribute('href');
                const modelId = href.split('/').pop();

                // 如果已经在屏蔽列表中，隐藏
                if (blockedModels[modelId]) {
                    item.style.display = 'none';
                    return;
                }

                // 创建隐藏按钮
                const hideBtn = document.createElement('button');
                hideBtn.className = 'hide-model-btn';
                hideBtn.innerHTML = '&times;';
                hideBtn.title = '隐藏此主播';
                hideBtn.dataset.modelId = modelId;

                // 获取主播名称
                const nameEl = item.querySelector('.model-name') || item.querySelector('a[href*="/"]');
                const modelName = nameEl ? nameEl.textContent.trim() : modelId;
                hideBtn.dataset.modelName = modelName;

                hideBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    blockModel(this.dataset.modelId, this.dataset.modelName);
                });

                item.style.position = 'relative';
                item.appendChild(hideBtn);
            });
        }

        // 隐藏主播
        function blockModel(modelId, modelName) {
            blockedModels[modelId] = {
                name: modelName,
                blockedAt: new Date().toISOString()
            };

            GM_setValue('blockedModels', blockedModels);

            // 隐藏所有匹配的主播元素
            const modelItems = document.querySelectorAll(`.model-list-item`);
            modelItems.forEach(item => {
                const link = item.querySelector('a[href*="/"]');
                if (link && link.getAttribute('href').endsWith(`/${modelId}`)) {
                    item.style.display = 'none';
                }
            });

            // 如果面板打开，更新列表
            if (document.getElementById('blocked-models-panel').style.display === 'block') {
                updateBlockedModelsList();
            }
        }

        // 取消隐藏主播
        function unblockModel(modelId) {
            delete blockedModels[modelId];
            GM_setValue('blockedModels', blockedModels);

            // 重新显示匹配的主播元素
            const modelItems = document.querySelectorAll(`.model-list-item`);
            modelItems.forEach(item => {
                const link = item.querySelector('a[href*="/"]');
                if (link && link.getAttribute('href').endsWith(`/${modelId}`)) {
                    item.style.display = '';
                }
            });

            updateBlockedModelsList();
        }

        // 初始化隐藏主播功能
        function initHideFeature() {
            createToggleButton();
            createBlockedModelsPanel();

            // 初始隐藏已屏蔽主播
            addHideButtons();

            // 监听DOM变化，为新加载的主播添加隐藏按钮
            const observer = new MutationObserver(mutations => {
                let needToAddButtons = false;

                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        needToAddButtons = true;
                    }
                });

                if (needToAddButtons) {
                    addHideButtons();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        // 初始化隐藏主播功能
        initHideFeature();
    }

    // ================ 样式 ================
    function addStyles() {
        const styles = `
            /* 查找更多信息按钮样式 */
            .enhanced-button {
                display: inline-flex !important;
                justify-content: center;
                align-items: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #feb601;
                background-color: inherit;
                color: inherit;
                transition: background-color 0.2s, color 0.2s, stroke 0.2s;
                cursor: pointer;
            }

            .enhanced-button:hover {
                background-color: #feb601;
                border: 2px solid #feb601;
            }

            .enhanced-button:hover svg {
                stroke: black;
            }

            .enhanced-button svg {
                width: 24px;
                height: 24px;
                stroke: currentColor;
            }

            /* 隐藏主播按钮样式 */
            .hide-model-btn {
                position: absolute;
                top: 35px;
                right: 8px;
                z-index: 100;
                background-color: #f03e3e;
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                font-size: 14px;
                line-height: 1;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .model-list-item:hover .hide-model-btn {
                opacity: 0.8;
            }

            .hide-model-btn:hover {
                opacity: 1 !important;
                background-color: #e03131;
            }

            /* 管理面板样式 */
            .blocked-models-panel {
                position: fixed;
                top: 70px;
                right: 20px;
                width: 300px;
                max-height: 400px;
                background-color: #1a1a1a;
                border: 1px solid #333;
                border-radius: 8px;
                z-index: 10000;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                display: none;
            }

            .blocked-models-header {
                padding: 10px 15px;
                background-color: #2a2a2a;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .blocked-models-header h3 {
                margin: 0;
                color: #feb601;
                font-size: 16px;
            }

            .blocked-models-content {
                padding: 10px 15px;
                max-height: 300px;
                overflow-y: auto;
            }

            .blocked-model-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #333;
            }

            .blocked-model-item:last-child {
                border-bottom: none;
            }

            .blocked-model-name {
                color: #fff;
                font-size: 14px;
            }

            .unblock-btn {
                background-color: #feb601;
                color: #000;
                border: none;
                border-radius: 4px;
                padding: 3px 8px;
                font-size: 12px;
                cursor: pointer;
            }

            .unblock-btn:hover {
                background-color: #ffcc33;
            }

            .blocked-models-toggle {
                position: fixed;
                top: 7px;
                right: 350px;
                background-color: #a2252d;
                color: #fff;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
            }

            .blocked-models-toggle svg {
                stroke: #fff;
            }

            .blocked-models-toggle:hover {
                background-color: #c42a35;
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // ================ 初始化 ================
    function init() {
        // 添加样式
        addStyles();

        // 初始化查找主播信息功能
        initFindMore();

        // 初始化隐藏主播功能
        initHideModels();
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();