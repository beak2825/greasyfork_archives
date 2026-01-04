// ==UserScript==
// @name         【聊天室自动变色】
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  炫酷的，让你每说一句话就换个随机的颜色
// @author       FyraTree
// @match        *://hack.chat/?*
// @match        *://tanchat.fun/?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/456817/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8A%A8%E5%8F%98%E8%89%B2%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/456817/%E3%80%90%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%87%AA%E5%8A%A8%E5%8F%98%E8%89%B2%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var send_ = send
    send = function (x) {
        send_({ cmd: 'changecolor', color: Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, "0") })
        send_(x)
    }
})();