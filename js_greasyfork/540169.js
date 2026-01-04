// ==UserScript==
// @name         klokapp auto submit - prod
// @namespace    http://tampermonkey.net/
// @version      2025-06-25
// @description  klokapp auto submit
// @author       You
// @match        https://klokapp.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klokapp.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540169/klokapp%20auto%20submit%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/540169/klokapp%20auto%20submit%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(msg) {
        console.log('[AutoSubmit]', msg);
    }

    const texts = ['btc', 'eth', 'bnb', 'sol', 'xpr', 'usdt', 'usdc', 'trx', 'doge', 'ada', 'hype', 'sui', 'link', 'avax', 'ton', 'shib', 'ltc', 'arb', 'op', 'inj'];
    //const extraTexts = ['价格', '总量', '市值排名', '是否值得购买', '市值排名', '24小时交易量', '历史最高价', '流通供应量', '活跃地址数', '大额交易追踪', '交易所持仓比', '重大新闻事件'];
    const extraTexts = ['price', 'total supply', 'market cap ranking', 'whether worth buying', 'market cap ranking', '24-hour trading volume', 'all-time high', 'circulating supply', 'active address count', 'large transaction tracking', 'exchange holdings ratio', 'major news events'];

    let currentIndex = 0;
    let stopped = false;

    // 查找页面元素
    function findElements() {
        const textarea = document.querySelector('textarea');
        if (!textarea) {
            log('未找到 textarea，3秒后重试');
            setTimeout(tryGetTextareaAndStart, 3000);
            return null;
        }

        const form = textarea.closest('form');
        if (!form) {
            log('未找到 form，3秒后重试');
            setTimeout(tryGetTextareaAndStart, 3000);
            return null;
        }

        return { textarea, form };
    }

    // 检查元素状态
    function checkElementsState(elements) {
        const { textarea } = elements;
        if (textarea.disabled || textarea.readOnly) {
            log('textarea 不可输入，3秒后重试');
            setTimeout(() => tryGetTextareaAndStart(), 3000);
            return false;
        }
        return true;
    }

    // 检查页面是否存在"您已达到每日提问限制"
    function checkNoMoreMessages() {
        if (document.body && document.body.innerText.includes('您已达到每日提问限制')) {
            log('检测到"您已达到每日提问限制"，脚本停止执行');
            stopped = true;
            return true;
        }
        return false;
    }

    // 按字符逐步输入内容
    function typeText(textarea, text, callback) {
        if (checkNoMoreMessages()) return;
        textarea.focus();
        textarea.value = '';
        let i = 0;
        function inputChar() {
            if (checkNoMoreMessages()) return;
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
            setTimeout(inputChar, 50);
        }
        inputChar();
    }

    // 提交单个文本
    function submitText(elements) {
        if (checkNoMoreMessages()) {
            return;
        }
        const { textarea, form } = elements;
        if (texts.length === 0) {
            log('texts 已全部用完，脚本退出');
            return;
        }
        const textIndex = Math.floor(Math.random() * texts.length);
        const text1 = texts[textIndex];
        texts.splice(textIndex, 1); // 用过后移除
        const text2 = extraTexts[Math.floor(Math.random() * extraTexts.length)];
        const inputText = text1 + ' ' + text2;
        log(`填写内容: ${inputText}`);
        // 按字符输入内容
        typeText(textarea, inputText, () => {
            if (checkNoMoreMessages()) return;
            // 输入后等待3-5秒再直接提交表单
            const waitTime = Math.floor(Math.random() * 2000) + 5000;
            log(`等待 ${waitTime / 1000} 秒后直接提交表单`);
            setTimeout(() => {
                if (checkNoMoreMessages()) {
                    return;
                }
                // 只点击type为'submit'的button提交
                const button = form.querySelector('button[type="submit"]');
                if (button) {
                    log('点击提交按钮');
                    button.click();
                } else {
                    log('未找到type为submit的提交按钮，无法提交');
                }
                setTimeout(() => {
                    if (checkNoMoreMessages()) return;
                    tryGetTextareaAndStart();
                }, 3000);
            }, waitTime);
        });
    }

    // 主要处理流程
    function tryGetTextareaAndStart() {
        if (stopped) {
            log('检测到已停止，脚本退出');
            return;
        }
        if (checkNoMoreMessages()) {
            return;
        }
        if (texts.length === 0) {
            log('所有内容已提交完毕，脚本退出');
            return;
        }
        const elements = findElements();
        if (!elements) {
            return;
        }
        if (!checkElementsState(elements)) {
            return;
        }
        submitText(elements);
    }

    window.addEventListener('load', function() {
        log('页面已加载，开始检测元素');
        tryGetTextareaAndStart();
    });
})();