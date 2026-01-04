// ==UserScript==
// @name         页面翻译助手_3个入口
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加翻译功能按钮
// @author       Your name
// @match        *://km.sankuai.com/collabpage/2651874030
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521518/%E9%A1%B5%E9%9D%A2%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B_3%E4%B8%AA%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/521518/%E9%A1%B5%E9%9D%A2%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B_3%E4%B8%AA%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建翻译按钮
    function createTranslateButton() {
        const button = document.createElement('div');
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
        `;

        // 设置按钮样式
        Object.assign(button.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '40px',
            height: '40px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: '9999',
            transition: 'background-color 0.3s'
        });

        let isActive = false;
        button.addEventListener('click', () => {
            isActive = !isActive;
            button.style.backgroundColor = isActive ? '#1890ff' : 'white';
            button.style.color = isActive ? 'white' : 'black';

            if (isActive) {
                startObserving();
            } else {
                stopObserving();
            }
        });

        document.body.appendChild(button);
    }

    // 使用 MutationObserver 监听菜单变化
    function startObserving() {
        const menuObserver = new MutationObserver((mutations, obs) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // 元素节点
                        // 对更多操作菜单使用多次重试
                        let retryCount = 0;
                        const maxRetries = 5;

                        const tryHandleMoreMenu = () => {
                            handleMoreMenu();
                            if (!document.querySelector('li svg[data-translate="true"]') && retryCount < maxRetries) {
                                retryCount++;
                                setTimeout(tryHandleMoreMenu, 200);
                            }
                        };

                        setTimeout(() => {
                            // 处理 AI 菜单
                            handleAIMenu();
                            // 处理更多操作菜单（带重试）
                            tryHandleMoreMenu();
                            // 处理顶部菜单
                            handleTopMenu();
                        }, 100);
                    }
                }
            }
        });

        menuObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true, // 添加属性变化的监听
            attributeFilter: ['class', 'style'] // 特别关注这些属性的变化
        });

        window._menuObserver = menuObserver;
    }

    function stopObserving() {
        if (window._menuObserver) {
            window._menuObserver.disconnect();
            delete window._menuObserver;
        }
    }

    // 处理 AI 菜单
    function handleAIMenu() {
        const secondElement = document.querySelector("#editor-74438295 > div > div > div:nth-child(12) > div > div:nth-child(1) > div > div > div > div.ai-popover-info-panel-content > div > div:nth-child(2)");
        if (secondElement) {
            secondElement.remove();
        }

        const targetElement = document.querySelector("#editor-74438295 > div > div > div:nth-child(12) > div > div:nth-child(1) > div > div > div > div.ai-popover-info-panel-content > div > div:nth-child(1)");
        if (targetElement && !targetElement.querySelector('.custom-ai-menu-item')) {
            addAIMenuItems(targetElement);
        }
    }

    // 处理更多操作菜单
    function handleMoreMenu() {
        // 尝试多个可能的选择器
        const possibleSelectors = [
            "#app > div:nth-child(4) > div > div > div > div.ant-popover-inner > div > div > ul > li:nth-child(20)",
            "#app > div:nth-child(11) > div > div > div > div.ant-popover-inner > div > div > ul > li:nth-child(20)",
            "#app > div:nth-child(12) > div > div > div > div.ant-popover-inner > div > div > ul > li:nth-child(20)",
            // 更宽松的选择器
            ".ant-popover-inner > div > div > ul > li:nth-child(20)"
        ];

        // 查找所有弹出菜单
        const popoverMenus = document.querySelectorAll('.ant-popover-inner > div > div > ul');

        for (const menu of popoverMenus) {
            // 检查是否是目标菜单（通过检查内容或特征）
            if (menu.textContent.includes('页面宽度')) {
                const lastItem = menu.querySelector('li:nth-child(20)');
                if (lastItem && !menu.querySelector('li svg[data-translate="true"]')) {
                    console.log('找到目标菜单，添加翻译选项');
                    addMoreMenuItem(lastItem);
                    break;
                }
            }
        }

        // 如果上面的方法没找到，尝试直接选择器
        if (!document.querySelector('li svg[data-translate="true"]')) {
            for (const selector of possibleSelectors) {
                const targetElement = document.querySelector(selector);
                if (targetElement && !targetElement.parentElement.querySelector('li svg[data-translate="true"]')) {
                    console.log('通过选择器找到目标元素，添加翻译选项');
                    addMoreMenuItem(targetElement);
                    break;
                }
            }
        }
    }

    // 处理顶部菜单
    function handleTopMenu() {
        const targetElement = document.querySelector("#app > div.ct-dropdown-content.custom-popover.custom-popover-in > div > ul");
        if (targetElement && !targetElement.querySelector('.custom-translate-option')) {
            addTopMenuItem(targetElement);
        }
    }

    // 添加 AI 菜单项
    function addAIMenuItems(targetElement) {
        const newItems = ['检查错别字', '翻译成英文'];
        newItems.forEach(text => {
            const newDiv = document.createElement('div');
            newDiv.className = 'ai-menu-item prompt-item flex-middle-x custom-ai-menu-item';
            newDiv.textContent = text;

            Object.assign(newDiv.style, {
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                padding: '8px'
            });

            newDiv.addEventListener('mouseenter', () => {
                newDiv.style.backgroundColor = '#f5f5f5';
            });
            newDiv.addEventListener('mouseleave', () => {
                newDiv.style.backgroundColor = 'transparent';
            });

            newDiv.addEventListener('click', () => {
                console.log(`点击了${text}`);
            });

            targetElement.appendChild(newDiv);
        });
    }

    // 添加更多操作菜单项
    function addMoreMenuItem(targetElement) {
        const li = document.createElement('li');
        li.className = targetElement.className;
        Object.assign(li.style, {
            padding: '5px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            transition: 'background-color 0.2s'
        });

        li.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;" data-translate="true">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
            全文翻译成英文
        `;

        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#f5f5f5';
        });
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = 'transparent';
        });

        li.addEventListener('click', () => {
            console.log('点击了全文翻译');
        });

        targetElement.after(li);
    }

    // 添加顶部菜单项
    function addTopMenuItem(targetElement) {
        const li = document.createElement('li');
        li.className = 'custom-translate-option';
        Object.assign(li.style, {
            transition: 'background-color 0.2s',
            cursor: 'pointer',
            margin: '-2px 0',
            padding: '2px 0'
        });

        li.innerHTML = `
            <div style="margin: 8px 10px; display: flex; align-items: center;">
                <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right: 8px;">
                    <path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
                </svg>
                <div style="font-size: 14px;height: 20px;line-height: 20px;" class="label-span">
                    翻译为英文
                </div>
            </div>
        `;

        li.addEventListener('mouseenter', () => {
            li.style.backgroundColor = '#f5f5f5';
        });
        li.addEventListener('mouseleave', () => {
            li.style.backgroundColor = 'transparent';
        });

        li.addEventListener('click', () => {
            console.log('触发翻译功能');
        });

        targetElement.appendChild(li);
    }

    // 初始化
    createTranslateButton();
})();