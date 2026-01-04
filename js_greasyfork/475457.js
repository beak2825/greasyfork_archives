// ==UserScript==
// @name          Swiper广告去除
// @description   去除Swiper广告。
// @version       1.0.0
// @namespace     Swiper广告去除
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//www.swiper.com.cn/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/475457/Swiper%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/475457/Swiper%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});

    var fun = setInterval(function() {
        var obj = $('.adsbygoogle');

        if(obj.length) {
            // console.log(obj);
            obj.remove();
        }else {
            clearInterval(fun);
        }
    }, 1000);
})();

function init() {
    $(window).on('scroll', function(){
        if($('.adsbygoogle').length) {
            $('.adsbygoogle').remove();
        }
    });
}