// ==UserScript==
// @name         hnai
// @namespace    http://tampermonkey.net/
// @version      24.0921.A
// @description  Supports English and Chinese based on user language settings.
// @description:cn 好好学习，天天向上。
// @author       symo.chan
// @run-at       document-start
// @match             *://*.youku.com/*
// @match             *://*.iqiyi.com/*
// @match             *://*.iq.com/*
// @match             *://*.le.com/*
// @match             *://v.qq.com/*
// @match             *://m.v.qq.com/*
// @match             *://*.tudou.com/*
// @match             *://*.mgtv.com/*
// @match             *://tv.sohu.com/*
// @match             *://film.sohu.com/*
// @match             *://*.1905.com/*
// @match             *://*.bilibili.com/*
// @match             *://*.pptv.com/*
// @match             *://haokan.baidu.com/*
// @match             *://mbd.baidu.com/*
// @match             *://*.douyin.com/*
// @match             *://shequ.codemao.cn/*
// @match             *://poki.com/*
// @match             *://www.4399.com/*
// @match             *://*.2345.com/*
// @match             *://*.microsoft.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT表
// @downloadURL https://update.greasyfork.org/scripts/508421/hnai.user.js
// @updateURL https://update.greasyfork.org/scripts/508421/hnai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 设置标志位
    localStorage.setItem('scriptEnabled', true);

    // 检测页面卸载时移除标志位
    window.onbeforeunload = function() {
        localStorage.removeItem('scriptEnabled');
    };

    // 定期检查
    setInterval(() => {
        if (!localStorage.getItem('scriptEnabled')) {
            alert('请勿离开教学与练习平台，您的行为已经上报并通知 程慧玩 老师。');
        }
    }, 5000); // 每5秒检查一次



    // Your code here...
    window.location.replace("https://www.hnai.net");

})();