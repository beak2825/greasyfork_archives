// ==UserScript==
// @name         NFT Panda Notifications
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Notification script for NFT Panda
// @author       Xortrox
// @match        https://game.nftpanda.space/*
// @icon         https://www.google.com/s2/favicons?domain=cryptureworld.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436400/NFT%20Panda%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/436400/NFT%20Panda%20Notifications.meta.js
// ==/UserScript==

(async function() {
    const icon = 'https://www.google.com/s2/favicons?domain=nftpanda.space';

    const notifyTimerInterval = 60000;

    await hasPermission();

    setInterval(() => {
        const notificationSpans = document.querySelectorAll('.one-slot span.button-name-in');

        /** We send notification only once if any panda's are inactive */
        if (notificationSpans && notificationSpans.length > 0) {
            for (let span of notificationSpans) {
                const text = span.innerText;

                if (text.toLowerCase().includes('send to adventure')) {
                    notify('You have at least one ready hero');
                    break;
                }
            }
        }
    }, notifyTimerInterval);

    function notify(text) {
        hasPermission().then(function (result) {
            if (result === true) {
                let popup = new window.Notification('NFT PAnda', { body: text, icon: icon });
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