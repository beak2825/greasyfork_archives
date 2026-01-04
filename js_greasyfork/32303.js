// ==UserScript==
// @name         osc-news
// @namespace    https://fireye.in/
// @version      0.1
// @description  在新窗口打开ocs的新闻内容
// @author       Ben
// @match        *://www.oschina.net/news/industry
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32303/osc-news.user.js
// @updateURL https://update.greasyfork.org/scripts/32303/osc-news.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ajaxSuccess(function( event, xhr, settings ) {
        if ( settings.url.startsWith("/action/ajax/get_more_news_list")) {
            addBlank();
        }
    });
    function addBlank(){
        $(".main-info.box-aw a.title").attr("target","_blank");
    }
    addBlank();
})();