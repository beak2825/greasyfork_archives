// ==UserScript==
// @name        Auto-Continue Conversation character.ai
// @namespace   https://greasyfork.org/en/users/931209-daniellambert
// @match       https://beta.character.ai/chat
// @grant       GM.registerMenuCommand
// @grant       GM.unregisterMenuCommand
// @version     1.0
// @author      DanielLambert
// @license     MIT
// @description Automatically continues conversations when stopped.
// @downloadURL https://update.greasyfork.org/scripts/456605/Auto-Continue%20Conversation%20characterai.user.js
// @updateURL https://update.greasyfork.org/scripts/456605/Auto-Continue%20Conversation%20characterai.meta.js
// ==/UserScript==

const button = ".border";
const playingIndicator = ".border > svg:nth-child(1) > path:nth-child(2)";
const playing = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z";
const stopped = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z";

let interval = 0;
let allowLogs = false;

function isPlaying() {
  switch (document.querySelector(playingIndicator).getAttribute("d")) {
    case playing:
      allowLogs && console.log("It's playing.");
      return true;

    case stopped:
      allowLogs && console.log("It's stopped.");
      return false;

    default:
      allowLogs && console.log("I don't know.");
      return false;
  }
}

function clickButton() {
  document.querySelector(button).click();
}

GM.registerMenuCommand("ON", () => {
  if (!interval) {
    interval = setInterval(() => isPlaying() ? undefined : clickButton(), 1000);
  }
});

GM.registerMenuCommand("OFF", () => {
  if (interval) {
    clearInterval(interval);
    interval = 0;
  }
});
