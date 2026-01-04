// ==UserScript==
// @name         Remove Neopass Reminder
// @namespace    http://neopat.ch
// @license      GNU GPLv3
// @version      2024-03-27
// @description  Removes NeoPass Reminder
// @author       Lamp
// @match        https://www.neopets.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490978/Remove%20Neopass%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/490978/Remove%20Neopass%20Reminder.meta.js
// ==/UserScript==

(function() {
   document.querySelector("#np_notice").remove();
})();