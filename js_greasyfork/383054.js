// ==UserScript==
// @name         Jxnu jxnu_stu 自动选择中国移动
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  如需选择电信则将代码@cmcc处改为@ctcc
// @author       2015WUJI01
// @match        http://172.16.8.8/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383054/Jxnu%20jxnu_stu%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/383054/Jxnu%20jxnu_stu%20%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E4%B8%AD%E5%9B%BD%E7%A7%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('username').value = '2017*****'; //此处填写学号
    document.getElementById('password').value = '*********'; //此处填写密码
    document.getElementById('domain').value = '@cmcc'; //@cmcc:移动; @ctcc:电信; @jxnu:校园宽带; @cucc:联通
    document.getElementById('login').click(); //自动点击登录按钮

})();