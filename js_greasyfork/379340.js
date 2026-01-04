// ==UserScript==
// @name         财联社
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  调整网页布局，方便手动复制。
// @author       
// @match        https://www.cls.cn/
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/379340/%E8%B4%A2%E8%81%94%E7%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/379340/%E8%B4%A2%E8%81%94%E7%A4%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //$("div").remove();
    $("body").find('script').remove()
    
    $("div.jsx-2502217557.c-262626.telegraph-index-content.p-r > div").each(function(){
        $(this).prepend("<div>财联社</div>");
        $(this).append("<div>https://www.cls.cn</div>");
    });
    
})();