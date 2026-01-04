// ==UserScript==
// @name         Instagram Video Controls - Enhanced State Management
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Video controls for Instagram with persistent state and improved muting prevention
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523801/Instagram%20Video%20Controls%20-%20Enhanced%20State%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/523801/Instagram%20Video%20Controls%20-%20Enhanced%20State%20Management.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Immediate execution to handle any pre-existing videos
    const handleExistingVideos = () => {
        document.querySelectorAll('video').forEach(video => {
            video.muted = false;
            video.removeAttribute('muted');

            // Override muted property for existing videos
            Object.defineProperty(video, 'muted', {
                configurable: true,
                get: function() {
                    return this._muted || false;
                },
                set: function(value) {
                    // Only allow unmuting
                    if (value === false) {
                        this._muted = false;
                    }
                    return false;
                }
            });

            // Prevent muted attribute
            const originalSetAttribute = video.setAttribute;
            video.setAttribute = function(name, value) {
                if (name === 'muted') return;
                originalSetAttribute.call(this, name, value);
            };
        });
    };

    // Run immediately for any existing videos
    handleExistingVideos();

    // Early muting prevention for new videos
    const preventMuting = () => {
        const originalCreateElement = document.createElement;
        document.createElement = function(tag) {
            const element = originalCreateElement.call(document, tag);
            if (tag.toLowerCase() === 'video') {
                // Immediately set muted to false
                element.muted = false;

                // Override muted property
                Object.defineProperty(element, 'muted', {
                    configurable: true,
                    get: function() {
                        return this._muted || false;
                    },
                    set: function(value) {
                        // Only allow unmuting
                        if (value === false) {
                            this._muted = false;
                        }
                        return false;
                    }
                });

                // Prevent muted attribute
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'muted') return;
                    originalSetAttribute.call(this, name, value);
                };
            }
            return element;
        };
    };

    // Additional observer to catch dynamically added video elements
    const observeVideoElements = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        node.muted = false;
                        node.removeAttribute('muted');
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // Initialize muting prevention immediately
    preventMuting();
    observeVideoElements();


    // UI Constants
    const UI = {
        colors: {
            primary: '#0095f6',
            background: 'rgba(0,0,0,0.8)',
            text: '#ffffff',
            hover: 'rgba(255,255,255,0.1)'
        },
        sizes: {
            buttonSize: '32px',
            fontSize: {
                normal: '14px',
                large: '20px'
            },
            controlHeight: '48px',
            timelineHeight: '3px',
            timelineActiveHeight: '5px'
        },
        styles: {
            button: {
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'opacity 0.2s'
            },
            container: {
                display: 'flex',
                position: 'relative'
            }
        }
    };

    // Video State Management
    const VideoState = {
        preferences: {
            volume: 1,
            speed: 1,
            backgroundPlay: false,
            isMuted: false,
            lastUpdate: Date.now()
        },
        activeControlInstances: new Set(),
        saveTimeout: null,
        lastKnownGoodState: null,

        initialize() {
            try {
                // Load saved preferences
                const saved = localStorage.getItem('igVideoPreferences');
                if (saved) {
                    const parsedPrefs = JSON.parse(saved);
                    // Validate and merge saved preferences
                    this.preferences = {
                        volume: this.isValidVolume(parsedPrefs.volume) ? parsedPrefs.volume : this.preferences.volume,
                        speed: this.isValidSpeed(parsedPrefs.speed) ? parsedPrefs.speed : this.preferences.speed,
                        backgroundPlay: typeof parsedPrefs.backgroundPlay === 'boolean' ? parsedPrefs.backgroundPlay : this.preferences.backgroundPlay,
                        isMuted: typeof parsedPrefs.isMuted === 'boolean' ? parsedPrefs.isMuted : this.preferences.isMuted,
                        lastUpdate: Date.now()
                    };
                    this.lastKnownGoodState = { ...this.preferences };
                }

                // Set up observers
                this.setupLazyLoadDetection();
                this.setupIntersectionObserver();

                window.addEventListener('igVideoStateChange', this.broadcastStateChange.bind(this));
                window.addEventListener('beforeunload', () => {
                    if (this.saveTimeout) {
                        clearTimeout(this.saveTimeout);
                        this.savePreferences();
                    }
                });

            } catch (e) {
                console.error('Error initializing video state:', e);
                this.savePreferences();
            }
        },

        setupLazyLoadDetection() {
            // Watch for new video elements being added
            const videoObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'VIDEO') {
                                // Immediately prevent muting for new videos
                                this.preventMutingForVideo(node);

                                // Force state application after a short delay
                                setTimeout(() => {
                                    this.enforceStateOnVideo(node);
                                }, 50); // Small delay to ensure video is initialized
                            } else if (node.querySelectorAll) {
                                // Check for videos in added containers
                                node.querySelectorAll('video').forEach(video => {
                                    this.preventMutingForVideo(video);
                                    setTimeout(() => {
                                        this.enforceStateOnVideo(video);
                                    }, 50);
                                });
                            }
                        });
                    }
                }
            });

            videoObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'style']
            });
        },

        setupIntersectionObserver() {
            // Watch for videos coming into view
            const intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.nodeName === 'VIDEO') {
                        // When a video comes into view, ensure state is correct
                        this.enforceStateOnVideo(entry.target);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start checking slightly before video comes into view
                threshold: 0.1
            });

            // Observe all existing videos
            document.querySelectorAll('video').forEach(video => {
                intersectionObserver.observe(video);
            });

            // Watch for new videos to observe
            const videoObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'VIDEO') {
                            intersectionObserver.observe(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('video').forEach(video => {
                                intersectionObserver.observe(video);
                            });
                        }
                    });
                });
            });

            videoObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        preventMutingForVideo(video) {
            // Immediate unmuting
            video.muted = false;
            video.removeAttribute('muted');

            // Override muted property
            Object.defineProperty(video, 'muted', {
                configurable: true,
                get: function() {
                    return this._muted || false;
                },
                set: function(value) {
                    // Only allow unmuting
                    if (value === false) {
                        this._muted = false;
                    }
                    return false;
                }
            });

            // Prevent muted attribute
            const originalSetAttribute = video.setAttribute;
            video.setAttribute = function(name, value) {
                if (name === 'muted') return;
                originalSetAttribute.call(this, name, value);
            };
        },

        enforceStateOnVideo(video) {
            if (!video || !this.lastKnownGoodState) return;

            // Find the control instance for this video
            let controlInstance = null;
            this.activeControlInstances.forEach(instance => {
                if (instance.video === video) {
                    controlInstance = instance;
                }
            });

            if (controlInstance) {
                controlInstance.forceApplyState(this.lastKnownGoodState);
            } else {
                // If no control instance exists yet, apply state directly
                video.muted = this.lastKnownGoodState.isMuted;
                video.volume = this.lastKnownGoodState.volume;
                video.playbackRate = this.lastKnownGoodState.speed;
            }
        },

        isValidVolume(vol) {
            return typeof vol === 'number' && vol >= 0 && vol <= 1;
        },

        isValidSpeed(speed) {
            const validSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
            return validSpeeds.includes(speed);
        },

        savePreferences() {
            try {
                // Update lastUpdate timestamp
                this.preferences.lastUpdate = Date.now();
                localStorage.setItem('igVideoPreferences', JSON.stringify(this.preferences));
                // Update last known good state
                this.lastKnownGoodState = { ...this.preferences };
            } catch (e) {
                console.error('Error saving preferences:', e);
            }
        },

        update(key, value) {
            if (this.saveTimeout) {
                clearTimeout(this.saveTimeout);
            }

            let isValid = true;
            if (key === 'volume') {
                isValid = this.isValidVolume(value);
            } else if (key === 'speed') {
                isValid = this.isValidSpeed(value);
            }

            if (isValid) {
                this.preferences[key] = value;
                this.preferences.lastUpdate = Date.now();
                this.lastKnownGoodState = { ...this.preferences };

                this.saveTimeout = setTimeout(() => {
                    this.savePreferences();
                    window.dispatchEvent(new CustomEvent('igVideoStateChange', {
                        detail: { ...this.preferences }
                    }));
                }, 300);
            }
        },

        registerInstance(controlInstance) {
            this.activeControlInstances.add(controlInstance);
            controlInstance.applyState(this.preferences);
        },

        unregisterInstance(controlInstance) {
            this.activeControlInstances.delete(controlInstance);
        },

        broadcastStateChange(event) {
            const newState = event.detail;
            this.activeControlInstances.forEach(instance => {
                instance.applyState(newState);
            });
        }
    };


    // DOM Utilities
    const DOMUtils = {
        createButton(options = {}) {
            const button = document.createElement('button');
            button.className = options.className || '';
            Object.assign(button.style, {
                ...UI.styles.button,
                ...options.style
            });
            if (options.innerHTML) button.innerHTML = options.innerHTML;
            if (options.onclick) button.addEventListener('click', options.onclick);
            return button;
        },

        createContainer(options = {}) {
            const container = document.createElement('div');
            container.className = options.className || '';
            Object.assign(container.style, {
                ...UI.styles.container,
                ...options.style
            });
            return container;
        },

        setupHoverMenu(control, menuContainer, delay = 500) {
            let timeout;

            const showMenu = () => {
                clearTimeout(timeout);
                menuContainer.style.display = menuContainer.dataset.displayType || 'block';
            };

            const hideMenu = () => {
                timeout = setTimeout(() => {
                    menuContainer.style.display = 'none';
                }, delay);
            };

            control.addEventListener('mouseenter', showMenu);
            control.addEventListener('mouseleave', hideMenu);
            menuContainer.addEventListener('mouseenter', () => clearTimeout(timeout));
            menuContainer.addEventListener('mouseleave', hideMenu);

            return { showMenu, hideMenu };
        },

        formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${String(secs).padStart(2, '0')}`;
        }
    };

    // Video Controls Class
    class VideoControls {
        constructor(videoElement) {
            this.video = videoElement;
            this.isDragging = false;
            this.eventListeners = new Set();

            VideoState.registerInstance(this);
            this.container = this.createControlsContainer();
            this.initializeVideoState();
        }

        addEventListener(element, type, handler) {
            element.addEventListener(type, handler);
            this.eventListeners.add({ element, type, handler });
        }

        removeAllEventListeners() {
            this.eventListeners.forEach(({ element, type, handler }) => {
                element.removeEventListener(type, handler);
            });
            this.eventListeners.clear();
        }

        createControlComponent(options) {
            const control = DOMUtils.createContainer({
                className: options.className,
                style: { marginRight: '12px', ...options.style }
            });

            const button = DOMUtils.createButton({
                className: options.buttonClassName,
                style: options.buttonStyle,
                innerHTML: options.buttonContent,
                onclick: options.onClick
            });

            control.appendChild(button);

            if (options.menu) {
                control.appendChild(options.menu);
                if (options.useHoverMenu) {
                    DOMUtils.setupHoverMenu(control, options.menu);
                }
            }

            return { control, button };
        }

        createControlsContainer() {
            const container = DOMUtils.createContainer({
                className: 'ig-video-control',
                style: {
                    width: '100%',
                    height: UI.sizes.controlHeight,
                    background: UI.colors.background,
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: '9999999',
                    position: 'relative',
                    pointerEvents: 'all'
                }
            });

            const timeline = this.createTimeline();
            const controls = this.createControlsRow();

            container.appendChild(timeline);
            container.appendChild(controls);

            return container;
        }

        createControlsRow() {
            const row = DOMUtils.createContainer({
                className: 'ig-video-controls-row',
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    height: '28px',
                    position: 'relative',
                    zIndex: '9999999'
                }
            });

            const controls = [
                this.createPlayButton(),
                this.createTimeDisplay(),
                this.createSpeedControl(),
                this.createBackgroundPlayControl(),
                this.createVolumeControl()
            ];

            controls.forEach(control => row.appendChild(control));
            return row;
        }

        createPlayButton() {
            const updatePlayButton = (button) => {
                button.innerHTML = this.video.paused ? '⏵️' : '⏸️';
            };

            const { control, button } = this.createControlComponent({
                className: 'ig-video-play-control',
                buttonClassName: 'ig-video-control-button',
                buttonStyle: {
                    fontSize: '24px',
                    width: UI.sizes.buttonSize,
                    height: UI.sizes.buttonSize
                },
                buttonContent: this.video.paused ? '⏵️' : '⏸️',
                onClick: (e) => {
                    e.stopPropagation();
                    if (this.video.paused) {
                        this.video.play();
                    } else {
                        this.video.pause();
                    }
                }
            });

            this.addEventListener(this.video, 'play', () => updatePlayButton(button));
            this.addEventListener(this.video, 'pause', () => updatePlayButton(button));

            return control;
        }

        createTimeDisplay() {
            const display = document.createElement('span');
            display.className = 'ig-video-time-display';
            Object.assign(display.style, {
                color: UI.colors.text,
                fontSize: UI.sizes.fontSize.normal,
                marginRight: '12px',
                fontFamily: 'monospace'
            });

            const updateTime = () => {
                const current = Math.floor(this.video.currentTime);
                const total = Math.floor(this.video.duration);
                display.textContent = `${DOMUtils.formatTime(current)} / ${DOMUtils.formatTime(total)}`;
            };

            this.addEventListener(this.video, 'timeupdate', updateTime);
            this.addEventListener(this.video, 'loadedmetadata', updateTime);
            updateTime();

            return display;
        }

        createSpeedControl() {
            const options = this.createSpeedOptions();
            options.style.display = 'none';

            return this.createControlComponent({
                className: 'ig-video-speed-control',
                buttonClassName: 'ig-video-speed-button',
                buttonStyle: {
                    fontSize: UI.sizes.fontSize.normal,
                    padding: '4px 8px'
                },
                buttonContent: `${this.video.playbackRate}x`,
                menu: options,
                useHoverMenu: false,
                onClick: (e) => {
                    e.stopPropagation();
                    const menu = options;
                    const isVisible = menu.style.display === 'flex';
                    menu.style.display = isVisible ? 'none' : 'flex';

                    if (!isVisible) {
                        const closeMenu = (event) => {
                            if (!menu.contains(event.target)) {
                                menu.style.display = 'none';
                                document.removeEventListener('click', closeMenu);
                            }
                        };
                        setTimeout(() => {
                            document.addEventListener('click', closeMenu);
                        }, 0);
                    }
                }
            }).control;
        }

        createSpeedOptions() {
            const container = document.createElement('div');
            container.className = 'ig-video-speed-options';
            Object.assign(container.style, {
                position: 'absolute',
                top: 'calc(100% + 5px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: UI.colors.background,
                borderRadius: '4px',
                display: 'none',
                flexDirection: 'column',
                minWidth: '80px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                zIndex: '10000001'
            });

            [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].forEach(speed => {
                const option = DOMUtils.createButton({
                    className: 'ig-video-speed-option',
                    style: {
                        padding: '8px 16px',
                        fontSize: UI.sizes.fontSize.normal,
                        width: '100%',
                        textAlign: 'center',
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer'
                    },
                    innerHTML: `${speed}x`,
                    onclick: (e) => {
                        e.stopPropagation();
                        this.video.playbackRate = speed;
                        VideoState.update('speed', speed);
                        container.style.display = 'none';
                    }
                });

                container.appendChild(option);
            });

            return container;
        }

        createVolumeControl() {
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'ig-video-volume-slider-container';
            Object.assign(sliderContainer.style, {position: 'absolute',
                left: '25px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: UI.colors.background,
                padding: '10px',
                borderRadius: '4px',
                display: 'none'
            });

            const slider = this.createVolumeSlider();
            sliderContainer.appendChild(slider);

            const { control } = this.createControlComponent({
                className: 'ig-video-volume-control',
                buttonClassName: 'ig-video-volume-button',
                buttonStyle: {
                    fontSize: UI.sizes.fontSize.large,
                    width: UI.sizes.buttonSize,
                    height: UI.sizes.buttonSize
                },
                buttonContent: this.video.muted ? '🔇' : '🔊',
                onClick: (e) => {
                    e.stopPropagation();
                    this.video.muted = !this.video.muted;
                    VideoState.update('isMuted', this.video.muted);
                    this.updateVolumeUI();
                },
                menu: sliderContainer,
                useHoverMenu: true
            });

            return control;
        }

        createVolumeSlider() {
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = this.video.volume * 100;
            slider.className = 'ig-video-slider';
            Object.assign(slider.style, {
                width: '100px',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                cursor: 'pointer'
            });

            this.addEventListener(slider, 'input', (e) => {
                const value = e.target.value / 100;
                this.video.volume = value;
                this.video.muted = value === 0;
                VideoState.update('volume', value);
                VideoState.update('isMuted', this.video.muted);
                this.updateVolumeUI();
            });

            return slider;
        }

        createBackgroundPlayControl() {
            const updateBgPlayButton = (button) => {
                button.innerHTML = VideoState.preferences.backgroundPlay ? '🔓' : '🔒';
                button.title = VideoState.preferences.backgroundPlay ?
                    'Video will continue in background' :
                    'Video will pause in background';
                button.style.opacity = VideoState.preferences.backgroundPlay ? '1' : '0.7';
            };

            const { control, button } = this.createControlComponent({
                className: 'ig-video-bgplay-control',
                buttonClassName: 'ig-video-control-button',
                buttonStyle: {
                    fontSize: UI.sizes.fontSize.normal,
                    padding: '4px 8px',
                    opacity: VideoState.preferences.backgroundPlay ? '1' : '0.7'
                },
                buttonContent: VideoState.preferences.backgroundPlay ? '🔓' : '🔒',
                onClick: (e) => {
                    e.stopPropagation();
                    const newState = !VideoState.preferences.backgroundPlay;
                    VideoState.update('backgroundPlay', newState);
                    updateBgPlayButton(button);
                    newState ? this.enableBackgroundPlay() : this.disableBackgroundPlay();
                }
            });

            return control;
        }

        createTimeline() {
            const timeline = document.createElement('div');
            timeline.className = 'ig-video-timeline';
            Object.assign(timeline.style, {
                width: '100%',
                height: UI.sizes.timelineHeight,
                background: 'rgba(255,255,255,0.2)',
                position: 'relative',
                transition: 'height 0.1s'
            });

            const progress = document.createElement('div');
            progress.className = 'ig-video-progress';
            Object.assign(progress.style, {
                height: '100%',
                background: UI.colors.primary,
                width: '0%',
                position: 'absolute',
                top: '0',
                left: '0'
            });

            const seekHandle = document.createElement('div');
            seekHandle.className = 'ig-video-seek-handle';
            Object.assign(seekHandle.style, {
                width: '12px',
                height: '12px',
                background: UI.colors.primary,
                borderRadius: '50%',
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%) scale(0)',
                transition: 'transform 0.1s'
            });

            const tooltip = document.createElement('div');
            tooltip.className = 'ig-video-tooltip';
            Object.assign(tooltip.style, {
                position: 'absolute',
                background: UI.colors.background,
                color: UI.colors.text,
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: UI.sizes.fontSize.normal,
                bottom: '100%',
                transform: 'translateX(-50%)',
                display: 'none',
                zIndex: '10000000',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                marginBottom: '8px'
            });

            progress.appendChild(seekHandle);
            timeline.appendChild(progress);

            const container = DOMUtils.createContainer({
                className: 'ig-video-timeline-container',
                style: {
                    width: '100%',
                    height: '20px',
                    position: 'relative',
                    cursor: 'pointer',
                    padding: '8px 0',
                    zIndex: '9999999'
                }
            });

            container.appendChild(timeline);
            container.appendChild(tooltip);

            this.setupTimelineEvents(container, timeline, progress, seekHandle, tooltip);

            return container;
        }

        setupTimelineEvents(container, timeline, progress, seekHandle, tooltip) {
            const updateTimelinePosition = (e) => {
                if (!this.isDragging) return;

                const rect = timeline.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const newTime = this.video.duration * pos;

                progress.style.width = `${pos * 100}%`;
                tooltip.style.left = `${pos * 100}%`;
                tooltip.textContent = DOMUtils.formatTime(newTime);
                this.video.currentTime = newTime;
            };

            this.addEventListener(container, 'mousedown', (e) => {
                e.stopPropagation();
                this.isDragging = true;
                timeline.style.height = UI.sizes.timelineActiveHeight;
                seekHandle.style.transform = 'translateY(-50%) scale(1)';
                updateTimelinePosition(e);

                const handleMouseMove = (e) => updateTimelinePosition(e);
                const handleMouseUp = () => {
                    this.isDragging = false;
                    timeline.style.height = UI.sizes.timelineHeight;
                    seekHandle.style.transform = 'translateY(-50%) scale(0)';
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            });

            this.addEventListener(container, 'mousemove', (e) => {
                const rect = timeline.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

                if (!this.isDragging) {
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${pos * 100}%`;
                    const previewTime = this.video.duration * pos;
                    tooltip.textContent = DOMUtils.formatTime(previewTime);
                }
            });

            this.addEventListener(container, 'mouseleave', () => {
                if (!this.isDragging) {
                    tooltip.style.display = 'none';
                    timeline.style.height = UI.sizes.timelineHeight;
                    seekHandle.style.transform = 'translateY(-50%) scale(0)';
                }
            });

            this.addEventListener(container, 'mouseenter', () => {
                if (!this.isDragging) {
                    timeline.style.height = UI.sizes.timelineActiveHeight;
                    seekHandle.style.transform = 'translateY(-50%) scale(1)';
                }
            });

            this.addEventListener(this.video, 'timeupdate', () => {
                if (!this.isDragging) {
                    const progressValue = (this.video.currentTime / this.video.duration) * 100;
                    progress.style.width = `${progressValue}%`;
                }
            });
        }

        initializeVideoState() {
            if (this.video) {
                // Force unmute and set initial volume
                this.video.muted = false;
                this.video.removeAttribute('muted');

                if (this.video.volume === 0) {
                    this.video.volume = VideoState.preferences.volume;
                }

                this.setupVideoListeners();
                this.applyState(VideoState.preferences);
            }
        }

        setupVideoListeners() {
            this.addEventListener(this.video, 'volumechange', () => {
                if (this.video.muted !== VideoState.preferences.isMuted) {
                    VideoState.update('isMuted', this.video.muted);
                    this.updateVolumeUI();
                }
                if (!this.video.muted && this.video.volume !== VideoState.preferences.volume) {
                    VideoState.update('volume', this.video.volume);
                    this.updateVolumeUI();
                }
            });

            this.addEventListener(this.video, 'ratechange', () => {
                if (this.video.playbackRate !== VideoState.preferences.speed) {
                    VideoState.update('speed', this.video.playbackRate);
                    this.updateSpeedUI();
                }
            });
        }

        applyState(state) {
            if (this.video) {
                this.video.playbackRate = state.speed;
                this.video.volume = state.volume;
                this.video.muted = state.isMuted;

                if (this.container) {
                    this.updateVolumeUI();
                    this.updateSpeedUI();
                    this.updateBackgroundPlayUI();
                }

                state.backgroundPlay ? this.enableBackgroundPlay() : this.disableBackgroundPlay();
            }
        }

            forceApplyState(state) {
        if (this.video) {
            // Force apply state regardless of current values
            this.video.muted = state.isMuted;
            this.video.volume = state.volume;
            this.video.playbackRate = state.speed;

            // Force update UI elements
            if (this.container) {
                const volumeButton = this.container.querySelector('.ig-video-volume-button');
                const volumeSlider = this.container.querySelector('.ig-video-slider');
                const speedButton = this.container.querySelector('.ig-video-speed-button');
                const bgPlayButton = this.container.querySelector('.ig-video-bgplay-control .ig-video-control-button');

                if (volumeButton) volumeButton.innerHTML = state.isMuted ? '🔇' : '🔊';
                if (volumeSlider) volumeSlider.value = state.isMuted ? 0 : state.volume * 100;
                if (speedButton) speedButton.innerHTML = `${state.speed}x`;
                if (bgPlayButton) {
                    bgPlayButton.innerHTML = state.backgroundPlay ? '🔓' : '🔒';
                    bgPlayButton.style.opacity = state.backgroundPlay ? '1' : '0.7';
                }
            }

            // Enforce background play state
            state.backgroundPlay ? this.enableBackgroundPlay() : this.disableBackgroundPlay();
        }
    }

        updateVolumeUI() {
            const button = this.container.querySelector('.ig-video-volume-button');
            const slider = this.container.querySelector('.ig-video-slider');
            if (button) button.innerHTML = this.video.muted ? '🔇' : '🔊';
            if (slider) slider.value = this.video.muted ? 0 : this.video.volume * 100;
        }

        updateSpeedUI() {
            const button = this.container.querySelector('.ig-video-speed-button');
            if (button) button.innerHTML = `${this.video.playbackRate}x`;
        }

        updateBackgroundPlayUI() {
            const button = this.container.querySelector('.ig-video-bgplay-control .ig-video-control-button');
            if (button) {
                button.innerHTML = VideoState.preferences.backgroundPlay ? '🔓' : '🔒';
                button.style.opacity = VideoState.preferences.backgroundPlay ? '1' : '0.7';
            }
        }

        enableBackgroundPlay() {
            if (!this.video._originalPause) {
                this.video._originalPause = this.video.pause;
                this.video.pause = () => {
                    if (document.visibilityState === 'hidden' && !this.video.ended) {
                        return Promise.resolve();
                    }
                    return this.video._originalPause.call(this.video);
                };
            }
        }

        disableBackgroundPlay() {
            if (this.video._originalPause) {
                this.video.pause = this.video._originalPause;
                delete this.video._originalPause;
            }
        }

        destroy() {
            VideoState.unregisterInstance(this);
            this.removeAllEventListeners();
            if (this.container) {
                this.container.remove();
            }
        }
    }

    // Add global styles
    const addStyles = () => {
        const styles = `
            .ig-video-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                background: ${UI.colors.primary};
                border-radius: 50%;
                cursor: pointer;
            }
            .ig-video-slider::-moz-range-thumb {
                width: 12px;
                height: 12px;
                background: ${UI.colors.primary};
                border-radius: 50%;
                cursor: pointer;
                border: none;
            }
            .ig-video-control-button:hover {
                opacity: 0.8;
            }
            .ig-video-speed-option:hover {
                background: ${UI.colors.hover};
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    };




    // Initialize video controls
    const initVideoControls = () => {
        const processedVideos = new WeakSet();

        const addControlsToVideo = (videoElement) => {
            if (processedVideos.has(videoElement)) return;

            const videoContainer = videoElement.closest('div[class*="x5yr21d"][class*="x1uhb9sk"]');
            if (!videoContainer) return;

            // Early unmuting
            videoElement.muted = false;
            videoElement.removeAttribute('muted');

            processedVideos.add(videoElement);
            const controls = new VideoControls(videoElement);

            const controlsWrapper = DOMUtils.createContainer({
                className: 'ig-video-controls-wrapper',
                style: {
                    width: '100%',
                    position: 'relative',
                    zIndex: '9999999'
                }
            });



            controlsWrapper.appendChild(controls.container);
            videoContainer.parentElement.insertBefore(controlsWrapper, videoContainer);
            videoContainer.style.position = 'relative';
            videoContainer.style.zIndex = '1';

            const observer = new MutationObserver((mutations) => {
                if (!document.contains(videoElement)) {
                    controls.destroy();
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        // Main observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        addControlsToVideo(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(addControlsToVideo);
                    }
                });
                });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'style', 'class']
        });

        // Process existing videos
        document.querySelectorAll('video').forEach(addControlsToVideo);



    };

    // Initialize everything
    const initialize = () => {
        VideoState.initialize();
        addStyles();
        initVideoControls();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();