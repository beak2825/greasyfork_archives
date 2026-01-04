// ==UserScript==
// @name         Delete Hola VPN Banners
// @namespace    http://tampermonkey.net/
// @description  Delete VPN banners from Hola VPN
// @match        *://*/*
// @grant        none
// @version      1.1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491498/Delete%20Hola%20VPN%20Banners.user.js
// @updateURL https://update.greasyfork.org/scripts/491498/Delete%20Hola%20VPN%20Banners.meta.js
// ==/UserScript==

setTimeout(() => {
  const vpnIframe = document.getElementById('_hola_popup_iframe__');
  if (vpnIframe) {
    vpnIframe.remove();
  }

  const vpnElements = document.querySelectorAll('#_hola_popup_iframe__, .tooltip_arrow___tooltip-module, .tooltip_body___tooltip-module');
  vpnElements.forEach(element => {
    element.remove();
  });
}, 200); // 0.2 second delay