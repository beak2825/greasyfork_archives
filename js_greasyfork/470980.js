// ==UserScript==
// @name         Jut.su_AchievmentsGet
// @namespace    MeloniuM/Jut.su
// @version      0.1
// @description  Getting achievements without watching anime on jut.su
// @author       MeloniuM
// @license      MIT
// @match        https://jut.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jut.su
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470980/Jutsu_AchievmentsGet.user.js
// @updateURL https://update.greasyfork.org/scripts/470980/Jutsu_AchievmentsGet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('body').ready(function(){
        if ($('.header_video.allanimevideo').length == 0) return;
        let timer = setInterval(function(){
            if (typeof (player) == "undefined") return;
            if (!player.isReady_) return;
            getAchievement();
            clearInterval(timer);
        }, 1000);

        function getAchievement(){
            let i = 0;
            player.overlays_.forEach(function(curr, index){
                if ($(curr.el()).hasClass('achievement_vjs_margin')){
                    setTimeout(() => {
                        curr.show();
                        activate_achievement(curr, curr.options_.achiv_id, curr.options_.achiv_hash);
                        console.log($(curr.el()).find('.achievement_text_style').text());
                    }, i * 5100);
                    i++;
                }
            });
        }
    });
})();