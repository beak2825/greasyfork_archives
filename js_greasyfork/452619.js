// ==UserScript==
// @name         Twitch Albion直播，不在直播就自动切换
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  每20秒检测是否在直播，没在直播就随机切换其他主播
// @author       Pollex https://t.me/pollex
// @match        https://www.twitch.tv/sadicaz
// @match        https://www.twitch.tv/holyjckimjack
// @match        https://www.twitch.tv/dreamthief
// @match        https://www.twitch.tv/iamjg
// @match        https://www.twitch.tv/beast1k
// @match        https://www.twitch.tv/bastila
// @match        https://www.twitch.tv/fakturka
// @match        https://www.twitch.tv/murloka
// @match        https://www.twitch.tv/a_big_koko
// @match        https://www.twitch.tv/equartofficial
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/452619/Twitch%20Albion%E7%9B%B4%E6%92%AD%EF%BC%8C%E4%B8%8D%E5%9C%A8%E7%9B%B4%E6%92%AD%E5%B0%B1%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452619/Twitch%20Albion%E7%9B%B4%E6%92%AD%EF%BC%8C%E4%B8%8D%E5%9C%A8%E7%9B%B4%E6%92%AD%E5%B0%B1%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const links = ["https://www.twitch.tv/equartofficial",
    "https://www.twitch.tv/a_big_koko",
    "https://www.twitch.tv/murloka",
    "https://www.twitch.tv/sadicaz",
    "https://www.twitch.tv/holyjckimjack",
    "https://www.twitch.tv/dreamthief",
    "https://www.twitch.tv/iamjg",
    "https://www.twitch.tv/beast1k",
    "https://www.twitch.tv/bastila",
    "https://www.twitch.tv/fakturka"];
    var index = Math.floor(Math.random()*12);
    function next(){
        if(index > 11){
            index = 11;
        }
        location.replace(links[index]);
    }
    setInterval(function () {
        if (document.body.innerHTML.indexOf("data-a-target=\"player-overlay-click-handler\"") < 0){
            next();
        }
    }, 1*20*1000);
})();