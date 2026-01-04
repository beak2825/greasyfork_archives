// ==UserScript==
// @name         ppomppu_gif_auto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  뽐뿌 gif 자동 재생
// @author       darkyop
// @match        https://www.ppomppu.co.kr/*
// @icon         https://www.google.com/s2/favicons?domain=co.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432712/ppomppu_gif_auto.user.js
// @updateURL https://update.greasyfork.org/scripts/432712/ppomppu_gif_auto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("[name='ppom_gif_video_player']").each(function() {
        var parent = $(this).parent();
        var btnGif = parent.find("a[onclick]");
        if(btnGif.length > 0) {
            btnGif.trigger("click");
        }
    });
})();