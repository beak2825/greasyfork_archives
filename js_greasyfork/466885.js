// ==UserScript==
// @name         TikTok Mouse Tekerleği Video Değiştirici
// @namespace    Cybercode
// @version      1.0.3
// @description  TikTok videolarını tam ekran moddayken mouse tekerleği ile ileri geri değiştirebilmenizi sağlar.
// @author       Ali Osman Dinke
// @match        https://www.tiktok.com/*
// @grant        free
// @downloadURL https://update.greasyfork.org/scripts/466885/TikTok%20Mouse%20Tekerle%C4%9Fi%20Video%20De%C4%9Fi%C5%9Ftirici.user.js
// @updateURL https://update.greasyfork.org/scripts/466885/TikTok%20Mouse%20Tekerle%C4%9Fi%20Video%20De%C4%9Fi%C5%9Ftirici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isScrolling = false;

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function handleMouseWheel(event) {
        if (isScrolling) return;
        isScrolling = true;
        const deltaY = event.deltaY;
        if (deltaY > 0) {
            const nextButton = document.querySelector('.bcp-icon-fullscreen');
            if (nextButton) {
                nextButton.click();
                setTimeout(() => {
                    const nextVideoButton = document.querySelector('.bcp-right-arrow');
                    if (nextVideoButton) nextVideoButton.click();
                }, 500);
            }
        } else if (deltaY < 0) {
            const prevButton = document.querySelector('.bcp-left-arrow');
            if (prevButton) prevButton.click();
        }
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // İsteğe bağlı, kaydırma hızını buradan ayarlayabilirsiniz
    }

    function main() {
        const videoContainer = document.querySelector('.bcp-video');
        if (videoContainer) {
            videoContainer.addEventListener('wheel', debounce(handleMouseWheel, 200));
        }
    }

    main();
})();
