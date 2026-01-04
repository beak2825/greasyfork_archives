// ==UserScript==
// @name        CubeCraft L/M Ratio
// @namespace   de.rasmusantons
// @description Add Likes per Message ratio
// @include     https://www.cubecraft.net/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/379339/CubeCraft%20LM%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/379339/CubeCraft%20LM%20Ratio.meta.js
// ==/UserScript==

let int = (s) => parseInt(s.replace(/[, ]/g, ''));

let infos = document.getElementsByClassName('extraUserInfo');
for (let i = 0; i < infos.length; ++i) {
  let e = infos[i];
  let m = int(e.children[0].children[1].innerText);
  let l = int(e.children[1].children[1].innerText);
  let n = e.children[1].cloneNode(true);
  n.children[0].innerHTML = 'Likes per Message:';
  n.children[1].innerHTML = (l / m).toFixed(2);
  e.insertBefore(n, e.children[2]);
}