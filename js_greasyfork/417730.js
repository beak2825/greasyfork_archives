// ==UserScript==
// @name         去除知乎登录
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去除登录Modal
// @author       Midsummer
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/417730/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/417730/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $(function(){
         var callBack = function (mutationsList, observer) {
             if($('.Modal-wrapper').length > 0) {
               $('.Modal-wrapper').toggleClass('Modal-enter');
               $('.Modal-wrapper').parent().parent().parent().css({'display':'none'});
               $('html').css({'overflow':'auto','margin-right':'0px'});
               ob.disconnect();
             }
         }
         var ob = new MutationObserver(callBack);
         ob.observe(document.querySelector('body'), {childList: true, subtree: true});
     });

})();