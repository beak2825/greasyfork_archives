// ==UserScript==
// @name         HiAnime QoL
// @namespace    https://greasyfork.org/en/users/1262395-grinnch
// @version      1.6
// @description  UI changes, removes unnecessary stuff, toggle to hide cursor movements in player.
// @author       grinnch
// @license      MIT
// @match        https://hianime.tv/*
// @match        https://hianime.to/*
// @match        https://hianimez.to/*
// @match        https://hianimez.is/*
// @match        https://hianime.nz/*
// @match        https://hianime.bz/*
// @match        https://hianime.pe/*
// @match        https://hianime.cx/*
// @match        https://hianime.do/*
// @icon         https://cdn-b.saashub.com/images/app/service_logos/274/o0hsec74es20/large.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/505510/HiAnime%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/505510/HiAnime%20QoL.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    let expandElementClicked = false;
    let expandDescElementClicked = false;

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    function modifyStyle() {
        // Auto expands player
        if (!expandElementClicked) {
            var expandElement = document.querySelector('#media-resize');
            if (expandElement) {
                expandElement.click();
                expandElementClicked = true;
            }
        }

        // Auto expands description
        if (!expandDescElementClicked) {
            var expandDescElement = document.querySelector('#ani_detail > div > div > div.anis-watch-wrap.extend > div.anis-watch-detail > div > div.anisc-detail > div.film-description.m-hide > div > span');
            if (expandDescElement) {
                expandDescElement.click();
                expandDescElementClicked = true;
            }
        }

        // Prevents header from moving when scrolling
        let headerElement = document.querySelector('#header');
        if (headerElement) {
            headerElement.style.position = 'relative';
        }

        // Removes padding from header
        let wrapperElement = document.querySelector('#wrapper');
        if (wrapperElement) {
            wrapperElement.style.paddingTop = '0';
        }

        // Removes padding from left-side of player to make it centered
        let playerLeftPaddingElement = document.querySelector('#ani_detail > div > div > div.anis-watch-wrap.extend > div.anis-watch.anis-watch-tv');
        if (playerLeftPaddingElement) {
            playerLeftPaddingElement.style.paddingLeft = '0';
        }

        // Removes padding from right-side of player to make it centered when toggling "Light"
        let playerRightPaddingElement = document.querySelector('#ani_detail > div > div > div.anis-watch-wrap.extend.active > div.anis-watch.anis-watch-tv');
        if (playerRightPaddingElement) {
            playerRightPaddingElement.style.paddingRight = '0';
        }

        // Reduces padding on bottom of player to reduce player size
        let frameElement = document.querySelector('#ani_detail > div > div > div.anis-watch-wrap.extend > div.anis-watch.anis-watch-tv > div.watch-player > div.player-frame');
        if (frameElement) {
            frameElement.style.paddingBottom = '53.75%'; // 51.9%
        }

        // Places episode panel underneath player
        let episodesElement = document.querySelector('#episodes-content');
        if (episodesElement) {
            episodesElement.style.position = 'relative';
            episodesElement.style.paddingTop = '18%';
            episodesElement.style.width = 'unset';
            //episodesElement.style.marginTop = '1px'; // optional seperator between episode panel and player
        }

        // Reduces padding under episode panel
        let wrapperPaddingElement = document.querySelector('#ani_detail > div > div > div.anis-watch-wrap.extend');
        if (wrapperPaddingElement) {
            wrapperPaddingElement.style.paddingBottom = '0';
        }

        // Moves description under episode panel
        let contentElement = document.querySelector('#ani_detail > div > div > div.anis-watch-wrap.extend > div.anis-watch-detail');
        if (contentElement) {
            contentElement.style.display = 'unset';
            contentElement.style.position = 'static';
        }

        // Reduces size of background image
        let backgroundImgElement = document.querySelector('#ani_detail > div > div > div.anis-cover-wrap > div');
        if (backgroundImgElement) {
            backgroundImgElement.style.height = '62.25%';
        }

        // Removes share bar
        let shareBarElement = document.querySelector('.share-buttons.share-buttons-detail');
        if (shareBarElement) {
            shareBarElement.remove();
        }

        // Removes description ad
        let descAdElement = document.querySelector('.film-text.m-hide.mb-3');
        if (descAdElement) {
            descAdElement.remove();
        }

        // Removes comments shortcut
        let commentButtonElement = document.querySelector('.dt-comment');
        if (commentButtonElement) {
            commentButtonElement.remove();
        }
    }

    modifyStyle();

    // Mutation observer for dynamic updates
    let observer = new MutationObserver(debounce(modifyStyle, 100));
    let target = document.querySelector('#ani_detail');
    if (target) {
        observer.observe(target, { attributes: true, childList: true, subtree: true });
    }

    // Creates toggleable overlay to hide player controls during mouse movement
    let overlayEnabled = GM_getValue('overlayEnabled', false);
    let overlay, iframe;
    let enableMenuCommandId, disableMenuCommandId;
    let isControlsVisible = false;

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 1000;
            cursor: none;
            display: ${overlayEnabled ? 'block' : 'none'};
        `;
        iframe.parentNode.insertBefore(overlay, iframe.nextSibling);
    }

    function enableOverlay() {
        overlayEnabled = true;
        GM_setValue('overlayEnabled', true);
        if (overlay) {
            overlay.style.display = 'block';
        }
        updateControlsVisibility();
        updateMenuCommands();
    }

    function disableOverlay() {
        overlayEnabled = false;
        GM_setValue('overlayEnabled', false);
        if (overlay) {
            overlay.style.display = 'none';
        }
        updateControlsVisibility();
        updateMenuCommands();
    }

    function updateControlsVisibility() {
        if (overlayEnabled) {
            hideControls();
        } else {
            showControls();
        }
    }

    function showControls() {
        iframe.style.cursor = 'default';
        overlay.style.pointerEvents = 'none';
        isControlsVisible = true;
    }

    function hideControls() {
        iframe.style.cursor = 'none';
        overlay.style.pointerEvents = 'auto';
        isControlsVisible = false;
    }

    function handleMouseMove(e) {
        if (!overlayEnabled) return;

        const iframeRect = iframe.getBoundingClientRect();
        const isNearBottom = e.clientY >= iframeRect.bottom - 150;

        if (isNearBottom) {
            showControls();
        } else {
            hideControls();
        }

        clearTimeout(overlay.timeoutId);
        overlay.timeoutId = setTimeout(hideControls, 2000); // Change this to adjust hide cursor speed
    }

    function handleClick(e) {
        if (!overlayEnabled) return;

        const iframeRect = iframe.getBoundingClientRect();
        const isNearBottom = e.clientY >= iframeRect.bottom - 150;

        if (isControlsVisible || isNearBottom) {
            // Pass the click to the iframe
            const iframeClickEvent = new MouseEvent('click', {
                clientX: e.clientX - iframeRect.left,
                clientY: e.clientY - iframeRect.top,
                bubbles: true,
                cancelable: true,
                view: window
            });
            iframe.contentDocument.elementFromPoint(e.clientX - iframeRect.left, e.clientY - iframeRect.top).dispatchEvent(iframeClickEvent);
        } else {
            // Show controls when clicking anywhere on the video
            showControls();
            clearTimeout(overlay.timeoutId);
            overlay.timeoutId = setTimeout(hideControls, 2000);
        }
    }

    function updateMenuCommands() {
        if (enableMenuCommandId) GM_unregisterMenuCommand(enableMenuCommandId);
        if (disableMenuCommandId) GM_unregisterMenuCommand(disableMenuCommandId);

        if (!overlayEnabled) {
            enableMenuCommandId = GM_registerMenuCommand("Enable Overlay", enableOverlay);
        } else {
            disableMenuCommandId = GM_registerMenuCommand("Disable Overlay", disableOverlay);
        }
    }

    function init() {
        iframe = document.querySelector("#iframe-embed");
        if (!iframe) return;

        createOverlay();
        updateControlsVisibility();
        updateMenuCommands();

        overlay.addEventListener('mousemove', handleMouseMove);
        overlay.addEventListener('click', handleClick);
    }

    window.onload = function() {
        // Creates overlay
        init();
    };
})();
