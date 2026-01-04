// ==UserScript==
// @name         Katakana Terminator height repairer
// @name:zh-CN  片假名终结者行高修复
// @namespace    http://tampermonkey.net/
// @supportURL  https://greasyfork.org/scripts/476378-katakana-terminator-height-repairer/feedback
// @version      2023.09.30.02
// @description  repair the height problem of Katakana Terminator in certain websites
// @description:zh-CN 修复了一些网頁中片假名终结者行高不當，顯示不全的的問題
// @author       Tu
// @license     MIT
// @match        *.bilibili.com/*
// @match        *.youtube.com/*
// @icon        https://upload.wikimedia.org/wikipedia/commons/2/28/Ja-Ruby.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/476378/Katakana%20Terminator%20height%20repairer.user.js
// @updateURL https://update.greasyfork.org/scripts/476378/Katakana%20Terminator%20height%20repairer.meta.js
// ==/UserScript==
GM_addStyle ( `
.small-item .title {
    line-break: anywhere!important;
    height: 44px!important;
}
.bili-video-card .bili-video-card__info--tit {
    height: initial;
}
.bili-video-card .bili-video-card__info--tit[data-v-15c84221] {
    height: initial;
}
#video-title.ytd-video-renderer {
    max-height: 6.3rem;
}
#video-title.ytd-rich-grid-media {
    max-height: 5.6rem;
}
` );
