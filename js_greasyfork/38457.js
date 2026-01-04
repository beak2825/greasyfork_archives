// ==UserScript==
// @name         紳士漫畫Redirector
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  把紳士漫畫網址轉址成slide版，類似於手機板可以連續載入圖片，不用一張一張看
// @author       silverair
// @include      https://www.wnacg.org/photos-index*
// @include      https://www.wnacg.com/photos-index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38457/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%ABRedirector.user.js
// @updateURL https://update.greasyfork.org/scripts/38457/%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%ABRedirector.meta.js
// ==/UserScript==

(function() {
    str=location.pathname;
    str=str.replace(/index/g, "slide");
    window.location = "https://www.wnacg.com" +str;
})();