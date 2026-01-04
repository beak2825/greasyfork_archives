// ==UserScript==
// @name         bitquant auto submit - prod
// @namespace    http://tampermonkey.net/
// @version      2025-07-02 01
// @description   bitquant auto submit
// @author       You
// @match        https://www.bitquant.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitquant.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539993/bitquant%20auto%20submit%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/539993/bitquant%20auto%20submit%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(msg) {
        console.log(`[AutoSubmit][${new Date().toLocaleTimeString()}]`, msg);
    }

    let submitCount = 0; // 新增提交计数器
    
    // === 配置区 ===
    const INPUT_WAIT_MIN = 5000; // 输入后最小等待时间（毫秒）
    const INPUT_WAIT_RANGE = 2000; // 输入后等待时间波动范围（毫秒）
    const RETRY_WAIT = 5000; // 重试等待时间（毫秒）
    const NEXT_STEP_WAIT = 3000; // 提交后到下次操作等待时间（毫秒）
    const maxSubmitCount = 30; // 最大提交次数

    // 文本区
    const originalTexts = ['btc', 'eth', 'bnb', 'sol', 'xpr', 'usdt', 'usdc', 'trx', 'doge', 'ada', 'hype', 'sui', 'link', 'avax', 'ton', 'shib', 'ltc', 'arb', 'op', 'inj'];
    //const extraTexts = ['价格', '总量', '市值排名', '是否值得购买', '市值排名', '24小时交易量', '历史最高价', '流通供应量', '活跃地址数', '大额交易追踪', '交易所持仓比', '重大新闻事件'];
    const extraTexts = ['', 'price', 'total supply', 'market cap ranking', 'whether worth buying', 'market cap ranking', '24-hour trading volume', 'all-time high', 'circulating supply', 'active address count', 'large transaction tracking', 'exchange holdings ratio', 'major news events'];

    // 生成所有组合并打乱
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function generateCombos() {
        const combos = [];
        for (const t of originalTexts) {
            for (const e of extraTexts) {
                combos.push(t + (e ? ' ' + e : ''));
            }
        }
        return shuffle(combos);
    }
    let combos = generateCombos();

    // 查找页面元素
    function findElements() {
        const textarea = document.querySelector('textarea');
        if (!textarea) {
            log(`未找到 textarea，${RETRY_WAIT / 1000} 秒后重试`);
            setTimeout(tryGetTextareaAndStart, RETRY_WAIT);
            return null;
        }

        const form = textarea.closest('form');
        if (!form) {
            log(`未找到 form，${RETRY_WAIT / 1000} 秒后重试`);
            setTimeout(tryGetTextareaAndStart, RETRY_WAIT);
            return null;
        }

        return { textarea, form };
    }

    // 检查是否应停止（无配额或次数到达上限）
    function checkShouldStop() {
        if (document.body && document.body.innerText.includes('No more messages left for today')) {
            log('检测到"No more messages left for today"，脚本停止执行');
            return true;
        }
        if (submitCount >= maxSubmitCount) {
            log(`已提交${submitCount}次，达到上限，脚本停止。`);
            return true;
        }
        return false;
    }

    // 检查元素状态
    function checkElementsState(elements) {
        const { textarea } = elements;
        if (textarea.disabled || textarea.readOnly) {
            log(`textarea 不可输入，${RETRY_WAIT / 1000} 秒后重试`);
            setTimeout(() => tryGetTextareaAndStart(), RETRY_WAIT);
            return false;
        }
        return true;
    }

    // 按字符逐步输入内容
    function typeText(textarea, text, callback) {
        textarea.focus();
        textarea.value = '';
        let i = 0;
        function inputChar() {
            if (i > text.length) {
                // 输入完成后插入空格并模拟真实按键
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);

                // 依次派发事件
                const spaceDown = new KeyboardEvent('keydown', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true });
                const spacePress = new KeyboardEvent('keypress', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true });
                const spaceUp = new KeyboardEvent('keyup', { key: ' ', code: 'Space', keyCode: 32, which: 32, bubbles: true });

                textarea.dispatchEvent(spaceDown);
                textarea.dispatchEvent(spacePress);

                // 尝试用 setRangeText 插入空格
                textarea.setRangeText(' ', textarea.selectionStart, textarea.selectionEnd, 'end');
                const inputEvent = new Event('input', { bubbles: true });
                textarea.dispatchEvent(inputEvent);

                textarea.dispatchEvent(spaceUp);

                if (callback) callback();
                return;
            }
            textarea.value = text.slice(0, i);
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            i++;
            setTimeout(inputChar, 300);
        }
        inputChar();
    }

    // 提交单个文本
    function submitText(elements) {
        const { textarea, form } = elements;
        // combos用完后重头开始
        if (combos.length === 0) {
            log('所有组合已用完，重头开始并重新打乱');
            combos = generateCombos();
        }
        const inputText = combos.pop();
        log(`填写内容: ${inputText}`);
        // 按字符输入内容
        typeText(textarea, inputText, () => {
            // 输入后等待一段时间再查找并点击提交按钮
            const waitTime = Math.floor(Math.random() * INPUT_WAIT_RANGE) + INPUT_WAIT_MIN;
            log(`等待 ${waitTime / 1000} 秒后查找并点击提交按钮`);
            setTimeout(() => {
                if (checkShouldStop()) {
                    return;
                }
                const button = form.querySelector('button');
                if (!button) {
                    log(`未找到提交按钮，${RETRY_WAIT / 1000} 秒后重试`);
                    setTimeout(() => submitText(elements), RETRY_WAIT);
                    return;
                }
                if (button.disabled) {
                    log(`提交按钮不可用，${RETRY_WAIT / 1000} 秒后重试`);
                    setTimeout(() => submitText(elements), RETRY_WAIT);
                    return;
                }
                log('点击提交按钮');
                button.click();
                submitCount++; // 每次提交后计数+1
                // 继续下一个
                setTimeout(() => tryGetTextareaAndStart(), NEXT_STEP_WAIT);
            }, waitTime);
        });
    }

    // 主要处理流程
    function tryGetTextareaAndStart() {
        // 是否停止
        if (checkShouldStop()) {
            return;
        }
        // 查找元素
        const elements = findElements();
        if (!elements) {
            return;
        }
        // 检查元素状态
        if (!checkElementsState(elements)) {
            return;
        }
        // 提交文本
        submitText(elements);
    }

    window.addEventListener('load', function() {
        log('页面已加载，开始检测元素');
        tryGetTextareaAndStart();
    });
})();