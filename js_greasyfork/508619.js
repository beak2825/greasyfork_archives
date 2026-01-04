// ==UserScript==
// @name         Disable YouTube Hotkeys with Modern Settings Page
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Disable various YouTube hotkeys, including frame skip, with a modern settings page
// @author       You
// @match        *://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508619/Disable%20YouTube%20Hotkeys%20with%20Modern%20Settings%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/508619/Disable%20YouTube%20Hotkeys%20with%20Modern%20Settings%20Page.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Load saved settings or default to enabling all keys
    let settings = GM_getValue('hotkeySettings', {
        disableNumericKeys: false,
        disableSpacebar: false,
        disableArrowKeys: false,
        disableFKey: false,
        disableMKey: false,
        disableSpeedControl: false,
        disableFrameSkip: false
    });

    // Function to handle keydown events and disable selected hotkeys
    window.addEventListener('keydown', function(e) {
        // Disable numeric keys (0-9)
        if (settings.disableNumericKeys && e.key >= '0' && e.key <= '9') {
            e.stopPropagation();
            e.preventDefault();
        }

        // Disable spacebar
        if (settings.disableSpacebar && e.code === 'Space') {
            e.stopPropagation();
            e.preventDefault();
        }

        // Disable arrow keys (left, right, up, down)
        if (settings.disableArrowKeys && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
            e.stopPropagation();
            e.preventDefault();
        }

        // Disable F (for fullscreen)
        if (settings.disableFKey && e.key.toLowerCase() === 'f') {
            e.stopPropagation();
            e.preventDefault();
        }

        // Disable M (for mute)
        if (settings.disableMKey && e.key.toLowerCase() === 'm') {
            e.stopPropagation();
            e.preventDefault();
        }

        // Disable speed control (Shift + > or Shift + <)
        if (settings.disableSpeedControl && (e.shiftKey && (e.key === '>' || e.key === '<'))) {
            e.stopPropagation();
            e.preventDefault();
        }

        // Disable frame skip (`,` for backward, `.` for forward)
        if (settings.disableFrameSkip && (e.key === ',' || e.key === '.')) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);

    // Create and display the settings modal using safe DOM manipulation
    function openSettings() {
        // Remove any existing modal or overlay
        let existingModal = document.getElementById('yt-hotkey-settings-modal');
        let existingOverlay = document.getElementById('yt-hotkey-settings-overlay');
        if (existingModal) existingModal.remove();
        if (existingOverlay) existingOverlay.remove();

        // Create the modal container
        let modal = document.createElement('div');
        modal.id = 'yt-hotkey-settings-modal';
        modal.className = 'modal-card';

        // Create modal header
        let header = document.createElement('div');
        header.className = 'modal-header';

        let title = document.createElement('h2');
        title.textContent = 'YouTube Hotkey Settings';
        header.appendChild(title);

        let closeButton = document.createElement('span');
        closeButton.id = 'closeSettingsBtn';
        closeButton.className = 'close-btn';
        closeButton.textContent = '×';
        header.appendChild(closeButton);

        modal.appendChild(header);

        // Create modal content (checkboxes)
        let content = document.createElement('div');
        content.className = 'modal-content';

        let checkboxes = [
            { id: 'disableNumericKeys', label: 'Disable Numeric Keys (0-9)', checked: settings.disableNumericKeys },
            { id: 'disableSpacebar', label: 'Disable Spacebar (Play/Pause)', checked: settings.disableSpacebar },
            { id: 'disableArrowKeys', label: 'Disable Arrow Keys (Rewind/FF, Volume)', checked: settings.disableArrowKeys },
            { id: 'disableFKey', label: 'Disable F Key (Fullscreen)', checked: settings.disableFKey },
            { id: 'disableMKey', label: 'Disable M Key (Mute)', checked: settings.disableMKey },
            { id: 'disableSpeedControl', label: 'Disable Speed Control (Shift + > / <)', checked: settings.disableSpeedControl },
            { id: 'disableFrameSkip', label: 'Disable Frame Skip (`,` and `.`)', checked: settings.disableFrameSkip }
        ];

        checkboxes.forEach(hotkey => {
            let label = document.createElement('label');
            label.className = 'custom-checkbox';

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = hotkey.id;
            checkbox.checked = hotkey.checked;

            let checkmark = document.createElement('span');
            checkmark.className = 'checkmark';

            label.appendChild(checkbox);
            label.appendChild(checkmark);
            label.appendChild(document.createTextNode(` ${hotkey.label}`));
            content.appendChild(label);
        });

        modal.appendChild(content);

        // Create modal footer (save button)
        let footer = document.createElement('div');
        footer.className = 'modal-footer';

        let saveButton = document.createElement('button');
        saveButton.id = 'saveSettingsBtn';
        saveButton.className = 'primary-btn';
        saveButton.textContent = 'Save Settings';
        footer.appendChild(saveButton);

        modal.appendChild(footer);

        // Append modal to the document body
        document.body.appendChild(modal);

        // Create the overlay (dark background behind modal)
        let overlay = document.createElement('div');
        overlay.id = 'yt-hotkey-settings-overlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);

        // Close modal on clicking the close button or overlay
        closeButton.addEventListener('click', closeSettings);
        overlay.addEventListener('click', closeSettings);

        // Save settings on clicking the save button
        saveButton.addEventListener('click', function() {
            settings.disableNumericKeys = document.getElementById('disableNumericKeys').checked;
            settings.disableSpacebar = document.getElementById('disableSpacebar').checked;
            settings.disableArrowKeys = document.getElementById('disableArrowKeys').checked;
            settings.disableFKey = document.getElementById('disableFKey').checked;
            settings.disableMKey = document.getElementById('disableMKey').checked;
            settings.disableSpeedControl = document.getElementById('disableSpeedControl').checked;
            settings.disableFrameSkip = document.getElementById('disableFrameSkip').checked;
            GM_setValue('hotkeySettings', settings);

            // Show a success message and close modal after a short delay
            showNotification('Settings saved successfully!', modal);
            setTimeout(closeSettings, 1500);
        });

        // Function to close the settings modal
        function closeSettings() {
            modal.remove();
            overlay.remove();
        }
    }

    // Function to show a notification banner
    function showNotification(message, parentElement) {
        let banner = document.createElement('div');
        banner.className = 'notification-banner';
        banner.textContent = message;
        parentElement.appendChild(banner);

        setTimeout(() => banner.remove(), 3000);
    }

    // Register the settings menu command
    GM_registerMenuCommand('YouTube Hotkey Settings', openSettings);

    // Add styles for the modal and modern UI
    GM_addStyle(`
        /* General Modal Styling */
        .modal-card {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 400px;
            max-width: 90%;
            z-index: 10001;
            overflow: hidden;
            animation: slide-down 0.3s ease-out;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #007bff;
            color: white;
            padding: 15px;
        }

        .modal-content {
            padding: 20px;
        }

        .modal-footer {
            display: flex;
            justify-content: flex-end;
            padding: 10px;
            border-top: 1px solid #ddd;
        }

        /* Checkbox Styling */
        .custom-checkbox {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 16px;
        }

        .custom-checkbox input[type="checkbox"] {
            display: none;
        }

        .custom-checkbox .checkmark {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid #007bff;
            border-radius: 3px;
            margin-right: 10px;
            transition: all 0.2s;
        }

        .custom-checkbox input[type="checkbox"]:checked + .checkmark {
            background-color: #007bff;
            border-color: #007bff;
        }

        /* Button Styling */
        .primary-btn {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .primary-btn:hover {
            background-color: #0056b3;
        }

        /* Close Button */
        .close-btn {
            font-size: 24px;
            color: white;
            cursor: pointer;
            padding: 0 10px;
        }

        /* Notification Banner */
        .notification-banner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 10px;
            background-color: #28a745;
            color: white;
            text-align: center;
            animation: fade-in-out 3s ease-out;
        }

        /* Animations */
        @keyframes slide-down {
            from { transform: translate(-50%, -60%); opacity: 0; }
            to { transform: translate(-50%, -50%); opacity: 1; }
        }

        @keyframes fade-in-out {
            0%, 100% { opacity: 0; }
            20%, 80% { opacity: 1; }
        }
    `);
})();
