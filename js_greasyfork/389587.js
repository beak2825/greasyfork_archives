// ==UserScript==
// @name         IQRPG Audio notification
// @namespace    IQRPG!euphone
// @version      0.2
// @description  Audio alerts for incoming PMs and TS events. More to come later.
// @author       euphone
// @match        http://www.iqrpg.com/game.php
// @match        https://www.iqrpg.com/game.php
// @match        https://iqrpg.com/game.php
// @match        http://iqrpg.com/game.php
// @connect      notificationsounds.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/389587/IQRPG%20Audio%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/389587/IQRPG%20Audio%20notification.meta.js
// ==/UserScript==

const OldSocket = WebSocket;

window.WebSocket = function () {
    const socket = new OldSocket(...arguments);
    window.socket = socket;

    return socket;
}
async function waitForFieldExistence(target, field) {
    return new Promise((resolve, reject) => {
        if (target[field] !== undefined) {
            return resolve();
        }

        const interval = setInterval(() => {
            if (target[field] !== undefined) {
                clearInterval(interval);
                resolve();
            }
        }, 500);
    });
}

async function runEuphone() {
    await waitForFieldExistence(window, 'socket');
    let notifSound = document.createElement('audio')
notifSound.src = "https://notificationsounds.com/message-tones/communication-channel-519/download/mp3"
notifSound.autoplay = false

socket.addEventListener('message', function(event) {
    const message = JSON.parse(event.data);
    	if (message.type == 'msg') {
        	if (message.data.type == 'pm-from') {
		notifSound.play()
		}
	}
    // TS events, bosses, and other alerts are still in testing.
    	//if (message.type === 'event') {
        //	notifSound.play();
	// }
	if (message.type === 'boss') {
		if (message.data.hpRemaining == message.data.hpMax) {
                notifSound.play();
        	console.log("Boss has spawned.");
    		}
		if (message.data.length == 0) {
		console.log("Boss was defeated")
	}
	}
	if (message.type === 'notification') {
	console.log('Notification message:', message);
	}
	if (message.type === 'announcement') {
	console.log('Announcement message:', message);
	}
});

}
runEuphone();
