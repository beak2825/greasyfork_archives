// ==UserScript==
// @name         JIRA空间看板修改
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  jira的看板的显示排列方式我不喜欢，提供方无法修改，我就自己改一改
// @author       You
// @match        */secure/RapidBoard.jspa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dotfashion.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445362/JIRA%E7%A9%BA%E9%97%B4%E7%9C%8B%E6%9D%BF%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/445362/JIRA%E7%A9%BA%E9%97%B4%E7%9C%8B%E6%9D%BF%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let tryNum = 0

    /** 因为有些页面issue太多，jira请求返回时间较长，如果在onLoad后500ms只执行一次的话，可能此时页面issues仍然没有加载，所以做了连续尝试 */
    function 尝试修改看板布局(key) {
        tryNum += 1;
        if(tryNum > 5) {
            clearInterval(key);
            // 超过了指定次数，终止尝试
            return;
        }
        const issue列表容器DivList = document.querySelectorAll(
            '.ghx-issues.js-issue-list'
        );
        if (!issue列表容器DivList || issue列表容器DivList.length === 0) return;
        clearInterval(key);
        for (let i = 0; i < issue列表容器DivList.length; i++) {
            const issue列表容器 = issue列表容器DivList[i];
            const issue列表Div = issue列表容器.querySelectorAll('.js-issue');
            if (!issue列表Div || issue列表Div.length === 0) continue;
            const 未完成issueDiv列表 = [];
            const 已完成issueDiv列表 = [];
            for (let j = 0; j < issue列表Div.length; j++) {
                const issueDiv = issue列表Div[j];
                if (issueDiv.classList.contains('ghx-done')) {
                    issueDiv.style.color = 'rgba(0,0,0,0.5)';
                    const idKey = issueDiv.querySelector('.ghx-key');
                    if (idKey) idKey.style.opacity = 0.5;
                    已完成issueDiv列表.push(issueDiv);
                } else {
                    issueDiv.style.fontWeight = 'bold';
                    未完成issueDiv列表.push(issueDiv);
                }
                issue列表容器.removeChild(issueDiv);
            }
            未完成issueDiv列表.sort((a, b) =>
                               +a.getAttribute('data-issue-id') < +b.getAttribute('data-issue-id')
                               ? 1
                               : -1
                              );
            已完成issueDiv列表.sort((a, b) =>
                               +a.getAttribute('data-issue-id') < +b.getAttribute('data-issue-id')
                               ? 1
                               : -1
                              );
            未完成issueDiv列表.forEach(d => {
                issue列表容器.appendChild(d);
            });
            已完成issueDiv列表.forEach(d => {
                issue列表容器.appendChild(d);
            });
        }
    }

    const key = setInterval(() => {
        尝试修改看板布局(key);
    }, 500);
})();