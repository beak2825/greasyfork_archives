// ==UserScript==
// @name         自学考试报名网站自动登录脚本
// @icon         https://www.rjno1.com/wp-content/themes/moban/favicon.ico
// @version      0.1
// @namespace    https://shileiye.com
// @description  点击登录按钮后程序以每秒5次进行自动提交直到登录成功，无须手动。
// @author       shileiye
// @include      https://zk.sceea.cn/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449618/%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449618/%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    "use strict";
    window.onload = document.getElementById('btn_login').removeEventListener('click',login(),false);
    document.getElementById('btn_login').addEventListener('click',function(){setInterval(autologin,200);},false);
})();

function autologin() {
    var name = $("#txtName").val();
    var pwd = $("#txtPwd").val();
    var code = $("#txtCode").val();
    if (name.length < 6) {
        setErrMsg("身份证件位数不正确！");
        return
    }
    if (pwd.length == 0) {
        setErrMsg("密码不能为空！");
        return
    }
    if (yzm == 1 && code.length == 0) {
        setErrMsg("验证码不能为空！");
        return
    }
    $.ajax({
        url: "/RegExam/elogin?resourceId=login",
        dataType: "json",
        cache: false,
        async: true,
        type: "POST",
        data: {
            name: name,
            code: code,
            pwd: pwd
        },
        success: function (data) {
            if (data == 1) {
                window.location.replace("/RegExam/switchPage?resourceId=view")
            } else {
                $("#btn_login").removeAttr("disabled");
                hideLoading()
            }
        }
    })
}