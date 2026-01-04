// ==UserScript==
// @name         Better Keyboard Shortcuts for SharePoint
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Simpler keyboard shorcuts with visual indicators for Microsoft SharePoint videos
// @author       kazcfz
// @include      https://*.sharepoint.com/*
// @icon         https://res-1.cdn.office.net/shellux/stream_24x.12dba766a9c30382b781c971070dc87c.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538268/Better%20Keyboard%20Shortcuts%20for%20SharePoint.user.js
// @updateURL https://update.greasyfork.org/scripts/538268/Better%20Keyboard%20Shortcuts%20for%20SharePoint.meta.js
// ==/UserScript==

/* eslint curly: "off" */

(function () {
    'use strict';

    // Wait until .oneplayer-root exists in the DOM, then run callback with it
    function waitForOnePlayerRoot(callback) {
        const root = document.querySelector('.oneplayer-root') || document.querySelector('.OnePlayer-container');
        if (root) {
            callback(root);
            return;
        }
        const docObserver = new MutationObserver((mutations, obs) => {
            const el = document.querySelector('.oneplayer-root') || document.querySelector('.OnePlayer-container');
            if (el) {
                obs.disconnect();
                callback(el);
            }
        });
        docObserver.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }

    waitForOnePlayerRoot(videoRoot => {
        if (getComputedStyle(videoRoot).position === 'static')
            videoRoot.style.position = 'relative';

        // Overlay to indicate Skip
        const skipOverlay = document.createElement('div');
        skipOverlay.style.position = 'absolute';
        skipOverlay.style.top = '50%';
        skipOverlay.style.transform = 'translateY(-50%)';
        skipOverlay.style.padding = '15px 15px';
        skipOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        skipOverlay.style.borderRadius = '50%';
        skipOverlay.style.pointerEvents = 'none';
        skipOverlay.style.opacity = '0';
        skipOverlay.style.transition = 'opacity 0.1s ease';
        skipOverlay.style.zIndex = '9999';
        skipOverlay.style.userSelect = 'none';
        skipOverlay.style.display = 'flex';
        skipOverlay.style.flexDirection = 'column';
        skipOverlay.style.alignItems = 'center';
        skipOverlay.style.justifyContent = 'center';
        skipOverlay.style.gap = '0.2em';
        skipOverlay.style.minWidth = '75px';
        skipOverlay.style.minHeight = '75px';
        skipOverlay.style.textAlign = 'center';
        videoRoot.appendChild(skipOverlay);

        // Overlay to indicate Volume
        const topMiddleOverlay = document.createElement('div');
        topMiddleOverlay.style.position = 'absolute';
        topMiddleOverlay.style.top = '10%';
        topMiddleOverlay.style.left = '0';
        topMiddleOverlay.style.right = '0';
        topMiddleOverlay.style.margin = 'auto';
        topMiddleOverlay.style.padding = '7px 11px';
        topMiddleOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        topMiddleOverlay.style.borderRadius = '5px';
        topMiddleOverlay.style.pointerEvents = 'none';
        topMiddleOverlay.style.opacity = '0';
        topMiddleOverlay.style.transition = 'opacity 0.015s ease';
        topMiddleOverlay.style.zIndex = '9999';
        topMiddleOverlay.style.userSelect = 'none';
        topMiddleOverlay.style.display = 'flex';
        topMiddleOverlay.style.flexDirection = 'column';
        topMiddleOverlay.style.alignItems = 'center';
        topMiddleOverlay.style.justifyContent = 'center';
        topMiddleOverlay.style.gap = '0.2em';
        topMiddleOverlay.style.width = '50px';
        topMiddleOverlay.style.minHeight = '30px';
        topMiddleOverlay.style.textAlign = 'center';
        videoRoot.appendChild(topMiddleOverlay);

        // Overlay to indicate Play/Pause
        const centerOverlay = document.createElement('div');
        centerOverlay.style.position = 'absolute';
        centerOverlay.style.top = '50%';
        centerOverlay.style.left = '50%';
        centerOverlay.style.right = 'auto';
        centerOverlay.style.margin = '0';
        centerOverlay.style.transform = 'translate(-50%, -50%)';
        centerOverlay.style.padding = '15px';
        centerOverlay.style.fontVariantEmoji = 'text';
        centerOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        centerOverlay.style.borderRadius = '50%';
        centerOverlay.style.pointerEvents = 'none';
        centerOverlay.style.opacity = '0';
        centerOverlay.style.zIndex = '9999';
        centerOverlay.style.userSelect = 'none';
        centerOverlay.style.display = 'flex';
        centerOverlay.style.flexDirection = 'column';
        centerOverlay.style.alignItems = 'center';
        centerOverlay.style.justifyContent = 'center';
        centerOverlay.style.textAlign = 'center';
        centerOverlay.style.color = 'rgba(255,255,255,0.85)';
        videoRoot.appendChild(centerOverlay);

        const centerSymbol = document.createElement('span');
        centerSymbol.style.opacity = '1';
        centerOverlay.appendChild(centerSymbol);

        // Overlay text for current volume
        const topMiddleText = document.createElement('div');
        topMiddleText.style.fontSize = '17px';
        topMiddleText.style.fontWeight = '500';
        topMiddleText.style.color = 'rgba(255,255,255,0.85)';
        topMiddleText.style.userSelect = 'none';
        topMiddleOverlay.appendChild(topMiddleText);

        // Overlay container for left/right triangles
        const trianglesContainer = document.createElement('div');
        trianglesContainer.style.display = 'flex';
        trianglesContainer.style.gap = '10px';
        skipOverlay.appendChild(trianglesContainer);

        // Add triangles into its container
        const triangles = [];
        for (let i = 0; i < 3; i++) {
            const tri = document.createElement('span');
            tri.textContent = '▶';
            tri.style.fontSize = '13px';
            tri.style.fontWeight = 'bold';
            trianglesContainer.appendChild(tri);
            triangles.push(tri);
        }

        // Overlay text for seconds skipped
        const secondsText = document.createElement('div');
        secondsText.style.fontSize = '14px';
        secondsText.style.fontWeight = 'normal';
        secondsText.style.color = 'rgba(255,255,255,0.85)';
        secondsText.style.userSelect = 'none';
        skipOverlay.appendChild(secondsText);

        let hideTimeoutSkipOverlay;
        let hideTimeoutTopMiddleOverlay;
        let hideTimeoutCenterOverlay;
        let animTimeouts = [];

        // Displays overlay triangle animation and seconds skipped
        const secondsToSkip = 5;
        function showAnimatedTriangles(side) {
            // Clear animation timers
            clearTimeout(hideTimeoutSkipOverlay);
            animTimeouts.forEach(t => clearTimeout(t));
            animTimeouts = [];

            const isLeft = side === 'left';
            const char = isLeft ? '◀' : '▶';
            const order = isLeft ? [2, 1, 0] : [0, 1, 2];

            triangles.forEach(t => {
                t.textContent = char;
                t.style.transition = 'none';
                t.style.color = 'rgba(255,255,255,0.3)';
            });

            // Force style flush to apply the color immediately before re-enabling transitions
            void skipOverlay.offsetHeight;
            triangles.forEach(t => { t.style.transition = 'color 0.3s ease'; });

            secondsText.textContent = `${secondsToSkip} seconds`;

            skipOverlay.style.opacity = '1';
            skipOverlay.style.left = isLeft ? '10%' : 'auto';
            skipOverlay.style.right = isLeft ? 'auto' : '10%';
            skipOverlay.style.textAlign = 'center';

            triangles[order[0]].style.color = 'rgba(255,255,255,0.75)';

            const interval = 200;

            for (let step = 2; step <= 3; step++) {
                animTimeouts.push(setTimeout(() => {
                    if (step === 2) {
                        triangles[order[0]].style.color = 'rgba(255,255,255,0.5)';
                        triangles[order[1]].style.color = 'rgba(255,255,255,0.75)';
                    }
                    else if (step === 3) {
                        triangles[order[0]].style.color = 'rgba(255,255,255,0.3)';
                        triangles[order[1]].style.color = 'rgba(255,255,255,0.5)';
                        triangles[order[2]].style.color = 'rgba(255,255,255,0.75)';
                    }
                }, (step - 1) * interval));
            }

            hideTimeoutSkipOverlay = setTimeout(() => { skipOverlay.style.opacity = '0'; }, 3.3 * interval);
        }

        // Checks that the video player is focused
        function isInOnePlayerRoot(element) {
            while (element) {
                if (element === videoRoot)
                    return true;
                element = element.parentElement;
            }
            return false;
        }

        let video = null;

        function setupVideo(v) {
            if (!v || video === v)
                return;
            video = v;
        }

        // Initial attempt to find video
        setupVideo(videoRoot.querySelector('video'));

        // Observe videoRoot subtree for added/removed video
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations)
                for (const node of mutation.addedNodes)
                    if (node.nodeType === 1)
                        if (node.tagName === 'VIDEO')
                            setupVideo(node);
                        else {
                            const v = node.querySelector && node.querySelector('video');
                            if (v)
                                setupVideo(v);
                        }
        });

        observer.observe(videoRoot, { childList: true, subtree: true });


        function triggerCenterSymbol(symbol) {
            clearTimeout(hideTimeoutCenterOverlay);

            centerOverlay.style.width = '75px';
            centerOverlay.style.height = '75px';
            centerOverlay.style.transition = 'opacity 0.1s ease';
            centerOverlay.style.opacity = '1';

            hideTimeoutCenterOverlay = setTimeout(() => {
                centerOverlay.style.transition = 'width 0.75s ease, height 0.75s ease, font-size 0.75s ease, opacity 0.75s ease';
                centerOverlay.style.width = `${parseFloat(getComputedStyle(centerOverlay).width) + 25}px`;
                centerOverlay.style.height = `${parseFloat(getComputedStyle(centerOverlay).height) + 25}px`;
                centerOverlay.style.fontSize = `${parseFloat(getComputedStyle(centerOverlay).fontSize) + 22.5}px`;
                centerOverlay.style.opacity = '0';
            }, 50);

            centerSymbol.textContent = symbol;
            if (symbol === '🔊' || symbol === '🔇') {
                centerSymbol.style.marginBottom = '9px';
                centerSymbol.style.marginLeft = '5px';
                centerOverlay.style.fontSize = '60px';
            } else if (symbol === '🔉') {
                centerSymbol.style.marginBottom = '9px';
                centerSymbol.style.marginLeft = '0px';
                centerOverlay.style.fontSize = '60px';
            } else if (symbol === '▶') {
                centerSymbol.style.marginBottom = '7px';
                centerSymbol.style.marginLeft = '12px';
                centerOverlay.style.fontSize = '50px';
            } else if (symbol === '⏸') {
                centerSymbol.style.marginBottom = '14px';
                centerSymbol.style.marginLeft = '4px';
                centerOverlay.style.fontSize = '55px';
            }
        }


        // Math time: MS Stream/SharePoint handles volume steps exponentially (cubically) rather than linearly
        // The sequence is (steps of 0.1)^3, counting down from 1 to 0:
        // volume (base 𝑛) = (1 − 0.1 × 𝑛)^3, where 𝑛 = 0, 1, 2, ..., 10.
        // Alternatively, could just keep it to linear volume steps
        let currentVolumeStepCount = 0;
        function triggerTopMiddleText(action) {
            if (action == 'volume') {
                const volumePercent = video.volume * 100;
                if (volumePercent >= 1 || video.volume == 0)
                    topMiddleText.textContent = `${Math.round(volumePercent)}%`;
                else
                    topMiddleText.textContent = `${volumePercent.toFixed(1)}%`;

            } else if (action == 'speed') {
                const speed = video.playbackRate;
                topMiddleText.textContent = (speed % 1 === 0) ? `${speed}x` : `${speed.toFixed(2)}x`;
                if (topMiddleText.textContent.endsWith('0x'))
                    topMiddleText.textContent = `${speed.toFixed(1)}x`;
            }

            topMiddleOverlay.style.opacity = '1';
            clearTimeout(hideTimeoutTopMiddleOverlay);
            hideTimeoutTopMiddleOverlay = setTimeout(() => { topMiddleOverlay.style.opacity = '0'; }, 500);
        }

        document.addEventListener('keydown', e => {
            if (!video)
                return;
            if (e.altKey || e.ctrlKey || e.metaKey)
                return;
            if (document.activeElement && !isInOnePlayerRoot(document.activeElement))
                return;

            e.preventDefault();

            // Home to jump to start
            if (e.code === 'Home')
                video.currentTime = 0;

            // End to jump to end
            else if (e.code === 'End')
                video.currentTime = video.duration;

            // Period to skip to next frame
            else if (e.code === 'Period' && !e.shiftKey)
                video.currentTime = Math.min(video.duration, video.currentTime + (1/30));

            // Comma to skip to previous frame
            else if (e.code === 'Comma' && !e.shiftKey)
                video.currentTime = Math.max(0, video.currentTime - (1/30));

            // > to speed up
            else if (e.key === '>') {
                document.querySelector('[aria-description*="Alt + X"]').click();
                const items = [...document.querySelectorAll('[role="menuitemradio"]')];
                const currentIndex = items.findIndex(item => item.getAttribute('aria-checked') === 'true');

                if (currentIndex > 0)
                    items[currentIndex - 1].click();
                else
                    document.querySelector('[aria-description*="Alt + X"]').click();
                triggerTopMiddleText('speed');
            }

            // < to slow down
            else if (e.key === '<') {
                document.querySelector('[aria-description*="Alt + Z"]').click();
                const items = [...document.querySelectorAll('[role="menuitemradio"]')];
                const currentIndex = items.findIndex(item => item.getAttribute('aria-checked') === 'true');

                if (currentIndex < items.length - 1)
                    items[currentIndex + 1].click();
                else
                    document.querySelector('[aria-description*="Alt + Z"]').click();
                triggerTopMiddleText('speed');
            }

            // 0–9 to skip to 0%–90% of video
            else if (/^Digit[0-9]$/.test(e.code))
                video.currentTime = (video.duration * (parseInt(e.code.replace('Digit', ''), 10))) / 10;

            // → to skip forward
            else if (e.code === 'ArrowRight') {
                video.currentTime = Math.min(video.duration, video.currentTime + secondsToSkip);
                showAnimatedTriangles('right');

            // ← to skip backward
            } else if (e.code === 'ArrowLeft') {
                video.currentTime = Math.max(0, video.currentTime - secondsToSkip);
                showAnimatedTriangles('left');

            // ↑ to increase volume
            } else if (e.code === 'ArrowUp') {
                if (currentVolumeStepCount > 0) {
                    currentVolumeStepCount--;
                    video.volume = Math.pow(1 - 0.1 * currentVolumeStepCount, 3);
                    //video.volume = Math.max(0, Math.min(1, Math.round((video.volume + 0.1) * 100) / 100));
                }
                triggerTopMiddleText('volume');
                triggerCenterSymbol('🔊');

            // ↓ to decrease volume
            } else if (e.code === 'ArrowDown') {
                if (currentVolumeStepCount < 10) {
                    currentVolumeStepCount++;
                    video.volume = Math.pow(1 - 0.1 * currentVolumeStepCount, 3);
                    //video.volume = Math.max(0, Math.min(1, Math.round((video.volume - 0.1) * 100) / 100));
                }
                triggerTopMiddleText('volume');

                if (video.volume == 0)
                    triggerCenterSymbol('🔇');
                else
                    triggerCenterSymbol('🔉');

            // / to go to search box
            } else if (e.key === '/') {
                const searchInput = document.querySelector('input[role="combobox"][type="search"][placeholder="Search"]');
                searchInput.focus();
                searchInput.select();
                return;

            // Trigger SharePoint's keyboard shortcuts / advanced features
            } else {
                // Adapted from [Sharepoint Keyboard Shortcuts] by [CyrilSLi], MIT License
                // https://greasyfork.org/en/scripts/524190-sharepoint-keyboard-shortcuts
                const keys = {
                    Space: document.querySelector('[aria-description*="Alt + K"]'),
                    KeyK: document.querySelector('[aria-description*="Alt + K"]'),
                    KeyJ: document.querySelector('[aria-description*="Alt + J"]'),
                    KeyL: document.querySelector('[aria-description*="Alt + L"]'),
                    KeyF: document.querySelector('[aria-description*="Alt + Enter"]'),
                    KeyM: document.querySelector('[aria-description*="Alt + M"]'),
                    KeyC: document.querySelector('[aria-description*="Alt + C"]'),
                    KeyA: document.querySelector('[aria-description*="Alt + A"]'),
                }

                if (keys.hasOwnProperty(e.code))
                    keys[e.code].click();


                if (e.code === 'Space' || e.code === 'KeyK') {
                    if (video.paused)
                        triggerCenterSymbol('⏸');
                    else
                        triggerCenterSymbol('▶');

                } else if (e.code === 'KeyC') {
                    const items = [...document.querySelectorAll('[role="menuitemradio"]')];
                    const menuitem = document.querySelector('button[role="menuitem"][aria-label="Captions"]');
                    const currentIndex = items.findIndex(item => item.getAttribute('aria-checked') === 'true');

                    if (currentIndex >= items.length - 1) {
                        items[0].click();
                        menuitem.setAttribute('aria-checked', 'false');

                    } else if (currentIndex < items.length - 1) {
                        items[currentIndex + 1].click();
                        menuitem.setAttribute('aria-checked', 'true');
                    }

                } else if (e.code === 'KeyM')
                    if (video.muted)
                        triggerCenterSymbol('🔊');
                    else
                        triggerCenterSymbol('🔇');
            }

            document.querySelector(".fluent-critical-ui-container").focus();
        });

    });
})();
