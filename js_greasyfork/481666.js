// ==UserScript==
// @name         add-new-book-series
// @namespace    https://greasyfork.org/users/1203219
// @author       harutya
// @match        *://bgm.tv/new_subject/1
// @match        *://chii.in/new_subject/1
// @match        *://bangumi.tv/new_subject/1
// @license      MIT
// @version      0.0.1
// @description  Bangumi 创建漫画条目填充模板
// @downloadURL https://update.greasyfork.org/scripts/481666/add-new-book-series.user.js
// @updateURL https://update.greasyfork.org/scripts/481666/add-new-book-series.meta.js
// ==/UserScript==

(function () {

    'use strict';

    $(function () {

        const today = new Date().toISOString().split('T')[0];

        WikiTpl('Manga');
        $('#cat_comic').prop('checked', true);
        $('#subjectSeries').prop('checked', true);
        $('#columnInSubjectA small').append(`
            <lable>&nbsp;|&nbsp;</lable>
            <a href="javascript:void(0)" class="l issue">[默认]</a>
            <a href="javascript:void(0)" class="l issue">[周刊]</a>
            <a href="javascript:void(0)" class="l issue">[月刊]</a>
        `);
        $('#infobox_normal input.inputtext.id:last').before(`
            <input class="inputtext id" tabindex="1024" value="原作">
            <input class="inputtext prop" value>
            <br clear="all">
            <input class="inputtext id" tabindex="1024" value="作画">
            <input class="inputtext prop" value>
            <br clear="all">
            <input class="inputtext id" tabindex="1024" value="人物原案">
            <input class="inputtext prop" value>
            <br clear="all">
            <input class="inputtext id" tabindex="1024" value="作者">
            <input class="inputtext prop" value>
            <br clear="all">
            <input class="inputtext id" tabindex="1024" value="开始">
            <input class="inputtext prop" value="${today}">
            <br clear="all">
            <input class="inputtext id" tabindex="1024" value="结束">
            <input class="inputtext prop" value>
            <br clear="all">
        `);
        NormaltoWCODE();
        WCODEtoNormal();

        $('.issue').click(function () {
            let year = today.substring(0, 4);
            let value = today;
            if ($(this).text() == '[周刊]') {
                value += ` (${year}年XX号)`;
            } else if ($(this).text() == '[月刊]') {
                value += ` (${year}年XX月号)`;
            }
            $(`#infobox_normal input.inputtext.id[value="开始"]`).next().val(value);
        });

    });

})();