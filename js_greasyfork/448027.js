// ==UserScript==
// @name         Twitch Point Bonus Clicker
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Click Twitch Point Bonus button automatically
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448027/Twitch%20Point%20Bonus%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/448027/Twitch%20Point%20Bonus%20Clicker.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(() => {
  "use strict";
  const click = (selector) => {
    const target = document.querySelector(selector);
    if(target === null || target.getAttribute('onclick') == null){
      return false;
    }
    target.click();
    return true;
  };
  const check = () => {
    const res = click('button[aria-label="Claim Bonus"]');
    if(!res){
      click('div[class="Layout-sc-nxg1ff-0 Aqzax"]');
    }
  };
  setInterval(check, 1000);
})();
