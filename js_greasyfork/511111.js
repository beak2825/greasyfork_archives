// ==UserScript==
// @name         YouTube 自动1080p播放
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动将YouTube视频设置为1080p播放
// @author       你自己的名字
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511111/YouTube%20%E8%87%AA%E5%8A%A81080p%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/511111/YouTube%20%E8%87%AA%E5%8A%A81080p%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const desiredQuality = 'hd1080';

    function setQuality() {
        const player = document.querySelector('.html5-video-player');
        if (player) {
            const qualityLevels = player.getAvailableQualityLevels();
            if (qualityLevels.includes(desiredQuality)) {
                player.setPlaybackQualityRange(desiredQuality);
                player.setPlaybackQuality(desiredQuality);
            }
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(() => {
            setQuality();
        });
    });

    observer.observe(document, { childList: true, subtree: true });

})();