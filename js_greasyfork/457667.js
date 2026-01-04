// ==UserScript==
// @name         编程猫防误禁言助手
// @namespace    https://shequ.codemao.cn/user/15753247
// @version      1.2.1
// @description  编程猫防止发言时出现“操作过于频繁，请1分钟后重试。”等（如果你被禁言了，使用这个插件是不会解除禁言的！）
// @author       QXN独立的暴风雀
// @match        *://shequ.codemao.cn/*
// @icon         https://shequ.codemao.cn/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/457667/%E7%BC%96%E7%A8%8B%E7%8C%AB%E9%98%B2%E8%AF%AF%E7%A6%81%E8%A8%80%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457667/%E7%BC%96%E7%A8%8B%E7%8C%AB%E9%98%B2%E8%AF%AF%E7%A6%81%E8%A8%80%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.pluginClick = false;
    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function onClick({ srcElement: e }) {
        if (!window.pluginClick) {
            window.pluginClick = true;
            e.click();
            await sleep(1000);
            let i = 1;
            const btnText = e.innerText;
            while (!['发布成功', '发表成功', '请填写5-50字的标题', '回帖内容至少2个字', '请输入2-200字的评论内容', '评论未找到', '回帖未找到', '帖子未找到'].includes(document.querySelector('#notices').textContent)) {
                i++;
                if (i % 10 === 0) {
                    e.innerText = '已自动点击' + i + '次';
                }
                e.click();
                await sleep(10);
            }
            e.innerText = btnText;
            console.log('编程猫防误禁言助手发送完成。');
            window.pluginClick = false;
        }
    }
    document.head.innerHTML += `<style>
.r-community-c-forum_sender--option, .r-community-r-detail--send_btn, .r-community-r-detail-c-comment_reply--reply_send {
    white-space: nowrap;
}
    </style>`
    setInterval(() => {
        document.querySelectorAll('.r-community-c-forum_sender--option, .r-community-r-detail--send_btn, .r-community-r-detail-c-comment_reply--reply_send').forEach(el => {
            el.removeEventListener('click', onClick);
            el.addEventListener('click', onClick);
        });
    }, 2000);
})();