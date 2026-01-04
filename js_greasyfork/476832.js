// ==UserScript==
// @license      MIT
// @name         禅道内容统计
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  统计禅道任务用
// @author       zyieng
// @match        http://zentao.yinghaikeji.com/execution-task*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476832/%E7%A6%85%E9%81%93%E5%86%85%E5%AE%B9%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/476832/%E7%A6%85%E9%81%93%E5%86%85%E5%AE%B9%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取所有类名为 c-name text-left 的元素
    let cNames = document.querySelectorAll('.c-name.text-left');
    let cDeadlines = document.querySelectorAll('.c-deadline.text-center');

    // 生成表格，添加到 body 中
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    table.appendChild(thead);
    table.appendChild(tbody);

    // 添加表头
    let tr = document.createElement('tr');
    let th1 = document.createElement('th');
    let th2 = document.createElement('th');
    th1.innerHTML = '任务名称';
    th2.innerHTML = '截止日期';
    tr.appendChild(th1);
    tr.appendChild(th2);
    thead.appendChild(tr);

    // 遍历 cNames，假设 cNames 和 cDeadlines 元素数量相同
    for (let i = 0; i < cNames.length; i++) {
        let tr = document.createElement('tr');
        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        td1.innerHTML = cNames[i].innerHTML;
        td2.innerHTML = cDeadlines[i].innerHTML;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tbody.appendChild(tr);
    }

    // 添加到 body 中
    let body = document.querySelector('body');
    body.appendChild(table);
})();