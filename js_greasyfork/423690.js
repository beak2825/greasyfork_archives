// ==UserScript==
// @name         BNU登陆界面允许关闭
// @namespace    gqqnbig
// @version      0.1
// @description  Quickly close BNU login prompt
// @author       gqqnbig
// @match        https://online.bnu.com.mo/ebank/bnu/login.jsp?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423690/BNU%E7%99%BB%E9%99%86%E7%95%8C%E9%9D%A2%E5%85%81%E8%AE%B8%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/423690/BNU%E7%99%BB%E9%99%86%E7%95%8C%E9%9D%A2%E5%85%81%E8%AE%B8%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let f=function(){
        if($("#ym-window").length)
        {
            $(".ym-mr input").css("display","block");
            clearInterval(handle);
        }
    }
    let handle=setInterval(f,100);
})();