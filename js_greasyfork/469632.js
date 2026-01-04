// ==UserScript==
// @name        bilibili-mobile-web
// @name:cn     bilibili移动端网页
// @name:en     bilibili-mobile-web
// @description bilibili移动端网页
// @description:en bilibili-mobile-web
// @version     0.0.8
// @match       *://m.bilibili.com/*
// @grant       GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at      document-end
// @license MIT
// @namespace https://greasyfork.org/users/37326
// @downloadURL https://update.greasyfork.org/scripts/469632/bilibili-mobile-web.user.js
// @updateURL https://update.greasyfork.org/scripts/469632/bilibili-mobile-web.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
async function main() {
    // 添加 CSS 样式
    GM_addStyle(`
    /*首页app下载提示*/
    .home-float-openapp {
        height: 0!important
    }
    .m-home-float-openapp {
        display: none!important
    }
    /*观看页app下载提示*/
    .m-video2-awaken-btn {
        display: none!important
    }
    /*观看前app下载提示*/
    .openapp-dialog {
        display: none!important
    }
    /*不隐藏播放器*/
    #app > div > div > div:nth-child(2) {
        display: unset!important
    }
    /*播放器上的下载提示*/
    #bilibiliPlayer div.mplayer-widescreen-callapp {
        display: none!important
    }
    .list-view__state {
        display: none
    }
    .m-nav-openapp {
        display: none!important
    }
    .m-float-openapp {
        display: none!important
    }

    .v-card-toapp > a {
        --avid: "/video/BV1HM4y1b79Z";
    }
    #app > div > div.m-search-result > div.result-panel {
        display: block!important
    }
`);
    if (window.location.href === "https://m.bilibili.com/")
        return window.addEventListener("click", function (e) {
            e.stopPropagation();
        }, true);
    const container = document.querySelector(".natural-module");
    container.addEventListener("click", function (e) {
        e.stopPropagation();
    }, true);
    const elements = document.querySelectorAll(".v-card-toapp");
    elements.forEach((element) => {
        const link = element.querySelector("a");
        if (link) {
            const parent = element;
            const dataAid = parent.dataset.aid;
            if (dataAid) {
                const url = `/video/av${dataAid}`;
                link.href = url;
            }
        }
    });
}
main().catch((e) => {
    console.log(e);
});

/******/ })()
;