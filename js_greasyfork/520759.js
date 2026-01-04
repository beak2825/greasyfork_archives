// ==UserScript==
// @name         NodeSeek/DeepFlood 全部已读增强版
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  一键标记 NodeSeek/DeepFlood 所有通知为已读,支持自定义功能。功能包括:三页全部已读、无弹窗提示、自动跳转到未读消息列表等
// @author       wzsxh
// @match        https://www.nodeseek.com/notification*
// @match        https://www.deepflood.com/notification*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @supportURL   https://www.nodeseek.com/space/9074#/general
// @downloadURL https://update.greasyfork.org/scripts/520759/NodeSeekDeepFlood%20%E5%85%A8%E9%83%A8%E5%B7%B2%E8%AF%BB%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/520759/NodeSeekDeepFlood%20%E5%85%A8%E9%83%A8%E5%B7%B2%E8%AF%BB%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认设置
    const defaultSettings = {
        enableTripleRead: true,    // 启用三页全部已读
        enableNoPrompt: true,      // 启用原有已读功能不弹窗
        enableAutoRedirect: true,  // 启用自动跳转到未读消息列表
        disableOriginal: false,    // 禁用原有已读功能
    };

    // 获取当前域名
    const currentDomain = window.location.hostname;
    
    // 获取设置
    let settings = Object.assign({}, defaultSettings, GM_getValue(`${currentDomain}_settings`, {}));

    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand(`${settings.enableTripleRead ? '✅' : '❌'} 三页全部已读功能`, () => {
            settings.enableTripleRead = !settings.enableTripleRead;
            GM_setValue(`${currentDomain}_settings`, settings);
            location.reload();
        });

        GM_registerMenuCommand(`${settings.enableNoPrompt ? '✅' : '❌'} 原有已读功能不弹窗`, () => {
            settings.enableNoPrompt = !settings.enableNoPrompt;
            GM_setValue(`${currentDomain}_settings`, settings);
            location.reload();
        });
        
        GM_registerMenuCommand(`${settings.enableAutoRedirect ? '✅' : '❌'} 自动跳转到未读列表`, () => {
            settings.enableAutoRedirect = !settings.enableAutoRedirect;
            GM_setValue(`${currentDomain}_settings`, settings);
            location.reload();
        });

        GM_registerMenuCommand(`${settings.disableOriginal ? '✅' : '❌'} 禁用原有已读功能`, () => {
            settings.disableOriginal = !settings.disableOriginal;
            GM_setValue(`${currentDomain}_settings`, settings);
            location.reload();
        });

    }

    window.addEventListener('load', () => {
        // 注册菜单
        registerMenuCommands();

        // 根据当前域名动态配置API URL
        const apiUrls = {
            'atMe': `https://${currentDomain}/api/notification/at-me/markViewed?all=true`,
            'reply': `https://${currentDomain}/api/notification/reply-to-me/markViewed?all=true`,
            'message': `https://${currentDomain}/api/notification/message/markViewed?all=true`
        };

        // 创建统一的标记已读函数
        async function markAsRead(button, originalText, urls, removeAllUnread = true) {
            const originalBgColor = button.style.backgroundColor;
            
            try {
                button.innerHTML = '处理中...';
                button.style.backgroundColor = '#52c41a';

                const responses = await Promise.all(urls.map(url =>
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                ));

                const allSuccess = responses.every(res => res.success === true);

                if (allSuccess) {
                    button.innerHTML = '已完成';
                    const listItems = document.querySelectorAll('.ant-list-item');
                    listItems.forEach(item => item.style.display = 'none');

                    // 移除全部未读数字
                    if (removeAllUnread) {
                        const unreadCounts = document.querySelectorAll('span.unread-count');
                        unreadCounts.forEach(unreadCount => unreadCount.remove());
                    } else {
                        // 移除当前页面的未读数字
                        const hash = window.location.hash;
                        let currentSpan;
                        if (hash.includes('/atMe')) {
                            currentSpan = `a[href="#/atMe"] span.unread-count`;
                        } else if (hash.includes('/reply')) {
                            currentSpan = `a[href="#/reply"] span.unread-count`;
                        } else if (hash.includes('/message')) {
                            currentSpan = `a[href^="#/message"] span.unread-count`;
                        }
                        const currentPageUnreadCount = document.querySelector(currentSpan);
                        if (currentPageUnreadCount) {
                            currentPageUnreadCount.remove();
                        }
                    }
                } else {
                    throw new Error('部分请求失败');
                }

            } catch (error) {
                console.error('标记已读失败:', error);
                button.innerHTML = '失败';
                button.style.backgroundColor = '#ff4d4f';
            } finally {
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.backgroundColor = originalBgColor;
                }, 1000);
            }
        }

        // 仅在启用三页全部已读功能时创建按钮
        if (settings.enableTripleRead) {
            const button = document.createElement('button');
            // 根据设备类型设置不同的按钮文字
            const buttonText = window.matchMedia('(max-width: 768px)').matches ? '三页已读' : '三页全部已读';
            button.innerHTML = buttonText;
            
            // 基础样式
            const baseStyle = `
               
                background-color: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 900;
                transition: all 0.3s;
            `;
            
            // 使用媒体查询区分手机端和桌面端
            if (window.matchMedia('(max-width: 768px)').matches) {
                // 手机端样式
                button.style.cssText = `
                    ${baseStyle}
                    padding: 6px 10px;
                    margin: 0 5px;
                    font-size: 14px;
                `;
            } else {
                // 桌面端样式
                button.style.cssText = `
                    ${baseStyle}
                    padding: 6px 12px;
                    margin: 0 20px;
                    font-size: 16px;
                `;
            }

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#40a9ff';
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#1890ff';
            });

            button.addEventListener('click', () => {
                const urls = Object.values(apiUrls);
                markAsRead(button, buttonText, urls);
            });

            const appSwitch = document.querySelector('.app-switch');
            if (appSwitch) {
                appSwitch.appendChild(button);
            }
        }

        // 处理原有的单个已读按钮
        function handleOriginalButtons() {
            const originalReadButtons = document.querySelectorAll('button.btn');
            originalReadButtons.forEach(btn => {
                if (btn.textContent.includes('全部标为已读')) {
                    if (settings.disableOriginal) {
                        btn.style.display = 'none';
                        return;
                    }

                    // 在手机端修改按钮文字
                    if (window.matchMedia('(max-width: 768px)').matches) {
                        btn.textContent = '已读';
                    }

                    if (settings.enableNoPrompt) {
                        const newBtn = btn.cloneNode(true);
                        newBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const hash = window.location.hash;
                            let apiUrl;
                            if (hash.includes('/atMe')) {
                                apiUrl = apiUrls.atMe;
                            } else if (hash.includes('/reply')) {
                                apiUrl = apiUrls.reply;
                            } else if (hash.includes('/message')) {
                                apiUrl = apiUrls.message;
                            }

                            if (apiUrl) {
                                markAsRead(newBtn, newBtn.textContent, [apiUrl], false);
                            }
                        });

                        btn.replaceWith(newBtn);
                    }
                }
            });
        }

        function checkAndHandleButtons() {
            const checkInterval = setInterval(() => {
                const buttons = document.querySelectorAll('button.btn');
                if (buttons.length > 0) {
                    handleOriginalButtons();
                    clearInterval(checkInterval);
                }
            }, 500);

            setTimeout(() => clearInterval(checkInterval), 30000);
        }

        // 检查未读消息，跳转到未读消息页面
        function checkAndRedirectUnread() {
            if (!settings.enableAutoRedirect) return; // 如果功能未启用，直接返回
            
            const currentHash = window.location.hash;
            const routes = [
                '#/atMe',
                '#/reply',
                '#/message'
            ];
            
            // 获取当前路由对应的索引
            const currentIndex = routes.findIndex(route => 
                currentHash.startsWith(route)
            );
            
            if (currentIndex === -1) return;

            // 首先检查当前页面是否有未读
            const currentLink = `a[href^="${routes[currentIndex]}"]`;
            const currentUnread = document.querySelector(`${currentLink} span.unread-count`);
            if (currentUnread) return;

            // 按顺序检查其他页面
            for (let i = 0; i < routes.length; i++) {
                if (i === currentIndex) continue;
                
                const link = document.querySelector(`a[href^="${routes[i]}"]`);
                const hasUnread = link?.querySelector('span.unread-count');
                
                if (hasUnread) {
                    link.click();
                    break;
                }
            }
        }

        // 在页面加载时检查一次
        checkAndRedirectUnread();
        checkAndHandleButtons();
        
        // 监听路由变化，并在路由变化时检查按钮
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => {
                    checkAndHandleButtons();
                }, 100);
            }
        }).observe(document, {subtree: true, childList: true});

        
    });
})();