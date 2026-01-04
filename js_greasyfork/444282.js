// ==UserScript==
// @name         自动登录长春大学校园网ccdx-wifi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录ccdx-wifi
// @author       Le_le
// @match        http://1.1.1.2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.2
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444282/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E9%95%BF%E6%98%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91ccdx-wifi.user.js
// @updateURL https://update.greasyfork.org/scripts/444282/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E9%95%BF%E6%98%A5%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91ccdx-wifi.meta.js
// ==/UserScript==
//第一次使用先登录校园网，然后在左上角设置脚本
(function() {
    console.log("脚本载入成功");
    if(location.href.substring(0,25)=="http://1.1.1.2/ac_portal/"){
        console.log("自动输入账号密码");
        var name=GM_getValue("name"); //输入你的账号
        var password=GM_getValue("password"); //密码
        var name_input=document.getElementById("password_name");
        name_input.value=name;
        var password_input=document.getElementById("password_pwd");
        password_input.value=password;
        document.getElementById("rememberPwd").checked="true";
        onPwdLogin();
    };
    if(location.href=="http://1.1.1.2/homepage/login.html"){
        location.href="http://1.1.1.2";
        console.log("返回旧版页面");

    };
    if(location.href=="http://1.1.1.2/homepage/tempermonkey"){
        var htm='<!doctype html><html><head><meta charset="utf-8"><title>脚本设置</title></head><body style="margin: 0"><div><p>本页面用于设置油猴脚本的自动登录</p><br><p style="float: left;margin: 0">账号</p><input style="margin: 0;" type="text"><br><p style="margin: 0;float: left">密码</p><input style="margin: 0;" type="password"><br><input type="checkbox">记住密码<br><button id="save">保存</button></div></body></html>';
        document.write(htm);
        document.close();
        $("#save").click(function(){
            console.log("正在保存账号密码");
            GM_setValue("name",$("input[type='text']").val());
            GM_setValue("password",$("input[type='password']").val());
            GM_setValue("rememberPwd",$("input[type='checkbox']").is(":checked"));
            alert("保存成功");
        });
    };
    if(location.href.substring(0,34)=="http://1.1.1.2/homepage/index.html"){
        $(".logo-img").before('<a href="tempermonkey" style="color:white">设置脚本</a>');
    }
    // Your code here...
})();