// ==UserScript==
// @name         LauncherHack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blocks the ad popup on launcher leaks
// @author       AA034
// @match        https://launcherleaks.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=launcherleaks.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471739/LauncherHack.user.js
// @updateURL https://update.greasyfork.org/scripts/471739/LauncherHack.meta.js
// ==/UserScript==
setInterval(function() {
  document.getElementsByClassName('ipsApp ipsApp_front ipsJS_has ipsClearfix ipsApp_noTouch swal2-shown swal2-height-auto ipsLayout_sidebarUsed pace-done pace-done')[0].className = 'ipsApp ipsApp_front ipsJS_has ipsClearfix ipsApp_noTouch swal2-height-auto ipsLayout_sidebarUsed pace-done pace-done'
  document.getElementsByClassName('swal2-container swal2-center swal2-backdrop-show')[0].remove()
}, 300);
