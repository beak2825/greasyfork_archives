// ==UserScript==
// @name         Custom Volume Slider with Recording Buttons
// @namespace    http://tampermonkey.net/
// @author       luna__mae
// @license      GNU GPLv3
// @version      2.7.2
// @description  Add custom volume slider and recording buttons to the sidebar on fishtank.live and keep original controls hidden
// @homepageURL  https://github.com/luna-mae/ClippingTools
// @namespace    https://github.com/luna-mae/ClippingTools
// @icon         https://raw.githubusercontent.com/luna-mae/ClippingTools/refs/heads/main/media/logo.png
// @supportURL   https://x.com/luna__mae
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/515300/Custom%20Volume%20Slider%20with%20Recording%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/515300/Custom%20Volume%20Slider%20with%20Recording%20Buttons.meta.js
// ==/UserScript==

setTimeout(() => {
    (function() {
        'use strict';

        const style = document.createElement('style');
        style.innerHTML = `
            .livepeer-video-player_livepeer-video-player__NRXYi .livepeer-video-player_controls__y36El .livepeer-video-player_volume-controls__q9My4,
            .livepeer-video-player_livepeer-video-player__NRXYi .livepeer-video-player_controls__y36El .livepeer-video-player_clipping__GlB4S {
                visibility: hidden;
                display: flex;
                align-items: center;
                width: 100%;
                background-color: #191d21;
                font-size: 14px;
                border-radius: 4px;
                border: 1px solid #505050;
            }

            .luna-menu {
                top: 10px;
                left: 10px;
                background: rgba(25, 29, 33, 1);
                color: white;
                padding: 0px;
                font-size: 14px;
                border-radius: 4px;
                z-index: 5;
                border: 1px solid #505050;
                cursor: default;
            }
            .luna-menu.collapsed #main-menu {
                display: none;
            }
            .luna-menu.collapsed .luna-menu_title {
                border-bottom: none;
            }
            .luna-menu_title {
                font-weight: bold;
                padding: 4px 8px;
                cursor: pointer;
                margin-bottom: 0px;
                background: rgba(116, 7, 0, 1);
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                border-bottom: 1px solid #505050;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .luna-menu_title:hover {
                background-color: #a70a00;
            }
            .luna-menu_item {
                margin: 5px 0;
                padding: 3px;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            .luna-menu_item:hover {
                background-color: hsla(0, 0%, 100%, .1);
                color: #f8ec94;
            }
            .luna-hide-scan_lines::after {
                content: none !important;
            }
            .luna-checkbox {
                appearance: none;
                margin-right: 5px;
                width: 20px;
                height: 20px;
                background-color: #303438;
                border: 2px solid black;
                border-radius: 3px;
                position: relative;
            }
            .luna-checkbox:checked {
                background-color: rgba(116, 7, 0, 1);
            }
            .luna-checkbox:checked::after {
                content: '';
                position: absolute;
                left: 3px;
                top: 3px;
                width: 10px;
                height: 10px;
                background-color: #f8ec94;
            }
            .luna-checkbox input:checked + .luna-checkbox::after {
                display: block;
            }
            #toggle-icon {
                transition: transform 0.5s, filter 0.9s;
                --drop-shadow: drop-shadow(2px 3px 0 #000000);
                filter: var(--drop-shadow);
            }
            .luna-menu_title svg {
                margin-left: -3px;
                color: #f8ec94;
            }
            .menu-title-text {
                flex-grow: 1;
                margin-left: 4px;
                padding-left: 0px;
            }
            #toggle-icon {
                transition: transform 0.5s, filter 0.9s;
                --drop-shadow: drop-shadow(2px 3px 0 #000000);
                filter: var(--drop-shadow);
            }
            #custom-volume-slider input[type="range"] {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 8px;
                background: linear-gradient(to right, #740700 0%, #740700 var(--value), #555 var(--value), #555 100%);
                border-radius: 5px;
                outline: none;
            }

            #custom-volume-slider input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 1px solid #505050;
                background: #740700;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            }

            #custom-volume-slider input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 1px solid #505050;
                background: #740700;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            }

            #custom-volume-slider input[type="range"]:hover {
                background: linear-gradient(to right, #740700 0%, #740700 var(--value), #555 var(--value), #555 100%);
            }
            .custom-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: rgba(25, 29, 33, 1);
                color: #fff;
                padding: 15px;
                border-radius: 5px;
                border: 4px solid #f8ec94;            
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .custom-toast-message {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .custom-toast-icon svg {
                fill: #fff;
            }
            .custom-toast-close {
                margin-left: auto;
            }          
            .custom-close-button {
                background: none;
                border: none;
                cursor: pointer;
            }
            .custom-close-button svg {
                fill: #fff;
            }                             
        `;
        document.head.appendChild(style);

        let blockQualityCheckbox;
   
        const initialDelay = 1000;
        const updateCheckInterval = 300000;
        const currentVersion = '2.7.2';

        const checkForUpdates = async () => {
            try {
                const proxyUrl = 'https://corsproxy.io/?';
                const targetUrl = 'https://update.greasyfork.org/scripts/515300/Clipping%20Tools%2B%2Bmeta.js';
        
                const response = await fetch(proxyUrl + targetUrl);
        
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status ${response.status}`);
                }
        
                const meta = await response.text();
                const versionMatch = meta.match(/@version\s+(\d+\.\d+\.\d+)/);
                if (versionMatch) {
                    const latestVersion = versionMatch[1];
        
                    if (latestVersion !== currentVersion) {
                        displayUpdateToast(latestVersion);
                    }
                }
            } catch (error) {
                console.error('Update check error:', error);
            }
        };
        
        const displayUpdateToast = (latestVersion) => {
            const toast = document.createElement('div');
            toast.className = 'custom-toast';
            toast.innerHTML = `
                <div class="custom-toast-message">
                <div class="custom-toast-icon">
                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15 6H17V8H15V6ZM13 10V8H15V10H13ZM11 12V10H13V12H11ZM9 14V12H11V14H9ZM7 16V14H9V16H7ZM5 16H7V18H5V16ZM3 14H5V16H3V14ZM3 14H1V12H3V14ZM11 16H13V18H11V16ZM15 14V16H13V14H15ZM17 12V14H15V12H17ZM19 10V12H17V10H19ZM21 8H19V10H21V8ZM21 8H23V6H21V8Z" fill="#f8ec94"></path>
                    </svg>                    
                </div>
                    <span>New Livestream Controls version available: ${latestVersion} <a href="https://greasyfork.org/scripts/515300" target="_blank">Update now</a></span>
                    <div class="custom-toast-close">
                        <button class="custom-close-button" type="button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3H3v18h18V3H5zm14 2v14H5V5h14zm-8 4H9V7H7v2h2v2h2v2H9v2H7v2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2v-2h2V9h2V7h-2v2h-2v2h-2V9z" fill="currentColor"></path>
                        </svg>
                        </button>
                    </div>
                </div>
            `;
        
            document.body.appendChild(toast);
        
            const closeButton = toast.querySelector('.custom-close-button');
            closeButton.addEventListener('click', () => {
                toast.remove();
            });
        };
        

        setTimeout(() => {
            checkForUpdates();
        }, initialDelay);
        
        setInterval(() => {
            checkForUpdates();
        }, updateCheckInterval);

        function createVolumeSliderWithRecording() {
            const container = document.createElement('div');
            container.id = 'custom-volume-slider';
            container.classList.add('luna-menu');
            container.style.color = '#fff';

            const header = document.createElement('div');
            header.classList.add('luna-menu_title');
            header.style.marginBottom = '0px';

            header.innerHTML = `
                <svg id="toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19 8H5V10H7V12H9V14H11V16H13V14H15V12H17V10H19V8Z" fill="#f8ec94"></path>
                </svg><span class="menu-title-text">Livestream Controls</span>
            `;

            container.appendChild(header);

            const content = document.createElement('div');
            content.style.display = 'none';

            const sliderLabel = document.createElement('span');
            sliderLabel.innerText = 'Volume:';
            sliderLabel.style.marginRight = '10px';
            sliderLabel.style.marginTop = '5px';
            sliderLabel.style.marginLeft = '5px';

            const volumeSlider = document.createElement('input');
            volumeSlider.type = 'range';
            volumeSlider.min = '0.00001';
            volumeSlider.max = '1';
            volumeSlider.step = '0.01';
            volumeSlider.value = '1';
            volumeSlider.style.background = '#740700';
            volumeSlider.style.border = '1px solid #505050';
            volumeSlider.style.flex = '1';
            volumeSlider.style.marginRight = '5px';
            volumeSlider.classList.add('custom-volume-slider');

            volumeSlider.addEventListener('input', function() {
                const videoElement = document.querySelector('video[data-livepeer-video]');
                if (videoElement) {
                    videoElement.volume = this.value;
                    videoElement.setAttribute('data-livepeer-volume', Math.round(this.value * 100));
                    console.log(`Volume set to ${this.value}`);
                }
                this.style.background = `linear-gradient(to right, #740700 ${this.value * 100}%, #555 ${this.value * 100}%)`;
            });

            volumeSlider.style.background = `linear-gradient(to right, #740700 ${volumeSlider.value * 100}%, #555 ${volumeSlider.value * 100}%)`;

            const volumeContainer = document.createElement('div');
            volumeContainer.style.display = 'flex';
            volumeContainer.style.alignItems = 'center';
            volumeContainer.style.width = '100%';

            volumeContainer.appendChild(sliderLabel);
            volumeContainer.appendChild(volumeSlider);

            const recordingContainer = document.createElement('div');
            recordingContainer.style.display = 'flex';
            recordingContainer.style.justifyContent = 'space-between';
            recordingContainer.style.width = '100%';
            recordingContainer.style.marginTop = '10px';

            const startButton = document.createElement('button');
            startButton.innerText = 'Start Recording';
            startButton.style.marginRight = '0px';
            startButton.style.padding = '10px';
            startButton.style.flex = '1';
            startButton.style.fontSize= '10px';
            startButton.style.backgroundColor = '#303438';
            startButton.style.border = '2px solid black';
            startButton.style.borderRight = '1px solid black';
            startButton.style.color = '#fff';
            startButton.style.cursor = 'pointer';

            startButton.addEventListener('mouseover', function() {
                startButton.style.color = '#f8ec94';
            });

            startButton.addEventListener('mouseout', function() {
                startButton.style.color = '#fff';
            });

            const lastMinuteButton = document.createElement('button');
            lastMinuteButton.innerText = 'Record Last Minute';
            lastMinuteButton.style.padding = '0px';
            lastMinuteButton.style.flex = '1';
            lastMinuteButton.style.fontSize= '10px';            
            lastMinuteButton.style.backgroundColor = '#303438';
            lastMinuteButton.style.border = '2px solid black';
            lastMinuteButton.style.borderLeft = '1px solid black';
            lastMinuteButton.style.color = '#fff';
            lastMinuteButton.style.cursor = 'pointer';

            lastMinuteButton.addEventListener('mouseover', function() {
                lastMinuteButton.style.color = '#f8ec94';
            });

            lastMinuteButton.addEventListener('mouseout', function() {
                lastMinuteButton.style.color = '#fff';
            });

            content.appendChild(volumeContainer);
            recordingContainer.appendChild(startButton);
            recordingContainer.appendChild(lastMinuteButton);
            content.appendChild(recordingContainer);

            const menuItem = document.createElement('div');
            menuItem.classList.add('luna-menu_item');

            blockQualityCheckbox = document.createElement('input');
            blockQualityCheckbox.type = 'checkbox';
            blockQualityCheckbox.id = 'block-quality-checkbox';
            blockQualityCheckbox.classList.add('luna-checkbox');
            blockQualityCheckbox.style.marginTop = '5px';
            blockQualityCheckbox.style.marginLeft = '5px';

            const blockQualityLabel = document.createElement('label');
            blockQualityLabel.htmlFor = 'block-quality-checkbox';
            blockQualityLabel.innerText = 'Block Quality';
            blockQualityLabel.style.marginLeft = '3px';

            menuItem.appendChild(blockQualityCheckbox);
            menuItem.appendChild(blockQualityLabel);

            content.appendChild(menuItem);

            const isChecked = localStorage.getItem('blockQualityCheckbox') === 'true';
            blockQualityCheckbox.checked = isChecked;

            blockQualityCheckbox.addEventListener('change', () => {
                localStorage.setItem('blockQualityCheckbox', blockQualityCheckbox.checked);
            });                  

            volumeSlider.addEventListener('input', function() {
                const volumeInput = document.querySelector('.hls-stream-player_slider__1Okj6 input[type="range"]');
                if (volumeInput) {
                    volumeInput.value = this.value;
                    volumeInput.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log(`Volume set to ${this.value}`);
                }
            });

            let isRecording = false;
            startButton.addEventListener('click', function() {
                const event = new KeyboardEvent('keydown', {
                    key: 'c',
                    code: 'KeyC',
                    ctrlKey: false,
                    shiftKey: false,
                    altKey: false,
                    metaKey: false,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(event);

                isRecording = !isRecording;
                startButton.innerText = isRecording ? 'Stop Recording' : 'Start Recording';
                if (isRecording) {
                    startButton.style.backgroundColor = '#740700';
                    startButton.style.color = '#f8ec94';
                } else {
                    startButton.style.backgroundColor = '#555';
                    startButton.style.color = '#fff';
                }
            });

            lastMinuteButton.addEventListener('click', function() {
                const event = new KeyboardEvent('keydown', {
                    key: 'c',
                    code: 'KeyC',
                    ctrlKey: false,
                    shiftKey: true,
                    altKey: false,
                    metaKey: false,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(event);
            });

            container.appendChild(content);

            const toggleIcon = header.querySelector('#toggle-icon');

            header.addEventListener('click', function() {
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }

                const isCollapsed = content.style.display === 'none';
                toggleIcon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
                toggleIcon.style.setProperty('--drop-shadow', isCollapsed ? 'drop-shadow(2px 3px 0 #000000)' : 'drop-shadow(-2px -3px 0 #000000)');
            });


            return container;
        }

        function moveControls() {
            const sidebar = document.querySelector('.home_left__UiQ0z');
            const adsDiv = document.querySelector('.item-generator_item-generator__TCQ9l');

            if (!sidebar || !adsDiv) {
                console.log("Sidebar or Ads div not found. Retrying...");
                return;
            }

            let customSlider = document.getElementById('custom-volume-slider');
            if (!customSlider) {
                customSlider = createVolumeSliderWithRecording();
                sidebar.insertBefore(customSlider, adsDiv);
            }

            const volumeControls = document.querySelector('.hls-stream-player_volume__Ucryi');
            if (volumeControls && !volumeControls.classList.contains('moved')) {
                console.log("Moving volume controls...");
                volumeControls.classList.add('moved');
                volumeControls.style.display = 'none';
            }

            const clippingControls = document.querySelector('.live-stream-clipping_live-stream-clipping__xkFfU ');
            if (clippingControls && !clippingControls.classList.contains('moved')) {
                console.log("Moving clipping controls...");
                clippingControls.classList.add('moved');
                clippingControls.style.display = 'none';
            }

            hideQualityButton();
        }

        function hideQualityButton() {
            const qualityDiv = document.querySelector('.hls-stream-player_quality__RdZRA');
            if (blockQualityCheckbox.checked && qualityDiv) {
                qualityDiv.style.display = 'none';
                console.log("Quality button hidden.");
            } else if (qualityDiv) {
                qualityDiv.style.display = 'block';
            }
        }

        const blockQualityState = JSON.parse(localStorage.getItem('block-quality-checkbox')) || false;

        setInterval(moveControls, 100);

        blockQualityCheckbox.checked = blockQualityState;

        blockQualityCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;
            localStorage.setItem('block-quality-checkbox', JSON.stringify(isChecked));
            hideQualityButton();
        });

        setInterval(hideQualityButton, 100);

    })();
}, 1000);
