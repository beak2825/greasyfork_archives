// ==UserScript==
// @name        istanbul-life.info - Restore controls (RMB, keys, select)
// @namespace   Violentmonkey Scripts
// @match       https://istanbul-life.info/*
// @grant       none
// @version     1.0
// @author      OnkelTem
// @description 7/19/2022, 1:14:02 PM
// @downloadURL https://update.greasyfork.org/scripts/448110/istanbul-lifeinfo%20-%20Restore%20controls%20%28RMB%2C%20keys%2C%20select%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448110/istanbul-lifeinfo%20-%20Restore%20controls%20%28RMB%2C%20keys%2C%20select%29.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
  document.oncontextmenu = undefined;
  document.onkeydown = undefined;
  document.onselectstart = undefined;
  document.onmousedown = undefined;
  document.body.onselectstart = undefined;
  
  document.body.style = undefined;
  document.body.classList.remove("unselectable");
  document.documentElement.style.userSelect = 'inherit';
});

