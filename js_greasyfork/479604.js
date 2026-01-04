// ==UserScript==
// @name        TVer click play
// @namespace   TVer click play
// @match       https://tver.jp/*
// @grant       none
// @version     1.2
// @author      hamachi
// @description Tverの再生画面クリックで、再生開始・停止を行えるようにします
// @license     MIT license
// @icon        https://tver.jp/favicon.ico
// @compatible  firefox
// @compatible  chrome
// @downloadURL https://update.greasyfork.org/scripts/479604/TVer%20click%20play.user.js
// @updateURL https://update.greasyfork.org/scripts/479604/TVer%20click%20play.meta.js
// ==/UserScript==

const regex = /https:\/\/tver\.jp\/episodes\/.+/;
let saveURL;
let isValid = false;

const controllerElement = "[class*='controller_container__']";
const progressElement = "[class*='progress_container__']";

const observer = new MutationObserver(() => {
    if (saveURL && saveURL != location.href) {
        isValid = false;
    }

    if (regex.test(location.href)) {
        const target = document.querySelector(controllerElement);

        if (target && !isValid) {
            saveURL = location.href;
            const video = document.querySelector("video");

            document.querySelector(progressElement).style.margin = "5px 8px 0px";
            const cover = document.querySelector(controllerElement);
            cover.insertAdjacentHTML(
                "afterbegin",
                '<div id="player-cover" style="z-index: -1; height: 100%; width: 100%;"></div>'
            );
            const playerCover = document.querySelector("#player-cover");

            playerCover.addEventListener("click", () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
            isValid = true;
        }
    }
});
const config = { childList: true, subtree: true };
observer.observe(document.getElementById("__next"), config);