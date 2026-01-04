// ==UserScript==
// @name         2登陆页面处理
// @version      0.2
// @description  第二步骤选择小区
// @namespace    data
// @license      dats
// @match        https://m.xflapp.com/f100/activity/client/login*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/448694/2%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/448694/2%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
        $('.mobile-input')[0].focus();
        $('.tip-button')[0].click();
        $('.mobile-input').on('input',function(e){
            if($('.mobile-input').val().length === 11){
                setTimeout(function () {
                    $('.before-get-code').click()
                }, 10);
            }
        });
        $('.verify-code-input').on('input',function(e){
            if($('.verify-code-input').val().length === 4){
                setTimeout(function () {
                    $('.login-btn').click()
                }, 10);
            }
        });
    }, 100);


})();