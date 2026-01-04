// ==UserScript==
// @name         Bot
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  MINI Bot to MPP
// @author       deorema33- doomka
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include*://piano.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453143/Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/453143/Bot.meta.js
// ==/UserScript==

const options = {
  // Client / User
  "uri": "ws://www.multiplayerpiano.com/", // This usually is not required unless you want to change the internal connection URL.
  "proxy": "http://192.168.0.1:3123/", // This is where you'd include the proxy for this specific client. Your proxy MUST be HTTPS, but you use an HTTP url due to compatability issues with MPP.
  // User ONLY
  "name": "bheese", // Sets the name when the bot becomes ready (user.on("ready"))
  "channel": "BheeseThing" // Set the initial channel when the bot is created.
};
const user = new User(options);
user.on("ready", () => {
  // Client created and connected.
});
user.connect();