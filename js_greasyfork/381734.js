// ==UserScript==
// @name         免註冊看蘋果新聞(已失效)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @include      https://tw.appledaily.com*
// @include      https://tw.news.appledaily.com*
// @include      https://tw.entertainment.appledaily.com*
// @include      https://tw.lifestyle.appledaily.com*
// @include      https://tw.sports.appledaily.com*
// @match        http://*/*
// @grant        none
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/381734/%E5%85%8D%E8%A8%BB%E5%86%8A%E7%9C%8B%E8%98%8B%E6%9E%9C%E6%96%B0%E8%81%9E%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381734/%E5%85%8D%E8%A8%BB%E5%86%8A%E7%9C%8B%E8%98%8B%E6%9E%9C%E6%96%B0%E8%81%9E%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByClassName("ndPaywall");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

   document.getElementsByClassName("ndArticle_margin")[0].style.display = null;
   document.getElementsByClassName("ndAritcle_headPic")[0].style.display = null;
   document.getElementsByClassName("mediabox")[0].style.display = null;


})();

