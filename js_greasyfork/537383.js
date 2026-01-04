// ==UserScript==
// @name         课堂派自动答题助手
// @namespace    javaweh.com
// @version      1.0
// @description  自动答题，支持动态输入答案，单选多选判断题都能答，支持拖动输入框，自动点击下一题循环答题。
// @author       Javaweh
// @match        *://*.ketangpai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537383/%E8%AF%BE%E5%A0%82%E6%B4%BE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/537383/%E8%AF%BE%E5%A0%82%E6%B4%BE%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建可拖动输入框UI
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '100px';
    container.style.right = '20px';
    container.style.zIndex = 99999;
    container.style.background = '#f0f0f0';
    container.style.border = '1px solid #ccc';
    container.style.padding = '10px';
    container.style.width = '250px';
    container.style.fontSize = '14px';
    container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    container.style.borderRadius = '6px';
    container.style.userSelect = 'none';

    // 标题栏（用来拖动）
    const title = document.createElement('div');
    title.style.cursor = 'move';
    title.style.padding = '4px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '6px';
    title.innerText = '自动答题助手 - 输入答案';

    // 文本输入框
    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '100px';
    textarea.style.resize = 'vertical';
    textarea.style.fontSize = '14px';
    textarea.placeholder = `答案格式示例：
1.A
2.B,C
3.对
4.错`;

    // 开关按钮
    const btnToggle = document.createElement('button');
    btnToggle.style.marginTop = '8px';
    btnToggle.style.padding = '5px 10px';
    btnToggle.textContent = '开始答题';

    container.appendChild(title);
    container.appendChild(textarea);
    container.appendChild(btnToggle);
    document.body.appendChild(container);

    // 拖动功能实现
    let isDragging = false, startX, startY, startLeft, startTop;
    title.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = container.offsetLeft;
        startTop = container.offsetTop;
        e.preventDefault();
    });
    window.addEventListener('mouseup', e => {
        isDragging = false;
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        container.style.left = startLeft + dx + 'px';
        container.style.top = startTop + dy + 'px';
        container.style.right = 'auto'; // 移动时取消right固定
    });

    // 解析用户输入答案为 Map {题号->答案字符串}
    function parseAnswers(text) {
        const map = new Map();
        const lines = text.split('\n');
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            const m = line.match(/^(\d+)\s*\.\s*(.+)$/);
            if (m) {
                const qNum = Number(m[1]);
                const ans = m[2].replace(/\s+/g, ''); // 去空格
                map.set(qNum, ans.toUpperCase());
            }
        }
        return map;
    }

    // 判断单选多选题选项是否正确，答案格式示例：A 或 B,C
    function isCorrectOption(optionText, answerStr) {
        const optLetterMatch = optionText.match(/^[A-D]/i);
        if (!optLetterMatch) return false;
        const optLetter = optLetterMatch[0].toUpperCase();
        const answers = answerStr.split(',');
        return answers.includes(optLetter);
    }

    // 主答题函数
    let running = false;
    let answerMap = new Map();
    let currentIndex = 1;

    async function runAutoAnswer() {
        if (!running) return;

        const visibleQuestions = Array.from(document.querySelectorAll('div.com-danxuan, div.com-duoxuan, div.com-panduan'))
            .filter(div => div.style.display !== 'none');

        if (visibleQuestions.length === 0) {
            console.log('❌ 找不到可见题目，停止');
            running = false;
            btnToggle.textContent = '开始答题';
            return;
        }

        if (currentIndex > visibleQuestions.length) {
            currentIndex = 1; // 循环
        }

        const current = visibleQuestions[currentIndex - 1];
        const answer = answerMap.get(currentIndex);

        if (!answer) {
            console.log(`❌ 第 ${currentIndex} 题无答案，跳过`);
        } else {
            console.log(`✅ 第 ${currentIndex} 题 答案：${answer}`);

            if (current.classList.contains('com-panduan')) {
                const radios = current.querySelectorAll('.van-radio');
                radios.forEach(radio => {
                    const labelSpan = radio.querySelector('.van-radio__label span');
                    if (!labelSpan) return;
                    const labelText = labelSpan.innerText.trim();
                    const isChecked = radio.getAttribute('aria-checked') === 'true';
                    if (((answer === '对' && labelText === '对') || (answer === '错' && labelText === '错')) && !isChecked) {
                        radio.click();
                        console.log(`点击判断题选项：${labelText}`);
                    }
                });
            } else {
                const options = current.querySelectorAll('.subject_options, .van-radio__label');
                options.forEach(opt => {
                    const text = opt.innerText.trim();
                    const radio = opt.closest('.van-radio, .van-checkbox');
                    if (radio && isCorrectOption(text, answer)) {
                        const icon = radio.querySelector('.van-radio__icon, .van-checkbox__icon');
                        if (icon) {
                            icon.click();
                            console.log(`点击选项：${text}`);
                        }
                    }
                });
            }
        }

        const nextBtn = document.querySelector('a.common-btn.common-btn--solid');
        if (nextBtn) {
            nextBtn.click();
            console.log('点击下一题');
        } else {
            console.log('❌ 找不到下一题按钮');
            running = false;
            btnToggle.textContent = '开始答题';
            return;
        }

        currentIndex++;
        setTimeout(runAutoAnswer, 500);
    }

    btnToggle.onclick = () => {
        if (!running) {
            answerMap = parseAnswers(textarea.value);
            if (answerMap.size === 0) {
                alert('请先输入答案');
                return;
            }
            currentIndex = 1;
            running = true;
            btnToggle.textContent = '停止答题';
            runAutoAnswer();
        } else {
            running = false;
            btnToggle.textContent = '开始答题';
            console.log('已停止自动答题');
        }
    };

})();
