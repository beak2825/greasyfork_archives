// ==UserScript==
// @name         SMB35 Game notifier
// @namespace    https://github.com/LuisMayo/general-userscripts
// @version      1.0
// @description  Notifies when a new match is starting using a desktop notification
// @author       LuisMayo
// @match        https://smb35server.com:20002/dashframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smb35server.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449076/SMB35%20Game%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/449076/SMB35%20Game%20notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CHECK_ID = 'luis-desktop-notify';
    let dashframeWindow;
    let lastGame;
    const newGameDetected = () => {
        let isNewGame = false;
        const games = Array.from(dashframeWindow.document.querySelectorAll('table > tbody > tr > td:first-child'));
        if (games.length > 0) {
            const gamesId = games.map(game => +game.textContent);
            const largerId = Math.max(...gamesId);
            if (!lastGame || largerId > lastGame) {
                lastGame = largerId;
                isNewGame = true;
            }
        }
        return isNewGame;
    }
    const checkForGames = () => {
        if (document.getElementById(CHECK_ID).checked && newGameDetected()) {
            new Notification('New match started');
        }
    }
    const onNotifyCheckChanged = (ev) => {
        if (ev.target.checked && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    const main = () => {
        dashframeWindow = document.getElementById("dashframe").contentWindow;
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.id = CHECK_ID;
        check.addEventListener('change', onNotifyCheckChanged);
        const label = document.createElement('label');
        label.htmlFor = CHECK_ID;
        label.textContent = 'Send a desktop notification when a new match starts matchmaking';
        const div = document.createElement('div');
        div.appendChild(check);
        div.appendChild(label);
        document.getElementById('soundOption').appendChild(div);
        setInterval(checkForGames, 10000);
    }
    setTimeout(main, 2000);
})();