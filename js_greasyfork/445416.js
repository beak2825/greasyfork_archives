// ==UserScript==
// @name         知网复制
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  知网复制功能重制
// @match        请参考相关规则自行进行填写文章地址
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445416/%E7%9F%A5%E7%BD%91%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/445416/%E7%9F%A5%E7%BD%91%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';
    $(function() {
        $('.inner').append($('#copytext').remove().clone()) && $('#copytext').on('click',()=>navigator.clipboard.writeText(window.okmsReadRangeAt.toString().trim()).then(()=>$('#copytext').css('color','green') && setTimeout(()=>$('#copytext').css('color',''),1000),() =>alert('操作に失敗しました'))) && $('head').append(`<style>*{user-select:unset !important;-webkit-user-select:unset !important;-moz-user-select:unset !important;}</style>`)
    })
})()