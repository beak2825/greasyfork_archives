// ==UserScript==
// @name         财联社电报
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  财联社电报简化
// @match        https://www.cls.cn/telegraph
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cls.cn
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502676/%E8%B4%A2%E8%81%94%E7%A4%BE%E7%94%B5%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/502676/%E8%B4%A2%E8%81%94%E7%A4%BE%E7%94%B5%E6%8A%A5.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';
    $("#headerWrap").remove()
    $(".sidebar-wrap").remove()
    $(".w-100p.bg-c-34304b.p-r.level-2-nav-box.clearfix").remove()
    $(".f-r.content-right").remove()
    $('.content-left').css('width', 'auto');
    $('.content-left').css('margin', '10px');
    $('.m-auto.w-1200').css('width', '100%');

})();