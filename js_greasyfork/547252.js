// ==UserScript==
// @name         tixcraft_area_select
// @namespace    tixcraft_area_select_cc
// @version      0.0.3
// @description  拓元售票：自動選取區域、輸入會員驗證碼、選張數、勾選同意、focus 在驗證碼
// @author       cilegann, AndrewWang
// @match        https://ticket-training.onrender.com/*
// @match        https://tixcraft.com/ticket/area/*
// @match        https://tixcraft.com/ticket/verify/*
// @match        https://tixcraft.com/ticket/ticket/*
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547252/tixcraft_area_select.user.js
// @updateURL https://update.greasyfork.org/scripts/547252/tixcraft_area_select.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //param
    const target = "109+108+117+118+213+212+214+211+215+6800+5800+4800" //逗號分隔關鍵字，加號分隔不同組。例如 B1,6800+A2,7800 會先找有 B1、6800 的那區，再找 A2、7800 那區

    // 會員或信用卡驗證都是填這個 memberId
    const memberId = 'TWICETPE';
    // 填入想要的張數
    const preferCount = "2";
    //param end


    const zones = document.querySelector(".zone.area-list");
    if (zones) {
        const blks = zones.querySelectorAll("li");
        const targets = target.split('+').map(pair => {
            const parts = pair.split(',');
            return parts;
        });

        var start_search = false;
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
    }

    const member = document.querySelector('#form-ticket-verify > div.col-md-12.col-xs-12.text-center.py-3.promo-box > input');
    if (member) {
        member.value = memberId;
        member.dispatchEvent(new Event('change'));
        const button = document.querySelector('#form-ticket-verify > div.col-md-12.col-xs-12.text-center.pt-2 > button');
        if (button) {
            button.click();
        }
    }

    const checkbox = document.querySelector('#TicketForm_agree');
    if (checkbox) {
        checkbox.checked = true;
    }

    const select = document.querySelector('[id^="TicketForm_ticketPrice_"]');
    if (select) {
        select.value = preferCount;
        select.dispatchEvent(new Event('change'));
    }

    const verifycode = document.querySelector('#TicketForm_verifyCode');
    if (verifycode) {
        verifycode.focus();
    }

    const checkboxTrain = document.querySelector('#terms-checkbox');
    if (checkboxTrain) {
        checkboxTrain.checked = true;
    }

    const memberTrain = document.querySelector('#memberId');
    if (memberTrain) {
        memberTrain.value = memberId;
        member.dispatchEvent(new Event('change'));
        const buttonTrain = document.querySelector('.submit-button');
        if (buttonTrain) {
            buttonTrain.click();
        }
    }

    const selectTrain = document.querySelector('.quantity-select');
    if (selectTrain) {
        selectTrain.value = preferCount;
        selectTrain.dispatchEvent(new Event('change'));
    }

    const verifycodeTrain = document.querySelector('#captcha-input');
    if (verifycodeTrain) {
        verifycodeTrain.focus();
    }
})();