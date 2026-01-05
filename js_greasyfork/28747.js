// ==UserScript==
// @name         MOS-cow
// @namespace
// @version      0.6
// @description  fix timeout dialog in support.oracle.com
// @author       timur.akhmadeev@gmail.com
// @match        https://support.oracle.com/*
// @match        https://mosemp.us.oracle.com/*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/28747/MOS-cow.user.js
// @updateURL https://update.greasyfork.org/scripts/28747/MOS-cow.meta.js
// ==/UserScript==
(function() {
  setInterval(() => {
    window.dispatchEvent(new CustomEvent('refreshVBAccessToken'));
  }, 19 * 60 * 1000);
})();