// ==UserScript==
// @name         新浪微博一键清粉丝
// @namespace    http://tampermonkey.net/
// @version      2.35
// @description  清空微博所有粉丝
// @author       Waki_Ji&crane-yuan
// @match        https://*.weibo.com/*/fans*
// @match        https://weibo.com/*/fans*
// @match        https://*.weibo.com/p/*/myfollow?relate=fans*
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant        none
// @compatible   Chrome 测试通过
// @compatible   //Firefox 测试尚未通过（咕了
// @compatible   Chromium 测试通过
// @compatible   Edge 测试通过
// @compatible
// 感谢crane-yuan提供的代码 本人在此基础上加以修改得出
// Crane-yuan代码：https://greasyfork.org/zh-CN/scripts/25697
// @downloadURL https://update.greasyfork.org/scripts/402592/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%B2%89%E4%B8%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/402592/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%B2%89%E4%B8%9D.meta.js
// ==/UserScript==
// ==梦开始的地方==

window.setInterval(function(){
    $('a[action-type="removeFan')[0].click();//确定窗口位置
    $('a[action-type="ok')[0].click();//确认移除粉丝
    setTimeout("self.location.reload();",8000);//自动刷新
},404)

//梦结束的地方
