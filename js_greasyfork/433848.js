// ==UserScript==
// @name         Auto Reload on Stake.com - LATEST UPDATE 2023 WORKS FOREVER
// @description  Automatic reloads every 10 minutes. updated for latest Stake website. Will work forever!
// @author       elate
// @version      2023.14.23
// @match        https://stake.com/*
// @match        https://stake.com/casino/home?tab=reload&modal=vip&currency=*
// @match        https://stake.com/?tab=reload&modal=vip&currency=*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/824858
// @downloadURL https://update.greasyfork.org/scripts/433848/Auto%20Reload%20on%20Stakecom%20-%20LATEST%20UPDATE%202023%20WORKS%20FOREVER.user.js
// @updateURL https://update.greasyfork.org/scripts/433848/Auto%20Reload%20on%20Stakecom%20-%20LATEST%20UPDATE%202023%20WORKS%20FOREVER.meta.js
// ==/UserScript==

setInterval(function() {
  window.location.replace("https://stake.com/?tab=reload&modal=vip&currency=btc")
}, 25000)

setInterval(function() {
document.querySelectorAll("button[type='submit']")[0].click()
}, 1500)

