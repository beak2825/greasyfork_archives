// ==UserScript==
// @name         Navigate Chapters
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  Navigate to the next or previous chapter of SSS-Class Suicide Hunter with right or left arrow keys
// @author       You
// @match        https://sssclasshunter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sssclasshunter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491672/Navigate%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/491672/Navigate%20Chapters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.type = 'text/css';

    let styles = `
        img.aligncenter {
            margin-top: 0px !important;
            margin-bottom: 0px !important;
            display: block !important; /* Make sure display is block to center the image */
        }
    `;
    styles += `
        .nav-links {
            display: none !important; /* This will always hide elements with the nav-links class */
        }
        .back-to-top {
            display: none !important;
        }
    `;

    // Automatically generate styles for code-block-1 to code-block-20
    for (let i = 1; i <= 20; i++) {
        styles += `
            div.code-block.code-block-${i} {
                margin: 0px !important;
            }
        `;
    }

    style.innerHTML = styles;
    document.head.appendChild(style);

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 39) { // right arrow
            const nextChapterElement = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim() === "NEXT CHAPTER");
            if (nextChapterElement && nextChapterElement.href) {
                window.location.href = nextChapterElement.href;
            }
        }

        if (e.keyCode === 37) { // left arrow
            const previousChapterElement = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim() === "PREVIOUS CHAPTER");
            if (previousChapterElement && previousChapterElement.href) {
                window.location.href = previousChapterElement.href;
            }
        }
    });

    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;

    function checkSwipeDirection() {
        const deltaX = touchendX - touchstartX;
        const deltaY = touchendY - touchstartY;
        const angleDeg = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

        if (Math.abs(angleDeg) < 20 || Math.abs(angleDeg) > 160) { // Within 20 degrees of horizontal
            if (deltaX < -75) { // Swiped left, next chapter
                const nextChapterElement = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim() === "NEXT CHAPTER");
                if (nextChapterElement && nextChapterElement.href) {
                    window.location.href = nextChapterElement.href;
                }
            }
            if (deltaX > 75) { // Swiped right, previous chapter
                const previousChapterElement = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim() === "PREVIOUS CHAPTER");
                if (previousChapterElement && previousChapterElement.href) {
                    window.location.href = previousChapterElement.href;
                }
            }
        }
    }

    document.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        checkSwipeDirection();
    });


})();

