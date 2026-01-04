// put your favorite channel names here
const favorites = [
  "my-favorite-channel",
  "another-important-channel",
];


// ==UserScript==
// @name         pin discord channels
// @description  Implements pin/start/favorite channel functionality for Discord by displaying your favorite channels on top
// @match        https://discord.com/*
// @namespace    https://github.com/karlicoss/pin-discord-channels
// @grant        none
// @version      1
// @downloadURL https://update.greasyfork.org/scripts/415092/pin%20discord%20channels.user.js
// @updateURL https://update.greasyfork.org/scripts/415092/pin%20discord%20channels.meta.js
// ==/UserScript==

/*
  It's kinda crazy that this feature is not there, I'm not sure how people manage to keep up with Discord otherwise..
  https://support.discord.com/hc/en-us/community/posts/360050321111-Favorite-channels-folder-server
  https://support.discord.com/hc/en-us/community/posts/360032455752-Star-pin-prioritize-channels-in-server
*/


// parent selector for the channels
const selector = 'div[id="channels"] div';


function run() {
  const parent = document.querySelector(selector);
  const key = (el) => favorites.includes(el.textContent);

  const channels = [...parent.children];
  channels.sort((a, b) => key(a) < key(b));

  for (let c of parent.children) {
      parent.removeChild(c);
  }
  for (let c of channels) {
      parent.appendChild(c);
  }
}

setInterval(run, 5000) // execute periodially to make sure changes persist