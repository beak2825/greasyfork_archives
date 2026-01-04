// ==UserScript==
// @name         高新学校校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  打开校园网登录页会自动填充登录，登录完成后会自动关闭页面
// @author       不吃饭的小涛
// @match        *://10.69.69.1/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445410/%E9%AB%98%E6%96%B0%E5%AD%A6%E6%A0%A1%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445410/%E9%AB%98%E6%96%B0%E5%AD%A6%E6%A0%A1%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    // *************   在单引号中输入你的信息   *************
    // 输入你的学号
    var username = '';
    // 输入你的密码
    var password = '';
    // *************   在单引号中输入你的信息   *************



    if (window.location.pathname === "/portal/usertemp_computer/gxjxzyxy-pc-charge/logout.html") {
        window.open("about:blank","_self").close();
    }

    var Username = document.querySelector('#userid');
    var Password = document.querySelector('#passwd');

    Username.value = username;
    Password.value = password;


    setTimeout(function() {
        if (window.location.host === '10.69.69.1') {
            document.querySelector('.modal-footer').querySelector('button').click();
            // 如果账号密码都填写
            if (Username.value && Password.value) {
                // 同意协议
                document.querySelector('#read').click();
                // 如果信息输全，则触发登录按钮
                document.querySelector('#loginsubmit').click();
            } else {
                alert('你的信息没有填全');
                return false;
            }
        }
    })
    
})();