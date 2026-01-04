// ==UserScript==
// @name                新浪微博一键清空
// @namespace           https://crane-yuan.github.io
// @version             0.4
// @description         清空您发过的所有微博
// @author              crane-yuan
// @match               https://weibo.com/p/*
// @require             http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant               none
// @compatible         firefox 测试通过
// @compatible         chrome 测试通过
// @compatible         opera 未测试
// @compatible         safari 未测试
// @downloadURL https://update.greasyfork.org/scripts/435067/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/435067/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA.meta.js
// ==/UserScript==
 
window.setInterval(function(){
    $('a[action-type="fl_menu"]')[0].click();
    $('a[title="删除此条微博"]')[0].click();
    $('a[action-type="ok"]')[0].click();
},500)