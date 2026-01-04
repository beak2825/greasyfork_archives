// ==UserScript==
// @name        動畫瘋廣告be quite!
// @namespace   動畫瘋廣告be quite!
// @version     2.6
// @description 將動畫瘋廣告改成黑色無聲影片、移除廣告超連結
// @author      fmnijk
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon        https://www.google.com/s2/favicons?domain=ani.gamer.com.tw
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/410693/%E5%8B%95%E7%95%AB%E7%98%8B%E5%BB%A3%E5%91%8Abe%20quite%21.user.js
// @updateURL https://update.greasyfork.org/scripts/410693/%E5%8B%95%E7%95%AB%E7%98%8B%E5%BB%A3%E5%91%8Abe%20quite%21.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';

    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    function muteAd() {
        const video = $("#ani_video_html5_api");
        if (video && video.getAttribute('src') !== 'https://fmnijk.github.io/black.mp4' && video.duration < 133) {
            video.setAttribute('src', 'https://fmnijk.github.io/black.mp4');
        }

        // 自動點擊同意分級制度
        const adultElement = $("#adult");
        if (adultElement) {
            adultElement.click();
        }
    }

    setInterval(muteAd, 100);
})();
