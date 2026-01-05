// ==UserScript==
// @name 饭否-手机版收藏消息前确认
// @version 1.0
// @author HackMyBrain
// @description 在手机版饭否 m.fanfou.com 上收藏消息时弹出确认框，防止在触屏上操作误击
// @include http://m.fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2524/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E6%94%B6%E8%97%8F%E6%B6%88%E6%81%AF%E5%89%8D%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/2524/%E9%A5%AD%E5%90%A6-%E6%89%8B%E6%9C%BA%E7%89%88%E6%94%B6%E8%97%8F%E6%B6%88%E6%81%AF%E5%89%8D%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==


(function (){
    var markConfirm = function (e){
        if (e.target.tagName.toLowerCase() == "a" && /\/msg\.favorite\.add\//.test(e.target.href)){
            if (!confirm('是否要收藏此条消息?')){
                e.preventDefault();
            }
        }
    }
    
    window.addEventListener('click', markConfirm, false);
})();