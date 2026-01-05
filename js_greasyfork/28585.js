// ==UserScript==
// @name         AM_hwm_refresh
// @namespace    AlaMote
// @version      0.2.1
// @description  Анти-кик
// @author       AlaMote
// @include      http://*heroeswm.ru/*
// @include      *178.248.235.15/*
// @include      *209.200.152.144/*
// @include      http://*lordswm.com/*
// @icon         http://www.hwm-img.totalh.net/favicon.png
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28585/AM_hwm_refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/28585/AM_hwm_refresh.meta.js
// ==/UserScript==

(function (window, undefined) {

    if (location.href.match(/fast_tour_hist/)) {
        setTimeout(function() {
            location.reload();
        }, 1000 * 5);
    }

    var title = $("title").html();
    var delay = 600;                          //как часто обновлять, в секундах

    var interval = setInterval(function () {

        //$("title").html(get_time(delay) + " " + title);
        delay--;

        if (delay <= 0)
            location.reload();
    }, 1000);

    function get_time(delay) {
        if (delay <= 60) {
            return "00:" + norm_nul(delay);
        }
        var sec = delay % 60;
        delay -= sec;
        var min = delay / 60;

        return norm_nul(min) + ":" + norm_nul(sec);

    }
    function norm_nul(x) {
        if (x < 10) {
            return "0" + x;    
        }
        else
            return x;
    }

})(window);






