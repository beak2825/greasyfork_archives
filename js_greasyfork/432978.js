// ==UserScript==
// @name         Baidu
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  百度皮肤
// @author       Victor
// @match       https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=manongjc.com
// @grant        none
// @icon    https://p0.meituan.net/dpgroup/cc8b105052c5ebadefa85d57404ef6fc45399.jpg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/432978/Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/432978/Baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function up() {
        $(".mnav").css({'color':'rgb(255 157 196 / 85%)'})
        $(".c-font-normal ").css({'color':'rgb(255 157 196 / 85%)'})
        document.getElementById('head').style.background = '#fff0'
        $(".s-skin-hasbg").css({'background':'rgb(255 255 255 / 0)'})
        $(".s-top-wrap").css({'background':'rgb(255 255 255 / 0)'})
        $("#bottom_layer").remove()
        $("#s-hotsearch-wrapper").remove()
        $("#hotsearch-content-wrapper").remove()
        $("#s_side_wrapper").remove()
        $("#u1").remove()
        $("html").css({"overflow-y":"auto"})
        document.getElementById('kw').setAttribute("placeholder","哥哥从这儿进~·~")
    }
    up()

})();