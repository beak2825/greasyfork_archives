// ==UserScript==
// @name         Bilibli auto enable  auto generator subtitle
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  B站，Bilibli 自动启用站内机翻字幕
// @author       newwoodbridge
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vite.dev
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526519/Bilibli%20auto%20enable%20%20auto%20generator%20subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/526519/Bilibli%20auto%20enable%20%20auto%20generator%20subtitle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkIsEnabled = ()=> {
        const dom = document.querySelector(`g[mask="url(#__lottie_element_617)"]`)
        return !!dom
    }

    const autoEnable = () => {
        setTimeout(() => {
            if(!checkIsEnabled()) {
                const icon =document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-subtitle .bpx-common-svg-icon")
                icon.click()
                console.log("bilibli auto generatored subtitle auto display feature is enabled!")
            }

        },2000)
    }

    autoEnable()

    const video = document.querySelector("#bilibili-player div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch video")


    const config = { attributes: true, childList: false, subtree: false };

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            autoEnable()
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(video, config);
})();