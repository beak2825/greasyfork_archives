// ==UserScript==
// @name          游侠游戏截图广告去除
// @description   去除游侠简介中游戏截图中广告。
// @version       1.0.8
// @namespace     游侠游戏截图广告去除
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//down.ali213.net/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @downloadURL https://update.greasyfork.org/scripts/434022/%E6%B8%B8%E4%BE%A0%E6%B8%B8%E6%88%8F%E6%88%AA%E5%9B%BE%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/434022/%E6%B8%B8%E4%BE%A0%E6%B8%B8%E6%88%8F%E6%88%AA%E5%9B%BE%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
	'use strict';
	$(function () {
		init();
	});
})();

function init() {
    var close_btn = $('<a href="javascript:void(0);" class="downInfoBtn" style="position: absolute;right: 0;top: 0;display: block;width: 60px;line-height: 30px;text-align: center;color: #FFF;background: red;">关闭</a>').click(function(){
        $('.detailAlertBox').hide();
    });
    $('.downInfoBox').append(close_btn);

    $(window).on('scroll', function(){
        if($('.detail_body_con_bb_con_con #gc0').length>0) {
            if($(window).scrollTop() + $(window).height() > $('.detail_body_con_bb_con_con #gc0').offset().top - 50) {
                $('.detail_body_con_bb_con_con #gc0').click();
            }
        }

        if($('.nyfmt').length>0) {
            $('.nyfmt').hide();
        }
    });
}