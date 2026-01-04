// ==UserScript==
// @name         ssby叔叔不约瓶子说小助手
// @namespace    https://www.shushubuyue.net/
// @version      2.7
// @description  适用于叔叔不约聊天网站的小工具
// @author       风过江
// @match        https://www.shushubuyue.net/*
// @language     zh-CN 
// @grant        none
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/539068/ssby%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E7%93%B6%E5%AD%90%E8%AF%B4%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539068/ssby%E5%8F%94%E5%8F%94%E4%B8%8D%E7%BA%A6%E7%93%B6%E5%AD%90%E8%AF%B4%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isRunning = false;          // 脚本运行状态（通过按钮控制）
    const MIN_DELAY = 800;          // 最小操作延迟（毫秒）
    const MAX_DELAY = 925;          // 最大操作延迟（毫秒）
    let greetingText = '您好';       // 打招呼内容（可自定义）
    let onlyMatchGirls = true;      // 仅匹配女生开关状态（默认开启）
    let contactQQ = '';             // 存储用户输入的QQ号
    let isSendingContact = false;   // 防重复发送锁（新增）

    // ---------------------- UI 界面（完整实现） ----------------------
    function createUIPanel() {
        // 创建控制面板容器
        const uiPanel = document.createElement('div');
        uiPanel.id = 'ssby-control-panel';
        uiPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 16px 20px;
            border-radius: 10px;
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            min-width: 240px;
            pointer-events: auto;
        `;

        // 标题
        const title = document.createElement('div');
        title.textContent = 'ssby小助手';
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 14px;
        `;

        // 打招呼内容输入框
        const greetingGroup = document.createElement('div');
        greetingGroup.style.marginBottom = '12px';

        const greetingLabel = document.createElement('div');
        greetingLabel.textContent = '打招呼内容：';
        greetingLabel.style.cssText = `
            color: #4a5568;
            margin-bottom: 6px;
            font-weight: 500;
        `;

        const greetingInput = document.createElement('input');
        greetingInput.type = 'text';
        greetingInput.value = greetingText;
        greetingInput.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        `;
        greetingInput.placeholder = '输入打招呼内容（默认“您好”）';
        greetingInput.addEventListener('input', (e) => {
            greetingText = e.target.value.trim() || '您好';  // 输入为空时使用默认值
        });
        greetingInput.addEventListener('focus', () => greetingInput.style.borderColor = '#2d3748');
        greetingInput.addEventListener('blur', () => greetingInput.style.borderColor = '#e2e8f0');
        greetingGroup.append(greetingLabel, greetingInput);

        // QQ号输入框
        const contactGroup = document.createElement('div');
        contactGroup.style.marginBottom = '12px';

        const contactLabel = document.createElement('div');
        contactLabel.textContent = '联系方式（QQ号）：';
        contactLabel.style.cssText = `color: #4a5568; margin-bottom: 6px; font-weight: 500;`;


        const contactInput = document.createElement('input');
        contactInput.type = 'text';
        contactInput.placeholder = '输入12位以内QQ号（仅数字）';
        contactInput.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        `;
        contactInput.addEventListener('input', (e) => {
            contactQQ = e.target.value.replace(/\D/g, '').substring(0, 12); // 过滤非数字并限制12位
            e.target.value = contactQQ; // 输入框同步显示清理后的值
        });

        contactGroup.append(contactLabel, contactInput);

        // 发送联系方式按钮（修正添加位置）
        const sendContactBtn = document.createElement('button');
        sendContactBtn.textContent = '发送联系方式';
        sendContactBtn.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            background: #48bb78;
            color: white;
            font-size: 14px;
            cursor: pointer;
            margin-top: 8px;
        `;
        sendContactBtn.addEventListener('click', () => {
            if (!isSendingContact) sendContact(); // 防重复点击
        });
        contactGroup.appendChild(sendContactBtn); // 将按钮添加到QQ输入框组内（确保显示）

        // 仅匹配女生复选框
        const filterGroup = document.createElement('div');
        filterGroup.style.margin = '14px 0';

        const filterLabel = document.createElement('label');
        filterLabel.style.cssText = `
            display: flex;
            align-items: center;
            color: #4a5568;
            cursor: pointer;
            user-select: none;
        `;

        const filterCheckbox = document.createElement('input');
        filterCheckbox.type = 'checkbox';
        filterCheckbox.checked = onlyMatchGirls;
        filterCheckbox.style.cssText = `width: 18px; height: 18px; margin-right: 10px; cursor: pointer;`;
        filterCheckbox.addEventListener('change', (e) => {
            onlyMatchGirls = e.target.checked;
            //console.log(`[设置] 仅匹配女生：${onlyMatchGirls? '开启' : '关闭'}`);
        });

        const filterText = document.createElement('span');
        filterText.textContent = '仅匹配女生';
        filterText.style.fontSize = '15px';
        filterLabel.append(filterCheckbox, filterText);
        filterGroup.append(filterLabel);

        // 状态提示
        const statusText = document.createElement('div');
        statusText.id = 'status-text';
        statusText.textContent = '状态：已停止';
        statusText.style.cssText = `color: #e53e3e; margin: 12px 0; font-size: 15px;`;

        // 状态提示
        const tipsText = document.createElement('div');
        tipsText.id = 'tips-text';
        tipsText.textContent = 'tips：双击esc可自动离开';
        tipsText.style.cssText = `color: #3e3efe; margin: 12px 0; font-size: 15px;`;

        // 开始/停止控制按钮
        const controlBtn = document.createElement('button');
        controlBtn.textContent = '开始';
        controlBtn.style.cssText = `
            width: 100%;
            padding: 10px 12px;
            border: none;
            border-radius: 6px;
            background: #48bb78;
            color: white;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        `;
        controlBtn.onclick = () => {
            isRunning = !isRunning;
            if (isRunning) {
                controlBtn.textContent = '停止';
                controlBtn.style.background = '#e53e3e';
                statusText.textContent = '状态：运行中';
                statusText.style.color = '#48bb78';
                mainLoop().catch(err => {
                    statusText.textContent = `错误：${err.message}`;
                    statusText.style.color = 'red';
                    //console.error('主循环错误:', err);
                });
            } else {
                controlBtn.textContent = '开始';
                controlBtn.style.background = '#48bb78';
                statusText.textContent = '状态：已停止';
                statusText.style.color = '#e53e3e';
            }
        };
        controlBtn.addEventListener('mouseenter', () => {
            controlBtn.style.opacity = '0.9';
            controlBtn.style.transform = 'scale(1.02)';
        });
        controlBtn.addEventListener('mouseleave', () => {
            controlBtn.style.opacity = '1';
            controlBtn.style.transform = 'scale(1)';
        });

        // 组装UI面板
        uiPanel.append(title, greetingGroup, contactGroup, filterGroup, statusText, tipsText, controlBtn);
        document.body.appendChild(uiPanel);
    }

    // ---------------------- 工具函数（完整实现） ----------------------
    function randomDelay() {
        return Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
    }

    async function typeLikeHuman(inputElement, text) {
        for (let i = 0; i < text.length; i++) {
            inputElement.value += text[i];
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, Math.random() * 75 + 25));
        }
    }

    async function waitForElement(selector) {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(checkInterval);
                    resolve(element);
                }
            }, 150);
        });
    }

    async function waitForPopupDisappear(popupSelector, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                const popup = document.querySelector(popupSelector);
                const isDisappeared =!popup || (popup.offsetParent === null);
                if (isDisappeared) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    reject(new Error(`弹窗在${timeout}ms内未消失`));
                }
            }, 100);
        });
    }

    function simulateRealClick(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
            button: 0
        });
        element.dispatchEvent(clickEvent);
    }

    function simulateClickCenterBottom() {
        const centerX = window.innerWidth / 2;
        const bottomY = document.documentElement.clientHeight - 50;
        document.body.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            clientX: centerX,
            clientY: bottomY
        }));
        //console.log(`[ESC触发] 点击位置：横向中间(${Math.round(centerX)}px)，纵向底部50px(${bottomY}px)`);
    }

    function initEscListener() {
        let lastEscTime = 0;
        document.addEventListener('keydown', (event) => {
            if (event.key!== 'Escape') return;
            const now = Date.now();
            if (now - lastEscTime < 500) return;

            const targetSelectors = [
                'span.actions-modal-button.actions-modal-button-bold.color-danger',
                '.button-link.chat-control',
                'span.chat-control'
            ];

            let clickedElement = null;
            for (const selector of targetSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    simulateRealClick(element);
                    clickedElement = selector;
                    break;
                }
            }

            if (clickedElement) {
                console.log(`[ESC触发] 已点击目标元素：${clickedElement}`);
            } else {
                simulateClickCenterBottom();
                console.log('[ESC触发] 未找到目标元素，已点击页面底部中间');
            }

            lastEscTime = now;
        });
        //console.log('[初始化] ESC键监听已启动（防抖500ms）');
    }

    // ---------------------- 核心匹配逻辑 ----------------------
    function validatePartnerInfo() {
        const partnerInfoElement = document.getElementById('partnerInfoText');
        if (!partnerInfoElement) {
            //console.log('[警告] 未找到对方信息元素（partnerInfoText）');
            return false;
        }

        const partnerInfoText = partnerInfoElement.textContent.trim();
        if (onlyMatchGirls) {
            const isGirl = partnerInfoText.includes('女生');
            //console.log(`[匹配检查] 对方信息：“${partnerInfoText}” → 女生匹配结果：${isGirl}`);
            return isGirl;
        } else {
            //console.log(`[匹配检查] 对方信息：“${partnerInfoText}” → 性别不限制，通过`);
            return true;
        }
    }

    // ---------------------- 核心流程 ----------------------
    async function mainLoop() {
        if (!isRunning) return;

        try {
            const msgInput = document.querySelector('textarea#msgInput.col-100[placeholder="输入信息······"]');

            if (!msgInput) {
                const chatControlSpan = document.querySelector('span.chat-control');
                if (chatControlSpan) {
                    simulateRealClick(chatControlSpan);
                    //console.log('[流程] 输入框不存在，点击聊天控制按钮');
                }
            } else {
                const isPartnerValid = validatePartnerInfo();

                if (!isPartnerValid) {
                    const specialButton = document.querySelector('.button-link.chat-control');
                    if (specialButton) {
                        simulateRealClick(specialButton);
                        //console.log('[流程] 点击聊天控制按钮（准备离开）');

                        const leaveSpan = await waitForElement('span.actions-modal-button.actions-modal-button-bold.color-danger');
                        if (leaveSpan) {
                            await new Promise(resolve => setTimeout(resolve, randomDelay()));
                            simulateRealClick(leaveSpan);
                            //console.log('[流程] 点击离开按钮');

                            try {
                                await waitForPopupDisappear('.actions-modal', 3000);
                                //console.log('[成功] 离开弹窗已消失');
                            } catch (error) {
                                //console.error('[警告] 离开弹窗未及时消失:', error.message);
                            }
                        }
                    }
                } else {
                    if (msgInput.value!== greetingText) {
                        await typeLikeHuman(msgInput, greetingText);
                        //console.log(`[流程] 输入打招呼内容：“${greetingText}”`);
                    }

                    const sendButton = document.querySelector('.button-link.msg-send');
                    if (sendButton) {
                        simulateRealClick(sendButton);
                        console.log('[流程] 点击发送按钮');
                        msgInput.focus();
                    }

                    // 等待聊天控制按钮恢复循环
                    //console.log('[等待] 检测聊天控制按钮以恢复循环...');
                    await waitForElement('span.chat-control');
                    //console.log('[继续] 检测到聊天控制按钮，恢复主循环');
                }
            }

            if (isRunning) {
                setTimeout(mainLoop, randomDelay());
            }
        } catch (error) {
            //console.error('[主循环错误]', error);
            statusText.textContent = `错误：${error.message}`;
            statusText.style.color = 'red';
        }
    }

    // ---------------------- 新增功能：发送联系方式 ----------------------
    async function sendContact() {
        if (isSendingContact) return; // 防重复发送
        isSendingContact = true;

        try {
            const msgInput = document.querySelector('textarea#msgInput.col-100[placeholder="输入信息······"]');
            if (!msgInput) throw new Error('未找到消息输入框');
            if (contactQQ.length === 0) throw new Error('请先输入QQ号');

            const batchSize = 3;
            for (let i = 0; i < contactQQ.length; i += batchSize) {
                const batch = contactQQ.substr(i, batchSize);
                msgInput.value = '';                  // 清空输入框
                await typeLikeHuman(msgInput, batch);  // 模拟人类输入
                await new Promise(resolve => setTimeout(resolve, randomDelay())); // 随机延迟
                const sendButton = document.querySelector('.button-link.msg-send');
                sendButton && simulateRealClick(sendButton); // 点击发送按钮
                //console.log(`[联系方式] 发送批次：${batch}`);
            }
        } catch (error) {
            //console.error('[发送错误]', error.message);
        } finally {
            isSendingContact = false; // 解锁
        }
    }

    // ---------------------- 新增功能：“·”键监听 ----------------------
    function initPeriodKeyListener() {
        document.addEventListener('keydown', (e) => {
            // 英文状态下的“·”键（非中文句号，且未在发送中）
            if (e.key === '`' && !e.shiftKey && !isSendingContact) {
                e.preventDefault(); // 防止浏览器默认行为（如聚焦地址栏）
                sendContact(); // 触发发送
            }
        });
        //console.log('[初始化] “·”键监听已启动（英文状态有效）');
    }

    // ---------------------- 初始化 ----------------------
    createUIPanel();
    initEscListener();
    initPeriodKeyListener(); // 启动“·”键监听
})();