// ==UserScript==
// @name         Leangoo Style Customizer
// @namespace    https://www.leangoo.com/kanban/
// @version      0.2
// @description  Changed the style of Leangoo!
// @author       Ruter
// @match        https://www.leangoo.com/kanban/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28179/Leangoo%20Style%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/28179/Leangoo%20Style%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change the body background
    $("#imgBackground").css("background", "#FFF");
    // Change the category
    $(".board_category").css({"color":"rgb(140, 140, 140)"});
    $(".board_category").find("label").css({"background":"rgb(0, 121, 191)"});
    $(".archive-category,.archive-category > a").css("color", "rgb(140, 140, 140)");
    // Change the nav bar
    $("#main_navbar > nav").css("background", "#026AA7");
    $(".nav-center").remove();
    $("#navbar-logo").parent().addClass("nav-center");
    $("#board_nav > nav").css("background-color", "rgba(2, 106, 167, 0.65)");
    // Change the board
    $("#divStarBoard").find("label.board_in_list_stat").css({"color":"rgba(255,255,255,0.6)"});
    $("#divStarBoard").find("label.board_in_list_stat").each(function(){console.log(1);});
    $(".create_new_board").css({"color":"#8c8c8c","background":"#E2E4E6"});
    $(".create_new_board").mouseover(function() {$(this).css({"-webkit-filter":"brightness(0.9)"});}).mouseout(function() {$(this).css({"-webkit-filter":"brightness(1)"});});
    $(".ui-sortable-handle").css({"background":"rgb(0, 121, 191)","color":"#FFF"});
    $(".ui-sortable-handle").mouseover(function() {$(this).css({"-webkit-filter":"brightness(1.1)"});}).mouseout(function() {$(this).css({"-webkit-filter":"brightness(1)"});});
    // Change the label
    $(".add_list_label, .add_lane_label").css("background", "rgba(0,0,0,0.3)");
    // Change the lane footer
    $(".lane-list-footer").css("background-color", "#f5f5f5");
})();