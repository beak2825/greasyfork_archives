// ==UserScript==
// @name         Wide + title fix mode
// @version      1.4
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @description  Wide + Title fix
// @namespace https://greasyfork.org/users/1029007
// @downloadURL https://update.greasyfork.org/scripts/540312/Wide%20%2B%20title%20fix%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540312/Wide%20%2B%20title%20fix%20mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SCALE_KEY = 'yt-wide-scaleX';
    const TILE_KEY = 'yt-tile-count';

    let scaleX = parseFloat(localStorage.getItem(SCALE_KEY)) || 1.3;
    let tilesPerRow = parseInt(localStorage.getItem(TILE_KEY)) || 4;
    let lastScaleBeforeFullscreen = scaleX;

    GM_addStyle(`
    html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    body::-webkit-scrollbar {
        display: none;
    }

    #yt-wide-control, #yt-tile-control {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-right: 10px;
        background: transparent !important;
    }

    .yt-editable-label {
        cursor: pointer;
        color: var(--yt-spec-text-primary, #fff);
        font-size: 14px;
    }

    .yt-editable-input {
        width: 60px;
        padding: 2px 4px;
        font-size: 14px;
        background: transparent !important;
        border: none !important;
        outline: none;
        color: var(--yt-spec-text-primary, #fff);
        font-family: inherit;
        display: none;
    }

    .yt-control:hover .yt-editable-label {
        text-decoration: underline;
    }
    `);
    function calculateAutoScale(video) {
        const flexy = document.querySelector('ytd-watch-flexy[theater]');
        if (!flexy || !video) return scaleX;

        const containerWidth = flexy.clientWidth;
        const videoNaturalWidth = video.videoWidth;

        if (!containerWidth || !videoNaturalWidth) return scaleX;

        const currentDisplayedWidth = video.clientWidth;
        if (!currentDisplayedWidth) return scaleX;

        const requiredScale = containerWidth / currentDisplayedWidth;

        return Math.min(Math.max(requiredScale, 1.0), 2.0);
    }
    function applyScale(value = scaleX, auto = false) {
        const video = document.querySelector('ytd-watch-flexy[theater] #movie_player video');
        if (video) {
            const targetScale = auto ? calculateAutoScale(video) : value;
            video.style.transition = 'none';
            video.style.transform = `scaleX(${targetScale})`;
            video.style.transformOrigin = 'center center';

            if (auto) {
                const label = document.querySelector('#yt-wide-control .yt-editable-label');
                if (label) label.textContent = `ScaleX: ${targetScale.toFixed(2)}`;
            }
        }
    }

    const videoObserver = new MutationObserver(() => {
        const video = document.querySelector('ytd-watch-flexy[theater] #movie_player video');
        if (video) applyScale(undefined, true);
    });

    function observeVideo() {
        const moviePlayer = document.querySelector('ytd-watch-flexy[theater] #movie_player');

        if (moviePlayer) {
            videoObserver.disconnect();
            videoObserver.observe(moviePlayer, {
                childList: true,
                subtree: true,
            });

            const video = moviePlayer.querySelector('video');
            if (video) {
                applyScale();
            } else {
                const tmpObserver = new MutationObserver(() => {
                    const vid = moviePlayer.querySelector('video');
                    if (vid) {
                        applyScale(undefined, true);
                        tmpObserver.disconnect();
                    }
                });
                tmpObserver.observe(moviePlayer, { childList: true, subtree: true });
            }
        }
    }

    function updateTiles() {
        let style = document.getElementById('tile-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tile-style';
            document.head.appendChild(style);
        }
        style.textContent = `
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${tilesPerRow} !important;
            }
        `;
    }

    function preventScrollOnWheel(input) {
        input.addEventListener('wheel', e => {
            e.stopPropagation();
        }, { passive: false });
    }

    function waitForTargetElement(selector, callback) {
        const interval = setInterval(() => {
            const target = document.querySelector(selector);
            if (target) {
                clearInterval(interval);
                callback(target);
            }
        }, 50);
    }

    function createEditableControl(id, labelText, value, onChange) {
        if (document.getElementById(id)) return;

        const container = document.createElement('div');
        container.id = id;
        container.className = 'yt-control';

        const label = document.createElement('span');
        label.className = 'yt-editable-label';
        label.textContent = `${labelText}: ${value}`;

        const input = document.createElement('input');
        input.className = 'yt-editable-input';
        input.type = 'number';
        input.step = '0.01';
        input.value = value;
        preventScrollOnWheel(input);

        label.addEventListener('click', () => {
            label.style.display = 'none';
            input.style.display = 'inline';
            input.focus();
            input.select();
        });

        input.addEventListener('blur', () => {
            const newValue = parseFloat(input.value);
            if (!isNaN(newValue)) {
                onChange(newValue);
                label.textContent = `${labelText}: ${newValue.toFixed(2)}`;
                if (!document.fullscreenElement && labelText === 'ScaleX') {
                    lastScaleBeforeFullscreen = newValue;
                }
            }
            label.style.display = 'inline';
            input.style.display = 'none';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        container.appendChild(label);
        container.appendChild(input);
        return container;
    }

    function setup() {
        const path = window.location.pathname;
        const isWatch = path.startsWith('/watch');
        const isMainOrSubs = path === '/' || path === '/feed/subscriptions';

        waitForTargetElement('#end', (target) => {
            if (isWatch) {
                if (!document.getElementById('yt-wide-control')) {
                    const scaleControl = createEditableControl(
                        'yt-wide-control',
                        'ScaleX',
                        scaleX,
                        (newValue) => {
                            scaleX = newValue;
                            localStorage.setItem(SCALE_KEY, newValue.toFixed(2));
                            lastScaleBeforeFullscreen = newValue;
                            applyScale();
                        }
                    );
                    target.insertBefore(scaleControl, target.firstChild);
                    applyScale();
                    observeVideo();
                }
            } else {
                const wideControl = document.getElementById('yt-wide-control');
                if (wideControl) wideControl.remove();
                videoObserver.disconnect();
            }

            if (isMainOrSubs) {
                if (!document.getElementById('yt-tile-control')) {
                    const tileControl = createEditableControl(
                        'yt-tile-control',
                        'Tiles',
                        tilesPerRow,
                        (newValue) => {
                            tilesPerRow = parseInt(newValue) || 1;
                            localStorage.setItem(TILE_KEY, tilesPerRow);
                            updateTiles();
                        }
                    );
                    tileControl.querySelector('input').step = '1';
                    tileControl.querySelector('input').min = '1';
                    target.insertBefore(tileControl, target.firstChild);
                    updateTiles();
                }
            } else {
                const tileControl = document.getElementById('yt-tile-control');
                if (tileControl) tileControl.remove();
            }
        });
    }

    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = !!document.fullscreenElement;
        if (isFullscreen) {
            lastScaleBeforeFullscreen = scaleX;
            applyScale(1.0);
        } else {
            applyScale(lastScaleBeforeFullscreen);
        }
    });

    const pageObserver = new MutationObserver(() => {
        setup();
    });

    pageObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('yt-navigate-finish', setup);

    setup();
    const theaterObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'theater') {
                const isTheater = mutation.target.hasAttribute('theater');
                if (isTheater) {
                    applyScale(undefined, true);
                    observeVideo();
                }
            }
        }
    });

    waitForTargetElement('ytd-watch-flexy', target => {
        theaterObserver.observe(target, { attributes: true });
    });

})();