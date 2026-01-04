// ==UserScript==
// @name        add video hotkeys
// @namespace   Violentmonkey Scripts
// @match       https://www.olympics.com/*/video/*
// @grant       none
// @version     1.0
// @author      kirinyaga
// @description 16/06/2025 18:01:17
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539648/add%20video%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/539648/add%20video%20hotkeys.meta.js
// ==/UserScript==

wrapper = null;
player = null;

function setup() {
  wrapper = document.getElementsByClassName('b2p-video--outer')[0];
  player = THEOplayer.players[0];
}

/*function togglePlay() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}*/

function rewind() {
  player.currentTime -= 5; //Subtracts 5 seconds
}

function forward() {
  player.currentTime += 5; //Adds 5 seconds
}

function increaseVolume() {
  player.volume = Math.min(player.volume + 0.05, 1); //Increases volume by 5%
}

function decreaseVolume() {
  player.volume = Math.max(player.volume - 0.05, 1); //Lowers volume by 5%
}

function toggleFullScreen() {
  if (player.presentation.currentMode === 'fullscreen') {
    player.presentation.requestMode('inline');
  } else {
    player.presentation.requestMode('fullscreen');
  }
}

function toggleMute() {
  player.muted = !player.muted;
}

function preventStandardHotKeyActions(event) {
  event.stopPropagation();
  event.preventDefault();
}

function getPressedKey(event) {
  const pressedKey = event.key;
  let action;
  switch (pressedKey) {
/*    case ' ':
      action = togglePlay(); //Pauses or Unpauses with Space
      break;
*/    case 'ArrowLeft':
      action = rewind(); //Rewinds the video with the Left Arrow Key
      break;
    case 'ArrowRight':
      action = forward(); //Forwards the video with the Right Arrow Key
      break;
    case 'ArrowUp':
      action = increaseVolume(); //Increases volume with the Up Arrow Key
      break;
    case 'ArrowDown':
      action = decreaseVolume(); //Lowers volume with the Down Arrow Key
      break;
    case 'f':
      action = toggleFullScreen(); //Toggle Fullscreen mode with the 'F' Key
      break;
    case 'm':
      action = toggleMute(); //Toggle Mute with the 'M' Key
      break;
  }
  if (action && pressedKey !== 'Control' && pressedKey !== 'Alt' && pressedKey !== 'Shift') {
    action();
    preventStandardHotKeyActions(event); //Stops the default key behavior like jumping the page with space.
  }
}

function playerFocused() {
  if (wrapper.contains(document.activeElement)) {
    document.addEventListener('keydown', getPressedKey);
  } else {
    document.removeEventListener('keydown', getPressedKey);
  }
}

function mouseInPlayer() {
  //Checks if the mouse is inside the player wrapper area
  document.addEventListener('keydown', getPressedKey);
  wrapper.addEventListener('mouseleave', mouseOutPlayer);
}

function mouseOutPlayer() {
  //Checks if the mouse leaves the player wrapper area
  wrapper.removeEventListener('mouseleave', mouseOutPlayer);
  document.removeEventListener('keydown', getPressedKey);
}

function enableShortcuts(method) {
  setup();
  switch (method) {
    case 'mouseOver': //If the param reads 'mouseOver' shortcuts are only enabled when the mouse is inside of the player.
      wrapper.addEventListener('mouseenter', mouseInPlayer);
      break;
    case 'playerFocused': //If the param reads 'playerFocused' shortcuts are only enabled when the player is focused.
      document.addEventListener('focus', playerFocused, true);
      break;
    default:
      document.addEventListener('keydown', getPressedKey); //Else player shortcuts are always enabled.
  }
}

function activateHack() {
  console.log('enabling shortcuts ...');
  //enableShortcuts('mouseOver');    //Enable player shortcuts only when mouse inside the player area.
  enableShortcuts(); //Always enable shortcuts.
  console.log(`shortcuts enabled (${player}).`);
}

setTimeout(activateHack,10000);
