// ==UserScript==
// @name         Torn City Race Alert
// @version      1.0
// @description  Compact notification if not in a race. Includes dismiss option for session. (Must have racing icons enabled)
// @author       Krimian
// @match        https://www.torn.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1485200
// @downloadURL https://update.greasyfork.org/scripts/539841/Torn%20City%20Race%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/539841/Torn%20City%20Race%20Alert.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tornRaceAlertDontShow';
    let notificationVisible = false;

    function showNotification(message) {
        if (sessionStorage.getItem(STORAGE_KEY) === 'true' || notificationVisible) return;

        let container = document.getElementById('tornRaceNotifyContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'tornRaceNotifyContainer';
            container.style.position = 'fixed';
            container.style.top = '15px';
            container.style.right = '15px';
            container.style.zIndex = '99999';
            container.style.maxWidth = '90vw';
            container.style.width = '260px';
            document.body.appendChild(container);
        }

        container.innerHTML = '';

        const notif = document.createElement('div');
        notif.style.backgroundColor = '#1a73e8';
        notif.style.color = 'white';
        notif.style.padding = '10px 14px';
        notif.style.marginTop = '8px';
        notif.style.borderRadius = '4px';
        notif.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        notif.style.fontFamily = 'Arial, sans-serif';
        notif.style.fontSize = '12px';
        notif.style.userSelect = 'none';

        const msg = document.createElement('div');
        msg.textContent = message;
        notif.appendChild(msg);

        const checkboxContainer = document.createElement('label');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.marginTop = '8px';
        checkboxContainer.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.marginRight = '6px';
        checkbox.style.transform = 'scale(0.9)';

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(document.createTextNode("Don't show again this session"));
        notif.appendChild(checkboxContainer);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Dismiss';
        closeBtn.style.marginTop = '10px';
        closeBtn.style.padding = '4px 10px';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '3px';
        closeBtn.style.backgroundColor = '#0b5ed7';
        closeBtn.style.color = 'white';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.fontSize = '11px';
        closeBtn.style.cursor = 'pointer';

        closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#084298');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#0b5ed7');

        closeBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                sessionStorage.setItem(STORAGE_KEY, 'true');
            }
            notif.remove();
            notificationVisible = false;
        });

        notif.appendChild(closeBtn);
        container.appendChild(notif);

        notificationVisible = true;
    }

    function hasRaceIcon() {
        return !!document.querySelector('a[href*="sid=racing"]');
    }

    function hasRaceFinishedIcon() {
        return !!document.querySelector('a[aria-label*="You finished"]');
    }

    function hasCurrentlyRacingIcon() {
        return !!document.querySelector('a[aria-label="Racing: Currently racing"]');
    }

    function checkRaceStatus() {
        const hasIcon = hasRaceIcon();
        const hasFinished = hasRaceFinishedIcon();
        const isCurrentlyRacing = hasCurrentlyRacingIcon();

        if (!hasIcon) {
            showNotification("⚠️ Racing icon is missing. You might not be in a race.");
        } else if (hasFinished && !isCurrentlyRacing) {
            showNotification("🏁 You are NOT currently in a race. 🏁");
        }
    }

    window.addEventListener('load', () => {
        setTimeout(checkRaceStatus, 2000);
        setInterval(checkRaceStatus, 15000);
    });

})();
