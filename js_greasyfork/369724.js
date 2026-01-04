// ==UserScript==
// @name     微博去隐私政策弹框
// @version      2.1
// @description 屏蔽weibo的隐私政策弹框
// @author       detected_me
// @require  http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        *://*.weibo.com/*
// @icon            http://weibo.com/favicon.ico
// @namespace https://greasyfork.org/users/192606
// @downloadURL https://update.greasyfork.org/scripts/369724/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/369724/%E5%BE%AE%E5%8D%9A%E5%8E%BB%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==
(function () {
       setInterval(function(){
        $('.layer_registerinfo').remove();
        $('.W_layer_btn.S_bg1').remove();
        $("div[node-type$='outer']").remove();
        $('.W_layer_close').remove();
    },100);
})();