// ==UserScript==
// @name         Gata Auto Chat - prod
// @namespace    http://tampermonkey.net/
// @version      2025-06-25
// @description  Gata Auto Chat
// @author       skye
// @match        https://app.gata.xyz/chat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=app.gata.xyz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540743/Gata%20Auto%20Chat%20-%20prod.user.js
// @updateURL https://update.greasyfork.org/scripts/540743/Gata%20Auto%20Chat%20-%20prod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(msg) {
        console.log(`[AutoChat][${new Date().toLocaleTimeString()}]`, msg);
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
        // svg需包含cursor-pointer或cursor-not-allowed
        const svg = document.querySelector('svg.cursor-pointer,svg.cursor-not-allowed');
        if (!svg) {
            log('未找到提交按钮或提交按钮暂时不可用，3秒后重试');
            setTimeout(tryGetTextareaAndStart, 3000);
            return null;
        }
        return { textarea, svg };
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
        const { textarea, svg } = elements;
        if (texts.length === 0) {
            log('texts 已全部用完，脚本退出');
            return;
        }
        const textIndex = Math.floor(Math.random() * texts.length);
        const text1 = texts[textIndex];
        texts.splice(textIndex, 1); // 用过后移除
        const text2 = extraTexts[Math.floor(Math.random() * extraTexts.length)];
        const inputText = text1 + ' ' + text2;
        log(`-->填写内容: ${inputText}`);
        // 按字符输入内容
        typeText(textarea, inputText, () => {
            // 输入后等待3-5秒再提交
            const waitTime = Math.floor(Math.random() * 2000) + 5000;
            log(`等待 ${waitTime / 1000} 秒后点击按钮提交`);
            setTimeout(() => {
                // 检查svg是否含有cursor-not-allowed类
                if (svg.classList.contains('cursor-not-allowed')) {
                    log('svg含有cursor-not-allowed类，3秒后重试');
                    setTimeout(() => submitText(elements), 3000);
                    return;
                }
                log('点击按钮提交');
                svg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                // 点击提交后延迟5-10秒等待结果，然后执行randomClickLastDiv
                const randomDelay = Math.floor(Math.random() * 5000) + 5000;
                setTimeout(() => {
                    randomClickLastDiv();
                    tryGetTextareaAndStart();
                }, randomDelay);
            }, waitTime);
        });
    }

    // 随机点击最后一个last:pb-6下的深层w-full div
    function randomClickLastDiv() {
        const lastDivs = document.querySelectorAll('div.last\\:pb-6');
        const lastDiv = lastDivs[lastDivs.length - 1];
        if (!lastDiv) {
            log('未找到last:pb-6的div');
            return;
        }
        // 获取第一个class同时包含flex和overflow-visible的div
        const flexVisibleDiv = lastDiv.querySelector('div.flex.overflow-visible');
        if (!flexVisibleDiv) {
            log('未找到class含flex和overflow-visible的div');
            return;
        }
        // 获取其所有子div
        const childDivs = Array.from(flexVisibleDiv.querySelectorAll(':scope > div'));
        if (childDivs.length === 0) {
            log('未找到子div');
            return;
        }
        const randomIndex = Math.floor(Math.random() * childDivs.length);
        const randomDiv = childDivs[randomIndex];
        log(`随机点击第${randomIndex + 1}个子div（共${childDivs.length}个）`);
        randomDiv.click();
    }

    // 主要处理流程
    function tryGetTextareaAndStart() {
        if (stopped) {
            log('检测到已停止，脚本退出');
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