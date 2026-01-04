// ==UserScript==
// @name         新浪微博一键清关注
// @namespace    http://tampermonkey.net/
// @version      2.35
// @description  清空微博所有关注
// @author       Waki_Ji&crane-yuan
// @match        https://*.weibo.com/*/follow*
// @match        https://weibo.com/*/follow*
// @match        https://*.weibo.com/p/*/myfollow*
// @match        https://weibo.com/p/*/myfollow*
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant        none
// @compatible   Chrome 测试通过
// @compatible   Chromium 测试通过
// @compatible   //Firefox 测试尚未通过（咕了
// @compatible   Edge 测试通过
// @compatible   
// 感谢crane-yuan提供的代码 本人在此基础上加以修改得出
// Crane-yuan代码：https://greasyfork.org/zh-CN/scripts/25697
// @downloadURL https://update.greasyfork.org/scripts/402588/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/402588/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==
// ==梦开始的地方==

window.setInterval(function(){
    $('a[action-type="cancel_follow_single"]')[0].click();//确定窗口
    $('a[action-type="ok"]')[0].click();//确定确认按钮
    setTimeout("self.location.reload();",4000);//自动刷新
},404)

//梦结束的地方
