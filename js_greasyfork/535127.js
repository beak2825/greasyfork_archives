// ==UserScript==
// @name         Disable Auto pause YT and YT MUSIC
// @namespace    https://github.com/yourname
// @icon                https://www.youtube.com/img/favicon_48.png
// @version      1.1
// @description  在 YouTube 和 YouTube Music 上自动点击“Video paused. Continue watching? Yes”按钮，防止视频/音乐因久未操作而暂停。
// @author       YourName
// @match        *://www.youtube.com/watch*
// @match        *://music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535127/Disable%20Auto%20pause%20YT%20and%20YT%20MUSIC.user.js
// @updateURL https://update.greasyfork.org/scripts/535127/Disable%20Auto%20pause%20YT%20and%20YT%20MUSIC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[AutoContinue] Script loaded');

    function clickYT() {
        const btn = document.querySelector('.ytp-keep-playing-button.ytp-button');
        if (btn) {
            console.log('[AutoContinue] Clicked YouTube continue');
            btn.click();
        }
    }

    function clickYTMusic() {
        document.querySelectorAll('ytmusic-you-there-renderer button').forEach(btn => {
            if (/yes/i.test(btn.innerText.trim())) {
                console.log('[AutoContinue] Clicked YT Music continue');
                btn.click();
            }
        });
    }

    function checkContinue() {
        clickYT();
        clickYTMusic();
    }

    const observer = new MutationObserver(checkContinue);
    observer.observe(document.body, {childList: true, subtree: true});

    setInterval(checkContinue, 3000);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' || document.visibilityState === 'visible') {
            console.log('[AutoContinue] Visibility changed → ' + document.visibilityState);
            checkContinue();
        }
    });
})();
