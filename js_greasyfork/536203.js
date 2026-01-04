// ==UserScript==
// @name         Torn Nuclear Raid Siren Alert
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  It hurts
// @author       vassilios
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536203/Torn%20Nuclear%20Raid%20Siren%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/536203/Torn%20Nuclear%20Raid%20Siren%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        ALERT_THRESHOLD_SECONDS: 60,
        SIREN_DURATION_MS: 1500,
        SIREN_START_FREQUENCY_HZ: 400,
        SIREN_END_FREQUENCY_HZ: 1000,
        SIREN_VOLUME: 0.3,
        CHECK_INTERVAL_MS: 5000,
        UI_FADE_DELAY_MS: 10000
    };

    const CSS = {
        INDICATOR: {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: '9999',
            transition: 'opacity 1s'
        }
    };

    const SELECTORS = {
        CHAIN_BAR_CLASS_PREFIX: 'chain-bar',
        TIME_LEFT_CLASS_PREFIX: 'bar-timeleft'
    };

    const state = {
        sirenPlaying: false,
        continuousSirenTimeout: null,
        audioContext: null,
        isAudioInitialized: false,
        lastTimeLeft: null,
        currentOscillator: null,
        currentGainNode: null
    };

    function initializeAudio() {
        if (!state.isAudioInitialized) {
            try {
                state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                state.isAudioInitialized = true;
                return true;
            } catch (error) {
                return false;
            }
        }
        return true;
    }

    function playContinuousSiren() {
        if (!state.isAudioInitialized || state.sirenPlaying) {
            return;
        }

        try {
            state.sirenPlaying = true;

            function playSirenCycle() {
                if (state.currentOscillator) {
                    try {
                        state.currentOscillator.stop();
                    } catch (e) {}
                }

                const oscillator = state.audioContext.createOscillator();
                const gainNode = state.audioContext.createGain();

                state.currentOscillator = oscillator;
                state.currentGainNode = gainNode;

                oscillator.connect(gainNode);
                gainNode.connect(state.audioContext.destination);

                oscillator.type = 'sawtooth';
                gainNode.gain.value = CONFIG.SIREN_VOLUME;

                const currentTime = state.audioContext.currentTime;
                const cycleDuration = CONFIG.SIREN_DURATION_MS / 1000;

                oscillator.frequency.setValueAtTime(
                    CONFIG.SIREN_START_FREQUENCY_HZ,
                    currentTime
                );

                oscillator.frequency.linearRampToValueAtTime(
                    CONFIG.SIREN_END_FREQUENCY_HZ,
                    currentTime + (cycleDuration / 2)
                );

                oscillator.frequency.linearRampToValueAtTime(
                    CONFIG.SIREN_START_FREQUENCY_HZ,
                    currentTime + cycleDuration
                );

                oscillator.start();

                if (state.sirenPlaying) {
                    state.continuousSirenTimeout = setTimeout(playSirenCycle, CONFIG.SIREN_DURATION_MS);
                }
            }

            playSirenCycle();

        } catch (error) {
            state.sirenPlaying = false;
        }
    }

    function startContinuousSiren() {
        if (state.sirenPlaying) {
            return;
        }

        playContinuousSiren();
    }

    function stopContinuousSiren() {
        if (!state.sirenPlaying) {
            return;
        }

        state.sirenPlaying = false;

        if (state.continuousSirenTimeout) {
            clearTimeout(state.continuousSirenTimeout);
            state.continuousSirenTimeout = null;
        }

        if (state.currentOscillator) {
            try {
                state.currentOscillator.stop();
                state.currentOscillator = null;
                state.currentGainNode = null;
            } catch (e) {}
        }
    }

    function findElementByClassPrefix(parentElement, classPrefix) {
        const elements = parentElement.getElementsByTagName('*');

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].className && typeof elements[i].className === 'string') {
                const classList = elements[i].className.split(' ');
                for (const className of classList) {
                    if (className.indexOf(classPrefix) === 0) {
                        return elements[i];
                    }
                }
            }
        }

        return null;
    }

    function parseTimeToSeconds(timeText) {
        const timeParts = timeText.split(':');

        if (timeParts.length === 2) {
            const minutes = parseInt(timeParts[0], 10);
            const seconds = parseInt(timeParts[1], 10);
            return (minutes * 60) + seconds;
        }

        return timeText;
    }

    function checkChainTimer() {
        const chainBarElement = findElementByClassPrefix(document, SELECTORS.CHAIN_BAR_CLASS_PREFIX);

        if (!chainBarElement) {
            return null;
        }

        const timeElement = findElementByClassPrefix(chainBarElement, SELECTORS.TIME_LEFT_CLASS_PREFIX);

        if (!timeElement) {
            return null;
        }

        const timeText = timeElement.textContent;
        const totalSeconds = parseTimeToSeconds(timeText);

        if (typeof totalSeconds === 'number' && totalSeconds !== state.lastTimeLeft) {
            state.lastTimeLeft = totalSeconds;

            if (totalSeconds < CONFIG.ALERT_THRESHOLD_SECONDS) {
                if (state.isAudioInitialized && !state.sirenPlaying) {
                    startContinuousSiren();
                }
            } else if (state.sirenPlaying) {
                stopContinuousSiren();
            }
        }

        return totalSeconds;
    }

    function createUIIndicator() {
        const indicator = document.createElement('div');

        Object.assign(indicator.style, CSS.INDICATOR);
        indicator.innerHTML = 'Nuclear Raid Siren Active<br>Click anywhere to enable sound';
        document.body.appendChild(indicator);

        setTimeout(() => {
            indicator.style.opacity = '0.3';

            indicator.addEventListener('mouseenter', () => {
                indicator.style.opacity = '1';
            });

            indicator.addEventListener('mouseleave', () => {
                indicator.style.opacity = '0.3';
            });
        }, CONFIG.UI_FADE_DELAY_MS);
    }

    function initialize() {
        document.addEventListener('click', () => {
            if (!state.isAudioInitialized) {
                if (initializeAudio()) {
                    setTimeout(() => {
                        const oscillator = state.audioContext.createOscillator();
                        const gainNode = state.audioContext.createGain();

                        oscillator.connect(gainNode);
                        gainNode.connect(state.audioContext.destination);

                        oscillator.type = 'sawtooth';
                        gainNode.gain.value = CONFIG.SIREN_VOLUME;

                        oscillator.frequency.setValueAtTime(
                            CONFIG.SIREN_START_FREQUENCY_HZ,
                            state.audioContext.currentTime
                        );

                        oscillator.frequency.linearRampToValueAtTime(
                            CONFIG.SIREN_END_FREQUENCY_HZ,
                            state.audioContext.currentTime + 0.5
                        );

                        oscillator.start();

                        setTimeout(() => {
                            oscillator.stop();
                        }, 500);
                    }, 500);
                }
            }
        }, { once: false });

        checkChainTimer();
        setInterval(checkChainTimer, CONFIG.CHECK_INTERVAL_MS);
        createUIIndicator();
    }

    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();
