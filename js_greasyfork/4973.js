// ==UserScript==
// @name        SSまとめサイト用・記事名自動ソート
// @namespace   http://devdev.nagoya/
// @include     http://ss2ch.r401.net/*
// @description SSまとめアンテナ「でんぶん2ちゃんねる」にて記事名でソートするスクリプト
// @version     1.1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/4973/SS%E3%81%BE%E3%81%A8%E3%82%81%E3%82%B5%E3%82%A4%E3%83%88%E7%94%A8%E3%83%BB%E8%A8%98%E4%BA%8B%E5%90%8D%E8%87%AA%E5%8B%95%E3%82%BD%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/4973/SS%E3%81%BE%E3%81%A8%E3%82%81%E3%82%B5%E3%82%A4%E3%83%88%E7%94%A8%E3%83%BB%E8%A8%98%E4%BA%8B%E5%90%8D%E8%87%AA%E5%8B%95%E3%82%BD%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function($) {
    sortByTitle();
    if (document.URL.match(/.+tags.+/)) {} else {
        sortByCategory();
    }
    $(".entry-title").append("[sort] ");
    formatChange();
})(jQuery);

function sortByTitle() {
    var arr = new Array();
    $('.news').each(function(i) {
        arr[i] = new Object();
        arr[i].key = $(":nth-child(2)", this).children("a").html();
        arr[i].value = $(this);
    });
    arr.sort(function(a, b) {
        if (document.URL.match(/.+tags.+/)) {
            return b.key > a.key ? -1 : 1; //タグ別ページ用逆ソート
        } else {
            return b.key < a.key ? -1 : 1; //降順ソート
        }
    });
    for (i = 0; i < arr.length; i++) {
        $("#nav-below").before(arr[i].value);
    }
}

function sortByCategory() {
    var arr = new Array();
    $('.news').each(function(i) {
        arr[i] = new Object();
        arr[i].key = $(":nth-child(2)", this).children("span:first").children("a").html();
        arr[i].value = $(this);
    });
    arr.sort(function(a, b) {
        return b.key > a.key ? -1 : 1;
    });
    for (i = 0; i < arr.length; i++) {
        $("#nav-below").before(arr[i].value);
    }
}

function formatChange() {
    $('#wrap').css('padding-top', '3px');
    $('.single-entry-content:first').css('margin-top', '3px');
    if ($('.date:first').next().hasClass('date')) {
        var srr = $('.date:first').next().text() + " - " + $('.date:first').text();
        $('.date:first').html(srr);
        $('.date:first').next().css('display', 'none');
    }
    var arr = new Array();
    $('.title').each(function(i) {
        arr[i] = new Object();
        arr[i].ch1 = $(this).children("a");
        arr[i].ch2 = $(this).children("span:first");
        arr[i].ch3 = $(this);
        arr[i].ch4 = $(this).prev();
    });
    for (i = 0; i < arr.length; i++) {
        if (document.URL.match(/.+tags.+/)) {} else {
            arr[i].ch1.before(arr[i].ch2);
        }
        arr[i].ch3.append(arr[i].ch4);
        arr[i].ch2.css('border-right', '2px solid #999');
        arr[i].ch2.css('margin-right', '10px');
        arr[i].ch2.css('border-left', 'none');
    }
    $('.lt10,.lt14').css({
        'float': 'right',
        'width': '70px',
        'font-size': '0.9em',
        'color': '#CCC'
    });
    $('.lt14').css({
        'font-size': '0.7em',
        'color': '#999',
        'width': '100px'
    });
    $('div.title>span:nth-child(4),div.title>span:nth-child(5),div.title>span:nth-child(6)').css({
        'font-size': '0.7em'
    });
    $('div.title>span:first-child,div.title>span:nth-child(3)').css({
        'font-size': '0.9em'
    });
    $('div.title>span:first-child').css({
        'padding-left': '0'
    });
}
