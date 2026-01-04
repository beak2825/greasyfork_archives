// ==UserScript==
// @name         DLSite circle filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DLSiteで特定のサークルを非表示にする
// @author       俺
// @compatible   Chrome
// @match        http://www.dlsite.com/maniax/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373406/DLSite%20circle%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/373406/DLSite%20circle%20filter.meta.js
// ==/UserScript==

var blockID=['00000'];
var blockID_length = blockID.length;
$(function() {
    // 検索用
    $('._search_result_list').children().each(function() {
        for (var i = 0; i < blockID_length; i++) {
            $('a[href*=' + blockID[i] + ']').parents('tr').remove();
        }
    });

    // メインぺージ用
    $('.n_work_list_container').children().each(function() {
    //$('.n_worklist.type_2col').children().each(function() { // 時間がかかる
        for (var i = 0; i < blockID_length; i++) {
            $('a[href*=' + blockID[i] + ']').closest('.n_worklist_item').remove();
        }
    });

    // 日付ページ用
    $('.work_block').children().each(function() {
        for (var i = 0; i < blockID_length; i++) {
            $('a[href*=' + blockID[i] + ']').closest('.n_worklist_item').remove();
        }
    });
});