// ==UserScript==
// @name         cug教务系统一键评价
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  中国地质大学(武汉)教务系统一键评价
// @author       Chunibyo
// @match        http://202.114.207.126/jwglxt/xspjgl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395464/cug%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/395464/cug%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

jQuery(function($) {
    'use strict';
    $(window).ready(function () {

        var _btn = '<button class="btn btn-default btn-default" type="button" id="btn_xspj_yjpj"><i class="icon-save bigger-120"></i>&nbsp;一键评价&nbsp;</button>';

        var add_btn = function () {
            $("#ajaxForm1 div.btn-group").append(_btn);
            $("#btn_xspj_yjpj").click(function(){
                auto_complete();
            });
        }

        var auto_complete = function () {
            $(".input-xspj-1 input[type='radio']").attr("checked", 'checked');
            $(".input-xspj-2 input[type='radio']").last().attr("checked", 'checked');
        }

        setTimeout(add_btn, 600);
        $("#gbox_tempGrid").click(function () {
            setTimeout(add_btn, 600);
            auto_complete();
        })

    });
});