// ==UserScript==
// @name         Camera Keybinds
// @description  Camera keybinds for fishtank.live
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       luna__mae
// @license      GNU GPLv3
// @homepageURL  https://github.com/luna-mae/ClippingTools
// @namespace    https://github.com/luna-mae/ClippingTools
// @icon         https://raw.githubusercontent.com/luna-mae/ClippingTools/refs/heads/main/media/logo.png
// @supportURL   https://x.com/luna__mae
// @match        https://www.fishtank.live/
// @match        https://www.fishtank.live/clips
// @match        https://www.fishtank.live/clip/*
// @downloadURL https://update.greasyfork.org/scripts/517470/Camera%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/517470/Camera%20Keybinds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cameraNames = [
        "Director Mode", "Den", "Den PTZ", "Lounge", "Locker Room", "Deck", "Yard", "Yard PTZ", "Catwalk", "Mail Room",
        "Kitchen", "Island", "Dining Room", "Hallway", "Bedroom 1", "Bedroom 2", "Bedroom 3", "Vanity", "Penthouse",
        "Loft", "Jacuzzi", "Bar", "Flat", "Confessional"
    ];

    function showModal() {
        let existingModal = document.getElementById('keybindModal');
        if (existingModal) {
            existingModal.remove();
        }
    
        let modal = document.createElement('div');
        modal.id = 'keybindModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#191d21';
        modal.style.padding = '0px';
        modal.style.zIndex = '1000';
        modal.style.width = '700px';
        modal.style.border = '1px solid #505050';
        modal.style.display = 'grid';
        modal.style.gridTemplateColumns = 'repeat(2, 1fr)';
        modal.style.gap = '5px';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';
        
        let style = document.createElement('style');
        style.innerHTML = `
            .closer {
                background-color: rgba(25, 29, 33, 1);
                border: 1px solid #505050;
                border-radius: 0;
                cursor: pointer;
                transition: color 0.3s, outline 0.3s;
                box-sizing: border-box;
            }
        
            .closer:hover {
                outline: 2px solid #f8ec94;
                color: #f8ec94;
            }
        `;
        document.head.appendChild(style);
        
        let modalContent = '<h2 style="grid-column: span 2;margin-bottom:10px;background-color:#740700;padding:10px;">Set Keybinds for Cameras</h2>';
        cameraNames.forEach((name, index) => {
            modalContent += `<div style="display: flex; align-items: center; justify-content: space-between; grid-column: span 1; font-size: 10px;margin-left:50px;">
            <span>${name}</span>
            <div style="display: flex; margin-left: auto; margin-right: 50px;">
                <button id="camera${index + 1}" class="change-key" data-camera-id="list-cam-${index + 1}" style="max-width: 100px; padding: 10px;">${localStorage.getItem('camera' + (index + 1)) || 'Set Keybind'}</button>
                <button id="clearCamera${index + 1}" class="closer" style="max-width: 75px; padding: 10px; font-size:10px;">Clear</button>
            </div>
         </div>`;
        });
        
        modalContent += '<button id="saveKeybinds" class="closer" style="grid-column: span 2; padding: 10px;">Save</button>';
        modal.innerHTML = modalContent;
        document.body.appendChild(modal);
        
        cameraNames.forEach((name, index) => {
            document.getElementById('camera' + (index + 1)).addEventListener('click', () => waitForKeybind(index + 1));
            document.getElementById('clearCamera' + (index + 1)).addEventListener('click', () => {
                localStorage.removeItem('camera' + (index + 1));
                document.getElementById('camera' + (index + 1)).textContent = 'Set Keybind';
            });
        });
    
        document.getElementById('saveKeybinds').addEventListener('click', saveKeybinds);
    }
    
    function waitForKeybind(cameraIndex) {
        let button = document.getElementById('camera' + cameraIndex);
        button.textContent = 'Waiting...';
        button.disabled = true;
    
        function keyHandler(event) {
            if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt') {
                return;
            }
    
            let keybind = '';
            if (event.ctrlKey) keybind += 'Ctrl+';
            if (event.altKey) keybind += 'Alt+';
            if (event.shiftKey) keybind += 'Shift+';
    
            if (event.code.startsWith('Numpad')) {
                keybind += event.code;
            } else {
                keybind += event.key;
            }
    
            localStorage.setItem('camera' + cameraIndex, keybind);
            button.textContent = keybind;
            button.disabled = false;
            document.removeEventListener('keydown', keyHandler);
        }
    
        document.addEventListener('keydown', keyHandler);
    }
    
    function saveKeybinds() {
        cameraNames.forEach((name, index) => {
            let keybind = document.getElementById('camera' + (index + 1)).textContent;
            localStorage.setItem('camera' + (index + 1), keybind);
        });
        document.getElementById('keybindModal').remove();
    }

    function handleKeypress(event) {
        const chatInput = document.querySelector('.chat-input_chat-input__GAgOF');
        const textInputs = document.querySelectorAll('.input_input__Zwrui input[type="text"]');
        
        if (chatInput && chatInput.contains(document.activeElement)) {
            return;
        }
    
        for (let input of textInputs) {
            if (input === document.activeElement) {
                return;
            }
        }
    
        const cameraIds = [
            "list-director-mode-3", "list-den-3", "list-den-ptz-3", "list-lounge-3", "list-locker-room-3", "list-deck-3", "list-yard-3", "list-yard-ptz-3", "list-catwalk-3", "list-mail-room-3", "list-kitchen-3", "list-island-3", "list-dining-room-3", "list-hallway-3", "list-bedroom-1-3", "list-bedroom-2-3", "list-bedroom-3-3", "list-vanity-3", "list-penthouse-3", "list-loft-3", "list-jacuzzi-3", "list-bar-3", "list-flat-3", "list-confessional-3" 
        ];
    
        cameraNames.forEach((name, index) => {
            let keybind = localStorage.getItem('camera' + (index + 1));
            if (keybind) {
                let pressedKey = '';
                if (event.ctrlKey) pressedKey += 'Ctrl+';
                if (event.altKey) pressedKey += 'Alt+';
                if (event.shiftKey) pressedKey += 'Shift+';
    
                if (event.code.startsWith('Numpad')) {
                    pressedKey += event.code;
                } else {
                    pressedKey += event.key;
                }
    
                if (pressedKey === keybind) {
                    document.getElementById(cameraIds[index]).click();
                }
            }
        });
    }


function attachIcon() {
    let targetDivs = document.querySelectorAll('.live-streams-monitoring-point_live-streams-monitoring-point__KOqPQ .panel_header__T2yFW');
    targetDivs.forEach(targetDiv => {
        if (targetDiv) {
            console.log('Target div found:', targetDiv);
            let icon = document.createElement('i');
            icon.id = 'info-button';
            icon.className = 'fa fa-info-circle';
            icon.setAttribute('aria-hidden', 'true');
            icon.style.cursor = 'pointer';
            icon.style.float = 'right';
            icon.style.color = '#fff';
            icon.style.marginLeft = '75px';
            targetDiv.appendChild(icon);
            icon.addEventListener('click', showModal);
            console.log('Icon attached:', icon);
        } else {
            console.log('Target div not found');
        }
    });
}

const observer = new MutationObserver((mutations, obs) => {
    let targetDivs = document.querySelectorAll('.live-streams-monitoring-point_live-streams-monitoring-point__KOqPQ .panel_header__T2yFW');
    if (targetDivs.length > 0) {
        attachIcon();
        obs.disconnect();
    }
});

observer.observe(document, {
    childList: true,
    subtree: true
});

    document.addEventListener('keydown', handleKeypress);
})();