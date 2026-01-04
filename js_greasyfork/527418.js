// ==UserScript==
// @name         新浪投诉网站Cookie获取和维持
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取并维持新浪投诉网站的cookie有效性
// @author       Crazyuncle
// @match        https://tousu.sina.com.cn/user/view
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527418/%E6%96%B0%E6%B5%AA%E6%8A%95%E8%AF%89%E7%BD%91%E7%AB%99Cookie%E8%8E%B7%E5%8F%96%E5%92%8C%E7%BB%B4%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/527418/%E6%96%B0%E6%B5%AA%E6%8A%95%E8%AF%89%E7%BD%91%E7%AB%99Cookie%E8%8E%B7%E5%8F%96%E5%92%8C%E7%BB%B4%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 定期刷新页面来保持cookie活性
     * @param {number} interval - 刷新间隔，单位分钟
     */
    function keepCookieAlive(interval = 20) {
        // 保存上次刷新时间
        const lastRefresh = GM_getValue('last_refresh');
        const now = Date.now();

        if (!lastRefresh || (now - lastRefresh) > interval * 60 * 1000) {
            // 保存当前时间
            GM_setValue('last_refresh', now);
            // 刷新页面
            window.location.reload();
        }

        // 设置下次刷新
        setTimeout(() => {
            keepCookieAlive(interval);
        }, interval * 60 * 1000);
    }

    /**
     * 保存cookie到本地存储
     * @param {string} cookies - cookie字符串
     */
    function saveCookies(cookies) {
        GM_setValue('sina_cookies', {
            value: cookies,
            timestamp: Date.now()
        });
    }

    /**
     * 从本地存储获取cookie
     * @returns {string|null} cookie字符串或null
     */
    function getSavedCookies() {
        const saved = GM_getValue('sina_cookies');
        if (saved && (Date.now() - saved.timestamp) < 24 * 60 * 60 * 1000) { // 24小时内的cookie
            return saved.value;
        }
        return null;
    }

    /**
     * 获取当前网站的所有cookie
     * @returns {Promise<string>} 返回cookie字符串
     */
    function getCookies() {
        return new Promise((resolve) => {
            // 存储所有找到的cookie
            let allCookies = new Set();

            // 添加当前document.cookie
            document.cookie.split(';').forEach(cookie => {
                allCookies.add(cookie.trim());
            });

            // 监听所有的网络请求
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
                this.addEventListener('load', function() {
                    try {
                        const respCookies = this.getAllResponseHeaders()
                            .split('\n')
                            .filter(header => header.toLowerCase().includes('cookie'))
                            .map(cookie => cookie.split(':')[1].trim());

                        respCookies.forEach(cookie => allCookies.add(cookie));
                    } catch(e) {
                        console.error('获取cookie时出错:', e);
                    }
                });
                originalOpen.apply(this, arguments);
            };

            // 监听页面变化
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'SCRIPT' || node.nodeName === 'IMG') {
                                try {
                                    fetch(node.src, {
                                        credentials: 'include'
                                    }).then(response => {
                                        const cookies = response.headers.get('set-cookie');
                                        if (cookies) {
                                            cookies.split(';').forEach(cookie => {
                                                allCookies.add(cookie.trim());
                                            });
                                        }
                                    });
                                } catch(e) {
                                    console.error('获取资源cookie时出错:', e);
                                }
                            }
                        });
                    }
                });
            });

            // 开始监听页面变化
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });

            // 主动触发一些请求
            fetch('https://tousu.sina.com.cn/user/view', {
                credentials: 'include'
            });

            // 等待一定时间后返回收集到的所有cookie
            setTimeout(() => {
                observer.disconnect();
                const finalCookies = Array.from(allCookies)
                    .filter(cookie => cookie.length > 0)
                    .join('; ');
                resolve(finalCookies);
            }, 3000);
        });
    }

    /**
     * 创建控制面板
     */
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;

        // 自动刷新开关
        const autoRefreshToggle = document.createElement('input');
        autoRefreshToggle.type = 'checkbox';
        autoRefreshToggle.id = 'autoRefresh';
        autoRefreshToggle.checked = GM_getValue('auto_refresh', false);

        const label = document.createElement('label');
        label.htmlFor = 'autoRefresh';
        label.innerHTML = '自动刷新页面（每20分钟）';

        // 状态显示
        const status = document.createElement('div');
        status.style.marginTop = '5px';
        status.style.fontSize = '12px';
        status.style.color = '#666';

        // 显示上次刷新时间
        const lastRefresh = GM_getValue('last_refresh');
        if (lastRefresh) {
            status.innerHTML = `上次刷新: ${new Date(lastRefresh).toLocaleString()}`;
        }

        panel.appendChild(autoRefreshToggle);
        panel.appendChild(label);
        panel.appendChild(status);
        document.body.appendChild(panel);

        // 事件处理
        autoRefreshToggle.addEventListener('change', (e) => {
            GM_setValue('auto_refresh', e.target.checked);
            if (e.target.checked) {
                keepCookieAlive();
                status.innerHTML = `自动刷新已开启<br>下次刷新: ${new Date(Date.now() + 20 * 60 * 1000).toLocaleString()}`;
                GM_notification({
                    text: '自动刷新已开启，页面将每20分钟刷新一次',
                    title: '自动刷新',
                    timeout: 3000
                });
            } else {
                status.innerHTML = '自动刷新已关闭';
            }
        });

        // 如果之前开启了自动刷新，则自动启动
        if (autoRefreshToggle.checked) {
            keepCookieAlive();
            status.innerHTML = `自动刷新已开启<br>下次刷新: ${new Date(Date.now() + 20 * 60 * 1000).toLocaleString()}`;
        }
    }

    // 初始化
    createControlPanel();
})();
