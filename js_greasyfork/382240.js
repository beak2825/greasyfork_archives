// ==UserScript==
// @name         OpsCrashed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  x a sinistra
// @author       You
// @match        https://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382240/OpsCrashed.user.js
// @updateURL https://update.greasyfork.org/scripts/382240/OpsCrashed.meta.js
// ==/UserScript==

var $ = window.jQuery;
$("document").ready( function() {

    $("head").append("<style> .sandy-box .item.command .icon, .sandy-box .item.trade .icon { left: 10px !important; }</style>");
    $("head").append("<style> #toolbar_activity_commands_list.fast .remove { left: 60px !important; }</style>");
    $("head").append("<style> .sandy-box .item.command .details_wrapper { right: 0; padding-left: 30px; }</style>");
    $("head").append("<style> .item.town_group_town, .sandy-box .item, .sandy-box .item_no_results { padding-right: 0 !important; }</style>");
})();