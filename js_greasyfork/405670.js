// ==UserScript==
// @name              上学吧答案获取
// @namespace         elon musk
// @version           1.1
// @icon              https://gw.alicdn.com/tfs/TB1ZvwSycbpK1RjSZFyXXX_qFXa-48-48.ico
// @description       上学吧答案获取解,回复链接即可获取答案图片
// @author            syhyz1990
// @license           MIT
// @supportURL        https://github.com/syhyz1990/media
// @match             *://www.shangxueba.com/*
// @match             *://m.shangxueba.com/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/405670/%E4%B8%8A%E5%AD%A6%E5%90%A7%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405670/%E4%B8%8A%E5%AD%A6%E5%90%A7%E7%AD%94%E6%A1%88%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function addDiv(){
        var div = document.createElement("div");
        div.innerHTML = "点我获取上学吧答案";
        var css = "position:fixed;top:160px;left:20px;z-index:999999999;width:360px;height:32px;line-height:32px;text-align:center;font-size:10px;background:#fff;font-family:Verdana, Arial, '宋体';font-weight:500;color:white;background-color:#f44336;user-select:none;padding:0px;white-space:nowrap;border-radius:3px;border:1px solid #f44336;cursor:pointer;";
        div.style.cssText = css;
        if(window.self === window.top){ document.body.appendChild(div);}
        div.addEventListener("click",function(){
            let url = window.location.href;
            url = 'https://wx2.sinaimg.cn/mw690/0067ZWBcgy1gfwbfurb1ij30dw0dwdhc.jpg';
            window.open(url, "_blank");});
   }
   addDiv();
})();