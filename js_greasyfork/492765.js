// ==UserScript==
// @name         小白游戏网优化
// @namespace    https://greasyfork.org/zh-CN/users/314234-yong-hu-ming
// @version      1.0.0
// @description  小白游戏网界面优化
// @author       Yong_Hu_Ming
// @license      MIT License
// @match        *://www.xbgame.net/*
// @match        *://www.xbgame.net
// @run-at      document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492765/%E5%B0%8F%E7%99%BD%E6%B8%B8%E6%88%8F%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/492765/%E5%B0%8F%E7%99%BD%E6%B8%B8%E6%88%8F%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const css = `.video-wrapper {
    display: none !important;
}

.section {
    max-height: 80vh !important;
    background-color: midnightblue !important;
}

.wrapper.poa {
    margin-top: -60vh !important;
}

.search-types-cycles.poa {
    display: none !important;
}

#jitheme_header_top02 .sup {
    display: none !important;
}

.b2small.shop-tips {
    display: none !important;
}

.sort-blocks {
    display: none !important;
}

.jitheme_home_2_tpqh1 {
    display: none !important;
}

#jitheme_home_12_cosplay {
    display: none !important;
}

#jitheme_home_13_photo {
    display: none !important;
}

.dplayer-logo {
    display: none !important;
}

.jitheme_logo {
    background-image: url("https://www.xbgame.net/wp-content/uploads/2022/06/1656411250-logo.png") !important;
}

.wrapper.wrapper-bq {
    display: none !important;
}

.dplayer-video.dplayer-video-current {
    display: var(--video-display) !important;
}

video[style="object-fit: contain;"]{
    --video-display: block;
}

:root{
    --video-display: none;
}
`
    GM_addStyle(css);
})();

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const videos = document.getElementsByTagName('video');
        for (let i = 0; i < videos.length; i++) {
            videos[i].removeAttribute('poster');
        }
        document.querySelector('.dplayer-video.dplayer-video-current').style.setProperty('--video-display', 'block');
    }, 1000);
});