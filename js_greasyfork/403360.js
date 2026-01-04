// ==UserScript==
// @name        高端影视
// @namespace   Violentmonkey Scripts
// @match       https://ddrk.me/*
// @grant       none
// @version     0.0.3
// @author      -
// @description 低端影视 屏蔽广告插件 故写此脚本
// @downloadURL https://update.greasyfork.org/scripts/403360/%E9%AB%98%E7%AB%AF%E5%BD%B1%E8%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/403360/%E9%AB%98%E7%AB%AF%E5%BD%B1%E8%A7%86.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    var killAll = true;

    setInterval(function () {
      if(killAll && document.getElementsByTagName("img")){
      var ads = document.getElementsByTagName("img");
      for (var i = 0; i < ads.length; i++){
        if (ads[i].src.startsWith("https://ddrk.me/mtp/") || ads[i].src.startsWith("https://ddrk.me/pbw/") || ads[i].src.startsWith("https://ddrk.me/owu/")) {
            ads[i].parentNode.removeChild(ads[i]);
        }
      }
        killAll = false;
      }
        
    },100);
    
})();
