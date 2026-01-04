// ==UserScript==
// @name        Autoplay Sergey Videos v2
// @icon        http://mturkforum.com/image.php?u=79381&dateline=1464644104
// @namespace   https://greasyfork.org/en/users/155391-lll
// @description Autoplays Embedded Sergey Videos
// @author      LLL 
// @include     https://www.youtube.com/embed/*
// @include     https://*www.youtube.com/embed?*
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34123/Autoplay%20Sergey%20Videos%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/34123/Autoplay%20Sergey%20Videos%20v2.meta.js
// ==/UserScript==

if (document.referrer.indexOf('mturk') >= 0) {
  document.querySelector(".ytp-large-play-button").click();
      document.querySelector(".ytp-play-button").click();

}