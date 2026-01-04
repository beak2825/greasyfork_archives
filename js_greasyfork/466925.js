// ==UserScript==
// @name         科学刀论坛快捷回复工具(帝王哥)
// @namespace    diwangge
// @version      1.1
// @description  科学刀论坛快捷回复工具暂时只支持科学刀论坛使用
// @icon        https://y.gtimg.cn/music/photo_new/T053XD0030YCoa0mFddP.png
// @author       diwangge
// @match        https://www.kxdao.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466925/%E7%A7%91%E5%AD%A6%E5%88%80%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E5%B7%A5%E5%85%B7%28%E5%B8%9D%E7%8E%8B%E5%93%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466925/%E7%A7%91%E5%AD%A6%E5%88%80%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E5%B7%A5%E5%85%B7%28%E5%B8%9D%E7%8E%8B%E5%93%A5%29.meta.js
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
    document.getElementById("postmessage").value="来看看，支持一下！";
}
window.clicksubmitbutton = function (){
    document.getElementById("postsubmit").click();
}
document.getElementById("scrolltop").insertAdjacentHTML("afterEnd",'<div id="scrolltop" style="width:150px;height:150px;left: 5%; right: auto; visibility: visible;"><input type="button" value="快捷回复" style="color:#F00;font-size:30px;width:150px;height:150px;" onclick="autoreply()"></div>');




    // Your code here...
})();
