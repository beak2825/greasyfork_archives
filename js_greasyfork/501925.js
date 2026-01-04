// ==UserScript==
// @name         Linux.do 帖子创建日期显示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 Linux.do 论坛帖子列表中显示帖子创建日期，并根据时间用不同颜色标记，一天内的绿色，一月以前的红色，其余灰色
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501925/Linuxdo%20%E5%B8%96%E5%AD%90%E5%88%9B%E5%BB%BA%E6%97%A5%E6%9C%9F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/501925/Linuxdo%20%E5%B8%96%E5%AD%90%E5%88%9B%E5%BB%BA%E6%97%A5%E6%9C%9F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCreationDates() {
        const postRows = document.querySelectorAll('tr.topic-list-item');

        postRows.forEach(row => {
            if (row.querySelector('.creation-date-added')) {
                return;
            }

            const lastColumn = row.querySelector('td.num.age.activity');
            if (lastColumn) {
                const titleAttr = lastColumn.getAttribute('title');
                if (titleAttr) {
                    // 提取创建日期
                    const creationDateStr = titleAttr.split('\n')[0].replace('创建日期: ', '');
                    // 提取年、月、日、小时和分钟
                    const [year, month, day, hour, minute] = creationDateStr.match(/\d+/g).map(Number);

                    // 创建 Date 对象
                    const creationDate = new Date(year, month - 1, day, hour, minute);

                    const dateElement = document.createElement('span');
                    dateElement.textContent = creationDateStr;
                    dateElement.style.fontSize = '12px';
                    dateElement.style.marginLeft = '10px';
                    dateElement.classList.add('creation-date-added');

                    // 根据日期设置颜色
                    const now = new Date();
                    const oneDay = 24 * 60 * 60 * 1000; // 毫秒数
                    const oneMonth = 30 * oneDay;

                    if ((now - creationDate) <= oneDay) {
                        dateElement.style.color = 'green';
                    } else if ((now - creationDate) >= oneMonth) {
                        dateElement.style.color = 'red';
                    } else {
                        dateElement.style.color = '#888'; // 默认灰色
                    }

                    const titleColumn = row.querySelector('td.main-link');
                    if (titleColumn) {
                        titleColumn.appendChild(dateElement);
                    }
                }
            }
        });
    }

    window.addEventListener('load', addCreationDates);

    const observer = new MutationObserver(addCreationDates);
    observer.observe(document.body, { childList: true, subtree: true });
})();
