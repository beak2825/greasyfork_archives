// ==UserScript==
// @name         草榴防去广告检测
// @namespace    hayden
// @version      0.0.9
// @description  去除了10秒的广告插件警告
// @author       hayden

// @match      http*://*/htm_data/*.html
// @match      http*://*/htm_mob/*.html
// @match      http*://*/read.php*
// @match      http*://*/personal.php*
// @match      http*://*/post.php*
// @match      http*://*/thread0806.php*

// @run-at       document-body
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/522758/%E8%8D%89%E6%A6%B4%E9%98%B2%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522758/%E8%8D%89%E6%A6%B4%E9%98%B2%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const defaultReply = "1024 感謝分享";
    
     $('<div>').addClass('tpc_content').insertBefore("body").html("TEST").css(
         {
             'position': 'absolute',
             'top': '-9950px',
             'left': '-9990px'
         }
     );

})();

