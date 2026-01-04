// ==UserScript==
// @name         [kesai]bd-film移除广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bd-film移除广告,增加按分数等级简单过滤显示电影查询列表
// @author       kesai
// @match        https://www.bd-film.cc/*
// @match        https://www.bd2020.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/388233/%5Bkesai%5Dbd-film%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/388233/%5Bkesai%5Dbd-film%E7%A7%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    $('aaaaaa').css('display', 'none');
    $('iframe').prev().css('display', 'none');
    $('#gg_tonglan').css('display', 'none');
    $("body").bind("DOMNodeInserted", changes);

    var ul = $('<ul class="clearfix"><li class="text"><span class="text-muted">分数</span></li></ul>');
    $("#collapse").append(ul);
    var li_all = $('<li style="cursor:pointer;">全部</li>');
    var li_high = $('<li style="cursor:pointer;color:#FF0000">高分</li>');
    var li_middleHigh = $('<li style="cursor:pointer;color:#008000">中高分</li>');
    ul.append(li_all);
    ul.append(li_high);
    ul.append(li_middleHigh);
    var filterType = 0; //0:全部,1高分,2中高分

    li_all.click(function () {
        doFilterFilms(0);
    });

    li_high.click(function () {
        doFilterFilms(1);
    })

    li_middleHigh.click(function () {
        doFilterFilms(2)
    })

    function doFilterFilms(filterValue) {
        filterType = filterValue;
        filterLowFilms();
    }

    function filterLowFilms() {
        $(".list-item a").each(function () {
            $(this).parent().parent().css('display', 'block');
            if (filterType == 0) {

            } else if (filterType == 2) {
                if ($(this).css('color') === 'rgb(51, 122, 183)')
                    $(this).parent().parent().css('display', 'none')
            } else if (filterType == 1) {
                if ($(this).css('color') === 'rgb(51, 122, 183)' || $(this).css('color') === 'rgb(0, 128, 0)')
                    $(this).parent().parent().css('display', 'none')
            }
        });
    }

    function changes() {
        $('#jm_DIV_rrichrightB').css('display', 'none');
        $('#layui-layer1').css('display', 'none');
        filterLowFilms();
    }

})();