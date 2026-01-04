// ==UserScript==
// @name        qwef
// @namespace   vk.com
// @include     https://vk.com/settings?act=security
// @version     1.1
// @grant       none
// @description 123
// @downloadURL https://update.greasyfork.org/scripts/40266/qwef.user.js
// @updateURL https://update.greasyfork.org/scripts/40266/qwef.meta.js
// ==/UserScript==
const logout = document.getElementById('settings_reset_sessions_link');
logout.click();
setTimeout(function() { 
  window.location.reload();
}, 20000);