// ==UserScript==
// @name         维基百科自动跳转到简体中文桌面版页面
// @namespace    https://greasyfork.org/zh-CN/scripts/451260
// @version      0.1.0
// @description  维基百科页面自动跳转，自动跳转到简体中文桌面版页面
// @author       Phuker
// @license      GNU GPLv3
// @include      https://zh.wikipedia.org/*
// @include      https://zh.m.wikipedia.org/*
// @downloadURL https://update.greasyfork.org/scripts/451260/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E6%A1%8C%E9%9D%A2%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/451260/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E6%A1%8C%E9%9D%A2%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hostname_replace = 'zh.wikipedia.org';
    let lang_search = [
        'wiki',
        'zh',
        'zh-hans',
        'zh-hant',
        'zh-hk',
        'zh-mo',
        'zh-my',
        'zh-sg',
        'zh-tw',
    ];
    let lang_replace = 'zh-cn';

    function my_log(...args) {
        var _datetime_str = (new Date()).toLocaleString();
        console.log('[Wikipedia auto redirect][' + _datetime_str + ']', ...args);
    }
    
    function auto_redirect() {
        let url = new URL(document.location.href);
        url.hostname = hostname_replace;
    
        let pathname_parts = url.pathname.split('/');
        if(lang_search.indexOf(pathname_parts[1]) >= 0) {
            pathname_parts[1] = lang_replace;
            url.pathname = pathname_parts.join('/');
        }
    
        if(document.location.href != url.href) {
            my_log('Redirect', document.location.href, '-->', url.href);
            document.location.href = url.href;
        }
    }
    
    my_log('Script running');
    auto_redirect();
})();
