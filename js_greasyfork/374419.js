// ==UserScript==
// @name         ZYL百度移除右侧广告新闻内容
// @namespace    http://www.zengyilun.com/
// @version      0.5
// @description  百度移除右侧广告新闻内容
// @author       allyn
// @include      https://www.baidu.com/*
// @include      http://www.baidu.com/*
// @grant        none
// @updateUrl    https://greasyfork.org/scripts/374419-zyl%E7%99%BE%E5%BA%A6%E7%A7%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%E6%96%B0%E9%97%BB%E5%86%85%E5%AE%B9/code/ZYL%E7%99%BE%E5%BA%A6%E7%A7%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%E6%96%B0%E9%97%BB%E5%86%85%E5%AE%B9.user.js
// @downloadURL https://update.greasyfork.org/scripts/374419/ZYL%E7%99%BE%E5%BA%A6%E7%A7%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%E6%96%B0%E9%97%BB%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/374419/ZYL%E7%99%BE%E5%BA%A6%E7%A7%BB%E9%99%A4%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A%E6%96%B0%E9%97%BB%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
   
      function clickBaidu(){
           var clickTimes = 0;
           function doIt(){
                var right = $('#content_right');
                if(right.length > 0){
                    right.remove();
                }else{
                    if(inter){
                         clickTimes ++;
                         if(clickTimes == 100){
                             clearInterval(inter);
                         }
                    }
                }
                return this;
            }
            doIt();
            var inter = setInterval(doIt, 100);
      }
      clickBaidu();
     $('#su').click(clickBaidu);
    
})();