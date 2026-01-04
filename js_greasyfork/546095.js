// ==UserScript==
// @name         KOOK净化
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  隐藏 KOOK 网页版各种烦人的广告。屏蔽个性化入场音效。
// @author       Souma
// @match        *://www.kookapp.cn/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/546095/KOOK%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546095/KOOK%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const css = `
#root > div.win-wapper > div.app-main-wrapper > div > div.content-wrapper-box.app-content-wrapper > div > div.room-layout > div > div.room-content-left > div.kook-message-header-alert > div,
#icon-app-download,
div.banner-box,
div.audio-center-promotion,
div.kbc-banner-wrapper,
div.voice-icon.screen,
div.vip-tag,
div.kook-avatar-frame-static,
div.user-name-info > img,
div.text-channel-unread-icon,
div.guild-unread-icon,
div.user-setting-entry-mask > div > div.bottom-content.menu-background > div.user-setting-menu-list > div:nth-child(1),
#root > div.win-wapper > div.app-main-wrapper > div:nth-child(3) > div > div.setting-page-nav > div > div > div:nth-child(1) > div:nth-child(3),
#root > div.win-wapper > div.app-main-wrapper > div:nth-child(3) > div > div.setting-page-nav > div > div > div:nth-child(1) > div:nth-child(6) {
  display: none !important;
}

.text-gradient {
  color: inherit !important;
}

.entry-list > .entry-line {
  display: none !important;
}

.entry-list > .entry-line:nth-child(1),
.entry-list > .entry-line:nth-child(2),
.entry-list > .entry-line:nth-child(4) {
  display: block !important;
}
.text-message-item:has(.poke-msg-icon) {
  display: none !important;
}
body > div > div.chuanyu-modal-container.kaihei-modal-animate {
 display: none !important;
}
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // 入场音效替换
    const regexs = [
        /img\.kookapp\.cn\/assets\/item\/resources\/.+\.mp3/,
        /resources\/.+_notifications?_.+\.mp3/
    ]
    const OriginalAudio = Audio;
    window.Audio = new Proxy(OriginalAudio, {
        construct(target, args) {
            const audio = new target(...args);
            const originalPlay = audio.play;
            audio.play = function (...playArgs) {
                if (regexs.some(regex => regex.test(audio.src))) {
                    audio.src = "https://static.kookapp.cn/app/assets/audio/user-join.mp3";
                }
                return originalPlay.apply(audio, playArgs);
            };
            return audio;
        },
    });
})();
