// ==UserScript==
// @name         微博内防止按键键盘del
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			0.0.1
// @homepageURL	https://greasyfork.org/zh-CN/scripts/448829-%E5%BE%AE%E5%8D%9A%E5%86%85%E9%98%B2%E6%AD%A2%E6%8C%89%E9%94%AE%E9%94%AE%E7%9B%98del
// @description      防止按键键盘del
// @match             *://*.weibo.com/*
// @match             *://t.cn/*
// @include           *://weibo.com/*
// @include           *://*.weibo.com/*
// @include           *://t.cn/*
// @exclude           *://weibo.com/a/bind/*
// @exclude           *://account.weibo.com/*
// @exclude           *://kefu.weibo.com/*
// @exclude           *://photo.weibo.com/*
// @exclude           *://security.weibo.com/*
// @exclude           *://verified.weibo.com/*
// @exclude           *://vip.weibo.com/*
// @exclude           *://open.weibo.com/*
// @exclude           *://passport.weibo.com/*
// @license         WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448829/%E5%BE%AE%E5%8D%9A%E5%86%85%E9%98%B2%E6%AD%A2%E6%8C%89%E9%94%AE%E9%94%AE%E7%9B%98del.user.js
// @updateURL https://update.greasyfork.org/scripts/448829/%E5%BE%AE%E5%8D%9A%E5%86%85%E9%98%B2%E6%AD%A2%E6%8C%89%E9%94%AE%E9%94%AE%E7%9B%98del.meta.js
// ==/UserScript==

(function() {
    document.onkeydown=function(event){
    if(window.event.keyCode==110) {event.returnValue=false;alert("防止按键键盘del");}
}
})();