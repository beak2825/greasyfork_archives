// ==UserScript==
// @name         Multi-site Chat Manager
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Manage chats across different platforms (GitHub Copilot, Flomo, Doubao)
// @author       Your name
// @match        https://github.com/copilot*
// @match        https://v.flomoapp.com/mine
// @match        https://www.doubao.com/chat/thread/list*
// @icon         https://v.flomoapp.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512010/Multi-site%20Chat%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/512010/Multi-site%20Chat%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Common styles for buttons
    const buttonStyles = {
        base: {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            margin: '5px'
        },
        green: {
            backgroundColor: '#2ea44f',
            '&:hover': {
                backgroundColor: '#2c974b'
            }
        },
        red: {
            backgroundColor: '#d73a49',
            '&:hover': {
                backgroundColor: '#cb2431'
            }
        }
    };

    // Apply styles to button
    function applyButtonStyles(button, type = 'base') {
        Object.assign(button.style, buttonStyles.base);
        if (type === 'green') {
            Object.assign(button.style, buttonStyles.green);
        } else if (type === 'red') {
            Object.assign(button.style, buttonStyles.red);
        }

        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-1px)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    }

    // Site configurations
    const siteConfigs = {
        'github.com': {
            init: function() {
                this.waitForChatList();
            },

            waitForChatList: function() {
                const observer = new MutationObserver((mutations, obs) => {
                    if (document.querySelector('.ConversationList-module__ConversationList__item--dD6z4')) {
                        this.addButtons();
                        obs.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            },

            addButtons: function() {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.position = 'fixed';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.left = '20px';
                buttonContainer.style.zIndex = '9999';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'column';
                buttonContainer.style.gap = '10px';

                const openChatsButton = document.createElement('button');
                openChatsButton.textContent = '打开chat';
                applyButtonStyles(openChatsButton, 'green');

                const clearChatsButton = document.createElement('button');
                clearChatsButton.textContent = '清空chat';
                applyButtonStyles(clearChatsButton, 'red');

                buttonContainer.appendChild(openChatsButton);
                buttonContainer.appendChild(clearChatsButton);
                document.body.appendChild(buttonContainer);

                openChatsButton.addEventListener('click', this.openAllChats);
                clearChatsButton.addEventListener('click', this.clearAllChats);
            },

            openAllChats: function() {
                const chatLinks = document.querySelectorAll('.ConversationList-module__ConversationList__link--Byc2c');
                chatLinks.forEach(link => {
                    const newWindow = window.open(link.href, '_blank');
                    if (newWindow) {
                        newWindow.addEventListener('load', () => {
                            newWindow.scrollTo(0, 0);
                        });
                    }
                });
            },

            clearAllChats: async function() {
                const kebabButtons = document.querySelectorAll('button[data-component="IconButton"]');

                for (const button of kebabButtons) {
                    if (button.closest('.ConversationList-module__ConversationList__item--dD6z4')) {
                        button.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const deleteButton = Array.from(document.querySelectorAll('li[role="menuitem"]'))
                            .find(item => item.textContent.includes('Delete'));

                        if (deleteButton) {
                            deleteButton.click();
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            }
        },

        'flomoapp.com': {
            init: function() {
                this.addClearButton();
            },

            addClearButton: function() {
                const button = document.createElement('button');
                button.textContent = '清空笔记';
                button.style.position = 'fixed';
                button.style.bottom = '20px';
                button.style.left = '20px';
                button.style.zIndex = '9999';

                applyButtonStyles(button, 'red');

                button.onclick = () => {
                    if (confirm('确定要清空笔记吗？')) {
                        this.scrollAndCheck();
                    }
                };

                document.body.appendChild(button);
            },

            scrollToBottom: function() {
                const element = document.querySelector('.memos');
                if (element) {
                    element.scrollTop = element.scrollHeight;
                }
            },

            isScrolledToBottom: function() {
                const element = document.querySelector('.end');
                return element ? element.getBoundingClientRect().bottom <= window.innerHeight : false;
            },

            scrollAndCheck: function() {
                this.scrollToBottom();

                if (!this.isScrolledToBottom()) {
                    console.log('No element with class "end" was found, continue scrolling...');
                    setTimeout(() => this.scrollAndCheck(), 1000);
                } else {
                    console.log('页面已下滑到最底部！');
                    const elements = document.querySelectorAll('.item.danger');

                    elements.forEach(element => {
                        if (element.textContent.includes('删除')) {
                            element.click();
                        }
                    });
                }
            }
        },

        'doubao.com': {
            init: function() {
                this.addButtons();
            },

            addButtons: function() {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.position = 'fixed';
                buttonContainer.style.bottom = '20px';
                buttonContainer.style.left = '20px';
                buttonContainer.style.zIndex = '9999';
                buttonContainer.style.display = 'flex';
                buttonContainer.style.flexDirection = 'column';
                buttonContainer.style.gap = '10px';

                const openChatsButton = document.createElement('button');
                openChatsButton.textContent = '打开chat';
                applyButtonStyles(openChatsButton, 'green');

                const clearChatsButton = document.createElement('button');
                clearChatsButton.textContent = '清空chat';
                applyButtonStyles(clearChatsButton, 'red');

                buttonContainer.appendChild(openChatsButton);
                buttonContainer.appendChild(clearChatsButton);
                document.body.appendChild(buttonContainer);

                openChatsButton.addEventListener('click', this.openAllChats);
                clearChatsButton.addEventListener('click', this.clearAllChats);
            },

            openAllChats: async function() {
                const chatItems = document.querySelectorAll('[data-testid="thread_detail_item"]');
                console.log(`找到 ${chatItems.length} 个聊天项`);

                if (!chatItems || chatItems.length === 0) {
                    console.log('没有找到聊天项');
                    return;
                }

                // 存储原始页面的滚动位置
                const originalScroll = window.scrollY;

                const maxItems = chatItems.length;

                for (let i = 0; i < maxItems; i++) {
                    try {
                        console.log(`\n===== 处理第 ${i + 1}/${maxItems} 个聊天 =====`);

                        const currentChatItems = document.querySelectorAll('[data-testid="thread_detail_item"]');
                        if (!currentChatItems[i]) {
                            console.log('❌ 未找到目标聊天项，刷新页面');
                            location.reload();
                            await new Promise(resolve => setTimeout(resolve, 400));
                            continue;
                        }

                        const chatItem = currentChatItems[i];

                        chatItem.scrollIntoView({ behavior: "smooth", block: "center" });
                        await new Promise(resolve => setTimeout(resolve, 200));

                        const beforeClickUrl = window.location.href;
                        console.log('点击前URL:', beforeClickUrl);

                        try {
                            chatItem.click();
                            console.log('原生点击已执行');
                        } catch (clickError) {
                            console.log('原生点击失败，尝试模拟点击事件');
                            ['mouseenter', 'mousedown', 'mouseup', 'click'].forEach(eventName => {
                                chatItem.dispatchEvent(new MouseEvent(eventName, {
                                    view: window,
                                    bubbles: true,
                                    cancelable: true,
                                    buttons: eventName === 'mousedown' ? 1 : 0
                                }));
                            });
                        }

                        let newUrl = '';
                        let attempts = 0;
                        const maxAttempts = 20;

                        while (attempts < maxAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                            newUrl = window.location.href;
                            if (newUrl !== beforeClickUrl && !newUrl.includes('/thread/list')) {
                                console.log('✓ URL已变化到具体的chat页面');
                                break;
                            }
                            attempts++;
                        }

                        if (newUrl === beforeClickUrl || newUrl.includes('/thread/list')) {
                            console.log('❌ URL未能成功变化到具体chat页面，尝试重新加载页面');
                            location.reload();
                            await new Promise(resolve => setTimeout(resolve, 400));
                            continue;
                        }

                        window.open(newUrl, '_blank');

                        console.log('返回列表页面...');
                        history.back();

                        attempts = 0;
                        while (attempts < maxAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 100));
                            const currentUrl = window.location.href;
                            if (currentUrl.includes('/thread/list')) {
                                console.log('✓ 成功返回列表页面');
                                await new Promise(resolve => setTimeout(resolve, 400));
                                break;
                            }
                            attempts++;
                        }

                    } catch (error) {
                        console.error('处理聊天项时出错:', error);
                        location.reload();
                        await new Promise(resolve => setTimeout(resolve, 400));
                    }
                }

                window.scrollTo(0, originalScroll);
                console.log('全部处理完成');
            },

            clearAllChats: async function() {
                const menuButtons = document.querySelectorAll('.chat-item-menu-button-outline-Ic2b7D');
                console.log(`找到 ${menuButtons.length} 个菜单按钮`);

                for (const menuButton of menuButtons) {
                    try {
                        console.log('\n===== 处理新的聊天项 =====');

                        // 点击菜单按钮
                        menuButton.querySelector('div').click();
                        await new Promise(resolve => setTimeout(resolve, 200));

                        // 查找删除按钮
                        const deleteButton = document.querySelector('li.remove-btn-TOaQi0.semi-dropdown-item');
                        if (!deleteButton) {
                            console.log('该菜单无删除按钮，点击空白处关闭菜单');
                            document.body.click();
                            await new Promise(resolve => setTimeout(resolve, 100));
                            console.log('继续处理下一个');
                            continue;
                        }

                        // 尝试多种点击方法
                        const clickMethods = [
                            // 方法1：点击整个li元素
                            () => deleteButton.click(),
                            // 方法2：点击内部的div
                            () => deleteButton.querySelector('.semi-dropdown-item-icon').click(),
                            // 方法3：完整事件模拟
                            () => {
                                ['mousedown', 'mouseup', 'click'].forEach(eventName => {
                                    deleteButton.dispatchEvent(new MouseEvent(eventName, {
                                        view: window,
                                        bubbles: true,
                                        cancelable: true,
                                        buttons: eventName === 'mousedown' ? 1 : 0
                                    }));
                                });
                            }
                        ];

                        // 尝试每种点击方法
                        let clicked = false;
                        for (const method of clickMethods) {
                            try {
                                method();
                                // 等待确认对话框
                                await new Promise(resolve => setTimeout(resolve, 100));
                                const confirmButton = document.querySelector('button.semi-button-danger');
                                if (confirmButton) {
                                    clicked = true;
                                    console.log('成功触发删除按钮');
                                    break;
                                }
                            } catch (e) {
                                console.log('点击方法失败，尝试下一种');
                            }
                        }

                        if (!clicked) {
                            console.log('自动点击失败，请手动点击删除按钮');
                            document.body.click();
                            await new Promise(resolve => setTimeout(resolve, 100));
                            continue;
                        }

                        // 点击确认删除按钮
                        const confirmButton = document.querySelector('button.semi-button-danger');
                        if (confirmButton) {
                            confirmButton.click();
                            console.log('点击确认删除');
                            await new Promise(resolve => setTimeout(resolve, 400));
                        }

                    } catch (error) {
                        console.error('删除出错:', error);
                        document.body.click();
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }

                console.log('\n全部处理完成!');
            },
        }
    };

    // Get current domain and execute corresponding code
    const domain = window.location.hostname.replace('www.', '').split('.').slice(-2).join('.');
    const config = siteConfigs[domain];

    if (config) {
        config.init();
    }
})();