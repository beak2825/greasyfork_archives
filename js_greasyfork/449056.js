// ==UserScript==
// @name         重庆大学校园网 自动登录
// @version      0.3
// @description  自动登录【重庆大学校园网】
// @author       Tosh/Douglas
// @match      http://10.254.7.4
// @include      http://10.254.7.4/0.htm
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license MIT
// @namespace https://greasyfork.org/users/939662
// @downloadURL https://update.greasyfork.org/scripts/449056/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/449056/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==


var username = "你的校园网账号";
var password = "你的校园网密码";

if (username == "这里填账号" || password == "这里填密码") {
    alert("请去用户脚本管理器中，找到此脚本的第 14、15 行代码，添加自己的账号与密码");
} else {
    (function() {
        if (document.title == '上网登录页'){
            setTimeout(function(){
                $( "input[name='DDDDD']").attr("value",username);
                $( "input[name='upass']").attr("value",password);
                ee(1);
            },1000);
        }
    })();
}

// Hello my friend, this is my contact information, welcome to advise
// Blog:    https://www.cnblogs.com/rsmx/
// GitHub:  https://github.com/Douglasdai
// Date:    2022-07-27 00：05