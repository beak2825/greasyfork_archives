// ==UserScript==
// @name         GitLab 获取合并事件个人动态
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取 GitLab 合并事件个人动态
// @author       tindoc
// @license      MIT
// @match        http://*/dashboard/activity
// @match        https://*/dashboard/activity
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/436726/GitLab%20%E8%8E%B7%E5%8F%96%E5%90%88%E5%B9%B6%E4%BA%8B%E4%BB%B6%E4%B8%AA%E4%BA%BA%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/436726/GitLab%20%E8%8E%B7%E5%8F%96%E5%90%88%E5%B9%B6%E4%BA%8B%E4%BB%B6%E4%B8%AA%E4%BA%BA%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button')
    btn.style.position = 'absolute'
    btn.style.right = 0
    btn.style.top = '50%'
    btn.innerHTML = '点我复制'
    const clipboard = new ClipboardJS(btn, {
        text: () => {
            return getContent().join('\r\n');
        }
    })
    clipboard.on('success', () => {
        alert('复制成功')
    })
    document.body.appendChild(btn)
})();

function strHandle(str, replaceStr) {
    return str.replace(/[\n|\"]+/g, replaceStr);
}

function isCurrentDay(utcDateStr) {
    return new Date().toDateString() === new Date(Date.parse(utcDateStr)).toDateString()
}

function getContent() {
    const result = [];

    const currentUserName = strHandle(document.querySelector('.user-name').textContent, '');
    let eventItemList = document.querySelectorAll('.event-item');

    console.log(document.querySelectorAll('.event-item'));
    eventItemList.forEach(function(currentValue, currentIndex, listObj) {
        const eventAuthorName = currentValue.querySelector('.author_name').textContent;
        if (eventAuthorName === currentUserName) {
            const eventTitle = currentValue.querySelector('.event-title')
            const timestamp = currentValue.querySelector('.event-item-timestamp time').dateTime;
            const projectName = strHandle(eventTitle.querySelector('.project-name').textContent, '');
            const link = strHandle(eventTitle.querySelector('.event-target-link').textContent, ' ');

            if (isCurrentDay(timestamp)) {
                result.push(`- 合并 ${projectName} 代码 ${link}`);
            }
        }
    })

    return result;
}