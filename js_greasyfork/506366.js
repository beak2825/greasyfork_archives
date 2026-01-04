// ==UserScript==
// @name 江西农业大学南昌商学院校园网
// @namespace http://10.255.255.1/
// @version 1
// @description 自动登录【农商·校园网】
// @license MIT
// @author Bahamut
// @include http://10.255.255.1/*
// @match http://10.255.255.1/*
// @match http://10.255.255.1/a79.htm
// @require http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/506366/%E6%B1%9F%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%8D%97%E6%98%8C%E5%95%86%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/506366/%E6%B1%9F%E8%A5%BF%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%8D%97%E6%98%8C%E5%95%86%E5%AD%A6%E9%99%A2%E6%A0%A1%E5%9B%AD%E7%BD%91.meta.js
// ==/UserScript==
window.onload = function() {
    var username = "这里填账号";//这里填账号
    var password = "这里填密码";//这里填密码，下面不要改
    if (username == "这里填账号" || password == "这里填密码") {
        alert("请去用户脚本管理器中，找到此脚本的第 11，12 行代码，添加自己的账号与密码，记得更改运营商");
    } else {
        if (document.title == '上网登录页'){
            setTimeout(function(){
                $( "input[name='DDDDD']").attr("value",username);
                $( "input[name='upass']").attr("value",password);
                var operatorSelect = document.querySelector("select[name='ISP_select']");
                if (operatorSelect.value !== "@telecom") {
                    operatorSelect.value = "@telecom";//这里修改运营商还有上面@telecom是电信,@cmcc是移动
                }
                ee(1);
            },600);
        }
    }
    // 每隔一秒检查一次页面元素
    var checkLoginStatus = setInterval(function() {
        var successDiv = document.querySelector('div[name="PageTips"]');
        if (successDiv && successDiv.textContent === '您已经成功登录。') {
            window.location.href = "https://ntp.msn.cn/edge/ntp?locale=zh-cn&dsp=0&sp=Google"; // 登录成功后跳转到 "edge://newtab/"
            clearInterval(checkLoginStatus); // 停止检查
        }
    }, 10);
}