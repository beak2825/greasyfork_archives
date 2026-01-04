// ==UserScript==
// @name 郑州轻工业大学ZZULI校园网自动登录
// @namespace https://selfcreator8.top
// @version 1.2
// @description 仅仅提供郑州轻工业大学校园网的保存密码及自动登陆。
// @author yufrank
// @match http://10.168.6.10/*
// @icon  https://www.google.com/s2/favicons?sz=64&domain=6.10
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480102/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6ZZULI%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480102/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6ZZULI%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //用户自定义
    //运营商匹配规则
    // 校园网：@zzulis
    // 校园移动：@cmcc
    // 校园联通：@unicom
    // 校园单宽：@other
    var optionValue = "@zzulis"; //选择你的运营商
    var usr="这里填写校园网账号" //学号
    var pwd="这里填密码(默认6个6)" //密码

 
    //↓重要代码，请勿修改。↓
    if (usr === "这里填写校园网账号" || pwd == "这里填密码(默认6个6)") {
        alert("请去用户脚本管理器中，找到此脚本的第 21、22、23 行代码，添加自己的账号、密码、运营商");
    } else{
        $("input[placeholder='学号']").val(usr); //填写账号
        $("input[placeholder='密码']").val(pwd); //填写密码
        $("select[name='ISP_select'] option[value='" + optionValue + "']").prop("selected", true);//选中运营商
        $("input[value='登 录']").click(); //点击登录按钮
    }



})();