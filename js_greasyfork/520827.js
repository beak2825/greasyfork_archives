// ==UserScript==
// @name         115云盘磁力链接助手-- 天黑了
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动捕捉页面磁力链接并保存至115云盘, 可选择已有文件夹保存
// @author       天黑了
// @license      MIT
// @match        *://*/*
// @connect      115.com
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_log
// @grant        window.Notification
// @run-at       document-end
// @homepage     https://github.com/tianheil3/115-magnet-helper
// @supportURL   https://github.com/tianheil3/115-magnet-helper/issues
// @downloadURL https://update.greasyfork.org/scripts/520827/115%E4%BA%91%E7%9B%98%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B--%20%E5%A4%A9%E9%BB%91%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/520827/115%E4%BA%91%E7%9B%98%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B--%20%E5%A4%A9%E9%BB%91%E4%BA%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('115云盘磁力链接助手已加载 (v1.5)');
    
    // 调试函数
    function debug(msg, ...args) {
        console.log(`[115助手] ${msg}`, ...args);
    }

    // 匹配磁力链接的正则表达式
    const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/gi;

    // 修改115图标的SVG，使用文字"115"
    const icon115 = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" 
            fill="white" font-family="Arial" font-weight="bold" font-size="10">115</text>
    </svg>`;

    // 修改按钮样式，移除定位相关的属性
    const buttonStyle = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        background-color: #2777F8;
        border-radius: 50%;
        cursor: pointer;
        margin-left: 5px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 11px;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0.9;
        user-select: none;
        vertical-align: middle;
    `;

    // 存储已创建的按钮
    const createdButtons = new Set();

    // 创建一个通用的通知函数
    function showNotification(title, text, isWarning = false) {
        debug('准备显示通知:', { title, text, isWarning });
        
        // 直接使用 alert 显示通知
        setTimeout(() => {
            window.alert(`${title}\n${text}`);
        }, 100);

        // 同时尝试使用 GM_notification
        try {
            GM_notification({
                title: title,
                text: text,
                timeout: isWarning ? 3000 : 5000,
                onclick: () => debug('通知被点击了')
            });
            debug('GM_notification 已调用');
        } catch (e) {
            debug('GM_notification 调用失败:', e);
        }
    }

    // 解析磁力链接中的 dn 参数
    function getDisplayNameFromMagnet(magnetLink) {
        try {
            const urlParams = new URLSearchParams(magnetLink.substring(magnetLink.indexOf('?') + 1));
            const dn = urlParams.get('dn');
            if (dn) {
                // 解码并清理非法字符
                let decodedDn = decodeURIComponent(dn.replace(/\+/g, ' '));
                // 移除 Windows 文件名非法字符: \ / : * ? " < > |
                decodedDn = decodedDn.replace(/[\\/:*?"<>|]/g, '_');
                // 移除控制字符
                decodedDn = decodedDn.replace(/[\x00-\x1F\x7F]/g, '');
                // 移除首尾空格
                decodedDn = decodedDn.trim();
                // 避免文件名过长（115 可能有限制，暂定 200）
                return decodedDn.substring(0, 200);
            }
        } catch (e) {
            debug('解析 dn 参数失败:', e);
        }
        return null; // 如果没有 dn 参数或解析失败，返回 null
    }

    // 获取 115 文件夹列表 (目前只获取根目录下的)
    async function get115Folders() {
        return new Promise((resolve) => {
            debug('开始获取根目录文件夹列表');
            // 尝试简化 URL 参数，并减少 limit
            const apiUrl = 'https://aps.115.com/natsort/files.php?aid=1&cid=0&offset=0&limit=300&show_dir=1&natsort=1&format=json';
            GM_xmlhttpRequest({
                method: 'GET',
                // 使用 115 Web API 获取文件列表，cid=0 表示根目录
                // 参数可能随版本变化，limit 设置大一些以获取更多文件夹
                url: apiUrl, 
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Referer': 'https://115.com/',
                    'User-Agent': window.navigator.userAgent
                },
                withCredentials: true,
                onload: function(response) {
                    try {
                        debug('获取文件夹列表 API 响应:', response.responseText.substring(0, 500) + '...'); // 避免日志过长
                        const result = JSON.parse(response.responseText);
                        if (result.state) {
                            // 115 API 返回的数据结构可能变化，这里尝试兼容常见的文件夹判断方式
                            const folders = result.data
                                // 主要判断方式：查找具有 cid (文件夹ID) 且 n (名称) 存在的项
                                // 可能需要结合其他字段，如 ico == 'folder'，或检查是否存在 pid (父ID)
                                // 更可靠的判断：有 cid 和 n，但没有 fid (文件ID) 和 sha1 (文件哈希)
                                .filter(item => item.cid && item.n && typeof item.fid === 'undefined' && typeof item.sha1 === 'undefined')
                                .map(item => ({ id: item.cid, name: item.n }));
                            debug('成功获取文件夹列表:', folders.length, '个');
                            resolve(folders); // 返回 {id, name} 数组
                        } else {
                            // 改进错误日志，包含 errNo
                            const errorDetail = `errNo: ${result.errNo}, error: "${result.error || ''}", msg: "${result.msg || 'N/A'}"`;
                            console.error(`获取文件夹列表失败: API返回 state:false, ${errorDetail}`);
                            resolve([]); // 返回空数组
                        }
                    } catch (error) {
                        console.error('解析文件夹列表响应失败:', error, response.responseText);
                        resolve([]); // 解析失败返回空数组
                    }
                },
                onerror: function(error) {
                    console.error('获取文件夹列表请求失败:', error);
                    resolve([]); // 请求失败返回空数组
                }
            });
        });
    }

    // 显示文件夹选择模态框
    async function showFolderSelector(magnetLink, buttonElement) {
        // --- 创建模态框基础结构 ---
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'magnet-helper-modal-overlay'; // 添加 ID 以便查找和移除
        modalOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6); z-index: 9999;
            display: flex; justify-content: center; align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white; padding: 25px; border-radius: 8px;
            min-width: 300px; max-width: 80%; max-height: 80%;
            overflow-y: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            color: #333; font-family: sans-serif; font-size: 14px;
        `;

        const title = document.createElement('h3');
        title.textContent = '选择保存位置';
        title.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #1E5AC8; border-bottom: 1px solid #eee; padding-bottom: 10px;';
        modalContent.appendChild(title);

        const loadingText = document.createElement('p');
        loadingText.textContent = '正在加载文件夹列表...';
        modalContent.appendChild(loadingText);

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // --- 获取并显示文件夹 ---
        try {
            const folders = await get115Folders();
            if (modalContent.contains(loadingText)) {
                 modalContent.removeChild(loadingText); // 移除加载提示
            }

            const list = document.createElement('ul');
            list.style.cssText = 'list-style: none; padding: 0; margin: 0 0 15px 0; max-height: 300px; overflow-y: auto;';

            // 添加 "根目录" 选项
            const rootOption = document.createElement('li');
            rootOption.textContent = '根目录 (默认)';
            rootOption.style.cssText = 'padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-bottom: 5px; background-color: #f0f0f0;';
            rootOption.addEventListener('mouseover', () => { rootOption.style.backgroundColor = '#e0e0e0'; });
            rootOption.addEventListener('mouseout', () => { rootOption.style.backgroundColor = '#f0f0f0'; });
            rootOption.addEventListener('click', () => {
                selectFolder(0); // 根目录 ID 为 0
            });
            list.appendChild(rootOption);

            // 添加获取到的文件夹
            folders.forEach(folder => {
                const item = document.createElement('li');
                item.textContent = folder.name;
                item.title = folder.name; // 防止名称过长显示不全
                item.style.cssText = 'padding: 8px 12px; cursor: pointer; border-radius: 4px; margin-bottom: 5px; background-color: #f9f9f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                 item.addEventListener('mouseover', () => { item.style.backgroundColor = '#eee'; });
                 item.addEventListener('mouseout', () => { item.style.backgroundColor = '#f9f9f9'; });
                item.addEventListener('click', () => {
                    selectFolder(folder.id);
                });
                list.appendChild(item);
            });
            modalContent.appendChild(list);

        } catch (error) { // 网络或其他错误导致 get115Folders reject
            if (modalContent.contains(loadingText)) {
                modalContent.removeChild(loadingText);
            }
            const errorText = document.createElement('p');
            errorText.textContent = '加载文件夹列表失败！将尝试保存到根目录。' + (error.message ? `(${error.message})` : '');
            errorText.style.color = 'red';
            modalContent.appendChild(errorText);
            // 自动选择根目录并关闭
            setTimeout(() => selectFolder(0), 2500);
        }

        // --- 添加取消按钮 ---
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.style.cssText = `
            padding: 8px 15px; background-color: #ccc; color: #333;
            border: none; border-radius: 4px; cursor: pointer; float: right;
        `;
        cancelButton.addEventListener('click', closeAndCancel);
        modalContent.appendChild(cancelButton);

        // --- 点击遮罩层关闭 ---
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeAndCancel();
            }
        });

        // --- 关闭模态框的通用函数 ---
        function closeModal() {
            setTimeout(() => { // Add delay
                const existingModal = document.getElementById('magnet-helper-modal-overlay');
                if (existingModal && existingModal.parentNode) {
                    existingModal.parentNode.removeChild(existingModal);
                }
            }, 100); // Delay of 100ms
        }

        // --- 选择文件夹并关闭模态框的函数 ---
        async function selectFolder(folderId) {
            closeModal();
            debug(`用户选择文件夹 ID: ${folderId}`);
            buttonElement.textContent = '...'; // 再次确认按钮是加载状态
            buttonElement.style.backgroundColor = '#ff9800';
            // 调用保存函数，并传递按钮元素用于状态恢复
            const success = await saveTo115(magnetLink, folderId, buttonElement);
            // 状态恢复在 saveTo115 内部处理
        }

        // --- 关闭模态框并不执行操作 ---
        function closeAndCancel() {
            closeModal();
            debug('用户取消选择');
            // 恢复按钮状态
            buttonElement.textContent = '115';
            buttonElement.style.backgroundColor = '#2777F8';
        }
    }

    // 保存到115云盘
    async function saveTo115(magnetLink, targetFolderId = 0, buttonElement = null) {
        let success = false;
        let isWarning = false;
        try {
            // 检查登录状态
            const checkLogin = () => {
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://115.com/?ct=offline&ac=space',
                        headers: {
                            'Accept': 'application/json',
                            'Referer': 'https://115.com/',
                            'User-Agent': window.navigator.userAgent
                        },
                        withCredentials: true,
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data.state);
                            } catch (error) {
                                resolve(false);
                            }
                        },
                        onerror: () => resolve(false)
                    });
                });
            };

            // 获取离线空间和用户ID
            const getOfflineSpace = () => {
                return new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://115.com/?ct=offline&ac=space',
                        headers: {
                            'Accept': 'application/json',
                            'Referer': 'https://115.com/'
                        },
                        withCredentials: true,
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } catch (error) {
                                resolve(null);
                            }
                        },
                        onerror: () => resolve(null)
                    });
                });
            };

            // 检查登录状态
            const isLoggedIn = await checkLogin();
            if (!isLoggedIn) {
                GM_notification({
                    text: '请先登录115云盘',
                    title: '115云盘助手',
                    timeout: 3000
                });
                window.open('https://115.com/?ct=login', '_blank');
                return false;
            }

            // 获取离线空间信息
            const spaceInfo = await getOfflineSpace();
            if (!spaceInfo || !spaceInfo.state) {
                debug('获取离线空间信息失败，但仍尝试添加任务');
            }

            // 添加离线任务，并指定目标文件夹ID (wp_path_id)
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://115.com/web/lixian/?ct=lixian&ac=add_task_url',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://115.com/',
                        'Origin': 'https://115.com',
                        'User-Agent': window.navigator.userAgent
                    },
                    // 在 data 中添加 wp_path_id 参数
                    data: `url=${encodeURIComponent(magnetLink)}&wp_path_id=${targetFolderId}`,
                    withCredentials: true,
                    onload: function(response) {
                        try {
                            // 增加详细的调试信息
                            debug('API响应:', response.responseText);
                            debug('响应状态:', response.status);
                            
                            const result = JSON.parse(response.responseText);
                            debug('解析后的结果:', {
                                state: result.state,
                                errtype: result.errtype,
                                errcode: result.errcode,
                                errno: result.errno,
                                error_msg: result.error_msg
                            });
                            
                            success = result.state;
                            isWarning = result.errtype === 'war' || result.errcode === 10008; // 任务已存在算警告

                            if (success) {
                                showNotification(
                                    '115云盘助手',
                                    '磁力链接已成功添加到离线下载队列',
                                    true
                                );
                                resolve(isWarning); // 失败时，如果是警告也算某种程度的"成功"
                            } else {
                                let errorMessage = '添加任务失败';
                                
                                // 优先使用 error_msg
                                if (result.error_msg) {
                                    errorMessage = result.error_msg;
                                    debug('使用 error_msg 作为错误信息:', errorMessage);
                                } else {
                                    const errorCode = result.errcode || result.errno;
                                    debug('使用错误代码:', errorCode);
                                    
                                    const errorTypes = {
                                        911: '用户未登录',
                                        10008: '任务已存在',
                                        10009: '任务超出限制',
                                        10004: '空间不足',
                                        10002: '解析失败',
                                    };

                                    if (errorCode && errorTypes[errorCode]) {
                                        errorMessage = errorTypes[errorCode];
                                        debug('从错误类型映射获取错误信息:', errorMessage);
                                    }
                                }

                                // 检查是否为警告类型
                                debug('是否为警告类型:', isWarning, '(errtype:', result.errtype, 'errcode:', result.errcode, ')');

                                // 显示通知
                                showNotification(
                                    isWarning ? '115云盘助手 - 提示' : '115云盘助手 - 错误',
                                    errorMessage,
                                    isWarning
                                );

                                resolve(isWarning);
                            }
                        } catch (error) {
                            success = false;
                            console.error('解析响应失败:', error, response.responseText);
                            GM_notification({
                                text: '添加任务失败: ' + (error.message || '未知错误'),
                                title: '115云盘助手',
                                timeout: 3000
                            });
                            resolve(false);
                        }
                    },
                    onerror: function(error) {
                        success = false;
                        console.error('请求失败:', error);
                        GM_notification({
                            text: '网络请求失败',
                            title: '115云盘助手',
                            timeout: 3000
                        });
                        resolve(false);
                    },
                    // GM_xmlhttpRequest 的 finally 不可靠，在 onload 和 onerror 中处理
                    onloadend: function() {
                        // 恢复按钮状态
                        if (buttonElement) {
                           debug('恢复按钮状态, success:', success, 'isWarning:', isWarning);
                           buttonElement.textContent = '115';
                           // 成功或警告(任务已存在) 都用蓝色，否则用红色
                           buttonElement.style.backgroundColor = (success || isWarning) ? '#2777F8' : '#f44336';
                           if (!(success || isWarning)) { // 如果是彻底失败，一段时间后恢复蓝色
                               setTimeout(() => {
                                   if (buttonElement.style.backgroundColor === 'rgb(244, 67, 54)') { // 检查是否仍是红色
                                      buttonElement.style.backgroundColor = '#2777F8';
                                   }
                               }, 2000);
                           }
                        }
                    }
                });
            });
        } catch (error) {
            success = false;
            console.error('保存到115云盘外层失败:', error);
            GM_notification({
                text: '保存失败：' + error.message,
                title: '115云盘助手',
                timeout: 3000
            });
             // 恢复按钮状态 (如果需要)
             if (buttonElement) {
                 buttonElement.textContent = '115';
                 buttonElement.style.backgroundColor = '#f44336'; // 红色表示错误
                 setTimeout(() => {
                     if (buttonElement.style.backgroundColor === 'rgb(244, 67, 54)') {
                          buttonElement.style.backgroundColor = '#2777F8';
                     }
                 }, 2000);
             }
            return false;
        }
    }

    // 创建磁力链接按钮
    function createMagnetButton(magnetLink, element) {
        if (createdButtons.has(magnetLink)) return;
        debug('创建按钮:', magnetLink);

        // 创建一个包装容器
        const wrapper = document.createElement('span');
        wrapper.style.cssText = `
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
            margin: 0 2px;
        `;

        // 创建按钮 - 改名为 buttonElement
        const buttonElement = document.createElement('span');
        buttonElement.innerHTML = '115';
        buttonElement.style.cssText = buttonStyle;
        buttonElement.title = '点击保存到115云盘';

        if (element.nodeType === Node.TEXT_NODE) {
            // 处理文本节点
            const text = element.textContent;
            const index = text.indexOf(magnetLink);
            if (index !== -1) {
                const beforeText = document.createTextNode(text.substring(0, index));
                const afterText = document.createTextNode(text.substring(index + magnetLink.length));
                const magnetSpan = document.createElement('span');
                magnetSpan.textContent = magnetLink;
                
                const parent = element.parentNode;
                parent.insertBefore(beforeText, element);
                parent.insertBefore(wrapper, element);
                wrapper.appendChild(magnetSpan);
                wrapper.appendChild(buttonElement);
                parent.insertBefore(afterText, element);
                parent.removeChild(element);
            }
        } else {
            // 处理元素节点
            if (element.tagName === 'A' || element.tagName === 'INPUT') {
                element.parentNode.insertBefore(wrapper, element.nextSibling);
                wrapper.appendChild(buttonElement);
            } else {
                element.appendChild(wrapper);
                wrapper.appendChild(buttonElement);
            }
        }

        // 添加按钮事件处理 - 直接使用 buttonElement
        if (buttonElement) {
            // 添加交互效果
            buttonElement.addEventListener('mouseenter', () => {
                buttonElement.style.transform = 'scale(1.1)';
                buttonElement.style.opacity = '1';
            });
            
            buttonElement.addEventListener('mouseleave', () => {
                buttonElement.style.transform = 'scale(1)';
                buttonElement.style.opacity = '0.9';
            });
            
            // 点击处理
            buttonElement.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                debug('点击按钮，准备显示文件夹选择器:', magnetLink);

                // 改变按钮外观，表示正在处理
                buttonElement.textContent = '...';
                buttonElement.style.backgroundColor = '#ff9800'; // 橙色表示等待
                buttonElement.disabled = true; // 暂时禁用按钮防止重复点击

                // 显示文件夹选择器，传递按钮元素以便后续恢复状态
                try {
                    await showFolderSelector(magnetLink, buttonElement);
                    // 选择器内部会调用 saveTo115 并处理后续状态
                } catch (error) {
                    console.error('显示文件夹选择器时出错:', error);
                    // 如果选择器本身出错，恢复按钮
                    buttonElement.textContent = '115';
                    buttonElement.style.backgroundColor = '#f44336'; // 显示错误
                    setTimeout(() => {
                          buttonElement.style.backgroundColor = '#2777F8';
                     }, 2000);
                } finally {
                    buttonElement.disabled = false; // 无论如何最终都恢复按钮可用性
                }
            });
        }

        createdButtons.add(magnetLink);
    }

    // 查找并处理磁力链接
    function findAndProcessMagnetLinks() {
        debug('开始查找磁力链接');
        
        // 使用 TreeWalker 遍历所有文本节点
        const processedLinks = new Set();
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 过滤掉不可见元素和脚本标签
                    const parent = node.parentElement;
                    if (!parent || 
                        parent.tagName === 'SCRIPT' || 
                        parent.tagName === 'STYLE' || 
                        parent.tagName === 'NOSCRIPT' ||
                        getComputedStyle(parent).display === 'none' ||
                        getComputedStyle(parent).visibility === 'hidden') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 只接受包含磁力链接的文本节点
                    return node.textContent.includes('magnet:?') ? 
                        NodeFilter.FILTER_ACCEPT : 
                        NodeFilter.FILTER_SKIP;
                }
            }
        );

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        // 处理找到的文本节点
        textNodes.forEach(node => {
            const matches = node.textContent.match(magnetRegex);
            if (matches) {
                matches.forEach(magnetLink => {
                    if (!processedLinks.has(magnetLink)) {
                        // 找到实际包含磁力链接的最小父元素
                        let targetElement = node;
                        let parent = node.parentElement;
                        while (parent && parent !== document.body) {
                            if (parent.textContent.trim() === node.textContent.trim()) {
                                targetElement = parent;
                                parent = parent.parentElement;
                            } else {
                                break;
                            }
                        }
                        createMagnetButton(magnetLink, targetElement);
                        processedLinks.add(magnetLink);
                    }
                });
            }
        });

        // 检查特殊属性（如链接和输入框）
        const elements = document.querySelectorAll('a[href], input[value], [data-url], [title], [data-clipboard-text]');
        elements.forEach(element => {
            const attributes = ['href', 'data-url', 'value', 'title', 'data-clipboard-text'];
            for (const attr of attributes) {
                const value = element.getAttribute(attr);
                if (value) {
                    const matches = value.match(magnetRegex);
                    if (matches) {
                        matches.forEach(magnetLink => {
                            if (!processedLinks.has(magnetLink)) {
                                createMagnetButton(magnetLink, element);
                                processedLinks.add(magnetLink);
                            }
                        });
                    }
                }
            }
        });
    }

    // 初始化
    function init() {
        debug('初始化脚本');
        findAndProcessMagnetLinks();

        // 使用 MutationObserver 监听页面变化
        const observer = new MutationObserver(() => {
            setTimeout(findAndProcessMagnetLinks, 500);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 
