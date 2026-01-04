// ==UserScript==
// @name         安全微课小猪手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  帮助你快乐的学习
// @author       Cloverkit
// @match        https://mcwk.mycourse.cn/*
// @grant        none
// @icon         https://kefu.easemob.com/v1/tenants/65145/mediafiles/2de941ba-2323-4d14-b4a0-8f77065caa415a6J5YWo5b6u5Ly05Zu-5qCHLnBuZw==/cutout?arg=0_0_200_200_300_300
// @downloadURL https://update.greasyfork.org/scripts/392499/%E5%AE%89%E5%85%A8%E5%BE%AE%E8%AF%BE%E5%B0%8F%E7%8C%AA%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392499/%E5%AE%89%E5%85%A8%E5%BE%AE%E8%AF%BE%E5%B0%8F%E7%8C%AA%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 调用 finishWxCourse() 方法完成微课学习
    window.finishWxCourse();
    // 返回上级网页
    history.go(-1);
})();