// ==UserScript==
// @name        *DEPRECATED* CubeCraft Rank Badges
// @namespace   de.rasmusantons
// @include     https://www.cubecraft.net/*
// @description Changes the way rank badges are displayed on the Cubecraft Forum. *DEPRECATED*: Use this instead https://userstyles.org/styles/156439/cubecraft-rank-badges
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39028/%2ADEPRECATED%2A%20CubeCraft%20Rank%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/39028/%2ADEPRECATED%2A%20CubeCraft%20Rank%20Badges.meta.js
// ==/UserScript==

for (let e of document.getElementsByClassName('mcPlayerMessage')) {
  let badgeColor = 'rgba(0, 0, 0, .3125)';
  if (e.classList.contains('withGroup')) {
    let playerData = e.getElementsByClassName('playerData')[0];
    let playerRank = playerData.getElementsByClassName('playerRank')[0];
    let groupBadge = playerRank.getElementsByClassName('group-badge')[0];
    let rgbValues = groupBadge.style.backgroundColor.match(/\d+/g);
    badgeColor = 'rgba(' + rgbValues[0] + ', ' + rgbValues[1] + ', ' + rgbValues[2] + ', .3125)';
    playerRank.removeChild(groupBadge);
    e.classList.remove('withGroup');
  }
  e.style.backgroundColor = badgeColor;
}