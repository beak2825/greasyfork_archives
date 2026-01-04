// ==UserScript==
// @name         Twitter DM Cleaner
// @homepage     https://github.com/daymade/Twitter-DM-Cleaner
// @namespace    https://greasyfork.org/users/1121182
// @version      0.7.1
// @author       daymade
// @license      MIT
// @description  One-click remove all the potential harassment spams in twitter's direct messages area.
// @description:zh-CN 在Twitter私信中识别并高亮显示可能的骚扰信息，一键批量删除这些对话。
// @match        https://x.com/*
// @match        https://x.com/messages
// @match        https://x.com/messages/*
// @match        https://x.com/messages/requests
// @match        https://x.com/messages/requests/additional
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/500816/Twitter%20DM%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/500816/Twitter%20DM%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;

    // [新增] 对 pushState / replaceState 做一层包裹，派发事件便于脚本捕获 SPA 路由切换
    const _wrapHistory = (type) => {
        const orig = history[type];
        return function() {
            const result = orig.apply(this, arguments);
            window.dispatchEvent(new Event(type.toLowerCase()));
            return result;
        };
    };
    history.pushState = _wrapHistory('pushState');
    history.replaceState = _wrapHistory('replaceState');

    // 添加 Tampermonkey 菜单选项
    GM_registerMenuCommand("批量删除私信", batchDeleteMessages);
    GM_registerMenuCommand("批量删除骚扰私信", batchDeleteHarassmentMessages);

    // 批量删除私信：选择删除私信的数量
    async function batchDeleteMessages() {
        if (!isMessagePage()) {
            alert("请在私信列表页面使用此功能（不是私信请求）");
            return;
        }

        const conversations = document.querySelectorAll('[data-testid="conversation"]');
        const conversationCount = conversations.length;
        const confirmed = confirm(`一共有 ${conversationCount} 条私信。请你选择要删除多少条，点击"确定"提供数量，点击"取消"不会执行任何操作`);

        if (confirmed) {
            const deleteCount = getDeleteCount();
            if (deleteCount !== null) {
                await bulkDeleteMessages(deleteCount);
            }
        }
    }

    // 批量删除私信
    async function bulkDeleteMessages(deleteCount) {
        const conversations = document.querySelectorAll('[data-testid="conversation"]');
        let deletedCount = 0;
        let totalCount = Math.min(deleteCount, conversations.length);

        const progressIndicator = createProgressIndicator(totalCount);
        document.body.appendChild(progressIndicator);

        for (const conversation of conversations) {
            if (deletedCount < deleteCount) {
                try {
                    await deleteConversation(conversation);
                    deletedCount++;
                    updateProgressIndicator(progressIndicator, deletedCount, totalCount);
                } catch (error) {
                    console.error('删除对话时出错:', error);
                }
            } else {
                break;
            }
        }

        // 确保进度条显示最终状态
        updateProgressIndicator(progressIndicator, deletedCount, totalCount);

        // 延迟移除进度条和显示结果，以便用户能看到最终进度
        setTimeout(() => {
            document.body.removeChild(progressIndicator);
            alert(`已成功删除 ${deletedCount} 条私信。`);
        }, 1000); // 延迟1秒
    }

    // 批量删除骚扰私信：选择删除数量
    async function batchDeleteHarassmentMessages() {
        if (!isMessageRequestsPage()) {
            alert("请在**私信请求**的列表页使用此功能，地址栏是 /messages/requests，不是**私信**列表页");
            return;
        }

        const highlightedConversations = document.querySelectorAll('[data-testid="conversation"][data-highlighted="true"]');
        const highlightedCount = highlightedConversations.length;
        const confirmed = confirm(`检测到 ${highlightedCount} 条已标记为骚扰的消息。是否批量删除？`);

        if (confirmed) {
            const deleteCount = getDeleteCount();
            if (deleteCount !== null) {
                await bulkDeleteHarassmentMessages(deleteCount);
            }
        }
    }

    async function bulkDeleteHarassmentMessages(deleteCount) {
        const conversations = document.querySelectorAll('[data-testid="conversation"][data-highlighted="true"]');
        let deletedCount = 0;
        let totalCount = Math.min(deleteCount, conversations.length);

        const progressIndicator = createProgressIndicator(totalCount);
        document.body.appendChild(progressIndicator);

        for (const conversation of conversations) {
            if (deletedCount < deleteCount) {
                try {
                    await deleteConversation(conversation);
                    deletedCount++;
                    updateProgressIndicator(progressIndicator, deletedCount, totalCount);
                } catch (error) {
                    console.error('删除骚扰消息时出错:', error);
                }
            } else {
                break;
            }
        }

        // 确保进度条显示最终状态
        updateProgressIndicator(progressIndicator, deletedCount, totalCount);

        // 延迟移除进度条和显示结果，以便用户能看到最终进度
        setTimeout(() => {
            document.body.removeChild(progressIndicator);
            alert(`已成功删除 ${deletedCount} 条骚扰消息。`);
        }, 1000); // 延迟1秒
    }

    // 判断是否为潜在骚扰消息
    function isPotentialHarassment(screenname) {
        if (isInWhitelist(screenname)) {
            return false;
        }

        // 移除 @ 符号
        screenname = screenname.replace('@', '');

        const totalLength = screenname.length;
        const digitCount = (screenname.match(/\d/g) || []).length;
        const letterCount = (screenname.match(/[a-zA-Z]/g) || []).length;
        const specialCharCount = totalLength - digitCount - letterCount;

        // 计算各种字符的比例
        const digitRatio = digitCount / totalLength;
        const letterRatio = letterCount / totalLength;
        const specialCharRatio = specialCharCount / totalLength;

        // 检查是否存在连续的数字
        const hasConsecutiveDigits = /\d{4,}/.test(screenname);

        // 检查是否存在年份样式的数字（如2020, 2021等）
        const hasYearLikeNumber = /(?:19|20)\d{2}/.test(screenname);

        // 检查是否存在过多的大写字母
        const uppercaseRatio = (screenname.match(/[A-Z]/g) || []).length / letterCount;

        // 评分系统
        let score = 0;

        if (digitRatio > 0.3) score += 2;
        if (specialCharRatio > 0.1) score += 1;
        if (hasConsecutiveDigits) score += 2;
        if (hasYearLikeNumber) score -= 1;
        if (uppercaseRatio > 0.5) score += 1;
        if (totalLength > 15) score += 1;

        // 如果用户名中包含常见的名字，减少分数
        const commonNames = ['peter', 'lin', 'andrew', 'adams', 'ollie', 'denise', 'nahum'];
        if (commonNames.some(name => screenname.toLowerCase().includes(name))) {
            score -= 1;
        }

        return score >= 3;
    }

    // 高亮潜在骚扰消息
    function highlightHarassmentMessages() {
        const conversations = document.querySelectorAll('[data-testid="conversation"]');

        conversations.forEach(conversation => {
            const textElements = conversation.querySelectorAll('div[dir="ltr"]');
            const messageElement = conversation.querySelector('span[data-testid="tweetText"]');

            if (textElements.length >= 3) {
                const name = textElements[0].textContent.trim();
                const screenName = textElements[2].textContent.trim().replace('@', '');
                const message = messageElement?.textContent.trim() || 'non-text-message';

                // 避免重复高亮
                if (conversation.dataset.highlighted) return;

                // 判断是否为潜在骚扰消息
                const isHarassment = isPotentialHarassment(screenName);
                console.log(`User: ${name}, Screen name: ${screenName}, Message: ${message}, IsHarassment: ${isHarassment}`);

                if (isHarassment) {
                    console.log(`Highlighting conversation for user ${name} because screenname "${screenName}" is all lowercase.`);
                    conversation.style.opacity = '0.2';
                    conversation.style.backgroundColor = '#f0f0f0';
                    conversation.dataset.highlighted = 'true'; // 标记为已高亮

                    // 添加白名单按钮
                    const whitelistButton = document.createElement('button');
                    whitelistButton.textContent = "添加到白名单";
                    whitelistButton.style.marginRight = "10px";
                    whitelistButton.style.width = "106px";
                    whitelistButton.onclick = () => {
                        addToWhitelist(screenName);
                        conversation.style.opacity = '1';
                        conversation.style.backgroundColor = '';
                        conversation.dataset.highlighted = '';
                    };
                    conversation.appendChild(whitelistButton);
                }
            } else {
                console.log("Skipping conversation due to insufficient text elements or missing message element.");
            }
        });
    }

    // 删除私信
    function deleteConversation(conversation) {
        return new Promise((resolve, reject) => {
            const TIMEOUT = 10000; // 增加超时时间到 10 秒
            let optionsButton;
            const isRequestPage = isMessageRequestsPage();

            if (isRequestPage) {
                optionsButton = conversation.querySelector('button[aria-label="Options menu"], button[aria-label="选项菜单"]');
            } else {
                optionsButton = conversation.querySelector('button[aria-label="More"], button[aria-label="更多"]');
            }

            if (!optionsButton) {
                return reject(new Error('未找到选项按钮'));
            }

            const cleanup = () => {
                if (deleteButtonObserver) deleteButtonObserver.disconnect();
                if (!isRequestPage && confirmButtonObserver) confirmButtonObserver.disconnect();
                clearTimeout(timeoutId);
            };

            const timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error('操作超时'));
            }, TIMEOUT);

            let deleteButtonObserver;
            let confirmButtonObserver;

            const findAndClickDeleteButton = () => {
                const deleteButtons = Array.from(document.querySelectorAll('div[role="menuitem"]'));
                const deleteButton = deleteButtons.find(item =>
                    item.textContent.includes('Delete conversation') ||
                    item.textContent.includes('删除对话')
                );

                if (deleteButton) {
                    console.log('找到删除按钮，尝试点击');
                    deleteButton.click();
                    if (isRequestPage) {
                        cleanup();
                        resolve();
                    } else {
                        observeConfirmButton();
                    }
                } else {
                    console.log('未找到删除按钮，继续观察');
                }
            };

            const observeConfirmButton = () => {
                confirmButtonObserver = new MutationObserver((mutations, observer) => {
                    const confirmButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
                    if (confirmButton) {
                        observer.disconnect();
                        setTimeout(() => {
                            try {
                                confirmButton.click();
                                cleanup();
                                resolve();
                            } catch (error) {
                                cleanup();
                                reject(new Error('点击确认按钮时出错'));
                            }
                        }, 100);
                    }
                });

                confirmButtonObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            };

            try {
                console.log('点击选项按钮');
                optionsButton.click();
                setTimeout(() => {
                    deleteButtonObserver = new MutationObserver((mutations, observer) => {
                        findAndClickDeleteButton();
                    });
                    deleteButtonObserver.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                    findAndClickDeleteButton(); // 立即尝试查找并点击删除按钮
                }, 500); // 给予一些时间让菜单打开
            } catch (error) {
                cleanup();
                reject(new Error('点击选项按钮时出错'));
            }
        });
    }

    // 白名单存储
    const WHITELIST_STORAGE_KEY = 'harassmentWhitelist';

    // 初始化或获取白名单
    function getWhitelist() {
        return GM_getValue(WHITELIST_STORAGE_KEY, []);
    }

    // 添加用户到白名单
    function addToWhitelist(screenname) {
        const whitelist = getWhitelist();
        if (!whitelist.includes(screenname)) {
            whitelist.push(screenname);
            GM_setValue(WHITELIST_STORAGE_KEY, whitelist);
        }
    }

    // 判断是否在白名单中
    function isInWhitelist(screenname) {
        const whitelist = getWhitelist();
        return whitelist.includes(screenname);
    }

    // 创建进度指示器
    function createProgressIndicator(total) {
        const indicator = document.createElement('div');
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.right = '10px';
        indicator.style.padding = '10px';
        indicator.style.backgroundColor = 'rgba(29, 161, 242, 0.9)'; // Twitter 蓝色
        indicator.style.color = 'white';
        indicator.style.borderRadius = '5px';
        indicator.style.zIndex = '9999';
        indicator.style.fontWeight = 'bold';
        indicator.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        indicator.textContent = `进度: 0 / ${total}`;
        return indicator;
    }

    // 更新进度指示器
    function updateProgressIndicator(indicator, current, total) {
        indicator.textContent = `进度: ${current} / ${total}`;
        const percentage = (current / total) * 100;
        indicator.style.background = `linear-gradient(to right, rgba(29, 161, 242, 0.9) ${percentage}%, rgba(29, 161, 242, 0.5) ${percentage}%)`;
    }

    // 判断当前是否在私信列表页面
    function isMessagePage() {
        // 私信列表的 url 是 `/messages`, 点开某条私信的 url 是 `/messages/114514`
        // 这里加一个排除 /messages/requests
        return window.location.pathname.startsWith('/messages')
            && !window.location.pathname.includes('/requests');
    }

    // 判断当前是否在私信请求列表的页面
    function isMessageRequestsPage() {
        // 私信请求列表的 url 是 `/messages/requests`
        // 点开更多可能包含冒犯的 url 是 `/messages/requests/additional`
        return window.location.pathname.endsWith('/messages/requests')
            || window.location.pathname.endsWith('/messages/requests/additional');
    }

    // 获取用户选择的删除数量
    function getDeleteCount() {
        const deleteChoice = prompt("选择要删除的消息数量：1, 10, 或 全部", "全部");
        if (deleteChoice === "1") return 1;
        if (deleteChoice === "10") return 10;
        if (deleteChoice.toLowerCase() === "全部") return Infinity;
        alert("无效的输入，操作取消。");
        return null;
    }

    // 监听页面变化，能高亮新收到的私信
    function observePageChanges() {
        if (isMessagePage() || isMessageRequestsPage()) {
            // 如果 observer 已经存在，先断开再重新观察，避免重复
            if (observer) {
                observer.disconnect();
            }

            observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'childList') {
                        highlightHarassmentMessages();
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // 初始化
    function init() {
        if (isMessagePage() || isMessageRequestsPage()) {
            highlightHarassmentMessages();
            observePageChanges();
        }
    }

    // 处理页面切换
    function handlePageChange() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        // [新增] 加入短暂延时，让 DOM 更新完成
        setTimeout(() => {
            init();
        }, 500);
    }

    // 监听页面变化
    window.addEventListener('popstate', handlePageChange);
    window.addEventListener('pushstate', handlePageChange);
    window.addEventListener('replacestate', handlePageChange);

    // 等待页面加载完成后执行
    window.addEventListener('load', () => {
        if (isMessagePage() || isMessageRequestsPage()) {
            init();
        }
    });
})();