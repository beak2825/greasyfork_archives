// ==UserScript==
// @name         dapanyuntu
// @namespace    dapanyuntu
// @version      0.1
// @author       zzz
// @description 大盘云图界面简化
// @include     http://summary.jrj.com.cn/dpyt/
// @match        *summary.jrj.com.cn/dpyt/
// @icon         <$ICON$>
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437699/dapanyuntu.user.js
// @updateURL https://update.greasyfork.org/scripts/437699/dapanyuntu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    $(document).find(".header").hide();

    $(document).find(".stock_inf").hide();

    $(document).find(".jrj-where").hide();

    $(document).find(".scgl_s1.mt").hide();

    $(document).find(".hd").hide();
    $(document).find(".navBox").hide();

    $(document).find(".pinglunIfr").hide();

    $(document).find(".xl-chrome-ext-bar").hide();

    $(document).find(".footer").hide();

    $(document).find(".zn_tip").hide();
    $(document).find(".zn_tip_min").hide();


    //$(document).find(".main").width("100%");
    //$(document).find(".main").height("100%");

    $(".main").css({
        width:  $(window).width()-20,
        height: $(window).height()-20
    });

    //$('#body').width("100%");
    //$('#body').height("100%");
    $("#map").css({
        width:  $(window).width()-30,
        height: $(window).height()-30,
    });


    $("#body").css({
        width:  $(window).width()-30,
        height: $(window).height()-30,
    });

    $("#map_scale").css({
        width:  $(window).width()-30,
        height: $(window).height()-30,
    });







})();