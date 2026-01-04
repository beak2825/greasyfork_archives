// ==UserScript==
// @name         Doobie's Custom Background For Torn City
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Allows the User to replace Torn's background with custom images | NOW WITH parallax scrolling!
// @author       Doobiesuckin
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546624/Doobie%27s%20Custom%20Background%20For%20Torn%20City.user.js
// @updateURL https://update.greasyfork.org/scripts/546624/Doobie%27s%20Custom%20Background%20For%20Torn%20City.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const BACKGROUND_IMAGES = [
//█████████████████████████████████████████████████████████

//█▀▀ █░█ █▀ ▀█▀ █▀█ █▀▄▀█ █ ▀█ █▀▀   █░█ █▀▀ █▀█ █▀▀ ▀
//█▄▄ █▄█ ▄█ ░█░ █▄█ █░▀░█ █ █▄ ██▄   █▀█ ██▄ █▀▄ ██▄ ▄
// Configure your background images here (direct image URLs work best)
        'https://example.com/your-image.jpg',
        'https://example.com/your-image2.jpg'
    // DON'T FORGET ABOUT THE '',
    ];
    // Do you see the bottom of your Background image and start seeing torns background when scrolling down on longer pages? Maybe it feels like your scrolling to fast? Adjust the Parallax_speed to a Lower/Higher number to fix!
    const PARALLAX_SPEED = 0.3; // Adjust scroll speed (0.1 = slow, 1 = fast)

//█████████████████████████████████████████████████████████
    let currentBackgroundIndex = GM_getValue('currentBgIndex', 0);
    let menuCommandId = null;
    let scrollHandler = null;

    function registerMenuCommand() {
        if (menuCommandId) GM_unregisterMenuCommand(menuCommandId);
        menuCommandId = GM_registerMenuCommand(
            `Background: ${currentBackgroundIndex + 1}/${BACKGROUND_IMAGES.length}`,
            switchBackground
        );
    }

    function switchBackground() {
        currentBackgroundIndex = (currentBackgroundIndex + 1) % BACKGROUND_IMAGES.length;
        GM_setValue('currentBgIndex', currentBackgroundIndex);
        applyBackground();
        registerMenuCommand();
    }

    function applyBackground() {
        const existingBackground = document.getElementById('torn-custom-bg');
        if (existingBackground) existingBackground.remove();
        if (scrollHandler) window.removeEventListener('scroll', scrollHandler);

        if (!document.getElementById('torn-bg-hide-style')) {
            const hideStyle = document.createElement('style');
            hideStyle.id = 'torn-bg-hide-style';
            hideStyle.textContent = '.custom-bg-desktop,.custom-bg-mobile,.backdrops-container{display:none!important}';
            document.head.appendChild(hideStyle);
        }

        const backgroundElement = document.createElement('div');
        backgroundElement.id = 'torn-custom-bg';
        backgroundElement.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 120vh !important;
            background-image: url(${BACKGROUND_IMAGES[currentBackgroundIndex]}) !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            z-index: -9999 !important;
            pointer-events: none !important;
            will-change: transform !important;
        `;

        if (document.body) {
            document.body.insertBefore(backgroundElement, document.body.firstChild);
            setupParallaxScrolling(backgroundElement);
        }
    }

    function setupParallaxScrolling(element) {
        scrollHandler = () => {
            element.style.transform = `translateY(${-window.pageYOffset * PARALLAX_SPEED}px)`;
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler();
    }

    function initialize() {
        if (document.body) {
            applyBackground();
            registerMenuCommand();
        } else {
            setTimeout(initialize, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    new MutationObserver(() => {
        if (!document.getElementById('torn-custom-bg')) {
            applyBackground();
        }
    }).observe(document.body, { childList: true, subtree: false });
})();

//█▀▄▀█ ▄▀█ █▀▄ █▀▀   █░█░█ █ ▀█▀ █░█   █░░ █▀█ █░█ █▀▀   █▄▄ █▄█   █▀▄ █▀█ █▀█ █▄▄ █ █▀▀ █▀ █░█ █▀▀ █▄▀ █ █▄░█
//█░▀░█ █▀█ █▄▀ ██▄   ▀▄▀▄▀ █ ░█░ █▀█   █▄▄ █▄█ ▀▄▀ ██▄   █▄█ ░█░   █▄▀ █▄█ █▄█ █▄█ █ ██▄ ▄█ █▄█ █▄▄ █░█ █ █░▀█