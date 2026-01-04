// ==UserScript==
// @name         twi-douga オーバレイ広告削除
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       ぬ
// @description 削除
// @match        https://www.twidouga.net/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/421499/twi-douga%20%E3%82%AA%E3%83%BC%E3%83%90%E3%83%AC%E3%82%A4%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/421499/twi-douga%20%E3%82%AA%E3%83%BC%E3%83%90%E3%83%AC%E3%82%A4%E5%BA%83%E5%91%8A%E5%89%8A%E9%99%A4.meta.js
// ==/UserScript==

$(function(){
    setTimeout(function(){
        $("#gn_interstitial_close_icon").trigger('click');
    },0);
})(jQuery);