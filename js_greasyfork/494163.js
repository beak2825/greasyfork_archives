// ==UserScript==
// @name         jira-sp-summarize
// @namespace    http://tampermonkey.net/
// @version      20240612
// @description  the sp summarize
// @author       Neo
// @match        https://jira.logisticsteam.com/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=logisticsteam.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494163/jira-sp-summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/494163/jira-sp-summarize.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function summarizeSp() {
        return { name: 'Story Point', value: summarize('customfield_10002') };
    }

    function summarizeTestPoint() {
        return { name: 'Test Point', value: summarize('customfield_12100') };
    }

    function summarizeDevHour() {
        return { name: 'Dev Hour', value: summarize('customfield_11602') };
    }

    function summarizeTestHour() {
        return { name: 'Test Hour', value: summarize('customfield_11601') };
    }

    function summarize(cellName) {
        // if not exist cellName dom, reutrn NaN
        if (!document.getElementsByClassName(cellName)[0]) {
            return NaN;
        }
        let table = document.getElementById('issuetable').getElementsByTagName('tbody')[0];
        let rows = table.getElementsByTagName('tr');
        let sum = 0;
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let cell = row.getElementsByClassName(cellName)[0].textContent.trim();
            sum += parseFloat(cell) || 0;
        }
        return sum.toFixed(2);
    }

    function generateTextContext() {
        let objs = [summarizeSp(), summarizeDevHour(), summarizeTestPoint(), summarizeTestHour()];
        let text = '';
        for (let i = 0; i < objs.length; i++) {
            // skip if obj.value is NaN
            if (isNaN(objs[i].value)) {
                continue;
            }
            text += objs[i].name + ' : ' + objs[i].value + ' | ';
        }
        return text;
    }

    function insertSp(textContent) {
        // preappend a div befor the <div class="list-view"> show the dev
        let div = document.createElement('div');
        div.id = 'sp-total';
        div.style.margin = '20px';
        div.textContent = textContent;
        document.getElementsByClassName('navigator-group')[0].insertBefore(div, document.getElementsByClassName('navigator-group')[0].firstChild);

    }

    function regenerateSp(textContent) {
        let sp = document.getElementById('sp-total');
        sp.textContent = textContent;
    }

    insertSp(generateTextContext());

    // 获取表格元素
    const targetNode = document.querySelector('.navigator-group');

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 防抖函数
    let mutationTimeout;
    const debounce = (callback, delay) => {
        return (...args) => {
            clearTimeout(mutationTimeout);
            mutationTimeout = setTimeout(() => callback(...args), delay);
        };
    };

    // 回调函数
    const callback = (mutationsList) => {
        // 使用 requestAnimationFrame 确保在下一个重绘周期执行
        requestAnimationFrame(() => {
            let shouldUpdate = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    shouldUpdate = true;
                    break;
                }
            }
            if (shouldUpdate) {
                regenerateSp(generateTextContext());
            }
        });
    };

    // 创建防抖后的回调函数
    const debouncedCallback = debounce(callback, 100);

    // 创建观察者对象并传入防抖后的回调函数
    const observer = new MutationObserver(debouncedCallback);

    // 开始观察目标节点
    observer.observe(targetNode, config);
})();
