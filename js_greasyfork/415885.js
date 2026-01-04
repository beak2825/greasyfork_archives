// ==UserScript==
// @name         [kesai]哔嘀影视移除广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  哔嘀影视移除广告
// @author       kesai
// @match        https://bde4.com/*
// @match        https://bde4.cc/*
// @downloadURL https://update.greasyfork.org/scripts/415885/%5Bkesai%5D%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/415885/%5Bkesai%5D%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addScript(url) {
        var link = window.document.createElement('script');
        link.type = 'text/javascript';
        link.src = url + '?t=' + new Date().getTime();
        link.async = true;
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    }

    if (typeof jQuery == 'undefined') {
        addScript("https://code.jquery.com/jquery-3.3.1.min.js");
    }
    $('.isActive').remove();
    $('#js5297').next().remove();
    $('center').hide();
    $('.__zy_circle.__zy_animated.__zy_infinite').remove();
    $('div:contains(请关闭广告拦截插件对本站的拦截)').css('display', 'none')
    setTimeout(function () { $('.isActive').remove(); }, 1000)
})();