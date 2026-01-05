// ==UserScript==
// @name hacg.* ?
// @author         _
// @namespace      908869191@qq.com
// @description    司机工具
// @version        0.23
// @include        http://*.hacg.*/*
// @include        https://*.hacg.*/*
// @include        http://*.llss.me/*/*
// @include        https://*.llss.me/*/*
// @require        http://code.jquery.com/jquery-1.11.0.min.js
// @grant          GM_setClipboard
// @create         2017年01月13日13:11:50
// @lastmodified   2017年01月13日13:12:00
// @copyright      2017+, _
// @run-at         document-end
// @note           2017年01月13日13:13:18 第一版本
// @note           2017年01月29日01:31:54 更新域名范围
// @downloadURL https://update.greasyfork.org/scripts/26491/hacg%2A%20.user.js
// @updateURL https://update.greasyfork.org/scripts/26491/hacg%2A%20.meta.js
// ==/UserScript==


// magnet:?xt=urn:btih:dfd
var brow = [
    "<(~︶~)>",
    "φ(≧ω≦*)♪",
    "(艹皿艹 )",
    "(￣_,￣ )"
];

var torrents = [];
(function ($) {
    'use strict';
    var $ele = $('.entry-content').children();
    $.each($ele, function (index, item) {
        var $item = $(item);
        var maybeTorrent = $item.text().trim();
        var reg = new RegExp("[a-zA-Z0-9]{32}|[a-zA-Z0-9]{40}", "g");
        if (reg.test(maybeTorrent)) { // is torrent
            var text = maybeTorrent.match(reg);
            $.each(text, function (index, val) {
                $item.append('<br/>');
                var $a = '<a class="J-hocgin-zclip" '
                    + 'href="magnet:?xt=urn:btih:' + val + '" name="' + val + '">'
                    + brow[parseInt(Math.random() * brow.length)] + '  ~ ' + val
                    + '</a>';
                $item.append($a);
                torrents.push(val);
            });
        }
    });

    // Div
    var $div = $('<div style="display: inline-block;'
        + 'background: rgba(197, 197, 197, 0.22);'
        + 'padding:5px 5px;'
        + 'border-radius: 5px;'
        + 'box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset, 0 0.2em 1em rgba(0, 0, 0, 0.31);'
        + 'top: 40px;'
        + 'right: 20px;'
        + 'position: fixed;'
        + 'text-align: center"></div>');

    // header
    var $header = $('<div style="text-align: center">'
        + 'φ(≧ω≦*)♪'
        + '</div>');
    $div.append($header);
    $div.append('<hr style="margin: 2px;"/>');


    // content
    if (torrents.length > 0) {
        $.each(torrents, function (index, torrent) {
            var $p = $('<p  style="margin: 0;"></p>');
            $p.append($('<a href="magnet:?xt=urn:btih:' + torrent + '"' +
                ' style="margin-right: 5px;">迅雷下载</a>'));
            var $a = $('<a href="javascript:void;" ' +
                'style="margin-right: 5px;">复制</a>');
            bindCopyEvent($a, 'magnet:?xt=urn:btih:' + torrent, function (e) {
                $(e).text("已复制");
            });
            $p.append($a);
            $p.append($('<a href="#' + torrent + '">巡视</a>'));

            $div.append($p);
        });
    }else {
        $div.append('<p style="text-align: center;margin: 0;">车不见了?</p>');
    }

    // tool bar
    $div.append('<hr style="margin: 2px;"/>');
    var $toolbar = $('<div style="text-align: center"></div>');
    var $allDownload = $('<a href="#" style="margin-right: 5px;">全部下载</a>');
    var allTorrent = '';
    $.each(torrents, function (index, val) {
        allTorrent += 'magnet:?xt=urn:btih:' + val+"\n";
    });
    bindCopyEvent($allDownload,allTorrent, function (e) {
        $(e).text("复制完成");
    });
    $toolbar.append($allDownload);
    $toolbar.append('<a href="#" style="margin-right: 5px;">顶部</a>');
    var $share = $('<a href="#">分享页面</a>');
    bindCopyEvent($share, window.location.href, function (e) {
        $(e).text("复制完成");
    });
    $toolbar.append($share);
    $div.append($toolbar);


    $('body').append($div);
    // console.log("Say Bye.")

})(jQuery);

function bindCopyEvent(e, val, callback) {
    var $e = $(e);
    $e.data("text-clip", val);
    $e.on('click', function () {
        var data = $(this).data("text-clip");
        GM_setClipboard(data);
        if (!!callback) {
            callback(this);
        }
    });
}