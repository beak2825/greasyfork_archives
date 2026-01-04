// ==UserScript==
// @name         DPD Online - better view
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Jimi
// @match        https://online.dpd.com.pl/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377069/DPD%20Online%20-%20better%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/377069/DPD%20Online%20-%20better%20view.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    $('body, #contentTd, #contentTd div, .top_menu_linia_tr, .bottom_menu_linia_tr, #main_form, #main_form>div, #packages, .buttonTableToolbar, .centeredVerticalRow, .jmesa').css('width','-webkit-fill-available');
    $('.mainFormLeft, .region_right').css('width', 'auto');
    $('.header_logo').css('display', 'none');
    $('#siteutilities').css('padding-top', '0');
    $('#siteutilities').css('height', '16px');
})();