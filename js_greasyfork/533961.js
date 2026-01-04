// ==UserScript==
// @name        NoAge PornHub
// @author      Maxsior / MaxSkull
// @description Remove age verification on PornHub
// @description:ru Удалить проверку возраста на PornHub
// @match       *://*.pornhub.com/*
// @match       *://*.pornhub.org/*
// @version     0.6.4
// @grant       none
// @icon        https://bi.phncdn.com/www-static/favicon.ico?cache=12345678
// @namespace   NoAge_PornHub
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533961/NoAge%20PornHub.user.js
// @updateURL https://update.greasyfork.org/scripts/533961/NoAge%20PornHub.meta.js
// ==/UserScript==

function rem() {
  var elem = document.getElementById('age-verification-container');
  if (elem) {
    elem.style.display = "none";
    document.getElementById('age-verification-wrapper').style.display = "none";
  }
  else
    document.getElementById('verifyAgeWrapper').style.display = "none";
}

window.addEventListener("DOMContentLoaded", rem);

rem();
