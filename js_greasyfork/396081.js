// ==UserScript==
// @name         自由时报弹窗删除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自由时报的双语对照阅读新闻还是不错的学英语的地方，但是页面在静止一段时间后会有弹窗，删了
// @description  双语对照阅读地址：https://news.ltn.com.tw/topic/%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E8%AE%80%E6%96%B0%E8%81%9E
// @match        https://news.ltn.com.tw/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396081/%E8%87%AA%E7%94%B1%E6%97%B6%E6%8A%A5%E5%BC%B9%E7%AA%97%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/396081/%E8%87%AA%E7%94%B1%E6%97%B6%E6%8A%A5%E5%BC%B9%E7%AA%97%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删弹窗
    let x=$('#idle-notice');
    x.remove();
    console.log(x.attr('id') + ' removed successfully');

    // 删顶部菜单
    $('#ltnRWD > div.ltnheader.boxTitle.boxText').remove();

    //如果需要各种新闻广告一起删了吧
    $('#ltnRWD > div.content > section > div.evt.e103 > div').remove();
    $('#randBlock1').remove();
    $('#randBlock2').remove();
    $('#ltnRWD > div.content > section > div.evt.e22').remove();
    $('#marquee').remove();
    $('#right_blake').remove();
})();