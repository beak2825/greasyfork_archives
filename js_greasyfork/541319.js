// ==UserScript==
// @name         RPC切换 & 路径选择 (自动匹配版)
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  自动匹配默认路径，支持手动修改
// @author       jiemo
// @match        *://pan.quark.cn/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541319/RPC%E5%88%87%E6%8D%A2%20%20%E8%B7%AF%E5%BE%84%E9%80%89%E6%8B%A9%20%28%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541319/RPC%E5%88%87%E6%8D%A2%20%20%E8%B7%AF%E5%BE%84%E9%80%89%E6%8B%A9%20%28%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 定义RPC主机配置 (设置 defaultPath)
    const rpcConfigs = [
  
        {
            name: '127.0.0.1',
            address: 'http://127.0.0.1',
            port: 6800,
            token: '123',
            // 本地默认路径
            defaultPath: '/Users/Administrator/Downloads'
        },
    ];

    // 2. 定义所有可用的路径选项 (供手动修改)
    const downloadPaths = [
        { name: 'Win', path: '/Users/Administrator/Downloads' },


    ];

    // 创建容器
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '10px';
    container.style.marginBottom = '10px';

    // --- 创建 RPC Server 下拉框 ---
    const selectServer = document.createElement('select');
    selectServer.className = 'ant-select-selection ant-select-selection--single';
    selectServer.style.width = '180px';
    selectServer.style.fontSize = '14px';

    const emptyOptionS = document.createElement('option');
    emptyOptionS.value = '';
    emptyOptionS.text = '选择服务器...';
    selectServer.appendChild(emptyOptionS);

    rpcConfigs.forEach((config) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(config);
        option.text = config.name || config.address; // 显示名字更友好
        selectServer.appendChild(option);
    });

    // --- 创建 Path 下拉框 ---
    const selectPath = document.createElement('select');
    selectPath.className = 'ant-select-selection ant-select-selection--single';
    selectPath.style.width = '200px';
    selectPath.style.fontSize = '14px';

    const emptyOptionP = document.createElement('option');
    emptyOptionP.value = '';
    emptyOptionP.text = '选择路径...';
    selectPath.appendChild(emptyOptionP);

    downloadPaths.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.path;
        // 显示路径，如果太长可以只显示名字
        option.text = item.path;
        selectPath.appendChild(option);
    });

    // --- 核心逻辑：切换服务器时，自动联动路径 ---
    selectServer.onchange = function() {
        if (!this.value) return;

        const config = JSON.parse(this.value);

        // 1. 设置 RPC 基础参数
        unsafeWindow.base.setValue('setting_rpc_domain', config.address);
        unsafeWindow.base.setValue('setting_rpc_port', config.port);
        unsafeWindow.base.setValue('setting_rpc_token', config.token);

        // 2. 自动设置默认路径 (关键修改)
        if (config.defaultPath) {
            unsafeWindow.base.setValue('setting_rpc_dir', config.defaultPath);
            // UI 同步显示
            selectPath.value = config.defaultPath;
        }
    };

    // --- 核心逻辑：手动修改路径 ---
    selectPath.onchange = function() {
        const path = this.value;
        if (path) {
            // 仅修改下载目录，不影响其他配置
            unsafeWindow.base.setValue('setting_rpc_dir', path);
        }
    };

    container.appendChild(selectServer);
    container.appendChild(selectPath);

    // --- 初始化 UI ---
    function init() {
        const newParent = document.querySelector('.section-main');

        if (newParent) {
            if (!newParent.contains(container)) {
                newParent.insertBefore(container, newParent.firstChild);
            }

            // 回显当前状态
            const currentRpcAddress = unsafeWindow.base.getValue('setting_rpc_domain');
            const currentDownloadPath = unsafeWindow.base.getValue('setting_rpc_dir');

            // 匹配 Server
            const matchedConfig = rpcConfigs.find(c => c.address === currentRpcAddress);
            if (matchedConfig) {
                selectServer.value = JSON.stringify(matchedConfig);
            }

            // 匹配 Path (即使是手动输入的，如果在列表里也回显)
            // 如果不在列表里，就保持原样或者显示为空
            const matchedPath = downloadPaths.find(p => p.path === currentDownloadPath);
            if (matchedPath) {
                selectPath.value = matchedPath.path;
            } else if (currentDownloadPath) {
                // 如果当前路径不在列表里，临时加进去显示
                // 避免下拉框显示空白
                let exists = false;
                for (let i = 0; i < selectPath.options.length; i++) {
                    if (selectPath.options[i].value === currentDownloadPath) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    let tempOption = document.createElement('option');
                    tempOption.value = currentDownloadPath;
                    tempOption.text = currentDownloadPath;
                    selectPath.appendChild(tempOption);
                }
                selectPath.value = currentDownloadPath;
            }
        } else {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }
    }

    init();

    const observer = new MutationObserver((mutations) => {
        init();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();