// ==UserScript==
// @name         两个茶杯狐网站
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  新茶杯狐网站去广告
// @author       啦A多梦
// @license      MIT
// @match        https://www.cbportal.org/*
// @match        https://www.ploiu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stgowan.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478060/%E4%B8%A4%E4%B8%AA%E8%8C%B6%E6%9D%AF%E7%8B%90%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/478060/%E4%B8%A4%E4%B8%AA%E8%8C%B6%E6%9D%AF%E7%8B%90%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var style = document.createElement("style");
     style.innerHTML = "#vazqiiuo {display: none !important}";
     document.head.appendChild(style);
     Object.defineProperty(navigator, 'userAgent', {
         get: function(val) {
             return "Mobile";
         }
     });

     Object.defineProperty(navigator, 'platform', {
         get: function(val) {
             return "Win32";
         }
    });

    var timer = setInterval(function(){
        try{
            if (document.querySelector("#CommentInit") != null) {
                document.querySelector("#CommentInit").nextElementSibling.remove();
            } else if (document.getElementsByTagName("body")[0].lastChild.tagName.length >= 4 && location.pathname.indexOf("upfox") != -1) {
                document.querySelector(".foot_row").parentElement.nextElementSibling.remove();
            };
        } catch{}
        try{
            if(document.querySelector(".play-select").previousElementSibling.style.zIndex != ''){
                document.querySelector(".play-select").previousElementSibling.remove();
            }
        } catch{}
				},100);
    setTimeout(function(){
        clearInterval(timer);
    },10000
               )
    // Your code here...
})();