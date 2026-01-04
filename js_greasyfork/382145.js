// ==UserScript==
// @name         Grepolis Tool
// @author       OpsCrashed
// @version      0.1
// @description Ciao
// @author       You
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @exclude      view-source://*
// @grant        none
// @namespace https://greasyfork.org/users/294403
// @downloadURL https://update.greasyfork.org/scripts/382145/Grepolis%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/382145/Grepolis%20Tool.meta.js
// ==/UserScript==

var $ = window.jQuery;
$("document").ready( function() {
    $("head").append("<style> .attack_table_box { display:none; !important; } </style>");
    $("head").append("<style> .attack_support_window .button_wrapper { text-align: right !important; } </style>");
    $("head").append("<style> .button_new.icon_type_runtime.icon_only .caption { display: none; }</style>");
    $("head").append("<style> .attack_support_window .tab_type_attack #btn_runtime { display: none; }</style>");
    $("head").append("<style> #btn_plan_attack_town { display: none !important; } .attack_support_window .tab_type_support #btn_runtime { display: none; }</style>");
    $("head").append("<style> .sandy-box .item.command .icon, .sandy-box .item.trade .icon { left: 10px !important; }</style>");
    $("head").append("<style> .sandy-box .item.command .arrow_left, .arrow_right { visibility: hidden !important; }</style>");
    $("head").append("<style> #toolbar_activity_commands_list.fast .remove { left: 45px !important; visibility: visible !important; }</style>");
    $("head").append("<style> .sandy-box .item.command .details_wrapper { right: 0; padding-left: 20px; }</style>");
    $("head").append("<style> .item.town_group_town, .sandy-box .item, .sandy-box .item_no_results { padding-right: 0 !important; }</style>");
});