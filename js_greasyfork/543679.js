// ==UserScript==
// @name         YouTube - Repositions the Volume button
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Moves volume control after next button on YouTube and removes previous button
// @author       lainpilled
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543679/YouTube%20-%20Repositions%20the%20Volume%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/543679/YouTube%20-%20Repositions%20the%20Volume%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let mainObserver;
    let volumeObserver;
    let retryCount = 0;
    const MAX_RETRIES = 20;

    const elements = {
        volumeButton: null,
        nextButton: null,
        volumePopover: null,
        prevButton: null
    };

    function updateElementCache() {
        elements.volumeButton = document.querySelector('.ytp-volume-icon');
        elements.nextButton = document.querySelector('.ytp-next-button');
        elements.volumePopover = document.querySelector('.ytp-volume-popover');
        elements.prevButton = document.querySelector('.ytp-prev-button');
    }

    function alignPopover() {
        if (!elements.volumeButton || !elements.volumePopover) return;

        const buttonRect = elements.volumeButton.getBoundingClientRect();
        const containerRect = elements.volumeButton.parentElement.getBoundingClientRect();

        const offsetLeft = buttonRect.left - containerRect.left +
                          (elements.volumeButton.offsetWidth / 2) -
                          (elements.volumePopover.offsetWidth / 2);
        elements.volumePopover.style.left = `${offsetLeft}px`;
    }

    function removePrevButton() {
        if (elements.prevButton) {
            elements.prevButton.style.display = 'none';
        }
    }

    function makeNextButtonCircular() {
        if (!elements.nextButton) return;

        Object.assign(elements.nextButton.style, {
            borderRadius: '50%',
            overflow: 'hidden',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
    }

    function moveVolumeButton() {
        updateElementCache();

        if (!elements.volumeButton || !elements.nextButton || !elements.volumePopover) {
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(moveVolumeButton, 500);
            }
            return;
        }

        retryCount = 0;

        if (elements.nextButton.nextSibling !== elements.volumeButton) {
            elements.nextButton.parentNode.insertBefore(elements.volumeButton, elements.nextButton.nextSibling);
            elements.volumeButton.parentNode.insertBefore(elements.volumePopover, elements.volumeButton.nextSibling);

            const referenceButton = document.querySelector('.ytp-play-button') || elements.nextButton;
            if (referenceButton) {
                const computedStyle = window.getComputedStyle(referenceButton);
                Object.assign(elements.volumeButton.style, {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    verticalAlign: computedStyle.verticalAlign || 'middle',
                    lineHeight: computedStyle.lineHeight || 'normal'
                });
            }
        }

        elements.volumeButton.removeEventListener('mouseenter', alignPopover);
        elements.volumeButton.removeEventListener('click', alignPopover);

        elements.volumeButton.addEventListener('mouseenter', alignPopover);
        elements.volumeButton.addEventListener('click', alignPopover);

        if (volumeObserver) {
            volumeObserver.disconnect();
        }

        volumeObserver = new MutationObserver(alignPopover);
        volumeObserver.observe(elements.volumePopover, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    function initializeScript() {
        updateElementCache();
        removePrevButton();
        makeNextButtonCircular();
        moveVolumeButton();

        if (mainObserver) {
            mainObserver.disconnect();
        }

        mainObserver = new MutationObserver(() => {
            updateElementCache();
            removePrevButton();
            makeNextButtonCircular();
        });

        const playerContainer = document.querySelector('#movie_player') || document.body;
        mainObserver.observe(playerContainer, {
            childList: true,
            subtree: true
        });
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initializeScript, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

    setTimeout(initializeScript, 1000);

    window.addEventListener('beforeunload', () => {
        if (mainObserver) mainObserver.disconnect();
        if (volumeObserver) volumeObserver.disconnect();
    });
})();
