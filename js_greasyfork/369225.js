// ==UserScript==
// @name         细声一直播全屏
// @namespace    http://xlwmin.pub
// @version      1.1
// @description  一直播全屏
// @author       细声工作室
// @license      MIT
// @match        *://www.yizhibo.com/l/*.html
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/369225/%E7%BB%86%E5%A3%B0%E4%B8%80%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/369225/%E7%BB%86%E5%A3%B0%E4%B8%80%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==


//测试同步
var Page = {
    entry:function(){
        //创建按钮
        var text = document.createTextNode("▣");

        //创建按钮
        var div = document.createElement("div");
        div.setAttribute("title","全屏播放");
        div.setAttribute("class","whisper-yizhibo");

        //注册事件
        div.addEventListener("click",this.onClick);

        //添加到页面
        div.appendChild(text);

        var contrl = document.getElementById('J_contrl');
        contrl.appendChild(div);
    },
    onClick:function(){
        var video = document.getElementById('J_flash');
        var element = video;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullScreen();
        }
    }
};
(function() {
    'use strict';
    GM_addStyle(".whisper-yizhibo{position:absolute;right:50px;top:8px;color:#fff;z-index:9999;padding:0px 4px;text-align:center;border-radius:5px;background:none;cursor:default;font-size:25px;}.whisper-yizhibo:hover{color:white;background:#880000;cursor:pointer;}");

    Page.entry();
})();