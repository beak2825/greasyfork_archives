// ==UserScript==
// @name                Youtube Remember Speed
// @name:zh-TW          YouTube 播放速度記憶
// @name:zh-CN          YouTube 播放速度记忆
// @name:ja             YouTube 再生速度メモリー
// @icon                https://www.google.com/s2/favicons?domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_remember_playback_rate_namespace
// @version             2.3.0
// @match               *://www.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://music.youtube.com/*
// @grant               GM.getValue
// @grant               GM.setValue
// @grant               GM.deleteValue
// @grant               GM.listValues
// @license             MIT
// @description         Remembers the speed that you last used. Now hijacks YouTube's custom speed slider and gives you up to 8x speed.
// @description:zh-TW   記住上次使用的播放速度，並改造YouTube的速度調整滑桿，最高支援8倍速。
// @description:zh-CN   记住上次使用的播放速度，并改造YouTube的速度调整滑杆，最高支持8倍速。
// @description:ja      最後に使った再生速度を覚えておき、YouTubeの速度スライダーを改造して最大8倍速まで対応させます。
// @homepageURL         https://greasyfork.org/scripts/503771-youtube-remember-speed
// @downloadURL https://update.greasyfork.org/scripts/503771/Youtube%20Remember%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/503771/Youtube%20Remember%20Speed.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(function () {
    'use strict';

    class SpeedOverrideManager {
        constructor(maxSpeed, getSettings, setSpeed, updateSavedSpeed) {
            this.maxSpeed = maxSpeed;
            this.getSettings = getSettings;
            this.setSpeed = setSpeed;
            this.updateSavedSpeed = updateSavedSpeed;
            this.DOM = {
                speedTextElement: null,
                speedLabel: null,
                parentMenu: null,
            };
            this.mainObserver = null;
            this.observerOptions = { childList: true, subtree: true, characterData: true };
        }

        disconnect() {
            if (this.mainObserver) {
                this.mainObserver.disconnect();
            }
            this.mainObserver = null;
        }

        overrideSpeedText(targetString) {
            try {
                if (!this.DOM.speedTextElement || !this.DOM.speedTextElement.isConnected) return;
                const text = this.DOM.speedTextElement.textContent;
                this.DOM.speedTextElement.textContent = /\(.*?\)/.test(text) ? text.replace(/\(.*?\)/, `(${targetString})`) : targetString;
            } catch (error) {
                console.error('Failed to set speed text.', error);
            }
        }

        overrideSpeedLabel(sliderElement) {
            try {
                const speedLabel = this.DOM.speedLabel;
                if (speedLabel?.isConnected && speedLabel.textContent && !speedLabel.textContent.includes(`(${sliderElement.value})`)) {
                    speedLabel.textContent = speedLabel.textContent.replace(/\(.*?\)/, `(${sliderElement.value})`);
                }
            } catch (error) {
                console.error('Failed to override speed label.', error);
            }
        }

        overrideSliderStyle(sliderElement) {
            if (!sliderElement) return;
            this.overrideSpeedLabel(sliderElement);
            sliderElement.style = `--yt-slider-shape-gradient-percent: ${(sliderElement.value / this.maxSpeed) * 100}%;`;
            const speedSliderText = document.querySelector('.ytp-speedslider-text');
            if (speedSliderText) {
                speedSliderText.textContent = sliderElement.value + 'x';
            }
        }

        overrideCustomSpeedItem(sliderElement) {
            const speedMenuItems = sliderElement.closest('.ytp-panel-menu');
            if (!speedMenuItems) return;
            const customSpeedItem = speedMenuItems.children[0];
            if (!customSpeedItem) return;
            if (!customSpeedItem.dataset.customSpeedClickListener) {
                customSpeedItem.addEventListener('click', () => {
                    const newSpeed = parseFloat(sliderElement.value);
                    this.setSpeed(newSpeed);
                    this.updateSavedSpeed(newSpeed);
                    this.overrideSpeedText(newSpeed);
                });
                customSpeedItem.dataset.customSpeedClickListener = 'true';
            }

            if (customSpeedItem.classList.contains('ytp-menuitem-with-footer') && customSpeedItem.getAttribute('aria-checked') !== 'true') {
                const currentActiveItem = speedMenuItems.querySelector('[aria-checked="true"]');
                if (currentActiveItem && currentActiveItem !== customSpeedItem) {
                    currentActiveItem.setAttribute('aria-checked', 'false');
                }
                customSpeedItem.setAttribute('aria-checked', 'true');
            }
        }

        overrideSliderFunction(sliderElement) {
            sliderElement.addEventListener('input', () => {
                try {
                    const newSpeed = parseFloat(sliderElement.value);
                    this.updateSavedSpeed(newSpeed);
                    this.setSpeed(newSpeed);
                    this.overrideSliderStyle(sliderElement);
                    this.overrideCustomSpeedItem(sliderElement);
                } catch (error) {
                    console.error('Error during slider input event.', error);
                }
            });

            sliderElement.addEventListener(
                'change',
                (event) => {
                    this.overrideSpeedText(sliderElement.value);
                    event.stopImmediatePropagation();
                },
                true,
            );
        }

        setupSliderOnce(sliderElement) {
            if (!sliderElement) return;
            if (!sliderElement.dataset.listenerAttached) {
                this.overrideSliderFunction(sliderElement);
                sliderElement.dataset.listenerAttached = 'true';
            }
            sliderElement.max = this.maxSpeed.toString();
            sliderElement.setAttribute('value', this.getSettings().targetSpeed.toString());
            this.setSpeed(this.getSettings().targetSpeed);
            this.DOM.speedLabel = sliderElement.closest('.ytp-menuitem-with-footer')?.querySelector('.ytp-menuitem-label');
        }

        async findSpeedTextElement() {
            // We use a magic number to manually create a stable selector for the speed menu item.
            const magicSpeedNumber = 1.05;
            const pollForElement = () => {
                const settingItems = document.querySelectorAll('.ytp-menuitem');
                return Array.from(settingItems).find((item) => item.textContent.includes(magicSpeedNumber.toString()));
            };
            const targetSpeed = this.getSettings().targetSpeed;
            const youtubeApi = document.querySelector('#movie_player');
            // YouTube API must be called here regardless to allow the YouTube UI to updated normally. (reason unclear)
            youtubeApi.setPlaybackRate(magicSpeedNumber);

            let attempts = 0;
            while (attempts < 50) {
                const matchingItem = pollForElement();
                if (matchingItem) {
                    this.DOM.speedTextElement = matchingItem.querySelector('.ytp-menuitem-content');
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 10));
                attempts++;
            }
            this.setSpeed(targetSpeed);
            this.updateSavedSpeed(targetSpeed);
            this.overrideSpeedText(targetSpeed);
        }

        _monitorUI() {
            const sliderElement = document.querySelector('input.ytp-input-slider.ytp-speedslider');
            if (sliderElement) {
                if (!sliderElement.dataset.speedScriptSetup) {
                    this.setupSliderOnce(sliderElement);
                    sliderElement.dataset.speedScriptSetup = 'true';
                }

                if (!this.DOM.speedLabel || !this.DOM.speedLabel.isConnected) {
                    this.DOM.speedLabel = sliderElement.closest('.ytp-menuitem-with-footer')?.querySelector('.ytp-menuitem-label');
                }

                const speedLabel = this.DOM.speedLabel;
                const expectedLabel = `(${sliderElement.value})`;
                if (speedLabel && !speedLabel.textContent.includes(expectedLabel)) {
                    this.mainObserver.disconnect();
                    this.overrideSliderStyle(sliderElement);
                    this.overrideCustomSpeedItem(sliderElement);
                    this.mainObserver.observe(this.DOM.parentMenu, this.observerOptions);
                }
                return;
            }

            if (!this.DOM.speedTextElement || !this.DOM.speedTextElement.isConnected) {
                this.findSpeedTextElement();
            } else {
                const currentText = this.DOM.speedTextElement.textContent;
                const targetSpeed = this.getSettings().targetSpeed.toString();
                if (!currentText.includes(targetSpeed)) {
                    this.mainObserver.disconnect();
                    this.overrideSpeedText(targetSpeed);
                    this.mainObserver.observe(this.DOM.parentMenu, this.observerOptions);
                }
            }
        }

        init() {
            try {
                this.DOM.parentMenu = document.querySelector('.ytp-popup.ytp-settings-menu');
                if (!this.DOM.parentMenu) return;

                this.mainObserver = new MutationObserver(this._monitorUI.bind(this));
                this.mainObserver.observe(this.DOM.parentMenu, this.observerOptions);
            } catch (error) {
                console.error('Failed to initialize speed override manager.', error);
            }
        }
    }

    // --- Main Script Logic ---
    const DEFAULT_SETTINGS = { targetSpeed: 1 };
    let userSettings = { ...DEFAULT_SETTINGS };
    const maxSpeed = 8;
    const stepSize = 0.25;
    let manager = null;

    function setSpeed(targetSpeed) {
        try {
            const video = document.querySelector('video');
            if (video && video.playbackRate !== targetSpeed) {
                video.playbackRate = targetSpeed;
            }
        } catch (error) {
            console.error('Failed to set playback speed.', error);
        }
    }

    function updateSavedSpeed(speed) {
        const newSpeed = parseFloat(speed);
        if (userSettings.targetSpeed !== newSpeed) {
            userSettings.targetSpeed = newSpeed;
            GM.setValue('targetSpeed', userSettings.targetSpeed);
        }
    }

    async function applySettings() {
        try {
            const storedSpeed = await GM.getValue('targetSpeed', DEFAULT_SETTINGS.targetSpeed);
            userSettings.targetSpeed = storedSpeed;
        } catch (error) {
            console.error('Failed to apply stored settings.', error.message);
        }
    }

    function handleNewVideoLoad() {
        if (!manager) {
            manager = new SpeedOverrideManager(maxSpeed, () => userSettings, setSpeed, updateSavedSpeed);
        }
        setSpeed(userSettings.targetSpeed);
        manager.init();

        const youtubeApi = document.querySelector('#movie_player');
        if (youtubeApi && !youtubeApi.dataset.speedScriptListenerAttached) {
            youtubeApi.addEventListener('onPlaybackRateChange', (newSpeed) => {
                updateSavedSpeed(newSpeed);
                if (manager) {
                    manager.overrideSpeedText(newSpeed);
                }
            });
            youtubeApi.dataset.speedScriptListenerAttached = 'true';
        }
    }

    function setupHotkeys() {

        let speedTimeoutId = null;
        const INDICATOR_DURATION_MS = 450;
        const FADE_OUT_DURATION_MS = 200;

        const _showNewSpeedVisual = () => {
            const currentSpeed = userSettings.targetSpeed;
            let indicator = document.getElementById('speed-indicator-overlay');

            if (speedTimeoutId) {
                clearTimeout(speedTimeoutId);
                speedTimeoutId = null;
            }

            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'speed-indicator-overlay';
                indicator.style.cssText = `
                    position: fixed;
                    top: 17%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.75);
                    color: white;
                    padding: 16px 24px;
                    border-radius: 4px;
                    font-size: 3em; /* Big enough to read easily */
                    font-weight: regular;
                    z-index: 99999;
                    opacity: 0.85;
                    transition: opacity ${FADE_OUT_DURATION_MS}ms ease-out; /* Smooth fade-out */
                    pointer-events: none; /* Stops the indicator from blocking clicks */
                `;
                document.body.appendChild(indicator);
            } else {
                indicator.style.opacity = 1;
            }

            indicator.textContent = `${currentSpeed.toFixed(2)}x`;
            speedTimeoutId = setTimeout(() => {
                indicator.style.opacity = 0;
                setTimeout(() => {
                    if (document.body.contains(indicator)) {
                        document.body.removeChild(indicator);
                    }
                    speedTimeoutId = null;
                }, FADE_OUT_DURATION_MS);
            }, INDICATOR_DURATION_MS);
        };
        const _nudgeSpeed = (isIncrease) => {
            const speedChange = isIncrease ? stepSize : -stepSize;
            userSettings.targetSpeed = Math.max(stepSize, Math.min(maxSpeed, userSettings.targetSpeed + speedChange));
            setSpeed(userSettings.targetSpeed);
            updateSavedSpeed(userSettings.targetSpeed);
            _showNewSpeedVisual();
        };
        window.addEventListener('keydown', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
            if (event.key === '<') {
                event.preventDefault();
                _nudgeSpeed(false);
            } else if (event.key === '>') {
                event.preventDefault();
                _nudgeSpeed(true);
            }
        }, true); // use capture needs to be true to override existing youtube hotkeys
    }

    function main() {
        window.addEventListener(
            'pageshow',
            () => {
                handleNewVideoLoad();
                window.addEventListener(
                    'yt-player-updated',
                    () => {
                        if (manager) {
                            manager.disconnect();
                            manager = null;
                        }
                        handleNewVideoLoad();
                    },
                    true,
                );
            },
            true,
        );
        setupHotkeys();
    }

    applySettings().then(main);
})();
