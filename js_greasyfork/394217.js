// ==UserScript==
// @name         写给天依
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  try to take over the world!
// @author       You
// @connect         www.baidu.com
// @include         *://ipv6.baidu.com/*
// @include         *://www.baidu.com/*
// @include         *://m.baidu.com/*
// @include         *://xueshu.baidu.com/s*
// @include         *://www.sogou.com/web*
// @include         *://www.sogou.com/sie*
// @include         *://www.sogou.com/sogou*
// @include         *://www.sogou.com/tx*
// @include         *://www.so.com/s?*
// @include         *://*.bing.com/*
// @include         *://encrypted.google.*/search*
// @include         *://*.google*/search*
// @include         *://*.google*/webhp*
// @include         *://www.google*/ac-notexist*
// @include         *://*.zhihu.com/*
// @exclude         *://*.google*/sorry*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394217/%E5%86%99%E7%BB%99%E5%A4%A9%E4%BE%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/394217/%E5%86%99%E7%BB%99%E5%A4%A9%E4%BE%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a_idx = 0 ;
   // document.write('<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>');
    var  str = '<img class="currentImg" id="currentImg" onload="alog &amp;&amp;   src="http://image1.admaimai.com/uploadfiles/1%2838809%29.jpg" width="572" height="423" log-rightclick="p=5.102" title="点击查看源网页" style="left: 0px; top: 194px; width: 490px; height: 362.36px; cursor: pointer;">';
    $("body").click(function(e) {
        var a = new Array("❤天依你好啊!❤","❤忍耐❤","❤喜乐 ❤","❤恩慈❤","❤信实❤","❤节制❤","❤温柔 ❤","❤ 仁爱 ❤","❤良善❤");
        var $i = $("<span/>").text(a[a_idx]);
        a_idx = (a_idx + 1) % a.length;
        var x = e.pageX,
            y = e.pageY;
        $i.css({
            "z-index": 9999999999999999999999,
            "top": y - 20,
            "left": x,
            "position": "absolute",
            "font-weight": "bold",
            "color": "rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"
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
    });
})();