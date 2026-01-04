// ==UserScript==
// @name         FlashNickname
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!!
// @author       Ody
// @license      MIT
// @match        http://62.68.75.115:90/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447493/FlashNickname.user.js
// @updateURL https://update.greasyfork.org/scripts/447493/FlashNickname.meta.js
// ==/UserScript==
 setInterval(() => {       document.getElementById("setGoldNickname").click();
    },100);