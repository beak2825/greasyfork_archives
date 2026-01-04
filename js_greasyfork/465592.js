// ==UserScript==
// @name 湖南电子科技职业学院【校园网】自动登陆
// @namespace https://selfcreator8.top
// @version 0.1
// @description 仅仅提供湖南电子科技职业学院校园网的保存密码及自动登陆。
// @author Mr.Y
// @match http://10.0.0.17/*
// @icon https://s1.ax1x.com/2022/06/21/jSfJBV.png
// @icon64 https://s1.ax1x.com/2022/06/21/jSfJBV.png
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465592/%E6%B9%96%E5%8D%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E3%80%90%E6%A0%A1%E5%9B%AD%E7%BD%91%E3%80%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/465592/%E6%B9%96%E5%8D%97%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%AD%A6%E9%99%A2%E3%80%90%E6%A0%A1%E5%9B%AD%E7%BD%91%E3%80%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //用户自定义
    var usr="这里填写校园网账号" //账号
    var pwd="这里填密码(默认6个6)" //密码

    //↓重要代码，请勿修改。↓
    if (usr === "这里填写校园网账号" || pwd == "这里填密码(默认6个6)") {
        alert("请去用户脚本管理器中，找到此脚本的第 15、16 行代码，添加自己的账号与密码");
    } else{
        $("input[placeholder='账号']").val(usr); //填写账号
        $("input[placeholder='密码']").val(pwd); //填写密码
        $("input[value='@unicom']").click(); //选择运营商
        $("input[value='登录']").click(); //点击登录按钮
    }
})();