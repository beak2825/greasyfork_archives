// ==UserScript==
// @name         zggg
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  try to take over the world!
// @author       You
// @match        https://www.zbg.com/trade/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382148/zggg.user.js
// @updateURL https://update.greasyfork.org/scripts/382148/zggg.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('脚本');
    $('.fill-area').css('position', 'fixed').css('left', 0).css('z-index', 9999999).css('width', '800px');
    $('#marketFrame').remove();
    $('.plate-area').remove();
    $('.trade-navbar').remove();
    $('.time').remove();
    $('.entrust-area').remove();
    setTimeout(function() {
        if($('.swal-modal .swal-text').text() == '未到开盘时间') {
            $(window).on('beforeunload', function(){
                return "Good bye";
            });
        }
    }, 2000)
})();