// ==UserScript==
// @name        Nonstop youtube
// @namespace   http://samuelaraujo.pt
// @match       https://www.youtube.com/watch*
// @grant       none
// @version     3.0
// @author      Samuel Araújo
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @description Removes de youtube autopause popup and play without stop (good for music)
// @downloadURL https://update.greasyfork.org/scripts/489717/Nonstop%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/489717/Nonstop%20youtube.meta.js
// ==/UserScript==


     

const KEY_CODE = 33;

const KEY_PRESS_INTERVAL = 10000;


function pressKey() {
  document.dispatchEvent(new KeyboardEvent('keydown', {
    keyCode: KEY_CODE,
  }));
}

setInterval(pressKey, KEY_PRESS_INTERVAL);
