// ==UserScript==
// @name         腾讯课堂回答举手点名通知助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  腾讯课堂回答举手点名通知助手，建议配合腾讯课堂签到助手使用
// @author       PopChicken & Osennyaya
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422789/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%9B%9E%E7%AD%94%E4%B8%BE%E6%89%8B%E7%82%B9%E5%90%8D%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422789/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%9B%9E%E7%AD%94%E4%B8%BE%E6%89%8B%E7%82%B9%E5%90%8D%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var state = {
    Hand: false,
    Calling: false,
    Answering: false,
};

var loaded = false;
var refresh_timeout = 50;

var isHand = () => {
    return $('#hand-new').attr('class') === 'show';
};

var isCalling = () => {
    return $('.device-dialog-wrapper').attr('class') === 'device-dialog-wrapper show'
}

var isSomeoneAnswering = () => {
    let elem = document.querySelector('.stream-list');
    let count = elem.childElementCount;
    return count > 1;
}

var check = (func, state_name, warning_str) => {
    if(func() && !state[state_name]) {
        state[state_name] = true;
        let notification = new Notification(warning_str)
    }
    if(!func() && state[state_name]) {
        state[state_name] = false;
    }
}

(function() {
    Notification.requestPermission();
    setInterval(() => {
        check(isHand, 'Hand', '老师开放举手了');
        check(isCalling, 'Calling', '🚨🚨🚨 老师正在点你的名！！ 🚨🚨🚨');
        check(isSomeoneAnswering, 'Answering', '有人正在上台回答问题');
    }, 3000);
})();

(() => {
    setTimeout(() => {
        let chat = document.querySelector('.ke_overlay');
        if (chat != null) {
            if (loaded) {
                refresh_timeout--;
            }
            if (refresh_timeout > 0) {
                location.reload();
            } 
        } else {
            loaded = true;
        }
    }, 5000)
})();