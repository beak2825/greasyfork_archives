// ==UserScript==
// @name         YouTube Highest Quality on Fullscreen
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Set YouTube video to highest available resolution when entering fullscreen (e.g. 4K, 1440p, 1080p, etc.)
// @author       Rehan Ahmad
// @match        https://www.youtube.com/*
// @icon         https://raw.githubusercontent.com/r280822a/YouTube-Highest-Quality-Fullscreen/refs/heads/main/icon/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544628/YouTube%20Highest%20Quality%20on%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/544628/YouTube%20Highest%20Quality%20on%20Fullscreen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showToast(message) {
        let toast = document.querySelector('tp-yt-paper-toast#fullscreen-quality-toast');
        if (toast) { // Delete if still visible to avoid unnecessary queueing
            toast.remove();
        }

        toast = document.createElement('tp-yt-paper-toast');
        toast.id = 'fullscreen-quality-toast'
        toast.innerText = message;
        document.body.appendChild(toast);

        toast.show();
    }

    function setHighestQuality() {
        if (!document.fullscreenElement) return;
        const player = document.getElementById('movie_player');
        if (!player) return;

        let qualityData = player.getAvailableQualityData?.();
        const currentQuality = player.getPlaybackQuality?.();

        // Full list of all qualities: ['2160p60','2160p','1440p60','1440p','1080p60','1080p','720p60','720p','480p','360p','240p','144p']
        //
        // Add any of the above to ignoredQualities if you don't want that quality to be selected
        // Example: const ignoredQualities = ['2160p60', '2160p'];
        // If you don't want 4k
        const ignoredQualities = [];
        qualityData = qualityData.filter(q => !ignoredQualities.includes(q.qualityLabel));
        if (!qualityData || qualityData.length === 0) {
            console.warn('No available quality levels found.');
            return;
        }

        const highest = qualityData[0]; // YouTube lists highest quality first
        const highestQuality = highest.quality;
        if (currentQuality != highestQuality && highest.isPlayable) {
            player.setPlaybackQualityRange?.(highestQuality);
            player.setPlaybackQuality?.(highestQuality);
            console.log('Quality set to highest available after entering fullscreen:', highestQuality);
            showToast('Quality set to ' + highest.qualityLabel);
        }
    }

    document.addEventListener('fullscreenchange', () => {
        setTimeout(setHighestQuality, 500);
    });

    // If already fullscreen on load
    window.addEventListener('load', () => {
        setTimeout(setHighestQuality, 2000);
    });
    // Detect URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(setHighestQuality, 2000);
        }
    }).observe(document, { subtree: true, childList: true });
})();