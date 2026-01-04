// ==UserScript==
// @name         Youku HD
// @namespace    http://v.youku.com/
// @version      0.0.1
// @description  解开优酷 VIP 专属, 蓝光HD HDR, 移除视频水印
// @author       Neal
// @match        http*://v.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394607/Youku%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/394607/Youku%20HD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var unlockHD = document.createElement('li');
    unlockHD.innerHTML = "<span class=\"text\">解开HD</span>";
    unlockHD.onclick = unlock1080;
    unlockHD.setAttribute('class', 'play-fn-li');

    function unlock1080(){
        $('div.settings-item.quality-item.disable.youku_vip_pay_btn.q1080p > span').html('👌');
        $('div.settings-item.quality-item.disable.youku_vip_pay_btn.q1080p').attr('class','settings-item quality-item');

        $('div.settings-item.quality-item.disable.youku_vip_pay_btn.q1080p_hdr > span').html('👌');
        $('div.settings-item.quality-item.disable.youku_vip_pay_btn.q1080p_hdr').attr('class','settings-item quality-item');

        $('.youku-layer-logo').hide();
    }
    $('.play-fn').append(unlockHD);
})();

