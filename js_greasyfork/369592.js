// ==UserScript==
// @name         紳士漫畫Redirector(預覽版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  把紳士漫畫網址轉址成slide版，類似於手機板可以連續載入圖片，不用一張一張看
// @author       silverair
// @include      https://www.wnacg.org/photos-view*
// @include      https://www.wnacg.com/photos-view*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369592/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%ABRedirector%28%E9%A0%90%E8%A6%BD%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369592/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%ABRedirector%28%E9%A0%90%E8%A6%BD%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    str=document.referrer;
    str=str.replace(/index/g, "slide");
    window.location = str;
})();