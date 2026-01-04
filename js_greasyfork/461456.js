// ==UserScript==
// @name         Bilibili直播弹幕发送失败显示提示
// @namespace    https://greasyfork.org/users/236434
// @version      0.0.1
// @description  当弹幕发送失败（如被拦截）时在弹幕栏显示提示及原因
// @author       astrile
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461456/Bilibili%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E5%A4%B1%E8%B4%A5%E6%98%BE%E7%A4%BA%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461456/Bilibili%E7%9B%B4%E6%92%AD%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E5%A4%B1%E8%B4%A5%E6%98%BE%E7%A4%BA%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkCommentRsp = async (requestData, response) => {
        const rsp = await response.clone().json();
        if (rsp.code === 0 && rsp.msg) {
            rsp.msg = {
                'f': "弹幕含全局屏蔽词",
                'fire': "弹幕含全局屏蔽词",
                'k': "弹幕含房间屏蔽词",
                "max limit exceeded": "当前房间弹幕流量过大",
            }[rsp.msg] || rsp.msg;
            const e = document.createElement("div");
            e.className = "chat-item convention-msg border-box";
            e.innerText = '弹幕发送失败：' + rsp.msg;
            document.querySelector('#chat-items').appendChild(e);
        }
    }

    const origFetch = window.fetch;
    window.fetch = async function() {
        const url = arguments[0];
        if (url.match('api.live.bilibili.com/msg/send')) {
            const data = arguments[1].data;
            const response = await origFetch.apply(this, arguments);
            checkCommentRsp(data, response.clone());
            return response;
        } else {
            return origFetch.apply(this, arguments);
        }
    }

})();