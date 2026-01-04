// ==UserScript==
// @name         去爱奇艺体育Logo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  爱奇艺体育
// @author       Mark
// @match        http*://sports.iqiyi.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/431534/%E5%8E%BB%E7%88%B1%E5%A5%87%E8%89%BA%E4%BD%93%E8%82%B2Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/431534/%E5%8E%BB%E7%88%B1%E5%A5%87%E8%89%BA%E4%BD%93%E8%82%B2Logo.meta.js
// ==/UserScript==
(function() {
    setTimeout(function (){
        console.log("去爱奇艺体育Logo开始执行");
        $("#video > div.M706C61796572-watermark.watermark-1 > img").remove();
        console.log("页面加载执行成功");
    },5000 );
})();