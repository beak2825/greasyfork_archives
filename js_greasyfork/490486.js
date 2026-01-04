// ==UserScript==
// @name         Auto Reload on Stake.com - LATEST UPDATE 2024 WORKS FOREVER
// @description  Automatic reloads every 10 minutes or less. updated for latest Stake website. Will work forever!
// @author       PassoLargoBR
// @version      2024.03.21
// @match        https://stake.com/*
// @match        https://stake.com/casino/home?tab=reload&modal=vip&currency=*
// @match        https://stake.com/?tab=reload&modal=vip&currency=*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/824858
// @downloadURL https://update.greasyfork.org/scripts/490486/Auto%20Reload%20on%20Stakecom%20-%20LATEST%20UPDATE%202024%20WORKS%20FOREVER.user.js
// @updateURL https://update.greasyfork.org/scripts/490486/Auto%20Reload%20on%20Stakecom%20-%20LATEST%20UPDATE%202024%20WORKS%20FOREVER.meta.js
// ==/UserScript==

var currency = 'trx'; //currency to claim
currency = currency.toLowerCase();

setInterval(function() {
  window.location.replace("https://stake.com/?tab=reload&modal=vip&currency="+currency+"");
}, 60*1000); // 60 sec.

setInterval(function() {
  simulateMouseMove();
  document.querySelectorAll("button[type='submit']")[0].click();
}, 10*1000); // 10 sec.

function simulateMouseMove() {
    const simElm = window.document.documentElement;
    const simMouseMove = new Event('mousemove');
    simElm.dispatchEvent(simMouseMove);
}

