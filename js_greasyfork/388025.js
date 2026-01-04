// ==UserScript==
// @name         我真帅
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @required     https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388025/%E6%88%91%E7%9C%9F%E5%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/388025/%E6%88%91%E7%9C%9F%E5%B8%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a_idx = 0;
    var time1;
    var str = "真";
    jQuery(document).ready(function($) {
        $("body").click(function(e) {
            myTime();
            var a = new Array("我"+str+"帅");
            str += "真";
            var $i = $("<span/>").text(a[a_idx]);
            a_idx = (a_idx + 1) % a.length;
            var x = e.pageX,
                y = e.pageY;
            $i.css({
                "z-index": 9999,
                "top": y - 20,
                "left": x,
                "position": "absolute",
                "font-weight": "bold",
                "font-size":"50px",
                "color": "#ff6651"
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
    });
    /*计时器
    *   鼠标点击开始计时  a_count可以持续累加
    *   鼠标停止点击5秒   a_count归1
    * */

    function myTime() {
        //每次鼠标点击  计时器重新开始计时
        clearTimeout(time1);
        time1=window.setTimeout(function () {
            str = "真";
            clearTimeout(time1);
        },2000);
    }
})();