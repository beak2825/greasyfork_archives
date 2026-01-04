// ==UserScript==
// @name         Aria2 推送助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  把网站上的磁力或.torrent文件或其他文件推送到远程的Aria2客户端下载
// @author       deepseek & 通义
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      MIT
// @icon         https://p.sda1.dev/26/796aa0358b33cbd01742d27d7a0a5125/Ariang_A.png
// @downloadURL https://update.greasyfork.org/scripts/543900/Aria2%20%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543900/Aria2%20%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================== 配置区域 ==================
    const ARIA2_URL = 'http://192.168.1.23:6800/jsonrpc';
    const ARIA2_SECRET = '123456';
    const SHOW_DELAY = 300; // 显示延迟（毫秒）
    const HIDE_DELAY = 275; // 隐藏延迟（毫秒）
    
    // 配置支持推送的资源类型（通过注释禁用不需要的类型）
    const SUPPORTED_TYPES = [
        'magnet',   // 磁力链接
        'torrent',  // BT种子文件
        'http',     // HTTP下载
        'https',    // HTTPS下载
        //'ftp',     // FTP下载
        'ed2k',     // eDonkey链接
        //'metalink'  // Metalink文件
    ].filter(Boolean); // 过滤掉被注释的行
    
    // ================== 配置结束 ==================

    let currentButton = null;
    let showTimeout = null;
    let hideTimeout = null;

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
        if (url.endsWith('.torrent')) return 'torrent';
        if (url.startsWith('ed2k:')) return 'ed2k';
        if (url.startsWith('metalink:')) return 'metalink';
        if (url.startsWith('http:')) return 'http';
        if (url.startsWith('https:')) return 'https';
        if (url.startsWith('ftp:')) return 'ftp';
        return 'default';
    }

    // 创建按钮
    function createButton(url, text, link) {
        const button = document.createElement('button');
        const linkType = getLinkType(url);
        const icon = resourceIcons[linkType] || resourceIcons.default;
        button.innerHTML = `${icon} 推送到Aria2`;
        button.setAttribute('aria-label', '推送到Aria2下载器');
        button.dataset.linkType = linkType;

        // 判断背景明暗
        const brightness = getBackgroundBrightness(link);
        const isDarkBg = brightness < 150;

        // 根据背景设置按钮样式
        const bgColor = isDarkBg ? '#00bfff' : '#007bff'; // 亮蓝 or 深蓝
        const color = isDarkBg ? '#fff' : '#fff';
        const boxShadow = isDarkBg
            ? '0 2px 5px rgba(0, 0, 0, 0.4)'
            : '0 2px 5px rgba(0, 0, 0, 0.2)';

        button.style.cssText = `
            position: absolute;
            z-index: 99999;
            padding: 4px 8px;
            font-size: 11px;
            font-weight: normal;
            color: ${color};
            background-color: ${bgColor};
            border: none;
            border-radius: 3px;
            cursor: pointer;
            box-shadow: ${boxShadow};
            transition: all 0.2s ease;
            white-space: nowrap;
            opacity: 0.95;
            display: flex;
            align-items: center;
            gap: 4px;
        `;

        // 点击反馈
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 保存原始状态以便恢复
            const originalText = button.innerHTML;
            const originalBg = button.style.backgroundColor;
            const originalCursor = button.style.cursor;
            
            // 更新按钮状态为"正在推送"
            button.innerHTML = '⏳ 推送中...';
            button.style.backgroundColor = '#ff9800'; // 橙色表示进行中
            button.style.cursor = 'wait';
            
            // 推送到Aria2
            pushToAria2(url, (success, message) => {
                if (success) {
                    // 推送成功
                    button.innerHTML = '✅ 已推送';
                    button.style.backgroundColor = '#4CAF50'; // 绿色表示成功
                    button.style.cursor = 'default';
                    
                    // 2秒后隐藏按钮
                    setTimeout(() => {
                        if (currentButton === button) {
                            currentButton.remove();
                            currentButton = null;
                        }
                    }, 2000);
                    
                    // 显示成功通知（如果想要油猴脚本在浏览器报告推送通知请去掉注释）
//                    GM_notification({
//                        title: '推送成功',
//                        text: `资源已添加到Aria2下载队列`,
//                        timeout: 3000
//                    });
                } else {
                    // 推送失败 - 恢复按钮状态并显示错误
                    button.innerHTML = originalText;
                    button.style.backgroundColor = originalBg;
                    button.style.cursor = originalCursor;
                    
                    // 显示错误弹窗
                    alert(`推送失败: ${message}`);
                }
            });
        });

        // 鼠标进入按钮 → 清除隐藏定时器
        button.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
        });

        // 鼠标离开按钮 → 延迟隐藏按钮
        button.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                // 只有非"已推送"状态才隐藏
                if (currentButton && currentButton.innerHTML !== '✅ 已推送') {
                    currentButton.remove();
                    currentButton = null;
                }
            }, HIDE_DELAY);
        });

        return button;
    }

    // 显示按钮在链接上方或下方（智能判断位置）
    function showButtonAboveLink(link) {
        if (currentButton) return;

        clearTimeout(showTimeout);
        showTimeout = setTimeout(() => {
            const rect = link.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;
            const scrollLeft = window.scrollX || window.pageXOffset;

            const url = link.href;
            const text = link.textContent || '下载资源';

            // 获取链接类型
            const linkType = getLinkType(url);
            
            // 检查是否支持该类型
            if (!SUPPORTED_TYPES.includes(linkType)) return;
            
            // 如果是默认类型且不是可下载资源，跳过
            if (linkType === 'default' && !isDownloadableResource(url)) return;

            currentButton = createButton(url, text, link);
            document.body.appendChild(currentButton);

            // 获取按钮尺寸
            const buttonRect = currentButton.getBoundingClientRect();

            // 初始按钮位置：链接上方 20px，水平居中
            let top = rect.top + scrollTop - buttonRect.height - 10;
            let left = rect.left + scrollLeft + (rect.width - buttonRect.width) / 2;

            // 如果上方空间不足 → 放到下方
            if (top < 0) {
                top = rect.top + scrollTop + 20;
            }

            // 如果右侧超出 → 右对齐
            if (left + buttonRect.width > window.innerWidth + scrollLeft) {
                left = rect.right + scrollLeft - buttonRect.width;
            }

            // 如果左侧超出 → 左对齐
            if (left < scrollLeft) {
                left = rect.left + scrollLeft;
            }

            currentButton.style.top = `${top}px`;
            currentButton.style.left = `${left}px`;
        }, SHOW_DELAY);
    }

    // 判断是否为可下载资源
    function isDownloadableResource(url) {
        // 排除常见网页扩展名
        const nonDownloadable = ['.html', '.htm', '.php', '.asp', '.aspx', '.jsp', '.cgi', '.js', '.css'];
        for (const ext of nonDownloadable) {
            if (url.includes(ext)) return false;
        }
        
        // 检查URL是否包含常见下载关键词
        const downloadKeywords = ['/download/', '/dl/', '/file/', '/getfile', '?download=true'];
        for (const keyword of downloadKeywords) {
            if (url.includes(keyword)) return true;
        }
        
        // 检查URL参数中是否有下载指示
        const params = new URL(url).searchParams;
        if (params.get('download') || params.get('dl')) return true;
        
        return false;
    }

    // 设置链接监听
    function setupLinkListeners() {
        // 资源类型到选择器的映射
        const typeToSelector = {
            'magnet': 'a[href^="magnet:"]',
            'torrent': 'a[href*=".torrent"]',
            'ed2k': 'a[href^="ed2k:"]',
            'metalink': 'a[href^="metalink:"]',
            'http': 'a[href^="http://"]',
            'https': 'a[href^="https://"]',
            'ftp': 'a[href^="ftp://"]'
        };
        
        // 生成选择器数组（仅包含支持的类型）
        const selectors = SUPPORTED_TYPES.map(type => typeToSelector[type]).filter(Boolean);
        
        // 如果没有选择器则跳过
        if (selectors.length === 0) return;
        
        const links = document.querySelectorAll(selectors.join(','));
        links.forEach(link => {
            if (link.dataset.aria2Added) return;
            link.dataset.aria2Added = 'true';

            // 鼠标进入链接 → 显示按钮
            link.addEventListener('mouseenter', () => {
                showButtonAboveLink(link);
            });

            // 鼠标离开链接 → 延迟隐藏按钮
            link.addEventListener('mouseleave', () => {
                if (currentButton) {
                    hideTimeout = setTimeout(() => {
                        // 只有非"已推送"状态才隐藏
                        if (currentButton && currentButton.innerHTML !== '✅ 已推送') {
                            currentButton.remove();
                            currentButton = null;
                        }
                    }, HIDE_DELAY);
                }
            });
        });
    }

    // 主函数
    function main() {
        setupLinkListeners();

        // 动态监听 DOM 变化
        const observer = new MutationObserver(setupLinkListeners);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 推送到 Aria2
    function pushToAria2(url, callback) {
        console.log('🔗 正在推送链接到 Aria2:', url);
        
        // 特殊处理：.torrent文件需要下载后推送
        if (url.endsWith('.torrent')) {
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

        sendAria2Request(payload, callback);
    }

    // 处理.torrent文件
    function handleTorrentFile(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer',
            onload: function(response) {
                if (response.status === 200) {
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
                    callback(false, `无法获取.torrent文件: ${response.status} ${response.statusText}`);
                }
            },
            onerror: function(err) {
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

    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();