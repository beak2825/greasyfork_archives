// ==UserScript==
// @name         自动登录测试-fengss766
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       书海天涯
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414741/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E6%B5%8B%E8%AF%95-fengss766.user.js
// @updateURL https://update.greasyfork.org/scripts/414741/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E6%B5%8B%E8%AF%95-fengss766.meta.js
// ==/UserScript==

(function() {
    if(document.getElementById('userBtn')!= 'fss'){
        'use strict';
        // 找到select
        window.location.href = 'http://172.16.10.200';
        //var select = document.getElementsById('userInput')[0];
        document.getElementById('userBtn').click();
        // 填写账号密码
        document.getElementById('userInput').value = 'fss';
        document.getElementById('pwdInput').value = 'fss';
        // 登录
        document.getElementById('btnLogin').click();
        // Your code here...
    }

})();