// ==UserScript==
// @name         中国农业大学·校园网 自动登录
// @namespace    Jia.ys
// @version      1.1
// @description  自动登录【中国农业大学·校园网】
// @author       Tosh
// @include      http://10.3.191.8/
// @include      http://10.3.191.9/
// @include      http://10.3.38.7/
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/412163/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%C2%B7%E6%A0%A1%E5%9B%AD%E7%BD%91%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/412163/%E4%B8%AD%E5%9B%BD%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%C2%B7%E6%A0%A1%E5%9B%AD%E7%BD%91%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// 如果你想注销后也自动登录，请将这两行代码插入第7行
// @include      http://10.3.191.8/a79.htm
// @include      http://10.3.191.8/a79.htm?isReback=*

var username = "这里填账号";
var password = "这里填密码";

if (username == "这里填账号" || password == "这里填密码") {
    alert("请去用户脚本管理器中，找到此脚本的第 15、16 行代码，添加自己的账号与密码");
} else {
    (function() {
        if (document.title == '上网登录页'){
            setTimeout(function(){
                $( "input[name='DDDDD']").attr("value",username);
                $( "input[name='upass']").attr("value",password);
                ee(1);
            },600);
        }
    })();
}

// Hello my friend, this is my contact information, welcome to advise
// Blog:    https://www.cnblogs.com/rsmx/
// GitHub:  https://github.com/JiaYunSong
// Date:    2020-09-28 21:52