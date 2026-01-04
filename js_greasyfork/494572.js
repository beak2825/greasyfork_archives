// ==UserScript==
// @name         Youtube Mobile自动画质与倍速
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.0.2
// @description  记录并自动使用上一次的播放速度与画质
// @author       Eric
// @match        https://m.youtube.com/watch*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/494572/Youtube%20Mobile%E8%87%AA%E5%8A%A8%E7%94%BB%E8%B4%A8%E4%B8%8E%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/494572/Youtube%20Mobile%E8%87%AA%E5%8A%A8%E7%94%BB%E8%B4%A8%E4%B8%8E%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getPlayer = () => {
        const l = document.getElementsByClassName("html5-video-player");
        if (l.length === 0) return null;
        return l[0];
    }

    const wait = duration => new Promise((res) => {
        setTimeout(res, duration);
    });

    let player;
    let retry = 0;
    const keepGetPlayer = async () => {
        player = getPlayer();
        console.log(player);
        if (!player && retry++ < 5) {
            await wait(1000);
            await keepGetPlayer();
        }
    }

    (async () => {
        await keepGetPlayer();
    })();

    if (!player) {
        console.warn("no player found");
        return;
    }

    const container = document.querySelector('#player-control-container');
    if (!container) return;

    container.addEventListener('click', () => {
        const settingsIcon = document.querySelector('.player-settings-icon');
    if (!settingsIcon) return;

        const onSettingsIconClick = async () => {
            settingsIcon.removeEventListener('click', onSettingsIconClick);

            await wait(200);

            const speedSelect = document.querySelector('.player-speed-settings > select');
            speedSelect.addEventListener('change', e => {
                localStorage.setItem('yarq:speed', speedSelect.value);
            })

            const qualitySelect = document.querySelector('.player-quality-settings > select');
            qualitySelect.addEventListener('change', e => {
                localStorage.setItem('yarq:quality', qualitySelect.value);
            })
        }
        settingsIcon.addEventListener('click', onSettingsIconClick);


    })

    const speed = localStorage.getItem('yarq:speed');
    speed && player.setPlaybackRate(+speed);

    const quality = localStorage.getItem('yarq:quality');
    quality && player.setPlaybackQualityRange(quality);
})();