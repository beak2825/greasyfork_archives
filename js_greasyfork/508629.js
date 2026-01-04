// ==UserScript==
// @name         Twitch Turbo + Updated
// @namespace    https://github.com/Brembo19
// @version      1.6.0
// @description  Block all Twitch ads, auto-claim bonus points, auto-join raids, add clip download link, and promote Discord server
// @author       Brembo19
// @match        *://*.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508629/Twitch%20Turbo%20%2B%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/508629/Twitch%20Turbo%20%2B%20Updated.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const blockAdsInVideo = () => {
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(video => {
            if (video.src.includes('ad_')) {
                video.src = '';
                console.info('Ad blocked in video stream');
            }
        });
    };

    const removeAdBanners = () => {
        const adSelectors = [
            '[aria-label="Advertisement"]',
            '.ad-banner',
            '.ad-slot',
            '.tw-ad-container',
            '[data-a-target="video-ad-banner"]',
            '[data-ad="true"]',
            'div[class*="ad-"]',
            'div[class*="sponsored"]',
            'iframe[src*="doubleclick"]'
        ];

        adSelectors.forEach(selector =>
            document.querySelectorAll(selector).forEach(ad => ad.remove())
        );
    };

    const observeDynamicContent = () => {
        const observer = new MutationObserver(() => removeAdBanners());
        observer.observe(document.body, { childList: true, subtree: true });
    };

    const autoClaimBonus = () => {
        const bonusObserver = new MutationObserver(() => {
            const bonus = document.querySelector('.community-points-summary .claimable-bonus__icon');
            if (bonus) {
                bonus.click();
                console.info('Bonus claimed');
            }
        });
        bonusObserver.observe(document.body, { childList: true, subtree: true });
    };

    const autoJoinRaid = () => {
        const raidObserver = new MutationObserver(() => {
            const raidButton = document.querySelector('button[data-test-selector="raid-banner__join-button"]');
            if (raidButton) {
                raidButton.click();
                console.info('Automatically joined the raid');
            }
        });
        raidObserver.observe(document.body, { childList: true, subtree: true });
    };

    const addClipDownloadLink = async () => {
        let attempts = 0;
        const tryAddingLink = async () => {
            const video = document.querySelector('.video-player__container video');
            if (video && video.src) {
                const downloadDiv = document.createElement('div');
                downloadDiv.innerHTML = `<a href="${video.src}" download>Download Clip</a>`;
                const fullButton = document.querySelector('[data-test-selector="clips-watch-full-button"]');
                if (fullButton && !document.querySelector('.clip-download-link')) {
                    downloadDiv.classList.add('clip-download-link');
                    fullButton.insertAdjacentElement("afterend", downloadDiv);
                    console.info('Clip download link added');
                }
            } else if (attempts < 5) {
                attempts++;
                await delay(1000);
                tryAddingLink();
            }
        };
        await tryAddingLink();
    };

    window.addEventListener('load', () => {
        blockAdsInVideo();
        removeAdBanners();
        observeDynamicContent();
        autoClaimBonus();
        autoJoinRaid();
        addClipDownloadLink();
    });

    setInterval(blockAdsInVideo, 1000);
    setInterval(removeAdBanners, 2000);

    console.info('Join our Discord: https://discord.gg/Cwm8fwknKC');

})();
