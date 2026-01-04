// ==UserScript==
// @name        cp_game_list
// @namespace   http://tampermonkey.net/
// @description chinaplay order list
// @license     MIT
// @include     https://chinaplay.store/personal/settings/*
// @version     2023.08.17.1
// @run-at      document-end
// @require     http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require     http://cdn.bootcss.com/jquery/3.1.0/jquery.cookie.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473237/cp_game_list.user.js
// @updateURL https://update.greasyfork.org/scripts/473237/cp_game_list.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse;font-family:simsun !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");

$('.main-menu').append('<div><a class="catalog-active" href="javascript:void(0);" onclick="list();">List</a></div>');
$('.personal-page-title').after('<table id="a"></table>');

unsafeWindow.list = function(){
    $('#a').empty();
    $.each($('.gift-line').get().reverse(), function(){
        var t = $(this).find('.gift-header:first').text();
        var d = $(this).find('.gift-line-top div');
        var e, p;
        if (d) {
            e = $(d[0]).text();
            var m = /[0-9.]+/.exec($(d[1]).text());
            if (m)
                p = m[0];
        }
        $(this).find('.key-list li div .key').each(function(i, v){
            var k = $.trim($(v).text());
            $('#a').append(`<tr><td>${(i+1)}</td><td>${t}</td><td>${k}</td><td></td><td></td><td>${p}</td><td>chinaplay</td><td></td><td>'${e}</td></tr>`);
        });
    });
}