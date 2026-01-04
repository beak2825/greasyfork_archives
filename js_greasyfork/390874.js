// ==UserScript==
// @name         Grepolis tool 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tool per grepolis
// @author       OpsCrashed
// @match        https://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390874/Grepolis%20tool%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/390874/Grepolis%20tool%2020.meta.js
// ==/UserScript==

var $ = window.jQuery;

$("document").ready( function() {

    $("head").append("<style> .attack_table_box { display: none !important; }</style>");
    $("head").append("<style> .attack_support_window .button_wrapper { text-align: none !important; }");
    $("head").append("<style> #btn_runtime { float: left;}");
    $("head").append("<style> #btn_plan_attack_town { float: left;}");
    $("head").append("<style> #btn_attack_town { float: right !important; width: 116px;}");
    $("head").append("<style> .attack_support_window .button_wrapper .button { float: right; }");
    $("head").append("<style> .sandy-box .item.command .arrow_left, .arrow_right { visibility: hidden !important; }</style>");
    $("head").append("<style> #toolbar_activity_commands_list.fast .remove { left: 45px !important; }</style>");
    $("head").append("<style> .sandy-box .item.command .details_wrapper { right: 0; padding-left: 20px; }</style>");

});