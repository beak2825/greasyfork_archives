// ==UserScript==
// @name        Twitch Points Autoclicker
// @namespace   33kk
// @match       *://*.twitch.tv/*
// @grant       none
// @version     1.0
// @author      33kk
// @description Clicks points chest when it appears
// @downloadURL https://update.greasyfork.org/scripts/395896/Twitch%20Points%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/395896/Twitch%20Points%20Autoclicker.meta.js
// ==/UserScript==

setInterval(()=>{
  let e = document.querySelector(".community-points-summary .tw-button--success");
  if (e !== undefined)
   e.click()
}, 5000);