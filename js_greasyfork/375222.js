// ==UserScript==
// @name         王总点击出字
// @namespace    baiwudu.com
// @version      1.1.1
// @description  王总点击出字代码
// @author       作者：王总
// @match        *://www.baiwudu.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/375222/%E7%8E%8B%E6%80%BB%E7%82%B9%E5%87%BB%E5%87%BA%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/375222/%E7%8E%8B%E6%80%BB%E7%82%B9%E5%87%BB%E5%87%BA%E5%AD%97.meta.js
// ==/UserScript==

$(function() {
    var a_idx = 0,
        b_idx = 0;
    c_idx = 0;
    jQuery(document).ready(function($) {
        $("body").click(function(e) {
            var a = new Array("欢迎您", "富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"),
                b = new Array("#09ebfc", "#ff6651", "#ffb351", "#51ff65", "#5197ff", "#a551ff", "#ff51f7", "#ff518e", "#ff5163", "#efff51"),
                c = new Array("12", "14", "16", "18", "20", "22", "24", "26", "28", "30");
            var $i = $("<span/>").text(a[a_idx]);
            a_idx = (a_idx + 1) % a.length;
            b_idx = (b_idx + 1) % b.length;
            c_idx = (c_idx + 1) % c.length;
            var x = e.pageX,
                y = e.pageY;
            $i.css({
                "z-index": 999,
                "top": y - 20,
                "left": x,
                "position": "absolute",
                "font-weight": "bold",
                "font-size": c[c_idx] + "px",
                "color": b[b_idx]
            });
            $("body").append($i);
            $i.animate({
                "top": y - 180,
                "opacity": 0
            }, 1500, function() {
                $i.remove();
            });
        });
    });
    var _hmt = _hmt || [];
})