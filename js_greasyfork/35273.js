// ==UserScript==
// @name         老E直播间优化
// @namespace    www.zhanqi.tv
// @version      0.1
// @description  去广告,去聊天列表,保留聊天输入框,自动清理过多网页元素.
// @author       zifux
// @match        *://www.zhanqi.tv/edmunddzhang
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/35273/%E8%80%81E%E7%9B%B4%E6%92%AD%E9%97%B4%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/35273/%E8%80%81E%E7%9B%B4%E6%92%AD%E9%97%B4%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var width=$('.live-star-content').css('width').replace('px','');
    var height=width*9/16;
    $('.js-right-chat-layer').css('display','none');
    $('.live-star-content').css('padding-top','0px');
    $('.live-room-content').css('width',width+'px');
    $('#js-flash-panel').css('height',height+'px');
    //$('.js-room-follow-area').css('float','left').css('margin-top','-4px').css('height','28px').css('line-height','28px').children().css('height','28px').css('line-height','28px');
    $('#js-room-desc-collapse-btn').remove();
    $('.js-room-chat-widget-area').remove();
    $('.js-chat-control').css('height','auto').css('border','none').css('background','none');
    $('.live-chat-content').css('float','right').css('height','auto').css('left','210px').css('top',height+135+'px').css('position','absolute').css('background','none');
    $('.js-room-notice-area').remove();
    $('.room-chat-notice-layer').remove();
    $('.js-chat-ads').remove();
    $('.js-fans-list-panel').remove();
    $('.js-room-qn-recommend-panel').remove();
    $('#js-room-extend-ads-area').remove();
    setInterval(function(){$('.js-chat-msg-list').children().remove();},1000*12);
})();