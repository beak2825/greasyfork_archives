// ==UserScript==
// @name         Powerline Server Switcher
// @author       Rumini - Discord: rumini & zaynbieber
// @description  Server switcher for powerline
// @version      1.0
// @match        *://powerline.io/*
// @icon         https://i.imgur.com/9k4SFr0.png
// @license      MIT
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1356205
// @downloadURL https://update.greasyfork.org/scripts/504703/Powerline%20Server%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/504703/Powerline%20Server%20Switcher.meta.js
// ==/UserScript==

if (window.location.href === 'https://powerline.io/') {
    window.location.href = 'https://powerline.io/maindev.html';
}

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        regions: ['Europe', 'Asia', 'America'],
        countryCodes: { Europe: 'DE', Asia: 'JP', America: 'US' },
        euCountries: new Set(['AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'MC', 'NL', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM', 'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA']),
        asiaCountries: new Set(['AF', 'AM', 'AZ', 'BH', 'BD', 'BT', 'BN', 'KH', 'CN', 'CY', 'GE', 'IN', 'ID', 'IR', 'IQ', 'IL', 'JP', 'JO', 'KZ', 'KW', 'KG', 'LA', 'LB', 'MY', 'MV', 'MN', 'MM', 'NP', 'KP', 'OM', 'PK', 'PS', 'PH', 'QA', 'SA', 'SG', 'KR', 'LK', 'SY', 'TW', 'TJ', 'TH', 'TR', 'TM', 'AE', 'UZ', 'VN', 'YE']),
        updateInterval: 1000,
        hideDelay: 1000,
        switchDelay: 1000,
        tipDuration: 2000,
    };

    // Utility functions
    const util = {
        waitForGame: (callback) => {
            if (typeof network !== 'undefined' && typeof countryCode !== 'undefined') {
                callback();
            } else {
                setTimeout(() => util.waitForGame(callback), 100);
            }
        },
        getRegion: () => {
            if (CONFIG.euCountries.has(countryCode)) return 'Europe';
            if (CONFIG.asiaCountries.has(countryCode)) return 'Asia';
            return 'America';
        },
        createElement: (tag, options = {}) => {
            const element = document.createElement(tag);
            Object.assign(element, options);
            if (options.style) element.style.cssText = options.style;
            return element;
        },
    };

    // Main class
    class ServerSwitcher {
        constructor() {
            this.elements = {};
            this.state = {
                isRegionSelectorOpen: false,
                isRoomCodeInputActive: false,
            };
            this.hideTimeout = null;
        }

        init() {
            this.createUI();
            this.attachEventListeners();
            this.updateServerInfo();
            setInterval(() => this.updateServerInfo(), CONFIG.updateInterval);
        }

        createUI() {
            this.elements = {
                container: util.createElement('div', {
                    id: 'server-info-container',
                    style: `
                        position: absolute;
                        top: 0px;
                        right: 0px;
                        display: flex;
                        align-items: center;
                        z-index: 1000;
                        opacity: 0;
                    `
                }),
                switcherContainer: util.createElement('div', {
                    id: 'region-switcher-container',
                    style: `
                        position: relative;
                        display: flex;
                        align-items: center;
                        margin-right: 10px;
                    `
                }),
                switcherButton: util.createElement('button', {
                    id: 'region-switcher',
                    innerHTML: `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30">
                            <path fill="#00ffff" d="M0 96C0 43 43 0 96 0L384 0l32 0c17.7 0 32 14.3 32 32l0 320c0 17.7-14.3 32-32 32l0 64c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0L96 512c-53 0-96-43-96-96L0 96zM64 416c0 17.7 14.3 32 32 32l256 0 0-64L96 384c-17.7 0-32 14.3-32 32zM247.4 283.8c-3.7 3.7-6.2 4.2-7.4 4.2s-3.7-.5-7.4-4.2c-3.8-3.7-8-10-11.8-18.9c-6.2-14.5-10.8-34.3-12.2-56.9l63 0c-1.5 22.6-6 42.4-12.2 56.9c-3.8 8.9-8 15.2-11.8 18.9zm42.7-9.9c7.3-18.3 12-41.1 13.4-65.9l31.1 0c-4.7 27.9-21.4 51.7-44.5 65.9zm0-163.8c23.2 14.2 39.9 38 44.5 65.9l-31.1 0c-1.4-24.7-6.1-47.5-13.4-65.9zM368 192a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM145.3 208l31.1 0c1.4 24.7 6.1 47.5 13.4 65.9c-23.2-14.2-39.9-38-44.5-65.9zm31.1-32l-31.1 0c4.7-27.9 21.4 51.7 44.5 65.9c-7.3 18.3-12 41.1-13.4 65.9zm56.1-75.8c3.7-3.7 6.2-4.2 7.4-4.2s3.7 .5 7.4 4.2c3.8 3.7 8 10 11.8 18.9c6.2 14.5 10.8 34.3 12.2 56.9l-63 0c1.5-22.6 6-42.4 12.2-56.9c3.8-8.9 8-15.2 11.8-18.9z"/>
                        </svg>
                    `,
                    style: `
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 5px;
                        display: flex;
                        align-items: center;
                    `
                }),
                roomCodeInput: util.createElement('input', {
                    type: 'text',
                    placeholder: 'Enter room code',
                    style: `
                        position: absolute;
                        top: 50%;
                        right: 0;
                        transform: translateY(-50%);
                        width: 0;
                        padding: 5px;
                        border: #05ffff solid;
                        border-width: 2px;
                        border-radius: 5px;
                        background-color: #003a3a;
                        color: #05ffff;
                        font-family: 'Arial', sans-serif;
                        font-size: 14px;
                        transition: width 0.3s ease-out, opacity 0.3s ease-out;
                        opacity: 0;
                        outline: none;
                    `
                }),
                infoDiv: util.createElement('div', {
                    id: 'server-info',
                    style: `
                        background-color: #003a3a;
                        border-radius: 5px;
                        padding: 3px 6px;
                        border: #05ffff solid;
                        border-width: 2px;
                        border-radius: 0 0 0 5px;
                        color: #05ffff;
                        font-family: 'Arial Black', sans-serif;
                        font-size: 14px;
                        user-select: none;
                        cursor: pointer;
                    `
                }),
                regionOptions: []
            };

            this.createRegionOptions();

            this.elements.switcherContainer.append(this.elements.switcherButton, this.elements.roomCodeInput);
            this.elements.container.append(this.elements.switcherContainer, this.elements.infoDiv);
            document.body.appendChild(this.elements.container);
        }

        createRegionOptions() {
            CONFIG.regions.forEach((region, index) => {
                const option = util.createElement('div', {
                    textContent: region,
                    style: `
                        position: absolute;
                        right: -70px;
                        top: 50%;
                        transform: translateY(-50%) translateX(0);
                        padding: 5px;
                        cursor: pointer;
                        color: #05ffff;
                        background: rgba(0, 58, 58, 0.7);
                        backdrop-filter: blur(5px);
                        border: 1px solid rgba(5, 255, 255, 0.3);
                        border-radius: 5px;
                        opacity: 0;
                        transition: opacity 0.3s ease-out, transform 0.3s ease-out;
                        z-index: ${1000 - index};
                        width: 70px;
                        text-align: center;
                    `
                });
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.switchRegion(index);
                });
                this.elements.switcherContainer.appendChild(option);
                this.elements.regionOptions.push(option);
            });
        }

        attachEventListeners() {
            this.elements.infoDiv.addEventListener('click', () => this.copyRoomLink());
            this.elements.switcherContainer.addEventListener('mouseenter', () => this.handleContainerMouseEnter());
            this.elements.switcherContainer.addEventListener('mouseleave', () => this.handleContainerMouseLeave());
            this.elements.switcherButton.addEventListener('click', (e) => this.handleSwitcherButtonClick(e));
            this.elements.roomCodeInput.addEventListener('keydown', (e) => this.handleRoomCodeInputKeydown(e));
            document.addEventListener('click', (e) => this.handleDocumentClick(e));
        }

        updateServerInfo() {
            const roomCode = network.roomID ? `#${network.roomID}` : 'Not in a room';
            const region = util.getRegion();

            if (typeof localPlayer === 'undefined' || localPlayerID === 0) {
                this.elements.infoDiv.innerHTML = `Room: ${roomCode}<br>Region: ${region}`;
                this.elements.container.style.cssText += `
                    transition: opacity ease-in 0.25s;
                    transition-delay: 0.3s;
                    opacity: 1;
                `;
            } else {
                this.elements.container.style.cssText += `
                    transition: none;
                    opacity: 0;
                `;
            }
        }

        switchRegion(index) {
            const newRegion = CONFIG.regions[index];
            const newCC = CONFIG.countryCodes[newRegion];

            countryCode = newCC;
            window.localStorage.wingsCC = newCC;
            window.localStorage.wingsCCTime = Date.now();

            network.disconnect();
            setTimeout(() => network.getServerAndConnect(), CONFIG.switchDelay);

            hud.showTip(`Switched to region: ${newRegion}`, CONFIG.tipDuration);
        }

        toggleRegions() {
            this.state.isRegionSelectorOpen = !this.state.isRegionSelectorOpen;
            this.state.isRegionSelectorOpen ? this.showRegions() : this.hideRegions();
        }

        showRegions() {
            clearTimeout(this.hideTimeout);
            this.elements.regionOptions.forEach((option, index) => {
                option.style.cssText += `
                    opacity: 1;
                    transform: translateY(-50%) translateX(${-120 - index * 90}px);
                `;
            });
        }

        hideRegions() {
            this.elements.regionOptions.forEach((option) => {
                option.style.cssText += `
                    opacity: 0;
                    transform: translateY(-50%) translateX(-80%);
                `;
            });
        }

        showRoomCodeInput() {
            this.state.isRoomCodeInputActive = true;
            this.elements.roomCodeInput.style.cssText += `
                width: 120px;
                opacity: 1;
                pointer-events: auto;
            `;
            this.elements.switcherButton.style.cssText += `
                opacity: 0;
                pointer-events: none;
            `;
            this.elements.roomCodeInput.focus();
            this.hideRegions();
        }

        hideRoomCodeInput() {
            this.state.isRoomCodeInputActive = false;
            this.elements.roomCodeInput.style.cssText += `
                width: 0;
                opacity: 0;
                pointer-events: none;
            `;
            this.elements.switcherButton.style.cssText += `
                opacity: 1;
                pointer-events: auto;
            `;
            this.showRegions();
        }

        connectToRoom(roomCode) {
            if (roomCode) {
                network.disconnect();
                setTimeout(() => {
                    window.location.hash = roomCode;
                    network.getServerAndConnect();
                }, CONFIG.switchDelay);
                hud.showTip(`Connecting to room: ${roomCode}`, CONFIG.tipDuration);
                this.updateServerInfo();
            }
        }

        copyRoomLink() {
            const roomCode = network.roomID ? `#${network.roomID}` : '';
            const url = `http://powerline.io/${roomCode}`;
            navigator.clipboard.writeText(url)
                .then(() => console.log('Copied to clipboard:', url))
                .catch(err => console.error('Failed to copy to clipboard:', err));
        }

        handleContainerMouseEnter() {
            clearTimeout(this.hideTimeout);
            if (!this.state.isRegionSelectorOpen && !this.state.isRoomCodeInputActive) {
                this.showRegions();
            }
        }

        handleContainerMouseLeave() {
            if (!this.state.isRegionSelectorOpen && !this.state.isRoomCodeInputActive) {
                this.hideTimeout = setTimeout(() => this.hideRegions(), CONFIG.hideDelay);
            }
        }

        handleSwitcherButtonClick(e) {
            e.stopPropagation();
            this.state.isRoomCodeInputActive ? this.hideRoomCodeInput() : this.showRoomCodeInput();
        }

        handleRoomCodeInputKeydown(e) {
            if (e.key === 'Enter') {
                this.connectToRoom(this.elements.roomCodeInput.value);
                this.hideRoomCodeInput();
            } else if (e.key === 'Escape') {
                this.hideRoomCodeInput();
            }
        }

        handleDocumentClick(e) {
            if (!this.elements.switcherContainer.contains(e.target)) {
                if (this.state.isRegionSelectorOpen) {
                    this.toggleRegions();
                }
                if (this.state.isRoomCodeInputActive) {
                    this.hideRoomCodeInput();
                }
            }
        }
    }

    // Initialize the ServerSwitcher when the game is ready
    util.waitForGame(() => new ServerSwitcher().init());
})();