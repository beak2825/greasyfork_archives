// ==UserScript==
// @name        dアニメストアで横スクロール
// @namespace   https://github.com/chimaha/dAnimeScroll
// @match       https://animestore.docomo.ne.jp/animestore/tp_pc
// @match       https://animestore.docomo.ne.jp/animestore/CF/search_index
// @match       https://animestore.docomo.ne.jp/animestore/CR/*
// @match       https://animestore.docomo.ne.jp/animestore/ci_pc?workId=*
// @grant       none
// @version     2.1
// @author      chimaha
// @description dアニメストアの横スクロールを、Firefoxで使用できるようにします
// @license     MIT license
// @icon        https://animestore.docomo.ne.jp/favicon.ico
// @compatible  firefox
// @supportURL  https://github.com/chimaha/dAnimeScroll/issues
// @downloadURL https://update.greasyfork.org/scripts/471401/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%81%A7%E6%A8%AA%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/471401/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%81%A7%E6%A8%AA%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

/*! dアニメストアで横スクロール | MIT license | https://github.com/chimaha/dAnimeScroll/blob/main/LICENSE */

"use strict";

const observer = new MutationObserver(() => {
    const sliders = document.querySelectorAll(".p-slider__itemList");

    for (const slider of sliders) {
        if (slider.dataset.addScroll == "true") { continue; }
        slider.dataset.addScroll = "true";

        slider.addEventListener('mousedown', e => {
            if (e.button == 0) {
                e.preventDefault();
            } else if (e.button == 2) {
                e.stopPropagation();
            }
        });
    }
});
const config = { childList: true, subtree: true };
observer.observe(document.body, config);