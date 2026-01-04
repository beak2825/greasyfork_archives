// ==UserScript==
// @name         取消CSDN登录后复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  那个登录复制功能很烦人
// @author       九零
// @match        https://blog.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440378/%E5%8F%96%E6%B6%88CSDN%E7%99%BB%E5%BD%95%E5%90%8E%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/440378/%E5%8F%96%E6%B6%88CSDN%E7%99%BB%E5%BD%95%E5%90%8E%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


(function () {
    'use strict';

    $('code').css({
        'user-select': 'unset'
    })
    $('#content_views pre').css({
        'user-select': 'unset'
    })

    $('.hljs-button').remove();

    $('.hide-article-box').remove();
    $('.article_content').css({
        'height': 'initial'
    })

    document.querySelectorAll('*').forEach(item => {
        item.oncopy = function (e) {
            e.stopPropagation();
        }
    })
})();