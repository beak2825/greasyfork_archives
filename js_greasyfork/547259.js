// ==UserScript==
// @name         tixcraft_area_goto_ticket_list
// @namespace    tixcraft_area_goto_ticket_list_cc
// @version      0.0.0
// @description  拓元售票：自動選取區域 (清單版)
// @author       cilegann
// @match        https://ticket-training.onrender.com/*
// @match        https://tixcraft.com/ticket/area/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547259/tixcraft_area_goto_ticket_list.user.js
// @updateURL https://update.greasyfork.org/scripts/547259/tixcraft_area_goto_ticket_list.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //param
    var target = "L2,211,4800+L2,204" //逗號分隔關鍵字，加號分隔不同組。例如 B1,6800+A2,7800 會先找有 B1、6800 的那區，再找 A2、7800 那區
    //param end


    const targets = target.split('+').map(pair => {
        const parts = pair.split(',');
        return parts;
    });


    var start_search = false;
    const blks = document.querySelector(".zone.area-list").querySelectorAll("li");
    var stop_searching = 0;
    if (target=="") {
        stop_searching = 1
    }

    for (var target_i = 0; target_i < targets.length && !stop_searching; target_i++) {
        var kws = targets[target_i];
        for (var blk_i = 0; blk_i < blks.length && !stop_searching; blk_i++) {
            var found = 1;
            var blk = blks[blk_i];
            var blk_txt = blk.textContent.replaceAll(/\s/g,'');
            if (blk_txt.includes("已售完")) {
                continue;
            }
            for (var kw_i = 0; kw_i < kws.length; kw_i++) {
                if (!blk_txt.includes(kws[kw_i])) {
                    found = 0;
                    break;
                }
            }
            if (!found) {
                continue;
            }
            stop_searching = 1;
            blk.querySelector("a").click();

        }
    }

})();