// ==UserScript==
// @name         CSDN插件。
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自用插件，用于学习。
// @author       ZZT
// @match        https://blog.csdn.net/*
// @match        https://www.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MPL
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/454794/CSDN%E6%8F%92%E4%BB%B6%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/454794/CSDN%E6%8F%92%E4%BB%B6%E3%80%82.meta.js
// ==/UserScript==
//$("td.normal font").remove();
//$("td.normal").css("font-family","宋体").css("font-size","18px").css("font-style","normal").css("font-weight","normal").css("color","blue");
//$("b").css("font-family","宋体").css("font-size","18px").css("font-style","normal").css("font-weight","normal").css("color","blue");
//alert("欢迎来到内部网!")//弹出对话框
//console.log('hello!')//后台调试输出

var r=window.confirm("来了老弟~");
if (r==true)
{
alert("来了都是一家人");
var wang=window.confirm("王珂是狗嘛？");
if(wang==true){
    var x="欢迎来到内部网!";
    alert(x);
}else{
    x="快滚！！！";
    alert(x);
}
    
}
else
{
    x="快滚！！！";
    alert(x);
}

$("div.toolbar-logo toolbar-subMenu-box csdn-toolbar-fl").remove();
$("a.hasAvatar").click(function(){
   // 动作触发后执行的代码!!
   window.location.href = "https://www.runoob.com";
});
//$("input.editbox3x").click(function(){
//    // 动作触发后执行的代码!!
//});