// ==UserScript==
// @name         Village Game Auto Farm
// @namespace    Pion
// @version      1.2
// @description  Telegram Villiage Game AutoPlay
// @author       Pion
// @match        https://web.telegram.org/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24183/Village%20Game%20Auto%20Farm.user.js
// @updateURL https://update.greasyfork.org/scripts/24183/Village%20Game%20Auto%20Farm.meta.js
// ==/UserScript==

var work = "/work";
var sell = "/harvest";
var quest = "/quest";

var work_time = 12;
var sell_time = 20;

var markBtn = null;
var sendBtn = document.getElementsByClassName('composer_rich_textarea')[0];

var Work_Timer = setInterval(function() {
    sendBtn.innerHTML = work;
    jQuery('.im_submit').trigger('mousedown');
}, work_time * 60 * 1000);

var Sell_Timer = setInterval(function() {
    sendBtn.innerHTML = sell;
    jQuery('.im_submit').trigger('mousedown');
}, sell_time * 60 * 1000);

var autoQuest = setInterval(function() {
    markBtn = jQuery('.reply_markup_button');
    switch (markBtn.length) {
        case 10:
            markBtn[1].click();
            break;
        case 9:
            markBtn[6].click();
            break;
        case 8:
            markBtn[5].click();
            break;
        case 5:
            markBtn[1].click();
            break;
        case 2:
            markBtn[0].click();
            break;
        default:
            sendBtn.innerHTML = quest;
            jQuery('.im_submit').trigger('mousedown');
            break;
    }
}, 3 * 1000);