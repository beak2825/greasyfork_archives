// ==UserScript==
// @name         龙空大图变小显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/zh-CN/scripts?q=%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @include      http://*.lkong.net/*
// @downloadURL https://update.greasyfork.org/scripts/370728/%E9%BE%99%E7%A9%BA%E5%A4%A7%E5%9B%BE%E5%8F%98%E5%B0%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/370728/%E9%BE%99%E7%A9%BA%E5%A4%A7%E5%9B%BE%E5%8F%98%E5%B0%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var img = $('#postlist img');

    for(var i in img){
        var selfimg = img.eq(i);
        var Img = new Image();
        Img.src = selfimg.attr('src');
        Img.index = i;
        Img.onload = function (selfimg)
        {
            if(this.width>757){
                console.log(this.src);
                $('#postlist img').eq(this.index).css('width','757px')
                console.log(this.index);
                console.log(selfimg.attr('src'))
                console.log(selfimg[0])

                selfimg.css('width','757px')
            }
        }
    }
})();