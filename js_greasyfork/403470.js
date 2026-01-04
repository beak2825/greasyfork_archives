// ==UserScript==
// @name        Disney toggle play/pause
// @namespace   urn://https://www.georgegillams.co.uk/greasemonkey/disney_plus_play_pause
// @include     *disneyplus.com*
// @exclude     none
// @version     2
// @description:en	Allows you to play/pause disney plus by pressing `space` on your keyboard
// @grant    		none
// @description Allows you to play/pause disney plus by pressing `space` on your keyboard
// @downloadURL https://update.greasyfork.org/scripts/403470/Disney%20toggle%20playpause.user.js
// @updateURL https://update.greasyfork.org/scripts/403470/Disney%20toggle%20playpause.meta.js
// ==/UserScript==

function addListener() {
  document.addEventListener('keypress', function(event) {
    if (event.keyCode === 32) {
      document.getElementsByClassName('btm-media-client-element')[0].click();
    }
  });
}

addListener();
