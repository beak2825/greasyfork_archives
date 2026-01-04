// ==UserScript==
// @name         huya.com pure mode
// @name:zh-CN   虎牙网页纯净模式
// @name:zh-TW   虎牙网页纯净模式
// @namespace
// @homepageURL
// @version      1.0.1
// @description  Hide comments on huya.com
// @description:zh-CN   网页端虎牙(huya.com)纯净模式
// @description:zh-TW   網頁端虎牙(huya.com)隐藏评论列表
// @author       greatpatrickstar
// @copyright   2019, yaozeye
// @match        ^((https | http)?:\/\/)([^\s]+)\.huya\.com\/[^g].

// @match        *://huya.com/*

// @match        *://*.huya.com/*

// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @license MIT https://opensource.org/licenses/MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/448447/huyacom%20pure%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/448447/huyacom%20pure%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.$$jq = jQuery.noConflict(true);


     var hideSide = function(){
		$$jq("#duya-header").hide();

         $$jq(".room-core-r").hide();
         $$jq(".sidebar-show").hide();
         $$jq(".sidebar-hide").hide();
         $$jq("#player-gift-wrap").hide();
         $$jq(".match-cms-content").hide();
         $$jq("#matchComponent3").hide();
         $$jq("#matchMain").hide();
         $$jq("#J_mainRoom").css('background-image','');
         $$jq("#J_spbg").css('background-image','');


         //document.getElementsByClassName('Bottom')[0].style.display = 'none';




     }
    window.setInterval(function(){
        var ss=window.location.href;
        if(ss.indexOf('\.com\/g\/')>= 0 | ss.indexOf('\.com\/l')>= 0 | ss == 'https\:\/\/www\.huya\.com\/' | ss == 'https\:\/\/www\.huya\.com') {
          
        }else{
            hideSide();
        }




    }, 1000);
})();