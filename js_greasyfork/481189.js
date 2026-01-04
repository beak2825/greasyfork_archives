// ==UserScript==
// @name              YouTube Playback Speed Up
// @name:zh-TW        YouTube 播放加速
// @name:zh-HK        YouTube 播放加速
// @name:zh-CN        YouTube 播放加速
// @namespace         https://github.com/NightFeather0615
// @version           2.6.2
// @description       Speeding up shit talking without leaving out any information
// @description:zh-TW 不錯過資訊的同時跳過廢話
// @description:zh-HK 不錯過資訊的同時跳過廢話
// @description:zh-CN 不错过资讯的同时跳过废话
// @author            NightFeather
// @match             *://www.youtube.com/*
// @icon              https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant             none
// @license           MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/481189/YouTube%20Playback%20Speed%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/481189/YouTube%20Playback%20Speed%20Up.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* jshint -W083 */
/* jshint multistr: true */

/* eslint no-multi-str: 0 */

const waitElement = async (selector) => {
    'use strict';

    while (document.querySelector(selector) === null) {
        await new Promise((resolve, reject) => requestAnimationFrame(resolve));
    }

    return document.querySelector(selector);
};

const asyncSleep = async (ms) => {
    'use strict';

    return new Promise(resolve => setTimeout(resolve, ms));
};

const insertStyleSheet = () => {
    let styleSheet = document.createElement("style");
    styleSheet.textContent = ' \
.player-playback-speed-hint { \
    -webkit-box-pack: center; \
    -ms-flex-pack: center; \
    background-color: rgba(28, 28, 28, 0.9); \
    border-radius: 6px; \
    color: #f1f1f1; \
    display: -webkit-box; \
    display: -ms-flexbox; \
    display: flex; \
    height: 36px; \
    justify-content: center; \
    left: 50%; \
    line-height: 36px; \
    margin-left: -65px; \
    position: absolute; \
    top: 18px; \
    width: 170px; \
    z-index: 77; \
    font-size: 13px; \
    font-family: "Roboto", "Arial", sans-serif; \
} \
 \
.player-playback-speed-hint-icon { \
    display: inline-block; \
    margin-right: 8px; \
    width: 22px \
} \
    '; // Style sheet from bilibili
    document.head.appendChild(styleSheet);
}

const insertPlaybackSpeedHint = async () => {
    let moviePlayer = await waitElement("#movie_player");

    let hint = document.createElement("div");
    hint.className = "player-playback-speed-hint";
    hint.style.display = "none";
    hint.innerHTML = ' \
<span class="player-playback-speed-hint-icon"> \
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-track-next-filled" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" stroke-width="2" stroke="white" fill="white" height="36" width="22"> \
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> \
        <path d="M2 5v14c0 .86 1.012 1.318 1.659 .753l8 -7a1 1 0 0 0 0 -1.506l-8 -7c-.647 -.565 -1.659 -.106 -1.659 .753z" stroke-width="0" fill="currentColor"></path> \
        <path d="M13 5v14c0 .86 1.012 1.318 1.659 .753l8 -7a1 1 0 0 0 0 -1.506l-8 -7c-.647 -.565 -1.659 -.106 -1.659 .753z" stroke-width="0" fill="currentColor"></path> \
    </svg> \
</span> \
<span class="player-playback-speed-hint-text"> \
</span> \
    '; // Icon from Tabler Icons

    moviePlayer.appendChild(hint);
}



(async function() {
    'use strict';

    let isPlayerSetup = false;

    const speedUpKey = 192;
    const increaseSpeedKey = 33;
    const decreaseSpeedKey = 34;
    const resetSpeedKey = 46;
    const fixSpeedKey = 9;

    let isSpeedUp = false;
    let isSpeedFixed = false;
    let speedUpRate = 3;

    const trySetupPlayer = async () => {
        let isUrlVaild = window.location.pathname.startsWith("/watch") || window.location.pathname.startsWith("/live");

        if (!isUrlVaild || isPlayerSetup) return;

        isPlayerSetup = true;

        let videoPlayer = await waitElement("video");
        console.log(`[YT Playback Speed Up] Video player initialized`);

        let speedBeforeModify = videoPlayer.playbackRate;
        console.log(`[YT Playback Speed Up] Default playback speed is ${speedBeforeModify}`);

        insertStyleSheet();
        await insertPlaybackSpeedHint();
        let playbackSpeedHint = await waitElement(".player-playback-speed-hint");
        let playbackSpeedHintText = await waitElement(".player-playback-speed-hint-text");
        console.log(`[YT Playback Speed Up] Player hint initialized`);

        const updateStatus = () => {
            if (isSpeedUp) {
                videoPlayer.playbackRate = speedUpRate;
                playbackSpeedHint.style.display = "";
                playbackSpeedHintText.textContent = `Playback Speed x${speedUpRate.toFixed(1)}`;
                console.log(`[YT Playback Speed Up] Speeding up playback`);
            } else {
                videoPlayer.playbackRate = speedBeforeModify;
                playbackSpeedHint.style.display = "none";
                console.log(`[YT Playback Speed Up] Set speed up rate to ${speedBeforeModify}`);
            }
        };

        document.addEventListener("keydown", async (event) => {
            switch(event.keyCode) {
                case speedUpKey: {
                    event.preventDefault();

                    if (event.repeat || isSpeedFixed) return;

                    isSpeedUp = true;

                    if (isSpeedUp) {
                        speedBeforeModify = videoPlayer.playbackRate;
                        updateStatus();
                    }

                    break;
                }
                case increaseSpeedKey: {
                    event.preventDefault();

                    speedUpRate += 0.5;
                    console.log(`[YT Playback Speed Up] Set speed up rate to ${speedUpRate}`);

                    updateStatus();

                    break;
                }
                case decreaseSpeedKey: {
                    event.preventDefault();

                    if (speedUpRate <= 0) return;

                    speedUpRate -= 0.5;
                    console.log(`[YT Playback Speed Up] Set speed up rate to ${speedUpRate}`);

                    updateStatus();

                    break;
                }
                case resetSpeedKey: {
                    event.preventDefault();

                    speedUpRate = 3;
                    console.log(`[YT Playback Speed Up] Set speed up rate to ${speedUpRate}`);

                    updateStatus();

                    break;
                }
                case fixSpeedKey: {
                    event.preventDefault();

                    if (!isSpeedUp && !isSpeedFixed) return;

                    if (isSpeedUp && !isSpeedFixed) {
                        isSpeedFixed = true;
                    } else {
                        isSpeedUp = false;
                        isSpeedFixed = false;
                    }

                    updateStatus();

                    break;
                }
                default: return;
            }
        });

        document.addEventListener("keyup", (event) => {
            if (event.keyCode === speedUpKey && !isSpeedFixed) {
                event.preventDefault();

                isSpeedUp = false;
                updateStatus();
            }
        });
    };

    await trySetupPlayer();
    document.addEventListener("selectionchange", trySetupPlayer);
})();
