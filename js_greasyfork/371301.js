// ==UserScript==
// @name         58核心价值观 - 时刻提醒
// @description  58集团核心价值观 时时刻刻在你访问的每个页面飘出并提示！
// @author       LzSkyline, kj863257
// @include         http://*
// @include			https://*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @run-at       document-idle
// @version 0.0.1.20180818091858
// @namespace https://greasyfork.org/users/152259
// @downloadURL https://update.greasyfork.org/scripts/371301/58%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E8%A7%82%20-%20%E6%97%B6%E5%88%BB%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/371301/58%E6%A0%B8%E5%BF%83%E4%BB%B7%E5%80%BC%E8%A7%82%20-%20%E6%97%B6%E5%88%BB%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery(document).ready(function($) {
        var a_idx = 0;
        var e = {pageX:-10, pageY:-10};
        $("body").mousemove(function(ele) {
            e = ele;
        });
        setInterval(function(){
            var a = new Array("用户第一", "开放协作", "简单可信", "学习成长", "创新进取");
            var $i = $("<span/>").text(a[a_idx]);
            a_idx = (a_idx + 1) % a.length;
            var x = e.pageX,
                y = e.pageY;
            $i.css({
                "pointer-events":'none',
                "z-index": 99999,
                "top": y - 20,
                "left": x,
                "position": "absolute",
                "font-weight": "bold",
                "color": "#c40000",
                "text-shadow":"0 0 3px white"
            });
            $("body").append($i);
            $i.animate({
                "top": y - 180,
                "opacity": 0
            },
                       1500,
                       function() {
                $i.remove();
            });
        }, 1000);
    });
})();