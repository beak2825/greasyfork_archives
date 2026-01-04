// ==UserScript==
// @name         Countdown killer
// @namespace    https://zfdev.com/
// @version      0.1
// @description  Remove login page countdown
// @author       greendev
// @match        https://onlinebooking.sand.telangana.gov.in/Masters/Home.aspx
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387033/Countdown%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/387033/Countdown%20killer.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.getElementById("btnLogin").disabled = false;
  document.getElementById("btnLogin").style.display = 'Block';
  document.getElementById('lbltime').style.display = 'none';
  clearInterval(interval);
})();
