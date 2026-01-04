// ==UserScript==
// @name         bangumi 讨论页面的关联作品与章节模块浮动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  讨论页面的关联作品与章节模块浮动
// @author       You
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/((ep|blog)|(subject\/topic))/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374695/bangumi%20%E8%AE%A8%E8%AE%BA%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%85%B3%E8%81%94%E4%BD%9C%E5%93%81%E4%B8%8E%E7%AB%A0%E8%8A%82%E6%A8%A1%E5%9D%97%E6%B5%AE%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/374695/bangumi%20%E8%AE%A8%E8%AE%BA%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%85%B3%E8%81%94%E4%BD%9C%E5%93%81%E4%B8%8E%E7%AB%A0%E8%8A%82%E6%A8%A1%E5%9D%97%E6%B5%AE%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    let columnB = $('#columnEpB').length ? $('#columnEpB') : ($('#columnB').length ? $('#columnB') : ($('#columnInSubjectB').length ? $('#columnInSubjectB') : null) );
    let top = columnB.offset().top - 51 - 10;
    console.log(columnB);
    function tofixed() {
        if($(window).scrollTop() >= top) {
            columnB.css({
                position : 'fixed',
                top : '52px',
                left : $('div.columns').offset().left + $('div.columns').children('div:first-child').outerWidth(true),
            });
        } else {
            columnB.css({
                position : 'relative',
                top : 'auto',
                left : 'auto',
            });
        }
    }
    $(window).ready(function() {
        tofixed();
    });
    $(window).scroll(function() {
        tofixed();
    });
    $(window).resize(function() {
        tofixed();
    });
})();