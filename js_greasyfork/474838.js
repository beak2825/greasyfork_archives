// ==UserScript==
// @name         st
// @description  stk only window no click
// @author       kk
// @version      2023.14.23
// @match        https://stake.us/*
// @match        https://stake.us/casino/home?tab=dailyBonus&currency=*
// @match        https://stake.us/?tab=dailyBonus&currency=*
// @run-at       document-idle
// @namespace lol
// @downloadURL https://update.greasyfork.org/scripts/474838/st.user.js
// @updateURL https://update.greasyfork.org/scripts/474838/st.meta.js
// ==/UserScript==

setInterval(function() {
  window.location.replace("https://stake.us/?tab=dailyBonus&currency=btc&modal=wallet")
}, 3600000)

