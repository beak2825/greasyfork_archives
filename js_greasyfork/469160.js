// ==UserScript==
// @name               屏蔽 Hornex 聊天区出现的 Florr 宣传语
// @namespace          让我们对刷屏使用炎拳吧
// @description        通过循环正则匹配的方式，来屏蔽在 Hornex 聊天区内出现的 Florr 宣传语
// @version            0.1.0
// @author             Tinhone
// @license            GPL-3.0
// @match              *://*.hornex.pro/
// @grant              none
// @compatible         firefox V35+
// @compatible         edge V35+
// @compatible         chrome V35+
// @icon               https://hornex.pro/icons/icon-256x256.png
// @downloadURL https://update.greasyfork.org/scripts/469160/%E5%B1%8F%E8%94%BD%20Hornex%20%E8%81%8A%E5%A4%A9%E5%8C%BA%E5%87%BA%E7%8E%B0%E7%9A%84%20Florr%20%E5%AE%A3%E4%BC%A0%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/469160/%E5%B1%8F%E8%94%BD%20Hornex%20%E8%81%8A%E5%A4%A9%E5%8C%BA%E5%87%BA%E7%8E%B0%E7%9A%84%20Florr%20%E5%AE%A3%E4%BC%A0%E8%AF%AD.meta.js
// ==/UserScript==

(function() {
    'use strict'
    function dq(query) { return document.querySelector(query) }
    function dqa(query) { return document.querySelectorAll(query) }

    const searchChatContent=setInterval(()=>{ if(dq("html body.desktop div.common div.chat div.chat-content")){ clearInterval(searchChatContent) }},100)
    const searchChatItem=setInterval(()=>{ if(dq("html body.desktop div.common div.chat div.chat-content div.chat-item")){ clearInterval(searchChatItem) }},100)
    const chatContent=dq("html body.desktop div.common div.chat div.chat-content")

    const main=setInterval(()=>{
        const ChatItem=dqa("html body.desktop div.common div.chat div.chat-content div.chat-item:not(.f89i5cm3)")
        for (let i of ChatItem){
            const chatText=i.querySelector("div.chat-text")
            if(!chatText){ continue }
            const chatTextContent=chatText.getAttribute("stroke")
            if(/PLAY FLORRIO/.test(chatTextContent)){ i.remove() }
            i.classList.add("f89i5cm3")
        }
    },100)
})()