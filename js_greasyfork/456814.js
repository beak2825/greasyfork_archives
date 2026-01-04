// ==UserScript==
// @name         BaiDu JY Details page scroll a bit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  滚动一下详情页面!
// @author       Me
// @license      MIT
// @match        https://jingyan.baidu.com/article/*.html
// @grant        none
// @require    https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456814/BaiDu%20JY%20Details%20page%20scroll%20a%20bit.user.js
// @updateURL https://update.greasyfork.org/scripts/456814/BaiDu%20JY%20Details%20page%20scroll%20a%20bit.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);

(function() {
    'use strict';

    setTimeout(function(){
       jq(document).scrollTop(100);
       if(jq("#like-btn").hasClass("active")){
           jq(document).find("title").html('1');
       }
       else{
           jq("body").click();
           setTimeout(function(){
               jq("body").click();
               jq("#like-animation").click();
           }, 600);
       }
    }, 600);

})();