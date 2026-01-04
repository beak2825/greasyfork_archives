// ==UserScript==
// @name         双击显示密码脚本
// @namespace    http://xhunter.org
// @version      1.0.5
// @description  双击显示密码
// @author       hunter
// @include      http*://*
// @exclude      *baidu.com*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.9.1/jquery.min.js
// @run-at		 document-end
// @downloadURL https://update.greasyfork.org/scripts/32373/%E5%8F%8C%E5%87%BB%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/32373/%E5%8F%8C%E5%87%BB%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

function showPwd() {
    //判断是否有密码框
    if($(":password").length > 0){
        //双击显示密码
        $(":password").dblclick(function(){
            $(this).attr("type","text");
        });

        //单击时变为*
        $(":password").click(function(){
            $(this).attr("type","password");
        });

        //失去焦点时变为*
        $(":password").blur(function(){
            $(this).attr("type","password");
        });
    }
};
window.onload=function(){
    showPwd();
};