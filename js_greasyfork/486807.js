// ==UserScript==
// @name HoYoLAB responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.2
// @description HoYoLAB website is more suitable for wide screens
// @author BreatFR
// @homepageURL https://gitlab.com/breatfr/hoyolab
// @supportURL https://www.hoyolab.com/article/23010773
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.hoyolab.com/*
// @downloadURL https://update.greasyfork.org/scripts/486807/HoYoLAB%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/486807/HoYoLAB%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    ::-webkit-scrollbar {
      width: 5px !important;
    }

    ::-webkit-scrollbar:horizontal {
        height: 5px !important;
    }

    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey !important;
        border-radius: 20px !important;
        color-scheme: dark !important;
    }

    ::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 5px grey !important;
        border-radius: 20px !important;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: white !important;
    }

    * {
        scrollbar-color: grey white !important;
        scrollbar-width: thin !important;
    }

    #anchor_spiral_abyss > div.container,
    body > div.pc-root-layout > div.pc-root-layout__container > div > div {
        max-width: 100% !important;
    }

    .root-page-container__content {
        max-width: 100% !important;
    }

    .mhy-article-card__cover img {
        max-height: 100% !important;
    }

    .mhy-article-card__cover {
        left: 15% !important;
    }

    .mhy-article-card__img {
        left: 25% !important;
    }

    .mhy-article-card__video {
        left: 20% !important;
    }

    .root-page-container__left {
        margin-left: 10px;
        max-width: 100% !important;
    }

    .root-page-container__right {
        margin-right: 10px;
    }

    body > div.app-root > div > div.scroll-container.main-wrapper > div,
    body > div.app-root > div > div.scroll-container.main-wrapper > div > div.page-body.body {
        border-radius: 16px !important;
        width: 100% !important;
    }

    .pc-root-layout__container {
        max-width: 100% !important;
        padding-left: 10px;
        padding-right: 10px;
    }

    #anchor_character > div.pc-swiper-block-layout__content > div.container {
        width: 50% !important;
    }

    #anchor_character > div.pc-swiper-block-layout__content > div.pc-role-container {
        height: 450px !important;
    }

    .rpg-role-detail {
        height: 450px !important;
        left: 110% !important;
        position: absolute !important;
        top: 0px !important;
    }

    .hsr-rtn-container {
        margin-left: 25% !important;
    }

    .article-menu-fix-layout {
        margin-left: 10px !important;
    }

    .hsr-rtn-btm {
        margin-left: 1.2% !important;
    }

    .activity-header.mb-2.flex.items-center {
        margin-left: -47.5% !important;
    }

    .activity-header.mb-2.flex.items-center > div {
        margin-left: 32.5% !important;
    }

    .world-exploration > div {
        max-width: 100% !important;
    }

    .hsr-home-main,
    .hsr-home-main-container,
    .pc-home-banner {
        margin-left: 5px;
        width: calc(100% - 60px) !important;
    }

    .menu-outline {
        right: 0px !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
