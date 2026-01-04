// ==UserScript==
// @name         B站自动打开字幕
// @namespace    http://tampermonkey.net/
// @version 0.0.1
// @license MIT
// @description  在播放B站视频时自动打开系统自带字幕
// @author       zhaolei
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489785/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/489785/B%E7%AB%99%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openSubtitle(){
        document.querySelector('.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon')
            .click();
    }

    const _historyWrap = function(type) {
        const orig = history[type];
        const e = new Event(type);
        return function() {
            const rv = orig.apply(this, arguments);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.replaceState = _historyWrap('replaceState');

    window.addEventListener('replaceState', function(e) {
        openSubtitle()
    });
})();







