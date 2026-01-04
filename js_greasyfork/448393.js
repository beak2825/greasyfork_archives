// ==UserScript==
// @name         douyu.com pure mode
// @name:zh-CN   斗鱼网页纯净模式
// @name:zh-TW   斗鱼网页纯净模式
// @namespace    
// @homepageURL  
// @version      1.1.3
// @description  Hide comments on douyu.com
// @description:zh-CN   网页端斗鱼(douyu.com)纯净模式
// @description:zh-TW   網頁端斗魚(douyu.com)隐藏评论列表
// @author       greatpatrickstar
// @copyright   2019, yaozeye
// @match        *://douyu.com/0*
// @match        *://douyu.com/1*
// @match        *://douyu.com/2*
// @match        *://douyu.com/3*
// @match        *://douyu.com/4*
// @match        *://douyu.com/5*
// @match        *://douyu.com/6*
// @match        *://douyu.com/7*
// @match        *://douyu.com/8*
// @match        *://douyu.com/9*

// @match        *://*.douyu.com/0*
// @match        *://*.douyu.com/1*
// @match        *://*.douyu.com/2*
// @match        *://*.douyu.com/3*
// @match        *://*.douyu.com/4*
// @match        *://*.douyu.com/5*
// @match        *://*.douyu.com/6*
// @match        *://*.douyu.com/7*
// @match        *://*.douyu.com/8*
// @match        *://*.douyu.com/9*

// @match        *://douyu.com/topic*
// @match        *://*.douyu.com/topic*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @license MIT https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/448393/douyucom%20pure%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/448393/douyucom%20pure%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.$$jq = jQuery.noConflict(true);
    
    
     var hideSide = function(){
         $$jq(".layout-Player-aside").hide();
         $$jq("#js-aside").hide();
         //$$jq(".BlindBox2021-switch ").click();
         $$jq(".ScreenBannerAd-Closeable").click();
         $$jq(".Header-wrap").hide();
         //$$jq("#js-player-toolbar").hide();
         $$jq(".BlindBox2021").hide();
         document.getElementsByClassName('PlayerToolbar')[0].style.display = 'none';
         document.getElementsByClassName('Bottom')[0].style.display = 'none';
                  $$jq(".BlindBox2021").hide();




     }
    var hideSidetopic = function(){

        $$jq("#bc4").hide();
        $$jq("#bc4-bgblur").hide();

        $$jq("#jbc4-bgblur").hide();
        $$jq("#js-header").hide();
        $$jq(".BlindBox2021").hide();

        $$jq(".layout-Player-aside").hide();

        $$jq("#bc95").hide();
        $$jq("#bc12").hide();
        $$jq("#js-player-toolbar").hide();


        $$jq("#room-html5-player").css('position','relative');

        $$jq(".layout-Player-main").css('margin-right','0px');
         $$jq(".wm-general-bgblur").css('background-image','');



     }
    window.setInterval(function(){
        var ss=window.location.href;
        if(ss.indexOf('topic')>= 0) {

            hideSidetopic();
        }else{
            hideSide();
        }




    }, 1000);
})();