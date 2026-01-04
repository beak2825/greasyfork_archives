// ==UserScript==
// @name         雪球黑名单
// @namespace    https://xueqiu.com/
// @version      2.7
// @description  右键点击用户名后，立即隐藏当前帖子或评论并拉黑该用户，保存拉黑记录；同时取消鼠标悬停时显示用户信息的功能。
// @author       AI
// @match        https://xueqiu.com/S/*
// @match        https://xueqiu.com/1*
// @match        https://xueqiu.com/2*
// @match        https://xueqiu.com/3*
// @match        https://xueqiu.com/4*
// @match        https://xueqiu.com/5*
// @match        https://xueqiu.com/6*
// @match        https://xueqiu.com/7*
// @match        https://xueqiu.com/8*
// @match        https://xueqiu.com/9*
// @match        https://xueqiu.com/0*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529672/%E9%9B%AA%E7%90%83%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529672/%E9%9B%AA%E7%90%83%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 阻止鼠标悬停时触发用户信息弹窗
    document.addEventListener('mouseover', function(event) {
        if (event.target && event.target.classList.contains('user-name')) {
            event.stopPropagation();
        }
    }, true);

    // 初始化已拉黑用户列表
    let blockedUsers = GM_getValue('blockedUsers', []) || [];

    // 监听右键菜单事件，仅针对用户名元素
    document.addEventListener('contextmenu', function(event) {
        const target = event.target;

        if (target && target.classList.contains('user-name')) {
            event.preventDefault();

            const existingMenu = document.getElementById('customUserMenu');
            if (existingMenu) {
                existingMenu.remove();
            }

            const username = target.textContent.trim();
            const userId = target.getAttribute('data-tooltip') || target.getAttribute('href')?.split('/')[1];

            if (!userId) {
                return;
            }

            const commentItem = target.closest('.comment__item');

            const menu = document.createElement('div');
            menu.id = 'customUserMenu';
            menu.style.position = 'absolute';
            menu.style.top = `${event.clientY + window.scrollY}px`;
            menu.style.left = `${event.clientX + window.scrollX}px`;
            menu.style.backgroundColor = '#fff';
            menu.style.border = '1px solid #ccc';
            menu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
            menu.style.zIndex = '9999';
            menu.style.padding = '8px';
            menu.style.cursor = 'pointer';
            menu.textContent = `拉黑 "${username}"`;

            menu.addEventListener('click', function() {
                blockUser(userId, username);
                if (commentItem) {
                    commentItem.style.display = 'none';
                } else {
                    hideCurrentPost(target);
                    hideUserComments(username);
                }
                menu.remove();
            });

            document.body.appendChild(menu);

            function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    if (menu.parentNode) {
                        menu.remove();
                    }
                    document.removeEventListener('click', closeMenu);
                }
            }
            document.addEventListener('click', closeMenu);
        } else {
            const existingMenu = document.getElementById('customUserMenu');
            if (existingMenu) {
                existingMenu.remove();
            }
        }
    });

    // 从当前页面尝试提取 md5__1038
    function getPageMd5_1038() {
        const urlParams = new URLSearchParams(window.location.search);
        let md5Value = urlParams.get('md5__1038');
        if (md5Value) {
            return md5Value;
        }

        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            const match = script.textContent.match(/md5__1038\s*[:=]\s*['"]([^'"]+)['"]/);
            if (match) {
                return match[1];
            }
        }
        return null;
    }

    // 获取动态 md5__1038 参数
    function fetchMd5_1038(userId, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://xueqiu.com/u/${userId}`,
            headers: {
                'Cookie': document.cookie,
                'User-Agent': navigator.userAgent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': navigator.language,
                'Referer': 'https://xueqiu.com/'
            },
            timeout: 10000,
            onload: function(response) {
                let md5Value = null;

                // 尝试从最终 URL 中提取 md5__1038
                const urlMatch = response.finalUrl.match(/md5__1038=([^&]+)/);
                if (urlMatch) {
                    md5Value = decodeURIComponent(urlMatch[1]);
                }

                // 如果没有找到，尝试解析 HTML 中的脚本
                if (!md5Value) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const scripts = doc.querySelectorAll('script');
                    for (let script of scripts) {
                        const match = script.textContent.match(/md5__1038\s*[:=]\s*['"]([^'"]+)['"]/);
                        if (match) {
                            md5Value = match[1];
                            break;
                        }
                    }
                }

                // 如果主页无 md5__1038，尝试当前页面
                if (!md5Value) {
                    md5Value = getPageMd5_1038();
                }

                callback(md5Value);
            },
            onerror: function() {
                callback(getPageMd5_1038());
            },
            ontimeout: function() {
                callback(getPageMd5_1038());
            }
        });
    }

    // 拉黑用户函数
    function blockUser(userId, username) {
        fetchMd5_1038(userId, function(md5Value) {
            if (!md5Value) {
                return;
            }

            const params = new URLSearchParams();
            params.append('md5__1038', md5Value);
            params.append('user_id', userId);

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://xueqiu.com/blocks/create.json',
                data: params.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': document.cookie,
                    'Referer': `https://xueqiu.com/u/${userId}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    'User-Agent': navigator.userAgent,
                    'Accept': '*/*',
                    'Accept-Language': navigator.language,
                    'Origin': 'https://xueqiu.com',
                    'Connection': 'keep-alive'
                },
                timeout: 10000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.success) {
                            if (!blockedUsers.includes(username)) {
                                blockedUsers.push(username);
                                GM_setValue('blockedUsers', blockedUsers);
                            }
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            });
        });
    }

    // 隐藏主贴
    function hideCurrentPost(target) {
        const post = target.closest('article');
        if (post) {
            post.style.display = 'none';
        }
    }

    // 隐藏评论
    function hideUserComments(username) {
        const comments = document.querySelectorAll('.comment__item');
        comments.forEach(comment => {
            const userLink = comment.querySelector('.user-name');
            if (userLink && userLink.textContent.trim() === username) {
                comment.style.display = 'none';
            }
        });
    }
})();