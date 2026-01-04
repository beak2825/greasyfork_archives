"use strict";
// ==UserScript==
// @name         MT 论坛自动回帖
// @namespace    http://tampermonkey.net/
// @version      2024-05-02-2
// @description  自动回复
// @author       You
// @match        https://bbs.binmt.cc/thread-*
// @match        https://bbs.binmt.cc/forum.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=binmt.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493978/MT%20%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493978/MT%20%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96.meta.js
// ==/UserScript==
(function () {
    var config = {
        /** 随机回复文本 */
        texts: ['路过看看', '感谢分享', '值得一读', '让我看看'],
        /** 每条评论间隔时间 */
        waitTime: 15000,
    };
    try {
        var randText = function () { return config.texts[Math.floor(Math.random() * config.texts.length)]; };
        var textarea = document.getElementById('fastpostmessage');
        textarea.value = randText();
        var button = document.getElementById('fastpostsubmit');
        button.click();
    }
    catch (error) { }
    setTimeout(function () {
        document.title = '正在自动评论...';
        window.scrollTo(0, document.body.scrollHeight);
    }, 1000);
    setTimeout(function () {
        document.querySelector('.comiis_sxy a:nth-child(2)').click();
    }, config.waitTime);
})();
