// ==UserScript==
// @name         online_video
// @namespace    online_video
// @version      0.1
// @description  可以拖动视频
// @author       nelson guo
// @match        http://61.157.140.45/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12306/online_video.user.js
// @updateURL https://update.greasyfork.org/scripts/12306/online_video.meta.js
// ==/UserScript==


function getQueryString(name) { 
   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
   var r = window.location.search.substr(1).match(reg); 
   if (r != null) return unescape(r[2]); return null; 
} 

(function(){
var btn = "<a id='goTest' href='###' style='display:inline-block;width:160px;height:45px;background:#f0f2f3;color:red;line-height:45px;font-size:17px;text-align:center;padding-right:10px;'>不看视频立即测试</a>";
document.getElementById("___1").innerHTML = btn
function showMyTest(){
    var myId = getQueryString("id");
    SetCookie("test",myId);
    open_test();
}

document.getElementById("goTest").onclick = showMyTest;
})();