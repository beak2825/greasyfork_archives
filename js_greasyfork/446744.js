// ==UserScript==
// @name        Disable Javascript After 5 Seconds
// @namespace   Violentmonkey Scripts
// @description Disables javascript on site after 5 seconds.
// @grant       none
// @version     1.0
// @include     *example.com*
// @author      -
// @description 19/06/2022 14:30:47
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/446744/Disable%20Javascript%20After%205%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/446744/Disable%20Javascript%20After%205%20Seconds.meta.js
// ==/UserScript==


setTimeout(function(){ document.body.innerHTML = document.body.innerHTML; }, 5000);