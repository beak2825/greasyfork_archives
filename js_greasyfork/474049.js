// ==UserScript==
// @name         bilibili广告屏蔽
// @namespace    https://sfkgroup.github.io/
// @version      0.4
// @description  这是一个屏蔽bilibili中伪装成视频的广告的脚本.
// @author       SFKgroup
// @match        http://*.bilibili.com/*
// @match        https://*.bilibili.com/*
// @grant        GM_log
// @icon         https://sfkgroup.github.io/images/favicon.ico
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/474049/bilibili%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/474049/bilibili%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var count = 0
    function move(element) {
        if (element) {
            element.style.display = 'none';
        }
    }

    function ResumeError() { return true; }
    window.onerror = ResumeError

    let boxxes = document.querySelector("#i_cecream > div.bili-feed4 > main > div.feed2 > div > div.container.is-version8")
    if (boxxes) {
        for (let k = 0; k < boxxes.children.length; k++) {
            if (boxxes.children[k].getAttribute('class') == 'feed-card' && (boxxes.children[k].innerHTML.indexOf('bili-video-card__info--ad') > 0 || boxxes.children[k].innerHTML.indexOf('#palette-ad') > 0)) {
                boxxes.children[k].remove()
            }
        }
    }

    boxxes = document.querySelector("#i_cecream > div > div:nth-child(2) > div.search-content--gray.search-content > div > div > div > div.video.i_wrapper.search-all-list > div")
    if (boxxes) {
        for (let k = 0; k < boxxes.children.length; k++) {
            if (boxxes.children[k].innerHTML.indexOf('bili-video-card__info--ad') > 0) {
                boxxes.children[k].remove()
            }
        }
    }

    function remove_div() {
        move(document.querySelector("#slide_ad"))
        move(document.querySelector("#app > div.video-container-v1 > div.right-container.is-in-large-ab > div > a.ad-report.video-card-ad-small"))
        move(document.querySelector("#reco_list > div.rec-list > div.video-page-game-card-small"))
        move(document.querySelector("#activity_vote"))
        move(document.querySelector("#right-bottom-banner"))
        move(document.querySelector("body > div.desktop-download-tip"))
        move(document.querySelector("#bannerAd"))
        count++
        if (count >= 5) {
            clearInterval(timer)
            timer = setInterval(remove_div, 1000)
        }

    }
    var timer = setInterval(remove_div, 500)
})();