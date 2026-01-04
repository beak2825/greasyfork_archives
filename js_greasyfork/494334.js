// ==UserScript==
// @name         New Jacks Agario Mod
// @namespace    All in one mod, doesnt add cheats.
// @version      1.1
// @description  Enhances Agar.io with custom controls, advanced features, and skin-maker drag-and-drop
// @author       𝓝𝑒ⓦ 𝓙ⓐ¢𝓀🕹️
// @match        https://agar.io/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/494334/New%20Jacks%20Agario%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/494334/New%20Jacks%20Agario%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove background image
    const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage = function (img) {
        if (img && img.src === "https://agar.io/img/background.png") {
            return;
        }
        originalDrawImage.apply(this, arguments);
    };

    window.addEventListener('DOMContentLoaded', function() {
        document.documentElement.removeAttribute('style');
        const adDiv = document.querySelector('#agar-io_970x90');
        if (adDiv) {
            adDiv.remove();
        }
        initAgarioMod();
        observeTargetContainer();
        initRussiaToUkraine();
    });

    //------------------------------------------------------------------
    // 1) Main Agar.io Mod
    //------------------------------------------------------------------
    function initAgarioMod() {
        const CONFIG = {
            enableMod: true,
            leftMouseAction:  'macroFeed',  // "none" | "singleFeed" | "macroFeed" | "split"
            rightMouseAction: 'split',
            singleFeedKey:    'w',
            macroFeedKey:     'm',
            doubleSplitKey:   'd',
            tripleSplitKey:   't',
            quadSplitKey:     'q',
            straightLineKey:  'e',
            zoomOutKey:       '-',
            zoomInKey:        '=',
            acidModeKey:      'a',
            skinSwitcherKey:  's',
            toggleUIKey:      'h',
            pauseMovementKey: 'p',
            enableGamepad: false,
            enableAcidMode: false,
            enableMinimap: true,
            enableCustomSkin: true,
            customSkinUrl: '',
            feedRate: 50,
            splitDelay: 50,
            gamepadSplit:        0,
            gamepadFeed:         1,
            gamepadDoubleSplit:  2,
            gamepadTripleSplit:  3,
            gamepadAcidMode:     9,
            gamepadStraightLine: 10,
        };

        let isMacroFeeding = false;
        let macroFeedInterval = null;
        let gameCanvas = null;
        let startingMousePosition = { x: 0, y: 0 };
        let currentMousePosition = { x: 0, y: 0 };
        let isStraightLineMode = false;
        let originalSkin = '';
        let modUIVisible = false;
        let isPaused = false;
        let connectedGamepads = [];
        let lastGamepadState = {};
        let isRemappingGamepad = false;
        let remappingButton = null;
        let showControlsButton = null;
        let mainOverlay = null;

        function initMod() {
            console.log('Initializing New Jacks Agario Mod...');
            createShowControlsButton();
            createMainOverlay();
            setTimeout(findGameCanvas, 2000);
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            captureOriginalSkin();
            increaseNickLimit();
            console.log('Mod initialized successfully!');
        }

        function createShowControlsButton() {
            showControlsButton = document.createElement('button');
            showControlsButton.id = 'show-controls-button';
            showControlsButton.textContent = 'Show Controls';
            showControlsButton.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 99999;
                padding: 5px 10px;
                background-color: #54c800;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                transition: background-color 0.2s ease;
            `;
            showControlsButton.addEventListener('mouseover', () => {
                showControlsButton.style.backgroundColor = '#347f01';
            });
            showControlsButton.addEventListener('mouseout', () => {
                showControlsButton.style.backgroundColor = '#54c800';
            });
            showControlsButton.addEventListener('mousedown', () => {
                showControlsButton.style.backgroundColor = '#347f01';
            });
            showControlsButton.addEventListener('mouseup', () => {
                showControlsButton.style.backgroundColor = '#54c800';
            });
            showControlsButton.onclick = toggleMainOverlay;
            document.body.appendChild(showControlsButton);
        }

        function findGameCanvas() {
            const canvases = document.getElementsByTagName('canvas');
            if (canvases.length > 0) {
                for (let i = 0; i < canvases.length; i++) {
                    if (canvases[i].width > 500 && canvases[i].height > 500) {
                        gameCanvas = canvases[i];
                        break;
                    }
                }
                if (gameCanvas) {
                    console.log('Game canvas found!');
                    gameCanvas.addEventListener('mousedown', handleMouseDown);
                    gameCanvas.addEventListener('mouseup', handleMouseUp);
                    gameCanvas.addEventListener('contextmenu', (e) => e.preventDefault() );
                    gameCanvas.addEventListener('mousemove', (e) => {
                        currentMousePosition.x = e.clientX;
                        currentMousePosition.y = e.clientY;
                        if (isStraightLineMode) {
                            applyLineConstraint();
                        }
                    });
                    showNotification('Advanced Controls Active! Press H for help or to toggle UI.');
                } else {
                    console.log('Game canvas not found, retrying...');
                    setTimeout(findGameCanvas, 2000);
                }
            } else {
                console.log('No canvases found, retrying...');
                setTimeout(findGameCanvas, 2000);
            }
        }

        function handleMouseDown(e) {
            if (!CONFIG.enableMod) return;
            if (isPaused) return;
            if (e.button === 0) {
                doMouseAction(CONFIG.leftMouseAction, 'down');
            } else if (e.button === 2) {
                doMouseAction(CONFIG.rightMouseAction, 'down');
            }
        }
        function handleMouseUp(e) {
            if (!CONFIG.enableMod) return;
            if (isPaused) return;
            if (e.button === 0) {
                doMouseAction(CONFIG.leftMouseAction, 'up');
            } else if (e.button === 2) {
                doMouseAction(CONFIG.rightMouseAction, 'up');
            }
        }

        function doMouseAction(action, phase) {
            if (action === 'none') {
                return;
            }
            else if (action === 'singleFeed') {
                if (phase === 'down') {
                    window.core.eject();
                }
            }
            else if (action === 'macroFeed') {
                if (phase === 'down') {
                    startMacroFeed();
                } else if (phase === 'up') {
                    stopMacroFeed();
                }
            }
            else if (action === 'split') {
                if (phase === 'down') {
                    window.core.split();
                }
            }
        }

        function handleKeyDown(e) {
            if (e.key.toLowerCase() === CONFIG.toggleUIKey) {
                toggleMainOverlay();
                return;
            }
            if (!CONFIG.enableMod) return;
            if (isPaused) { }
            switch (e.key.toLowerCase()) {
                case CONFIG.singleFeedKey:
                    window.core.eject();
                    break;
                case CONFIG.macroFeedKey:
                    startMacroFeed();
                    break;
                case CONFIG.doubleSplitKey:
                    performMultiSplit(2);
                    break;
                case CONFIG.tripleSplitKey:
                    performMultiSplit(3);
                    break;
                case CONFIG.quadSplitKey:
                    performMultiSplit(4);
                    break;
                case CONFIG.straightLineKey:
                    toggleStraightLineMode();
                    break;
                case CONFIG.zoomOutKey:
                    window.core.playerZoom(0.8);
                    break;
                case CONFIG.zoomInKey:
                    window.core.playerZoom(1.2);
                    break;
                case CONFIG.acidModeKey:
                    toggleAcidMode();
                    break;
                case CONFIG.skinSwitcherKey:
                    openSkinSwitcherUI();
                    break;
                case CONFIG.pauseMovementKey:
                    isPaused = !isPaused;
                    showNotification(isPaused ? 'Movement is paused.' : 'Movement unpaused.');
                    break;
            }
        }
        function handleKeyUp(e) {
            if (!CONFIG.enableMod) return;
            if (e.key.toLowerCase() === CONFIG.macroFeedKey) {
                stopMacroFeed();
            }
        }

        function startMacroFeed() {
            if (isMacroFeeding) return;
            isMacroFeeding = true;
            showNotification('Macro feeding started');
            window.core.eject();
            macroFeedInterval = setInterval(() => {
                window.core.eject();
            }, CONFIG.feedRate);
        }
        function stopMacroFeed() {
            if (!isMacroFeeding) return;
            clearInterval(macroFeedInterval);
            isMacroFeeding = false;
            showNotification('Macro feeding stopped');
        }

        function performMultiSplit(count) {
            if (!window.core.playerHasCells || !window.core.playerHasCells()) {
                showNotification('Cannot split when dead');
                return;
            }
            showNotification(`${count}x Split`);
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    window.core.split();
                }, CONFIG.splitDelay * i);
            }
        }

        function toggleStraightLineMode() {
            isStraightLineMode = !isStraightLineMode;
            if (isStraightLineMode) {
                startingMousePosition.x = currentMousePosition.x;
                startingMousePosition.y = currentMousePosition.y;
                showNotification('Straight line mode ON');
            } else {
                showNotification('Straight line mode OFF');
            }
        }
        function applyLineConstraint() {
            if (!isStraightLineMode) return;
            const dx = currentMousePosition.x - startingMousePosition.x;
            const dy = currentMousePosition.y - startingMousePosition.y;
            const angle = Math.atan2(dy, dx);
            const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
            const distance = Math.sqrt(dx*dx + dy*dy);
            const newX = startingMousePosition.x + Math.cos(snappedAngle)*distance;
            const newY = startingMousePosition.y + Math.sin(snappedAngle)*distance;
            window.core.setTarget(newX, newY);
        }

        function increaseNickLimit() {
            const updateNickInput = () => {
                const nickInputs = document.querySelectorAll('input[id="nick"], input[placeholder="Nick"], input[maxlength="15"]');
                if (nickInputs.length > 0) {
                    nickInputs.forEach(input => {
                        input.setAttribute('maxlength', '50');
                    });
                    showNotification('Nickname limit increased to 50 characters');
                } else {
                    setTimeout(updateNickInput, 2000);
                }
            };
            updateNickInput();
            try {
                const observer = new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length) {
                            for (const node of mutation.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    const inputs = node.querySelectorAll ?
                                        node.querySelectorAll('input[id="nick"], input[placeholder="Nick"], input[maxlength="15"]') : [];
                                    if (
                                        node.tagName === 'INPUT' &&
                                        (node.id === 'nick' || node.placeholder === 'Nick' || node.getAttribute('maxlength') === '15')
                                    ) {
                                        node.setAttribute('maxlength', '50');
                                    }
                                    if (inputs.length > 0) {
                                        inputs.forEach(input => {
                                            input.setAttribute('maxlength', '50');
                                        });
                                    }
                                }
                            }
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            } catch (e) {
                console.error('Error setting up MutationObserver:', e);
            }
        }

        function showNotification(message) {
            let notification = document.getElementById('agario-mod-notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'agario-mod-notification';
                notification.style.cssText = `
                    position: absolute;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    z-index: 1000;
                    transition: opacity 0.5s;
                    pointer-events: none;
                `;
                document.body.appendChild(notification);
            }
            notification.textContent = message;
            notification.style.opacity = '1';
            clearTimeout(notification.fadeTimeout);
            notification.fadeTimeout = setTimeout(() => {
                notification.style.opacity = '0';
            }, 2000);
        }

        function captureOriginalSkin() {
            if (window.core) {
                try {
                    const observer = new MutationObserver((mutations, obs) => {
                        const skinContainer = document.querySelector('#skin-preview');
                        if (skinContainer) {
                            const skinImg = skinContainer.querySelector('img');
                            if (skinImg && skinImg.src) {
                                originalSkin = skinImg.src;
                                obs.disconnect();
                            }
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                    try {
                        const localData = localStorage.getItem('ogarioSettings');
                        if (localData) {
                            const settings = JSON.parse(localData);
                            if (settings && settings.skin) {
                                originalSkin = settings.skin;
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to get skin from localStorage', e);
                    }
                } catch (e) {
                    console.warn('Failed to capture original skin', e);
                }
            }
        }

        function applyCustomSkin(url) {
            if (!window.core) return;
            try {
                if (!originalSkin) {
                    captureOriginalSkin();
                }
                window.core.registerSkin(null, "customskin", url, 0, 0);
                window.core.loadSkin("customskin");
                CONFIG.customSkinUrl = url;
                CONFIG.enableCustomSkin = true;
                showNotification('Custom skin applied');
            } catch (e) {
                showNotification('Failed to apply skin: ' + e.message);
                console.error('Failed to apply skin:', e);
            }
        }

        function toggleCustomSkin() {
            CONFIG.enableCustomSkin = !CONFIG.enableCustomSkin;
            if (CONFIG.enableCustomSkin && CONFIG.customSkinUrl) {
                applyCustomSkin(CONFIG.customSkinUrl);
            } else {
                if (window.core) {
                    if (originalSkin && originalSkin.startsWith('http')) {
                        window.core.registerSkin(null, "originalskin", originalSkin, 0, 0);
                        window.core.loadSkin("originalskin");
                        showNotification('Restored original skin');
                    } else if (originalSkin) {
                        window.core.loadSkin(originalSkin);
                        showNotification('Restored original skin');
                    } else {
                        window.core.loadSkin("");
                        showNotification('Custom skin disabled');
                    }
                }
            }
        }

        function loadSkinsFromStorage() {
            let data = localStorage.getItem('myCustomSkins');
            if (!data) return [];
            try {
                return JSON.parse(data);
            } catch(e) {
                console.error('Failed to parse myCustomSkins:', e);
                return [];
            }
        }
        function saveSkinsToStorage(arr) {
            localStorage.setItem('myCustomSkins', JSON.stringify(arr));
        }

        function openSkinSwitcherUI() {
            let existing = document.getElementById('skin-switcher-overlay');
            if (existing) {
                existing.style.display = 'flex';
                return;
            }
            const overlay = document.createElement('div');
            overlay.id = 'skin-switcher-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 10%;
                left: 10%;
                width: 640px;
                max-width: 90%;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 8px;
                padding: 20px;
                z-index: 1000000;
                display: flex;
                flex-direction: column;
                box-shadow: 0 0 15px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(overlay);
            const titleRow = document.createElement('div');
            titleRow.style.cssText = 'width: 100%; display: flex; justify-content: space-between; margin-bottom: 10px;';
            const titleH2 = document.createElement('h2');
            titleH2.textContent = 'Skin Switcher';
            titleH2.style.margin = '0';
            titleRow.appendChild(titleH2);
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'X';
            closeBtn.style.cssText = `
                background-color: #00d3ff;
                border: 1px solid #ff0000;
                color: #ff0000;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                padding: 0 8px;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            closeBtn.onclick = () => {
                overlay.style.display = 'none';
            };
            titleRow.appendChild(closeBtn);
            overlay.appendChild(titleRow);
            const previewContainer = document.createElement('div');
            previewContainer.style.cssText = `
                position: relative;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                overflow: hidden;
                margin: 10px auto 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f0f0f0;
            `;
            overlay.appendChild(previewContainer);
            const previewImg = document.createElement('img');
            previewImg.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
            `;
            previewContainer.appendChild(previewImg);
            const arrowsContainer = document.createElement('div');
            arrowsContainer.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 200px;
                margin: 10px auto 0 auto;
            `;
            overlay.appendChild(arrowsContainer);
            const leftArrow = document.createElement('button');
            leftArrow.textContent = '◀';
            leftArrow.style.cssText = arrowButtonStyle();
            leftArrow.addEventListener('mouseover', () => {
                leftArrow.style.backgroundColor = '#347f01';
            });
            leftArrow.addEventListener('mouseout', () => {
                leftArrow.style.backgroundColor = '#54c800';
            });
            leftArrow.addEventListener('mousedown', () => {
                leftArrow.style.backgroundColor = '#347f01';
            });
            leftArrow.addEventListener('mouseup', () => {
                leftArrow.style.backgroundColor = '#54c800';
            });
            arrowsContainer.appendChild(leftArrow);
            const rightArrow = document.createElement('button');
            rightArrow.textContent = '▶';
            rightArrow.style.cssText = arrowButtonStyle();
            rightArrow.addEventListener('mouseover', () => {
                rightArrow.style.backgroundColor = '#347f01';
            });
            rightArrow.addEventListener('mouseout', () => {
                rightArrow.style.backgroundColor = '#54c800';
            });
            rightArrow.addEventListener('mousedown', () => {
                rightArrow.style.backgroundColor = '#347f01';
            });
            rightArrow.addEventListener('mouseup', () => {
                rightArrow.style.backgroundColor = '#54c800';
            });
            arrowsContainer.appendChild(rightArrow);
            const skinUrlLabel = document.createElement('div');
            skinUrlLabel.style.cssText = 'margin-top: 10px; text-align: center; font-style: italic; color: #333;';
            overlay.appendChild(skinUrlLabel);
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.placeholder = 'https://i.imgur.com/skin.png';
            urlInput.style.cssText = `
                margin: 10px auto 0 auto;
                width: 80%;
                padding: 5px;
                border: 1px solid #ccc;
                border-radius: 3px;
                display: block;
            `;
            overlay.appendChild(urlInput);
            const buttonsContainer = document.createElement('div');
            buttonsContainer.style.cssText = 'display: flex; justify-content: space-around; margin-top: 10px;';
            overlay.appendChild(buttonsContainer);
            const addSkinBtn = document.createElement('button');
            addSkinBtn.textContent = 'Add Skin';
            addSkinBtn.style.cssText = buttonStyle();
            addSkinBtn.onclick = addSkin;
            buttonsContainer.appendChild(addSkinBtn);
            const useSkinBtn = document.createElement('button');
            useSkinBtn.textContent = 'Use This Skin';
            useSkinBtn.style.cssText = buttonStyle();
            useSkinBtn.onclick = useSkin;
            buttonsContainer.appendChild(useSkinBtn);
            const deleteSkinBtn = document.createElement('button');
            deleteSkinBtn.textContent = 'Delete Skin';
            deleteSkinBtn.style.cssText = `
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                background-color: #ff0000;
                color: #fff;
                cursor: pointer;
                transition: background-color 0.2s ease;
            `;
            deleteSkinBtn.addEventListener('mouseover', () => {
                deleteSkinBtn.style.backgroundColor = '#cc0000';
            });
            deleteSkinBtn.addEventListener('mouseout', () => {
                deleteSkinBtn.style.backgroundColor = '#ff0000';
            });
            deleteSkinBtn.addEventListener('mousedown', () => {
                deleteSkinBtn.style.backgroundColor = '#cc0000';
            });
            deleteSkinBtn.addEventListener('mouseup', () => {
                deleteSkinBtn.style.backgroundColor = '#ff0000';
            });
            deleteSkinBtn.onclick = deleteSkin;
            buttonsContainer.appendChild(deleteSkinBtn);
            let skins = loadSkinsFromStorage();
            let currentIndex = 0;
            function renderSkins() {
                if (skins.length === 0) {
                    currentIndex = 0;
                    previewImg.src = '';
                    skinUrlLabel.textContent = 'No skins yet';
                } else {
                    if (currentIndex >= skins.length) currentIndex = skins.length - 1;
                    if (currentIndex < 0) currentIndex = 0;
                    previewImg.src = skins[currentIndex];
                    skinUrlLabel.textContent = skins[currentIndex];
                }
            }
            leftArrow.onclick = () => {
                if (skins.length > 0) {
                    currentIndex = (currentIndex - 1 + skins.length) % skins.length;
                    renderSkins();
                }
            };
            rightArrow.onclick = () => {
                if (skins.length > 0) {
                    currentIndex = (currentIndex + 1) % skins.length;
                    renderSkins();
                }
            };
            function addSkin() {
                const url = urlInput.value.trim();
                if (!url) return;
                skins.push(url);
                saveSkinsToStorage(skins);
                urlInput.value = '';
                currentIndex = skins.length - 1;
                renderSkins();
            }
            function useSkin() {
                if (!skins[currentIndex]) {
                    alert('No skin selected!');
                    return;
                }
                applyCustomSkin(skins[currentIndex]);
                overlay.style.display = 'none';
            }
            function deleteSkin() {
                if (skins.length === 0) {
                    alert('No skins to delete!');
                    return;
                }
                if (confirm('Are you sure you want to delete this skin?')) {
                    skins.splice(currentIndex, 1);
                    saveSkinsToStorage(skins);
                    if (currentIndex >= skins.length) {
                        currentIndex = skins.length - 1;
                    }
                    renderSkins();
                }
            }
            function arrowButtonStyle() {
                return `
                    font-size: 24px;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    cursor: pointer;
                    border: none;
                    background: #54c800;
                    color: #fff;
                    transition: background-color 0.2s ease;
                `;
            }
            function buttonStyle() {
                return `
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    background-color: #54c800;
                    color: #fff;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                `;
            }
            renderSkins();
        }

        function createMainOverlay() {
            mainOverlay = document.createElement('div');
            mainOverlay.id = 'main-overlay';
            mainOverlay.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 700px;
                max-width: 90%;
                background: #fff;
                border-radius: 8px;
                padding: 20px;
                z-index: 999999;
                display: block;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(mainOverlay);
            const titleBar = document.createElement('div');
            titleBar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';
            const h2 = document.createElement('h2');
            h2.textContent = 'Advanced Controls';
            h2.style.margin = '0';
            titleBar.appendChild(h2);
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'X';
            closeBtn.style.cssText = `
                background-color: #00d3ff;
                border: 1px solid #ff0000;
                color: #ff0000;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                padding: 0 8px;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            closeBtn.onclick = toggleMainOverlay;
            titleBar.appendChild(closeBtn);
            mainOverlay.appendChild(titleBar);
            const mouseActionsContainer = document.createElement('div');
            mouseActionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px;';
            mouseActionsContainer.appendChild(createMouseActionRow('Left Mouse Action', 'leftMouseAction'));
            mouseActionsContainer.appendChild(createMouseActionRow('Right Mouse Action','rightMouseAction'));
            mainOverlay.appendChild(mouseActionsContainer);
            mainOverlay.appendChild(document.createElement('hr'));
            const columnsDiv = document.createElement('div');
            columnsDiv.style.cssText = 'display: flex; gap: 20px; margin-top: 10px;';
            const pcCol = document.createElement('div');
            pcCol.style.cssText = 'flex:1; background: rgba(255,255,255,0.6); padding: 10px; border-radius: 5px;';
            pcCol.innerHTML = '<h3>PC Hotkeys</h3>';
            const pcHotkeysDiv = document.createElement('div');
            pcCol.appendChild(pcHotkeysDiv);
            columnsDiv.appendChild(pcCol);
            const gpCol = document.createElement('div');
            gpCol.style.cssText = 'flex:1; background: rgba(255,255,255,0.6); padding: 10px; border-radius: 5px;';
            gpCol.innerHTML = '<h3>Gamepad</h3>';
            const gpDiv = document.createElement('div');
            gpCol.appendChild(gpDiv);
            columnsDiv.appendChild(gpCol);
            mainOverlay.appendChild(columnsDiv);
            const bottomDiv = document.createElement('div');
            bottomDiv.style.cssText = 'margin-top: 20px; display: flex; flex-wrap: wrap; gap: 10px;';
            const toggleModBtn = document.createElement('button');
            toggleModBtn.textContent = CONFIG.enableMod ? 'Disable Mod' : 'Enable Mod';
            toggleModBtn.style.cssText = buttonStyle();
            toggleModBtn.onclick = () => {
                CONFIG.enableMod = !CONFIG.enableMod;
                toggleModBtn.textContent = CONFIG.enableMod ? 'Disable Mod' : 'Enable Mod';
                if (!CONFIG.enableMod) {
                    stopMacroFeed();
                    isStraightLineMode = false;
                }
            };
            bottomDiv.appendChild(toggleModBtn);
            const acidBtn = document.createElement('button');
            acidBtn.textContent = CONFIG.enableAcidMode ? 'Acid Mode: ON' : 'Acid Mode: OFF';
            acidBtn.style.cssText = buttonStyle();
            acidBtn.onclick = () => {
                toggleAcidMode();
                acidBtn.textContent = CONFIG.enableAcidMode ? 'Acid Mode: ON' : 'Acid Mode: OFF';
            };
            bottomDiv.appendChild(acidBtn);
            const skinBtn = document.createElement('button');
            skinBtn.textContent = 'Change Skin';
            skinBtn.style.cssText = buttonStyle();
            skinBtn.onclick = openSkinSwitcherUI;
            bottomDiv.appendChild(skinBtn);
            const pauseBtn = document.createElement('button');
            pauseBtn.textContent = 'Pause Movement';
            pauseBtn.style.cssText = buttonStyle();
            pauseBtn.onclick = () => {
                isPaused = !isPaused;
                pauseBtn.textContent = isPaused ? 'Unpause Movement' : 'Pause Movement';
                showNotification(isPaused ? 'Movement is paused.' : 'Movement unpaused.');
            };
            bottomDiv.appendChild(pauseBtn);
            mainOverlay.appendChild(bottomDiv);
            buildPCHotkeysUI(pcHotkeysDiv);
            buildGamepadUI(gpDiv);
            mainOverlay.style.display = 'none';

            function createMouseActionRow(label, configKey) {
                const row = document.createElement('div');
                row.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px;';
                const lbl = document.createElement('span');
                lbl.textContent = label + ': ';
                lbl.style.width = '150px';
                row.appendChild(lbl);
                const select = document.createElement('select');
                select.style.cssText = `
                    border: 1px solid #777;
                    border-radius: 4px;
                    padding: 2px 4px;
                `;
                const actions = [
                    { value: 'none',       text: 'None' },
                    { value: 'singleFeed', text: 'Single Feed' },
                    { value: 'macroFeed',  text: 'Macro Feed' },
                    { value: 'split',      text: 'Split' }
                ];
                actions.forEach(a => {
                    const opt = document.createElement('option');
                    opt.value = a.value;
                    opt.textContent = a.text;
                    select.appendChild(opt);
                });
                select.value = CONFIG[configKey];
                select.onchange = () => {
                    CONFIG[configKey] = select.value;
                    showNotification(`${label} changed to: ${select.value}`);
                };
                row.appendChild(select);
                return row;
            }
        }

        function toggleMainOverlay() {
            modUIVisible = !modUIVisible;
            mainOverlay.style.display = modUIVisible ? 'block' : 'none';
            showControlsButton.textContent = modUIVisible ? 'Hide Controls' : 'Show Controls';
        }

        function buttonStyle() {
            return `
                padding: 6px 12px;
                font-size: 14px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                background-color: #54c800;
                color: #fff;
                transition: background-color 0.2s ease;
            `;
        }

        function buildPCHotkeysUI(container) {
            container.appendChild(createHotkeyRow('Single Feed',      'singleFeedKey'));
            container.appendChild(createHotkeyRow('Macro Feed',       'macroFeedKey'));
            container.appendChild(createHotkeyRow('Double Split',     'doubleSplitKey'));
            container.appendChild(createHotkeyRow('Triple Split',     'tripleSplitKey'));
            container.appendChild(createHotkeyRow('Quad Split',       'quadSplitKey'));
            container.appendChild(createHotkeyRow('Straight Line',    'straightLineKey'));
            container.appendChild(createHotkeyRow('Acid Mode',        'acidModeKey'));
            container.appendChild(createHotkeyRow('Skin Switcher',    'skinSwitcherKey'));
            container.appendChild(createHotkeyRow('Toggle UI',        'toggleUIKey'));
            container.appendChild(createHotkeyRow('Zoom Out',         'zoomOutKey'));
            container.appendChild(createHotkeyRow('Zoom In',          'zoomInKey'));
            container.appendChild(createHotkeyRow('Pause Movement',   'pauseMovementKey'));
        }

        function createHotkeyRow(label, configKey) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px;';
            const lbl = document.createElement('span');
            lbl.textContent = label + ': ';
            lbl.style.width = '120px';
            row.appendChild(lbl);
            const input = document.createElement('input');
            input.type = 'text';
            input.readOnly = true;
            input.value = CONFIG[configKey];
            input.style.cssText = `
                width: 50px;
                text-align: center;
                border: 1px solid #777;
                border-radius: 3px;
                background-color: #f0f0f0;
                cursor: pointer;
            `;
            row.appendChild(input);
            let waitingForKey = false;
            input.addEventListener('click', () => {
                waitingForKey = true;
                input.value = '???';
                input.focus();
            });
            input.addEventListener('keydown', (evt) => {
                if (!waitingForKey) return;
                evt.preventDefault();
                evt.stopPropagation();
                const newKey = evt.key.toLowerCase();
                CONFIG[configKey] = newKey;
                input.value = newKey;
                waitingForKey = false;
                showNotification(`${label} changed to: ${newKey.toUpperCase()}`);
            });
            return row;
        }

        function buildGamepadUI(container) {
            const row = document.createElement('div');
            row.style.marginBottom = '10px';
            const label = document.createElement('label');
            label.textContent = 'Gamepad Enabled: ';
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = CONFIG.enableGamepad;
            cb.style.marginLeft = '5px';
            cb.onchange = () => {
                toggleGamepadMode(cb.checked);
            };
            row.appendChild(label);
            row.appendChild(cb);
            container.appendChild(row);
            container.appendChild(createGamepadRow('Split Button',         'gamepadSplit',        CONFIG.gamepadSplit));
            container.appendChild(createGamepadRow('Feed Button',          'gamepadFeed',         CONFIG.gamepadFeed));
            container.appendChild(createGamepadRow('Double Split',         'gamepadDoubleSplit',  CONFIG.gamepadDoubleSplit));
            container.appendChild(createGamepadRow('Triple Split',         'gamepadTripleSplit',  CONFIG.gamepadTripleSplit));
            container.appendChild(createGamepadRow('Acid Mode',            'gamepadAcidMode',     CONFIG.gamepadAcidMode));
            container.appendChild(createGamepadRow('Straight Line',        'gamepadStraightLine', CONFIG.gamepadStraightLine));
        }

        function createGamepadRow(label, configKey, defaultVal) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center; margin-bottom: 5px;';
            const lbl = document.createElement('span');
            lbl.textContent = label + ': ';
            lbl.style.width = '120px';
            row.appendChild(lbl);
            const input = document.createElement('input');
            input.type = 'text';
            input.readOnly = true;
            input.value = `Button ${defaultVal}`;
            input.style.cssText = `
                width: 80px;
                text-align: center;
                border: 1px solid #777;
                border-radius: 3px;
                background-color: #54c800;
                color: #fff;
                cursor: pointer;
                transition: background-color 0.2s ease;
            `;
            input.addEventListener('mouseover', () => {
                input.style.backgroundColor = '#347f01';
            });
            input.addEventListener('mouseout', () => {
                input.style.backgroundColor = '#54c800';
            });
            input.addEventListener('mousedown', () => {
                input.style.backgroundColor = '#347f01';
            });
            input.addEventListener('mouseup', () => {
                input.style.backgroundColor = '#54c800';
            });
            input.addEventListener('click', () => {
                input.value = "Press Button...";
                input.style.backgroundColor = '#ffee99';
                isRemappingGamepad = true;
                remappingButton = configKey;
                setTimeout(() => {
                    if (input.value === "Press Button...") {
                        input.value = `Button ${CONFIG[configKey]}`;
                        input.style.backgroundColor = '#f0f0f0';
                        isRemappingGamepad = false;
                        remappingButton = null;
                    }
                }, 5000);
            });
            row.appendChild(input);
            return row;
        }

        function setupGamepadSupport() {
            window.addEventListener("gamepadconnected", handleGamepadConnected);
            window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
            if (CONFIG.enableGamepad) {
                startGamepadPolling();
            }
        }
        function handleGamepadConnected(event) {
            const gamepad = event.gamepad;
            connectedGamepads[gamepad.index] = gamepad;
            console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}`);
            showNotification(`Gamepad connected: ${gamepad.id.split('(')[0]}`);
            if (CONFIG.enableGamepad) {
                startGamepadPolling();
            }
        }
        function handleGamepadDisconnected(event) {
            const gamepad = event.gamepad;
            console.log(`Gamepad disconnected from index ${gamepad.index}: ${gamepad.id}`);
            showNotification('Gamepad disconnected');
            delete connectedGamepads[gamepad.index];
            const hasGamepads = Object.keys(connectedGamepads).length > 0;
            if (!hasGamepads) {
                stopGamepadPolling();
            }
        }
        let gamepadPollingId = null;
        function startGamepadPolling() {
            if (gamepadPollingId === null) {
                gamepadPollingId = setInterval(pollGamepads, 16);
                console.log('Gamepad polling started');
            }
        }
        function stopGamepadPolling() {
            if (gamepadPollingId !== null) {
                clearInterval(gamepadPollingId);
                gamepadPollingId = null;
                console.log('Gamepad polling stopped');
            }
        }
        function toggleGamepadMode(enabled) {
            CONFIG.enableGamepad = enabled;
            if (enabled) {
                startGamepadPolling();
                showNotification('Gamepad mode enabled');
            } else {
                stopGamepadPolling();
                showNotification('Gamepad mode disabled');
            }
        }
        function pollGamepads() {
            if (!CONFIG.enableGamepad) return;
            const gamepads = navigator.getGamepads
                ? navigator.getGamepads()
                : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (!gamepad) continue;
                if (!lastGamepadState[gamepad.index]) {
                    lastGamepadState[gamepad.index] = {
                        buttons: Array(gamepad.buttons.length).fill(false),
                        axes: Array(gamepad.axes.length).fill(0)
                    };
                }
                for (let j = 0; j < gamepad.buttons.length; j++) {
                    const isPressed = gamepad.buttons[j].pressed;
                    const wasPressed = lastGamepadState[gamepad.index].buttons[j];
                    if (isPressed && !wasPressed) {
                        handleGamepadButtonPressed(gamepad.index, j);
                    } else if (!isPressed && wasPressed) {
                        handleGamepadButtonReleased(gamepad.index, j);
                    }
                    lastGamepadState[gamepad.index].buttons[j] = isPressed;
                }
                for (let j = 0; j < gamepad.axes.length; j++) {
                    const axisValue = gamepad.axes[j];
                    const prevAxisValue = lastGamepadState[gamepad.index].axes[j];
                    if (Math.abs(axisValue - prevAxisValue) > 0.1) {
                        handleGamepadAxisMoved(gamepad.index, j, axisValue);
                    }
                    lastGamepadState[gamepad.index].axes[j] = axisValue;
                }
            }
            if (isPaused && gameCanvas && window.core) {
                const rect = gameCanvas.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                window.core.setTarget(centerX, centerY);
            }
        }
        function handleGamepadButtonPressed(gamepadIndex, buttonIndex) {
            if (isRemappingGamepad) {
                if (remappingButton) {
                    CONFIG[remappingButton] = buttonIndex;
                    showNotification(`Mapped ${remappingButton} to button ${buttonIndex}`);
                    isRemappingGamepad = false;
                    const gpInputs = document.querySelectorAll('input[value="Press Button..."]');
                    for (let i = 0; i < gpInputs.length; i++) {
                        const input = gpInputs[i];
                        if (input.style.backgroundColor === 'rgb(255, 238, 153)') {
                            input.value = `Button ${buttonIndex}`;
                            input.style.backgroundColor = '#f0f0f0';
                            break;
                        }
                    }
                    remappingButton = null;
                }
                return;
            }
            if (!window.core || isPaused) return;
            if (buttonIndex === CONFIG.gamepadSplit) {
                window.core.split();
            }
            else if (buttonIndex === CONFIG.gamepadFeed) {
                window.core.eject();
            }
            else if (buttonIndex === CONFIG.gamepadDoubleSplit) {
                performMultiSplit(2);
            }
            else if (buttonIndex === CONFIG.gamepadTripleSplit) {
                performMultiSplit(3);
            }
            else if (buttonIndex === CONFIG.gamepadAcidMode) {
                toggleAcidMode();
            }
            else if (buttonIndex === CONFIG.gamepadStraightLine) {
                toggleStraightLineMode();
            }
        }
        function handleGamepadButtonReleased() { }
        function handleGamepadAxisMoved(gamepadIndex, axisIndex, value) {
            if (isPaused) return;
            if (axisIndex <= 1 && window.core && gameCanvas) {
                const gamepad = navigator.getGamepads()[gamepadIndex];
                const horizontalAxis = gamepad.axes[0];
                const verticalAxis = gamepad.axes[1];
                const deadzone = 0.15;
                let x = Math.abs(horizontalAxis) < deadzone ? 0 : horizontalAxis;
                let y = Math.abs(verticalAxis) < deadzone ? 0 : verticalAxis;
                if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
                    const rect = gameCanvas.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const sensitivity = 200;
                    const targetX = centerX + (x * sensitivity);
                    const targetY = centerY + (y * sensitivity);
                    window.core.setTarget(targetX, targetY);
                }
            }
        }

        function toggleAcidMode() {
            if (!window.core) return;
            CONFIG.enableAcidMode = !CONFIG.enableAcidMode;
            window.core.setAcid(CONFIG.enableAcidMode);
            const acidButtons = document.querySelectorAll('button');
            for (let i = 0; i < acidButtons.length; i++) {
                if (acidButtons[i].textContent.includes('Acid Mode')) {
                    acidButtons[i].textContent = CONFIG.enableAcidMode ? 'Acid Mode: ON' : 'Acid Mode: OFF';
                }
            }
            showNotification(CONFIG.enableAcidMode ? 'Acid mode: ON' : 'Acid mode: OFF');
        }

        function checkCoreAccess() {
            if (typeof window.core === 'undefined') {
                console.log('Waiting for core functions to load...');
                setTimeout(checkCoreAccess, 1000);
                return;
            }
            console.log('Core functions found!');
            if (CONFIG.enableMinimap && window.core) {
                window.core.setMinimap(true);
                window.core.minimizeMinimap(false);
                window.core.playersMinimap(true);
            }
            if (CONFIG.enableAcidMode && window.core) {
                window.core.setAcid(true);
            }
            setupGamepadSupport();
        }

        initMod();
        checkCoreAccess();
    }

    //------------------------------------------------------------------
    // 4) "Skin Maker" with Drag-and-Drop
    //------------------------------------------------------------------
    function convertImageFileToBase64(file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const base64 = reader.result;
            drawImage(base64);
        };
        reader.readAsDataURL(file);
    }
    function convertImageToBase64(event) {
        const file = event.target.files[0];
        if (file) {
            convertImageFileToBase64(file);
        }
    }
    function drawImage(base64) {
        const canvas = document.getElementById("skin-editor-canvas");
        if (!canvas) {
            console.warn("No skin-editor-canvas found to draw on!");
            return;
        }
        const context = canvas.getContext("2d");
        const image = new Image();
        image.onload = function () {
            canvas.width = 512;
            canvas.height = 512;
            context.drawImage(image, 0, 0, 512, 512);
            context.save();
        };
        image.src = base64;
    }
    function createImageButton() {
        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.display = "inline-block";
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.id = "customImageUpload";
        input.style.width = "100%";
        input.style.height = "100%";
        input.style.opacity = "0";
        input.style.position = "absolute";
        input.style.left = "0";
        input.style.top = "0";
        input.style.zIndex = "1";
        const button = document.createElement("button");
        button.textContent = "Upload Image";
        button.style.color = "#fff";
        button.style.backgroundColor = "#54c800";
        button.style.border = "1px solid black";
        button.style.padding = "5px 10px";
        button.style.cursor = "pointer";
        container.appendChild(input);
        container.appendChild(button);
        input.addEventListener("change", convertImageToBase64);
        return container;
    }
    function createDragAndDropZone() {
        const dropZone = document.createElement('div');
        dropZone.id = 'dropZone';
        dropZone.style.border = "2px dashed #ccc";
        dropZone.style.padding = "10px";
        dropZone.style.marginTop = "10px";
        dropZone.style.textAlign = "center";
        dropZone.textContent = "Drag & drop your image file here";
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.style.backgroundColor = "#ddd";
        });
        dropZone.addEventListener("dragleave", (e) => {
            e.preventDefault();
            dropZone.style.backgroundColor = "";
        });
        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.style.backgroundColor = "";
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                convertImageFileToBase64(file);
            } else {
                alert("Please drop an image file only!");
            }
        });
        return dropZone;
    }
    function insertImageButtonAndDropZone(container, target) {
        if (target) {
            const newDiv = document.createElement("div");
            newDiv.style.marginTop = "50px";
            newDiv.appendChild(container);
            const dropZone = createDragAndDropZone();
            newDiv.appendChild(dropZone);
            const saveArea = target.querySelector(".save");
            if (saveArea) {
                saveArea.appendChild(newDiv);
            }
        }
    }
    function observeTargetContainer() {
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const target = document.querySelector(".right-tools");
                    if (target && target.querySelector(".save")) {
                        if (
                            !target.querySelector("#customImageUpload") &&
                            !target.querySelector("#dropZone")
                        ) {
                            const button = createImageButton();
                            insertImageButtonAndDropZone(button, target);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    //------------------------------------------------------------------
    // 5) Russia -> Ukraine Replacement
    //------------------------------------------------------------------
    function initRussiaToUkraine() {
        function replaceText() {
            const options = document.querySelectorAll('option[value="RU-Russia"]');
            options.forEach(option => {
                const text = option.textContent;
                if (text.includes("Russia")) {
                    option.textContent = text.replace("Russia", "Ukraine");
                }
            });
        }
        replaceText();
        const observer = new MutationObserver(replaceText);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
