// ==UserScript==
// @name         炎黄盈动平台自定义菜单
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       haiifenng
// @match        http://192.168.0.10:81/*
// @match        https://my.awspaas.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370767/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/370767/%E7%82%8E%E9%BB%84%E7%9B%88%E5%8A%A8%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%AE%9A%E4%B9%89%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.$ == undefined){
        return;
    }
    if(window.sid == undefined){
        return;
    }
    var container = $(".nav-set-yourself-one");
    if (container.width()<600){
        container.width("600px");
    }
    var funArr = [
        {"title":"流程中心","navId":"obj_c867594519be463faadfe4e4a9aa25d1","url":"./w?sid=<#sid>&cmd=com.actionsoft.apps.workbench_main_page"},
        {"title":"快邮","navId":"obj_a21ada8c345445d8bdfb384cface0e96","url":"./w?sid=<#sid>&cmd=com.actionsoft.apps.kuaiyou_home"},
        {"title":"任务","navId":"obj_491d9cd3c9454007aefb5d762c441e27","url":"./w?sid=<#sid>&cmd=com.actionsoft.apps.taskmgt_home"},
        {"title":"单位通讯录","navId":"obj_37fa3a92c3cc4e478c6628936da9b287","url":"./w?sid=<#sid>&cmd=com.actionsoft.apps.entaddress_home"},
        {"title":"","navId":"","url":"./w?sid=<#sid>"},
        {"title":"","navId":"","url":"./w?sid=<#sid>"},
        {"title":"","navId":"","url":"./w?sid=<#sid>"},
        {"title":"","navId":"","url":"./w?sid=<#sid>"},
        {"title":"","navId":"","url":"./w?sid=<#sid>"},
        {"title":"","navId":"","url":"./w?sid=<#sid>"},
    ];
    for(var i = 0; i < funArr.length; i++) {
        var fun = funArr[i];
        var a = $("<a></a>");
        a.text(fun.title);
        var url = fun.url;
        url = url.replace("<#sid>",sid);
        if ("window"==fun.target){
            a.attr("href","javascript:window.open('"+url+"');");
        }else {
            a.attr("href","#");
            a.attr("onclick","showFunctionWindow('"+fun.navId+"', '"+fun.title+"', '"+url+"',false);");
        }
        var div = $("<div style='float:left;padding:5px;height:20px;line-height:20px;'></div>");
        div.append(a);

        container.append(div);
    }
    
    //菜单优化
    setInterval(function(){
        if($(".metro-nav-panel").width()=="60"){
            $(".metro-nav-action-items-panel").hide();
        }
    },5000);
    
    //工作台打开方式处理
    if ($("#openTarget").length > 0){
        $("#openTarget").val("window");
    }

})();