// ==UserScript==
// @name         Idle Pixel Rocket Tracker
// @namespace    none
// @version      1.3
// @description  Adds moon and sun distance notifications.
// @license      MIT
// @author       Cullen
// @match        https://idle-pixel.com/login/play/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idle-pixel.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459737/Idle%20Pixel%20Rocket%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/459737/Idle%20Pixel%20Rocket%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentMoonDistance, currentSunDistance, checkingRocketDistance = false;

	const doRocketStuff = () => {
		const oldModalsFunction = Modals.open_send_rocket_dialogue;

		Modals.open_send_rocket_dialogue = (moonDistance, sunDistance) => {
			console.log('dists: ', moonDistance, sunDistance)

			if (currentMoonDistance != moonDistance) {
				currentMoonDistance = moonDistance;
				const moonLabel = document.querySelector('#notification-moon_distance-label');
				moonLabel.innerText = ` ${Number(currentMoonDistance).toLocaleString()} KM`;
				moonLabel.parentElement.style.display = "inline-block";
			}
			if (currentSunDistance != sunDistance) {
				currentSunDistance = sunDistance;
				const sunLabel = document.querySelector('#notification-sun_distance-label')
				sunLabel.innerText = ` ${Number(currentSunDistance).toLocaleString()} KM`;
				sunLabel.parentElement.style.display = "inline-block";
			}

			if (!checkingRocketDistance) {
				oldModalsFunction(moonDistance, sunDistance);
			} else {
				checkingRocketDistance = false;
			}
		}

		addRocketNotifications('moon');
		addRocketNotifications('sun');

		checkRocketDist();

		const rocketStuffInterval = setInterval(checkRocketDist, 3000);
	}

	const checkRocketDist = () => {
		if(Items.getItem('rocket_km') > 0) {
			document.querySelector('#notification-moon_distance').style.display = "none";
			document.querySelector('#notification-sun_distance').style.display = "none";
			return;
		}
		checkingRocketDistance = true;
		websocket.send('CLICKS_ROCKET=0');
	};

	const addRocketNotifications = (label) => {
		const notifDiv = document.createElement('div');
		notifDiv.id = `notification-${label}_distance`;
		notifDiv.className='notification hover';
		notifDiv.style='margin-right: 10px; display: none';

		const notifIcon = document.querySelector(`img[title="${label}"]:not([id*="label"])`);
		notifIcon.className = 'w20'

		const notifDivLabel = document.createElement('span');
		notifDivLabel.id = `notification-${label}_distance-label`;
		notifDivLabel.innerText = ' Loading... ';
		notifDivLabel.className = 'color-white'

		notifDiv.onclick = () => {
			navigator.clipboard.writeText(`${label} distance: ${notifDivLabel.innerText}`);
		}

		notifDiv.append(notifIcon, notifDivLabel)
		document.querySelector('#notifications-area').prepend(notifDiv)
	}


	const doingRocketStuff = setInterval(()=>{
		if(websocket.connected_socket.readyState == 1) {
			clearInterval(doingRocketStuff);
			doRocketStuff();
		}
	}, 100)
})();