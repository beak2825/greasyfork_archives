// ==UserScript==
// @name         Remove YouTube Shorts + Best Video Quality
// @version      0.1
// @description  Removes YouTube Shorts Videos from your current page and sets video to the highest quality, including 4K and beyond.
// @author       Science
// @match        http://*.youtube.com/*
// @namespace    https://greasyfork.org/it/users/79810-sciencefun
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GPL version 3 or any later version http://www.gnu.org/copyleft/gpl.html

// @downloadURL https://update.greasyfork.org/scripts/509097/Remove%20YouTube%20Shorts%20%2B%20Best%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/509097/Remove%20YouTube%20Shorts%20%2B%20Best%20Video%20Quality.meta.js
// ==/UserScript==

(() => {
    // Function to remove YouTube Shorts
    const removeShorts = () => {
        Array.from(document.querySelectorAll(`a[href^="/shorts"]`)).forEach(a => {
            let parent = a.closest('ytd-rich-item-renderer'); // Find the closest container
            if (parent) {
                parent.remove();
            }
        });
    };

    // Function to set the video quality to the highest available (4K or above)
    const setHighQuality = () => {
        const checkPlayer = setInterval(() => {
            const player = document.querySelector('video'); // Get the video element
            if (player) {
                clearInterval(checkPlayer); // Stop checking once player is found

                // Ensure YouTube player API is ready
                const ytPlayer = window.ytplayer?.player?.getPlayer();
                if (ytPlayer && ytPlayer.getAvailableQualityLevels) {
                    const availableQualities = ytPlayer.getAvailableQualityLevels(); // Get available quality levels
                    if (availableQualities && availableQualities.length > 0) {
                        // Ensure it selects the highest resolution (4K or more)
                        const maxQuality = availableQualities.find(q => q === 'highres') || availableQualities[0];
                        ytPlayer.setPlaybackQualityRange(maxQuality); // Set to the highest resolution
                    }
                }
            }
        }, 500); // Check every 500ms for the player
    };

    // Set up MutationObserver to monitor for changes and apply modifications
    const observer = new MutationObserver(() => {
        removeShorts();
        setHighQuality();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });

    // Initial run
    removeShorts();
    setHighQuality();

    // Re-apply high quality on video play (in case it changes dynamically)
    document.addEventListener('yt-navigate-finish', setHighQuality);
})();
