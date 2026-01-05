// ==UserScript==
// @name         nh87.cn获取番号及文件名
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  try to take over the world!
// @author       ZMeng
// @match        http://www.nh87.cn/*
// @include      http://www.nh87.cn/*
// @match        http://nanrenvip.net/*
// @include      http://nanrenvip.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28709/nh87cn%E8%8E%B7%E5%8F%96%E7%95%AA%E5%8F%B7%E5%8F%8A%E6%96%87%E4%BB%B6%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/28709/nh87cn%E8%8E%B7%E5%8F%96%E7%95%AA%E5%8F%B7%E5%8F%8A%E6%96%87%E4%BB%B6%E5%90%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.clear();
    var list = $('.link').map(function () {
        var $list_img = $(this).find('.list_img');
        var $list_text = $(this).find('.list_text');
        var imgUrl = $list_img.find('a img').data('original').replace('-small', '').replace('small-', '');
        if (imgUrl.indexOf('/') == 0) {
            imgUrl = 'http://' + window.location.host + imgUrl;
        }
        var number = $.trim($('span', $list_text).find('date:eq(0) a').text());
        var title = $.trim($('span', $list_text).find('p').text()).replace(/<\/a>/g, '').replace(/\\/g, '').replace(/\//g, '').replace(/\*/g, '').replace(/</g, '').replace(/>/g, '').replace(/\|/g, '').replace(/\?/g, '');
        var date = $.trim($('span', $list_text).find('date:eq(1)').text());
        return '{"img":"' + imgUrl + '","number":"' + number + '","title":"' + title + '","date":"' + date + '"}';
    }).get();
    var codeJson = '[' + list.join(',') + ']';
    //console.info(codeJson);
    $('.well_tit').append('<button type="button" id="btn-clipboard" class="btn btn-default btn-clipboard" data-clipboard-text=\'' + codeJson + '\'><a href="javascript:;">Copy</a></button>');
    $('.g960-90').remove();
    $('.content').css('background-image', 'none');

    //var year = $('button a').map(function (i) {
    //    if ($.trim($(this).text()).length > 0) {
    //        return $(this).text() + '\r\n';
    //    }
    //}).toArray().join('');
    //console.log(year);

    //var replace_list = ['</a>', '\\\\', '/', ':', '\\\*', '\\\?', '"', '<', '>', '|'];
    //var title = $('.list_text').map(function (i) {
    //    var $em = $(this).find('em');
    //    var code = $em.find('a').text();
    //    var title = $em.find('p').text().toString().replace(/<\/a>/g, '').replace(/\\/g, '').replace(/\//g, '').replace(/\*/g, '').replace(/</g, '').replace(/>/g, '').replace(/\|/g, '').replace(/\?/g, '');
    //    var date = $(this).find('.good').text();
    //    return code + ' ' + title + date + '\r\n';
    //}).toArray().join('');
    //console.log(title);

    //function replaceAll(text, s1, s2) {
    //    return text.replace(new RegExp(s1, "gm"), s2);
    //}

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onreadystatechange = function () {
        if (this.readyState == 'complete') {
            go();
        }
    };
    script.onload = function () {
        go();
    };
    script.src = '//cdn.bootcss.com/clipboard.js/1.6.1/clipboard.js';
    head.appendChild(script);

    function go() {
        var clipboard = new Clipboard('.btn-clipboard');
        clipboard.on('success', function (e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            $('a', $(e.trigger)).text('Copy !');
            e.clearSelection();
        });
    }
})();