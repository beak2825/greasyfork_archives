// ==UserScript==
// @name        YouTube Video Playback Shortcut
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @license     MIT
// @version     0.1.1
// @description 2/22/2024, 11:29:11 PM
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1.4.1
// @downloadURL https://update.greasyfork.org/scripts/488025/YouTube%20Video%20Playback%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/488025/YouTube%20Video%20Playback%20Shortcut.meta.js
// ==/UserScript==

const { KeyboardService } = VM.shortcut;

const service = new KeyboardService();

function getVideo() {
    return document.querySelector('.video-stream.html5-main-video');
}

service.setContext('activeOnInput', false);

async function updateActiveOnInput() {
    const elm = document.activeElement;
    service.setContext('activeOnInput', elm instanceof HTMLInputElement || elm instanceof HTMLTextAreaElement);
}

document.addEventListener('focus', (e) => {
    updateActiveOnInput();
}, true);

document.addEventListener('blur', (e) => {
    updateActiveOnInput();
}, true);

function regkey(i) {
    let position = 0;
    service.register('s-a-digit' + i, () => {
        let v = getVideo();
        if (!v) return;
        let c = (v.currentTime - 0.005).toFixed(2);
        if (position === c) position = 0;
        else position = c;
    }, {
        condition: '!activeOnInput',
    });
    service.register('a-digit' + i, () => {
        let v = getVideo();
        if (!v) return;
        if (!position) return;
        v.currentTime = +position;
    }, {
        condition: '!activeOnInput',
    });
}

for (let i = 1; i < 9; i++) {
    regkey(i);
}

service.enable();