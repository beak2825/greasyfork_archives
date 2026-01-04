// ==UserScript==
// @name         NeuvoSmart
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Son quand le neuvopack est plein / UI de suivi
// @author       Laïn
// @match        https://www.dreadcast.net/Main*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544413/NeuvoSmart.user.js
// @updateURL https://update.greasyfork.org/scripts/544413/NeuvoSmart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadWindowSettings() {
        const saved = localStorage.getItem('neuvopack-window-settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                return {
                    top: settings.top || 20,
                    left: settings.left || (window.innerWidth - 250),
                    width: settings.width || 200,
                    height: settings.height || 'auto',
                    visible: true
                };
            } catch (e) {
                console.error('Error parsing saved window settings:', e);
            }
        }
        return {
            top: 20,
            left: window.innerWidth - 250,
            width: 200,
            height: 'auto',
            visible: true
        };
    }

    function saveWindowSettings(overlay) {
        const saved = localStorage.getItem('neuvopack-window-settings');
        let settings = {};
        if (saved) {
            try {
                settings = JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing existing settings:', e);
            }
        }
        
        settings.top = parseInt(overlay.style.top);
        settings.left = parseInt(overlay.style.left);
        settings.width = parseInt(overlay.style.width);
        settings.height = overlay.style.height === 'auto' ? 'auto' : parseInt(overlay.style.height);
        
        localStorage.setItem('neuvopack-window-settings', JSON.stringify(settings));
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left);
            startTop = parseInt(element.style.top);
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });

        function drag(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            saveWindowSettings(element);
        }
    }

    function makeResizable(element) {
        const resizer = document.createElement('div');
        resizer.style.cssText = `
            position: absolute;
            bottom: 0;
            right: 0;
            width: 20px;
            height: 20px;
            cursor: nw-resize;
            background: linear-gradient(-45deg, transparent 0%, transparent 40%, #666 40%, #666 60%, transparent 60%);
        `;
        
        element.appendChild(resizer);
        
        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizer.addEventListener('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
            e.stopPropagation();
        });

        function resize(e) {
            if (!isResizing) return;
            
            const width = startWidth + e.clientX - startX;
            const height = startHeight + e.clientY - startY;
            
            element.style.width = Math.max(150, width) + 'px';
            element.style.height = Math.max(100, height) + 'px';
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            saveWindowSettings(element);
        }
    }

    function createOverlayWindow() {
        const settings = loadWindowSettings();
        
        const overlay = document.createElement('div');
        overlay.id = 'neuvopack-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: ${settings.top}px;
            left: ${settings.left}px;
            width: ${settings.width}px;
            height: ${settings.height === 'auto' ? 'auto' : settings.height + 'px'};
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 100005;
            min-width: 150px;
            min-height: 100px;
            display: ${settings.visible ? 'block' : 'none'};
            border: 2px solid #333;
            overflow: hidden;
        `;
        
        const titleBar = document.createElement('div');
        titleBar.id = 'neuvopack-titlebar';
        titleBar.style.cssText = `
            background-color: rgba(0, 0, 0, 0.9);
            padding: 8px 15px;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #555;
        `;
        
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            font-size: 13px;
        `;
        title.textContent = 'Neuvopacks détectés';
        
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: flex;
            gap: 5px;
            align-items: center;
        `;
        
        const muteButton = document.createElement('div');
        muteButton.id = 'mute-button';
        muteButton.style.cssText = `
            width: 20px;
            height: 20px;
            cursor: pointer;
            text-align: center;
            line-height: 18px;
            border-radius: 2px;
            font-size: 12px;
            border: 1px solid #555;
            background-color: rgba(255, 255, 255, 0.1);
        `;
        updateMuteButton(muteButton);
        
        muteButton.addEventListener('click', function() {
            soundSettings.muted = !soundSettings.muted;
            updateMuteButton(muteButton);
            saveSoundSettings();
        });
        
        const optionsButton = document.createElement('div');
        optionsButton.style.cssText = `
            width: 20px;
            height: 20px;
            cursor: pointer;
            text-align: center;
            line-height: 18px;
            border-radius: 2px;
            font-size: 12px;
            color: #ccc;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid #555;
        `;
        optionsButton.textContent = '⚙';
        optionsButton.title = 'Options';
        
        optionsButton.addEventListener('click', function() {
            openOptionsWindow();
        });
        
        optionsButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        optionsButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        const closeButton = document.createElement('div');
        closeButton.style.cssText = `
            width: 16px;
            height: 16px;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            line-height: 14px;
            border-radius: 2px;
            font-size: 12px;
            color: #ccc;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid #555;
        `;
        closeButton.textContent = '×';
        closeButton.title = 'Fermer la fenêtre';
        
        closeButton.addEventListener('click', function() {
            overlay.style.display = 'none';
            saveWindowSettings(overlay);
        });
        
        closeButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            this.style.color = 'white';
        });
        
        closeButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            this.style.color = '#ccc';
        });
        
        titleBar.appendChild(title);
        controlsContainer.appendChild(muteButton);
        controlsContainer.appendChild(optionsButton);
        controlsContainer.appendChild(closeButton);
        titleBar.appendChild(controlsContainer);
        
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
            padding: 15px;
            overflow-y: auto;
            height: calc(100% - 45px);
        `;
        
        const content = document.createElement('div');
        content.id = 'neuvopack-content';
        
        contentArea.appendChild(content);
        overlay.appendChild(titleBar);
        overlay.appendChild(contentArea);
        document.body.appendChild(overlay);
        
        makeDraggable(overlay, titleBar);
        makeResizable(overlay);
        
        return overlay;
    }

    let soundSettings = {
        muted: false,
        volume: 50,
        customSoundUrl: null,
        useCustomSound: false
    };

    let audioContext = null;
    function getAudioContext() {
        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }

    function loadSoundSettings() {
        const saved = localStorage.getItem('neuvopack-sound-settings');
        if (saved) {
            try {
                soundSettings = { ...soundSettings, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Error parsing saved sound settings:', e);
            }
        }
    }

    function saveSoundSettings() {
        localStorage.setItem('neuvopack-sound-settings', JSON.stringify(soundSettings));
    }

    function playNotificationSound() {
        if (soundSettings.muted) return;
        
        try {
            if (soundSettings.useCustomSound && soundSettings.customSoundUrl) {
                playCustomSound();
            } else {
                playDefaultSound();
                setTimeout(() => playDefaultSound(), 400);
            }
        } catch (error) {
            console.log('Could not play notification sound:', error);
        }
    }

    function playDefaultSound() {
        const ctx = getAudioContext();
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
        
        let volume;
        if (soundSettings.volume === 0) {
            volume = 0;
        } else if (soundSettings.volume <= 50) {
            volume = 0.1 + (soundSettings.volume - 1) * (0.9 / 49);
        } else {
            volume = 1.0 + (soundSettings.volume - 50) * (2.0 / 50);
        }
        
        if (soundSettings.volume === 1) volume = 0.1;
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        
        oscillator.type = 'sine';
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    }

    function playCustomSound() {
        let volume;
        if (soundSettings.volume === 0) {
            volume = 0;
        } else if (soundSettings.volume <= 50) {
            volume = 0.1 + (soundSettings.volume - 1) * (0.9 / 49);
        } else {
            volume = 1.0 + (soundSettings.volume - 50) * (2.0 / 50);
        }
        
        if (soundSettings.volume === 1) volume = 0.1;
        
        const audio = new Audio(soundSettings.customSoundUrl);
        audio.volume = Math.min(volume, 1.0);
        audio.play().catch(e => {
            console.log('Custom sound failed, falling back to default');
            playDefaultSound();
            setTimeout(() => playDefaultSound(), 400);
        });
    }

    function updateMuteButton(button) {
        if (soundSettings.muted) {
            button.textContent = '🔇';
            button.style.color = '#f44336';
            button.title = 'Activer le son';
        } else {
            button.textContent = '🔊';
            button.style.color = '#ccc';
            button.title = 'Couper le son';
        }
        
        if (!button._hoverListenersAdded) {
            button.addEventListener('mouseover', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            });
            
            button.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            button._hoverListenersAdded = true;
        }
    }

    function openOptionsWindow() {
        let optionsWindow = document.getElementById('neuvopack-options');
        if (optionsWindow) {
            optionsWindow.style.display = 'block';
            return;
        }
        
        optionsWindow = document.createElement('div');
        optionsWindow.id = 'neuvopack-options';
        optionsWindow.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background-color: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 100010;
            border: 2px solid #555;
            overflow: hidden;
        `;
        
        const optionsTitleBar = document.createElement('div');
        optionsTitleBar.style.cssText = `
            background-color: rgba(0, 0, 0, 0.95);
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #555;
        `;
        
        const optionsTitle = document.createElement('div');
        optionsTitle.style.fontWeight = 'bold';
        optionsTitle.textContent = 'Options Audio';
        
        const optionsCloseButton = document.createElement('div');
        optionsCloseButton.style.cssText = `
            width: 16px;
            height: 16px;
            cursor: pointer;
            font-weight: bold;
            text-align: center;
            line-height: 14px;
            border-radius: 2px;
            font-size: 12px;
            color: #ccc;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid #555;
        `;
        optionsCloseButton.textContent = '×';
        optionsCloseButton.addEventListener('click', () => {
            const optionsWindow = document.getElementById('neuvopack-options');
            if (optionsWindow._eventHandlers) {
                Object.values(optionsWindow._eventHandlers).forEach(({element, event, handler}) => {
                    element.removeEventListener(event, handler);
                });
                delete optionsWindow._eventHandlers;
            }
            optionsWindow.style.display = 'none';
        });
        
        optionsTitleBar.appendChild(optionsTitle);
        optionsTitleBar.appendChild(optionsCloseButton);
        
        const optionsContent = document.createElement('div');
        optionsContent.style.cssText = `
            padding: 20px;
        `;
        
        optionsContent.innerHTML = `
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Volume: <span id="volume-display">${soundSettings.volume}%</span></label>
                <input type="range" id="volume-slider" min="0" max="100" value="${soundSettings.volume}" 
                       style="width: 100%; accent-color: #4CAF50;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="use-custom-sound" ${soundSettings.useCustomSound ? 'checked' : ''}> 
                    Utiliser un son personnalisé
                </label>
            </div>
            
            <div id="custom-sound-options" style="margin-bottom: 15px; ${soundSettings.useCustomSound ? '' : 'opacity: 0.5; pointer-events: none;'}">
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px;">URL du son:</label>
                    <input type="text" id="sound-url" value="${soundSettings.customSoundUrl || ''}" 
                           style="width: 100%; padding: 5px; background: rgba(255,255,255,0.1); border: 1px solid #555; color: white; border-radius: 3px;">
                </div>
                
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 5px;">Ou sélectionner un fichier:</label>
                    <input type="file" id="sound-file" accept="audio/*" 
                           style="width: 100%; padding: 5px; background: rgba(255,255,255,0.1); border: 1px solid #555; color: white; border-radius: 3px;">
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="test-sound" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Tester le son
                </button>
                <button id="reset-sound" style="padding: 8px 16px; background: #ff9800; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Réinitialiser
                </button>
                <button id="save-options" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Sauvegarder
                </button>
            </div>
        `;
        
        optionsWindow.appendChild(optionsTitleBar);
        optionsWindow.appendChild(optionsContent);
        document.body.appendChild(optionsWindow);
        
        setupOptionsEventListeners();
    }

    function setupOptionsEventListeners() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumeDisplay = document.getElementById('volume-display');
        const useCustomSound = document.getElementById('use-custom-sound');
        const customSoundOptions = document.getElementById('custom-sound-options');
        const soundUrl = document.getElementById('sound-url');
        const soundFile = document.getElementById('sound-file');
        const testSound = document.getElementById('test-sound');
        const resetSound = document.getElementById('reset-sound');
        const saveOptions = document.getElementById('save-options');
        
        const volumeHandler = () => {
            volumeDisplay.textContent = volumeSlider.value + '%';
        };
        
        const customSoundHandler = () => {
            customSoundOptions.style.opacity = useCustomSound.checked ? '1' : '0.5';
            customSoundOptions.style.pointerEvents = useCustomSound.checked ? 'auto' : 'none';
        };
        
        const fileHandler = (e) => {
            if (e.target.files[0]) {
                const url = URL.createObjectURL(e.target.files[0]);
                soundUrl.value = url;
            }
        };
        
        const testHandler = () => {
            const tempSettings = { ...soundSettings };
            soundSettings.volume = parseInt(volumeSlider.value);
            soundSettings.useCustomSound = useCustomSound.checked;
            soundSettings.customSoundUrl = soundUrl.value;
            soundSettings.muted = false;
            
            playNotificationSound();
            
            soundSettings = tempSettings;
        };
        
        const resetHandler = () => {
            useCustomSound.checked = false;
            soundUrl.value = '';
            soundFile.value = '';
            volumeSlider.value = 50;
            volumeDisplay.textContent = '50%';
            customSoundOptions.style.opacity = '0.5';
            customSoundOptions.style.pointerEvents = 'none';
        };
        
        const saveHandler = () => {
            soundSettings.volume = parseInt(volumeSlider.value);
            soundSettings.useCustomSound = useCustomSound.checked;
            soundSettings.customSoundUrl = soundUrl.value;
            saveSoundSettings();
            
            const muteButton = document.getElementById('mute-button');
            if (muteButton) {
                updateMuteButton(muteButton);
            }
            
            const optionsWindow = document.getElementById('neuvopack-options');
            if (optionsWindow._eventHandlers) {
                Object.values(optionsWindow._eventHandlers).forEach(({element, event, handler}) => {
                    element.removeEventListener(event, handler);
                });
                delete optionsWindow._eventHandlers;
            }
            optionsWindow.style.display = 'none';
        };
        
        volumeSlider.addEventListener('input', volumeHandler);
        useCustomSound.addEventListener('change', customSoundHandler);
        soundFile.addEventListener('change', fileHandler);
        testSound.addEventListener('click', testHandler);
        resetSound.addEventListener('click', resetHandler);
        saveOptions.addEventListener('click', saveHandler);
        
        const optionsWindow = document.getElementById('neuvopack-options');
        optionsWindow._eventHandlers = {
            volumeSlider: { element: volumeSlider, event: 'input', handler: volumeHandler },
            useCustomSound: { element: useCustomSound, event: 'change', handler: customSoundHandler },
            soundFile: { element: soundFile, event: 'change', handler: fileHandler },
            testSound: { element: testSound, event: 'click', handler: testHandler },
            resetSound: { element: resetSound, event: 'click', handler: resetHandler },
            saveOptions: { element: saveOptions, event: 'click', handler: saveHandler }
        };
    }

    let fullNeuvopacks = new Set();

    function detectNeuvopacks() {
        const neuvopacks = [];
        
        const neuvopackElements = document.querySelectorAll('.item.objet_type_Neuvopack');
        
        neuvopackElements.forEach((element, index) => {
            let content = 'Non disponible';
            let isFull = false;
            const contenanceElement = element.closest('.case_objet').querySelector('[class*="contenance_appareil_"]');
            if (contenanceElement) {
                const typeInfoDiv = contenanceElement.closest('.typeinfo');
                if (typeInfoDiv) {
                    const fullText = typeInfoDiv.textContent.trim();
                    const match = fullText.match(/(\d+\/2000)/);
                    if (match) {
                        content = match[1];
                        const currentAmount = parseInt(match[1].split('/')[0]);
                        isFull = currentAmount >= 2000;
                        
                        const neuvopackId = element.getAttribute('id') || `neuvopack_${index}`;
                        
                        if (isFull && !fullNeuvopacks.has(neuvopackId)) {
                            fullNeuvopacks.add(neuvopackId);
                            playNotificationSound();
                        } else if (!isFull && fullNeuvopacks.has(neuvopackId)) {
                            fullNeuvopacks.delete(neuvopackId);
                        }
                    }
                }
            }
            
            neuvopacks.push({
                content: content,
                isFull: isFull,
                element: element
            });
        });
        
        return neuvopacks;
    }

    function updateOverlay(overlay, neuvopacks) {
        const content = document.getElementById('neuvopack-content');
        
        if (neuvopacks.length === 0) {
            content.innerHTML = '<div style="color: #888; font-style: italic;">Aucun neuvopack détecté</div>';
            return;
        }
        
        content.innerHTML = '';
        
        neuvopacks.forEach((neuvopack, index) => {
            const neuvopackDiv = document.createElement('div');
            
            const borderColor = neuvopack.isFull ? '#f44336' : '#4CAF50';
            const textColor = neuvopack.isFull ? '#f44336' : '#4CAF50';
            
            neuvopackDiv.style.cssText = `
                margin: 5px 0;
                padding: 8px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                border-left: 3px solid ${borderColor};
            `;
            
            neuvopackDiv.innerHTML = `
                <div style="font-weight: bold; color: ${textColor};">Neuvopack #${index + 1}</div>
                <div style="font-size: 12px; color: #ccc; margin-top: 2px;">Contenance : ${neuvopack.content}</div>
            `;
            
            content.appendChild(neuvopackDiv);
        });
        
        if (overlay.style.display === 'none') {
            return;
        }
    }

    function toggleWindow() {
        const overlay = document.getElementById('neuvopack-overlay');
        if (overlay) {
            if (overlay.style.display === 'none') {
                overlay.style.display = 'block';
            } else {
                overlay.style.display = 'none';
            }
            saveWindowSettings(overlay);
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'N') {
            e.preventDefault();
            toggleWindow();
        }
    });

    function scanInventory() {
        const overlay = document.getElementById('neuvopack-overlay') || createOverlayWindow();
        const neuvopacks = detectNeuvopacks();
        updateOverlay(overlay, neuvopacks);
    }

    let isInitialized = false;
    function init() {
        if (isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        isInitialized = true;
        
        loadSoundSettings();
        
        const overlay = createOverlayWindow();
        
        overlay.style.display = 'block';
        
        setTimeout(scanInventory, 1000);
        
        setInterval(scanInventory, 15000);
        
        setInterval(function() {
            scanInventory();
        }, 120000);
        
        let scanTimeout = null;
        const observer = new MutationObserver(function(mutations) {
            let shouldScan = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const nodesToCheck = [...mutation.addedNodes, ...mutation.removedNodes];
                    
                    for (const node of nodesToCheck) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('item') || 
                                node.classList?.contains('objet_type_Neuvopack') ||
                                node.classList?.contains('case_objet') ||
                                node.querySelector?.('.objet_type_Neuvopack, .item[class*="Neuvopack"]')) {
                                shouldScan = true;
                                break;
                            }
                        }
                    }
                    if (shouldScan) break;
                }
            }
            
            if (shouldScan) {
                if (scanTimeout) clearTimeout(scanTimeout);
                scanTimeout = setTimeout(scanInventory, 2000);
            }
        });
        
        const inventoryContainer = document.querySelector('#inventaire, .inventaire, [id*="inv"], [class*="inv"]') || document.body;
        observer.observe(inventoryContainer, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    init();

})();