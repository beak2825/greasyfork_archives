// ==UserScript==
// @name         AutoClicker for Cookie Clicker
// @namespace    http://tampermonkey.net/
// @license      sovietarctic777@outlook.com
// @version      0.0.1
// @description  A simple script for cookie clicker that will autoclick cookies for you
// @author       You
// @match        http://sunset-nova-group.glitch.me/
// @match        https://orteil.dashnet.org/cookieclicker/
// @match        https://eli-schwartz.github.io/cookieclicker/
// @match        https://cookieclickercity.com/
// @match        https://sites.google.com/site/unblockedgames66ez/cookie-clicker
// @match        https://trixter9994.github.io/Cookie-Clicker-Source-Code/
// @match        https://www.tynker.com/community/projects/play/cookie-clicker-2/59a2f5655ae0295c7e8b4582/
// @match        https://watchdocumentaries.com/cookie-clicker-game/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459618/AutoClicker%20for%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/459618/AutoClicker%20for%20Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var autoclicker = setInterval(function(){
  try {
    Game.lastClick -= 1000;
    document.getElementById('bigCookie').click();
  } catch (err) {
    console.error('Stopping auto clicker');
    clearInterval(autoclicker);
  }
}, 1);
    //Turn off the autoclicker
    onkeydown = function(e) {
        clearInterval(autoclicker);
    }
})();