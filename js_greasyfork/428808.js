// ==UserScript==
// @name         论坛快捷回复
// @namespace    NewFly
// @version      1.4
// @description  暂时只支持科学刀论坛快捷回复
// @author       NewFly
// @match        https://www.kxdao.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428808/%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/428808/%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';


window.autoreply = function (){
    //显示回复窗口
    document.getElementById("post_reply").click();
    //showWindow('reply', 'forum.php?mod=post&action=reply&tid='+tid)
    //在富文本编辑框中输入内容
    window.setTimeout(function(){writetext()},500);
    //提交回复
    window.setTimeout(function(){clicksubmitbutton()}, 500);
}
window.writetext = function (){
    document.getElementById("postmessage").value="超级好用的自动快捷回复";
}
window.clicksubmitbutton = function (){
    document.getElementById("postsubmit").click();
}
document.getElementById("scrolltop").insertAdjacentHTML("afterEnd",'<div id="scrolltop" style="width:180px;height:180px;left: 5%; right: auto; visibility: visible;"><input type="button" value="快捷回复" style="color:#F00;font-size:40px;width:170px;height:170px;" onclick="autoreply()"></div>');




    // Your code here...
})();
