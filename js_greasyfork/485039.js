// ==UserScript==
// @name         フォント変更
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 見にくいフォントを好きなフォトに出来ます
// @author       tube
// @match        https://play.typeracer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typeracer.com
// @license MIT
// @resource   Font https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400&display=swap
// @grant      GM_addStyle
// @grant      GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/485039/%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/485039/%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("Font"));
//フォントを使えるようにする呪文

const coutdownPopupStyleCSS = `<style>
    body > div.countdownPopup.horizontalCountdownPopup{
        transform: scale(0.5) !important;
        position: fixed !important;
        left: 70vw !important;
        top: 0vh !important;
        visibility: visible !important;
        clip: rect(auto, auto, auto, auto) !important;
        overflow: visible !important;
    }
    </style>`;


const mainStyle = `<style>
    *{
        font-family : 'Noto Sans', sans-serif !important;
    }
    .mainViewport table.inputPanel table div span{
        font-size : 22px !important;
    }
    </style>`;
document.body.parentElement.insertAdjacentHTML("beforeend",coutdownPopupStyleCSS);
//カウントダウンのスタイル変更

document.body.parentElement.insertAdjacentHTML('beforeend',mainStyle);
//フォント関係変更