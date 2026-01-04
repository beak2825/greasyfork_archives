// ==UserScript==
// @name                FuckAv01.tvFuckAdblock
// @description         A simple script let av01.tv's player could load correctly, when using adblock.
// @description:zh-tw   使用adblock時，一個簡單的腳本讓av01.tv的播放器可以正確加載。
// @icon                https://media.av01.tv/wp-content/uploads/2017/04/cropped-logo-sq-150x150.png
// @match               https://www.av01.tv/*
// @run-at              document-end
// @version 0.0.1.20171011164315
// @namespace https://greasyfork.org/users/155512
// @downloadURL https://update.greasyfork.org/scripts/34040/FuckAv01tvFuckAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/34040/FuckAv01tvFuckAdblock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof player !== 'undefined' && player.src() === "") {
        player.qualityPickerPlugin();
        player.src({
            type: "application/x-mpegURL",
            src: window.atob(getCode())
        });
        document.querySelector("#sidebar>#custom_html-3").remove();
    }
})();