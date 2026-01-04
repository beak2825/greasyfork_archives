// ==UserScript==
// @name            WME Link Layer Settings Blocker
// @description     Prevent WME links from changing your layer settings
// @version         2024.01.27.01
// @namespace       https://greasyfork.org/en/scripts/485692-wme-link-layer-settings-blocker
// @author          Brandon28AU
// @license         MIT
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/485692/WME%20Link%20Layer%20Settings%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/485692/WME%20Link%20Layer%20Settings%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = window.location.href;
    const languages = {
        'en': {
            blocked: 'Blocked link from updating map layer settings',
            apply: 'Apply map layer settings from link',
            applied: 'Applied map layer settings from link'
        },
        'es': {
            blocked: 'Se evitó que el enlace actualizara la configuración de la capa del mapa',
            apply: 'Aplicar la configuración de la capa del mapa desde el enlace',
            applied: 'Configuración de capa de mapa aplicada desde el enlace'
        },
        'it': {
            blocked: 'È stato impedito l\'aggiornamento delle impostazioni del livello mappa da parte del collegamento',
            apply: 'Applica le impostazioni del livello mappa dal collegamento',
            applied: 'Impostazioni del livello mappa applicate del collegamento'
        }
    }
    const userLanguage = navigator.language || navigator.userLanguage;
    const currentLanguage = userLanguage.split('-')[0];
    const selectedLanguage = languages[currentLanguage] ? languages[currentLanguage] : languages.en;

    function insertApplyButton() {
        const layerSwitcherElement = document.getElementsByClassName('layer-switcher-button overlay-button')[0];

        if (layerSwitcherElement === undefined) {
            window.setTimeout(insertApplyButton, 2000);
            return;
        }

        layerSwitcherElement.style.zIndex = '1';

        const applyButton = document.createElement('div');
        applyButton.style.position = 'absolute';
        applyButton.style.top = '0';
        applyButton.style.right = `${layerSwitcherElement.parentNode.offsetWidth / 2}px`;
        applyButton.style.height = `${layerSwitcherElement.parentNode.offsetWidth}px`;
        applyButton.style.color = '#333';
        applyButton.style.border = "solid 1px #3b82f6";
        applyButton.style.borderRadius = '9999px 0 0 9999px';
        applyButton.style.display = 'flex';
        applyButton.style.alignItems = 'center';
        applyButton.style.cursor = 'pointer';
        applyButton.classList.add('wme-llsb-apply');
        applyButton.onclick = applyLinkLayerSettings;

        applyButton.innerHTML = `<style>.wme-llsb-apply{background-color: #fff; width: 0px; box-sizing: border-box; overflow: hidden; transition: background-color 0.25s linear, width 0.5s ease-in;}.wme-llsb-apply:hover{background-color: #eff6ff;}.wme-llsb-apply-content{white-space: nowrap; padding: 0 ${layerSwitcherElement.parentNode.offsetWidth / 2 + 10}px 0 15px;}.layer-switcher-button.overlay-button:hover ~ .wme-llsb-apply, .wme-llsb-apply:hover, .wme-llsb-apply.visible{width: var(--llsbButtonWidth); transition: background-color 0.25s linear, width 0.5s ease-out;}</style><div class="wme-llsb-apply-content">${selectedLanguage.apply}</div>`;

        layerSwitcherElement.parentNode.insertBefore(applyButton, layerSwitcherElement.nextSibling);

        applyButton.getElementsByTagName('style')[0].prepend(`:root{--llsbButtonWidth: ${applyButton.getElementsByClassName('wme-llsb-apply-content')[0].offsetWidth}px;}`);

    }

    function applyLinkLayerSettings() {
        window.location.replace(url.replace(/([&?])(llsblocked=)([a-z0-9]+)/i, function(match, prefix, key, value) {return prefix + "s=" + value + "&llsblocked=apply"}));

    }

    function showToast(color, message, icon) {
        // If user has been redirected, notify

        const toastContainer = document.createElement('div');
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '50px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translate(-50%, 50%)';
        toastContainer.style.backgroundColor = '#fff';
        toastContainer.style.color = '#333';
        toastContainer.style.padding = '2px 15px 2px 10px';
        toastContainer.style.borderRadius = '9999px';
        toastContainer.style.display = 'flex';
        toastContainer.style.gap = '5px';
        toastContainer.style.border = `solid 1px ${color}`;
        toastContainer.style.alignItems = 'center';
        toastContainer.style.opacity = '0';
        toastContainer.style.zIndex = '1500';
        toastContainer.style.height = '25px';
        toastContainer.style.boxSizing = 'content-box';
        toastContainer.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        toastContainer.innerHTML = icon + '<span style="line-height: 25px">' + message + '</span';

        document.body.appendChild(toastContainer);

        // Trigger a reflow to apply styles and initiate the fade-in animation
        toastContainer.offsetHeight;

        // Show the toast
        toastContainer.style.opacity = '1';
        toastContainer.style.transform = 'translate(-50%, 0%)';

        // Automatically hide after 5 seconds
        setTimeout(() => {
            // Initiate the fade-out animation
            toastContainer.style.transition = 'opacity 0.5s ease-in, transform 0.5s ease-in';
            toastContainer.style.opacity = '0';
            toastContainer.style.transform = 'translate(-50%, 50%)';

            // Remove the element from the DOM after the animation completes
            setTimeout(() => {
                document.body.removeChild(toastContainer);
            }, 500);
        }, 5000);

    }

    if (url.match(/([&?]s=[a-z0-9]+)/i) && url.match(/([&?]llsblocked=apply)/) === null) {
        // If URL contains settings, redirect
        window.location.replace(url.replace(/([&?])(s=)([a-z0-9]+)/i, function(match, prefix, key, value) {return prefix + "llsblocked=" + value}));

    } else if (url.match(/([&?]llsblocked=[a-z0-9]+)/i) && url.match(/([&?]llsblocked=apply)/) === null) {
        // If user has been redirected, notify
        showToast('#10b981', selectedLanguage.blocked, '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#10b981" width="25px" height="25px"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>');

        // Insert apply button
        insertApplyButton();

    } else if (url.match(/([&?]llsblocked=apply)/)) {
        // If settings have been applied, notify
        showToast('#3b82f6', selectedLanguage.applied, '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#3b82f6" width="25px" height="25px"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>');

    }

})();