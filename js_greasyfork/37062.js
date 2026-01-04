// ==UserScript==
// @name         虎牙免登陆
// @version      0.11
// @description  虎牙免登陆换画质
// @author       You
// @match        http://www.huya.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @namespace https://greasyfork.org/users/165658
// @downloadURL https://update.greasyfork.org/scripts/37062/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/37062/%E8%99%8E%E7%89%99%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    wait4Element("li[ibitrate='2000']", 1000, function() {
      console.log('no login loaded');
      $('#player-login-tip-wrap').remove();
      $(".player-videotype-list li").click(function(e) {
        var n = this;
        console.log(this);
        var s = $(n).attr("iBitRate");
        var o = $(n).attr("channelId");
        vplayer.vcore.reqBitRate(s,o);
        $('ul.player-videotype-list > li.on').removeClass('on');
        $(this).addClass('on');
        $('span.player-videotype-cur').text($(this).text());
        $('#player-login-tip-wrap').remove();
        $('.player-chest-login').remove();
      });
   });
})();

function wait4Element(selector, time, func) {
    if (document.querySelector(selector) !== null) {
        func();
        return;
    } else {
        setTimeout(function() {
            wait4Element(selector, time, func);
        }, time);
    }
}
