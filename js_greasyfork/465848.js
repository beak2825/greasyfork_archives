// ==UserScript==
// @name         freebuf 移动端网页跳转
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  freebuf mobile 页面自动跳转到PC页面
// @author       nishikinor
// @icon         https://picx.zhimg.com/f1e4654976c94bb259221f43e301527b.jpg
// @grant        none
// @match        *://m.freebuf.com/*
// @run-at       document start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465848/freebuf%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/465848/freebuf%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%BD%91%E9%A1%B5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let url = new URL(location.href);
    let reg = /m\.freebuf\.com*/;
    if(reg.test(url.hostname)){
        window.stop();
        let target = url.hostname.split('.').slice(1).join('.');
        url.hostname = "www." + target;
        location.assign(url.href)

    }
})();