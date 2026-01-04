// ==UserScript==
// @name         HKU Moodle Table Style Correcting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Correcting the overfloating error of tables in HKU moodle. 纠正HKUmoodle表格溢出
// @author       Byron Ding
// @license      AGPL-3.0 License
// @match        https://moodle.hku.hk/*
// @icon         https://hku.hk/assets/img/hku-logo.svg?t=1678891777
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/470126/HKU%20Moodle%20Table%20Style%20Correcting.user.js
// @updateURL https://update.greasyfork.org/scripts/470126/HKU%20Moodle%20Table%20Style%20Correcting.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';

    function autosized_all_found_table(){
        $("thead").css("word-wrap","break-word").css("word-break"," break-all");
        $("tbody").css("word-wrap","break-word").css("word-break"," break-all");
    }


    $(document).ready(autosized_all_found_table);
    // Your code here...
})();