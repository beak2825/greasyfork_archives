// ==UserScript==
// @name         去除动漫之家漫画区右下角广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除动漫之家漫画区右下角广告及悬浮的移动端二维码
// @author       自律人形Alpha
// @match        *://manhua.dmzj.com/*
// @match        *://www.dmzj.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405739/%E5%8E%BB%E9%99%A4%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E6%BC%AB%E7%94%BB%E5%8C%BA%E5%8F%B3%E4%B8%8B%E8%A7%92%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405739/%E5%8E%BB%E9%99%A4%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E6%BC%AB%E7%94%BB%E5%8C%BA%E5%8F%B3%E4%B8%8B%E8%A7%92%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i

    var divs = document.getElementsByTagName('div');
    //消除广告本体
    for (i = 0; i < divs.length; i++) {
        if (divs[i].style.width == "320px" && divs[i].style.height == "270px")
        {divs[i].remove()}
    }

    //消除广告横条
    var note = document.getElementById('note');
    //console.log(note)
    if(note !== null)
    {note.remove()}

    //消除code及其按钮
    var ad_bottom_code = document.getElementsByClassName('ad_bottom_code');
    if(ad_bottom_code.length > 0)
    {ad_bottom_code[0].remove(0)}

    //消除悬浮的移动端二维码
    var float_code = document.getElementsByClassName('float_code');
    if(float_code.length > 0)
    {float_code[0].remove(0)}
})();