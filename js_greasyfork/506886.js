// ==UserScript==
// @name         自动获取答案
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  自用真香，别看我主页
// @author       郭郭郭
// @match        https://www.lnonl.com/post/*
// @match        https://gbwlxy.dtdjzx.gov.cn/*
// @match        https://dywlxy.dtdjzx.gov.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506886/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/506886/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentURL = window.location.href;

    function createFloatingWindow(content) {
        let floatingWindow = document.querySelector('#floatingWindow');
        if (!floatingWindow) {
            floatingWindow = document.createElement('div');
            floatingWindow.id = 'floatingWindow';
            floatingWindow.style.position = 'fixed';
            floatingWindow.style.top = '20px';
            floatingWindow.style.right = '20px';
            floatingWindow.style.width = '300px';
            floatingWindow.style.maxHeight = '400px';
            floatingWindow.style.overflowY = 'auto';
            floatingWindow.style.backgroundColor = 'white';
            floatingWindow.style.border = '1px solid black';
            floatingWindow.style.padding = '10px';
            floatingWindow.style.zIndex = '9999';
            floatingWindow.style.fontSize = '16px';
            document.body.appendChild(floatingWindow);
        }
        floatingWindow.innerHTML = content;
    }

    function updateFloatingWindow() {
        let storedContent = GM_getValue('storedContent', '没有找到存储的内容。');
        createFloatingWindow(storedContent);
    }

    if (currentURL.includes('lnonl.com')) {
        let title = document.querySelector('title').textContent.trim();

        let resultGroups = [];
        let currentGroup = [];

        let questionElements = document.querySelectorAll('p, span, div');

        questionElements.forEach(function(element) {
            let text = element.textContent.trim();

            let choiceMatch = text.match(/^(\d+)\.\s*([A-Z]+)\s+/);
            if (choiceMatch) {
                let number = choiceMatch[1];
                let answer = choiceMatch[2];

                if (number === '1' && currentGroup.length > 0) {
                    resultGroups.push(currentGroup);
                    currentGroup = [];
                }

                currentGroup.push(`${number}:${answer}`);
            }

            let judgeMatch = text.match(/^(\d+)\.\s*(正确|错误|A正确|B错误)\s+/);
            if (judgeMatch) {
                let number = judgeMatch[1];
                let answer = judgeMatch[2];

                if (number === '1' && currentGroup.length > 0) {
                    resultGroups.push(currentGroup);
                    currentGroup = [];
                }

                currentGroup.push(`${number}:${answer}`);
            }
        });

        if (currentGroup.length > 0) {
            resultGroups.push(currentGroup);
        }

        let content = `<h3>${title}</h3>`;
        let labels = [];

        if (title.includes('上') && title.includes('中') && title.includes('下')) {
            labels = ['上', '中', '下'];
        } else if (title.includes('上') && title.includes('下')) {
            labels = ['上', '下'];
        } else {
            labels = resultGroups.map(() => '答案组');
        }

        const colors = ['#FF6347', '#4682B4', '#32CD32'];
        resultGroups.forEach(function(group, index) {
            const label = labels[index] || '答案组';
            const color = colors[index] || '#000000';
            content += `<p><strong style="color:${color}; font-size:18px;">${label}:</strong> `;
            content += `<span style="color:${color};">${group.join(' ')}</span>`;
            content += `</p>`;
        });

        if (resultGroups.length === 0) {
            content += "<p>未找到题号和答案，请检查选择器或手动查找。</p>";
        }

        GM_setValue('storedContent', content);

        createFloatingWindow(content);

    } else if (currentURL.includes('dtdjzx.gov.cn')) {
        updateFloatingWindow();
        setInterval(updateFloatingWindow, 1000);
    }
})();
