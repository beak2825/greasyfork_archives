// ==UserScript==
// @name         CSDN,博客园，脚本之家，简书，segmentfault,知乎广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  干掉烦人的广告!
// @author       VRJay
// @match        *://blog.csdn.net/*
// @match        *://www.cnblogs.com/*
// @match        *://www.jb51.net/*
// @match        *://segmentfault.com/*
// @match        *://www.jianshu.com/*
// @match        *://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395206/CSDN%2C%E5%8D%9A%E5%AE%A2%E5%9B%AD%EF%BC%8C%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%EF%BC%8C%E7%AE%80%E4%B9%A6%EF%BC%8Csegmentfault%2C%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/395206/CSDN%2C%E5%8D%9A%E5%AE%A2%E5%9B%AD%EF%BC%8C%E8%84%9A%E6%9C%AC%E4%B9%8B%E5%AE%B6%EF%BC%8C%E7%AE%80%E4%B9%A6%EF%BC%8Csegmentfault%2C%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var host = location.host;
    switch(host){
        case 'blog.csdn.net':
            $('.csdn-tracking-statistics,#asideFooter,iframe').remove();
            $('.btn-readmore').trigger('click');
            break;
        case 'www.cnblogs.com':
            $('iframe,#cnblogs_c1,#cnblogs_c2,#blogTitle').remove();
            break;
        case 'www.jb51.net':
            $('body').hide(function(){
                setTimeout(function(){
                    $('body').fadeIn(150);
                },1000)
            })
            $('.pt10,#header,#topbar,#wrapper #container .main-right,iframe,.jb51ewm,.lbd a').hide();
            $('#main .main-left').css('width','100%');
            break;
        case 'segmentfault.com':
            $('iframe,#OA_holder_1,#OA_holder_2,#OA_holder_3').hide();
            addStyle('iframe,#OA_holder_1,#OA_holder_2,#OA_holder_3{display:none!important;}')
            break;
        case 'www.jianshu.com':
            addStyle('iframe,header,section[aria-label="youdao-ad"]{display:none!important;}');
            break;
        case 'www.zhihu.com':
            addStyle('iframe,.AppBanner,.Question-sideColumnAdContainer,.Pc-card{display:none!important;}');
            break;
    }
    function addStyle(css){
        var style = document.createElement('style');
        style.setAttribute('type','text/css');
        style.innerHTML = css;
        var head = document.querySelector('head');
        head.prepend(style);
    }
})();