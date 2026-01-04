// ==UserScript==
// @name         Spotify Silent Ads
// @name:zh-CN   Spotify 静音广告
// @namespace    https://greasyfork.org/users/166541
// @version      0.0.3
// @description  Mute audio when Spotify ads are detected
// @description:zh-cn 当检测到 Spotify 广告时，对音频静音
// @author       xmdhs
// @match        https://open.spotify.com/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=open.spotify.com
// @downloadURL https://update.greasyfork.org/scripts/523822/Spotify%20%E9%9D%99%E9%9F%B3%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/523822/Spotify%20%E9%9D%99%E9%9F%B3%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
 
let muted = false;

const observer = new MutationObserver(() => {
    if (document.title.includes("Spotify – 广告") || muted) {
        document.querySelector('[data-testid="volume-bar-toggle-mute-button"]').click();
        muted = !muted
        if (muted) {
            console.log(document.title, "静音")
        }
    }
});

observer.observe(document.querySelector('title'), { childList: true });
