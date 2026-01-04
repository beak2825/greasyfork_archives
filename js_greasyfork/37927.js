// ==UserScript==
// @name        牛X云
// @name:zh-CN   牛X云
// @description:zh-cn 牛X云播放
// @namespace   no
// @run-at     document-idle
// @include     http://g.shumafen.cn/*
// @require      https://code.jquery.com/jquery-latest.js
// @version     1.7.0
// @grant 		none
// @description 牛X云
// @downloadURL https://update.greasyfork.org/scripts/37927/%E7%89%9BX%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/37927/%E7%89%9BX%E4%BA%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(".file").each(function(){
        let url = 'http://beijixs.cn/xxyun.aspx?id='+$(this).attr('data');
        $(this).find('.file_name').append(`&nbsp;&nbsp;&nbsp;<a href="javascript:;" data-href="${url}" class="play">播放</a>
`)
    })
    $('body').before('<video id="video" controls width="100%" height="100%" style="width: 100%; height: 100%; background-color: rgb(0, 0, 0);"></video>')
    $('body .play').on('click',function(){
        $('#video').attr('src',$(this).attr('data-href'))[0].load();
    })

})();