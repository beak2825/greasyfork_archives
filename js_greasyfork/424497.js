// ==UserScript==
// @name        Splix.IO - Zoom In/Out | Zoom Hack
// @namespace   armagan.rest
// @match       https://splix.io/
// @grant       none
// @version     0.1.0
// @author      Kıraç Armağan Önal
// @description This user script allows you to easy zoom and zoom out using your scroll wheel in Splix.IO!
// @downloadURL https://update.greasyfork.org/scripts/424497/SplixIO%20-%20Zoom%20InOut%20%7C%20Zoom%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/424497/SplixIO%20-%20Zoom%20InOut%20%7C%20Zoom%20Hack.meta.js
// ==/UserScript==

function setConstantValue(key, value) {
  Object.defineProperty(window, key, { configurable: false, writable: false, value });
}

setConstantValue("BLOCKS_ON_SCREEN", 1100*4);

window.addEventListener("DOMContentLoaded", ()=>{
  const beginScreen = document.querySelector("#beginScreen");
  function isInGame() {
    return beginScreen.getAttribute("style")?.includes("display: none");
  }
  
  document.addEventListener("mousewheel", (e)=>{
    if (!isInGame()) return;
    let isUp = e.wheelDeltaY > 1;
    
    if (isUp) {
      if (window.MAX_ZOOM < 720) window.MAX_ZOOM += 20;
    } else {
      if (window.MAX_ZOOM > 120) window.MAX_ZOOM -= 20;
    }
  })
})


