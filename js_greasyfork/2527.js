// ==UserScript==
// @name 饭否-手机版输入框增加宽度和高度
// @version 0.5
// @author HackMyBrain
// @description m.fanfou.com 输入框宽度自适应,增加高度
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2527/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%BE%93%E5%85%A5%E6%A1%86%E5%A2%9E%E5%8A%A0%E5%AE%BD%E5%BA%A6%E5%92%8C%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/2527/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E8%BE%93%E5%85%A5%E6%A1%86%E5%A2%9E%E5%8A%A0%E5%AE%BD%E5%BA%A6%E5%92%8C%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==


(function (){
    var textarea = document.getElementsByTagName("textarea")[0];
    if ( ! textarea ) return;
    textarea.style.width = "95%";
    textarea.style.height = "6em";
    textarea.style.padding = "2px 0px";
    textarea.style.margin = "auto";
})();