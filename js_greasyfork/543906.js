// ==UserScript==
// @name         qBittorrent & Aria2 推送助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键将磁力链接、种子资源推送到远程的qBittorrent或Aria2客户端下载
// @author       deepseek & 通义
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @icon         https://p.sda1.dev/26/90d92c0ef2f191f7f467677361af144f/push.png
// @downloadURL https://update.greasyfork.org/scripts/543906/qBittorrent%20%20Aria2%20%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543906/qBittorrent%20%20Aria2%20%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================== 配置区域 ==================
    // qBittorrent 在此处配置
    const QBITTORRENT_URL = 'http://192.168.1.23:8080/';
    const QBITTORRENT_USER = 'username';
    const QBITTORRENT_PASS = 'password';
    
    // Aria2 在此处配置配置
    const ARIA2_URL = 'http://192.168.1.23:6800/jsonrpc';
    const ARIA2_SECRET = 'aria2_secert';
    
    const SHOW_DELAY = 300; // 显示延迟（毫秒）
    const HIDE_DELAY = 275; // 隐藏延迟（毫秒）
    
    // 配置支持推送的资源类型（通过注释禁用不需要的类型，主要作用于Aria2）
    const SUPPORTED_TYPES = [
        'magnet',   // 磁力链接
        'torrent',  // BT种子文件
        //'http',     // HTTP下载
        //'https',    // HTTPS下载
        //'ftp',      // FTP下载
        'ed2k',     // eDonkey链接
        //'metalink'  // Metalink文件
    ].filter(Boolean); // 过滤掉被注释的行
    // ================== 配置结束 ==================

    let currentMainButton = null;
    let currentSubButtons = null;
    let showTimeout = null;
    let hideTimeout = null;
    let currentUrl = null; // 存储当前链接
    
    // 添加全局样式
    GM_addStyle(`
        .qba-push-container {
            position: absolute;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            gap: 6px;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        
        .qba-push-container.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        
        .qba-main-button {
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            background: linear-gradient(135deg, #4facfe, #00f2fe);
            border: none;
            border-radius: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            white-space: nowrap;
            pointer-events: all;
            z-index: 100000;
        }
        
        .qba-main-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        }
        
        .qba-sub-buttons {
            display: flex;
            gap: 6px;
            background: rgba(30, 41, 59, 0.95);
            border-radius: 10px;
            padding: 8px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: all;
        }
        
        .qba-sub-button {
            padding: 6px 10px;
            font-size: 11px;
            font-weight: 500;
            color: #e2e8f0;
            background: rgba(15, 23, 42, 0.8);
            border: none;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .qba-sub-button:hover {
            background: rgba(79, 172, 254, 0.3);
            transform: translateY(-2px);
        }
        
        .qba-qb-button {
            border-left: 2px solid #4facfe;
        }
        
        .qba-aria2-button {
            border-left: 2px solid #00f2fe;
        }
        
        .qba-working {
            background: #ffc107 !important;
            cursor: wait !important;
        }
        
        .qba-success {
            background: #28a745 !important;
        }
        
        .qba-error {
            background: #dc3545 !important;
        }
        
        .qba-copied {
            background: #6f42c1 !important;
        }
    `);

    // 资源类型图标映射
    const resourceIcons = {
        'magnet': '🧲',
        'torrent': '📁',
        'http': '🌐',
        'https': '🔒',
        'ftp': '📡',
        'ed2k': '🔗',
        'metalink': '⚙️',
        'default': '⬇️'
    };

    // 下载器图标
    const downloaderIcons = {
        'qb': '🔵', // qBittorrent图标
        'aria2': '🟢' // Aria2图标
    };

    // 获取背景亮度（感知亮度公式）
    function getBackgroundBrightness(element) {
        let el = element;
        while (el && el !== document.body) {
            const style = window.getComputedStyle(el);
            const bg = style.backgroundColor;

            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const rgb = bg.match(/(\d+),\s*(\d+),\s*(\d+)/);
                if (rgb) {
                    const r = parseInt(rgb[1]);
                    const g = parseInt(rgb[2]);
                    const b = parseInt(rgb[3]);
                    return (r * 299 + g * 587 + b * 114) / 1000;
                }
            }
            el = el.parentElement;
        }
        return 255; // 默认亮色背景
    }

    // 获取链接类型
    function getLinkType(url) {
        if (url.startsWith('magnet:')) return 'magnet';
        if (url.endsWith('.torrent') || url.includes('.torrent?')) return 'torrent';
        if (url.startsWith('ed2k:')) return 'ed2k';
        if (url.startsWith('metalink:')) return 'metalink';
        if (url.startsWith('http:')) return 'http';
        if (url.startsWith('https:')) return 'https';
        if (url.startsWith('ftp:')) return 'ftp';
        return 'default';
    }

    // 创建主按钮
    function createMainButton(url, text, link) {
        const linkType = getLinkType(url);
        
        // 检查资源类型是否在支持列表中
        if (!SUPPORTED_TYPES.includes(linkType)) return null;
        
        const icon = resourceIcons[linkType] || resourceIcons.default;
        
        const button = document.createElement('button');
        button.className = 'qba-main-button';
        button.innerHTML = `${icon} ${linkType.toUpperCase()}`;
        button.setAttribute('aria-label', '推送下载资源');
        button.dataset.linkType = linkType;
        
        // 存储当前URL
        currentUrl = url;
        
        // 添加点击事件 - 复制链接
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            copyLinkToClipboard(url, button);
        });
        
        // 判断背景明暗
        const brightness = getBackgroundBrightness(link);
        const isDarkBg = brightness < 150;
        
        // 根据背景调整按钮文字颜色
        if (isDarkBg) {
            button.style.color = '#fff';
        } else {
            button.style.color = '#fff';
        }
        
        return button;
    }

    // 复制链接到剪贴板
    function copyLinkToClipboard(url, button) {
        GM_setClipboard(url, 'text');
        
        // 保存原始状态
        const originalHTML = button.innerHTML;
        const originalClass = button.className;
        
        // 更新按钮状态
        button.innerHTML = '✅ 已复制!';
        button.classList.add('qba-copied');
        
        // 显示成功通知（如果想要油猴脚本在浏览器报告推送通知请去掉注释）
//        GM_notification({
//            title: '链接已复制',
//            text: '链接地址已复制到剪贴板',
//            timeout: 2000,
//            silent: true
//        });
        
        // 2秒后恢复原始状态
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.className = originalClass;
        }, 2000);
    }

    // 创建子按钮
    function createSubButtons(url, text, link) {
        const container = document.createElement('div');
        container.className = 'qba-sub-buttons';
        
        const linkType = getLinkType(url);
        
        // 只对磁力链接显示qBittorrent按钮
        if (linkType === 'magnet') {
            // 创建推送到qBittorrent的按钮
            const qbButton = document.createElement('button');
            qbButton.className = 'qba-sub-button qba-qb-button';
            qbButton.innerHTML = `<span>${downloaderIcons.qb}</span> <span>推送到 qB</span>`;
            qbButton.onclick = (e) => {
                e.stopPropagation();
                pushToDownloader('qb', url, text, link, qbButton);
            };
            container.appendChild(qbButton);
        }
        
        // 对于所有支持的类型，显示Aria2按钮
        // 创建推送到Aria2的按钮
        const aria2Button = document.createElement('button');
        aria2Button.className = 'qba-sub-button qba-aria2-button';
        aria2Button.innerHTML = `<span>${downloaderIcons.aria2}</span> <span>推送到 Aria2</span>`;
        aria2Button.onclick = (e) => {
            e.stopPropagation();
            pushToDownloader('aria2', url, text, link, aria2Button);
        };
        container.appendChild(aria2Button);
        
        return container;
    }

    // 创建按钮容器
    function createButtonContainer(url, text, link) {
        // 移除现有的按钮
        if (currentMainButton) {
            currentMainButton.remove();
            currentMainButton = null;
        }
        if (currentSubButtons) {
            currentSubButtons.remove();
            currentSubButtons = null;
        }
        
        const mainButton = createMainButton(url, text, link);
        if (!mainButton) return null; // 如果资源类型不在支持列表中，不创建按钮
        
        const container = document.createElement('div');
        container.className = 'qba-push-container';
        
        const subButtons = createSubButtons(url, text, link);
        
        container.appendChild(mainButton);
        container.appendChild(subButtons);
        
        // 主按钮悬停事件
        mainButton.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });
        
        // 主按钮离开事件
        mainButton.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                container.classList.remove('visible');
                setTimeout(() => {
                    if (container.parentNode) {
                        container.remove();
                    }
                }, 300);
            }, HIDE_DELAY);
        });
        
        // 子按钮区域事件
        subButtons.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });
        
        subButtons.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                container.classList.remove('visible');
                setTimeout(() => {
                    if (container.parentNode) {
                        container.remove();
                    }
                }, 300);
            }, HIDE_DELAY);
        });
        
        currentMainButton = mainButton;
        currentSubButtons = subButtons;
        
        return container;
    }

    // 显示按钮容器
    function showButtonContainer(link) {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);
        
        showTimeout = setTimeout(() => {
            const rect = link.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;
            const scrollLeft = window.scrollX || window.pageXOffset;
            
            const url = link.href;
            const text = link.textContent || '下载资源';
            
            // 创建按钮容器
            const container = createButtonContainer(url, text, link);
            if (!container) return; // 如果资源类型不在支持列表中，不显示按钮
            
            document.body.appendChild(container);
            
            // 获取容器尺寸
            container.style.visibility = 'hidden';
            container.style.display = 'block';
            const containerRect = container.getBoundingClientRect();
            container.style.visibility = 'visible';
            container.style.display = '';
            
            // 计算位置 - 在链接上方居中显示
            let top = rect.top + scrollTop - containerRect.height - 8;
            let left = rect.left + scrollLeft + (rect.width - containerRect.width) / 2;
            
            // 如果上方空间不足，显示在下方
            if (top < 0) {
                top = rect.bottom + scrollTop + 8;
            }
            
            // 调整左右位置防止溢出
            if (left < 0) left = 8;
            if (left + containerRect.width > window.innerWidth) {
                left = window.innerWidth - containerRect.width - 8;
            }
            
            container.style.top = `${top}px`;
            container.style.left = `${left}px`;
            
            // 显示容器
            setTimeout(() => {
                container.classList.add('visible');
            }, 50);
        }, SHOW_DELAY);
    }

    // 设置链接监听
    function setupLinkListeners() {
        const selectors = [
            'a[href^="magnet:?xt=urn:btih:"]',
            'a[href*=".torrent"]',
            'a[href^="ed2k:"]',
            'a[href^="http://"]',
            'a[href^="https://"]',
            'a[href^="ftp://"]'
        ];
        
        const links = document.querySelectorAll(selectors.join(','));
        links.forEach(link => {
            if (link.dataset.qbaAdded) return;
            link.dataset.qbaAdded = 'true';
            
            // 鼠标进入链接
            link.addEventListener('mouseenter', () => {
                showButtonContainer(link);
            });
            
            // 鼠标离开链接
            link.addEventListener('mouseleave', () => {
                clearTimeout(showTimeout);
                hideTimeout = setTimeout(() => {
                    const container = document.querySelector('.qba-push-container');
                    if (container) {
                        container.classList.remove('visible');
                        setTimeout(() => {
                            if (container.parentNode) {
                                container.remove();
                            }
                        }, 300);
                    }
                }, HIDE_DELAY);
            });
        });
    }

    // 推送到下载器
    function pushToDownloader(downloader, url, text, link, clickedButton) {
        // 保存原始状态以便恢复
        const originalHTML = clickedButton.innerHTML;
        const originalClass = clickedButton.className;
        
        // 更新按钮状态为"正在推送"
        clickedButton.innerHTML = '⏳ 推送中...';
        clickedButton.classList.add('qba-working');
        clickedButton.disabled = true;
        
        if (downloader === 'qb') {
            pushToQbittorrent(url, text, (success, message) => {
                handlePushResult(success, message, 'qBittorrent', clickedButton, originalHTML, originalClass);
            });
        } else {
            pushToAria2(url, (success, message) => {
                handlePushResult(success, message, 'Aria2', clickedButton, originalHTML, originalClass);
            });
        }
    }

    // 处理推送结果
    function handlePushResult(success, message, downloaderName, clickedButton, originalHTML, originalClass) {
        // 移除工作状态
        clickedButton.classList.remove('qba-working');
        clickedButton.disabled = false;
        
        if (success) {
            // 推送成功
            clickedButton.innerHTML = '✅ 已推送';
            clickedButton.classList.add('qba-success');
            
            // 显示成功通知（如果想要油猴脚本在浏览器报告推送通知请去掉注释）
//            GM_notification({
//                title: '推送成功',
//                text: `资源已添加到${downloaderName}下载队列`,
//                timeout: 3000,
//                silent: true
//            });
        } else {
            // 推送失败
            clickedButton.innerHTML = '❌ 失败';
            clickedButton.classList.add('qba-error');
            
            // 延迟显示错误信息
            setTimeout(() => {
                alert(`推送到${downloaderName}失败: ${message}`);
                // 恢复原始状态（在失败时）
                clickedButton.innerHTML = originalHTML;
                clickedButton.className = originalClass;
            }, 100);
        }
        
        // 2秒后移除整个容器
        setTimeout(() => {
            const container = document.querySelector('.qba-push-container');
            if (container) {
                container.remove();
            }
        }, 2000);
    }

    // 推送到 qBittorrent
    function pushToQbittorrent(url, description = '', callback) {
        console.log('🔗 正在推送到 qBittorrent:', url);
        
        const loginUrl = QBITTORRENT_URL + 'api/v2/auth/login';
        const addUrl = QBITTORRENT_URL + 'api/v2/torrents/add';
        
        // 第一步：登录获取 SID
        GM_xmlhttpRequest({
            method: 'POST',
            url: loginUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': QBITTORRENT_URL
            },
            data: `username=${encodeURIComponent(QBITTORRENT_USER)}&password=${encodeURIComponent(QBITTORRENT_PASS)}`,
            withCredentials: true,
            onload: function (response) {
                if (response.status === 200 && response.responseText === 'Ok.') {
                    console.log('✅ qBittorrent 登录成功');
                    
                    // 第二步：推送任务
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: addUrl,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Referer': QBITTORRENT_URL
                        },
                        data: `urls=${encodeURIComponent(url)}`,
                        withCredentials: true,
                        onload: function (res) {
                            if (res.status === 200) {
                                console.log('✅ qBittorrent 添加成功');
                                callback(true, '添加成功');
                            } else {
                                console.error('❌ qBittorrent 添加失败:', res.status, res.statusText);
                                callback(false, `服务器错误: ${res.status} ${res.statusText}`);
                            }
                        },
                        onerror: function (err) {
                            console.error('❌ qBittorrent 网络错误:', err);
                            callback(false, `网络错误: ${err.status} ${err.statusText}`);
                        }
                    });
                } else {
                    console.error('❌ qBittorrent 登录失败:', response.status, response.responseText);
                    callback(false, '登录失败，请检查用户名密码或 Web UI 设置');
                }
            },
            onerror: function (err) {
                console.error('❌ qBittorrent 登录请求失败:', err);
                callback(false, `登录请求失败: ${err.status} ${err.statusText}`);
            }
        });
    }

    // 推送到 Aria2 
    function pushToAria2(url, callback) {
        console.log('🔗 正在推送到 Aria2:', url);
        
        // 特殊处理：.torrent文件需要下载后推送
        if (url.endsWith('.torrent') || url.includes('.torrent?')) {
            console.log('🔗 处理.torrent文件');
            return handleTorrentFile(url, callback);
        }

        const payload = {
            jsonrpc: "2.0",
            id: "aria2_push_" + Date.now(),
            method: "aria2.addUri",
            params: [
                `token:${ARIA2_SECRET}`,
                [url],
                {}
            ]
        };

        console.log('📦 Aria2 请求负载:', payload);
        sendAria2Request(payload, callback);
    }

    // 处理.torrent文件
    function handleTorrentFile(url, callback) {
        console.log('⬇️ 下载.torrent文件:', url);
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            onload: function(response) {
                if (response.status === 200) {
                    console.log('✅ .torrent文件下载成功');
                    const base64Torrent = arrayBufferToBase64(response.response);
                    const payload = {
                        jsonrpc: "2.0",
                        id: "aria2_push_" + Date.now(),
                        method: "aria2.addTorrent",
                        params: [
                            `token:${ARIA2_SECRET}`,
                            base64Torrent,
                            []
                        ]
                    };
                    sendAria2Request(payload, callback);
                } else {
                    console.error('❌ 无法获取.torrent文件:', response.status, response.statusText);
                    callback(false, `无法获取.torrent文件: ${response.status} ${response.statusText}`);
                }
            },
            onerror: function(err) {
                console.error('❌ 下载.torrent文件失败:', err);
                callback(false, `下载.torrent文件失败: ${err.status} ${err.statusText}`);
            }
        });
    }

    // 发送Aria2请求
    function sendAria2Request(payload, callback) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: ARIA2_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
            onload: function (response) {
                try {
                    console.log('📨 Aria2 响应:', response.status, response.responseText);
                    const res = JSON.parse(response.responseText);
                    if (res.error) {
                        console.error('❌ Aria2 返回错误:', res.error);
                        callback(false, `Aria2 错误: ${res.error.message || res.error.code}`);
                    } else {
                        console.log('✅ 成功添加到 Aria2');
                        callback(true, '添加成功');
                    }
                } catch (e) {
                    console.error('❌ 解析响应失败:', e);
                    callback(false, '解析响应失败');
                }
            },
            onerror: function (err) {
                console.error('❌ 请求失败:', err);
                callback(false, `网络错误: ${err.status} ${err.statusText}`);
            },
            ontimeout: function () {
                console.error('❌ 请求超时');
                callback(false, '请求超时，请检查Aria2服务状态');
            }
        });
    }

    // ArrayBuffer 转 Base64
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // 主函数
    function main() {
        console.log('🚀 qBittorrent & Aria2 推送助手已启动');
        setupLinkListeners();
        
        // 动态监听 DOM 变化
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => setupLinkListeners());
        });
        
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }

    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();