// ==UserScript==
// @name         MelvorIdle Crop Grown Alert
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://melvoridle.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404483/MelvorIdle%20Crop%20Grown%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/404483/MelvorIdle%20Crop%20Grown%20Alert.meta.js
// ==/UserScript==

(function () {
  let intervalId;

  document.addEventListener('mouseover', activate);

  // util
  function makeNotifycation(msg = 'Your crop has grown') {
    new Notification("Crop Grown Alert", {
      body: msg,
      icon: '/assets/media/skills/farming/farming.svg'
    });
  }

  // main
  function activate() {
    // Check if notifycation is available on the browser
    if (!('Notification' in window)) {
      alert('This browser does not support notification');
      return;
    }
    else {
      console.log('Script: MelvorIdle Crop Grown Alert activated')
    }

    // Ensure notifycation permission
    if (Notification.permission === 'default' || Notification.permission === 'undefined') {
      Notification.requestPermission((permission) => {
        if (permission === 'denied') {
          alert('You have grant the permission to receive notifycation');
        }
      });
    }

    // Check grown state every 5 second
    let lastState = [];
    for (const area of newFarmingAreas) {
      lastState.push(Array(area.patches.length).fill(false))
    }

    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = setInterval(() => {
      const newState = newFarmingAreas.map((area) => {
        return area.patches.map((patch) => patch.hasGrown);
      })

      for (let i = 0; i < lastState.length; i++) {
        for (let j = 0; j < lastState[i].length; j++) {
          if (lastState[i][j] < newState[i][j]) {
            makeNotifycation();
            console.log('notify')
            lastState = newState;
            return;
          }
        }
      }
      lastState = newState;
    }, 5000)

    document.removeEventListener('mouseover', activate)
  }
})();