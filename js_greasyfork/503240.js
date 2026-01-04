// ==UserScript==
// @name         Disable Alert (lmsys)
// @version      0.1
// @namespace    72c4a849-b3d8-4fae-b2c9
// @license      MIT
// @description  Prevents alert popup on chat.lmsys.org
// @include      https://chat.lmsys.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503240/Disable%20Alert%20%28lmsys%29.user.js
// @updateURL https://update.greasyfork.org/scripts/503240/Disable%20Alert%20%28lmsys%29.meta.js
// ==/UserScript==
window.alert = function() {};