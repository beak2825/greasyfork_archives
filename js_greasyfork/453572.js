// ==UserScript==
// @name        Crunchyroll Speed Switcher
// @namespace   https://greasyfork.org/en/users/931209-daniellambert
// @match       https://www.crunchyroll.com/watch/*
// @match       https://static.crunchyroll.com/vilos-v2/web/vilos/player.html
// @grant       GM.registerMenuCommand
// @version     1.0
// @author      DanielLambert
// @license     MIT
// @description This allows the speed of Crunchyroll videos to be changed by buttons under the userscript manager menu.
// @downloadURL https://update.greasyfork.org/scripts/453572/Crunchyroll%20Speed%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/453572/Crunchyroll%20Speed%20Switcher.meta.js
// ==/UserScript==

function changeSpeed(x) {
  document.querySelector(".video-player").contentWindow.postMessage({speed: x}, 'https://static.crunchyroll.com');
}

if (window.top === window.self) {
  GM.registerMenuCommand("1x speed", () => {
    changeSpeed(1);
  });
  GM.registerMenuCommand("2x speed", () => {
    changeSpeed(2);
  });
  GM.registerMenuCommand("3x speed", () => {
    changeSpeed(3);
  });
  GM.registerMenuCommand("4x speed", () => {
    changeSpeed(4);
  });
} else {
  window.addEventListener("message", (event) => {
    if (event.data.speed) {
      document.querySelector("#player0").playbackRate = event.data.speed;
    }
  }, false);
}
