// ==UserScript==
// @name         Knzk_Music
// @namespace    https://github.com/yuzulabo
// @version      1.1.0
// @description  Knzk Music ユーザスクリプト版
// @author       neziri_wasabi (yuzu_1203)
// @match        https://knzk.me/*
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/36453/Knzk_Music.user.js
// @updateURL https://update.greasyfork.org/scripts/36453/Knzk_Music.meta.js
// ==/UserScript==

(function() {
    var nav = document.getElementsByClassName('drawer__inner');
    var audio_elem = document.createElement('iframe');
    audio_elem.src = "https://nzws.me/files/yuzu_1203/knzk-music/music.html";
    audio_elem.setAttribute('style', 'width: 100%; height: 100%;');

    window.onload = function () {
        if (!nav[0]) return;
        nav[0].appendChild(audio_elem);
    };
})();
