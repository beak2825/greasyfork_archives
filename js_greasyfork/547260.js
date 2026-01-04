// ==UserScript==
// @name         tixcraft_area_goto_ticket_below
// @namespace    tixcraft_area_goto_ticket_below_cc
// @version      0.0.0
// @description  拓元售票：自動選取區域 (某個票價以下都可以)
// @author       cilegann
// @match        https://ticket-training.onrender.com/*
// @match        https://tixcraft.com/ticket/area/*
// @license      MIT

// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547260/tixcraft_area_goto_ticket_below.user.js
// @updateURL https://update.greasyfork.org/scripts/547260/tixcraft_area_goto_ticket_below.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //param
    var target = "6800"
    //param end

    target = target.replaceAll(/\s/g,'');
    var start_search = false;
    const blks = document.querySelector(".zone.area-list").querySelectorAll("li")
    for (var blk_i = 0; blk_i < blks.length; blk_i++) {
        var blk = blks[blk_i];
        var blk_txt = blk.textContent.replaceAll(/\s/g,'');
        if (blk_txt.includes(target)) {
            start_search = true;
        }
        if (!start_search) {
            continue;
        }
        if (blk_txt.includes("已售完")) {
            continue;
        }
        blk.querySelector("a").click();
        break;
    }
})();