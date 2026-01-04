// ==UserScript==
// @name         银河复读放置+1功能
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  牛牛+1脚本,点击按钮填充文本将第75,76行取消注释可以加入汪汪队,拒绝猫娘从我做起
// @author       Greenwaln, cy1zu
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @license      GPL-3.0

// @downloadURL https://update.greasyfork.org/scripts/531919/%E9%93%B6%E6%B2%B3%E5%A4%8D%E8%AF%BB%E6%94%BE%E7%BD%AE%2B1%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/531919/%E9%93%B6%E6%B2%B3%E5%A4%8D%E8%AF%BB%E6%94%BE%E7%BD%AE%2B1%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 这些下次一定
    // const tabSelector = '.TabPanel_tabPanel__tXMJF';
    // const tabHidden = '.TabPanel_hidden__26UM3';

    const channelSelector = '.Chat_chatChannel__gQ-21';
    const chatSelector = 'div.ChatHistory_chatHistory__1EiG3';
    const messageSelector = '.ChatMessage_chatMessage__2wev4';
    const inputSelector = 'input.Chat_chatInput__16dhX';

    // 获取原生 setter，确保在 React 受控输入框上更新值有效
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    // 插入自定义样式
    const style = document.createElement('style');
    style.innerHTML = `
        .tm-plus1-btn {
            margin-left: 1ch;
            width: 4ch;
            padding: 0;
            text-align: right;
            background-color: rgba(0,0,0,0.001);
            color: rgba(0,0,0,0.001);
            border: none;
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10+ and Edge */
            user-select: none; /* Standard syntax */

        }
        .tm-plus1-btn:hover {
            margin-left: 1ch;
            border-radius: 4px;
            width: 4ch;
            padding: 0;
            border: none;
            font-family: "Roboto";
            text-align: center;
            background-color: var(--color-primary);
            color: var(--color-text-dark-mode);
            cursor: pointer;
            align-items: center;
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10+ and Edge */
            user-select: none; /* Standard syntax */
        }
    `;
    document.head.appendChild(style);

    // 创建 +1 按钮
    function createPlusOneButton(text) {
        const btn = document.createElement('button');
        btn.innerText = '+1';
        btn.classList.add('tm-plus1-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = document.querySelector(inputSelector);
            if (input) {
                // text = text.replace(/喵/g, '汪');
                // text += '汪';
                nativeInputValueSetter.call(input, text);
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        return btn;
    }

    // 从消息节点中提取纯文本内容及其所在的元素（排除时间戳、用户名等）
    function extractPureTextAndElement(msgElement) {
        const textParts = [];

        // 要排除的 class 列表
        const excludedSelectors = [
            '.ChatMessage_name__1W9tB',
            '.ChatMessage_timestamp__1iRZO'
        ];

        // 判断某个节点是否应该被排除（扩展了技能名称判断）
        function isExcluded(node) {
            return excludedSelectors.some(sel => node.closest(sel)) ||
                (node.classList.contains('Skill_level__39kts') && node.closest('.Skill_skill__3MrMc')) ||
                (node.classList.contains('Skill_name__1C_fL') && node.closest('.Skill_skill__3MrMc'));
        }

        // 遍历所有子元素
        msgElement.querySelectorAll('*').forEach(el => {
            if (isExcluded(el)) return;
            if (el.textContent === ': ') return;

            // 处理包含技能名称的特殊链接容器
            if (el.classList.contains('Skill_skill__3MrMc')) {
                const skillNameEl = el.querySelector('.Skill_name__1C_fL');
                if (skillNameEl) {
                    const skillNameText = skillNameEl.textContent.trim();
                    // 新增：技能名称处理
                    let skillsMap = new Map([
                        ["挤奶", "[milking]"],
                        ["采摘","[foraging]"],
                        ["伐木","[woodcutting]"],
                        ["奶酪锻造","[cheesesmithing]"],
                        ["制作","[crafting]"],
                        ["缝纫","[tailoring]"],
                        ["烹饪","[cooking]"],
                        ["冲泡","[brewing]"],
                        ["炼金","[alchemy]"],
                        ["强化","[enhancing]"],
                        ["耐力","[stamina]"],
                        ["智力","[intelligence]"],
                        ["攻击","[attack]"],
                        ["近战","[melee]"],
                        ["防御","[defense]"],
                        ["远程","[ranged]"],
                        ["魔法","[magic]"],
                    ]);
                    const processedText = skillsMap.get(skillNameText);
                    textParts.push(`[SKILL:${processedText}]`);

                    return; // 处理完成后跳过当前元素的后续处理
                }
            }

            // 原有处理逻辑
            if (el.tagName === 'A' && el.href) {
                textParts.push(el.href);
            } else if (el.childElementCount === 0) {
                const text = el.textContent.trim();
                if (text) textParts.push(text);
            }
        });

        return {
            text: textParts.join(' ').replace(/\s*\[SKILL:(.*?)\]\s*/g, '$1'), //空格处理
            element: msgElement
        };
    }



    // 为每条消息添加 +1 按钮
    function addButtonsAll() {
        const messages = document.querySelectorAll(messageSelector);
        messages.forEach((msg) => {
            if (!msg.dataset.hasPlusOne) {
                const { text, element } = extractPureTextAndElement(msg);
                if (text && element) {
                    if (!msg.querySelector('.tm-plus1-btn')) {
                        const btn = createPlusOneButton(text);
                        msg.appendChild(btn); // 插入整个消息节点的末尾
                    }

                }
                msg.dataset.hasPlusOne = 'true';
            }
        });
    }
    // 为传入dom添加 +1 按钮
    function addButton(msg) {
        if (!msg.dataset.hasPlusOne) {
            const { text, element } = extractPureTextAndElement(msg);
            if (text && element) {
                if (!msg.querySelector('.tm-plus1-btn')) {
                    const btn = createPlusOneButton(text);
                    msg.appendChild(btn); // 插入整个消息节点的末尾
                }
            }
            msg.dataset.hasPlusOne = 'true';
        }
    }

    // 初始化
    let chatLoaded = false;
    function init() {
        if (chatLoaded) {
            clearInterval(checkInit);
            return;
        } else {
            // 监听聊天区域的变化（针对 SPA 动态加载新消息）
            const chatContainers = document.querySelectorAll(chatSelector);

            // 这些下次一定
            // const tabContainers = document.querySelectorAll(tabSelector);

            if (chatContainers.length > 0) {
                addButtonsAll();
                chatLoaded = true;
                console.log('+1 loaded');
                const observer = new MutationObserver((mutations) => {
                    // 遍历所有变动记录
                    for (const mutation of mutations) {
                        // 3. 筛选新增的子节点（直接子节点）
                        for (const node of mutation.addedNodes) {
                            // 4. 确保节点是元素且符合条件（例如特定类名）
                            if (node.nodeType === 1) {
                                // 5. 挂载按钮
                                addButton(node);
                            }
                        }
                    }
                });
                //全频道监听
                for (const chatContainer of chatContainers) {
                    observer.observe(chatContainer, { childList: true });
                }
            }
        }
    }

    const checkInit = setInterval(init, 250);

    // ----唉，轮询
    setInterval(addButtonsAll, 1000);
})();