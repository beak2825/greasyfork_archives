// ==UserScript==
// @name         青海师范大学校园网自动登录
// @liscense     MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  仅支持青海师范大学校园网自动连接
// @author       nanshan 
// @match        http://192.168.199.24/srun_portal_pc?ac_id=2&theme=pro
// @downloadURL https://update.greasyfork.org/scripts/489485/%E9%9D%92%E6%B5%B7%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/489485/%E9%9D%92%E6%B5%B7%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 填写账号和密码
    document.getElementById('username').value = 'username'; // 替换成你的账号
    document.getElementById('password').value = 'password'; // 替换成你的密码

    // 选择中国移动作为运营商
    var operatorElement = document.querySelector('#domain option[value="0-@xs-cmcc-after"]');
    operatorElement.setAttribute('selected', 'selected');

    // 点击登录按钮
    document.getElementById("login-account").click()

})();