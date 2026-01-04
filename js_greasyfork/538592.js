// ==UserScript==
// @name         Flathub CLI Install Helper
// @namespace    roxyscripts
// @version      1.1
// @description  Replaces Flathub's "Install" button with a "Copy Command" button for flatpak CLI installation.
// @author       roxy
// @match        https://flathub.org/apps/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        GM.setClipboard
// @run-at       document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/538592/Flathub%20CLI%20Install%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/538592/Flathub%20CLI%20Install%20Helper.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const SETTING_ADD_YES_FLAG = 'addYesFlag';
    const DEFAULT_ADD_YES_FLAG = true;

    function getAddYesFlag() {
        return GM.getValue(SETTING_ADD_YES_FLAG, DEFAULT_ADD_YES_FLAG);
    }

    function setAddYesFlag(value) {
        GM.setValue(SETTING_ADD_YES_FLAG, value);
        updateMenuCommand();
    }

    let menuCommandId;
    function updateMenuCommand() {

        if (menuCommandId) {
            GM.unregisterMenuCommand(menuCommandId);
        }

        const currentSetting = getAddYesFlag();
        const menuText = `Flatpak: Add "-y" flag (skip prompts) is ${currentSetting ? 'ON' : 'OFF'}`;

        menuCommandId = GM.registerMenuCommand(menuText, () => {
            setAddYesFlag(!currentSetting);
            alert(`Flatpak "-y" flag is now ${!currentSetting ? 'ON' : 'OFF'}.\n\n(This setting affects future copies of the install command.)`);
        });
    }


    function applyButtonModifications() {

        if (!window.location.pathname.startsWith('/apps/')) {
            originalButtonStyles = null;
            return;
        }

        const pathParts = window.location.pathname.split('/');
        const appId = pathParts[pathParts.length - 1];

        if (!appId || appId === 'apps') {
            return;
        }

        const installButton = document.querySelector('a[role="button"][href*=".flatpakref"]');

        if (installButton) {

            if (installButton.textContent.trim() === 'Copy Command' || installButton.textContent.trim() === 'Copied!') {
                return;
            }


            const parentDiv = installButton.parentNode;

            // UI Fixes for Button Width & Clipping
            if (parentDiv && parentDiv.classList.contains('inline-flex')) {
                parentDiv.classList.remove('w-52', 'sm:w-32', 'md:w-40', 'basis-1/2');
                installButton.classList.remove('overflow-hidden', 'text-ellipsis');
            }


            installButton.textContent = 'Copy Command';
            installButton.href = '#'; // Remove the download href
            installButton.style.cursor = 'copy';
            installButton.title = 'Click to copy Flatpak install command to clipboard';

            installButton.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();

                const addYes = getAddYesFlag();
                const command = `flatpak install flathub ${appId}${addYes ? ' -y' : ''}`;

                try {
                    await GM.setClipboard(command, 'text');

                    // visual feedback
                    installButton.textContent = 'Copied!';

                    setTimeout(() => {
                        installButton.textContent = 'Copy Command';
                    }, 1500);

                } catch (err) {
                    console.error('Failed to copy command to clipboard:', err);
                    alert('Failed to copy command to clipboard. Please copy manually:\n\n' + command);
                }
            });
        }
    }


    function setupPersistentObserver() {
        const observer = new MutationObserver((mutationsList, observer) => {
            applyButtonModifications();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    // Initial calls:
    updateMenuCommand();
    applyButtonModifications();
    setupPersistentObserver();
})();