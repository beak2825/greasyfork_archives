// ==UserScript==
// @name         tixcraft_game_goto_area
// @namespace    tixcraft_game_goto_area_cc
// @version      0.1.0
// @description  拓元售票：game頁面跳轉至area頁面
// @author       cilegann
// @match        https://ticket-training.onrender.com/*
// @match        https://tixcraft.com/activity/detail/*
// @match        https://tixcraft.com/activity/game/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547258/tixcraft_game_goto_area.user.js
// @updateURL https://update.greasyfork.org/scripts/547258/tixcraft_game_goto_area.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //param
    const target_date = '7/26';
    const target_name_exact_match = 'TWICE＜THIS IS FOR＞WORLD TOUR IN TAIPEI';
    //param end

    const evt_list = document.querySelectorAll(".gridc.fcTxt");
    for (var i = 0; i < evt_list.length; i++) {
        var tr_element = evt_list[i];
        var info_list = tr_element.querySelectorAll("td");
        var info_date = info_list[0];
        var info_name = info_list[1];
        var info_status = info_list[3];
        if (!info_date.textContent.includes(target_date)){
            continue;
        }
        if ((target_name_exact_match != '') && (info_name.textContent != target_name_exact_match)) {
            continue;
        }

        var area_btn = info_status.querySelector(".btn");
        if (area_btn) {
            area_btn.click();
        }
    }
})();