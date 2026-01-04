// ==UserScript==
// @name         MP4BA复制BT和磁力链接地址到剪贴板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  MP4BA网站复制BT和磁力链接地址到剪贴板
// @author       LLII
// @match        http://www.mp4ba.com/*
// @grant        GM_setClipboard
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387888/MP4BA%E5%A4%8D%E5%88%B6BT%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/387888/MP4BA%E5%A4%8D%E5%88%B6BT%E5%92%8C%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E5%9C%B0%E5%9D%80%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

function get_xunlei(){
    var urls = [];
    var anchor_text = $(this).find("a").data('text');
    var filter = "#fadecon div.dow_con:eq("+anchor_text+") ul li a:not([class])"
    var a1 = $(filter)
    a1.each(function(){
        urls.push( $(this).attr('href'));
    });

    GM_setClipboard(urls.join('\n'));
    alert('复制了'+urls.length+'个链接');
}


(function() {
    'use strict';

    // Your code here...
        var $thunder_ed2k = $('<li><a href="javascript:void(0);" data-text="1" style="background-color:red">复制所有BT地址</a></li>');
    var $thunder_magnet = $('<li><a href="javascript:void(0);" data-text="2" style="background-color:red">复制所有磁力地址</a></li>');
    $thunder_ed2k.on('click', get_xunlei);
    $thunder_magnet.on('click', get_xunlei);
    $('#fadetab').find('li').last().after($thunder_ed2k).after($thunder_magnet);
})();