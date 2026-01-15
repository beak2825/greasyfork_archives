// ==UserScript==
// @name         RPC切换 & 路径选择 (LinkSwift适配版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动匹配默认路径，支持手动修改，适配 LinkSwift v1.1.2+ (修复UC网盘)
// @author       jiemo
// @match        *://pan.quark.cn/*
// @match        *://drive.uc.cn/*
// @match        *://cloud.189.cn/*
// @match        *://pan.baidu.com/*
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541319/RPC%E5%88%87%E6%8D%A2%20%20%E8%B7%AF%E5%BE%84%E9%80%89%E6%8B%A9%20%28LinkSwift%E9%80%82%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541319/RPC%E5%88%87%E6%8D%A2%20%20%E8%B7%AF%E5%BE%84%E9%80%89%E6%8B%A9%20%28LinkSwift%E9%80%82%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待 LinkSwift 暴露 base 对象
    const checkBase = setInterval(() => {
        if (unsafeWindow.base && typeof unsafeWindow.base.getValue === 'function') {
            clearInterval(checkBase);
            initHelper();
        }
    }, 500);

    function initHelper() {
        // 1. 定义RPC主机配置
        const rpcConfigs = [
            {
                name: '本地',
                domain: 'http://127.0.0.1',
                port: '6800',
                token: '',
                path: '/jsonrpc',
                defaultPath: '/Users/Administrator/Downloads'
            }
        ];

        // 2. 定义所有可用的路径选项
        const downloadPaths = [
            { name: '', path: '/root/downloads/x25' },
            { name: '', path: '/Users/Administrator/Downloads' }
        ];

        // 创建容器
        // 【调整】改为 inline-flex，防止在 UC 网盘工具栏中换行
        const container = document.createElement('div');
        container.style.display = 'inline-flex';
        container.style.gap = '10px';
        container.style.marginRight = '10px'; // 右侧留点空隙
        container.style.alignItems = 'center';
        container.style.verticalAlign = 'middle'; // 垂直对齐

        // --- 创建 RPC Server 下拉框 ---
        const selectServer = document.createElement('select');
        selectServer.className = 'ant-select-selection ant-select-selection--single';
        selectServer.style.width = '80px';
        selectServer.style.height = '30px';
        selectServer.style.fontSize = '14px';
        selectServer.style.border = '1px solid #d9d9d9';
        selectServer.style.borderRadius = '4px';

        const emptyOptionS = document.createElement('option');
        emptyOptionS.value = '';
        emptyOptionS.text = '选择RPC服务器...';
        selectServer.appendChild(emptyOptionS);

        rpcConfigs.forEach((config, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.text = config.name || config.domain;
            selectServer.appendChild(option);
        });

        // --- 创建 Path 下拉框 ---
        const selectPath = document.createElement('select');
        selectPath.className = 'ant-select-selection ant-select-selection--single';
        selectPath.style.width = '180px';
        selectPath.style.height = '30px';
        selectPath.style.fontSize = '14px';
        selectPath.style.border = '1px solid #d9d9d9';
        selectPath.style.borderRadius = '4px';

        const emptyOptionP = document.createElement('option');
        emptyOptionP.value = '';
        emptyOptionP.text = '选择下载路径...';
        selectPath.appendChild(emptyOptionP);

        downloadPaths.forEach((item) => {
            const option = document.createElement('option');
            option.value = item.path;
            option.text = item.name + ` ${item.path}`;
            selectPath.appendChild(option);
        });

        // --- 核心逻辑：获取当前 LinkSwift 配置 ---
        function getActiveRpcConfig() {
            const list = unsafeWindow.base.getValue('setting_aria2_rpc');
            if (!Array.isArray(list) || list.length === 0) return null;
            let index = list.findIndex(item => item.default);
            if (index === -1) index = 0;
            return { list, index, item: list[index] };
        }

        // --- 核心逻辑：切换服务器 ---
        selectServer.onchange = function() {
            if (this.value === '') return;
            const config = rpcConfigs[this.value];
            const currentData = getActiveRpcConfig();

            if (currentData) {
                currentData.item.domain = config.domain;
                currentData.item.port = config.port;
                currentData.item.token = config.token;
                if (config.path) currentData.item.path = config.path;

                if (config.defaultPath) {
                    currentData.item.dir = config.defaultPath;
                    selectPath.value = config.defaultPath;
                }

                unsafeWindow.base.setValue('setting_aria2_rpc', currentData.list);
                console.log('RPC Config Updated:', currentData.item);
            }
        };

        // --- 核心逻辑：手动修改路径 ---
        selectPath.onchange = function() {
            const path = this.value;
            if (!path) return;
            const currentData = getActiveRpcConfig();
            if (currentData) {
                currentData.item.dir = path;
                unsafeWindow.base.setValue('setting_aria2_rpc', currentData.list);
                console.log('Path Updated:', path);
            }
        };

        container.appendChild(selectServer);
        container.appendChild(selectPath);

        // --- 挂载 UI (已针对 UC 优化) ---
        function mountUI() {
            // 1. 尝试找到 LinkSwift 的主按钮 (.pl-button)
            const linkSwiftBtn = document.querySelector('.pl-button');

            let targetParent = null;
            let insertBeforeNode = null;

            if (linkSwiftBtn) {
                // 策略A: 找到了插件按钮，紧跟其后或之前 (UC通常适合在按钮前面)
                targetParent = linkSwiftBtn.parentNode;
                insertBeforeNode = linkSwiftBtn;
            } else {
                // 策略B: 插件按钮还没出来，先找网盘的容器
                // 【调整】增加了 UC 专用的 .btn-operate .btn-main 选择器
                if (location.hostname.includes('uc.cn')) {
                     targetParent = document.querySelector('.btn-operate .btn-main') || document.querySelector('.btn-operate');
                } else {
                     // 其他网盘通用逻辑
                     targetParent =
                        document.querySelector('.section-main') || // 夸克
                        document.querySelector('.file-operate') || // 189
                        document.querySelector('.list-header-operate') ||
                        document.querySelector('.action-bar');
                }

                if (targetParent) {
                    insertBeforeNode = targetParent.firstChild;
                }
            }

            if (targetParent) {
                // 防止重复插入
                if (!targetParent.contains(container)) {
                    if (insertBeforeNode) {
                        targetParent.insertBefore(container, insertBeforeNode);
                    } else {
                        targetParent.appendChild(container);
                    }
                } else {
                    // 【调整】如果元素已经存在，但位置不对（例如 LinkSwift 按钮刚加载出来），强行移动到 LinkSwift 按钮前面
                    if (linkSwiftBtn && container.nextSibling !== linkSwiftBtn) {
                        targetParent.insertBefore(container, linkSwiftBtn);
                    }
                }

                // 回显当前状态
                syncUIState();
            }
        }

        // 抽取回显逻辑，方便复用
        function syncUIState() {
            const currentData = getActiveRpcConfig();
            if (currentData) {
                const matchedIdx = rpcConfigs.findIndex(c =>
                    c.domain === currentData.item.domain &&
                    c.port == currentData.item.port
                );
                if (matchedIdx !== -1) selectServer.value = matchedIdx;

                if (currentData.item.dir) {
                    selectPath.value = currentData.item.dir;
                    let pathExists = Array.from(selectPath.options).some(o => o.value === currentData.item.dir);
                    if (!pathExists) {
                        const tempOpt = document.createElement('option');
                        tempOpt.value = currentData.item.dir;
                        tempOpt.text = currentData.item.dir;
                        selectPath.appendChild(tempOpt);
                        selectPath.value = currentData.item.dir;
                    }
                }
            }
        }

        // 首次挂载
        mountUI();

        // 监听变化，确保不消失
        const observer = new MutationObserver((mutations) => {
            mountUI();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();