// ==UserScript==
// @name             Hide YouTube Shorts and Playables
// @name:ru          Скрывает YouTube Shorts и Игротеку
// @namespace        http://tampermonkey.net/
// @version          1.3
// @description      Скрывает YouTube Shorts и Игротеку с главной страницы и удаляет кнопку Shorts из бокового меню
// @description:en   Hides YouTube Shorts and Playables from the homepage and removes the Shorts button from the sidebar
// @author           Lesnoy_Shaman
// @match            https://www.youtube.com/*
// @grant            none
// @license          GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/537159/Hide%20YouTube%20Shorts%20and%20Playables.user.js
// @updateURL https://update.greasyfork.org/scripts/537159/Hide%20YouTube%20Shorts%20and%20Playables.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideUnwantedElements() {
        const shortsSections = document.querySelectorAll('ytd-rich-section-renderer');
        shortsSections.forEach(section => {
            const titleElement = section.querySelector('span#title');
            if (titleElement && titleElement.textContent.trim() === 'Shorts') {
                section.style.display = 'none';
            }
        });

        const playablesSections = document.querySelectorAll('ytd-rich-shelf-renderer');
        playablesSections.forEach(section => {
            const titleElement = section.querySelector('#title-text #title');
            if (titleElement && titleElement.textContent.trim() === 'YouTube Игротека') {
                section.style.display = 'none';
            }
        });

        const shortsButtons = document.querySelectorAll('ytd-guide-entry-renderer');
        shortsButtons.forEach(button => {
            const title = button.querySelector('yt-formatted-string.title');
            if (title && title.textContent.trim() === 'Shorts') {
                button.remove();
            }
        });
    }

    function runWhenReady() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            hideUnwantedElements();

            const observer = new MutationObserver(hideUnwantedElements);
            observer.observe(document.body, { childList: true, subtree: true });

            let attemptCount = 0;
            const maxAttempts = 60;

            const intervalCheck = setInterval(() => {
                if (attemptCount >= maxAttempts) {
                    clearInterval(intervalCheck);
                    return;
                }
                hideUnwantedElements();
                attemptCount++;
            }, 1000);
        } else {
            setTimeout(runWhenReady, 500);
        }
    }

    runWhenReady();
})();
