// ==UserScript==
// @name         文件上传改名脚本 - Perplexity专用
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  拦截并修改上传文件名
// @author       You
// @match        https://www.perplexity.ai/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/539002/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%94%B9%E5%90%8D%E8%84%9A%E6%9C%AC%20-%20Perplexity%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539002/%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E6%94%B9%E5%90%8D%E8%84%9A%E6%9C%AC%20-%20Perplexity%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 可维护的文件后缀名库配置
    const FILE_EXTENSIONS = {
        programming: [
            'java', 'py', 'js', 'ts', 'cpp', 'c', 'h', 'hpp',
            'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'scala',
            'sh', 'bat', 'ps1', 'pl', 'r', 'sql', 'html', 'css',
            'jsx', 'tsx', 'vue', 'svelte'
        ],
        config: [
            'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'conf',
            'properties', 'env', 'dockerfile'
        ],
        scripts: [
            'lua', 'vim', 'awk', 'sed'
        ]
    };

    let controlButton = null;
    let configPanel = null;
    let observer = null;

    // 获取所有需要处理的后缀名
    function getAllExtensions() {
        const allExtensions = [];
        Object.values(FILE_EXTENSIONS).forEach(category => {
            allExtensions.push(...category);
        });
        return allExtensions;
    }

    // 检查文件是否需要改名
    function shouldRenameFile(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return getAllExtensions().includes(extension);
    }

    // 生成新文件名
    function generateNewFilename(originalName) {
        const parts = originalName.split('.');
        const extension = parts.pop();
        const baseName = parts.join('.');
        return `${baseName}_${extension}.txt`;
    }

    // 检查按钮是否存在
    function isButtonExists() {
        return document.getElementById('file-rename-toggle') !== null;
    }

    // 检查面板是否存在
    function isPanelExists() {
        return document.getElementById('file-rename-config') !== null;
    }

    // 创建配置面板
    function createConfigPanel() {
        // 如果已存在则不重复创建
        if (isPanelExists()) return;

        const panel = document.createElement('div');
        panel.id = 'file-rename-config';
        panel.style.cssText = `
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            width: 300px !important;
            background: #fff !important;
            border: 2px solid #007bff !important;
            border-radius: 8px !important;
            padding: 15px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            z-index: 999999 !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
            display: none !important;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #007bff;">
                文件改名脚本配置
                <button id="close-config" style="float: right; background: none; border: none; font-size: 16px; cursor: pointer;">×</button>
            </div>
            <div style="margin-bottom: 10px;">
                <label>当前支持的文件类型：</label>
                <div id="extension-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; margin-top: 5px;">
                    ${getAllExtensions().map(ext => `<span style="display: inline-block; background: #e9ecef; padding: 2px 6px; margin: 2px; border-radius: 3px;">.${ext}</span>`).join('')}
                </div>
            </div>
            <div style="margin-bottom: 10px;">
                <label for="new-extension">添加新后缀名：</label>
                <input type="text" id="new-extension" placeholder="例如: jsx" style="width: 100%; padding: 5px; margin-top: 5px;">
                <button id="add-extension" style="width: 100%; padding: 5px; margin-top: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">添加</button>
            </div>
            <div style="text-align: center; font-size: 12px; color: #666;">
                脚本状态: <span id="script-status" style="color: #28a745;">运行中</span>
            </div>
        `;

        document.body.appendChild(panel);
        configPanel = panel;

        // 绑定事件
        const closeBtn = panel.querySelector('#close-config');
        if (closeBtn) {
            closeBtn.onclick = () => {
                panel.style.display = 'none';
            };
        }

        const addBtn = panel.querySelector('#add-extension');
        if (addBtn) {
            addBtn.onclick = () => {
                const input = panel.querySelector('#new-extension');
                const newExt = input.value.trim().toLowerCase();
                if (newExt && !getAllExtensions().includes(newExt)) {
                    FILE_EXTENSIONS.programming.push(newExt);
                    input.value = '';
                    updateExtensionList();
                    console.log(`已添加新后缀名: .${newExt}`);
                }
            };
        }

        function updateExtensionList() {
            const listDiv = panel.querySelector('#extension-list');
            if (listDiv) {
                listDiv.innerHTML = getAllExtensions().map(ext =>
                    `<span style="display: inline-block; background: #e9ecef; padding: 2px 6px; margin: 2px; border-radius: 3px;">.${ext}</span>`
                ).join('');
            }
        }
    }

    // 创建控制按钮
    function createControlButton() {
        // 如果已存在则不重复创建
        if (isButtonExists()) return;

        const button = document.createElement('div');
        button.id = 'file-rename-toggle';
        button.innerHTML = '📁';
        button.title = '文件改名脚本配置';
        button.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            background: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            z-index: 999999 !important;
            font-size: 16px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            user-select: none !important;
        `;

        button.onclick = () => {
            if (!isPanelExists()) {
                createConfigPanel();
            }
            const panel = document.getElementById('file-rename-config');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        };

        document.body.appendChild(button);
        controlButton = button;
    }

    // 使用MutationObserver监听DOM变化
    function setupDOMObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            let needsRecreation = false;

            mutations.forEach((mutation) => {
                // 检查是否有节点被移除
                if (mutation.type === 'childList') {
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查我们的按钮或面板是否被移除
                            if (node.id === 'file-rename-toggle' ||
                                node.id === 'file-rename-config' ||
                                node.contains && (
                                    node.contains(controlButton) ||
                                    node.contains(configPanel)
                                )) {
                                needsRecreation = true;
                            }
                        }
                    });
                }
            });

            if (needsRecreation || !isButtonExists()) {
                console.log('检测到按钮丢失，重新创建...');
                setTimeout(() => {
                    createControlButton();
                    createConfigPanel();
                }, 100);
            }
        });

        // 监听整个document的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 定期检查按钮状态
    function setupPeriodicCheck() {
        setInterval(() => {
            if (!isButtonExists()) {
                console.log('定期检查发现按钮丢失，重新创建...');
                createControlButton();
                createConfigPanel();
            }
        }, 2000); // 每2秒检查一次
    }

    // 主要的文件拦截逻辑
    function interceptFileUploads() {
        // 使用事件委托来处理动态添加的文件输入框
        document.addEventListener('change', function(event) {
            if (event.target.type === 'file') {
                const fileInput = event.target;
                const files = Array.from(fileInput.files);
                let hasChanges = false;

                const newFiles = files.map(file => {
                    if (shouldRenameFile(file.name)) {
                        const newName = generateNewFilename(file.name);
                        console.log(`文件改名: ${file.name} → ${newName}`);
                        hasChanges = true;

                        return new File([file], newName, {
                            type: 'text/plain',
                            lastModified: file.lastModified
                        });
                    }
                    return file;
                });

                if (hasChanges) {
                    const dt = new DataTransfer();
                    newFiles.forEach(file => dt.items.add(file));
                    fileInput.files = dt.files;

                    showNotification('文件已自动改名为.txt格式');
                }
            }
        }, true);

        // 拦截FormData
        const OriginalFormData = unsafeWindow.FormData;
        unsafeWindow.FormData = function(...args) {
            const formData = new OriginalFormData(...args);

            const originalAppend = formData.append;
            formData.append = function(name, value, filename) {
                if (value instanceof File && filename && shouldRenameFile(filename)) {
                    const newFilename = generateNewFilename(filename);
                    console.log(`FormData文件改名: ${filename} → ${newFilename}`);
                    return originalAppend.call(this, name, value, newFilename);
                }
                return originalAppend.apply(this, arguments);
            };

            return formData;
        };
    }

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            background: #28a745 !important;
            color: white !important;
            padding: 10px 15px !important;
            border-radius: 5px !important;
            z-index: 1000000 !important;
            font-size: 14px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // 初始化脚本
    function init() {
        console.log('文件上传改名脚本启动中...');

        // 创建UI界面
        createControlButton();
        createConfigPanel();

        // 设置DOM监听器
        setupDOMObserver();

        // 设置定期检查
        setupPeriodicCheck();

        // 启动文件拦截
        interceptFileUploads();

        console.log('文件上传改名脚本已启动 - Perplexity专用版');
        console.log('支持的文件类型:', getAllExtensions());
    }

    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 页面完全加载后再次确保按钮存在
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!isButtonExists()) {
                createControlButton();
                createConfigPanel();
            }
        }, 1000);
    });
})();
