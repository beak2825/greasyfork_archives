// ==UserScript==
// @name         多邻国拼音按键选词
// @namespace    http://tampermonkey.net/
// @version      1.40.1
// @description  Enter键:快速学习 或 添加小故事,中文选词快捷键 或 确认消息;ctrl键播放语音,alt慢速播放;Backspace键删除选词;Tab键跳过题目或自动答题;Esc退出学习页面. 参考多邻国选词快捷键https://greasyfork.org/zh-CN/scripts/493966-%E5%A4%9A%E9%82%BB%E5%9B%BD%E9%80%89%E8%AF%8D%E5%BF%AB%E6%8D%B7%E9%94%AE
// @author       Gelan
// @match        https://www.duolingo.com/*
// @match        https://www.duolingo.cn/*
// @license      MIT
// @icon         https://d35aaqx5ub95lt.cloudfront.net/images/super/fb7130289a205fadd2e196b9cc866555.svg
// @require      https://unpkg.com/pinyin-pro
// @downloadURL https://update.greasyfork.org/scripts/497968/%E5%A4%9A%E9%82%BB%E5%9B%BD%E6%8B%BC%E9%9F%B3%E6%8C%89%E9%94%AE%E9%80%89%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/497968/%E5%A4%9A%E9%82%BB%E5%9B%BD%E6%8B%BC%E9%9F%B3%E6%8C%89%E9%94%AE%E9%80%89%E8%AF%8D.meta.js
// ==/UserScript==

