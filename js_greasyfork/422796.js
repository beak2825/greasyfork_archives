// ==UserScript==
// @name         腾讯课堂复读机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  腾讯课堂复读机，连续3条相同信息则复读，并弹出通知
// @author       Osennyaya
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422796/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%A4%8D%E8%AF%BB%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/422796/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%A4%8D%E8%AF%BB%E6%9C%BA.meta.js
// ==/UserScript==

var send_msg = (msg) => {
    $('.ql-editor > p')[0].innerHTML = msg;
    var func = () => {
        $('.text-editor-btn')[0].click();
    };
    setTimeout(func, 500);
};

// 复读
(function() {
    Notification.requestPermission();
    'use strict';
    var last_repeat = "";
    var timer_repeat = setInterval(() => {
        let messages = $(".chat-item-msg-content > span");
        let l = messages.length;
        if (l > 3) {
            if (messages[l-1].innerHTML === messages[l-2].innerHTML
                && messages[l-2].innerHTML === messages[l-3].innerHTML) {
                if (last_repeat !== messages[l-1].innerHTML) {
                    last_repeat = messages[l-1].innerHTML;
                    let str = `${new Date().toLocaleTimeString()} 复读 ${last_repeat}`;
                    console.log(str);
                    let noti = new Notification(str);
                    send_msg(last_repeat);
                }
            }
        }
    }, 3000);
})();