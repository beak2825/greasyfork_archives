// ==UserScript==
// @name          Twitch Bonus clicker
// @namespace     randomecho.com
// @description   Click the bonus icon
// @include       https://www.twitch.tv/*
// @grant         none
// @copyright     2020 Soon Van
// @author        Soon Van - randomecho.com
// @license       http://opensource.org/licenses/BSD-3-Clause
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/399192/Twitch%20Bonus%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/399192/Twitch%20Bonus%20clicker.meta.js
// ==/UserScript==

let bonusPoints = 50;
let bonusPointsTotal = 0;

function clickBonusIcon() {
  let bonusIcon = document.getElementsByClassName('claimable-bonus__icon');
  if (!bonusIcon) {
      return;
  }

  let allBonus = Array.prototype.slice.call(bonusIcon);

  if (allBonus.length) {
    allBonus[0].click();
    bonusPointsTotal += bonusPoints;
    console.log('Earned ' +bonusPoints+ ' bonus points for a running total of '+bonusPointsTotal)
  }
}

function readyFire() {
  setInterval(function() {clickBonusIcon()}, 30000);
}

window.onload = readyFire();
