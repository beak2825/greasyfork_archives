// ==UserScript==
// @name         kdb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  开店宝自动回复
// @author       liruitao
// @license      MIT
// @match        https://g.dianping.com/dzim-main-pc/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513533/kdb.user.js
// @updateURL https://update.greasyfork.org/scripts/513533/kdb.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setInterval(()=>{
        window.location.reload()
    }, 7200000)

    setInterval(async () => {
        // iframe元素
        const iframe = document.querySelector('wujie-app').shadowRoot
        // root元素
        const rootDom = iframe.children[0].querySelector('#root')
        // 聊天列表元素
        const chatListDom = rootDom.querySelectorAll('.dzim-chat-list-container .chat-list .list-container .chat-list-item-wrapper')
        chatListDom[5].click()

        // 聊天内容元素
        const chatContentDom = rootDom.querySelector('.dzim-input-area .dzim-chat-input-wrapper .dzim-chat-input-container')
        // 发送按钮元素
        const sendBtnDom = rootDom.querySelector('.dzim-input-area .dzim-chat-input-wrapper .dzim-chat-input-send .dzim-button-primary')

        // console.log(chatContentDom);
        // console.log(sendBtnDom);

        // 遍历聊天列表元素
        for (let i = 0; i < chatListDom.length; i++) {
            const chatItemDom = chatListDom[i]
            const num = chatItemDom.querySelector('.chat-list-item .mtd-badge .mtd-badge-text').innerText
            if (num * 1 > 0) {
                // alert(num)
                chatItemDom.click()
                await sleep(2000)
                chatContentDom.innerText = '您好，了解详情请＋V，15091675035，不需要别加！！！'
                await sleep(1000)
                sendBtnDom.click()
                await sleep(500)
                chatListDom[5].click()
            }
        }
    }, 15000)
})();