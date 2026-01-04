// ==UserScript==
// @name         重庆大学统一身份认证自动登录（新版）
// @author       Barry ZZJ
// @namespace    https://greasyfork.org/zh-CN/scripts/432058-%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95
// @icon         http://my.cqu.edu.cn/img/favicon.ico
// @version      1.1
// @description  自用，用户名和密码为明文存储，介意的话慎用！重置用户名密码方法：1.油猴插件设置->配置模式改为“高级”/"Advanced", 2.在已安装脚本中点开本脚本, 3.选择“存储”选项卡, 4.把reset的值改为true（注意拼写，不要带引号）, 5.点击“保存”。下次登陆后会更新存储内容。
// @author       barryZZJ
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *authserver.cqu.edu.cn/authserver/login*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/432058/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/432058/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E7%BB%9F%E4%B8%80%E8%BA%AB%E4%BB%BD%E8%AE%A4%E8%AF%81%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

function autoLogin () {
    const strusername = GM_getValue('username', null);
    const strpassword = GM_getValue('password', null);
    const reset = GM_getValue('reset', true);
    // const strusername = localStorage.getItem('username');
    // const strpassword = localStorage.getItem('password');

    // 修改提交方法，添加存储用户名和密码
    var casLoginForm = $("#casLoginForm");
    casLoginForm.find(':submit').text('永久免密登录');

    function doLoginNew() {
        var username = casLoginForm.find("#username");
        var password = casLoginForm.find("#password");
        var captchaResponse = casLoginForm.find("#captchaResponse");
        if (!checkRequired(username, "usernameError")) {
            username.focus();
            return false;
        }
        if (!checkRequired(password, "passwordError")) {
            password.focus();
            return false;
        }
        if (!checkRequired(captchaResponse, "cpatchaError")) {
            captchaResponse.focus();
            return false;
        }
        encryptPassword(password.val());
        // 储存用户名和密码
        GM_setValue('username', username.val());
        GM_setValue('password', password.val());
        GM_setValue('reset', false);
        // localStorage.setItem('username', username.val());
        // localStorage.setItem('password', password.val());
        console.log('已记住用户名密码');
    }
    casLoginForm.submit(doLoginNew);

    if (!strusername || !strpassword || reset) {
        console.log("统一身份认证自动登录已关闭");
    } else {
        console.log("使用存储的用户名密码登录");
        $("#username").val(strusername);
        $("#password").val(strpassword);
        casLoginForm.submit();
    }
}

(function () {
    'use strict';
    // window.addEventListener("load", autoLogin, {once:true});
    window.addEventListener("load", autoLogin, false);
})();