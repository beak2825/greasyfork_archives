// ==UserScript==
// @name               Netflix CC 字幕样式（描边）by nk
// @namespace          http://tampermonkey.net/
// @version            1.0
// @description        更改 Netflix IMSC CC 字幕样式，使其变为接近日本 Blu-ray 字幕的描边风格
// @author             nightking
// @match              *://www.netflix.com/*
// @icon               https://www.google.cn/s2/favicons?sz=64&domain=netflix.com
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/542774/Netflix%20CC%20%E5%AD%97%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%88%E6%8F%8F%E8%BE%B9%EF%BC%89by%20nk.user.js
// @updateURL https://update.greasyfork.org/scripts/542774/Netflix%20CC%20%E5%AD%97%E5%B9%95%E6%A0%B7%E5%BC%8F%EF%BC%88%E6%8F%8F%E8%BE%B9%EF%BC%89by%20nk.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let subtitleStyle = `
.player-timedtext span {
    color: rgb(255, 255, 255) !important;
    /* -webkit-text-stroke: 0.01em black; */
    opacity: 1 !important;
    font-weight: 400 !important;
    font-family: 'GenSenRounded2 PJP', 'GenSenRounded2 JP', 'GenSenRounded2 TW', 'GenSenRounded2 TC', Netflix Sans, Helvetica Nueue, Helvetica, Arial, sans-serif !important;
    text-shadow: rgb(0, 0, 0) 0.05em 0 0, rgb(0, 0, 0) 0 -0.05em 0, rgb(0, 0, 0) 0 0.05em 0, rgb(0, 0, 0) -0.05em 0 0,
                 rgb(0, 0, 0) 0.04em 0.04em 0.04em, rgb(0, 0, 0) -0.04em 0.04em 0.04em, rgb(0, 0, 0) -0.04em -0.04em 0.04em, rgb(0, 0, 0) 0.04em -0.04em 0.04em,
                 rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em, rgb(0, 0, 0) 0 0 0.05em !important;
}
`;
    let applySubtitleStyle = document.createElement("style");
    applySubtitleStyle.innerHTML = subtitleStyle;
    document.head.appendChild(applySubtitleStyle);
})();
