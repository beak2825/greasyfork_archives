// ==UserScript==
// @name        BiliBili剧集定位
// @namespace   https://kurosakirei.dev
// @version     0.5.0
// @author      KurosakiRei <kurosakirei@outlook.com>
// @source      https://github.com/trim21/webpack-userscript-template
// @match       https://www.bilibili.com/bangumi/play/*
// @require     https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @grant       GM.xmlHttpRequest
// @connect     httpbin.org
// @run-at      document-end
// @license     MIT
// @description 添加一个对正在播放的剧集进行定位的按钮到B站的番剧页面
// @downloadURL https://update.greasyfork.org/scripts/466217/BiliBili%E5%89%A7%E9%9B%86%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/466217/BiliBili%E5%89%A7%E9%9B%86%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
async function main() {
    setInterval(() => {
        if ($('#episodeLocate')[0] != undefined)
            return;
        let $listEl = $('#eplist_module');
        let $targetParentEl = $('#eplist_module div[class^=eplist_left_wrap]');
        let $targetEl = $targetParentEl.find('div[class^=modeChangeBtn_wrap]');
        let $cloneOne = $targetEl.clone();
        $cloneOne.html(`<svg version="1.1" class="modeChangeBtn_icon__HhjlI" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><g><g><path d="M256,176c-44.004,0-80.001,36-80.001,80c0,44.004,35.997,80,80.001,80c44.005,0,79.999-35.996,79.999-80
        C335.999,212,300.005,176,256,176z M446.938,234.667c-9.605-88.531-81.074-160-169.605-169.599V32h-42.666v33.067
        c-88.531,9.599-160,81.068-169.604,169.599H32v42.667h33.062c9.604,88.531,81.072,160,169.604,169.604V480h42.666v-33.062
        c88.531-9.604,160-81.073,169.605-169.604H480v-42.667H446.938z M256,405.333c-82.137,0-149.334-67.198-149.334-149.333
        c0-82.136,67.197-149.333,149.334-149.333c82.135,0,149.332,67.198,149.332,149.333C405.332,338.135,338.135,405.333,256,405.333z
        "></path></g></g></svg>`);
        $cloneOne.attr("id", "episodeLocate");
        $targetParentEl.append($cloneOne[0]);
        $('#episodeLocate').on('click', function () {
            let $targetEpisode = $listEl.find("div[class*=longListItem_select]");
            if ($targetEpisode.length)
                $targetEpisode[0].scrollIntoView(false);
        });
    }, 1000);
}
main().catch((e) => {
    console.log(e);
});

/******/ })()
;