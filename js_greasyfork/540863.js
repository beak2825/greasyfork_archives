// ==UserScript==
// @name         YouTube Auto Reload When Video unavailable 
// @name:zh-TW   YouTube 影片無法播放自動重整
// @name:ja      YouTubeの動画が再生できません時に自動リロード
// @namespace    https://example.com/
// @version      2.6
// @description  Reloads YouTube when a video fails. Active tab only. May need to press F5 once on first visit.
// @description:zh-TW 卡住的 YouTube 影片自動重新整理（僅限活頁籤）。首次可能需手動按一次 F5。
// @description:ja YouTubeの動画が読み込めない時に自動リロードします（アクティブタブのみ）。初回はF5が必要な場合があります。
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540863/YouTube%20Auto%20Reload%20When%20Video%20unavailable.user.js
// @updateURL https://update.greasyfork.org/scripts/540863/YouTube%20Auto%20Reload%20When%20Video%20unavailable.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isReloading = false;
    let observer = null;

    // 檢查是否是「直播尚未開始」狀態
    function isLiveUpcomingFromPlayerResponse() {
        try {
            const ytData = window.ytInitialPlayerResponse;
            const status = ytData?.playabilityStatus?.status;
            return status === 'LIVE_STREAM_OFFLINE';
        } catch (e) {
            return false;
        }
    }

    const checkVideoStatus = () => {
        if (document.hidden) return true;

        if (isLiveUpcomingFromPlayerResponse()) {
            return true; // 直播尚未開始 → 不 reload
        }

        const video = document.querySelector('video');
        const errorBox = document.querySelector('.ytp-error, .ytp-error-content-wrap');

        if (
            (errorBox && errorBox.offsetParent !== null) ||
            !video ||
            (video.currentTime === 0 && video.paused)
        ) {
            return false;
        }

        return true;
    };

    const tryReload = () => {
        if (isReloading) return;
        isReloading = true;
        location.reload();
    };

    const startObserver = () => {
        if (observer) return;

        const target = document.body;
        if (!target) return;

        observer = new MutationObserver(() => {
            if (!checkVideoStatus()) tryReload();
        });

        observer.observe(target, {
            childList: true,
            subtree: true
        });

        if (!checkVideoStatus()) tryReload();
    };

    const stopObserver = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };

    window.addEventListener('load', () => {
        startObserver();
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !checkVideoStatus()) {
            tryReload();
        }
    });
})();
