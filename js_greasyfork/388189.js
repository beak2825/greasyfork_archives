// ==UserScript==
// @name         [kesai]通用返回顶部
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通用返回顶部
// @author       lizeping
// @match        https://www.douban.com/*
// @match        https://movie.douban.com/*
// @match        https://sspai.com/*
// @match        https://www.youtube.com/*
// @match        https://www.baidu.com/*
// @match        https://www.google.com.hk/*
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388189/%5Bkesai%5D%E9%80%9A%E7%94%A8%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/388189/%5Bkesai%5D%E9%80%9A%E7%94%A8%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addCSS(url) {
        var link = window.document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url+'?t='+new Date().getTime();
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    }

    function addScript(url) {
        var link = window.document.createElement('script');
        link.type = 'text/javascript';
        link.src = url+'?t='+new Date().getTime();
        link.async = true;
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    }


    if (typeof jQuery == 'undefined') {
        addScript("https://code.jquery.com/jquery-3.3.1.min.js");
    }
    addCSS("https://kesai.gitee.io/kesai_scripts/returnTop/share.css");

    window.onload = function() {
        var div = $('<div id="share"><a id="totop" title="返回顶部">返回顶部</a></div>');
        $("body").append(div);
        $("#totop").hide();

        $(window).scroll(function() {
            if ($(window).scrollTop() > 100) {
                $("#totop").fadeIn();
            } else {
                $("#totop").fadeOut();
            }
        });

        $("#totop").click(function() {
            $('body,html').animate({ scrollTop: 0 }, 500);
            return false;
        });
    }

})();
