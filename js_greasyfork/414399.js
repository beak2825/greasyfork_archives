// ==UserScript==
// @name         IBMS2小工具
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  IBMS2小工具。
// @author       Jx
// @match        http://192.168.16.205:*/admin/*
// @match        http://ibms-v2.oo/admin/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414399/IBMS2%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/414399/IBMS2%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').append(`
        <style>
            .yh_ibms_tool{
                width: 40px;
                padding: 10px 0;
                background:#00a65a;
                position:fixed;
                top:48%;
                right:0;
                z-index:9999;
                border:1px solid #ccc;
                border-radius: 10px 0 0 10px;
            }
            .yh_ibms_tool.in{
                padding:10px;
                width:200px;
            }
            .yh_ibms_tool_content{
                display:none;
            }
            .yh_ibms_tool.in .yh_ibms_tool_content{
                display:block;
            }
            .yh_ibms_tool_title{
                display:block;
                width: 12px;
                margin:0 auto;
                word-break: break-all;
                color:#fff;
                font-weight:700;
                text-align: center;
                cursor:pointer;
            }
            .yh_ibms_tool.in .yh_ibms_tool_title{
                display:none;
            }
            .yh_ibms_tool_hide{
                position: absolute;
                right: 0;
                top: 0;
                color: #fff;
                font-weight: 700;
                width: 20px;
                font-size: 20px;
                height: 20px;
                text-align: center;
                line-height: 20px;
                border: 1px solid #ccc;
                cursor:pointer;
            }
            .yh_ibms_tool_hide:hover{
                opacity:0.6;
            }
        </style>
`);
    $('body').append(`
    <div class="yh_ibms_tool" id="yh_ibms_tool_layer">
        <span class="yh_ibms_tool_title">IBMS2小工具</span>
        <div class="yh_ibms_tool_content">
            <i class="yh_ibms_tool_hide">-</i>
            <button type="button" id="yh_ibms_fill_btn">填充年度预算模态框值</button>
        </div>
    </div>
`);

    $(document).on('click', '#yh_ibms_fill_btn', function () {
        $('#month_table input').each(function (input) {
            if ($(this).attr('readonly') == undefined){
                $(this).val(_.random(1,10));
            }
        });
    });
    $(document).on('click', '#yh_ibms_close_btn', function () {
        $('#yh_ibms_tool_layer').remove();
    });
    $(document).on('click', '.yh_ibms_tool_title', function () {
        $('.yh_ibms_tool').addClass('in');
    });
    $(document).on('click', '.yh_ibms_tool_hide', function () {
        $('.yh_ibms_tool').removeClass('in');
    });
})();