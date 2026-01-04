// ==UserScript==
// @name         微博(2021版)打开全部相册+手机版
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  为微博(2021版)增加打开全部相册+手机版的链接
// @author       Wesley King
// @match        https://weibo.com/u/*
// @icon         https://www.sinaimg.cn/blog/developer/wiki/LOGO_64x64.png
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/427925/%E5%BE%AE%E5%8D%9A%282021%E7%89%88%29%E6%89%93%E5%BC%80%E5%85%A8%E9%83%A8%E7%9B%B8%E5%86%8C%2B%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/427925/%E5%BE%AE%E5%8D%9A%282021%E7%89%88%29%E6%89%93%E5%BC%80%E5%85%A8%E9%83%A8%E7%9B%B8%E5%86%8C%2B%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    var path = window.location.pathname;
    var pathArr = path.split("/");
    var uid = pathArr[2];
    GM_registerMenuCommand("打开全部相册",function(){
       window.location.replace("https://photo.weibo.com/"+uid);
    });
    GM_registerMenuCommand("打开手机版",function(){
       window.location.replace("https://m.weibo.cn/profile/"+uid);
    });
})();