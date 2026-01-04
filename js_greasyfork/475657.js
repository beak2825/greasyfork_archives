// ==UserScript==
// @name         Kindroid Mod
// @version      1.0
// @description  Modify background, sound notification, chat opacity, user and kin name on top.
// @author       TemPassion
// @homepageURL  https://github.com/TenPassion/kindroid-script
// @license      MIT
// @match        https://kindroid.ai/home
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/475657/Kindroid%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/475657/Kindroid%20Mod.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let optionsOpen = true;
    let selectedSoundButton = null;

    function changeText(elements) {
        const text1 = document.querySelector('.css-19hb772');
        const text2 = document.querySelector('.css-ppua9z');
        elements.forEach(function (element) {
            element.textContent =
                text1.textContent + ' x ' + text2.textContent + ' on Kindroid ';
        });
    }

    function changeBackground(imageURL) {
        const targetElement = document.querySelector('.css-1lvpjll');
        if (targetElement) {
            targetElement.style.backgroundImage = 'none';
            if (imageURL !== '') {
                targetElement.style.backgroundImage = `url("${imageURL}")`;
                targetElement.style.backgroundSize = 'cover';
                targetElement.style.backgroundRepeat = 'no-repeat';
            }
        }
    }

    function adjustOpacityTeti0a() {
        const opacityValue = GM_getValue('opacityValue', '0.9');
        const elementsToAdjust = document.querySelectorAll('.css-teti0a');
        elementsToAdjust.forEach(function (element) {
            element.style.opacity = opacityValue;
        });
    }

    function adjustOpacity100dd8p() {
        const opacityValue = GM_getValue('opacityValue', '0.9');
        const elementsToAdjust = document.querySelectorAll('.css-1dhayxc');
        elementsToAdjust.forEach(function (element) {
            element.style.opacity = opacityValue;
        });
    }

    function playNotificationSound(soundURL) {
        const audio = new Audio(soundURL);
        audio.play();
    }

    function applyOpacity(opacityValue) {
        GM_setValue('opacityValue', opacityValue);
        adjustOpacityTeti0a(opacityValue);
        adjustOpacity100dd8p(opacityValue);
    }

    function openOptions() {
        const customModal = document.getElementById('customModal');
        const enableNotificationsCheckbox = document.getElementById('enableNotifications');
        const enableNotifications = GM_getValue('enableNotifications', false); // Récupérer la valeur stockée
        enableNotificationsCheckbox.checked = enableNotifications; // Mettre à jour l'état de la case à cocher
        if (optionsOpen) {
            customModal.style.pointerEvents = 'auto';
            customModal.style.opacity = '1';
        } else {
            customModal.style.pointerEvents = 'none';
            customModal.style.opacity = '0';
        }
        optionsOpen = !optionsOpen;
    }

    function closeOptions() {
        const customModal = document.getElementById('customModal');
        customModal.style.pointerEvents = 'none';
        customModal.style.opacity = '0';
        optionsOpen = false;
    }

    function openBackgroundPopup() {
        const newImageURL = prompt('Enter the URL of the new background image:');
        if (newImageURL !== null) {
            GM_setValue('customImageURL', newImageURL);
            location.reload();
            changeBackground(newImageURL);
        }
    }

    function openSoundSelection() {
        const soundSelectionModal = document.getElementById('soundSelectionModal');
        soundSelectionModal.style.display = 'block';
    }

    function closeSoundSelection() {
        const soundSelectionModal = document.getElementById('soundSelectionModal');
        soundSelectionModal.style.display = 'none';

        // Sauvegarder le son sélectionné
        if (selectedSoundButton) {
            const soundURL = selectedSoundButton.getAttribute('data-sound');
            GM_setValue('selectedSoundURL', soundURL);
        }
    }

    const modalHTML = `
        <div id="customModal" style="position: fixed; bottom: 10px; right: 10px; background-color: #282828; padding: 20px; border: 2px solid #333; z-index: 9999; border-radius: 10px; color: white; opacity: 0; transition: opacity 0.3s ease-in-out;">
            <button id="closeModal" style="position: absolute; top: 10px; right: 10px; background-color: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">✖</button>
            Adjust chat opacity: <input type="range" id="opacitySlider" min="0" max="1" step="0.1" value="0.9" style="width: 100%; background: linear-gradient(to left, #fe8484, #8b6dff); -webkit-appearance: none; height: 8px; border-radius: 5px;"><style>#opacitySlider::-webkit-slider-thumb{background-color:black !important;}</style><br>
            <label for="enableNotifications" style="margin-top: 10px; margin-bottom: 20px; display: block; cursor: pointer;">
                <input type="checkbox" id="enableNotifications" style="margin-right: 5px;"> Enable sound notifications 🔔
            </label>
            <button id="openSoundSelectionButton" style="background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Select Notification Sound</button><br>
            <button id="optionsButton" style="background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px; margin-top: 10px;">Change Background</button><br>
            <button id="saveSettingsButton" style="background: linear-gradient(to right, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px; display: block; margin-top: 10px;">Save Settings 💾</button>
        </div>
    `;

    const soundSelectionHTML = `
        <div id="soundSelectionModal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #282828; padding: 20px; border: 2px solid #333; z-index: 9999; border-radius: 10px; color: white;">
            <button id="closeSoundSelection" style="position: absolute; top: 10px; right: 10px; background-color: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">✖</button>
            <h2 style="text-align: center;">Select Notification Sound</h2>
            <button class="soundOption" data-sound="https://www.myinstants.com/media/sounds/discord-notification.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Discord Message</button>
            <button class="soundOption" data-sound="https://www.redringtones.com/wp-content/uploads/2018/06/iphone-ding-sound.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">iPhone Message</button>
            <button class="soundOption" data-sound="https://notificationsounds.com/storage/sounds/file-sounds-1192-message.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Woman Message</button>
            <button class="soundOption" data-sound="https://notificationsounds.com/storage/sounds/file-sounds-1309-man-message.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Man Message</button>
            <button class="soundOption" data-sound="https://notificationsounds.com/storage/sounds/file-sounds-1195-mmm.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Woman Hmmm</button>
            <button class="soundOption" data-sound="https://notificationsounds.com/storage/sounds/file-sounds-1295-man-hmmm.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Man Hmmm</button>
            <button class="soundOption" data-sound="https://notificationsounds.com/storage/sounds/file-sounds-1233-elegant.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Elegant</button>
            <button class="soundOption" data-sound="https://notificationsounds.com/storage/sounds/file-sounds-1100-open-ended.mp3" style="display: block; margin-bottom: 10px; background: linear-gradient(to left, #fe8484, #8b6dff); border: none; color: white; cursor: pointer; padding: 10px 20px; border-radius: 5px;">Open Ended</button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.insertAdjacentHTML('beforeend', soundSelectionHTML);

    const closeModalButton = document.getElementById('closeModal');
    const optionsButton = document.getElementById('optionsButton');
    const opacitySlider = document.getElementById('opacitySlider');
    const customModal = document.getElementById('customModal');
    const enableNotificationsCheckbox = document.getElementById(
        'enableNotifications'
    );
    const saveSettingsButton = document.getElementById('saveSettingsButton');
    const openSoundSelectionButton = document.getElementById(
        'openSoundSelectionButton'
    );
    const closeSoundSelectionButton = document.getElementById(
        'closeSoundSelection'
    );
    const soundOptions = document.querySelectorAll('.soundOption');

    closeModalButton.addEventListener('click', closeOptions);

    optionsButton.addEventListener('click', () => {
        openOptions();
        openBackgroundPopup(); // Ouvre la popup URL lorsque vous cliquez sur "Change Background"
    });

    openSoundSelectionButton.addEventListener('click', openSoundSelection);
    closeSoundSelectionButton.addEventListener('click', closeSoundSelection);

    enableNotificationsCheckbox.addEventListener('change', () => {
        const isChecked = enableNotificationsCheckbox.checked;
        GM_setValue('enableNotifications', isChecked); // Sauvegarder la nouvelle valeur
    });


    saveSettingsButton.addEventListener('click', () => {
        const opacityValue = opacitySlider.value;
        GM_setValue('opacityValue', opacityValue);
        const isChecked = enableNotificationsCheckbox.checked;
        GM_setValue('enableNotifications', isChecked);
        location.reload();

        closeOptions();

        // Jouer le son des notifications avec le son sélectionné
        const selectedSoundURL = GM_getValue('selectedSoundURL', '');
        if (isChecked && selectedSoundURL !== '') {
            playNotificationSound(selectedSoundURL);
        }
    });

    opacitySlider.addEventListener('input', () => {
        const opacityValue = opacitySlider.value;
        applyOpacity(opacityValue);
    });

    const customImageButton = document.createElement('button');
    customImageButton.textContent = '😈';
    customImageButton.style.position = 'fixed';
    customImageButton.style.bottom = '10px';
    customImageButton.style.right = '10px';
    customImageButton.style.zIndex = '9999';
    customImageButton.style.color = 'white';
    customImageButton.style.backgroundColor = '#282828';
    customImageButton.style.border = 'none';
    customImageButton.style.borderRadius = '50%';
    customImageButton.style.padding = '10px';
    customImageButton.style.cursor = 'pointer';
    customImageButton.addEventListener('click', openOptions);

    document.body.appendChild(customImageButton);

    const customImageURL = GM_getValue('customImageURL', '');
    if (customImageURL !== '') {
        changeBackground(customImageURL);
    }

    const selectedSoundURL = GM_getValue('selectedSoundURL', '');
    if (selectedSoundURL !== '') {
        soundOptions.forEach(function (soundOption) {
            const soundURL = soundOption.getAttribute('data-sound');
            if (soundURL === selectedSoundURL) {
                soundOption.style.fontWeight = 'bold';
            }
        });
    }

    soundOptions.forEach(function (soundOption) {
        soundOption.addEventListener('click', function () {
            const soundURL = soundOption.getAttribute('data-sound');
            playNotificationSound(soundURL);
            soundOptions.forEach(function (option) {
                option.style.fontWeight = 'normal';
            });
            soundOption.style.fontWeight = 'bold';
            selectedSoundButton = soundOption;
        });
    });

    const observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const elements = document.querySelectorAll('.chakra-text.css-s68iw5');
                if (elements.length > 0) {
                    changeText(elements);
                    changeBackground(customImageURL);
                    const opacityValue = document.querySelector(
                        'input[type="range"]'
                    ).value;
                    applyOpacity(opacityValue);
                    const enableNotifications = GM_getValue('enableNotifications', false);
                    if (enableNotifications) {
                        const removedElements = mutation.removedNodes;
                        removedElements.forEach(function (removedElement) {
                            if (
                                removedElement.classList &&
                                removedElement.classList.contains('css-1ulhpcc')
                            ) {
                                playNotificationSound(selectedSoundURL);
                            }
                        });
                        const newElements = mutation.addedNodes;
                        newElements.forEach(function (newElement) {
                            if (
                                newElement.classList &&
                                newElement.classList.contains('css-teti0a')
                            ) {
                                playNotificationSound(selectedSoundURL);
                            }
                        });
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
