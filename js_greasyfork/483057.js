// ==UserScript==
// @name               skip youtube ad
// @name:zh-CN         youtube跳过广告
// @namespace    bilibili-auto-fullscreen-script
// @version            1.0.0
// @description        hide youtube's ad,auto click "skip ad"
// @description:zh-CN  自动点击"skip ad"、
// @match        https://*.youtube.com/*
// @grant        none
// @author       BlingCc
// @license      GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/483057/skip%20youtube%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/483057/skip%20youtube%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var skipInt;
    var log=function(msg){};
    var skipAd=function(){
        var skipbtn=document.querySelector(".ytp-ad-skip-button-modern.ytp-button");
        if(skipbtn){
           skipbtn=document.querySelector(".ytp-ad-skip-button-modern.ytp-button");
           log("skip");
           skipbtn.click();
           if(skipInt) {clearTimeout(skipInt);}
           skipInt=setTimeout(skipAd,500);
         }else{
              log("checking...");
              if(skipInt) {clearTimeout(skipInt);}
              skipInt=setTimeout(skipAd,500);
         }
    };

    skipAd();

})();