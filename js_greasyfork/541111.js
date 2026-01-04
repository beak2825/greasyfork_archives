// ==UserScript==
// @name        豆包自动发送助手,添加q=?查询参数
// @namespace   Violentmonkey Scripts
// @match       https://www.doubao.com/chat/*
// @grant       none
// @license MIT
// @version     1.10
// @author      Doubao Assistant
// @description 自动填充URL中的q参数到豆包聊天框并发送
// @downloadURL https://update.greasyfork.org/scripts/541111/%E8%B1%86%E5%8C%85%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%8A%A9%E6%89%8B%2C%E6%B7%BB%E5%8A%A0q%3D%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541111/%E8%B1%86%E5%8C%85%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%E5%8A%A9%E6%89%8B%2C%E6%B7%BB%E5%8A%A0q%3D%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

/*
 * 功能说明：
 * 1. 自动提取URL中的q参数
 * 2. 智能填充到豆包聊天输入框
 * 3. 模拟真实用户输入行为
 * 4. 自动发送消息
 */

async function addDoubaoQueryParam() {
    // 获取URL中的q参数
    const query = new URLSearchParams(window.location.search).get('q');
    if (!query) {
        console.log('URL中未检测到q参数，脚本终止');
        return;
    }

    console.log(`检测到查询参数：${query}`);

    // 元素等待函数
    const waitForElement = async (selectors, timeout = 10000) => {
        const selectorList = Array.isArray(selectors) ? selectors : [selectors];

        while (timeout > 0) {
            for (const selector of selectorList) {
                const element = document.querySelector(selector);
                if (element) {
                    console.log(`通过选择器 "${selector}" 定位到元素`);
                    return element;
                }
            }
            await delay(300);
            timeout -= 300;
        }

        throw new Error(`所有选择器均未定位到元素：${selectorList.join(' / ')}`);
    };

    // 延时函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 注入式输入内容
    async function injectText(element, text) {
        console.log(`开始注入内容，长度：${text.length} 字符`);

        // 分块注入
        const chunks = splitTextIntoChunks(text);

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            // 使用不同的方法注入内容
            if (chunk.type === 'normal') {
                setNativeValue(element, chunk.content);
            } else if (chunk.type === 'html') {
                if (element.insertAdjacentHTML) {
                    element.insertAdjacentHTML('beforeend', chunk.content);
                } else {
                    setNativeValue(element, chunk.content);
                }
            } else if (chunk.type === 'paste') {
                simulatePaste(element, chunk.content);
            }

            // 触发必要的事件
            triggerInputEvents(element);

            // 等待页面响应
            await delay(150 + Math.random() * 100);

            // 检查内容是否被清空
            if (element.value.length < chunk.content.length) {
                console.warn('警告：内容被部分清空，尝试恢复');
                if (Math.random() > 0.5) {
                    setNativeValue(element, element.value + chunk.content);
                } else {
                    simulatePaste(element, chunk.content);
                }
                triggerInputEvents(element);
                await delay(200);
            }

            // 模拟思考时间
            if (i < chunks.length - 1) {
                await delay(300 + Math.random() * 400);
            }
        }

        // 触发最终事件
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));

        console.log(`内容注入完成：${text}`);
    }

    // 将文本分成不同类型的块
    function splitTextIntoChunks(text) {
        const chunks = [];
        const maxChunkSize = 15 + Math.floor(Math.random() * 10);

        let currentType = 'normal';
        let currentChunk = '';

        for (let i = 0; i < text.length; i++) {
            currentChunk += text[i];

            if (currentChunk.length >= maxChunkSize || /[,.?!;:]/.test(text[i])) {
                chunks.push({
                    content: currentChunk,
                    type: currentType
                });

                const types = ['normal', 'html', 'paste'];
                currentType = types[Math.floor(Math.random() * types.length)];
                currentChunk = '';
            }
        }

        if (currentChunk) {
            chunks.push({
                content: currentChunk,
                type: currentType
            });
        }

        return chunks;
    }

    // 使用原生方法设置值
    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

    // 模拟粘贴操作
    function simulatePaste(element, text) {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/plain', text);

        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: clipboardData,
            composed: true
        });

        element.dispatchEvent(pasteEvent);
    }

    // 触发完整的输入事件序列
    function triggerInputEvents(element) {
        const events = [
            'focus',
            'input',
            'change',
            'keydown',
            'keypress',
            'keyup'
        ];

        events.forEach(eventName => {
            const event = new Event(eventName, { bubbles: true, cancelable: true, composed: true });
            element.dispatchEvent(event);
        });

        if (document.activeElement === element) {
            document.dispatchEvent(new Event('selectionchange'));
        }
    }

    // 模拟真实鼠标点击按钮
    async function realisticClick(element) {
        // 获取元素位置
        const rect = element.getBoundingClientRect();

        // 计算点击位置
        const clickX = rect.left + rect.width / 2 + (Math.random() * 10 - 5);
        const clickY = rect.top + rect.height / 2 + (Math.random() * 10 - 5);

        // 模拟鼠标移动轨迹
        const moveToButton = (x, y) => {
            const moveEvent = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y,
                view: window,
                buttons: 0
            });
            document.dispatchEvent(moveEvent);
        };

        // 贝塞尔曲线移动
        const startX = clickX + (Math.random() * 100 - 50);
        const startY = clickY + (Math.random() * 100 - 50);
        const controlX = (startX + clickX) / 2 + (Math.random() * 40 - 20);
        const controlY = (startY + clickY) / 2 + (Math.random() * 40 - 20);

        const points = [];
        for (let t = 0; t <= 1; t += 0.1) {
            const x = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * clickX;
            const y = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * clickY;
            points.push({ x, y });
        }

        // 移动鼠标
        for (const point of points) {
            moveToButton(point.x, point.y);
            await delay(10 + Math.random() * 15);
        }

        // 鼠标交互序列
        element.dispatchEvent(new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            clientX: clickX,
            clientY: clickY,
            view: window,
            buttons: 0
        }));
        await delay(120 + Math.random() * 80);

        element.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: clickX,
            clientY: clickY,
            view: window,
            buttons: 1,
            button: 0
        }));
        await delay(70 + Math.random() * 30);

        element.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: clickX,
            clientY: clickY,
            view: window,
            buttons: 0,
            button: 0
        }));

        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: clickX,
            clientY: clickY,
            view: window,
            buttons: 0,
            button: 0
        }));

        element.dispatchEvent(new MouseEvent('mouseleave', {
            bubbles: true,
            cancelable: true,
            clientX: clickX + 10,
            clientY: clickY + 10,
            view: window,
            buttons: 0
        }));

        await delay(150 + Math.random() * 100);
    }

    try {
        // 定位输入框
        const textarea = await waitForElement([
            '[data-testid="chat_input_input"]',
            '.semi-input-textarea.semi-input-textarea-autosize',
            'textarea[placeholder="发消息、输入 @ 选择技能或 / 选择文件"]'
        ]);

        // 准备输入框
        textarea.focus();
        await delay(600 + Math.random() * 200);

        // 清除可能存在的内容
        textarea.value = '';
        triggerInputEvents(textarea);
        await delay(200 + Math.random() * 100);

        // 注入内容
        await injectText(textarea, query);

        // 调整输入框高度
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        await delay(200 + Math.random() * 100);

        // 验证内容
        if (textarea.value.trim() !== query.trim()) {
            console.warn(`内容验证不匹配（期望: ${query}, 实际: ${textarea.value}），尝试修复`);
            setNativeValue(textarea, query);
            triggerInputEvents(textarea);
            await delay(300 + Math.random() * 150);

            if (textarea.value.trim() !== query.trim()) {
                throw new Error(`内容验证失败：期望 "${query}"，实际 "${textarea.value}"`);
            }
        }

        console.log(`内容已成功设置：${query}`);
        await delay(500 + Math.random() * 200);

        // 定位发送按钮
        const sendButton = await waitForElement([
            '[data-testid="chat_input_send_button"]',
            '.send-btn-DDB6yN:not([disabled])',
            '.semi-button-primary:not([disabled])'
        ]);

        // 发送消息
        console.log('准备发送消息...');

        // 确保输入框有焦点
        textarea.focus();
        await delay(200 + Math.random() * 100);

        // 点击发送按钮
        await realisticClick(sendButton);

        // 等待发送结果
        await delay(1000 + Math.random() * 500);

        // 验证是否发送成功
        if (textarea.value.trim() !== '') {
            console.warn('警告：发送后输入框未清空，可能发送失败');

            // 尝试使用Enter键发送
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                location: 0,
                repeat: false,
                isComposing: false,
                view: window
            });
            textarea.dispatchEvent(enterEvent);

            await delay(150);

            const keyupEvent = new KeyboardEvent('keyup', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                location: 0,
                repeat: false,
                isComposing: false,
                view: window
            });
            textarea.dispatchEvent(keyupEvent);

            await delay(1000 + Math.random() * 500);

            if (textarea.value.trim() !== '') {
                throw new Error('消息发送失败：输入框内容未清空');
            }
        }

        console.log('消息已成功发送！');

    } catch (error) {
        console.error('脚本执行失败:', error.message);
        console.trace('错误堆栈跟踪');
    }
}

// 执行条件：仅在豆包聊天页面执行
if (window.location.host === 'www.doubao.com' && window.location.pathname.startsWith('/chat')) {
    try {
        addDoubaoQueryParam();
    } catch (e) {
        console.error('脚本主流程异常:', e);
    }
}