// ==UserScript==
// @name         中国农业大学学吧 自动登录
// @namespace    Jia.ys
// @version      1.0
// @description  自动登录【中国农业大学学吧】
// @author       Tosh
// @include      http://studybar.cau.edu.cn/login/index.php
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/418833/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%AD%A6%E5%90%A7%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/418833/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%AD%A6%E5%90%A7%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

var username = "这里填账号";
var password = "这里填密码";

if (username == "这里填账号" || password == "这里填密码") {
    alert("请去用户脚本管理器中，找到此脚本的第 11，12 行代码，添加自己的账号与密码");
} else {
    (function() {
        setTimeout(function(){
            $( "input[name='username']").attr("value",username);
            $( "input[name='password']").attr("value",password);
            document.getElementById("username").value = username;
            document.getElementById("password").value = password;
            document.getElementById("loginbtn").click();
        },1000);
    })();
}

// Hello my friend, this is my contact information, welcome to advise
// Blog:    https://www.cnblogs.com/rsmx/
// GitHub:  https://github.com/JiaYunSong
// Date:    2020-12-19 17:29