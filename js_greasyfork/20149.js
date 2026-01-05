// ==UserScript==
// @name         Blogger Statistics Hider
// @name:zh-TW   Blogger 流量資訊隱藏
// @namespace    http://www.twsiyuan.com/
// @version      1.2
// @description  Hide all statistics info in blogger
// @description:zh-TW  在 Blogger 管理頁面中，隱藏所有的流量統計資訊
// @author       Siyuan
// @match        https://www.blogger.com/home
// @match        https://www.blogger.com/blogger.g*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20149/Blogger%20Statistics%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/20149/Blogger%20Statistics%20Hider.meta.js
// ==/UserScript==

$(document).ready(function() {
    'use strict';

    $('a').each(function() {
        var href = $(this).attr('href');
        if (href && href.indexOf('#overviewstats') >= 0){
            $(this).hide();
        }
    });

    var sheet = window.document.styleSheets[0];
    sheet.insertRule('.gwt-Image { visibility: hidden !important; }', sheet.cssRules.length);
    sheet.insertRule('.editPosts tr td:nth-child(6) { display: none !important; }', sheet.cssRules.length);   
    sheet.insertRule('.pages tr td:nth-child(6) { display: none !important; }', sheet.cssRules.length);
});