; (function () {
    'use strict'
    var { pinyin } = pinyinPro;
    var question = { type: -1, type2: -1 }
    var userInput = document.createElement('span')
    // 始初化题目数据对象方法
    var init_question = function () {
        let challengeHeader = document.querySelector('h1[data-test="challenge-header"]');
        // 对话
        question.el = document.querySelector(
            'div[data-test="challenge challenge-dialogue"]'
        )
        if (question.el) {
            question.type = 10
            return
        }
        // 听写
        question.el = document.querySelector(
            'div[data-test="challenge challenge-listen"]'
        )
        if (question.el) {
            question.type = 9
            return
        }
        // 口语
        question.el = document.querySelector(
            'div[data-test="challenge challenge-speak"], div[data-test="challenge challenge-listenSpeak"]'
        )
        if (question.el) {
            question.type = 8
            return
        }
        // 补全
        question.el = document.querySelector(
            'div[data-test="challenge challenge-tapCloze"]'
        )
        if (question.el) {
            question.type = 7
            return
        }
        // 小故事
        question.el = document.getElementsByClassName('kbjat')
        if (question.el.length) {
            question.el = question.el[0].children
            question.type = 6
            // 每段数据所在属性名
            question.prop_field = Object.keys(question.el[0]).find(p => p.startsWith('__reactFiber'))
            return
        }
        // 听写填空
        question.el = document.querySelector(
            'div[data-test="challenge challenge-listenComplete"]'
        )
        if (question.el) {
            question.type = 5
            return
        }
        // 选项听写
        question.el = document.querySelector(
            'div[data-test="challenge challenge-listenTap"]'
        )
        if (question.el) {
            question.type = 4
            return
        }
        // 选项填空
        question.el = document.querySelector(
            'div[data-test="challenge challenge-tapComplete"]'
        )
        if (question.el) {
            question.type = 3
            return
        }
        // 配对
        question.el = document.querySelector(
            'div[data-test="challenge challenge-listenMatch"]'
        )
        if (question.el) {
            question.el = question.el.children[0].children[1].children[0]
            question.type = 2
            return
        }
        // 中文组句
        question.el = document.querySelector('div[data-test="word-bank"]')
        if (question.el) {
            let spanElement = challengeHeader.querySelector('span');
            if (spanElement.textContent === "用中文写出这句话") {
                question.el2 =
                    question.el.parentElement.previousElementSibling.children[0].children[0].children[1]
                question.type = 1
                userInput.textContent = ''
                challengeHeader.append(userInput)
                return
            }
        }
        // 选择
        question.el = document.querySelector('div[aria-label="choice"]')
        if (question.el) {
            question.type = 0
            if (challengeHeader) {
                let spanElement = challengeHeader.querySelector('span');
                if (spanElement.textContent === "阅读并回答") {
                    question.type2 = 0
                }
                else if (spanElement.textContent === "你听到了什么？") {
                    question.type2 = 1
                }
                else if (spanElement.textContent === "选择听到的内容") {
                    question.type2 = 2
                }
                else if (spanElement.textContent === "听音辩词") {
                    question.type2 = 3
                }
                return
            }
        }
        // 其他
        question.el = null
        question.type = -1
    }
    var process = function () {
        if (question.type == 1) {
            if (document.querySelector('rt')) {
                return;
            }
            for (let i = 0; i < question.el.children.length; i++) {
                let span = question.el.children[i].querySelector('span[data-test="challenge-tap-token-text"]');
                let rt = document.createElement('rt');
                rt.style.cssText = 'color: gray; display: flex; flex-direction: row;';
                rt.style.fontSize = parseFloat(window.getComputedStyle(span).fontSize) * 0.5 + 'px';

                rt.dataset.fullPinyin = pinyin(span.textContent, { toneType: 'none' }); // 存储原始拼音
                rt.dataset.fullPinyin = rt.dataset.fullPinyin.replace(/ü/g, 'v'); // 将ü改为v
                rt.textContent = rt.dataset.fullPinyin
                rt.style.whiteSpace = 'pre-wrap'; // 显示前置空格


                const matchSpan = document.createElement('span');
                matchSpan.style.cssText = 'color: gray; display: flex; flex-direction: row;';
                matchSpan.style.fontSize = parseFloat(window.getComputedStyle(span).fontSize) * 0.5 + 'px';
                matchSpan.style.color = 'lightblue';
                matchSpan.style.whiteSpace = 'pre-wrap'; // 显示前置空格

                span.parentElement.style.cssText = 'display: flex; flex-direction: column;';
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.flexDirection = 'row';
                container.style.alignItems = 'center';

                span.parentElement.insertBefore(container, span);
                container.appendChild(matchSpan);
                container.appendChild(rt);
            }
        }
        else if (question.type == 6) {
            if (document.querySelector('span.append')) {
                return
            }
            let ul = document.querySelector('ul._13ieZ')
            if (!ul) {
                return
            }
            for (let i = 0; i < ul.children.length; i++) {
                let li = ul.children[i]
                let span = document.createElement('span')
                span.className = 'append'
                span.textContent = i + 1
                li.insertBefore(span, li.querySelector('button[data-test="stories-choice"]'))
            }
        }
    }
    var remove = function () {
        let rts = document.querySelectorAll('rt')
        rts.forEach(function (rt) {
            rt.parentElement.removeChild(rt);
        })
        if (question.type == 1) {
            let selects = question.el2.children
            try {
                selects[0].querySelector('button')
            } catch {
                return true
            }
            for (let i = selects.length; i > 0; i--) {
                let select = selects[i - 1]
                select.querySelector('button').click()
            }
            return false
        }
        return true
    }
    let pinyinIndex = 0; // 匹配拼音按键索引
    let matchs = []; // 匹配按钮
    let pinyins = []; // 所有拼音按键
    let isCombi = false; // 是否为组合键(shift+任意字符)

    document.addEventListener('keyup', function (event) {
        if (!document.querySelector('div.kPqwA')) {
            if (event.key == 'Enter') {
                if (window.location.pathname == '/learn') {
                    window.location.href = '/lesson'
                }
            }
            return
        }
        init_question()
        // Esc键,退出练习按钮 或 不,谢谢
        if (event.key == 'Escape') {
            let quit = document.querySelector('button[data-test="quit-button"]')
            let no = document.querySelector('button[data-test="notification-drawer-no-thanks-button"]')
            if (no) {
                no.click()
            }
            if (quit) {
                quit.click()
            }
            return
        }
        // Backspace键, 删除最后一个选词
        if (event.key == 'Backspace') {
            if (question.el2) {
                var selects = question.el2.children
                var cnt = selects.length
                var last_select = selects[cnt - 1]
                last_select.querySelector('button').click()
            }
            return
        }
        // Shift键, 在按钮选词和直接输入中切换 或 在减小难度和增大难度中切换
        if (!event.shiftKey && event.key == 'Shift') {
            if (!isCombi) {
                document.querySelector('button[data-test="player-toggle-keyboard"]').click()
            }
            isCombi = false;
            return
        }
        else if (event.shiftKey && event.key != 'Shift') {
            isCombi = true;
        }
        // Control键, 播放音频
        if (event.key == 'Control') {
            if (question.type == 0 && question.type2 == 0) {
                let el = document.querySelector('button._15600')
                el.click()
            }
            else if (question.type == 0 && question.type2 == 1) {
                let el = document.querySelector('button._3U_eC')
                el.click()
            }
            else if (question.type == 0 && question.type2 == 3) {
                let el = document.querySelector('div._1j8q_')
                el.children[0].click()
            }
            else if (question.type == 1 || question.type == 8 || question.type == 10) {
                let el = document.querySelector('button._1GJVt')
                el.click()
            }
            else if ((question.type == 0 && question.type2 == 2) || question.type == 4) {
                let el = document.querySelector('div._3qAs-')
                el.children[0].children[0].click()
            }
            else if (question.type == 5 || question.type == 9) {
                let el = document.querySelector('div._1DLP9')
                el.children[0].children[0].children[0].click()
            }
            else if (question.type == 6) {
                var last_listen
                for (var i = 0; i < question.el.length; i++) {
                    var el = question.el[i]
                    var class_list = Array.from(el.classList)
                    var flag = el[question.prop_field].flags
                    if (class_list.length == 1) {
                        continue
                    }
                    if (class_list.length == 2) {
                        last_listen = el
                        continue
                    }
                    if (class_list.length == 3) {
                        if (flag == 0) {
                            break
                        } else {
                            continue
                        }
                    }
                    if (class_list.length == 4) {
                        continue
                    }
                }
                if (last_listen) {
                    last_listen.querySelector('div[data-test="audio-button"]').click()
                }
            }
            else {
                var els = document.getElementsByClassName('fs-exclude')
                if (els) {
                    els[0].click()
                }
            }
            return
        }
        // Alt键,慢速播放音频
        if (event.key == 'Alt') {
            event.preventDefault();
            if ((question.type == 0 && question.type2 == 2) || question.type == 4) {
                let el = document.querySelector('div._3qAs-')
                el.children[1].children[0].children[0].click()
            }
            else if (question.type == 0 && question.type2 == 3) {
                let el = document.querySelector('div._1j8q_')
                el.children[1].click()
            }
            else if (question.type == 5 || question.type == 9) {
                let el = document.querySelector('div._1DLP9')
                el.children[1].children[0].children[0].click()
            }
            return
        }
        // Tab键,跳过题目或自动答题(需下载Duolingo Pro BETA)
        if (event.key == 'Tab') {
            event.preventDefault();
            let solve = document.querySelector('#solveAllButton')
            if (solve) {
                if (remove()) {
                    solve.previousElementSibling.click()
                }
            }
            else {
                document.querySelector('button[data-test="player-skip"]').click()
            }
            return
        }
        // Enter键,呼出process 或 确认消息
        if (event.key == 'Enter') {
            let yes = document.querySelector('button[data-test="notification-button"]')
            if (yes) {
                yes.click()
            } else {
                process()
            }
            return
        }

        const keyPressed = event.key;
        if (!document.querySelector('rt') && !document.querySelector('span.append')) {
            return
        }
        // 重置搜索状态（没有匹配或开始新搜索时）
        function resetSearchState() {
            pinyinIndex = 0;
            const pinyins = document.querySelectorAll('rt');
            pinyins.forEach(pinyin => {
                const matchSpan = pinyin.previousElementSibling;
                matchSpan.textContent = '';
                pinyin.textContent = pinyin.dataset.fullPinyin;
            })
        }

        // 分离拼音到span
        function splitSpan(i, rt) {

            const text = rt.dataset.fullPinyin;
            if (!text || text.length === 0 || i <= 0) return;

            const splitIndex = Math.min(i, text.length);

            const matchSpan = rt.previousElementSibling;
            matchSpan.textContent = text.substring(0, splitIndex);
            rt.textContent = text.slice(splitIndex);
        }
        if (question.type === 1) {
            const pinyins = document.querySelectorAll('rt');
            let matches = [];
            userInput.textContent += '  输入： ' + keyPressed;
            const currentChar = keyPressed;
            const isSpaceInput = currentChar === ' ';

            pinyins.forEach(pinyin => {
                if (pinyin.closest('[aria-disabled="true"]')) return;
                const targetChar = pinyin.textContent[0];
                if (targetChar === currentChar) {
                    matches.push(pinyin);
                    splitSpan(pinyinIndex + 1, pinyin);

                    // 处理空格输入的特殊逻辑
                    if (isSpaceInput) {
                        event.preventDefault();
                    }
                }
                // 如果不匹配，重置
                else {
                    const matchSpan = pinyin.previousElementSibling;
                    matchSpan.textContent = '';
                    pinyin.textContent = pinyin.dataset.fullPinyin;
                }
            });

            // 处理匹配结果
            if (matches.length === 1) {
                matches[0].closest('button')?.click();
                resetSearchState();
            } else if (matches.length > 1) {
                matches.forEach((el, index) => {
                    if (el.dataset.fullPinyin.length === pinyinIndex + 1 && !/\d/.test(el.textContent)) {
                        el.textContent += index + 1;
                    }
                });
                pinyinIndex++;
            } else {
                resetSearchState();
            }
        }
        else if (question.type == 6) {
            let spans = document.querySelectorAll('span.append')
            for (let i = 0; i < spans.length; i++) {
                let span = spans[i]
                if (keyPressed == span.textContent) {
                    span.nextElementSibling.click()
                    break
                }
            }
        }
    })
})()
