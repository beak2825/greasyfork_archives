// ==UserScript==
// @name         Slowly Auto Save
// @namespace    http://tampermonkey.net/
// @version      2025-01-13
// @description  Hi,my friend.
// @author       drx
// @match        https://web.slowly.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slowly.app
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522817/Slowly%20Auto%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/522817/Slowly%20Auto%20Save.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let start = false;

    const wordCount = (text) => {
        if(!text || text==='') return 0;
        // Match latin, cyrillic, Malayalam letters and numbers
        // Source: https://github.com/jbrudvik/string-stats/blob/master/string-stats.js
        const common = '(\\d+)|[a-zA-Z0-9\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u0100-\u024F\u0374-\u058F\u05D0-\u05F4\u0622-\u0669\u066E-\u06D3\u06D5\u06EE-\u06FF\u0710-\u072F\u074D-\u074F\u0750-\u077F]+|';
        // Match Chinese Hànzì, the Japanese Kanji and the Korean Hanja
        const cjk = '\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u3FFF\u4000-\u4DBF\u4E00-\u4FFF\u5000-\u5FFF\u6000-\u6FFF\u7000-\u7FFF\u8000-\u8FFF\u9000-\u9FFF\uF900-\uFAFF';
        // Match Japanese Hiragana, Katakana, Rōmaji
        const jp = '\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3190-\u319F';
        // Match Korean Hangul
        const kr = '\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uAFFF\uB000-\uBFFF\uC000-\uCFFF\uD000-\uD7AF\uD7B0-\uD7FF';

        const pattern = new RegExp(
            common + '[' + cjk + jp + kr + ']',
            "g"
        );
        return (text.match(pattern) || []).length;
    }

    const charCount = (text) => {
        if(!text || text==='') return 0;
        return text.replace(/\s/g, '').length
    }

    setInterval(()=>{
        const editor = document.querySelector('.editor');
        if (!editor) {
            start = false;
        }
    },1000)

    // 定时查询元素A是否存在
    setInterval(() => {
        const editorBtn = document.querySelector('.editor-btn');
        if (editorBtn && !start) {
            start = true;

            // 找到同一列中 class 为 .btn 的第二个元素
            const btns = editorBtn.parentElement.querySelectorAll('.btn');
            if (btns.length >= 2) {
                const elementB = btns[1];

                // 复制元素B并修改文案
                const elementC = elementB.cloneNode();
                elementC.textContent = 'Enable Auto Save';
                elementC.disabled = false;
                let autoClickIntervalId = null;
                let timeout = null;
                let recordedPosition = 0;
                const elementD = btns[0].cloneNode();
                elementD.textContent = '';
                elementD.className = 'btn editor-btn btn-default text-light btn-sm';
                const elementE = btns[0].cloneNode();
                elementE.textContent = '';
                elementE.className = 'btn editor-btn btn-default text-light btn-sm';
                elementB.parentElement.appendChild(elementD);
                elementB.parentElement.appendChild(elementE);
                let formExist = false;

                // 点击事件处理
                elementC.addEventListener('click', function() {
                    if (autoClickIntervalId) {
                        // 如果定时任务已启动，取消定时任务
                        clearInterval(autoClickIntervalId);
                        clearTimeout(timeout);
                        autoClickIntervalId = null;
                        timeout = null;
                        elementC.textContent = 'Enable Auto Save'; // 恢复文案
                        formExist = false;
                    } else {
                        // 启动定时任务
                        autoClickIntervalId = setInterval(() => {
                            const textarea = document.querySelector('.form-control');
                            if (textarea && !formExist) {
                                formExist = true;
                                textarea.addEventListener('input', () => {
                                    if (autoClickIntervalId) {
                                        // 清除之前的定时器
                                        clearTimeout(timeout);

                                        // 设置一个新的定时器
                                        timeout = setTimeout(() => {
                                            recordedPosition = textarea.selectionStart; // 记录当前光标位置
                                            elementB.click(); // 点击保存
                                            elementD.textContent = new Date().toLocaleString();
                                            setTimeout(() => {
                                                textarea.focus(); // 先聚焦到textarea
                                                textarea.setSelectionRange(recordedPosition, recordedPosition); // 设置光标位置
                                            },3000);
                                            const body = textarea.textContent;
                                            const wc = wordCount(body);
                                            const cc = charCount(body);
                                            elementE.textContent = `Words: ${wc} / Characters: ${cc}`;
                                        }, 5000);
                                        const body = textarea.textContent;
                                        const wc = wordCount(body);
                                        const cc = charCount(body);
                                        elementE.textContent = `Words: ${wc} / Characters: ${cc}`;
                                    }
                                });
                            }
                        }, 1000);
                        elementC.textContent = 'Auto Save...'; // 修改文案
                        elementB.click(); //启用的时候点击一次保存
                    }
                });
                elementB.before(elementC); // 将元素C添加到页面
            }
        }
    }, 2000);
})();