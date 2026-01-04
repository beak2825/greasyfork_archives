// ==UserScript==
// @name         屏蔽pandatv熊猫令和广告
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  屏蔽导致电脑卡顿的熊猫令.屏蔽弹出的广告,屏蔽活动及佛跳墙
// @author       aiden
// @match        https://www.panda.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40191/%E5%B1%8F%E8%94%BDpandatv%E7%86%8A%E7%8C%AB%E4%BB%A4%E5%92%8C%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/40191/%E5%B1%8F%E8%94%BDpandatv%E7%86%8A%E7%8C%AB%E4%BB%A4%E5%92%8C%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

var m = function (f) {
    return f.toString().split('\n').slice(1, - 1).join('\n');
};
loadCss = function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function () { /*
            .icon-panda-emoji, .icon-panda-emoji-static, .icon-panda-emoji-1-static, .liveosTag_1Z4iZj, .adPicRoot_7c5z4, .room-banner-images {
               display: none;
               visibility: hidden;
            }

            .act-view-container, .act-foolsday, .act-zhuxianmarch-icon, .h5player-gift-fudai-countdown,.h5player-gift-fudai-animation,.h5player-gift-fudai-icon-num-x,.h5player-gift-fudai-icon-num-5,.h5player-gift-fudai-icon-num-2,.h5player-gift-fudai-icon-num-3,.h5player-gift-fudai-icon-num-4,.h5player-gift-fudai-icon-num-6,.h5player-gift-fudai-icon-num-7,.h5player-gift-fudai-icon-num-8,.h5player-gift-fudai-icon-num-9,.rac-cont, .rac-cont-zhuxianCome, .room-activities {
               display: none;
               visibility: hidden;
            }


          */
    });
    var head = document.querySelector('head');
    head.appendChild(style);
};
loadCss();