// ==UserScript==
// @name         成都信息工程大学健康打卡自动化
// @name:zh      成都信息工程大学健康打卡自动化
// @name:zh-CN   成都信息工程大学健康打卡自动化
// @namespace    http://jszx.cuit.edu.cn/
// @version      0.1.3
// @license      Anti 996 License
// @description  自动完成成都信息工程大学线上服务健康打卡过程。
// @description:zh 自动完成成都信息工程大学线上服务健康打卡过程。
// @description:zh-CN 自动完成成都信息工程大学线上服务健康打卡过程。
// @author       Zkyao
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407536/%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/407536/%E6%88%90%E9%83%BD%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

//===================使用说明(必读)=======================
// 1.在安装本脚本时,请将CONFIG中的username改为你计算中心的学号
// 2.再把password改成你计算中心的密码,然后就可以放心食用了
// 3.使用教程:
//    3.1.首先需要自己进入计算中心,然后点击"学生-作业/考试/查卷"
//    3.2.然后就是全自动的打卡了,一般正常只需3-5s,但受浏览器和网速影响可能会稍长
//    3.3.如果过程中发现卡死(最大的可能是登录的时候卡死),直接返回计算中心首页,再点一次"学生-作业/考试/查卷"即可


//======================CONFIG======================
// Credentials for auto-login
var username = "username";
var password = "password";
//==================================================
function $(id){
    return document.getElementById(id);
}
function $$(name){
    return document.getElementsByName(name);
}
function $$$(classname){
    return document.getElementsByClassName(classname);
}
function $$$$(Tagname){
    return document.getElementsByTagName(Tagname);
}
var clickevt = document.createEvent("MouseEvents");
clickevt.initEvent("click", true, true);
//==================================================

(function() {
    'use strict';

    if(window.location.hostname == "login.cuit.edu.cn" && username == "username"){
        // username check
        alert("Please edit the script and set your username & password! \n请编辑脚本，指定你的用户名和密码！");
        alert("The script will now terminate. \n脚本执行中断。");
        return false;

    }

    if(window.location.hostname == "login.cuit.edu.cn"){
        $("txtId").value = username;
        $("txtMM").value = password;
        $$$("IbtnEnterCssClass")[0].dispatchEvent(clickevt);
    }
    if(window.location.pathname == "/Jxgl/Xs/MainMenu.asp"){
        //$$$("mn11R")[0].dispatchEvent(clickevt);
        $$$$("a")[1].dispatchEvent(clickevt);
    }
    if(window.location.pathname == "/Jxgl/Xs/netKs/sj.asp"){
        $$$$("a")[1].dispatchEvent(clickevt);
    }
    if(window.location.pathname == "/Jxgl/Xs/netKs/editSj.asp"){
        $$("sF21650_6")[0].selectedIndex = 4
        $$("sF21650_7")[0].selectedIndex = 1
        $$("sF21650_8")[0].selectedIndex = 1
        $$("sF21650_9")[0].selectedIndex = 1
        $$("B2")[0].dispatchEvent(clickevt);
    }
})();



