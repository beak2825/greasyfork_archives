// ==UserScript==
// @name         中文文档导航
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  为英文文档添加中文文档的跳转链接
// @author       You
// @match        *://gobyexample.com/*
// @match        *://www.typescriptlang.org/*
// @match        *://eslint.org/docs/rules/*
// @require https://cdn.bootcss.com/jquery/1.12.2/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/38982/%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/38982/%E4%B8%AD%E6%96%87%E6%96%87%E6%A1%A3%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href = window.location.href;

    if (href.indexOf('gobyexample.com') > -1) {
        var cnHref = href.replace('https://gobyexample.com/', 'https://books.studygolang.com/gobyexample/');
        var html = `&nbsp;&nbsp;<a href="${cnHref}" target="_blank">→中文版</a>`;
        $('.example h2').append(html);
    }

    if (href.indexOf('typescriptlang.org') > -1) {
        var link = window.location.href.replace('www.typescriptlang.org', 'www.tslang.cn');
        var html = '<li class="nav-item"><a href="'+ link +'" target="_blank">中文版</a></li>';
        setTimeout(() => {
            $($('nav[role="navigation"] ul')[0]).append(html);
        }, 1000);
    }

    if (href.indexOf('eslint.org') > -1) {
        var link = window.location.href.replace('eslint.org/', 'cn.eslint.org/');
        var html = `<li><a href="${link}">中文版</a></li>`;
        setTimeout(() => {
            $($('.navbar-right')[0]).append(html);
        }, 1000);
    }
})();