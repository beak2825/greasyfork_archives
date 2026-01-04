// ==UserScript==
// @name         V2EX帖子盖楼显示
// @version      0.1
// @description  V2EX帖子盖楼，高亮楼主回复，浏览帖子更直观！添加对翻页类脚本的兼容
// @include      http*://*v2ex.com/t/*
// @icon         http://www.v2ex.com/favicon.ico
// @namespace    https://greasyfork.org/users/767596
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516214/V2EX%E5%B8%96%E5%AD%90%E7%9B%96%E6%A5%BC%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/516214/V2EX%E5%B8%96%E5%AD%90%E7%9B%96%E6%A5%BC%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function highlightReplies() {
        // 楼层数
        let floor = $('div.cell > table > tbody > tr > td:nth-child(3) > div.fr > span').get().map(i => i.innerHTML);
        // 回复文本
        let reply_text = $('div.cell > table > tbody > tr > td:nth-child(3) > div.reply_content').get().map(i => i.innerHTML);
        // 用户名称
        let username = $('div.cell > table > tbody > tr > td:nth-child(3) > strong > a');
        // 用户名称文本
        let username_text = username.get().map(i => i.innerHTML);
        // 完整楼层桌面端
        let reply_block = $('#Main > div:nth-child(4) > div[id].cell');
        // 完整楼层移动端
        reply_block = reply_block.length ? reply_block : $('#Wrapper > div.content > div:nth-child(5) > div[id].cell');
        // 适配 Safari 移动端
        reply_block = reply_block.length ? reply_block : $('#Wrapper > div.content > div:nth-child(3) > div[id].cell');
        // 楼主名称桌面端
        let poster = $('#Main > div:nth-child(2) > div.header > small > a')[0];
        // 楼主名称移动端
        poster = poster ? poster.innerHTML : $('#Wrapper > div > div:nth-child(1) > div.header > small > a')[0].innerHTML;
        // 自己名称
        let self = $('#Rightbar > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody > tr > td:nth-child(3) > span > a')
        self = self.length ? self[0].innerHTML : null;

        let i = 1;
        // 遍历所有楼层
        while (i < reply_block.length) {
            // 回复内容包含楼上
            if (reply_text[i].match("楼上")) {
                reply_block[i - 1].append(reply_block[i]);
                username[i].setAttribute('style', 'color:#8e44ad');
            }

            // 向上遍历
            for (let j = i - 1; j >= 0; j--) {
                // 回复内容包含别人的 ID
                if (reply_text[i].match(username_text[j])) {
                    reply_block[j].append(reply_block[i]);
                    username[i].setAttribute('style', 'color:#8e44ad');
                    break;
                }
            }

            // 楼主回复高亮为绿色
            if (username_text[i] === poster) {
                username[i].setAttribute('style', 'color:#78f07e');
            }
            // 自己回复高亮为粉色
            else if (username_text[i] === self) {
                username[i].setAttribute('style', 'color:#ff6b81');
            }
            i++;
        }
    }

    // 初始调用
    highlightReplies();

    // 监听新楼层加载
    const observer = new MutationObserver(highlightReplies);
    const targetNode = document.querySelector('#Main') || document.querySelector('#Wrapper > div.content');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }
})();