// ==UserScript==
// @name         bilibili直播聊天蒙版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按钮屏蔽直播间聊天框
// @author       isuminohana
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455390/bilibili%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E8%92%99%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455390/bilibili%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E8%92%99%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';


function add_button() {
    const btn_wrap = document.getElementsByClassName('right-ctnr')[0] && document.getElementsByClassName('right-ctnr')[0]|| null;
    // console.log("btn_wrap", document.getElementsByClassName('right-ctnr'))
     if (!btn_wrap) {
         console.log("当前页面不是直播间！")
       return;
     }
    const btn = document.createElement('button');
    btn.innerText = '蒙版开关';
    btn.className = 'cover_btn';

    btn.onclick = function () {
        let chat_channel_mask = document.getElementById("chat_channel_mask") || null;
        // console.log("chat_channel_mask", chat_channel_mask);
        if (chat_channel_mask) {
            console.log("remove mask")
            chat_channel_mask.remove();
        } else {
            chat_channel_mask = document.createElement("div");
            chat_channel_mask.id = "chat_channel_mask";
            chat_channel_mask.style.width = "100%";
            chat_channel_mask.style.height = "100%";
            chat_channel_mask.style.backgroundColor = "#000";
            chat_channel_mask.style.position = "absolute";
            chat_channel_mask.style.top = 0;
            chat_channel_mask.style.zIndex = 1111;

            chat_channel_mask.onclick = function () {
              chat_channel_mask.remove();
            };
            document.getElementById("aside-area-vm").appendChild(chat_channel_mask);
        }
    }
    btn_wrap.appendChild(btn);
}
setTimeout(()=> {
    add_button()
}, 3000)

})();