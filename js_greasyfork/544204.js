// ==UserScript==
// @name         FlatMMO Sound Manager
// @namespace    com.pizza1337.flatmmo.soundmanager
// @version      1.1.3
// @description  Adds advanced audio controls
// @author       Pizza1337
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544204/FlatMMO%20Sound%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/544204/FlatMMO%20Sound%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ALERT_SOUND_SETTINGS = [
        { id: 'alertSoundGem', label: 'Gem Drop', path: 'sounds/short/gem.ogg' },
        { id: 'alertSoundFallingTree', label: 'Falling Tree', path: 'sounds/short/fallingtree.mp3' },
        { id: 'alertSoundBirdNest', label: 'Bird Nest', path: 'sounds/short/birdnest.ogg' },
        { id: 'alertSoundFullInvent', label: 'Full Inventory', path: 'sounds/short/fullinvent.ogg' },
        { id: 'alertSoundAlien', label: 'Alien Encounter', path: 'sounds/alien.mp3' }
    ];

    const ALERT_SOUND_CONFIG_ENTRIES = [
        { type: 'label', label: 'Alerts:' },
        ...ALERT_SOUND_SETTINGS.map(sound => ({
            id: sound.id,
            label: sound.label,
            type: 'boolean',
            default: true
        }))
    ];

    const ALERT_SOUND_CONFIG_LOOKUP = ALERT_SOUND_SETTINGS.reduce((acc, sound) => {
        acc[sound.path] = sound.id;
        return acc;
    }, Object.create(null));

    class SoundManagerPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("sound-manager", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [{
                    id: "separateAlerts",
                    label: "Separate Alert Sounds",
                    type: "boolean",
                    default: true
                }, ...ALERT_SOUND_CONFIG_ENTRIES]
            });

            this.userscriptMusicTrack = null;
            this.areAudioHooksApplied = false;
            this.hasVolumeSlidersBeenAdded = false;
            this.soundMuteOverlay = null;

            this.init();
        }

        /**
         * Safely checks the server's sound state and sends an unmute command if needed.
         */
        checkAndUnmuteServer() {
            if (this.getConfig('separateAlerts')) {
                // FIX: Check against the numeric value `1` for the OPEN state, as the WebSocket.OPEN constant can be unreliable in userscripts.
                if (typeof sound_off !== 'undefined' && sound_off && Globals.websocket && Globals.websocket.readyState === 1) {
                   Object.getPrototypeOf(Globals.websocket).send.call(Globals.websocket, 'TOGGLE_AUDIO=sound');
                }
            }
        }

        /**
         * This function is called by the FlatMMOPlus framework after a successful login.
         */
        onLogin() {
            this.checkAndUnmuteServer();
        }

        init() {
            this.injectStyles();
            const observer = new MutationObserver(() => {
                if (!this.areAudioHooksApplied && typeof window.play_sound === 'function' && Globals.websocket && typeof Globals.websocket.send === 'function') {
                    this.applyAudioHooks();
                }
                if (!this.hasVolumeSlidersBeenAdded && document.querySelector("#ui-panel-settings table.settings-ui")) {
                    this.renderVolumeControls();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        injectStyles() {
            const styles = `
                .tm-alert-icon {
                    width: 64px;
                    height: 64px;
                    fill: #000;
                }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }

        updateSoundUI(isMuted) {
            if (this.soundMuteOverlay) {
                this.soundMuteOverlay.style.display = isMuted ? 'block' : 'none';
            }
        }

        normalizeSoundPath(path) {
            if (typeof path !== 'string') return '';
            const queryIndex = path.indexOf('?');
            const sanitized = queryIndex === -1 ? path : path.slice(0, queryIndex);
            const soundsIndex = sanitized.indexOf('sounds/');
            return soundsIndex === -1 ? sanitized : sanitized.slice(soundsIndex);
        }

        shouldUseAlertChannel(path) {
            if (!this.getConfig('separateAlerts')) return false;
            const normalizedPath = this.normalizeSoundPath(path);
            const configId = ALERT_SOUND_CONFIG_LOOKUP[normalizedPath];
            if (!configId) return false;
            return this.getConfig(configId);
        }

        applyAudioHooks() {
            this.areAudioHooksApplied = true;

            this.playSoundEngine = (path, vol = 1) => {
                try {
                    const audio = new Audio(path);
                    audio.volume = parseFloat(vol);
                    audio.play().catch(e => console.error("Audio playback failed:", e));
                } catch (e) {
                    console.error("Failed to create or play audio:", e);
                }
            };

            const originalSend = Object.getPrototypeOf(Globals.websocket).send;

            Globals.websocket.send = (message) => {
                if (message === 'TOGGLE_AUDIO=sound' && this.getConfig('separateAlerts')) {
                    const currentlyMuted = localStorage.getItem('flatmmo_sound_muted') === 'true';
                    localStorage.setItem('flatmmo_sound_muted', !currentlyMuted);
                    this.updateSoundUI(!currentlyMuted);
                    return;
                }
                return originalSend.call(Globals.websocket, message);
            };

            window.play_sound = (path, vol = 1) => {
                if (!this.getConfig('separateAlerts')) {
                    if (typeof sound_off !== 'undefined' && sound_off) return;
                    const savedVolume = parseFloat(localStorage.getItem('flatmmo_sound_volume') ?? '1.0');
                    this.playSoundEngine(path, savedVolume * vol);
                    return;
                }
                if (this.shouldUseAlertChannel(path)) {
                    if (localStorage.getItem('flatmmo_alert_muted') === 'true') return;
                    const savedVolume = parseFloat(localStorage.getItem('flatmmo_alert_volume') ?? '1.0');
                    this.playSoundEngine(path, savedVolume * vol);
                    return;
                }
                if (localStorage.getItem('flatmmo_sound_muted') === 'true') return;
                const savedVolume = parseFloat(localStorage.getItem('flatmmo_sound_volume') ?? '1.0');
                this.playSoundEngine(path, savedVolume * vol);
            };

            window.pause_track = () => {
                if (this.userscriptMusicTrack) {
                    this.userscriptMusicTrack.pause();
                    this.userscriptMusicTrack.currentTime = 0;
                }
                this.userscriptMusicTrack = null;
            };

            window.play_track = (f) => {
                window.pause_track();
                if (typeof music_off !== 'undefined' && music_off) return;
                const savedVolume = parseFloat(localStorage.getItem('flatmmo_music_volume') ?? '0.5');
                this.userscriptMusicTrack = new Audio(f.startsWith('http') ? f : "sounds/tracks/" + f);
                this.userscriptMusicTrack.volume = savedVolume;
                this.userscriptMusicTrack.play();
                window.track = this.userscriptMusicTrack;
            };
        }

        onConfigsChanged() {
            this.checkAndUnmuteServer();
            this.renderVolumeControls();
        }

        renderVolumeControls() {
            const settingsPanel = document.querySelector("#ui-panel-settings");
            const soundIcon = document.getElementById('settings-sound-icon');
            const musicIcon = document.getElementById('settings-music-icon');
            const settingsTable = settingsPanel?.querySelector("table.settings-ui");

            if (!settingsPanel || !soundIcon || !musicIcon || !settingsTable) return;

            this.hasVolumeSlidersBeenAdded = true;

            const existingContainer = document.getElementById('volume-controls-wrapper');
            if (existingContainer) existingContainer.remove();

            const mainControlsContainer = document.createElement('div');
            mainControlsContainer.id = 'volume-controls-wrapper';
            mainControlsContainer.style.cssText = 'display: flex; justify-content: space-around; padding: 10px; align-items: start;';

            const createVolumeControl = (type, iconElement, defaultValue, isCustomControl = false) => {
                const container = document.createElement('div');
                container.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 5px; cursor: pointer;';

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = 0;
                slider.max = 100;
                slider.step = 10;
                slider.value = (localStorage.getItem(`flatmmo_${type}_volume`) ?? defaultValue) * 100;
                slider.style.cssText = 'width: 60px; margin: 0;';

                const tooltip = document.createElement('div');
                tooltip.style.cssText = `position: fixed; padding: 8px 12px; background: #333; color: #fff; border-radius: 6px; font-size: 24px; font-weight: 500; box-shadow: 0 2px 6px rgba(0,0,0,0.4); pointer-events: none; z-index: 9999; display: none; white-space: nowrap;`;
                document.body.appendChild(tooltip);

                const getTypeLabel = (t) => t.charAt(0).toUpperCase() + t.slice(1);
                const showTooltip = (e) => {
                    tooltip.textContent = `${getTypeLabel(type)}: ${slider.value}%`;
                    tooltip.style.left = `${e.pageX + 15}px`;
                    tooltip.style.top = `${e.pageY + 10}px`;
                    tooltip.style.display = 'block';
                };

                container.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const step = parseInt(slider.step, 10);
                    const currentValue = parseInt(slider.value, 10);
                    let newValue = e.deltaY < 0 ? Math.min(100, currentValue + step) : Math.max(0, currentValue - step);
                    if (newValue !== currentValue) {
                        slider.value = newValue;
                        slider.dispatchEvent(new Event('input'));
                    }
                });
                container.addEventListener('mouseenter', showTooltip);
                container.addEventListener('mousemove', showTooltip);
                container.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

                slider.addEventListener('input', () => {
                    const newVolume = slider.value / 100;
                    localStorage.setItem(`flatmmo_${type}_volume`, newVolume);
                    if (type === 'music' && this.userscriptMusicTrack) this.userscriptMusicTrack.volume = newVolume;
                    tooltip.textContent = `${getTypeLabel(type)}: ${slider.value}%`;
                });

                const iconWrapper = document.createElement('div');
                iconWrapper.style.cssText = 'position: relative; width: 64px; height: 64px;';
                iconElement.style.width = '64px';
                iconElement.style.height = '64px';
                iconWrapper.appendChild(iconElement);

                const muteOverlay = document.createElement('div');
                muteOverlay.innerHTML = `<svg viewBox="0 0 32 32" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"><line x1="4" y1="4" x2="28" y2="28" stroke="#560606" stroke-width="4"/><line x1="28" y1="4" x2="4" y2="28" stroke="#560606" stroke-width="4"/></svg>`;

                if (isCustomControl) {
                    const muteKey = `flatmmo_${type}_muted`;
                    muteOverlay.style.display = localStorage.getItem(muteKey) === 'true' ? 'block' : 'none';
                    iconWrapper.appendChild(muteOverlay);
                    iconWrapper.onclick = () => {
                        const currentlyMuted = localStorage.getItem(muteKey) === 'true';
                        localStorage.setItem(muteKey, !currentlyMuted);
                        muteOverlay.style.display = !currentlyMuted ? 'block' : 'none';
                    };
                } else if (type === 'sound' && this.getConfig('separateAlerts')) {
                    if (typeof window.toggle_sound === 'function') iconElement.onclick = window.toggle_sound;
                    this.soundMuteOverlay = muteOverlay;
                    iconWrapper.appendChild(this.soundMuteOverlay);
                    this.updateSoundUI(localStorage.getItem('flatmmo_sound_muted') === 'true');
                }

                container.append(iconWrapper, slider);
                return container;
            };

            const alertIconContainer = document.createElement('div');
            alertIconContainer.innerHTML = `<svg class="tm-alert-icon" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"></path></svg>`;

            soundIcon.remove();
            musicIcon.remove();

            if (this.getConfig('separateAlerts')) {
                mainControlsContainer.append(
                    createVolumeControl('sound', soundIcon, 1.0),
                    createVolumeControl('alert', alertIconContainer.firstChild, 1.0, true),
                    createVolumeControl('music', musicIcon, 0.5)
                );
            } else {
                mainControlsContainer.append(
                    createVolumeControl('sound', soundIcon, 1.0),
                    createVolumeControl('music', musicIcon, 0.5)
                );
            }
            settingsPanel.insertBefore(mainControlsContainer, settingsTable);
        }
    }

    const plugin = new SoundManagerPlugin();
    FlatMMOPlus.registerPlugin(plugin);

})();
