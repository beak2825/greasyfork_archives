// ==UserScript==
// @name               Netflix CC 字幕样式（描边）
// @name:zh-TW         Netflix CC 字幕樣式（描邊）
// @name:ja            NetflixのCC字幕スタイル（縁取り）
// @namespace          http://tampermonkey.net/
// @version            0.21
// @description        更改 Netflix IMSC CC 字幕样式，使其变为接近日本 Blu-ray 字幕的描边风格
// @description:zh-TW  調整 Netflix IMSC CC 字幕樣式，讓風格更貼近日本藍光影片的字幕描邊效果
// @description:ja     NetflixのIMSC CC字幕のスタイルを、日本のBlu-ray字幕のような縁取りスタイルになるように変更する
// @author             TGSAN
// @match              *://www.netflix.com/*
// @match              *://www3.stage.netflix.com/*
// @icon               https://www.google.cn/s2/favicons?sz=64&domain=netflix.com
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/444131/Netflix%20CC%20%E5%AD%97%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%88%E6%8F%8F%E8%BE%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444131/Netflix%20CC%20%E5%AD%97%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%88%E6%8F%8F%E8%BE%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let subtitleStyle = `
.player-timedtext span {
    color: rgb(192, 192, 192) !important;
    /* -webkit-text-stroke: 0.01em black; */
    opacity: 1 !important;
    font-weight: 400 !important;
    font-family: 'GenSenRounded2 PJP', 'GenSenRounded2 JP', 'GenSenRounded2 TW', 'GenSenRounded2 TC', Netflix Sans, Helvetica Nueue, Helvetica, Arial, sans-serif !important;
    text-shadow: rgb(0, 0, 0) 0.05em 0 0, rgb(0, 0, 0) 0 -0.05em 0, rgb(0, 0, 0) 0 0.05em 0, rgb(0, 0, 0) -0.05em 0 0,
                 rgb(0, 0, 0) 0.04em 0.04em 0.04em, rgb(0, 0, 0) -0.04em 0.04em 0.04em, rgb(0, 0, 0) -0.04em -0.04em 0.04em, rgb(0, 0, 0) 0.04em -0.04em 0.04em,
                 rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em !important;
}
.image-based-subtitles {
    filter: brightness(75%);
}
`;
    let applySubtitleStyle = document.createElement("style");
    applySubtitleStyle.innerHTML = subtitleStyle;
    document.head.appendChild(applySubtitleStyle);
})();
