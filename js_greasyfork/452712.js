// ==UserScript==
// @name         显示微信公众号 biz
// @namespace    https://www.iowen.cn/
// @version      0.5
// @description  在搜狗搜索微信微信公众号，在公众号文章页里显示公众号 biz，示例：https://weixin.sogou.com/weixin?type=2&query=%E6%BD%87%E6%B9%98%E6%99%A8%E6%8A%A5
// @author       iowen
// @match        *://mp.weixin.qq.com/s*
// @icon         data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTMxOS4zMDIgMzg1LjM5NmEzMy41MTMgMzMuNTEzIDAgMSAwIDY3LjAyNSAwIDMzLjUxMyAzMy41MTMgMCAxIDAtNjcuMDI1IDB6TTQ2OS4xNzggMzg0LjQ2NWEzMy41MTMgMzMuNTEzIDAgMSAwIDY3LjAyNiAwIDMzLjUxMyAzMy41MTMgMCAxIDAtNjcuMDI2IDB6TTU1Mi45NTk5OTk5OTk5OTk5IDUzNC4zNDJhMjMuMjczIDIzLjI3MyAwIDEgMCA0Ni41NDUgMCAyMy4yNzMgMjMuMjczIDAgMSAwLTQ2LjU0NSAwek02NzEuMTg1IDUzNi4yMDRhMjMuMjczIDIzLjI3MyAwIDEgMCA0Ni41NDYgMCAyMy4yNzMgMjMuMjczIDAgMSAwLTQ2LjU0NiAweiIgZmlsbD0iIzUwQjY3NCIvPjxwYXRoIGQ9Ik01MTIgMEMyMjkuMDA0IDAgMCAyMjkuMDA0IDAgNTEyczIyOS4wMDQgNTEyIDUxMiA1MTIgNTEyLTIyOS4wMDQgNTEyLTUxMlM3OTQuOTk2IDAgNTEyIDB6bS04Ny41MDUgNjMwLjIyNWMtMjYuOTk3IDAtNDguNDA4LTUuNTg1LTc1LjQwNC0xMS4xN2wtNzUuNDA0IDM3LjIzNiAyMS40MTEtNjQuMjMzYy01My45OTMtMzcuMjM2LTg1LjY0My04NS42NDMtODUuNjQzLTE0NS4yMjIgMC0xMDIuNCA5Ni44MTQtMTgyLjQ1OCAyMTUuMDQtMTgyLjQ1OCAxMDUuMTkyIDAgMTk4LjI4MyA2NC4yMzMgMjE2LjkwMSAxNTAuODA3LTYuNTE2LS45My0xMy45NjMtLjkzLTIwLjQ4LS45My0xMDIuNCAwLTE4Mi40NTggNzYuMzM0LTE4Mi40NTggMTcwLjM1NiAwIDE1LjgyNSAyLjc5MyAzMC43MiA2LjUxNyA0NC42ODQtNy40NDggMC0xMy45NjQuOTMtMjAuNDguOTN6bTMxNC42NDcgNzUuNDA0bDE1LjgyNSA1My45OTMtNTguNjQ3LTMyLjU4MmMtMjEuNDEgNS41ODUtNDIuODIyIDExLjE3LTY0LjIzMyAxMS4xNy0xMDIuNCAwLTE4Mi40NTgtNjkuODE3LTE4Mi40NTgtMTU1LjQ2czgwLjA1OC0xNTUuNDYzIDE4Mi40NTgtMTU1LjQ2M2M5Ni44MTUgMCAxODIuNDU4IDY5LjgxOCAxODIuNDU4IDE1NS40NjIgMCA0Ny40NzYtMzEuNjUgOTAuMjk4LTc1LjQwMyAxMjIuODh6IiBmaWxsPSIjNTBCNjc0Ii8+PC9zdmc+
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452712/%E6%98%BE%E7%A4%BA%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%20biz.user.js
// @updateURL https://update.greasyfork.org/scripts/452712/%E6%98%BE%E7%A4%BA%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%20biz.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    GM_addStyle(`
        .biz-box{
            display: table;
            color: var(--weui-FG-2);
            margin-bottom: 5px;
        }
        .biz-id {
            font-size: 14px;
            color: #e56868;
            background: #a8959526;
            padding: 2px 15px;
            border-radius: 20px;
            margin-left: 10px;
            cursor: pointer;
        }
        .copied-notification {
            font-size: 12px;
            color: green;
            margin-left: 10px;
        }
    `);
    let start = function () {
        let html = document.createElement('div');
        html.className = 'biz-box';

        let bizSpan = document.createElement('span');
        bizSpan.className = 'biz-id';
        bizSpan.textContent = biz;

        let notification = document.createElement('span');
        notification.className = 'copied-notification';
        notification.textContent = '已复制!';
        notification.style.display = 'none';

        html.innerHTML = `biz: `;
        html.appendChild(bizSpan);
        html.appendChild(notification);

        let parent = document.getElementsByClassName('rich_media_meta_list')[0];
        parent.parentNode.insertBefore(html, parent);

        bizSpan.addEventListener('click', function() {
            navigator.clipboard.writeText(biz).then(function() {
                notification.style.display = 'inline';
                setTimeout(function() {
                    notification.style.display = 'none';
                }, 2000);
            });
        });
    }
    sleep(200).then(() => {
        start();
    })
})();
