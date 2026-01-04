// ==UserScript==
// @name          去除百度网盘视频
// @description   去除百度网盘云一朵智能助理视频。
// @version       1.0.1
// @namespace     去除百度网盘视频
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *//pan.baidu.com/*
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469442/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/469442/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var bdv_fun;
(function () {
	'use strict';
	setDelBDVideo(bdv_fun);

    $(document).on('click', '.u-tooltip', function(){
        setDelBDVideo(bdv_fun);
    });
})();

function setDelBDVideo(bdv_fun) {
    bdv_fun = setInterval(function() {
        if($('#chatView').length) {
            $('.nd-chat-ai-btn').remove();
            $('#chatView').remove();
        }else {
            clearInterval(bdv_fun);
        }
    }, 1000);
}