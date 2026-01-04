// ==UserScript==
// @name         淘金客拒绝二维码登录
// @namespace    http://www.zengyilun.com/
// @version      0.2
// @description  淘金客拒绝二维码登录2222
// @author       allyn
// @match        http://t.itaojintest.cn/customer/action/login/index
// @match        http://t.itaojintest.cn/pages/login.html
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/374424/%E6%B7%98%E9%87%91%E5%AE%A2%E6%8B%92%E7%BB%9D%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374424/%E6%B7%98%E9%87%91%E5%AE%A2%E6%8B%92%E7%BB%9D%E4%BA%8C%E7%BB%B4%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location != 'http://t.itaojintest.cn/pages/login.html'){
       window.location.href='http://t.itaojintest.cn/pages/login.html'
    }
    window.onload = function(){
        function doIt(){
            var btn2 = $('.js-login-status[data-status=2]');
            if(!btn2.hasClass('active')){
                btn2.click();
            }else{
                if(inter){
                    clearInterval(inter);
                }
            }
            return this;
        }
        doIt();
        var inter = setInterval(doIt, 100);
    }
    // Your code here...
})();