// ==UserScript==
// @name         qBittorrent 推送助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  把网站上的磁力链接推送到远程qBittorent客户端下载
// @author       deepseek & 通义
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification  
// @license      MIT
// @icon		 https://p.sda1.dev/26/e07fcb094217d088d3fb15d132bfa7ec/Qbittorrent_A.png
// @downloadURL https://update.greasyfork.org/scripts/543893/qBittorrent%20%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543893/qBittorrent%20%E6%8E%A8%E9%80%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ================== 配置区域 ==================
    const QBITTORRENT_URL = 'http://192.168.1.23:8080/';
    const QBITTORRENT_USER = 'admin';
    const QBITTORRENT_PASS = 'adminadmin';
	const SHOW_DELAY = 300; // 显示延迟（毫秒）
    const HIDE_DELAY = 275; // 隐藏延迟（毫秒）
    // ================== 配置结束 ==================

	
    let currentButton = null;
    let showTimeout = null;
    let hideTimeout = null;
	
	// 资源类型图标映射
    const resourceIcons = {
        'magnet': '🧲', 
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
        return 'default';
    }

    // 创建按钮
    function createButton(url, text, link) {
        const button = document.createElement('button');
		const linkType = getLinkType(url);
        const icon = resourceIcons[linkType] || resourceIcons.default;
        button.innerHTML = `${icon} 推送到qb`;
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
        `;

        // 点击反馈
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 保存原始状态以便恢复
            const originalText = button.textContent;
            const originalBg = button.style.backgroundColor;
            const originalDisabled = button.disabled;
            
            // 更新按钮状态为"正在推送"
            button.textContent = '⏳ 推送中...';
            button.style.backgroundColor = '#ffc107'; // 黄色表示进行中
            button.style.cursor = 'wait';
            
            // 推送到qBittorrent
            addToQbittorrent(url, text, (success, message) => {
                if (success) {
                    // 推送成功
                    button.textContent = '✅ 已推送';
                    button.style.backgroundColor = '#28a745'; // 绿色表示成功
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
//                        text: `资源已添加到qBittorrent下载队列`,
//                        timeout: 3000
//                    });					
                } else {
                    // 推送失败 - 恢复按钮状态并显示错误
                    button.textContent = originalText;
                    button.style.backgroundColor = originalBg;
                    button.disabled = originalDisabled;
                    
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
                if (currentButton && currentButton.textContent !== '✓ 已推送') {
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

    // 设置链接监听
    function setupLinkListeners() {
        // 只监听磁力链接
        const selectors = [
            'a[href^="magnet:?xt=urn:btih:"]'
        ];

        const links = document.querySelectorAll(selectors.join(','));
        links.forEach(link => {
            if (link.dataset.qbAdded) return;
            link.dataset.qbAdded = 'true';

            // 鼠标进入链接 → 显示按钮
            link.addEventListener('mouseenter', () => {
                showButtonAboveLink(link);
            });

            // 鼠标离开链接 → 延迟隐藏按钮
            link.addEventListener('mouseleave', () => {
                if (currentButton) {
                    hideTimeout = setTimeout(() => {
                        // 只有非"已推送"状态才隐藏
                        if (currentButton && currentButton.textContent !== '✓ 已推送') {
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

    // 推送到 qBittorrent（带登录）并添加回调处理
    function addToQbittorrent(url, description = '', callback) {
        console.log('🔗 正在推送链接到 qBittorrent:', url);

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
                    console.log('✅ 登录成功');

                    // 第二步：使用 Cookie 推送任务
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
                            if (res.status === 200 || res.status === 201) {
                                console.log('✅ 成功添加到 qBittorrent');
                                callback(true, '添加成功');
                            } else {
                                console.error('❌ 添加任务失败:', res);
                                callback(false, `服务器错误: ${res.status} ${res.statusText}`);
                            }
                        },
                        onerror: function (err) {
                            console.error('❌ 请求失败（添加任务）:', err);
                            callback(false, `网络错误: ${err.status} ${err.statusText}`);
                        }
                    });
                } else {
                    console.error('❌ 登录失败:', response);
                    callback(false, '登录失败，请检查用户名密码或 Web UI 设置');
                }
            },
            onerror: function (err) {
                console.error('❌ 登录请求失败:', err);
                callback(false, `登录请求失败: ${err.status} ${err.statusText}`);
            }
        });
    }

    // 页面加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();