// ==UserScript==
// @name         总在当前窗口加载新网页
// @namespace    https://greasyfork.org/zh-CN/scripts/418658-%E6%80%BB%E5%9C%A8%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E5%8A%A0%E8%BD%BD%E6%96%B0%E7%BD%91%E9%A1%B5
// @version      0.2
// @description  适用于edge/chrome创建的网页应用,按自己的需求添加匹配网站
// @author       neysummer2000
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        https://pan.baidu.com/*
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418658/%E6%80%BB%E5%9C%A8%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E5%8A%A0%E8%BD%BD%E6%96%B0%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/418658/%E6%80%BB%E5%9C%A8%E5%BD%93%E5%89%8D%E7%AA%97%E5%8F%A3%E5%8A%A0%E8%BD%BD%E6%96%B0%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function(){

 var f_open = window.open;
 window.open = function(url){
    f_open(url, '_self');
    //   f_open(url, 'newwindow' + new Date().getTime().toString(), 'channelmode=1,fullscreen=1,height=1920, width=1080, top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no,status=no');
}
$(document).on('click', 'a[target=_blank]', function(e){
    this.target="_self";
    });
})();
