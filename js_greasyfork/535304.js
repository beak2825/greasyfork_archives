// ==UserScript==
// @name         YouTube Watched Video Dimmer
// @namespace    https://greasyfork.org/users/1458847
// @version      1.1
// @license      MIT
// @description  Dims watched YouTube videos proportionally to the watched time.
// @author       Ev Haus, netjeff, actionless
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/535304/YouTube%20Watched%20Video%20Dimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/535304/YouTube%20Watched%20Video%20Dimmer.meta.js
// ==/UserScript==

/*
 * This script is based on the original "YouTube: Hide Watched Videos" by Ev Haus, netjeff, and actionless.
 * Modifications include:
 * - Simplified the code by removing Shorts and hide options.
 * - Implemented proportional dimming based on watched time.
 * - Settings for dimming are now configurable directly within the code.
 */

(function () {
    "use strict";

    const WATCHED_THRESHOLD_PERCENT = 10;
    const MIN_DIM_OPACITY = 0.2;
    const MAX_DIM_OPACITY = 0.9;
    const DEBUG = false;

    if (
        typeof trustedTypes !== 'undefined' &&
        trustedTypes.defaultPolicy === null
    ) {
        const s = (s) => s;
        trustedTypes.createPolicy('default', {
            createHTML: s,
            createScriptURL: s,
            createScript: s,
        });
    }

    const logDebug = (...msgs) => {
        if (DEBUG) console.debug('[YT-HWV]', msgs);
    };

    const addStyle = (aCss) => {
        const head = document.getElementsByTagName('head')[0];
        if (head) {
            const style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };

    const css = `
    .YT-HWV-WATCHED-HIDDEN {
        display: none !important
    }

    .YT-HWV-HIDDEN-ROW-PARENT {
        padding-bottom: 10px
    }

    .YT-HWV-BUTTONS {
        background: transparent;
        border: 1px solid var(--ytd-searchbox-legacy-border-color);
        border-radius: 40px;
        display: flex;
        gap: 5px;
        margin: 0 20px;
    }

    .YT-HWV-BUTTON {
        align-items: center;
        background: transparent;
        border: 0;
        border-radius: 40px;
        color: var(--yt-spec-icon-inactive);
        cursor: pointer;
        display: flex;
        height: 40px;
        justify-content: center;
        outline: 0;
        width: 40px;
    }

    .YT-HWV-BUTTON:focus,
    .YT-HWV-BUTTON:hover {
        background: var(--yt-spec-badge-chip-background);
    }

    .YT-HWV-BUTTON-DISABLED {
        color: var(--yt-spec-icon-disabled)
    }
    `;
    addStyle(css);

    const BUTTONS = [
        {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><path fill="currentColor" d="M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15 10.01 0 18.54-6.22 22-15-3.46-8.78-11.99-15-22-15zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/></svg>',
            name: 'Toggle Watched Videos',
            stateKey: 'YTHWV_STATE',
            type: 'toggle',
        },
    ];

    const debounce = function (func, wait, immediate) {
        let timeout;
        return (...args) => {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    };

    const findWatchedElements = () => {
        const watched = document.querySelectorAll([
                '.ytd-thumbnail-overlay-resume-playback-renderer',
                '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegmentModern',
            ].join(','),
        );

        const withThreshold = Array.from(watched).filter((bar) => {
            return (
                bar && bar.style.width &&
                Number.parseInt(bar.style.width, 10) >= WATCHED_THRESHOLD_PERCENT
            );
        });

        logDebug(
            `Found ${watched.length} watched elements, ${withThreshold.length} meeting threshold (${WATCHED_THRESHOLD_PERCENT}%)`
        );

        return withThreshold;
    };

    const findButtonAreaTarget = () => {
        return document.querySelector('#container #end #buttons');
    };

    const determineYoutubeSection = () => {
        const { href } = window.location;

        let youtubeSection = 'misc';
        if (href.includes('/watch?')) {
            youtubeSection = 'watch';
        } else if (
            href.match(/.*\/(user|channel|c)\/.+\/videos/u) ||
            href.match(/.*\/@.*/u)
        ) {
            youtubeSection = 'channel';
        } else if (href.includes('/feed/subscriptions')) {
            youtubeSection = 'subscriptions';
        } else if (href.includes('/feed/history')) {
             youtubeSection = 'history';
        } else if (href.includes('/feed/trending')) {
            youtubeSection = 'trending';
        } else if (href.includes('/playlist?')) {
            youtubeSection = 'playlist';
        } else if (href.includes('/results?')) {
            youtubeSection = 'search';
        } else if (href === 'https://www.youtube.com/' || href === 'http://www.youtube.com/') {
            youtubeSection = 'home';
        }

        return youtubeSection;
    };

    const calculateOpacity = (percentage) => {
        const sigmoidFactor = 4;

        const clampedPercent = Math.max(WATCHED_THRESHOLD_PERCENT, Math.min(100, percentage));
        const normalizedPercentage = (clampedPercent - WATCHED_THRESHOLD_PERCENT) / (100 - WATCHED_THRESHOLD_PERCENT);
        const shiftedPercentage = (normalizedPercentage - 0.5) * sigmoidFactor;
        const sigmoid = 1 / (1 + Math.exp(-shiftedPercentage));
        const invertedSigmoid = 1 - sigmoid;
        const opacity = MIN_DIM_OPACITY + invertedSigmoid * (MAX_DIM_OPACITY - MIN_DIM_OPACITY);

        return Math.max(MIN_DIM_OPACITY, Math.min(MAX_DIM_OPACITY, opacity));
    };

    const updateClassOnWatchedItems = async () => {
        document
            .querySelectorAll('.YT-HWV-WATCHED-HIDDEN')
            .forEach((el) => el.classList.remove('YT-HWV-WATCHED-HIDDEN'));

        const potentialItems = document.querySelectorAll(
            'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-item-section-renderer, ytd-playlist-video-renderer, ytd-compact-video-renderer, ytd-playlist-panel-video-renderer, ytd-video-renderer'
        );
        potentialItems.forEach(el => {
             if (el.style.opacity) {
                 el.style.opacity = '';
             }
             el.classList.remove('YT-HWV-HIDDEN-ROW-PARENT');
        });

        if (window.location.href.includes('/feed/history')) return;

        const section = determineYoutubeSection();
        const state = await GM_getValue(`YTHWV_STATE_${section}`, 'normal');

        if (state === 'normal') return;

        findWatchedElements().forEach((progressBarElement) => {
            const percentage = Number.parseInt(progressBarElement.style.width, 10);
            if (isNaN(percentage)) return;

            let itemToModify;
            let itemToDimOnly;

            if (section === 'subscriptions') {
                 itemToModify =
                    progressBarElement.closest('.ytd-rich-item-renderer') ||
                    progressBarElement.closest('.ytd-grid-video-renderer') ||
                    progressBarElement.closest('ytd-item-section-renderer');

            } else if (section === 'playlist') {
                itemToModify = progressBarElement.closest('ytd-playlist-video-renderer');
            } else if (section === 'watch') {
                itemToModify = progressBarElement.closest('ytd-compact-video-renderer');

                if (itemToModify?.closest('ytd-compact-autoplay-renderer')) {
                    itemToModify = null;
                }

                const watchedItemInPlaylistPanel = progressBarElement.closest('ytd-playlist-panel-video-renderer');
                if (!itemToModify && watchedItemInPlaylistPanel) {
                    itemToDimOnly = watchedItemInPlaylistPanel;
                }
            } else {
                 itemToModify =
                    progressBarElement.closest('ytd-rich-item-renderer') ||
                    progressBarElement.closest('ytd-video-renderer') ||
                    progressBarElement.closest('ytd-grid-video-renderer');
            }

            if (itemToModify) {
                itemToModify.style.opacity = '';
                itemToModify.classList.remove('YT-HWV-WATCHED-HIDDEN');
               itemToModify.classList.remove('YT-HWV-HIDDEN-ROW-PARENT');

                if (state === 'dimmed') {
                    const opacity = calculateOpacity(percentage);
                    itemToModify.style.opacity = opacity.toFixed(2);
                    logDebug(`Dimming item: ${itemToModify.tagName} to opacity ${opacity.toFixed(2)} (${percentage}%)`);
                }
            }

            if (itemToDimOnly && state === 'dimmed') {
                 itemToDimOnly.style.opacity = '';
                itemToModify?.classList.remove('YT-HWV-WATCHED-HIDDEN');

                const opacity = calculateOpacity(percentage);
                itemToDimOnly.style.opacity = opacity.toFixed(2);
                logDebug(`Dimming only item: ${itemToDimOnly.tagName} to opacity ${opacity.toFixed(2)} (${percentage}%)`);
            }
        });
    };

    const renderButtons = async () => {
        const target = findButtonAreaTarget();
        if (!target) return;

        const existingButtons = target.parentNode.querySelector('.YT-HWV-BUTTONS');

        const buttonArea = document.createElement('div');
        buttonArea.classList.add('YT-HWV-BUTTONS');

        for (const { icon, name, stateKey, type } of BUTTONS) {
            if (type === 'toggle') {
                const section = determineYoutubeSection();
                 if (section === 'history') {
                     if (existingButtons) existingButtons.remove();
                     return;
                 }

                const storageKey = `${stateKey}_${section}`;
                const toggleButtonState = await GM_getValue(storageKey, 'normal');

                const button = document.createElement('button');
                button.title = `${name} : currently "${toggleButtonState}" for section "${section}"`;
                button.classList.add('YT-HWV-BUTTON');
                if (toggleButtonState === 'dimmed') {
                    button.classList.add('YT-HWV-BUTTON-DISABLED');
                }
                let currentIcon = icon;
                button.innerHTML = currentIcon;
                buttonArea.appendChild(button);

                button.addEventListener('click', async () => {
                    const currentState = await GM_getValue(storageKey, 'normal');
                    logDebug(`Button ${name} clicked. Current state: ${currentState}, Section: ${section}`);

                    let newState = 'dimmed';
                     if (currentState === 'dimmed') {
                         newState = 'normal';
                     }

                    logDebug(`Setting new state to: ${newState}`);
                    await GM_setValue(storageKey, newState);

                    await updateClassOnWatchedItems();
                    await renderButtons();
                });
            }
        }

        if (buttonArea.hasChildNodes()) {
            if (existingButtons) {
                 if (existingButtons.innerHTML !== buttonArea.innerHTML) {
                     target.parentNode.replaceChild(buttonArea, existingButtons);
                     logDebug('Re-rendered menu buttons');
                 }
            } else {
                target.parentNode.insertBefore(buttonArea, target);
                logDebug('Rendered menu buttons');
            }
        } else if (existingButtons) {
             existingButtons.remove();
             logDebug('Removed menu buttons');
        }
    };

    const run = debounce(async (mutations) => {
        if (
            mutations &&
            mutations.length > 0 &&
             mutations.every(m =>
                m.target.classList?.contains('YT-HWV-BUTTON') ||
                m.target.classList?.contains('YT-HWV-BUTTONS') ||
                 m.addedNodes?.[0]?.classList?.contains('YT-HWV-BUTTONS') ||
                 m.removedNodes?.[0]?.classList?.contains('YT-HWV-BUTTONS')
            )
        ) {
            return;
        }

        logDebug('Running check for watched videos due to DOM change or initial load');
        await updateClassOnWatchedItems();
        await renderButtons();
    }, 250);

    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
        this.addEventListener(
            'readystatechange',
            function () {
                 if (this.readyState === 4 && (
                     this.responseURL.includes('/browse_ajax') ||
                     this.responseURL.includes('/player') ||
                     this.responseURL.includes('/search') ||
                     this.responseURL.includes('/next')
                    ))
                 {
                    logDebug(`AJAX detected (${this.responseURL}), scheduling update.`);
                    setTimeout(run, 500);
                }
            },
            false,
        );
        send.call(this, data);
    };

    const observeDOM = (() => {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return (obj, callback) => {
            if (!obj || !MutationObserver) {
                 console.warn('[YT-HWV] MutationObserver not available.');
                 return;
             }

            logDebug('Attaching DOM listener');
            const obs = new MutationObserver((mutations) => {
                 if (mutations.some(m => m.addedNodes.length > 0 || m.removedNodes.length > 0)) {
                    callback(mutations);
                }
            });

            obs.observe(obj, { childList: true, subtree: true });
        };
    })();

    logDebug('Starting Script (Simplified GM with Variable Dimming)');
    observeDOM(document.body, run);
    run();

})();