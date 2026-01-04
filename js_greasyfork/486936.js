// ==UserScript==
// @name         Youtube - Video Player Bar Simplified
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Youtube Video Player Bar Simplified. Removed "Next", "Auto Play", "Mini Player" Buttons. YT播放栏简化，移除了“播放下一个”，“自动播放”，“迷你窗口”按钮。
// @author       Martin______X
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486936/Youtube%20-%20Video%20Player%20Bar%20Simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/486936/Youtube%20-%20Video%20Player%20Bar%20Simplified.meta.js
// ==/UserScript==

let __$videoId = "";
//Loop
const videoIdCheckVBInterval = setInterval(() => {
    let video_des = document.getElementsByClassName("watch-active-metadata style-scope ytd-watch-flexy style-scope ytd-watch-flexy")[0];
    let videoId = "";
    if (video_des) {
        videoId = video_des.getAttribute("video-id");
    }
    if (__$videoId != videoId) {
        let count = 0;
        let nextButton;
        let buttons = document.getElementsByClassName("ytp-next-button ytp-button");
        for (let i = 0; i < buttons.length; i++) {
            let temp = buttons[i];
            let e1 = temp.hasAttribute("data-title-no-tooltip");
            let e2 = temp.hasAttribute("aria-keyshortcuts");
            let e3 = temp.hasAttribute("data-duration");
            let e4 = temp.hasAttribute("data-preview");
            let e5 = temp.hasAttribute("title");
            if (e1 && e2 && e3 && e4 && e5) {
                nextButton = temp;
            }
        }
        if (nextButton) {
            nextButton.style.visibility = "hidden";
            count++;
        }
        let autoPlayButton = document.querySelector("[data-tooltip-target-id=ytp-autonav-toggle-button]");
        if (autoPlayButton) {
            autoPlayButton.style.visibility = "hidden";
            count++;
        }
        let miniButton = document.querySelector("[data-tooltip-target-id=ytp-miniplayer-button]");
        if (miniButton) {
            miniButton.style.visibility = "hidden";
            count++;
        }
        if (count >= 3) {
            console.warn("Unnecessary Buttons Has Hidden!");
            __$videoId = videoId;
        }
    }
}, 100);