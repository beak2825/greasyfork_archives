// ==UserScript==
// @name        YouTube Live minimum latency
// @description YouTube Live の遅延を自動的に最小化します
// @namespace   https://gitlab.com/sigsign
// @version     0.2.3
// @author      Sigsign
// @license     MIT or Apache-2.0
// @match       https://www.youtube.com/*
// @run-at      document-start
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/427483/YouTube%20Live%20minimum%20latency.user.js
// @updateURL https://update.greasyfork.org/scripts/427483/YouTube%20Live%20minimum%20latency.meta.js
// ==/UserScript==
(function () {
'use strict';

function loadPage(fn) {
    /**
    * YouTube は SPA になっているため load だけではページ遷移を捕捉できない。
    * load と yt-page-data-updated を併用するか yt-navigate-finish を使う。
    *
    * See: https://stackoverflow.com/questions/24297929/
    */
    document.addEventListener('yt-navigate-finish', fn, false);
}
function getPlayer() {
    return document.querySelector('#movie_player');
}
function getLiveLatency(player) {
    const current = Date.now() / 1000;
    const time = player.getMediaReferenceTime();
    return time ? current - time : 0;
}
function getBufferHealth(player) {
    const stats = player.getVideoStats();
    if (!stats) {
        return 0;
    }
    const bufferRange = stats.vbu;
    if (!bufferRange) {
        return 0;
    }
    const buffer = bufferRange.split('-');
    if (buffer.length < 2) {
        return 0;
    }
    const bufferTime = Number(buffer.slice(-1)[0]);
    const currentTime = Number(stats.vct);
    if (isNaN(bufferTime) || isNaN(currentTime)) {
        return 0;
    }
    return bufferTime - currentTime;
}

const thresholds = {
    NORMAL: {
        latency: 10.0,
        buffer: 2.0,
    },
    LOW: {
        latency: 5.0,
        buffer: 1.5,
    },
    ULTRALOW: {
        latency: 2.0,
        buffer: 1.0,
    },
};
function getThresold(key) {
    if (typeof key !== 'string') {
        return null;
    }
    return key in thresholds ? thresholds[key] : null;
}
loadPage(() => {
    const player = getPlayer();
    if (!player) {
        return;
    }
    const stats = player.getVideoStats() || {};
    if (stats.live !== 'live' && stats.live !== 'dvr' && stats.live !== 'lp') {
        return;
    }
    const availableRates = player.getAvailablePlaybackRates() || [];
    if (!availableRates.includes(1.25)) {
        return;
    }
    const video = document.querySelector('video');
    if (!video) {
        return;
    }
    const startAcceleration = () => {
        const rate = player.getPlaybackRate();
        if (rate !== 1.0) {
            return;
        }
        const stats = player.getVideoStats() || {};
        const latency = getLiveLatency(player);
        if (stats.live !== 'live' && latency > 120) {
            /**
             * DVR or プレミア公開、かつ遅延が 2 分以上ある場合、
             * ユーザーが自分の意思でシークしていると想定して対象から外す。
             */
            return;
        }
        const threshold = getThresold(stats.latency_class);
        if (!threshold) {
            return;
        }
        if (stats.live === 'lp') {
            // プレミア公開は 11 秒程度の Live Latency が必ず発生するため 15 秒を閾値とする。
            threshold.latency = 15;
        }
        const buffer = getBufferHealth(player);
        if (buffer > threshold.buffer && latency > threshold.latency) {
            player.setPlaybackRate(1.25);
            setTimeout(stopAcceleration, 50);
        }
    };
    const stopAcceleration = () => {
        const rate = player.getPlaybackRate();
        if (rate !== 1.25) {
            return;
        }
        const stats = player.getVideoStats() || {};
        const buffer = getBufferHealth(player);
        const threshold = getThresold(stats.latency_class);
        if (!threshold || buffer < threshold.buffer) {
            player.setPlaybackRate(1.0);
        }
        else {
            setTimeout(stopAcceleration, 50);
        }
    };
    video.addEventListener('playing', startAcceleration);
    const timer = setInterval(startAcceleration, 60 * 1000);
    const eventCleaner = () => {
        video.removeEventListener('playing', startAcceleration);
        clearInterval(timer);
    };
    document.addEventListener('yt-navigate-start', eventCleaner, { once: true });
});

})();
