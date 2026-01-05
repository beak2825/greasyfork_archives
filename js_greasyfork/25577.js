// ==UserScript==
// @name         Disable Snow
// @namespace    https://epicmafia.com
// @version      0.1
// @description  Disables Snow on Epicmafia - Bah-Humbug
// @author       Eris
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25577/Disable%20Snow.user.js
// @updateURL https://update.greasyfork.org/scripts/25577/Disable%20Snow.meta.js
// ==/UserScript==

(function() {
     window.snowStorm.stop();
})();