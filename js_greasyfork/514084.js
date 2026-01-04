// ==UserScript==
// @name         Travel Home Confirmation
// @namespace    https://www.torn.com
// @version      1.8
// @description  Shows a rehab confirmation when traveling home from Switzerland.
// @match        https://www.torn.com/index.php?page=people
// @match        https://www.torn.com/index.php?page=rehab
// @match        https://www.torn.com/index.php
// @author       Star [2144173]
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514084/Travel%20Home%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/514084/Travel%20Home%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isInSwitzerland() {
        const locationElement = document.querySelector('#skip-to-content');
        const logoElement = document.querySelector('#tcLogo');

        if (locationElement && locationElement.innerText.trim() === 'Switzerland') {
            return true;
        } else if (logoElement && logoElement.getAttribute('title') === 'Switzerland') {
            return true;
        }
        return false;
    }

    function showRehabReminder() {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'var(--bg-color)';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
        modalContent.style.textAlign = 'center';
        modalContent.style.color = 'var(--text-color)';
        modalContent.style.fontFamily = 'Arial, sans-serif';
        modalContent.style.fontSize = '16px';

        const message = document.createElement('p');
        message.innerText = 'Did ya rehab you fuck?';

        const tooltipYes = document.createElement('span');
        tooltipYes.innerText = 'You will fly back to Torn';
        tooltipYes.style.position = 'absolute';
        tooltipYes.style.padding = '4px 8px';
        tooltipYes.style.backgroundColor = 'rgba(0, 128, 0, 0.9)';
        tooltipYes.style.color = '#FFF';
        tooltipYes.style.borderRadius = '4px';
        tooltipYes.style.top = '-30px';
        tooltipYes.style.fontSize = '12px';
        tooltipYes.style.visibility = 'hidden';

        const tooltipNo = document.createElement('span');
        tooltipNo.innerText = 'You will be redirected to rehab page';
        tooltipNo.style.position = 'absolute';
        tooltipNo.style.padding = '4px 8px';
        tooltipNo.style.backgroundColor = 'rgba(128, 0, 0, 0.9)';
        tooltipNo.style.color = '#FFF';
        tooltipNo.style.borderRadius = '4px';
        tooltipNo.style.top = '-30px';
        tooltipNo.style.fontSize = '12px';
        tooltipNo.style.visibility = 'hidden';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'center';

        const yesButton = document.createElement('button');
        yesButton.innerText = 'Yes';
        yesButton.style.margin = '10px';
        yesButton.style.padding = '10px 20px';
        yesButton.style.border = 'none';
        yesButton.style.backgroundColor = '#28a745';
        yesButton.style.color = '#FFF';
        yesButton.style.fontWeight = 'bold';
        yesButton.style.cursor = 'pointer';
        yesButton.style.position = 'relative';
        yesButton.style.borderRadius = '5px';
        yesButton.appendChild(tooltipYes);

        const noButton = document.createElement('button');
        noButton.innerText = 'No';
        noButton.style.margin = '10px';
        noButton.style.padding = '10px 20px';
        noButton.style.border = 'none';
        noButton.style.backgroundColor = '#dc3545';
        noButton.style.color = '#FFF';
        noButton.style.fontWeight = 'bold';
        noButton.style.cursor = 'pointer';
        noButton.style.position = 'relative';
        noButton.style.borderRadius = '5px';
        noButton.appendChild(tooltipNo);

        yesButton.addEventListener('mouseover', () => {
            yesButton.style.backgroundColor = '#218838';
            tooltipYes.style.visibility = 'visible';
        });
        yesButton.addEventListener('mouseout', () => {
            yesButton.style.backgroundColor = '#28a745';
            tooltipYes.style.visibility = 'hidden';
        });

        noButton.addEventListener('mouseover', () => {
            noButton.style.backgroundColor = '#c82333';
            tooltipNo.style.visibility = 'visible';
        });
        noButton.addEventListener('mouseout', () => {
            noButton.style.backgroundColor = '#dc3545';
            tooltipNo.style.visibility = 'hidden';
        });

        modalContent.appendChild(message);
        buttonContainer.appendChild(yesButton);
        buttonContainer.appendChild(noButton);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        yesButton.addEventListener('click', () => {
            const travelBackButton = document.querySelector('.travel-back-link .torn-btn');
            if (travelBackButton) {
                travelBackButton.click();
            }
            modal.remove();
        });

        noButton.addEventListener('click', () => {
            window.location.href = 'https://www.torn.com/index.php?page=rehab';
        });

        const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.style.setProperty('--bg-color', darkMode ? '#333' : '#FFF');
        document.documentElement.style.setProperty('--text-color', darkMode ? '#FFF' : '#000');
    }

    function attachTravelHomeListener() {
        const travelHomeButton = document.querySelector('#travel-home');
        if (travelHomeButton) {
            travelHomeButton.addEventListener('click', function(event) {
                event.preventDefault();
                if (isInSwitzerland()) {
                    showRehabReminder();
                }
            });
        }
    }

    window.addEventListener('load', function() {
        const observer = new MutationObserver(() => {
            if (document.querySelector('#travel-home')) {
                attachTravelHomeListener();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
})();