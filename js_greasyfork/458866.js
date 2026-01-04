// ==UserScript==
// @namespace   https://github.com/samlikins
// @name        Quora notifications highlight QPG
// @description Highlight notifications of Questions from QPG (Quora Prompt Generator)
// @copyright   2023, Sam Likins
// @license     MIT
// @version     0.1.0
// @author      SamLikins
// @match       https://www.quora.com/notifications
// @grant       none
// @icon        https://qph.cf2.quoracdn.net/main-thumb-1810913343-200-lcqfzpxjsiwdsmyqarcuftxozfbtwxvr.jpeg
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/458866/Quora%20notifications%20highlight%20QPG.user.js
// @updateURL https://update.greasyfork.org/scripts/458866/Quora%20notifications%20highlight%20QPG.meta.js
// ==/UserScript==

console.log('* Greasemonkey Loaded: Quora notifications highlight QPG');

(window.onscrollend = function () {
  [...document.querySelectorAll('img[alt="Profile photo for Quora Prompt Generator"]')].map(e => {
    e.closest('div[id^=notif-item-]').closest(':not([class])').style.borderLeft = "3px solid red";
    e.closest(':not([class])').querySelector('.qu-cursor--pointer').style.backgroundColor = "rgba(127,0,0,0.25)";
  });
})();
