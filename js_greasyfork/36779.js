// ==UserScript==
// @name        'Autoplay Sergey Videos v3
// @icon        https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @description Autoplays Embedded Sergey Videos
// @author      LLL
// @namespace   LLL Can Code
// @include     https://www.youtube.com/embed/*
// @include     https://*www.youtube.com/embed?*
// @version     3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36779/%27Autoplay%20Sergey%20Videos%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/36779/%27Autoplay%20Sergey%20Videos%20v3.meta.js
// ==/UserScript==

if (document.referrer.indexOf('mturk') >= 0) {
  document.querySelector(".ytp-large-play-button").click();
  document.querySelector(".ytp-play-button").click();
  document.querySelector(".ytp-play-button").click();

}