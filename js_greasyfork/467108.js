// ==UserScript==
// @name         BloxFlip Rain Notification
// @name:ru      BloxFlip Уведомление на дожди
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Makes a sound when rain
// @description:ru  Издает звук когда начинается дождь
// @author       HProgram
// @match        https://bloxflip.com/*
// @icon         https://i.imgur.com/U8U9VYV.png
// @license GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/467108/BloxFlip%20Rain%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/467108/BloxFlip%20Rain%20Notification.meta.js
// ==/UserScript==

// Discord: Serzh1204#9186

let isRaining = false;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function playSound() {
  let audio = new Audio('https://www.myinstants.com/media/sounds/bepbob.mp3');
audio.muted = true;
sleep(1000);
audio.muted = false;
  audio.play();
}


setInterval(async function() {
  let history = await fetch('https://api.bloxflip.com/chat/history');
  let historyJson = JSON.parse(await history.text());

  if (historyJson.rain.active && !isRaining) {
    playSound();
    isRaining = true;
  } else if (!historyJson.rain.active && isRaining) {
    isRaining = false;
  }
}, 5000);