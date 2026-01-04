// ==UserScript==
// @name         Bilibili Helper
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  A very biased and personal Bilibili helper
// @author       Aur3l14no
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/cheese/play/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/435580/Bilibili%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/435580/Bilibili%20Helper.meta.js
// ==/UserScript==

var web_fullscreen_btn_selector, playback_150_selector, playback_125_selector, playback_100_selector, danmu_selector;

if (/\/cheese\/play\//.exec(document.URL)) {
    web_fullscreen_btn_selector = 'div.squirtle-video-pagefullscreen';
    playback_150_selector = 'ul.squirtle-speed-select-list > li:nth-child(2)';
    playback_125_selector = 'ul.squirtle-speed-select-list > li:nth-child(3)';
    playback_100_selector = 'ul.squirtle-speed-select-list > li:nth-child(4)';
    danmu_selector = 'input.bui-switch-input';
} else if (/\/video\//.exec(document.URL)) {
    web_fullscreen_btn_selector = 'div.bpx-player-ctrl-btn.bpx-player-ctrl-web';
    playback_150_selector = 'ul.bpx-player-ctrl-playbackrate-menu > li:nth-child(2)';
    playback_125_selector = 'ul.bpx-player-ctrl-playbackrate-menu > li:nth-child(3)';
    playback_100_selector = 'ul.bpx-player-ctrl-playbackrate-menu > li:nth-child(4)';
    danmu_selector = 'input.bui-danmaku-switch-input';
};

document.addEventListener('keyup', function(event) {
    if (document.activeElement.value !== undefined || document.activeElement.type == 'textarea' || document.activeElement.type == 'input') return;
    switch (event.key.toUpperCase()) {
        case "T":
            $(web_fullscreen_btn_selector).click();
            break;
        case "C":
            $(playback_150_selector).click();
            break;
        case "X":
            $(playback_125_selector).click();
            break;
        case "Z":
            $(playback_100_selector).click();
            break;
        case "V":
            $(danmu_selector).click();
            break;
    };
});

const waitForEl = function(selector, callback) {
    const timer = setInterval(function () {
        if (jQuery(selector).length) {
            callback();
            clearInterval(timer);
            timer = null;
        }
    }, 100);
};

waitForEl(web_fullscreen_btn_selector, function(){ $(web_fullscreen_btn_selector).click(); });
