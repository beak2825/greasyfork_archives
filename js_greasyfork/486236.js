// ==UserScript==
// @name         telegram 速連2
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  telegram code block 中的 url 轉為超連結
// @author       Bee10301
// @match        https://web.telegram.org/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.telegram.org
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486236/telegram%20%E9%80%9F%E9%80%A32.user.js
// @updateURL https://update.greasyfork.org/scripts/486236/telegram%20%E9%80%9F%E9%80%A32.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    window.onload = () => {
    document.addEventListener("click", (event) => {
        const target = event.target;
        if (target.matches("code.text-entity-code.clickable")&& target.innerHTML.match(/(https?:\/\/[^\s]+)/)[0]) {
          window.open(`${target.innerHTML}`, "_blank");
        }
      });
  };

})();