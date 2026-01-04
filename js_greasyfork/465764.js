// ==UserScript==
// @name        T2SCHOLA 文字数カウンター
// @description あいうえお
// @match       https://t2schola.titech.ac.jp/mod/assign/view.php?id=*&action=editsubmission
// @author      hayatroid
// @version     0.2
// @license     CC0-1.0 Universal
// @require     https://code.jquery.com/jquery-3.6.4.min.js
// @namespace https://greasyfork.org/users/815990
// @downloadURL https://update.greasyfork.org/scripts/465764/T2SCHOLA%20%E6%96%87%E5%AD%97%E6%95%B0%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/465764/T2SCHOLA%20%E6%96%87%E5%AD%97%E6%95%B0%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    $(".editor_atto").append(`<div id="aiueo">0</div>`);
    $("#id_onlinetext_editoreditable").on('input', ()=>{
    	$("#aiueo").text($("#id_onlinetext_editoreditable").length);
    });
});
