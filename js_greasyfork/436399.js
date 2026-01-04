// ==UserScript==
// @name         CryptureWorld Notifications
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Notification script for cryptureworld adventures
// @author       Xortrox
// @match        https://play.cryptureworld.com/*
// @match        https://play.cryptureworld.com/
// @icon         https://www.google.com/s2/favicons?domain=cryptureworld.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436399/CryptureWorld%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/436399/CryptureWorld%20Notifications.meta.js
// ==/UserScript==

(async function() {
    const icon = 'https://www.google.com/s2/favicons?domain=cryptureworld.com';

    const notifyTimerInterval = 60000;

    await hasPermission();

    setInterval(() => {
        const adventureSpan = document.querySelectorAll('adventure span')[0];

        if (adventureSpan) {
            const text = adventureSpan.innerText;

            if (text.toLowerCase().includes('ready to adventure')) {
                notify('Ready to Adventure');
            }
        }
    }, notifyTimerInterval);

    function notify(text) {
        console.log('Notifying.');
        hasPermission().then(function (result) {
            console.log('Notify result:', result);
            if (result === true) {
                let popup = new window.Notification('CryptureWorld', { body: text, icon: icon });
                popup.onclick = function () {
                    window.focus();
                }
            }
        });
    }

    function hasPermission() {
        return new Promise(function (resolve) {
            if ('Notification' in window) {
                if (window.Notification.permission === 'granted') {
                    resolve(true);
                } else {
                    window.Notification.requestPermission().then(function (permission) {
                        if (permission === 'granted') {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                }
            } else {
                resolve(true);
            }
        });
    }
})();