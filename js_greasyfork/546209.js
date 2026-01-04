// ==UserScript==
// @license MIT
// @name         Subtitle Overlay Tool 字幕遮挡工具
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Create a draggable, resizable overlay to cover subtitles on any website
// @author       Fei
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/546209/Subtitle%20Overlay%20Tool%20%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/546209/Subtitle%20Overlay%20Tool%20%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let overlay = null;
    let isVisible = false;
    let isDragging = false;
    let isResizing = false;
    let currentResizeHandle = null;
    let dragOffset = { x: 0, y: 0 };
    let resizeStartSize = { width: 0, height: 0 };
    let resizeStartPos = { left: 0, top: 0 };
    let resizeStartMouse = { x: 0, y: 0 };
    let opacity = 1.0; // Start fully opaque
	let minOpacity = 0.05;

    // Shortcut configuration
    let currentShortcut = {
        key: 'b',
        ctrlKey: true,
        shiftKey: false,
        altKey: false
    };

    // Load saved shortcut configuration
    function loadShortcutConfig() {
        const saved = GM_getValue('shortcut_config', null);
        if (saved) {
            try {
                currentShortcut = JSON.parse(saved);
            } catch (e) {
                console.log('Error loading shortcut config, using default');
            }
        }
    }

    // Save shortcut configuration
    function saveShortcutConfig() {
        GM_setValue('shortcut_config', JSON.stringify(currentShortcut));
    }

    // Get shortcut display string
    function getShortcutDisplay() {
        let parts = [];
        if (currentShortcut.ctrlKey) parts.push('Ctrl');
        if (currentShortcut.shiftKey) parts.push('Shift');
        if (currentShortcut.altKey) parts.push('Alt');
        parts.push(currentShortcut.key.toUpperCase());
        return parts.join('+');
    }

    // Show shortcut configuration dialog
    function showShortcutConfig() {
        // Remove existing dialog if any
        const existingDialog = document.getElementById('shortcut-config-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create dialog overlay
        const dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'shortcut-config-dialog';
        dialogOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483648;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        `;

        // Create dialog content
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.98));
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            color: white;
        `;

        dialog.innerHTML = `
            <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                Customize Keyboard Shortcut
            </h2>

            <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 16px 0; color: rgba(255, 255, 255, 0.7); font-size: 14px;">
                    Current shortcut: <strong>${getShortcutDisplay()}</strong>
                </p>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: rgba(255, 255, 255, 0.8); font-size: 14px;">
                        Key:
                    </label>
                    <input type="text" id="key-input" maxlength="1" value="${currentShortcut.key}"
                           style="width: 60px; padding: 8px 12px; border: 1px solid rgba(255, 255, 255, 0.2);
                                  border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: white;
                                  font-size: 16px; text-align: center; text-transform: uppercase;">
                </div>

                <div style="display: flex; gap: 16px; margin-bottom: 16px;">
                    <label style="display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.8); font-size: 14px; cursor: pointer;">
                        <input type="checkbox" id="ctrl-check" ${currentShortcut.ctrlKey ? 'checked' : ''}
                               style="width: 16px; height: 16px;">
                        Ctrl
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.8); font-size: 14px; cursor: pointer;">
                        <input type="checkbox" id="shift-check" ${currentShortcut.shiftKey ? 'checked' : ''}
                               style="width: 16px; height: 16px;">
                        Shift
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.8); font-size: 14px; cursor: pointer;">
                        <input type="checkbox" id="alt-check" ${currentShortcut.altKey ? 'checked' : ''}
                               style="width: 16px; height: 16px;">
                        Alt
                    </label>
                </div>

                <div id="preview-shortcut" style="padding: 12px; background: rgba(99, 102, 241, 0.2);
                     border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; text-align: center;
                     color: rgba(255, 255, 255, 0.9); font-weight: 500; font-size: 14px;">
                    Preview: ${getShortcutDisplay()}
                </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button id="cancel-btn" style="padding: 10px 20px; border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8);
                        cursor: pointer; font-size: 14px; transition: all 0.2s;">
                    Cancel
                </button>
                <button id="save-btn" style="padding: 10px 20px; border: none; border-radius: 8px;
                        background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8));
                        color: white; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;">
                    Save
                </button>
            </div>
        `;

        dialogOverlay.appendChild(dialog);
        document.body.appendChild(dialogOverlay);

        // Add event listeners for dialog
        const keyInput = dialog.querySelector('#key-input');
        const ctrlCheck = dialog.querySelector('#ctrl-check');
        const shiftCheck = dialog.querySelector('#shift-check');
        const altCheck = dialog.querySelector('#alt-check');
        const previewDiv = dialog.querySelector('#preview-shortcut');
        const cancelBtn = dialog.querySelector('#cancel-btn');
        const saveBtn = dialog.querySelector('#save-btn');

        // Update preview function
        function updatePreview() {
            const tempShortcut = {
                key: keyInput.value.toLowerCase() || 'b',
                ctrlKey: ctrlCheck.checked,
                shiftKey: shiftCheck.checked,
                altKey: altCheck.checked
            };

            let parts = [];
            if (tempShortcut.ctrlKey) parts.push('Ctrl');
            if (tempShortcut.shiftKey) parts.push('Shift');
            if (tempShortcut.altKey) parts.push('Alt');
            parts.push(tempShortcut.key.toUpperCase());

            previewDiv.textContent = 'Preview: ' + parts.join('+');
        }

        // Key input validation
        keyInput.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value && /^[a-z0-9]$/.test(value)) {
                e.target.value = value;
                updatePreview();
            } else if (value) {
                e.target.value = '';
            }
        });

        keyInput.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key.length === 1 && /^[a-z0-9]$/.test(key)) {
                e.preventDefault();
                keyInput.value = key;
                updatePreview();
            } else if (key === 'backspace') {
                e.preventDefault();
                keyInput.value = '';
                updatePreview();
            }
        });

        // Checkbox listeners
        [ctrlCheck, shiftCheck, altCheck].forEach(checkbox => {
            checkbox.addEventListener('change', updatePreview);
        });

        // Button listeners
        cancelBtn.addEventListener('click', () => {
            dialogOverlay.remove();
        });

        saveBtn.addEventListener('click', () => {
            const newKey = keyInput.value.toLowerCase() || 'b';

            // Validate that at least one modifier or a single key is selected
            if (!ctrlCheck.checked && !shiftCheck.checked && !altCheck.checked && newKey.length === 1) {
                // Single key shortcut is fine
            } else if (ctrlCheck.checked || shiftCheck.checked || altCheck.checked) {
                // Modifier + key is fine
            } else {
                alert('Please select at least one modifier key (Ctrl, Shift, or Alt) or use a single key.');
                return;
            }

            currentShortcut = {
                key: newKey,
                ctrlKey: ctrlCheck.checked,
                shiftKey: shiftCheck.checked,
                altKey: altCheck.checked
            };

            saveShortcutConfig();
            updateOverlayInstructions();
            dialogOverlay.remove();

            // Show confirmation
            showNotification(`Shortcut changed to: ${getShortcutDisplay()}`);
        });

        // Close dialog when clicking outside
        dialogOverlay.addEventListener('click', (e) => {
            if (e.target === dialogOverlay) {
                dialogOverlay.remove();
            }
        });

        // Focus the key input
        setTimeout(() => keyInput.focus(), 100);
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9));
            color: white;
            border-radius: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 2147483648;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    // Update overlay instructions with current shortcut
    function updateOverlayInstructions() {
        if (overlay) {
            const instructionsDiv = overlay.querySelector('.instructions');
            if (instructionsDiv) {
                instructionsDiv.innerHTML = `
                    <span class="instruction-item">🔀 Drag to move</span>
                    <span class="instruction-item">📐 Resize from corners</span>
                    <span class="instruction-item">🎚️ Scroll to adjust opacity</span>
                    <span class="instruction-item">⌨️ ${getShortcutDisplay()} to toggle</span>
                `;
            }
        }
    }

    // Register Tampermonkey menu command
    function registerMenuCommands() {
        GM_registerMenuCommand('⚙️ Configure Shortcut', showShortcutConfig);
        GM_registerMenuCommand(`🔄 Toggle Overlay (${getShortcutDisplay()})`, toggleOverlay);
    }

    // Create the overlay element
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'subtitle-overlay';
        overlay.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            width: 800px;
            height: 200px;
            background: linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(10, 10, 10, 0.98));
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            cursor: move;
            z-index: 2147483647;
            display: none;
            user-select: none;
            box-sizing: border-box;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
                        0 8px 16px rgba(0, 0, 0, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        `;

        // Create resize handles for all four corners
        const resizeHandles = [
            { position: 'top-left', cursor: 'nw-resize', style: 'top: -4px; left: -4px; border-radius: 50% 0 50% 0;' },
            { position: 'top-right', cursor: 'ne-resize', style: 'top: -4px; right: -4px; border-radius: 0 50% 0 50%;' },
            { position: 'bottom-left', cursor: 'sw-resize', style: 'bottom: -4px; left: -4px; border-radius: 50% 0 50% 0;' },
            { position: 'bottom-right', cursor: 'se-resize', style: 'bottom: -4px; right: -4px; border-radius: 0 50% 0 50%;' }
        ];

        resizeHandles.forEach(handle => {
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.dataset.position = handle.position;
            resizeHandle.style.cssText = `
                position: absolute;
                width: 16px;
                height: 16px;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.6), rgba(168, 85, 247, 0.6));
                border: 2px solid rgba(255, 255, 255, 0.2);
                cursor: ${handle.cursor};
                ${handle.style}
                transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
                opacity: 0;
                transform: scale(0.8);
            `;

            overlay.appendChild(resizeHandle);
        });

        // Create settings button
        const settingsButton = document.createElement('div');
        settingsButton.innerHTML = '⚙️';
        settingsButton.className = 'settings-button';
        settingsButton.style.cssText = `
            position: absolute;
            top: 12px;
            left: 12px;
            width: 32px;
            height: 32px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            line-height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0.7;
            transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
            z-index: 10;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        `;
        settingsButton.onmouseover = () => {
            settingsButton.style.opacity = '1';
            settingsButton.style.background = 'rgba(99, 102, 241, 0.2)';
            settingsButton.style.color = 'rgba(255, 255, 255, 0.9)';
            settingsButton.style.transform = 'scale(1.05)';
        };
        settingsButton.onmouseout = () => {
            settingsButton.style.opacity = '0.7';
            settingsButton.style.background = 'rgba(255, 255, 255, 0.08)';
            settingsButton.style.color = 'rgba(255, 255, 255, 0.7)';
            settingsButton.style.transform = 'scale(1)';
        };
        settingsButton.onclick = (e) => {
            e.stopPropagation();
            showShortcutConfig();
        };
        overlay.appendChild(settingsButton);

        // Create close button
        const closeButton = document.createElement('div');
        closeButton.innerHTML = '✕';
        closeButton.className = 'close-button';
        closeButton.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            width: 32px;
            height: 32px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-align: center;
            line-height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            opacity: 0.7;
            transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
            z-index: 10;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        `;
        closeButton.onmouseover = () => {
            closeButton.style.opacity = '1';
            closeButton.style.background = 'rgba(239, 68, 68, 0.2)';
            closeButton.style.color = 'rgba(255, 255, 255, 0.9)';
            closeButton.style.transform = 'scale(1.05)';
        };
        closeButton.onmouseout = () => {
            closeButton.style.opacity = '0.7';
            closeButton.style.background = 'rgba(255, 255, 255, 0.08)';
            closeButton.style.color = 'rgba(255, 255, 255, 0.7)';
            closeButton.style.transform = 'scale(1)';
        };
        closeButton.onclick = hideOverlay;
        overlay.appendChild(closeButton);

        // Create info text
        const infoText = document.createElement('div');
        infoText.innerHTML = `
            <div class="title">Subtitle Blocker</div>
            <div class="instructions">
                <span class="instruction-item">🔀 Drag to move</span>
                <span class="instruction-item">📐 Resize from corners</span>
                <span class="instruction-item">🎚️ Scroll to adjust opacity</span>
                <span class="instruction-item">⌨️ ${getShortcutDisplay()} to toggle</span>
            </div>
        `;
        infoText.className = 'info-text';
        infoText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            pointer-events: none;
            opacity: 0; /* Initially hidden */
            transition: opacity 0.3s ease-in-out; /* Smooth transition */
        `;

        // Add styles for title and instructions
        const style = document.createElement('style');
        style.textContent = `
            #subtitle-overlay .title {
                color: rgba(255, 255, 255, 0.9);
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 12px;
                letter-spacing: 0.5px;
            }

            #subtitle-overlay .instructions {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 16px;
                max-width: 400px;
                margin: 0 auto;
            }

            #subtitle-overlay .instruction-item {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
                font-weight: 400;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 4px 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }

            @media (max-width: 600px) {
                #subtitle-overlay .instructions {
                    flex-direction: column;
                    gap: 8px;
                }

                #subtitle-overlay .instruction-item {
                    font-size: 10px;
                    padding: 3px 6px;
                }

                #subtitle-overlay .title {
                    font-size: 16px;
                    margin-bottom: 8px;
                }
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(infoText);

        document.body.appendChild(overlay);
        attachEventListeners();
        handleFullscreenEvents();

        // Show resize handles and info text on hover
        overlay.addEventListener('mouseenter', () => {
            overlay.querySelectorAll('.resize-handle').forEach(handle => {
                handle.style.opacity = '1';
                handle.style.transform = 'scale(1)';
            });
            const infoTextElement = overlay.querySelector('.info-text');
            if (infoTextElement) {
                infoTextElement.style.opacity = '0.8'; // Make text visible on hover
            }
        });

        overlay.addEventListener('mouseleave', () => {
            if (!isResizing && !isDragging) {
                overlay.querySelectorAll('.resize-handle').forEach(handle => {
                    handle.style.opacity = '0';
                    handle.style.transform = 'scale(0.8)';
                });
                const infoTextElement = overlay.querySelector('.info-text');
                if (infoTextElement) {
                    infoTextElement.style.opacity = '0'; // Hide text when mouse leaves
                }
            }
        });
    }

    function updateOpacity() {
        if (overlay) {
            // Create a more sophisticated opacity system with glassmorphism
            const alpha = Math.max(minOpacity, opacity);
            const gradientAlpha1 = Math.max(minOpacity, alpha * 0.95);
            const gradientAlpha2 = Math.max(minOpacity, alpha * 0.98);

            overlay.style.background = `linear-gradient(135deg, rgba(20, 20, 20, ${gradientAlpha1}), rgba(10, 10, 10, ${gradientAlpha2}))`;

            // Adjust border and shadow opacity based on main opacity
            const borderOpacity = Math.max(0.02, alpha * 0.1);
            const shadowOpacity = Math.max(minOpacity, alpha * 0.4);

            overlay.style.borderColor = `rgba(255, 255, 255, ${borderOpacity})`;
            overlay.style.boxShadow = `
                0 20px 40px rgba(0, 0, 0, ${shadowOpacity}),
                0 8px 16px rgba(0, 0, 0, ${shadowOpacity * 0.5}),
                inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity * 0.5})
            `;
        }
    }

    function showOpacityFeedback(percentage) {
        // Remove existing feedback if any
        const existingFeedback = document.getElementById('opacity-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create opacity feedback indicator
        const feedback = document.createElement('div');
        feedback.id = 'opacity-feedback';
        feedback.innerHTML = `${percentage}%`;
        feedback.style.cssText = `
            position: absolute;
            top: 12px;
            left: 50px;
            padding: 6px 12px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            font-size: 12px;
            font-weight: 500;
            z-index: 10;
            pointer-events: none;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
        `;

        overlay.appendChild(feedback);

        // Animate in
        requestAnimationFrame(() => {
            feedback.style.opacity = '1';
            feedback.style.transform = 'scale(1)';
        });

        // Remove after delay
        setTimeout(() => {
            if (feedback && feedback.parentNode) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (feedback && feedback.parentNode) {
                        feedback.remove();
                    }
                }, 200);
            }
        }, 1500);
    }

    function handleFullscreenEvents() {
        // Listen for fullscreen changes
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    function handleFullscreenChange() {
        if (!overlay) return;

        // Get the fullscreen element
        const fullscreenElement = document.fullscreenElement ||
                                document.webkitFullscreenElement ||
                                document.mozFullScreenElement ||
                                document.msFullscreenElement;

        if (fullscreenElement) {
            // Entering fullscreen - move overlay to fullscreen element
            try {
                fullscreenElement.appendChild(overlay);
                // Ensure overlay maintains its properties in fullscreen
                overlay.style.position = 'absolute';
                overlay.style.zIndex = '2147483647';

                // If overlay was visible before fullscreen, keep it visible
                if (isVisible) {
                    overlay.style.display = 'block';
                }
            } catch (e) {
                // Fallback: keep in body but ensure maximum z-index
                overlay.style.position = 'fixed';
                overlay.style.zIndex = '2147483647';
                if (isVisible) {
                    overlay.style.display = 'block';
                }
            }
        } else {
            // Exiting fullscreen - move overlay back to body
            if (overlay.parentNode !== document.body) {
                document.body.appendChild(overlay);
            }
            overlay.style.position = 'fixed';
            overlay.style.zIndex = '2147483647';

            // Ensure overlay remains visible if it was visible before
            if (isVisible) {
                overlay.style.display = 'block';
            }
        }
    }

    function attachEventListeners() {
        const resizeHandles = overlay.querySelectorAll('.resize-handle');
        const closeButton = overlay.querySelector('.close-button');
        const settingsButton = overlay.querySelector('.settings-button');

        // Mouse down on overlay
        overlay.addEventListener('mousedown', function(e) {
            // Check if clicking on a resize handle
            const resizeHandle = e.target.closest('.resize-handle');
            if (resizeHandle) {
                startResize(e, resizeHandle.dataset.position);
            } else if (e.target !== closeButton && !e.target.closest('.close-button') &&
                      e.target !== settingsButton && !e.target.closest('.settings-button')) {
                startDrag(e);
            }
        });

        // Mouse move
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                drag(e);
            } else if (isResizing) {
                resize(e);
            }
        });

        // Mouse up
        document.addEventListener('mouseup', function() {
            isDragging = false;
            isResizing = false;
            currentResizeHandle = null;
            if (overlay) {
                overlay.style.cursor = 'move';
            }
        });

        // Prevent text selection while dragging
        document.addEventListener('selectstart', function(e) {
            if (isDragging || isResizing) {
                e.preventDefault();
            }
        });

        // Scroll wheel opacity adjustment
        overlay.addEventListener('wheel', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            opacity = Math.max(minOpacity, Math.min(1.0, opacity + delta));
            updateOpacity();

            // Visual feedback - briefly show current opacity
            showOpacityFeedback(Math.round(opacity * 100));
        }, { passive: false });
    }

    function startDrag(e) {
        isDragging = true;
        const rect = overlay.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        overlay.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;

        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;

        // Keep overlay within viewport bounds
        const maxX = window.innerWidth - overlay.offsetWidth;
        const maxY = window.innerHeight - overlay.offsetHeight;

        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(0, Math.min(y, maxY));

        overlay.style.left = boundedX + 'px';
        overlay.style.top = boundedY + 'px';
        overlay.style.transform = 'none';
    }

    function startResize(e, position) {
        e.stopPropagation();
        isResizing = true;
        currentResizeHandle = position;

        const rect = overlay.getBoundingClientRect();
        resizeStartSize.width = rect.width;
        resizeStartSize.height = rect.height;
        resizeStartPos.left = rect.left;
        resizeStartPos.top = rect.top;
        resizeStartMouse.x = e.clientX;
        resizeStartMouse.y = e.clientY;

        // Set appropriate cursor
        const cursors = {
            'top-left': 'nw-resize',
            'top-right': 'ne-resize',
            'bottom-left': 'sw-resize',
            'bottom-right': 'se-resize'
        };
        overlay.style.cursor = cursors[position];
    }

    function resize(e) {
        if (!isResizing || !currentResizeHandle) return;

        const deltaX = e.clientX - resizeStartMouse.x;
        const deltaY = e.clientY - resizeStartMouse.y;

        let newWidth = resizeStartSize.width;
        let newHeight = resizeStartSize.height;
        let newLeft = resizeStartPos.left;
        let newTop = resizeStartPos.top;

        // Apply resize logic based on which handle is being dragged
        switch (currentResizeHandle) {
            case 'top-left':
                newWidth = Math.max(200, resizeStartSize.width - deltaX);
                newHeight = Math.max(100, resizeStartSize.height - deltaY);
                newLeft = resizeStartPos.left + (resizeStartSize.width - newWidth);
                newTop = resizeStartPos.top + (resizeStartSize.height - newHeight);
                break;
            case 'top-right':
                newWidth = Math.max(200, resizeStartSize.width + deltaX);
                newHeight = Math.max(100, resizeStartSize.height - deltaY);
                newTop = resizeStartPos.top + (resizeStartSize.height - newHeight);
                break;
            case 'bottom-left':
                newWidth = Math.max(200, resizeStartSize.width - deltaX);
                newHeight = Math.max(100, resizeStartSize.height + deltaY);
                newLeft = resizeStartPos.left + (resizeStartSize.width - newWidth);
                break;
            case 'bottom-right':
                newWidth = Math.max(200, resizeStartSize.width + deltaX);
                newHeight = Math.max(100, resizeStartSize.height + deltaY);
                break;
        }

        // Apply bounds checking
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - newWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - newHeight));

        overlay.style.width = newWidth + 'px';
        overlay.style.height = newHeight + 'px';
        overlay.style.left = newLeft + 'px';
        overlay.style.top = newTop + 'px';
        overlay.style.transform = 'none';
    }

    function showOverlay() {
        if (!overlay) createOverlay();
        overlay.style.display = 'block';
        isVisible = true;
        console.log('Subtitle overlay shown');
    }

    function hideOverlay() {
        if (overlay) {
            overlay.style.display = 'none';
            overlay.style.cursor = 'move';
        }
        isVisible = false;
        isDragging = false;
        isResizing = false;
        currentResizeHandle = null;

        // Hide resize handles and info text when overlay is hidden
        if (overlay) {
            overlay.querySelectorAll('.resize-handle').forEach(handle => {
                handle.style.opacity = '0';
                handle.style.transform = 'scale(0.8)';
            });
            const infoTextElement = overlay.querySelector('.info-text');
            if (infoTextElement) {
                infoTextElement.style.opacity = '0'; // Hide text when overlay is hidden
            }
        }

        console.log('Subtitle overlay hidden');
    }

    function toggleOverlay() {
        if (isVisible) {
            hideOverlay();
        } else {
            showOverlay();
        }
    }

    // Enhanced keyboard shortcut listener with multiple approaches
    function setupKeyboardListeners() {
        // Method 1: Standard keydown event
        document.addEventListener('keydown', handleKeyDown, true);

        // Method 2: Window-level keydown event (for fullscreen)
        window.addEventListener('keydown', handleKeyDown, true);

        // Method 3: Body-level keydown event
        if (document.body) {
            document.body.addEventListener('keydown', handleKeyDown, true);
        }

        // Method 4: Document element keydown event
        if (document.documentElement) {
            document.documentElement.addEventListener('keydown', handleKeyDown, true);
        }
    }

    function handleKeyDown(e) {
        // Check for the configured shortcut combination
        const keyMatch = e.key.toLowerCase() === currentShortcut.key ||
                        e.keyCode === currentShortcut.key.toUpperCase().charCodeAt(0);

        const ctrlMatch = e.ctrlKey === currentShortcut.ctrlKey;
        const shiftMatch = e.shiftKey === currentShortcut.shiftKey;
        const altMatch = e.altKey === currentShortcut.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.log(`${getShortcutDisplay()} detected, toggling overlay`);
            toggleOverlay();
            return false;
        }
    }

    // Initialize keyboard listeners when DOM is ready
    function initializeKeyboardListeners() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupKeyboardListeners);
        } else {
            setupKeyboardListeners();
        }

        // Also setup on window load as backup
        window.addEventListener('load', setupKeyboardListeners);

        // Set up a periodic check to re-establish listeners (for dynamic content)
        setInterval(() => {
            setupKeyboardListeners();
        }, 5000);
    }

    // YouTube-specific handling
    function handleYouTubeSpecifics() {
        if (window.location.hostname.includes('youtube.com')) {
            // YouTube often captures keyboard events, so we need to be more aggressive
            const ytPlayer = document.getElementById('movie_player') ||
                           document.querySelector('.html5-video-player') ||
                           document.querySelector('video');

            if (ytPlayer) {
                ytPlayer.addEventListener('keydown', handleKeyDown, true);

                // Also listen on the video element itself
                const video = ytPlayer.querySelector('video') || ytPlayer;
                if (video && video.tagName === 'VIDEO') {
                    video.addEventListener('keydown', handleKeyDown, true);
                }
            }

            // Listen for YouTube's navigation changes
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(setupKeyboardListeners, 1000); // Re-setup after navigation
                }
            }).observe(document, { subtree: true, childList: true });
        }
    }

    // Initialize everything
    function initialize() {
        console.log(`Subtitle Overlay Tool loaded. Press ${getShortcutDisplay()} to toggle overlay. Scroll over overlay to adjust opacity.`);

        // Load saved configuration
        loadShortcutConfig();

        // Register menu commands
        registerMenuCommands();

        initializeKeyboardListeners();
        handleYouTubeSpecifics();

        // Create overlay initially (hidden)
        createOverlay();
        hideOverlay();
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
