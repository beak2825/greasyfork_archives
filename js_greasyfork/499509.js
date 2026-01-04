// ==UserScript==
// @name         Remove Carousel on twitch.tv home page
// @namespace    KrümelKing
// @version      1.0
// @description  Removes the annoying carousel on the twitch.tv homepage
// @author       https://linktr.ee/kruemelking
// @match        https://www.twitch.tv/
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499509/Remove%20Carousel%20on%20twitchtv%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/499509/Remove%20Carousel%20on%20twitchtv%20home%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
//Check for homepage
    if (window.location.pathname !== '/') {
        return;
    }

    function aggressivelyRemoveCarouselAndAudio() {
        const carousel = document.querySelector('.front-page-carousel');
        if (carousel) {
            carousel.style.display = 'none';
//Disables all video and audio elements on startpage if found
            function disableMediaElements(element) {
                if (element.tagName === 'VIDEO' || element.tagName === 'AUDIO') {
                    element.muted = true;
                    element.volume = 0;
                    element.removeAttribute('src');
                    element.load();
                    element.pause();
                    element.style.display = 'none';
                }
                for (let child of element.children) {
                    disableMediaElements(child);
                }
            }

            disableMediaElements(carousel);
//Overwrite play method
            carousel.querySelectorAll('video, audio').forEach(mediaElement => {
                mediaElement.play = function() {
                    this.pause();
                    return new Promise(() => {});
                };
            });
        }
    }
//creates observer
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.addedNodes.length) {
                aggressivelyRemoveCarouselAndAudio();
            }
        }
    });
//Observer checks for changes
    const config = { childList: true, subtree: true };
//Immediate execution so no short noise
    function immediateAndRepeatedExecution() {
        aggressivelyRemoveCarouselAndAudio();
        observer.observe(document.body, config);
//Sometimes it reloads so do it multiple times
        for (let i = 1; i <= 5; i++) {
            setTimeout(aggressivelyRemoveCarouselAndAudio, i * 100);
        }
    }
//yeah do it a lot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', immediateAndRepeatedExecution);
    } else {
        immediateAndRepeatedExecution();
    }
//and on load
    window.addEventListener('load', aggressivelyRemoveCarouselAndAudio);
})();