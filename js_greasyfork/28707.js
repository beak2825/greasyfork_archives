// ==UserScript==
// @name         btdigg.pw自动追加种子内容
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  try to take over the world!
// @author       ZMeng
// @match        http://btdigg.pw/*
// @include      http://btdigg.pw/*
// @include      http://btdigg.co/*
// @include      http://btdigg.fyi/*
// @require      http://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require      http://cdn.bootcss.com/json2/20160511/json2.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28707/btdiggpw%E8%87%AA%E5%8A%A8%E8%BF%BD%E5%8A%A0%E7%A7%8D%E5%AD%90%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/28707/btdiggpw%E8%87%AA%E5%8A%A8%E8%BF%BD%E5%8A%A0%E7%A7%8D%E5%AD%90%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.clear();
    //$('head')
    //    .prepend('<link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">')
    //    .append('<script src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
    var $keyword = $('[name="keyword"]');
    $keyword.on('focus', function () {
        $(this).select();
    });
    $('iframe').remove();
    var search = '<p style="margin:3px 0;margin-bottom:10px;"><a href="javascript:;" style="font-size:15px;" onclick="$(\'body,html\').animate({ scrollTop: 0 }, 50);$(\'#kwd\').focus().select();">搜索</a></p>';
    var codeList = $('.list dl').map(function (i) {
        var $dl = $(this);
        $('dt a', $dl).attr('name', i + 'F');
        var title = $('dt a', $dl).text();
        var size = $('dd.attr > span:nth-child(2) > b', $dl).text();
        var files = $('dd.attr > span:nth-child(3) > b', $dl).text();
        var html = '<p style="margin:2px 0;width:360px;"><a href="#' + i + 'F" style="line-height: 18px;color:' + (i % 2 === 0 ? '#dd4b39' : '#1a04c3') + ';">' + title + '(' + size + ', ' + files + ')' + '</a></p>';
        return html;
    }).get().join('');
    $('<div></div>')
        .html(search + codeList)
        .css({ 'position': 'fixed', 'right': '10px', 'bottom': '5px', 'float': 'left', 'font-size': '13px', 'color': 'red' })
        .appendTo($('body'));
})();