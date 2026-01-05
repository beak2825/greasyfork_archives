// ==UserScript==
// @name         zimuzu.tv 批量复制迅雷链接
// @namespace    dishuostec
// @version      0.3.1
// @description  字幕组选择迅雷下载
// @author       dishuostec
// @match        http://www.zimuzu.tv/gresource/list/*
// @match        http://www.zimuzu.tv/resource/list/*
// @match        http://www.zmz2017.com/gresource/list/*
// @match        http://www.zmz2017.com/resource/list/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/26496/zimuzutv%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E8%BF%85%E9%9B%B7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/26496/zimuzutv%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E8%BF%85%E9%9B%B7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

function get_xunlei(){
    var urls = [];
    var anchor_text = $(this).data('text');
    $(':checkbox:checked').each(function(){
        var $link = $(this).closest('li').find('a:contains("'+anchor_text+'")');
        urls.push($link.attr('href'));
    });

    GM_setClipboard(urls.join('\n'));
    alert('复制了'+urls.length+'个链接');
}

$(function(){
    var $thunder_ed2k = $('<a ref="thunder" data-text="迅雷-电驴" style="background-color:red">[全部-迅雷-电驴]</>');
    var $thunder_magnet = $('<a ref="thunder" data-text="迅雷-磁力" style="background-color:red">[全部-迅雷-磁力]</>');
    $thunder_ed2k.on('click', get_xunlei);
    $thunder_magnet.on('click', get_xunlei);
    $('.media-control').find('a').last().after($thunder_ed2k).after($thunder_magnet);
});