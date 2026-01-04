// ==UserScript==
// @name         qq邮箱自动输入独立密码
// @namespace    https://gitee.com/liu-long068/
// @version      0.2
// @description  自动输入qq邮箱的独立密码
// @author       echo
// @match        *://*.wx.mail.qq.com/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466782/qq%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E7%8B%AC%E7%AB%8B%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/466782/qq%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E7%8B%AC%E7%AB%8B%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
(function () {
    'use strict';
//     只针对本人使用
    document.querySelector('#pwdInput').value = 'love0608' //你的独立密码
    document.querySelector('#confirmButton').click()    //点击登录
})();