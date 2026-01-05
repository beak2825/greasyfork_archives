// ==UserScript==
// @name         SteamGifts - Group Info Hover
// @namespace    https://www.steamgifts.com/discussion/7TeLS/script-request-groups-hover-identifier
// @version      1.0
// @description  https://www.steamgifts.com/discussion/7TeLS/script-request-groups-hover-identifier
// @author       Royalgamer06
// @include      https://www.steamgifts.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24310/SteamGifts%20-%20Group%20Info%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/24310/SteamGifts%20-%20Group%20Info%20Hover.meta.js
// ==/UserScript==

// Do you want the hover box to be displayed above your cursor instead of below your cursor? (true/false)
var pos_above_cursor = false;
$(document).ready(function() {
    $("body").append("<div id='groupTooltip' style='z-index:2147483647;border:1px solid #d6d6d6;background-color:#f3f3f3;display:none;position:absolute;width:300px'></div>");
    $("body").on("mousemove", ".giveaway__column--group", function(e) {
        if (!$(this).hasClass("tooltipShowing")) {
            $(this).addClass("tooltipShowing");
            $.get(this.href, function(data) {
                $("#groupTooltip").html($(".table__heading+ div", data).length > 0 ? $(".table__heading+ div", data).html() : $(".table--summary", data).html());
                $('#groupTooltip').css({
                    left: e.pageX + 10,
                    top: pos_above_cursor ? e.pageY - $("#groupTooltip").height() - 10 : e.pageY + 10,
                    display: "block"
                });
            });
        }
        $('#groupTooltip').css({
            left: e.pageX + 10,
            top: pos_above_cursor ? e.pageY - $("#groupTooltip").height() - 10 : e.pageY + 10
        });
    }).on("mouseleave", ".giveaway__column--group", function() {
        $('#groupTooltip').css({
            display: "none"
        }).html("");
        $(this).removeClass("tooltipShowing");
    }).on("click", function() {
        if(!$(this).is('#groupTooltip')) {
            $('#groupTooltip').css({
                display: "none"
            }).html("");
            $(this).removeClass("tooltipShowing");
        }
    });
});