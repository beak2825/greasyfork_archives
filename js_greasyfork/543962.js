// ==UserScript==
// @name YouTube Enhanced
// @namespace http://tampermonkey.net/
// @version 1.30
// @description Custom volume control, rewind/fast forward buttons, enhanced YouTube player styles, and quick speed adjustment interface.
// @match *://*.youtube.com/watch*
// @match *://*.youtube.com/live*
// @grant none
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/js/all.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543962/YouTube%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/543962/YouTube%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // *** YouTube Enhanced Controls - Start ***

    const timestyle = document.createElement('style');
    timestyle.textContent =`
.ytp-left-controls {align-items: center;max-width: fit-content;}
.ytp-right-controls {padding: 0 4px 0 16px !important;}
.ytp-button {margin-top: 0px !important;}
.ytp-volume-area {display: none !important;}
.ytp-time-display {display:flex !important;}
.ytp-chrome-controls {justify-content: space-between;}

#custom-volume-buttons {
 display: flex;
 align-items: center;
 justify-content: center;
 height: 48px;
 min-width: 130px;
}
#custom-volume-buttons,
.custom-controls-container,
.ytp-time-wrapper,
.skipButtonControlBarContainer,
.ytp-chapter-title,
.ytp-play-button,
.ytp-prev-button,
.ytp-next-button,
.ytp-right-controls
{
 backdrop-filter: none !important;
 background: none !important;
}
.html5-video-player:not(.ytp-autohide)
.ytp-left-controls,
.html5-video-player:not(.ytp-autohide)
.ytp-right-controls {
    backdrop-filter: blur(2px) !important;
    background: rgba(0,0,0,.3) !important;
}

/* Ocultar controles personalizados cuando YouTube entra en autohide */
.html5-video-player.ytp-autohide
.ytp-rewind-button,
.html5-video-player.ytp-autohide
.ytp-fastforward-button,
.html5-video-player.ytp-autohide
.ytp-configure-button,
.html5-video-player.ytp-autohide
#custom-volume-buttons {
    opacity: 0 !important;
    pointer-events: none !important;
}

/* Mostrar controles personalizados cuando el player está activo */
.html5-video-player:not(.ytp-autohide)
.ytp-rewind-button,
.html5-video-player:not(.ytp-autohide)
.ytp-fastforward-button,
.html5-video-player:not(.ytp-autohide)
.ytp-configure-button,
.html5-video-player:not(.ytp-autohide)
#custom-volume-buttons {
    opacity: 1 !important;
    pointer-events: auto !important;
}


.ytp-left-controls {
	margin-top: var(--yt-delhi-pill-top-height,12px) !important;
	height: var(--yt-delhi-pill-height,48px) !important;
	border-radius: 28px !important;
}
.ytp-progress-bar-container {z-index: 0 !important;}
div.ytp-chapter-container:nth-child(9) {display: flex;align-items: center;padding-top: unset !important;}
`;
    document.head.appendChild(timestyle);

    // Volume Control Functions
    function updateVolumeDisplay(volume) {
        const volumeDisplay = document.querySelector('#volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
            volumeDisplay.style.color = volume === 0 ? 'red' : 'white';
        }
    }

    function showVolumeChangeOnScreen(volume) {
        let volumeDisplay = document.querySelector('#ytp-video-volume');
        if (!volumeDisplay) {
            volumeDisplay = document.createElement('div');
            volumeDisplay.id = 'ytp-video-volume';
            Object.assign(volumeDisplay.style, {
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                textAlign: 'center',
                background: 'rgba(0,0,0,.5)',
                color: '#eee',
                fontSize: '175%',
                zIndex: '19',
                padding: '10px 20px',
                borderRadius: '3%'
            });
            const playerContainer = document.querySelector('.html5-video-player');
            playerContainer.appendChild(volumeDisplay);
        }

        volumeDisplay.textContent = `${volume}%`;
        volumeDisplay.style.display = 'block';

        clearTimeout(volumeDisplay.timeout);
        volumeDisplay.timeout = setTimeout(() => {
            volumeDisplay.style.display = 'none';
        }, 1000);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            setTimeout(() => {
                const player = document.getElementById('movie_player');
                if (player) {
                    const volume = player.getVolume();
                    updateVolumeDisplay(volume / 100);
                    saveVolume(volume);
                }
            }, 50);
        }
    });

    function createVolumeButtons() {
        const leftControls = document.querySelector('.ytp-left-controls');
        if (!leftControls || document.querySelector('#custom-volume-buttons')) return;

        const muteButton = document.querySelector('.ytp-mute-button');
        const volumeSlider = document.querySelector('.ytp-volume-panel');
        if (muteButton) muteButton.style.display = 'none';
        if (volumeSlider) volumeSlider.style.display = 'none';

        const style = document.createElement('style');
        style.textContent = `
            .button-base {
                font-size: 19px;
                color: white;
                background-color: transparent;
                border: none;
                cursor: pointer;
                transition: background-color 0.3s ease, color 0.3s ease;
                width: 32px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
            }

            .button-hover {
                background-color: rgba(211, 211, 211, 0.4) !important;
            }
        `;
        document.head.appendChild(style);

        const volumeButtonContainer = document.createElement('div');
        volumeButtonContainer.id = 'custom-volume-buttons';

        const buttons = [
            {
                id: 'volume-down',
                icon: '<i class="fa-solid fa-volume-low"></i>',
                onClick: () => adjustVolume(-25)
            },
            {
                id: 'volume-display',
                text: '100%',
                onClick: toggleMute,
                width: '50px',
                marginRight: '4px',
            },
            {
                id: 'volume-up',
                icon: '<i class="fa-solid fa-volume-high"></i>',
                onClick: () => adjustVolume(25)
            }
        ];

        let volumeDownInterval;
        let volumeUpInterval;

        function startVolumeDown() {
            volumeDownInterval = setInterval(() => adjustVolume(-5), 200);
        }

        function stopVolumeDown() {
            clearInterval(volumeDownInterval);
        }

        function startVolumeUp() {
            volumeUpInterval = setInterval(() => adjustVolume(5), 200);
        }

        function stopVolumeUp() {
            clearInterval(volumeUpInterval);
        }

        buttons.forEach(({ id, icon, text, onClick, width, marginRight, marginTop }) => {
            const btn = document.createElement('button');
            btn.id = id;
            btn.className = 'button-base';
            btn.innerHTML = icon || text;
            if (width) btn.style.width = width;
            if (marginRight) btn.style.marginRight = marginRight;
            if (marginTop) btn.style.marginTop = marginTop;
            btn.onmouseover = () => btn.classList.add('button-hover');
            btn.onmouseout = () => btn.classList.remove('button-hover');

            if (id === 'volume-down' || id === 'volume-up') {
                let longPress = false;
                let pressTimer;
                btn.onmousedown = () => {
                    longPress = false;
                    pressTimer = setTimeout(() => {
                        longPress = true;
                        if (id === 'volume-down') startVolumeDown();
                        else if (id === 'volume-up') startVolumeUp();
                    }, 200);
                };
                btn.onmouseup = () => {
                    clearTimeout(pressTimer);
                    if (id === 'volume-down') {
                        stopVolumeDown();
                        if (!longPress) adjustVolume(-25);
                    } else if (id === 'volume-up') {
                        stopVolumeUp();
                        if (!longPress) adjustVolume(25);
                    }
                };
                btn.onmouseleave = () => {
                    clearTimeout(pressTimer);
                    if (id === 'volume-down') stopVolumeDown();
                    else if (id === 'volume-up') stopVolumeUp();
                };
            } else {
                btn.onclick = onClick;
            }
            volumeButtonContainer.appendChild(btn);
        });

        const timeDisplay = leftControls.querySelector('.ytp-time-display.notranslate');

        if (timeDisplay) {
            leftControls.insertBefore(volumeButtonContainer, timeDisplay);
        } else {
            leftControls.appendChild(volumeButtonContainer);
        }
    }

    function adjustVolume(amount) {
        const player = document.getElementById('movie_player');
        if (player) {
            let volume = player.getVolume();
            volume = Math.min(100, Math.max(0, volume + amount));
            player.setVolume(volume);
            updateVolumeDisplay(volume / 100);
            showVolumeChangeOnScreen(volume);
            saveVolume(volume);
        }
    }

    function toggleMute() {
        // Simular tecla M (mute nativo de YouTube)
        const event = new KeyboardEvent('keydown', {
            key: 'm',
            code: 'KeyM',
            keyCode: 77,
            which: 77,
            bubbles: true
        });
        document.dispatchEvent(event);

        // Esperar a que YouTube procese el cambio
        setTimeout(syncMuteDisplay, 50);
    }

    function syncMuteDisplay() {
        const ytPlayer = document.getElementById('movie_player');
        const volumeDisplay = document.querySelector('#volume-display');

        if (!ytPlayer || !volumeDisplay) return;

        const isMuted = ytPlayer.isMuted();

        if (isMuted) {
            volumeDisplay.textContent = '0%';
            volumeDisplay.style.color = 'red';
        } else {
            const volume = ytPlayer.getVolume(); // 0–100
            volumeDisplay.textContent = `${volume}%`;
            volumeDisplay.style.color = 'white';
        }
    }

    function saveVolume(volume) {
        const volumeData = { data: { volume } };
        localStorage.setItem('yt-player-volume', JSON.stringify(volumeData));
        sessionStorage.setItem('yt-player-volume', JSON.stringify(volumeData));
    }

    function ensureVideoLoaded() {
        const player = document.getElementById('movie_player');
        if (player) {
            createVolumeButtons();
            const storedVolume = JSON.parse(localStorage.getItem('yt-player-volume'));
            if (storedVolume?.data?.volume !== undefined) {
                const volume = storedVolume.data.volume;
                player.setVolume(volume);
                updateVolumeDisplay(volume / 100);
            }
        }
    }

    // Rewind & Fast Forward Buttons and YT Styles
    let rewindSeconds = parseInt(localStorage.getItem('rewindSeconds')) || 10;
    if (isNaN(rewindSeconds)) rewindSeconds = 10;
    let fastForwardSeconds = parseInt(localStorage.getItem('fastForwardSeconds')) || 10;
    if (isNaN(fastForwardSeconds)) fastForwardSeconds = 10;

    let menuOpen = false;
    let buttonRect; // Variable global para almacenar la posición del botón

    function addControls() {
        if (document.querySelector('.ytp-rewind-button') || document.querySelector('.ytp-fastforward-button')) {
            return;
        }

        var rightControls = document.querySelector('.ytp-right-controls');
        var leftControls = document.querySelector('.ytp-left-controls');
        var timedisplay = document.querySelector('.ytp-time-display');

        if (rightControls && leftControls) {

            var rewindButton = document.createElement('button');
            rewindButton.classList.add('ytp-rewind-button');
            rewindButton.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                      <svg width="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
                                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                      <g id="SVGRepo_iconCarrier">
                                      <path d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z" fill="#ffffff"></path></g>
                                      </svg>
                                      <span style="color: white; font-size: 14px;">${rewindSeconds}s</span>
                                      </div>`;

            rewindButton.title = `Rewind ${rewindSeconds} seconds`;

            let rewindTimer; // Variable para almacenar el temporizador de repetición
            let rewindDelayTimer; // Temporizador para el retraso

            rewindButton.addEventListener('mousedown', function() {
                var player = document.querySelector('.video-stream');
                if (player) {
                    player.currentTime -= rewindSeconds; // Rebobinar inmediatamente
                    showFeedback(`-${rewindSeconds}s`, 'left');
                }

                // Empezamos a esperar medio segundo antes de repetir el clic
                rewindDelayTimer = setTimeout(function() {
                    // Una vez pasado el tiempo de espera, comenzamos a repetir la acción
                    rewindTimer = setInterval(function() {
                        if (player) {
                            player.currentTime -= rewindSeconds; // Rebobinar repetidamente
                            showFeedback(`-${rewindSeconds}s`, 'left');
                        }
                    }, 500); // Repite cada 100ms
                }, 500); // Espera medio segundo (500ms)
            });

            rewindButton.addEventListener('mouseup', function() {
                clearTimeout(rewindDelayTimer); // Cancelar el retraso si se suelta el botón antes de 500ms
                clearInterval(rewindTimer); // Detener la repetición cuando se suelta el botón
            });

            rewindButton.addEventListener('mouseleave', function() {
                clearTimeout(rewindDelayTimer); // Cancelar el retraso si el cursor sale del botón
                clearInterval(rewindTimer); // Detener la repetición si el cursor sale del botón
            });

            var configureButton = document.createElement('button');
            configureButton.innerHTML = `<svg height="100%%" fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="-34.03 -34.03 408.33 408.33" xml:space="preserve" stroke="#ffffff" stroke-width="0.00340274">
                                         <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                         <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                                         <g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M293.629,127.806l-5.795-13.739c19.846-44.856,18.53-46.189,14.676-50.08l-25.353-24.77l-2.516-2.12h-2.937 c-1.549,0-6.173,0-44.712,17.48l-14.184-5.719c-18.332-45.444-20.212-45.444-25.58-45.444h-35.765 c-5.362,0-7.446-0.006-24.448,45.606l-14.123,5.734C86.848,43.757,71.574,38.19,67.452,38.19l-3.381,0.105L36.801,65.032 c-4.138,3.891-5.582,5.263,15.402,49.425l-5.774,13.691C0,146.097,0,147.838,0,153.33v35.068c0,5.501,0,7.44,46.585,24.127 l5.773,13.667c-19.843,44.832-18.51,46.178-14.655,50.032l25.353,24.8l2.522,2.168h2.951c1.525,0,6.092,0,44.685-17.516 l14.159,5.758c18.335,45.438,20.218,45.427,25.598,45.427h35.771c5.47,0,7.41,0,24.463-45.589l14.195-5.74 c26.014,11,41.253,16.585,45.349,16.585l3.404-0.096l27.479-26.901c3.909-3.945,5.278-5.309-15.589-49.288l5.734-13.702 c46.496-17.967,46.496-19.853,46.496-25.221v-35.029C340.268,146.361,340.268,144.434,293.629,127.806z M170.128,228.474 c-32.798,0-59.504-26.187-59.504-58.364c0-32.153,26.707-58.315,59.504-58.315c32.78,0,59.43,26.168,59.43,58.315 C229.552,202.287,202.902,228.474,170.128,228.474z"/> </g> </g> </g> </g>
                                         </svg>`;

            configureButton.classList.add('ytp-configure-button');
            configureButton.title = 'Configure the rewind and fast forward duration';

            configureButton.addEventListener('click', function(event) {
                if (menuOpen) {
                    closeConfigureMenu();
                } else {
                    setTimeout(() => {
                        buttonRect = configureButton.getBoundingClientRect();
                        openConfigureMenu();
                    }, 0);
                }
            });

            configureButton.addEventListener('dblclick', closeConfigureMenu);

            var fastForwardButton = document.createElement('button');
            fastForwardButton.classList.add('ytp-fastforward-button');
            fastForwardButton.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                           <svg width="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" transform="rotate(180)">
                                           <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                           <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                           <g id="SVGRepo_iconCarrier">
                                           <path d="M6 14H8L8 9L13 14H15L15 2H13L8 7L8 2H6L0 8L6 14Z" fill="#ffffff"></path></g>
                                           </svg>
                                           <span style="color: white; font-size: 14px;">${fastForwardSeconds}s</span>
                                           </div>`;

            fastForwardButton.title = `Forward ${fastForwardSeconds} seconds`;

            let fastForwardTimer;
            let fastForwardDelayTimer;

            fastForwardButton.addEventListener('mousedown', function() {
                var player = document.querySelector('.video-stream');
                if (player) {
                    player.currentTime += fastForwardSeconds;
                    showFeedback(`+${fastForwardSeconds}s`, 'right');
                }

                fastForwardDelayTimer = setTimeout(function() {
                    fastForwardTimer = setInterval(function() {
                        if (player) {
                            player.currentTime += fastForwardSeconds;
                            showFeedback(`+${fastForwardSeconds}s`, 'right');
                        }
                    }, 500);
                }, 500);
            });

            fastForwardButton.addEventListener('mouseup', function() {
                clearTimeout(fastForwardDelayTimer);
                clearInterval(fastForwardTimer);
            });

            fastForwardButton.addEventListener('mouseleave', function() {
                clearTimeout(fastForwardDelayTimer);
                clearInterval(fastForwardTimer);
            });

            var controlsContainer = document.createElement('div');
            controlsContainer.classList.add('custom-controls-container');
            controlsContainer.style.display = 'flex';
            controlsContainer.style.alignItems = 'center';
            controlsContainer.style.height = '48px';

            controlsContainer.appendChild(rewindButton);
            controlsContainer.appendChild(configureButton);
            controlsContainer.appendChild(fastForwardButton);

            timedisplay.parentNode.insertBefore(controlsContainer, timedisplay);

            const buttonStyle = {
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, color 0.3s ease',
                width: '28px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                margin: '0 1px',
                padding: '0 1px'
            };

            [rewindButton, configureButton, fastForwardButton].forEach(button => {
                Object.assign(button.style, buttonStyle);
            });
        }
    }

    function openConfigureMenu() {
        var modal = document.createElement('div');
        modal.id = 'configure-modal';

        modal.style.position = 'absolute';
        modal.style.top = `${window.scrollY + buttonRect.top - 190}px`;
        modal.style.left = `${window.scrollX + buttonRect.left -75}px`;

        modal.style.backgroundColor = 'rgba(50, 50, 50, 0.9)';
        modal.style.border = '1px solid #ccc';
        modal.style.padding = '15px';
        modal.style.zIndex = '9999';
        modal.style.borderRadius = '5px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        modal.style.width = '150px';

        var rewindRow = document.createElement('div');
        rewindRow.style.display = 'flex';
        rewindRow.style.justifyContent = 'space-between';
        rewindRow.style.marginBottom = '10px';

        var rewindLabel = document.createElement('label');
        rewindLabel.innerText = 'Rewind Seconds:';
        rewindLabel.style.color = '#fff';
        rewindLabel.style.fontSize = '15px';

        var rewindInput = document.createElement('input');
        rewindInput.type = 'number';
        rewindInput.value = rewindSeconds;
        rewindInput.style.textAlign = 'right';
        rewindInput.style.width = '50px';
        rewindInput.min = 1;
        rewindInput.max = 60;
        rewindInput.step = 1;

        rewindRow.appendChild(rewindLabel);
        rewindRow.appendChild(rewindInput);

        var fastForwardRow = document.createElement('div');
        fastForwardRow.style.display = 'flex';
        fastForwardRow.style.justifyContent = 'space-between';
        fastForwardRow.style.marginBottom = '10px';

        var fastForwardLabel = document.createElement('label');
        fastForwardLabel.innerText = 'Fast Forward Seconds:';
        fastForwardLabel.style.color = '#fff';
        fastForwardLabel.style.fontSize = '15px';

        var fastForwardInput = document.createElement('input');
        fastForwardInput.type = 'number';
        fastForwardInput.value = fastForwardSeconds;
        fastForwardInput.style.width = '50px';
        fastForwardInput.style.textAlign = 'right';
        fastForwardInput.min = 1;
        fastForwardInput.max = 60;
        fastForwardInput.step = 1;

        rewindInput.style.height = '24px';
        rewindInput.style.fontSize = '22px';

        fastForwardInput.style.height = '24px';
        fastForwardInput.style.fontSize = '22px';

        rewindInput.style['-webkit-appearance'] = 'none';
        fastForwardInput.style['-webkit-appearance'] = 'none';

        fastForwardRow.appendChild(fastForwardLabel);
        fastForwardRow.appendChild(fastForwardInput);

        var saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.style.marginTop = '10px';
        saveButton.style.width = '100%';
        saveButton.style.textAlign = 'center';
        saveButton.style.cursor = 'pointer';
        saveButton.style.padding = '10px';
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '5px';

        saveButton.addEventListener('click', function() {
            let newRewindSeconds = parseInt(rewindInput.value) || 10;
            let newFastForwardSeconds = parseInt(fastForwardInput.value) || 10;

            if (newRewindSeconds < 1 || newRewindSeconds > 60) {
                alert("Rewind Seconds must be between 1 and 60.");
                return;
            }
            if (newFastForwardSeconds < 1 || newFastForwardSeconds > 60) {
                alert("Fast Forward Seconds must be between 1 and 60.");
                return;
            }

            rewindSeconds = newRewindSeconds;
            fastForwardSeconds = newFastForwardSeconds;
            localStorage.setItem('rewindSeconds', rewindSeconds);
            localStorage.setItem('fastForwardSeconds', fastForwardSeconds);

            document.querySelector('.ytp-rewind-button span').textContent = `${rewindSeconds}s`;
            document.querySelector('.ytp-fastforward-button span').textContent = `${fastForwardSeconds}s`;

            closeConfigureMenu();
        });

        modal.appendChild(rewindRow);
        modal.appendChild(fastForwardRow);
        modal.appendChild(saveButton);

        document.body.appendChild(modal);

        menuOpen = true;

        document.addEventListener('click', closeMenuOnClickOutside);
    }

    function closeConfigureMenu() {
        var modal = document.getElementById('configure-modal');
        if (modal) {
            modal.remove();
        }
        menuOpen = false;
    }

    function closeMenuOnClickOutside(event) {
        const modal = document.getElementById('configure-modal');
        if (modal && !modal.contains(event.target) && !event.target.classList.contains('ytp-configure-button')) {
            closeConfigureMenu();
        }
    }

    function showFeedback(message, position) {
        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        const feedback = document.createElement('div');
        feedback.style.position = 'absolute';
        feedback.style.color = 'white';
        feedback.style.fontSize = '24px';
        feedback.style.fontWeight = 'bold';
        feedback.style.display = 'flex';
        feedback.style.alignItems = 'center';
        feedback.style.gap = '5px';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.padding = '10px';
        feedback.style.borderRadius = '5px';
        feedback.style.zIndex = '9999';
        feedback.style.transform = 'translateY(-50%)';

        feedback.style.top = '50%';
        if (position === 'left') {
            feedback.style.left = '10%';
            feedback.style.flexDirection = 'row-reverse';
        } else if (position === 'right') {
            feedback.style.right = '10%';
            feedback.style.flexDirection = 'row';
        }

        const text = document.createElement('span');
        text.textContent = message;
        feedback.appendChild(text);

        for (let i = 0; i < 3; i++) {
            const arrow = document.createElement('div');
            arrow.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 12L12 22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
            arrow.style.opacity = '0';
            if (position === 'left') {
                arrow.style.animation = `arrowFadeLeft 0.75s ease ${i * 0.1}s forwards`;
            } else if (position === 'right') {
                arrow.style.animation = `arrowFadeRight 0.75s ease ${i * 0.1}s forwards`;
            }
            feedback.appendChild(arrow);
        }

        player.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 500);
    }

    // *** YouTube Enhanced Controls - End ***


    // *** YouTube Quick Speed Interface - Start ***

    // Add speed options
    function addSpeedOptions() {
        // Check if speed options are already added
        if (document.querySelector('.ytp-speed-options')) {
            return;
        }

        var rightControls = document.querySelector('.ytp-right-controls');
        if (rightControls) {
            var speedOptions = document.createElement('div');
            speedOptions.classList.add('ytp-speed-options');
            speedOptions.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            order: 0;
        `;

            var speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
            speeds.forEach(function(speed) {
                var option = document.createElement('div');
                option.innerText = speed;
                option.classList.add('ytp-speed-option');

                // Estilos para centrar y alinear
                option.style.cssText = `
                font-size: 18px;
                width: 25px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-left: 2px;
                margin-right: 2px;
                padding: 0 10px;
                border-radius: 5px;
            `;

                option.addEventListener('click', function () {
                    const player = document.querySelector('.video-stream');
                    if (player) {
                        player.playbackRate = speed;
                        const ytPlayer = document.querySelector('#movie_player');
                        if (ytPlayer) {
                            ytPlayer.setPlaybackRate(speed);
                        }
                        localStorage.setItem('videoSpeed', speed);
                        updateSpeedIndicator();
                        showSpeedNotification(speed);
                    }
                });

                speedOptions.appendChild(option);
            });

            // Append speedOptions directly to rightControls
            rightControls.appendChild(speedOptions);

            // Forzar velocidad inicial a 1x
            const initialPlayer = document.querySelector('.video-stream');
            if (initialPlayer) {
                localStorage.removeItem('videoSpeed');
                initialPlayer.playbackRate = 1.0;
            }
        }
    }

    // Función para mostrar la notificación de velocidad
    function showSpeedNotification(speed) {
        // Eliminar la notificación anterior si existe
        const existingNotification = document.querySelector('.ytp-speed-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Crear la nueva notificación
        const notification = document.createElement('div');
        notification.className = 'ytp-speed-notification';
        notification.innerText = `${speed}x`;
        notification.style.cssText = `
        position: absolute;
        top: 10%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 18px;
        font-weight: normal;
        text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        background-color: rgba(0, 0, 0, 0.7); /* Fondo semi-transparente */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Sombra más suave */
        padding: 8px 16px; /* Padding para que el texto no esté pegado */
        border-radius: 4px; /* Bordes redondeados */
    `;

        // Agregar la notificación al DOM
        document.body.appendChild(notification);

        // Mostrar la notificación
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });

        // Ocultar y eliminar la notificación después de un tiempo
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 200); // Esperar a que termine la transición de opacidad
        }, 500); // 500ms = 0.5 segundos
    }
    // Leer la velocidad guardada al cargar la página
    function updateSpeedIndicator() {
        var player = document.querySelector('.video-stream');
        var currentSpeed = parseFloat(localStorage.getItem('videoSpeed')) || 1.0; // Leer la velocidad guardada o 1x por defecto

        // Establecer la velocidad del reproductor
        if (player) {
            player.playbackRate = currentSpeed;
        }

        // Encontrar y resaltar la opción que coincide con la velocidad actual
        var options = document.querySelectorAll('.ytp-speed-option');
        options.forEach(function(opt) {
            if (parseFloat(opt.innerText) === currentSpeed) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    // Detect playback rate change in all browsers
    function observePlaybackRateChange() {
        const player = document.querySelector('.video-stream');
        if (player) {
            player.addEventListener('ratechange', function() {
                localStorage.setItem('videoSpeed', player.playbackRate); // Guardar la nueva velocidad
                updateSpeedIndicator(); // Actualizar el indicador de velocidad después del cambio
            });
        }
    }

    // *** YouTube Quick Speed Interface - End ***

    // Combined Styles
    var combinedStyle = document.createElement('style');
    combinedStyle.innerHTML = `
.ytp-chrome-controls {line-height: 42px !important;}

.ytp-speed-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    order: -1 !important;
    z-index: 100;
    width: 40px;
    margin-right: 10px;
}
.ytp-speed-option {
    display: none !important;
    opacity: 0;
    visibility: hidden;
    background-color: rgba(0, 0, 0, 1);
    width: 40px;
/*     height: 40px; */
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}
.ytp-speed-option.active {
    display: flex !important;
    opacity: 1;
    visibility: visible;
    background-color: rgba(50, 50, 50, 0.3);
}
.ytp-speed-options:hover .ytp-speed-option {
    display: flex !important;
    opacity: 1;
    visibility: visible;
    position: absolute;
    transform: translateY(0);
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
}
.ytp-speed-options:hover .ytp-speed-option:nth-child(1) { transform: translateX(-50%) translateY(-210px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(2) { transform: translateX(-50%) translateY(-180px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(3) { transform: translateX(-50%) translateY(-150px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(4) { transform: translateX(-50%) translateY(-120px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(5) { transform: translateX(-50%) translateY(-90px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(6) { transform: translateX(-50%) translateY(-60px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(7) { transform: translateX(-50%) translateY(-30px); }
.ytp-speed-options:hover .ytp-speed-option:nth-child(8) { transform: translateX(-50%) translateY(0); }
.ytp-speed-option:hover {
    color: black;
    background-color: rgba(211, 211, 211, 0.9);
    z-index: 999 !important;
}

.button-base {
    font-size: 19px;
    color: white;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
    width: 32px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
}
.button-hover {
    background-color: rgba(211, 211, 211, 0.4) !important;
}
.ytp-rewind-button:hover, .ytp-fastforward-button:hover, .ytp-configure-button:hover {
    background-color: rgba(211, 211, 211, 0.4) !important;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: auto;
}
#configure-modal button {
    cursor: pointer;
}
@keyframes arrowFadeLeft {
    0% { transform: translateX(20px); opacity: 0; }
    50% { transform: translateX(0px); opacity: 0.5; }
    100% { transform: translateX(-20px); opacity: 1; }
}
@keyframes arrowFadeRight {
    0% { transform: translateX(-20px) rotate(180deg); opacity: 0; }
    50% { transform: translateX(0px) rotate(180deg); opacity: 0.5; }
    100% { transform: translateX(20px) rotate(180deg); opacity: 1; }
}

.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper {
	order: -2;
	margin-right: 6px;
/* 	margin-top: 6px; */
}
.ytLikeButtonViewModelHost {
	display: flex;
	align-items: center;
}
.ytDislikeButtonViewModelHost {
	display: flex;
	align-items: center;
}
`;
    document.head.appendChild(combinedStyle);

    // Detectar el navegador (from YouTube Quick Speed Interface)
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isFirefox = /Firefox/.test(navigator.userAgent);

    // Agregar una clase al body (from YouTube Quick Speed Interface)
    if (isChrome) {
        document.body.classList.add('chrome-browser');
    } else if (isFirefox) {
        document.body.classList.add('firefox-browser');
    }

    // Listen for URL changes and automatically reset speed highlight (from YouTube Quick Speed Interface)
    var currentURL = window.location.href;
    setInterval(function() {
        var newURL = window.location.href;
        if (newURL !== currentURL) {
            currentURL = newURL;
            addSpeedOptions();
            updateSpeedIndicator(); // Actualizar la velocidad al cambiar de video
        }
    }, 500);

    function moveLikeButton() {
        // 1. Selecciona el contenedor del Like/Dislike (Confirmado como correcto)
        const BotonDeLike = document.querySelector('.ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper');

        // 2. Selecciona el contenedor de las opciones de velocidad (CORREGIDO)
        const ContenedorVelocidades = document.querySelector('.ytp-speed-options');

        // 3. Selecciona el contenedor de controles derecho para referencia
        const rightControls = document.querySelector('.ytp-right-controls');

        // Asegúrate de que todos los elementos existen antes de intentar mover
        if (BotonDeLike && ContenedorVelocidades && rightControls) {

            if (BotonDeLike.parentElement !== rightControls) {
                rightControls.insertBefore(BotonDeLike, rightControls.firstChild);
            }
        }
    }

    // MutationObserver to ensure controls are added when the player loads or changes
    const observer = new MutationObserver(() => {
        if (document.querySelector('.html5-video-player')) {
            // Enhanced Controls
            if (document.querySelector('.ytp-left-controls') && !document.querySelector('#custom-volume-buttons')) {
                ensureVideoLoaded();
            }
            if (document.querySelector('.ytp-left-controls') && document.querySelector('.ytp-right-controls') && !document.querySelector('.ytp-rewind-button')) {
                addControls();
            }

            // Quick Speed Interface
            if (document.querySelector('.ytp-right-controls') && !document.querySelector('.ytp-speed-options')) {
                addSpeedOptions();
                updateSpeedIndicator();
                observePlaybackRateChange();
            }
        }
        if (document.querySelector('.html5-video-player')) {
            if (document.querySelector('.ytp-right-controls')) {
                moveLikeButton();
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case player is already loaded
    if (document.querySelector('.html5-video-player')) {
        ensureVideoLoaded();
        addControls();
        addSpeedOptions();
        updateSpeedIndicator();
        observePlaybackRateChange();
    }

    /*     // Mantener Visibles Controles
    setInterval(() => {
        // Busca el contenedor principal del reproductor
        const container = document.querySelector('#movie_player');

        // Si existe, elimina la clase de auto-ocultado para mantener los controles visibles
        if (container) {
            container.classList.remove('ytp-autohide');
        }
    }, 1000); // Se repite cada 1000 milisegundos */

})();