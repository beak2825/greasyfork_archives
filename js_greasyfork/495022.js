// ==UserScript==
// @name         qiyu 注入测试
// @namespace    http://tampermonkey.net/
// @version      2024-05-15
// @description  拦截用户发送消息
// @author       You
// @match        https://qiyukf.com/client*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/495022/qiyu%20%E6%B3%A8%E5%85%A5%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495022/qiyu%20%E6%B3%A8%E5%85%A5%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var map = {};

    function callback() {
        try {
            var nodeList = document.querySelectorAll('.msg_right .text.msg_bubble p');
            for (var i = 0; i < nodeList.length; i++) {
                var text = nodeList[i].textContent;
                if (!map[text]) {
                    map[text] = 1;
                    console.log('[dai-inject:新消息]', text);
                }
            }
        } catch (e) { }
    }

    document.addEventListener('click', function (event) {
        try {
            if (event.target.className == 'u-btn sendbtn j-send') {
                var text = event.target.parentNode.getElementsByTagName('textarea')[0].value;
                map[text] = 1;
                console.log('[dai-inject:发送]', text);
            }
        } catch (e) { }
    }, true);

    callback();

    try {
        const observer = new MutationObserver(callback)
        observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) { }
})();