// ==UserScript==
// @name        NoAge Pornhub
// @author      Maxsior / MaxSkull
// @description Remove age verification on PornHub
// @description:ru Удалить проверку возраста на PornHub
// @match       https://*.pornhub.com/*
// @version     0.6
// @grant       none
// @icon        https://bi.phncdn.com/www-static/favicon.ico?cache=12345678
// @namespace   NoAge_Pornhub
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478131/NoAge%20Pornhub.user.js
// @updateURL https://update.greasyfork.org/scripts/478131/NoAge%20Pornhub.meta.js
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
