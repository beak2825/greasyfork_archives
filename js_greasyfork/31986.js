// ==UserScript==
// @name         百度翻译 竖屏
// @namespace    http://jcodeing.com/
// @version      0.1
// @description  Mac屏较小,开多个窗口时可节省空间.
// @author       Jcodeing
// @match        *://fanyi.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31986/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%20%E7%AB%96%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/31986/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%20%E7%AB%96%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    //portrait
    var trans_left_width = $('.trans-left').width();
    var trans_left_height = $('.trans-left').height();
    $('.trans-left').css({"float":"left","position":"relative"});
    var trans_right_height = $('.trans-right').height();
    $('.trans-right').css({"float":"left","position":"relative","left":-trans_left_width,"top":trans_left_height});
    $('.translateio').css({"width":"100%","height":trans_left_height + trans_right_height});
    //page simplify
    $('.header').hide();
    $('.footer').hide();
    $('.copyright').hide();
    $('.manual-trans-btn').hide();
    $('.feedback-btn').remove();
    $('.follow-wrapper').remove();
    $('#transOtherRight').remove();
})();