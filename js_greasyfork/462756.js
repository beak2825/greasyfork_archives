// ==UserScript==
// @name             Envato skip iframe
// @description      Skip preview iframe on themeforest.net and codecanyon.net
// @match            *://preview.themeforest.net/item/*
// @match            *://preview.codecanyon.net/item/*
// @version          1.0.1
// @run-at           document-end
// @license          MIT
// @namespace https://greasyfork.org/users/1049310
// @downloadURL https://update.greasyfork.org/scripts/462756/Envato%20skip%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/462756/Envato%20skip%20iframe.meta.js
// ==/UserScript==

window.location.replace(
  document.getElementsByTagName("iframe")[0].src
);